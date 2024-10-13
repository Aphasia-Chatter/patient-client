import React from 'react';
import { render, fireEvent, userEvent } from '@testing-library/react-native';
import DeleteAccount from '@/app/account/delete_account';
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
        <DeleteAccount />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders account deletion form with username and password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderChangePassword();

    // Act that the username and password fields are rendered
    const passwordInput = getByPlaceholderText('Enter your password');

    // Assert that the username and password fields are rendered
    expect(passwordInput).toBeTruthy();
  });

  it('renders account deletion form with the delete button', () => {
    // Arrange
    const { getByText } = renderChangePassword();

    // Act that the login button is rendered
    const deleteAccountButton = getByText('Delete Account Permanently');
    
    // Assert that the login button is rendered
    expect(deleteAccountButton).toBeTruthy();
  });
  
  it('allows typing in the  password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderChangePassword();

    // Act the username and password fields are rendered
    const passwordInput = getByPlaceholderText('Enter your password');

    // Act by typing into the fields
    fireEvent.changeText(passwordInput, 'testUser');

    // Assert to check if the values are updated
    expect(passwordInput.props.value).toBe('testUser');
  });
});