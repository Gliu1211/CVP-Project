export function scoreMeal(meal, targets) {
  if (!meal || !targets) {
    return 0;
  }

  const calorieDelta = Math.abs((meal.calories ?? 0) - (targets.calories ?? 0));
  return Math.max(0, 100 - Math.round(calorieDelta / 10));
}
