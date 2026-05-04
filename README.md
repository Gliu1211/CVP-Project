# NutriPlan AI

## Overview

NutriPlan AI is a frontend-only React application that creates a personalized daily meal plan with breakfast, lunch, and dinner recommendations. The app takes a simple user profile, estimates calorie and nutrient targets, filters meals by dietary restrictions, scores every valid meal combination, and presents the best deterministic plan with charts and plain-language nutrition insights.

This project was intentionally designed for interview walkthroughs. The code favors readability, comments, and simple architecture over advanced abstractions.

## How to Run

```bash
npm install
npm run dev
```

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Recharts

## Architecture

The app follows a simple frontend pipeline:

1. The user fills out a profile in `UserForm`.
2. `calculateTargets` converts the profile into calorie, macro, and micronutrient targets.
3. `getBestMealPlan` filters the local meal dataset by dietary restrictions.
4. The scoring engine tests every breakfast + lunch + dinner combination and keeps the best one.
5. `nutritionTotals` calculates total nutrients for the chosen plan.
6. `generateInsights` turns nutrient gaps into plain-language explanations.
7. React components render the meals, chart, progress bars, and explanation box.

In short:

`user profile -> target calculation -> restriction filtering -> meal scoring -> charts and insights`

## Reference Resources

1. USDA DRI Calculator
   - Link: [USDA DRI Calculator](https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator)
   - Inspiration: user input categories and the idea of daily nutrient targets.

2. HHS/USDA Dietary Guidelines
   - Link: [Dietary Guidelines for Americans](https://www.dietaryguidelines.gov/)
   - Inspiration: rule-based nutrition guidance and practical explanations for low or high nutrient patterns.

3. Kaggle Daily Food & Nutrition Dataset
   - Link: [Kaggle Daily Food & Nutrition Dataset](https://www.kaggle.com/datasets/adilshamim8/daily-food-and-nutrition-dataset)
   - Inspiration: meal and nutrition data structure. This app uses a small local handcrafted dataset shaped in a similar spirit for reproducibility.

## AI Tools Used

- Tool: Codex / ChatGPT
- How used:
  - scaffolded the frontend structure
  - helped create readable component organization
  - suggested edge cases
  - helped debug React and chart rendering concerns
  - reviewed HCI principles for explainability and usability
- Important note:
  - The app does not use an LLM at runtime to generate meal plans. Recommendations are produced by deterministic filtering and scoring logic so the behavior is explainable during a walkthrough.

## Key Design Decisions

- Frontend-only for simplicity and reproducibility during an interview.
- Local meal database to avoid API failures and keep the app runnable offline.
- Full meals with ingredient lists so recommendations are transparent to the user.
- Deterministic scoring instead of black-box LLM generation so every result can be explained.
- Dietary restrictions are treated as hard constraints before scoring.

## HCI Design Principles

- Minimize cognitive load:
  - The interface uses summary cards, a macro chart, and nutrient progress bars instead of forcing users to compare raw numbers mentally.
- Visibility of system status:
  - The app shows both targets and actual totals so users can immediately see how the plan performed.
- User control:
  - Users can adjust profile inputs and restrictions, then regenerate a plan without leaving the page.
- Error prevention:
  - Restriction filtering happens before scoring, which prevents invalid meal combinations from appearing.
- Explainability:
  - The “Why this plan?” section explains the nutrient tradeoffs in plain language.

## Challenges & How I Solved Them

- Balancing simplicity with personalization:
  - I used a small set of inputs and a readable BMR-based formula instead of a more complex nutrition model.
- Handling different nutrient units in the scoring function:
  - I used explicit weights because calories, grams, and milligrams are on different scales.
- Avoiding hallucinated nutrition values:
  - I kept all meal data local and handcrafted with plausible rounded values instead of relying on runtime generation.
- Keeping recommendations explainable:
  - The scoring logic is deterministic, and the explanation layer is rule-based instead of AI-generated at runtime.

## What I'd Improve With More Time

- USDA FoodData Central API integration
- A larger cleaned Kaggle-derived dataset
- Ingredient-level portion optimization
- Saved user profiles
- More dietary patterns
- Better accessibility testing
