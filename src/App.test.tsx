import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App", () => {
  test("renders the main app container", () => {
    render(<App />);
    // Check for the main app container
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
  });

  test("renders the onboarding form within the app", () => {
    render(<App />);
    // Check that the form is rendered within the app
    expect(screen.getByTestId("onboarding-form")).toBeInTheDocument();
  });

  test("renders the app with correct layout structure", () => {
    render(<App />);
    // Check for the main layout elements
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
    expect(screen.getByTestId("app-main")).toBeInTheDocument();
    expect(screen.getByTestId("app-footer")).toBeInTheDocument();
  });
});
