import foods from '../data/foods.json';
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

const TOP_K_PER_GROUP = 10;
const MEAL_TARGET_SCALE = 1 / 3;

function isNonVegetarianFood(food) {
  const category = (food?.originalCategory ?? '').toLowerCase();
  return (
    category.includes('meat') ||
    category.includes('fish') ||
    category.includes('seafood')
  );
}

function matchesRestrictions(food, dietaryRestrictions) {
  const allergens = food?.allergens ?? [];

  if (dietaryRestrictions.includes('vegetarian') && isNonVegetarianFood(food)) {
    return false;
  }

  if (dietaryRestrictions.includes('dairy-free') && allergens.includes('dairy')) {
    return false;
  }

  if (dietaryRestrictions.includes('nut-free') && allergens.includes('nuts')) {
    return false;
  }

  if (dietaryRestrictions.includes('gluten-free') && allergens.includes('gluten')) {
    return false;
  }

  return true;
}

function getFoodGroup(food) {
  const category = (food?.originalCategory ?? '').toLowerCase();

  if (category.includes('grain')) {
    return 'grain';
  }

  if (category.includes('fruit')) {
    return 'fruit';
  }

  if (category.includes('vegetable')) {
    return 'vegetable';
  }

  if (
    category.includes('protein') ||
    category.includes('meat') ||
    category.includes('fish') ||
    category.includes('seafood') ||
    category.includes('legume')
  ) {
    return 'protein';
  }

  return null;
}

function getMealTags(items) {
  const allergens = new Set();

  items.forEach((item) => {
    (item?.allergens ?? []).forEach((allergen) => allergens.add(allergen));
  });

  const tags = [];

  if (!items.some((item) => isNonVegetarianFood(item))) {
    tags.push('vegetarian');
  }

  if (!allergens.has('dairy')) {
    tags.push('dairy-free');
  }

  if (!allergens.has('nuts')) {
    tags.push('nut-free');
  }

  if (!allergens.has('gluten')) {
    tags.push('gluten-free');
  }

  return tags;
}

function buildMeal(mealType, items) {
  return {
    id: `${mealType}-${items.map((item) => item.id).join('-')}`,
    name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} combo`,
    mealType,
    ingredients: items.map((item) => ({
      name: item.name,
      amount: '1 serving',
    })),
    nutrition: nutritionTotals(items),
    tags: getMealTags(items),
  };
}

function scoreFoodItem(food, targets) {
  let score = 0;

  Object.entries(nutrientWeights).forEach(([nutrient, weight]) => {
    const actualValue = food?.nutrition?.[nutrient] ?? 0;
    const targetValue = (targets?.[nutrient] ?? 0) * MEAL_TARGET_SCALE;
    const absoluteDifference = Math.abs(actualValue - targetValue);

    score += absoluteDifference * weight;
  });

  if (targets?.sodiumMax) {
    const sodiumValue = food?.nutrition?.sodium ?? 0;
    const sodiumTarget = targets.sodiumMax * MEAL_TARGET_SCALE;

    if (sodiumValue > sodiumTarget) {
      score += (sodiumValue - sodiumTarget) * 2;
    }
  }

  return score;
}

function buildMealOptions(mealType, groupOrder, availableFoods, targets, topK) {
  const foodsForMealType = availableFoods.filter((food) =>
    (food.mealTypes ?? []).includes(mealType)
  );

  const groupedFoods = groupOrder.map((group) => {
    const foodsInGroup = foodsForMealType.filter((food) => getFoodGroup(food) === group);
    return foodsInGroup
      .map((food) => ({ food, score: scoreFoodItem(food, targets) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, topK)
      .map(({ food }) => food);
  });

  if (groupedFoods.some((group) => group.length === 0)) {
    return [];
  }

  const [groupA, groupB, groupC] = groupedFoods;
  const options = [];

  groupA.forEach((itemA) => {
    groupB.forEach((itemB) => {
      groupC.forEach((itemC) => {
        options.push(buildMeal(mealType, [itemA, itemB, itemC]));
      });
    });
  });

  return options;
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
export function getBestMealPlan(userProfile, targets, planIndex = 0) {
  const dietaryRestrictions = userProfile?.dietaryRestrictions ?? [];
  const validFoods = foods.filter((food) =>
    matchesRestrictions(food, dietaryRestrictions)
  );

  const breakfasts = buildMealOptions(
    'breakfast',
    ['protein', 'grain', 'fruit'],
    validFoods,
    targets,
    TOP_K_PER_GROUP
  );
  const lunches = buildMealOptions(
    'lunch',
    ['protein', 'grain', 'vegetable'],
    validFoods,
    targets,
    TOP_K_PER_GROUP
  );
  const dinners = buildMealOptions(
    'dinner',
    ['protein', 'grain', 'vegetable'],
    validFoods,
    targets,
    TOP_K_PER_GROUP
  );

  if (breakfasts.length === 0 || lunches.length === 0 || dinners.length === 0) {
    return {
      meals: [],
      totals: null,
      score: null,
      error:
        'No complete meal plan found for the selected restrictions. Try removing one restriction.',
    };
  }

  const cappedBreakfasts = breakfasts.slice(0, 20);
  const cappedLunches = lunches.slice(0, 20);
  const cappedDinners = dinners.slice(0, 20);

  const scoredPlans = [];

  cappedBreakfasts.forEach((breakfast) => {
    cappedLunches.forEach((lunch) => {
      cappedDinners.forEach((dinner) => {
        const mealCombination = [breakfast, lunch, dinner];
        const totals = nutritionTotals(mealCombination);
        const score = scoreMealPlan(totals, targets);

        scoredPlans.push({
          meals: mealCombination,
          totals,
          score,
          error: null,
        });
      });
    });
  });

  scoredPlans.sort((planA, planB) => planA.score - planB.score);

  if (scoredPlans.length === 0) {
    return {
      meals: [],
      totals: null,
      score: null,
      error: 'No complete meal plan could be scored from the current food data.',
    };
  }

  const safePlanIndex = Math.abs(planIndex) % scoredPlans.length;

  // Cycling through sorted plans makes the button deterministic and easy to explain.
  return scoredPlans[safePlanIndex];
}
