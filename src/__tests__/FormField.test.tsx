import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '../components/FormField';

describe('FormField', () => {
  test('renders with basic props', () => {
    render(
      <FormField label="Test Field">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('shows required indicator when required prop is true', () => {
    render(
      <FormField label="Test Field" required>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('does not show required indicator when required prop is false', () => {
    render(
      <FormField label="Test Field" required={false}>
        <input type="text" />
      </FormField>
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(
      <FormField label="Test Field" error={errorMessage}>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('shows validating message when isValidating prop is true', () => {
    render(
      <FormField label="Test Field" isValidating>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('Validating...')).toBeInTheDocument();
  });

  test('associates label with input using generated id', () => {
    render(
      <FormField label="Test Field">
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Field');
    
    expect(label).toHaveAttribute('for', 'test-field');
    expect(input).toHaveAttribute('id', 'test-field');
  });

  test('uses provided id when available', () => {
    const customId = 'custom-id';
    render(
      <FormField label="Test Field" id={customId}>
        <input type="text" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Field');
    
    expect(label).toHaveAttribute('for', customId);
    expect(input).toHaveAttribute('id', customId);
  });

  test('throws error when child is not a valid React element', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(
        <FormField label="Test Field">
          Not a valid element
        </FormField>
      );
    }).toThrow('FormField expects a single React element as its child.');

    // Restore console.error
    console.error = consoleError;
  });

  test('works with different input types', () => {
    render(
      <FormField label="Test Field">
        <select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </FormField>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
}); 