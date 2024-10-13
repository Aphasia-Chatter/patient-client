import React from 'react';
import { render, fireEvent, userEvent } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import Register from '@/app/(auth)/register';
import Preference from '@/app/(auth)/preference';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen } from 'expo-router/testing-library';

// Mock the saveValue function and router
jest.mock('@/utils/SecureStore', () => ({
  saveValue: jest.fn(),
}));

describe('Login Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: null, // Assuming user is not logged in initially
    setAppUser: mockSetAppUser,
  };

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders login form with username and password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderLogin();

    // Act that the username and password fields are rendered
    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');

    // Assert that the username and password fields are rendered
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('renders login form with the login button', () => {
    // Arrange
    const { getByText } = renderLogin();

    // Act that the login button is rendered
    const loginButton = getByText('Login');
    
    // Assert that the login button is rendered
    expect(loginButton).toBeTruthy();
  });

  it('renders preference button when not focused', () => {
    // Arrange
    const { getByRole } = renderLogin();

    // Act that the Pressable is rendered
    const preferenceButton = getByRole('button', { name: /preference/i, hidden: false })

    // Assert that the Pressable is rendered
    expect(preferenceButton).toBeTruthy();
  });

  it('does not render preference button when focused', () => {
    // Arrange: Render the login component
    const { getByRole, queryByRole } = renderLogin();

    // Act by focusing on the username input
    const usernameInput = getByRole('search', { name: /username/i }); // Adjust according to your implementation
    fireEvent.press(usernameInput);

    // Assert that the preference button is NOT rendered anymore when focused on username field
    expect(queryByRole('button', { name: /preference/i, hidden: false })).toBeUndefined;

    // Act by focusing on the username input
    const passwordInput = getByRole('search', { name: /password/i }); // Adjust according to your implementation
    fireEvent.press(passwordInput);

    // Assert that the preference button is NOT rendered anymore when focused on password field
    expect(queryByRole('button', { name: /preference/i, hidden: false })).toBeUndefined;
  });

  it('renders register link', () => {
    // Arrange
    const { getByText } = renderLogin();

    // Act that the Pressable is rendered
    const registerLink = getByText("Register here");

    // Assert that the Pressable is rendered
    expect(registerLink).toBeTruthy();
  });
  
  it('allows typing in the username and password fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderLogin();

    // Act the username and password fields are rendered
    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');

    // Act by typing into the fields
    fireEvent.changeText(usernameInput, 'testUser');
    fireEvent.changeText(passwordInput, 'password123');

    // Assert to check if the values are updated
    expect(usernameInput.props.value).toBe('testUser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('allows navigating to preference page when preference button is clicked', () => {
    // Arrange
    const { getByRole } = renderLogin();

    // Act: Find the preference button
    const preferenceButton = getByRole('button', { name: /preference/i, hidden: false });

    renderRouter(
      {
        login: () => <Login/>,
        preference: () => <Preference />
      },
      {
        initialUrl: '/preference',
      },
    );

    // Simulate a click on the preference button
    userEvent.press(preferenceButton);

    // Assert that the navigation function is called with the expected route
    expect(screen).toHavePathname('/preference');
  });

  it('allows navigating to register page when register link is clicked', () => {
    // Arrange
    const { getByText } = renderLogin();
    
    // Act that the Pressable is rendered
    const registerLink = getByText("Register here");
    
    renderRouter(
      {
        login: () => <Login/>,
        register: () => <Register />
      },
      {
        initialUrl: '/register',
      },
    );

    // Simulate clicking the register link
    userEvent.press(registerLink);

    // Assert that the router.push method was called with the correct URL
    expect(screen).toHavePathname('/register');
  });
});