import { dietaryGuidelineRules } from '../data/dietaryGuidelineRules';

function getSafePercent(actualValue, targetValue) {
  if (!Number.isFinite(actualValue) || !Number.isFinite(targetValue) || targetValue <= 0) {
    return 0;
  }

  return actualValue / targetValue;
}

/**
 * Generates deterministic plain-language nutrition explanations.
 * Inputs: total plan nutrition, target values, and the best plan result.
 * Returns: an array of short explanation strings.
 * Why it exists: the app needs an explainable "AI-like" layer without runtime LLM use.
 */
export function generateInsights(totalNutrition, targets, bestPlan) {
  if (!bestPlan || bestPlan.error) {
    return [
      'No plan explanation is available because the selected restrictions removed at least one meal category.',
    ];
  }

  const insights = [
    'Meals were filtered by your dietary restrictions before any scoring happened.',
    'The final breakfast, lunch, and dinner combination was chosen by minimizing weighted nutrition error against your daily targets.',
  ];

  dietaryGuidelineRules.forEach((rule) => {
    if (rule.comparison === 'aboveMax') {
      const actualValue = totalNutrition?.[rule.nutrient] ?? 0;
      const maxValue = targets?.sodiumMax ?? 0;

      if (actualValue > maxValue) {
        insights.push(rule.message);
      }

      return;
    }

    const actualValue = totalNutrition?.[rule.nutrient] ?? 0;
    const targetValue = targets?.[rule.nutrient] ?? 0;
    const percentOfTarget = getSafePercent(actualValue, targetValue);

    if (rule.comparison === 'minPercent' && percentOfTarget >= rule.threshold) {
      insights.push(rule.message);
    }

    if (rule.comparison === 'maxPercent' && percentOfTarget < rule.threshold) {
      insights.push(rule.message);
    }
  });

  if (insights.length === 2) {
    insights.push(
      'Overall, this plan stays fairly balanced across major nutrients without breaking your selected restriction rules.'
    );
  }

  return insights;
}
