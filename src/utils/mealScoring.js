import { meals } from '../data/meals';
import { nutritionTotals } from './nutritionTotals';

const nutrientWeights = {
  calories: 1,
  protein: 8,
  carbs: 3,
  fat: 4,
  fiber: 3,
  calcium: 0.02,
  iron: 2,
  vitaminC: 0.5,
};

function matchesRestrictions(meal, dietaryRestrictions) {
  if (dietaryRestrictions.includes('vegetarian') && !meal.tags.includes('vegetarian')) {
    return false;
  }

  if (dietaryRestrictions.includes('dairy-free') && meal.allergens.includes('dairy')) {
    return false;
  }

  if (dietaryRestrictions.includes('nut-free') && meal.allergens.includes('nuts')) {
    return false;
  }

  if (dietaryRestrictions.includes('gluten-free') && meal.allergens.includes('gluten')) {
    return false;
  }

  return true;
}

/**
 * Scores a single meal plan by comparing total nutrients to user targets.
 * Inputs: total nutrition for a 3-meal plan and the user's target values.
 * Returns: a numeric score where lower is better.
 * Why it exists: meal combinations are compared against the same consistent scoring rule.
 *
 * Different nutrients use different units and magnitudes, so explicit weights
 * help normalize importance across calories, grams, and milligrams.
 */
export function scoreMealPlan(totalNutrition, targets) {
  let score = 0;

  Object.entries(nutrientWeights).forEach(([nutrient, weight]) => {
    const actualValue = totalNutrition[nutrient] ?? 0;
    const targetValue = targets[nutrient] ?? 0;
    const absoluteDifference = Math.abs(actualValue - targetValue);

    score += absoluteDifference * weight;
  });

  if (totalNutrition.sodium > targets.sodiumMax) {
    score += (totalNutrition.sodium - targets.sodiumMax) * 2;
  }

  return score;
}

/**
 * Finds the best meal plan for a user from the local meal database.
 * Inputs: the user's profile and the calculated nutrition targets.
 * Returns: the best plan object with meals, totals, and score, or an error state.
 * Why it exists: this function centralizes restriction filtering and combination scoring.
 */
export function getBestMealPlan(userProfile, targets) {
  const dietaryRestrictions = userProfile?.dietaryRestrictions ?? [];
  const validMeals = meals.filter((meal) =>
    matchesRestrictions(meal, dietaryRestrictions)
  );

  const breakfasts = validMeals.filter((meal) => meal.mealType === 'breakfast');
  const lunches = validMeals.filter((meal) => meal.mealType === 'lunch');
  const dinners = validMeals.filter((meal) => meal.mealType === 'dinner');

  if (breakfasts.length === 0 || lunches.length === 0 || dinners.length === 0) {
    return {
      meals: [],
      totals: null,
      score: null,
      error:
        'No complete meal plan found for the selected restrictions. Try removing one restriction.',
    };
  }

  let bestPlan = null;
  let bestScore = Number.POSITIVE_INFINITY;

  breakfasts.forEach((breakfast) => {
    lunches.forEach((lunch) => {
      dinners.forEach((dinner) => {
        const mealCombination = [breakfast, lunch, dinner];
        const totals = nutritionTotals(mealCombination);
        const score = scoreMealPlan(totals, targets);

        if (score < bestScore) {
          bestScore = score;
          bestPlan = {
            meals: mealCombination,
            totals,
            score,
            error: null,
          };
        }
      });
    });
  });

  return bestPlan;
}
