import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const macroColors = ['#2b7a4b', '#4f8cd6', '#d08b2f'];

/**
 * Renders a simple macro chart for protein, carbs, and fat totals.
 * Inputs: combined nutrition totals for the selected meal plan.
 * Returns: a bar chart section.
 * Why it exists: charts reduce cognitive load compared with scanning raw numbers.
 */
function MacroChart({ totalNutrition }) {
  const chartData = [
    { name: 'Protein', grams: Number(totalNutrition?.protein) || 0 },
    { name: 'Carbs', grams: Number(totalNutrition?.carbs) || 0 },
    { name: 'Fat', grams: Number(totalNutrition?.fat) || 0 },
  ];

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Macro view</p>
          <h2>Macro distribution</h2>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} g`, 'Total']} />
            <Bar dataKey="grams" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={macroColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MacroChart;
