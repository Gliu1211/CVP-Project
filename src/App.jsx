import { useState } from 'react';
import UserForm from './components/UserForm';
import MealPlan from './components/MealPlan';
import MacroChart from './components/MacroChart';
import MicronutrientBars from './components/MicronutrientBars';
import ExplanationBox from './components/ExplanationBox';
import { calculateTargets } from './utils/calculateTargets';
import { getBestMealPlan } from './utils/mealScoring';
import { nutritionTotals as calculateNutritionTotals } from './utils/nutritionTotals';
import { generateInsights } from './utils/generateInsights';

const defaultUserProfile = {
  age: 24,
  sex: 'female',
  heightInches: 66,
  weightPounds: 145,
  activityLevel: 'moderate',
  dietaryRestrictions: [],
};

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Math.round(value).toString();
}

function App() {
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [planIndex, setPlanIndex] = useState(0);

  const targets = calculateTargets(userProfile);
  const bestPlan = getBestMealPlan(userProfile, targets, planIndex);
  const selectedMeals = bestPlan?.meals ?? [];
  const totalNutrition = calculateNutritionTotals(selectedMeals);
  const insights = generateInsights(totalNutrition, targets, bestPlan);

  const handleProfileChange = (nextProfile) => {
    setUserProfile(nextProfile);
    setPlanIndex(0);
  };

  const handleGenerateAnotherPlan = () => {
    setPlanIndex((currentPlanIndex) => currentPlanIndex + 1);
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="hero-tag">Meal Generator</p>
          <h1>Personalized meal planning you can actually explain.</h1>
          <p className="hero-copy">
            Build a breakfast, lunch, and dinner plan from local nutrition data
            using simple target calculation, restriction filtering, and a
            deterministic scoring function.
          </p>
        </div>
        <div className="hero-note">
          <p className="hero-note-label">Design goal</p>
          <p>
            Readable logic, transparent meal choices, and visual summaries that
            reduce mental math during decision-making.
          </p>
        </div>
      </section>

      <section className="layout-grid">
        <aside className="sidebar">
          <UserForm userProfile={userProfile} onProfileChange={handleProfileChange} />
        </aside>

        <section className="content">
          <section className="panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Daily targets</p>
                <h2>Nutrition target summary</h2>
              </div>
              <p className="section-meta">
                Estimated from a simplified DRI-inspired MVP formula.
              </p>
            </div>

            <div className="stat-grid">
              <article className="stat-card">
                <span>Calories</span>
                <strong>{formatNumber(targets.calories)}</strong>
                <small>kcal / day</small>
              </article>
              <article className="stat-card">
                <span>Protein</span>
                <strong>{formatNumber(targets.protein)}</strong>
                <small>g target</small>
              </article>
              <article className="stat-card">
                <span>Carbs</span>
                <strong>{formatNumber(targets.carbs)}</strong>
                <small>g target</small>
              </article>
              <article className="stat-card">
                <span>Fat</span>
                <strong>{formatNumber(targets.fat)}</strong>
                <small>g target</small>
              </article>
              <article className="stat-card">
                <span>Fiber</span>
                <strong>{formatNumber(targets.fiber)}</strong>
                <small>g target</small>
              </article>
              <article className="stat-card">
                <span>Sodium cap</span>
                <strong>{formatNumber(targets.sodiumMax)}</strong>
                <small>mg max</small>
              </article>
            </div>
          </section>

          <MealPlan
            bestPlan={bestPlan}
            targets={targets}
            totalNutrition={totalNutrition}
            onGenerateAnotherPlan={handleGenerateAnotherPlan}
          />

          <section className="analytics-grid">
            <MacroChart totalNutrition={totalNutrition} />
            <MicronutrientBars totalNutrition={totalNutrition} targets={targets} />
          </section>

          <ExplanationBox
            insights={insights}
            bestPlan={bestPlan}
            totalNutrition={totalNutrition}
            targets={targets}
          />
        </section>
      </section>
    </main>
  );
}

export default App;
