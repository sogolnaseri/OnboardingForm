// src/App.tsx
import OnboardingForm from "./components/OnboardingForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="gray-area">
        <div className="progress-indicator">Step 1 of 5</div>
        <OnboardingForm />
      </div>
    </div>
  );
}

export default App;
