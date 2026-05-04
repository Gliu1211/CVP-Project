import {
  activityMultipliers,
  micronutrientTargetsBySex,
} from '../data/driTargets';

function roundToWholeNumber(value) {
  return Math.round(Number.isFinite(value) ? value : 0);
}

/**
 * Calculates calorie, macro, and micronutrient targets from a user profile.
 * Inputs: an object with age, sex, heightInches, weightPounds, and activityLevel.
 * Returns: a plain object containing daily calories, macros, and micronutrient targets.
 * Why it exists: this keeps nutrition target logic in one readable place before meal scoring.
 *
 * This is a simplified DRI-inspired MVP model for educational/demo purposes.
 * It is not medical advice and is intentionally easier to explain than a clinical calculator.
 */
export function calculateTargets(userProfile) {
  const age = Number(userProfile?.age) || 0;
  const sex = userProfile?.sex === 'male' ? 'male' : 'female';
  const heightInches = Number(userProfile?.heightInches) || 0;
  const weightPounds = Number(userProfile?.weightPounds) || 0;
  const activityLevel = userProfile?.activityLevel || 'sedentary';

  const weightKg = weightPounds * 0.453592;
  const heightCm = heightInches * 2.54;

  let bmr = 0;

  if (sex === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multiplier = activityMultipliers[activityLevel] ?? activityMultipliers.sedentary;
  const calories = roundToWholeNumber(bmr * multiplier);

  const protein = roundToWholeNumber((calories * 0.25) / 4);
  const carbs = roundToWholeNumber((calories * 0.45) / 4);
  const fat = roundToWholeNumber((calories * 0.3) / 9);

  const sexSpecificTargets = micronutrientTargetsBySex[sex];

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber: sexSpecificTargets.fiber,
    calcium: sexSpecificTargets.calcium,
    iron: sexSpecificTargets.iron,
    vitaminC: sexSpecificTargets.vitaminC,
    sodiumMax: sexSpecificTargets.sodiumMax,
  };
}
