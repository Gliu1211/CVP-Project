const nutrientRows = [
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
];

function getPercent(actualValue, targetValue) {
  if (!Number.isFinite(actualValue) || !Number.isFinite(targetValue) || targetValue <= 0) {
    return 0;
  }

  return Math.min((actualValue / targetValue) * 100, 100);
}

/**
 * Shows progress bars for fiber and key micronutrients plus sodium status.
 * Inputs: total plan nutrition and target values.
 * Returns: a compact nutrient progress section.
 * Why it exists: it makes nutrient gaps visible without requiring mental math.
 */
function MicronutrientBars({ totalNutrition, targets }) {
  const sodiumValue = Number(totalNutrition?.sodium) || 0;
  const sodiumMax = Number(targets?.sodiumMax) || 0;
  const sodiumPercent = sodiumMax > 0 ? Math.min((sodiumValue / sodiumMax) * 100, 100) : 0;

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Micronutrients</p>
          <h2>Progress toward targets</h2>
        </div>
      </div>

      <div className="progress-stack">
        {nutrientRows.map((nutrient) => {
          const actualValue = Number(totalNutrition?.[nutrient.key]) || 0;
          const targetValue = Number(targets?.[nutrient.key]) || 0;
          const percent = getPercent(actualValue, targetValue);

          return (
            <div key={nutrient.key}>
              <div className="progress-header">
                <strong>{nutrient.label}</strong>
                <span className="muted-text">
                  {Math.round(actualValue)}
                  {nutrient.unit} / {Math.round(targetValue)}
                  {nutrient.unit}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}

        <div>
          <div className="progress-header">
            <strong>Sodium</strong>
            <span className="muted-text">
              {Math.round(sodiumValue)}mg / {Math.round(sodiumMax)}mg max
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${sodiumValue > sodiumMax ? 'warning' : ''}`}
              style={{ width: `${sodiumPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MicronutrientBars;
