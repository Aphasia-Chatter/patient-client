import React from 'react';
import { render, fireEvent, userEvent } from '@testing-library/react-native';
import ChangePassword from '@/app/account/change_password';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen } from 'expo-router/testing-library';

// Mock the saveValue function and router
jest.mock('@/utils/SecureStore', () => ({
  saveValue: jest.fn(),
}));

describe('Change Password Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
        username: "testUser",
        sessionToken: "testSession123"
    },
    setAppUser: mockSetAppUser,
  };

  const renderChangePassword = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <ChangePassword />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders change password form with current password, new password and confirm password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderChangePassword();

    // Act that the username and password fields are rendered
    const passwordInput = getByPlaceholderText('Enter your current password');
    const newPasswordInput = getByPlaceholderText('Enter your new password');
    const confirmPasswordInput = getByPlaceholderText('Enter your confirm password');

    // Assert that the username and password fields are rendered
    expect(passwordInput).toBeTruthy();
    expect(newPasswordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
  });

  it('renders change password form with the change password button', () => {
    // Arrange
    const { getByText } = renderChangePassword();

    // Act that the login button is rendered
    const updatePasswordButton = getByText('Update Password');
    
    // Assert that the login button is rendered
    expect(updatePasswordButton).toBeTruthy();
  });
  
  it('allows typing in the current password, new password and confirm password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderChangePassword();

    // Act the username and password fields are rendered
    const passwordInput = getByPlaceholderText('Enter your current password');
    const newPasswordInput = getByPlaceholderText('Enter your new password');
    const confirmPasswordInput = getByPlaceholderText('Enter your confirm password');

    // Act by typing into the fields
    fireEvent.changeText(passwordInput, 'testUser');
    fireEvent.changeText(newPasswordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password456');

    // Assert to check if the values are updated
    expect(passwordInput.props.value).toBe('testUser');
    expect(newPasswordInput.props.value).toBe('password123');
    expect(confirmPasswordInput.props.value).toBe('password456');
  });
});