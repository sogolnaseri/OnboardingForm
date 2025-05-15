import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingForm from '../components/OnboardingForm';
import userEvent from '@testing-library/user-event';

// Mock the API service
const mockValidateCorporationNumber = jest.fn();
jest.mock('../services/api', () => ({
  validateCorporationNumber: () => mockValidateCorporationNumber()
}));

describe('OnboardingForm', () => {
  test('renders the onboarding form', () => {
    render(<OnboardingForm />);
    expect(screen.getByRole('heading', { name: /onboarding form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<OnboardingForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/corporation number is required/i)).toBeInTheDocument();
  });

  test('shows and clears phone number validation error', async () => {
    render(<OnboardingForm />);
    const phoneInput = screen.getByLabelText(/phone number/i);
    await userEvent.type(phoneInput, '123');
    fireEvent.blur(phoneInput);
    expect(await screen.findByText(/please enter a valid canadian phone number/i)).toBeInTheDocument();
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '+14165551234');
    fireEvent.blur(phoneInput);
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid canadian phone number/i)).not.toBeInTheDocument();
    });
  });

  test('shows and clears corporation number validation error', async () => {
    render(<OnboardingForm />);
    const corpInput = screen.getByLabelText(/corporation number/i);
    await userEvent.type(corpInput, '123');
    fireEvent.blur(corpInput);
    expect(await screen.findByText(/must be exactly 9 digits/i)).toBeInTheDocument();
    await userEvent.clear(corpInput);
    await userEvent.type(corpInput, '123456789');
    fireEvent.blur(corpInput);
    await waitFor(() => {
      expect(screen.queryByText(/must be exactly 9 digits/i)).not.toBeInTheDocument();
    });
  });
});
