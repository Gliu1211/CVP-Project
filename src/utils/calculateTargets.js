export function calculateTargets(userProfile) {
  return {
    calories: userProfile?.calories ?? 2000,
    protein: userProfile?.protein ?? 150,
    carbs: userProfile?.carbs ?? 200,
    fats: userProfile?.fats ?? 65,
  };
}
