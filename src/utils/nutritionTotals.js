const nutritionKeys = [
  'calories',
  'protein',
  'carbs',
  'fat',
  'fiber',
  'calcium',
  'iron',
  'vitaminC',
  'sodium',
];

/**
 * Adds nutrition values across an array of meals.
 * Inputs: an array of meal objects that each contain a nutrition object.
 * Returns: one combined nutrition object for the full meal plan.
 * Why it exists: both the scoring layer and the UI need the same total values.
 */
export function nutritionTotals(selectedMeals = []) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    vitaminC: 0,
    sodium: 0,
  };

  selectedMeals.forEach((meal) => {
    nutritionKeys.forEach((key) => {
      const mealValue = meal?.nutrition?.[key] ?? 0;
      totals[key] += mealValue;
    });
  });

  return totals;
}
