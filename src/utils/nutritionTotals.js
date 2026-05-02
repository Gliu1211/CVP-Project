export function nutritionTotals(meals = []) {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories ?? 0),
      protein: totals.protein + (meal.protein ?? 0),
      carbs: totals.carbs + (meal.carbs ?? 0),
      fats: totals.fats + (meal.fats ?? 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  );
}
