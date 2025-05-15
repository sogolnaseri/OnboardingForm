// src/App.tsx
import OnboardingForm from "./components/OnboardingForm";
import "./App.css";

function App() {
  return (
    <div className="App" data-testid="app-container">
      <header data-testid="app-header"></header>
      <main data-testid="app-main">
        <div className="gray-area">
          <div className="progress-indicator">Step 1 of 5</div>
          <OnboardingForm data-testid="onboarding-form" />
        </div>
      </main>
    </div>
  );
}

export default App;
