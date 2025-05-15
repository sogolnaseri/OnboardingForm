// src/__tests__/OnboardingForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OnboardingForm from "../components/OnboardingForm";

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("OnboardingForm", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test("renders form with all required fields", () => {
    render(<OnboardingForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("shows validation errors for required fields", async () => {
    render(<OnboardingForm />);

    // Focus and blur first name field
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.focus(firstNameInput);
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });
  });

  test("validates Canadian phone number format", async () => {
    render(<OnboardingForm />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(
        screen.getByText(/valid canadian phone number/i)
      ).toBeInTheDocument();
    });

    // Test valid phone number
    fireEvent.change(phoneInput, { target: { value: "+13062776103" } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(
        screen.queryByText(/valid canadian phone number/i)
      ).not.toBeInTheDocument();
    });
  });

  test("validates corporation number length", async () => {
    render(<OnboardingForm />);

    const corpInput = screen.getByLabelText(/corporation number/i);
    fireEvent.change(corpInput, { target: { value: "12345" } });
    fireEvent.blur(corpInput);

    await waitFor(() => {
      expect(screen.getByText(/must be exactly 9 digits/i)).toBeInTheDocument();
    });
  });

  test("validates corporation number against API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        valid: false,
        message: "Invalid corporation number",
      }),
    } as Response);

    render(<OnboardingForm />);

    const corpInput = screen.getByLabelText(/corporation number/i);
    fireEvent.change(corpInput, { target: { value: "123456789" } });
    fireEvent.blur(corpInput);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid corporation number")
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

    render(<OnboardingForm />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "+13062776103" },
    });
    fireEvent.change(screen.getByLabelText(/corporation number/i), {
      target: { value: "123456789" },
    });

    // Wait for corporation validation
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://fe-hometask-api.qa.vault.tryvault.com/corporation-number/123456789"
      );
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: "John",
            lastName: "Doe",
            phone: "+13062776103",
            corporationNumber: "123456789",
          }),
        })
      );
    });
  });
});
