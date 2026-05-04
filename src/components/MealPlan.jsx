import MealCard from './MealCard';

function formatValue(value, unit = '') {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;
  return `${safeValue}${unit}`;
}

/**
 * Displays the selected meal plan and the main target-vs-actual summary.
 * Inputs: the best plan, target values, and total plan nutrition.
 * Returns: the main meal recommendation section.
 * Why it exists: this component groups the most important meal-planning results together.
 */
function MealPlan({
  bestPlan,
  targets,
  totalNutrition,
  onGenerateAnotherPlan,
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Meal recommendation</p>
          <h2>Best daily plan</h2>
        </div>
        <div className="button-row">
          {bestPlan?.score !== null && bestPlan?.score !== undefined ? (
            <span className="score-chip">Plan score: {Math.round(bestPlan.score)}</span>
          ) : null}
          <button
            className="primary-button"
            type="button"
            onClick={onGenerateAnotherPlan}
            disabled={Boolean(bestPlan?.error)}
          >
            Generate another plan
          </button>
        </div>
      </div>

      {bestPlan?.error ? (
        <div className="empty-state">
          <strong>No complete plan found.</strong>
          <p>{bestPlan.error}</p>
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <article className="summary-item">
              <span>Calories</span>
              <strong>{formatValue(totalNutrition.calories)} / {formatValue(targets.calories)}</strong>
            </article>
            <article className="summary-item">
              <span>Protein</span>
              <strong>{formatValue(totalNutrition.protein, 'g')} / {formatValue(targets.protein, 'g')}</strong>
            </article>
            <article className="summary-item">
              <span>Carbs</span>
              <strong>{formatValue(totalNutrition.carbs, 'g')} / {formatValue(targets.carbs, 'g')}</strong>
            </article>
            <article className="summary-item">
              <span>Fat</span>
              <strong>{formatValue(totalNutrition.fat, 'g')} / {formatValue(targets.fat, 'g')}</strong>
            </article>
          </div>

          <div className="meal-grid">
            {bestPlan?.meals?.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default MealPlan;
