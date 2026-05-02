import MealCard from './MealCard';
import MacroChart from './MacroChart';
import MicronutrientBars from './MicronutrientBars';

function MealPlan() {
  return (
    <section className="panel">
      <h2>Meal Plan</h2>
      <p>Recommended meals and nutrition summaries will live here.</p>
      <MealCard />
      <MacroChart />
      <MicronutrientBars />
    </section>
  );
}

export default MealPlan;
