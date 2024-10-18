import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormField from '../FormField'; // Adjust the import based on your file structure

describe('FormField Component', () => {
  const mockHandleChangeText = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  const defaultProps = {
    title: 'Password',
    value: '',
    placeholder: 'Enter your password',
    handleChangeText: mockHandleChangeText,
    onFocus: mockOnFocus,
    onBlur: mockOnBlur,
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render correctly', () => {
    const { getByPlaceholderText } = render(<FormField {...defaultProps} />);
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('should call handleChangeText on text input', () => {
    const { getByPlaceholderText } = render(<FormField {...defaultProps} />);
    const input = getByPlaceholderText('Enter your password');

    fireEvent.changeText(input, 'newPassword');
    expect(mockHandleChangeText).toHaveBeenCalledWith('newPassword');
  });

  it('should toggle password visibility when the eye icon is pressed', () => {
    const { getByPlaceholderText, getByTestId } = render(<FormField {...defaultProps} />);
    const input = getByPlaceholderText('Enter your password');

    // Initially, the secureTextEntry prop should be true for password
    expect(input.props.secureTextEntry).toBe(true);

    // Press the eye icon to toggle visibility
    const eyeIcon = getByTestId('toggle-password-visibility');
    fireEvent.press(eyeIcon);

    // Check that secureTextEntry is now false
    expect(input.props.secureTextEntry).toBe(false);

    // Press the eye icon again to toggle back
    fireEvent.press(eyeIcon);
    expect(input.props.secureTextEntry).toBe(true);
  });
});
