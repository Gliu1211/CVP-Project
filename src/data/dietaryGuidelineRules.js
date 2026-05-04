export const dietaryGuidelineRules = [
  {
    id: 'protein-close',
    nutrient: 'protein',
    comparison: 'minPercent',
    threshold: 0.9,
    message: 'This plan closely meets your protein goal.',
  },
  {
    id: 'fiber-low',
    nutrient: 'fiber',
    comparison: 'maxPercent',
    threshold: 0.8,
    message:
      'This plan is low in fiber. Consider adding beans, oats, berries, or vegetables.',
  },
  {
    id: 'calcium-low',
    nutrient: 'calcium',
    comparison: 'maxPercent',
    threshold: 0.8,
    message:
      'This plan is low in calcium. Consider yogurt, fortified milk, tofu, or leafy greens.',
  },
  {
    id: 'iron-low',
    nutrient: 'iron',
    comparison: 'maxPercent',
    threshold: 0.8,
    message:
      'This plan is low in iron. Consider lentils, spinach, beans, or lean meats.',
  },
  {
    id: 'vitamin-c-low',
    nutrient: 'vitaminC',
    comparison: 'maxPercent',
    threshold: 0.8,
    message:
      'This plan is low in vitamin C. Consider citrus fruit, peppers, strawberries, or broccoli.',
  },
  {
    id: 'sodium-high',
    nutrient: 'sodium',
    comparison: 'aboveMax',
    threshold: 1,
    message: 'This plan is high in sodium. Consider lower-sodium swaps.',
  },
];
