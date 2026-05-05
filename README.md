# NutriPlan AI

## Overview

NutriPlan AI is a frontend-only React application that creates a personalized daily meal plan with breakfast, lunch, and dinner recommendations. The app takes a simple user profile, estimates calorie and nutrient targets, filters food items by dietary restrictions, generates realistic meal combinations from a local nutrition dataset, and presents a scored plan with charts and plain-language nutrition insights.

This project was intentionally designed for an interview walkthrough. The code favors readability, comments, and simple architecture over advanced abstractions so the recommendation process can be explained step by step.

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
2. `calculateTargets` converts the profile into calorie, macro, and micronutrient targets using a simplified DRI-inspired model.
3. `getBestMealPlan` filters the local food dataset by dietary restrictions before any scoring happens.
4. The meal generator builds candidate meals from individual food items rather than relying only on static prebuilt meals.
5. Candidate meals are generated using simple templates:
   - Breakfast: protein + grain + fruit
   - Lunch: protein + grain + vegetable
   - Dinner: protein + grain + vegetable
6. To avoid testing too many combinations, the generator ranks food items and keeps only the top `K` items per food group before building combinations.
7. The best breakfast, lunch, and dinner plans are scored against the user's total daily targets.
8. `nutritionTotals` calculates total nutrients for the chosen plan.
9. `generateInsights` turns nutrient gaps and scoring decisions into plain-language explanations.
10. React components render the meals, macro chart, progress bars, and explanation box.

In short:

`user profile -> target calculation -> restriction filtering -> top-K meal generation -> weighted scoring -> charts and insights`

## Reference Resources

1. USDA DRI Calculator
   - Link: [USDA DRI Calculator](https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator)
   - Inspiration: user input categories and the idea of daily nutrient targets.

2. HHS/USDA Dietary Guidelines
   - Link: [Dietary Guidelines for Americans](https://www.dietaryguidelines.gov/)
   - Inspiration: rule-based nutrition guidance and practical explanations for low or high nutrient patterns.

3. Kaggle Daily Food & Nutrition Dataset
   - Link: [Kaggle Daily Food & Nutrition Dataset](https://www.kaggle.com/datasets/adilshamim8/daily-food-and-nutrition-dataset)
   - Inspiration: food item structure, meal type labels, nutrition columns, and category-based filtering. The app uses a local dataset shaped around this structure for reproducibility during review.

## AI Tools Used

- Tool: Codex / ChatGPT
- How used:
  - scaffolded the frontend structure
  - helped create readable component organization
  - suggested edge cases
  - helped debug React and chart rendering concerns
  - helped reason through the performance issue caused by too many generated combinations
  - reviewed HCI principles for explainability and usability
- Important note:
  - The app does not use an LLM at runtime to generate meal plans. Recommendations are produced by deterministic filtering, top-K bounded search, and weighted scoring logic so the behavior is explainable during a walkthrough.

## Key Design Decisions

- Frontend-only for simplicity and reproducibility during an interview.
- Local food dataset to avoid API failures and keep the app runnable offline.
- Food-item based generation instead of only prebuilt meals, so the app can construct meal combinations by adding nutrition values across items.
- Meal templates to prevent unrealistic combinations, such as condiments or beverages becoming the main meal.
- Deterministic scoring instead of black-box LLM generation so every result can be explained.
- Dietary restrictions are treated as hard constraints before scoring.
- Seafood/shellfish-sensitive filtering is conservative because the source categories can be inconsistent; fish and seafood categories are treated as seafood allergens.
- A regenerate button cycles through sorted scored plans, which provides variety while staying deterministic and easy to defend.

## Search Optimization

The first version of the generator tested too many possible food combinations. For a meal template like protein + grain + vegetable, the naive approach has cubic complexity:

`O(P x G x V)`

where `P`, `G`, and `V` are the number of protein, grain, and vegetable options. With a larger dataset, this created enough combinations to make the browser unresponsive.

To fix this, I implemented a bounded top-K search strategy:

1. Filter foods by dietary restrictions, meal type, and food group.
2. Score individual food items by how closely they fit the user's target profile.
3. Keep only the top `K` foods from each required food group.
4. Generate combinations only from that smaller candidate pool.
5. Score complete meal plans using weighted nutrient error.
6. Sort the plans and allow the user to generate another option by cycling through the ranked results.

This changes the expensive part of the search from `O(P x G x V)` to approximately `O(K^3)` per meal template. In the current implementation, `K` is capped so the app stays responsive while still comparing many reasonable options.

## HCI Design Principles

- Minimize cognitive load:
  - The interface uses summary cards, a macro chart, and nutrient progress bars instead of forcing users to compare raw numbers mentally.
- Visibility of system status:
  - The app shows both targets and actual totals so users can immediately see how the plan performed.
- User control:
  - Users can adjust profile inputs and restrictions, then generate another ranked plan without leaving the page.
- Error prevention:
  - Restriction filtering happens before scoring, which prevents invalid meal combinations from appearing.
- Explainability:
  - The “Why this plan?” section explains the nutrient tradeoffs and filtering decisions in plain language.

## Challenges & How I Solved Them

- Moving from static meals to generated meals:
  - I wanted the app to do more than select a hardcoded breakfast, lunch, and dinner. I represented foods as individual dataset items, then generated meals by combining compatible food groups and adding their nutrition values together.

- Preventing unrealistic combinations:
  - Randomly choosing foods can create strange meals. I used simple meal templates, such as protein + grain + vegetable, so generated plans still resemble real meals.

- Handling too many possible combinations:
  - My first generation approach created too many possible combinations and could freeze the browser. I fixed this with a top-K bounded search that ranks foods first, limits each food group, then scores only a manageable number of complete meal plans.

- Balancing simplicity with personalization:
  - I used a small set of user inputs and a readable BMR-based formula instead of a more complex clinical nutrition model.

- Handling different nutrient units in the scoring function:
  - I used explicit weights because calories, grams, and milligrams are on different scales. This lets the scoring function compare nutrient gaps without one unit dominating everything.

- Avoiding hallucinated nutrition values:
  - I kept nutrition data local and deterministic instead of asking an LLM to invent meals or nutrient values at runtime.

- Supporting restrictions and allergen filtering:
  - I added allergen tags and conservative filtering rules before scoring. For example, seafood/fish-labeled foods are removed for seafood-sensitive users because the dataset categories are not granular enough to reliably distinguish shellfish from other seafood.

- Keeping recommendations explainable:
  - The scoring logic is deterministic, and the explanation layer is rule-based instead of AI-generated at runtime.

## Testing and Debugging

During development, I used manual browser testing and console timing to identify the combination explosion problem. By temporarily disabling meal generation, then re-enabling it with smaller candidate pools, I confirmed that the unresponsive page was caused by the size of the search space rather than a build error.

This led to the top-K search change and the deterministic regenerate behavior.

## What I'd Improve With More Time

- USDA FoodData Central API integration
- A larger cleaned Kaggle-derived dataset
- A preprocessing script that documents how raw CSV rows become app-ready food objects
- More precise allergen and dietary restriction labeling
- Ingredient-level portion optimization
- Saved user profiles
- More dietary patterns
- Unit tests for scoring, restriction filtering, and nutrition totals
- Better accessibility testing
