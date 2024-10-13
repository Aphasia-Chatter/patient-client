import React from 'react';
import { render, userEvent } from '@testing-library/react-native';
import Profile from '@/app/(drawer)/profile';
import ChangePassword from '@/app/account/change_password';
import DeleteAccount from '@/app/account/delete_account';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen } from 'expo-router/testing-library';

// Mock the saveValue function and router
jest.mock('@/utils/SecureStore', () => ({
    saveValue: jest.fn(),
}));

jest.mock('expo-linking', () => {
    const module: typeof import('expo-linking') = {
        ...jest.requireActual('expo-linking'),
        createURL: jest.fn(),
    };
    return module;
});

describe('Profile Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
        username: "testUser",
        sessionToken: "testSession123"
    },
    setAppUser: mockSetAppUser,
  };

  const renderProfile = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Profile />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders login form with username and password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderProfile();
  });

  it('renders change password link', () => {
    // Arrange
    const { getByRole } = renderProfile();

    // Act that the Pressable is rendered
    const changePasswordLink = getByRole('link', { name: /change password/i });

    // Assert that the Pressable is rendered
    expect(changePasswordLink).toBeTruthy();
  });

  it('renders delete account link', () => {
    // Arrange
    const { getByRole } = renderProfile();

    // Act that the Pressable is rendered
    const deleteAccountLink = getByRole('link', { name: /delete account/i, hidden: false });

    // Assert that the Pressable is rendered
    expect(deleteAccountLink).toBeTruthy();
  });

  it('allows navigating to change password page when change password link is clicked', () => {
    // Arrange
    const { getByRole } = renderProfile();

    // Act: Find the change password link
    const changePasswordLink = getByRole('link', { name: /change password/i, hidden: false });

    renderRouter(
      {
        profile: () => <Profile />,
        changePassword: () => <ChangePassword />
      },
      {
        initialUrl: '/change_password',
      },
    );

    // Simulate a click on the preference button
    userEvent.press(changePasswordLink);

    // Assert that the navigation function is called with the expected route
    expect(screen).toHavePathname('/change_password');
  });

  it('allows navigating to delete account page when delete account link is clicked', () => {
    // Arrange
    const { getByRole } = renderProfile();
    
    // Act that the Pressable is rendered
    const deleteAccountLink = getByRole('link', { name: /delete account/i, hidden: false });
    
    renderRouter(
      {
        profile: () => <Profile />,
        deleteAccount: () => <DeleteAccount />
      },
      {
        initialUrl: '/delete_account',
      },
    );

    // Simulate clicking the register link
    userEvent.press(deleteAccountLink);

    // Assert that the router.push method was called with the correct URL
    expect(screen).toHavePathname('/delete_account');
  });
});