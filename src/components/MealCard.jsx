function formatLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Shows one breakfast, lunch, or dinner card with ingredients and nutrition.
 * Inputs: a single meal object from the local meal database.
 * Returns: one meal card.
 * Why it exists: this keeps repeated card markup out of MealPlan.
 */
function MealCard({ meal }) {
  return (
    <article className="meal-card">
      <div className="meal-card-header">
        <div>
          <p className="badge">{meal.mealType}</p>
          <h3>{meal.name}</h3>
        </div>
        <span className="pill">{formatLabel(meal.mealType)}</span>
      </div>

      <div>
        <strong>Ingredients</strong>
        <ul className="ingredient-list">
          {meal.ingredients.map((ingredient) => (
            <li key={`${meal.id}-${ingredient.name}`}>
              {ingredient.amount} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="nutrition-mini-grid">
        <div>
          <span className="label-text">Calories</span>
          <strong>{meal.nutrition.calories}</strong>
        </div>
        <div>
          <span className="label-text">Protein</span>
          <strong>{meal.nutrition.protein}g</strong>
        </div>
        <div>
          <span className="label-text">Carbs</span>
          <strong>{meal.nutrition.carbs}g</strong>
        </div>
        <div>
          <span className="label-text">Fat</span>
          <strong>{meal.nutrition.fat}g</strong>
        </div>
      </div>

      <div>
        <strong>Tags</strong>
        <ul className="tag-list">
          {meal.tags.map((tag) => (
            <li key={`${meal.id}-${tag}`}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default MealCard;
