function formatSummary(actualValue, targetValue, unit = '') {
  return `${Math.round(actualValue || 0)}${unit} vs ${Math.round(targetValue || 0)}${unit}`;
}

/**
 * Displays the plan explanation and a few easy-to-read nutrient comparisons.
 * Inputs: generated insight strings, the best plan object, total nutrition, and targets.
 * Returns: the explanation section.
 * Why it exists: explainability is a core requirement of the project and interview walkthrough.
 */
function ExplanationBox({ insights, bestPlan, totalNutrition, targets }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Explainability</p>
          <h2>Why this plan?</h2>
        </div>
      </div>

      <ul className="insight-list">
        {insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>

      {!bestPlan?.error ? (
        <div className="summary-grid">
          <article className="summary-item">
            <span>Protein check</span>
            <strong>{formatSummary(totalNutrition.protein, targets.protein, 'g')}</strong>
          </article>
          <article className="summary-item">
            <span>Fiber check</span>
            <strong>{formatSummary(totalNutrition.fiber, targets.fiber, 'g')}</strong>
          </article>
          <article className="summary-item">
            <span>Calcium check</span>
            <strong>{formatSummary(totalNutrition.calcium, targets.calcium, 'mg')}</strong>
          </article>
          <article className="summary-item">
            <span>Sodium check</span>
            <strong>{formatSummary(totalNutrition.sodium, targets.sodiumMax, 'mg')}</strong>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default ExplanationBox;
