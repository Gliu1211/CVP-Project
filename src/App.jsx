import UserForm from './components/UserForm';
import MealPlan from './components/MealPlan';
import ExplanationBox from './components/ExplanationBox';

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">CVP Project</p>
        <h1>Meal Planner</h1>
        <p className="intro">
          Starter interface for building personalized meal plans and nutrition
          insights.
        </p>
      </section>

      <UserForm />
      <MealPlan />
      <ExplanationBox />
    </main>
  );
}

export default App;
