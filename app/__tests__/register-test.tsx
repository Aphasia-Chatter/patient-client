import React from 'react';
import { render, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
import Register from '@/app/(auth)/register';
import Login from '@/app/(auth)/login';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen } from 'expo-router/testing-library';

// Mock the saveValue function and router
jest.mock('@/utils/SecureStore', () => ({
  saveValue: jest.fn(),
}));

describe('Register Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: null, // Assuming user is not logged in initially
    setAppUser: mockSetAppUser,
  };

  const renderRegister = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Register />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders register form with username, password, confirm password, enrolment code fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderRegister();

    // Act that the username, password, confirm password, enrolment code fields are rendered
    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter your password');
    const enrolmentCodeInput = getByPlaceholderText('Enter the enrollment code');

    // Assert that the username, password, confirm password, enrolment code fields are rendered
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
    expect(enrolmentCodeInput).toBeTruthy();
  });

  it('renders register form with the register button', () => {
    // Arrange
    const { getByText } = renderRegister();

    // Act that the login button is rendered
    const registerButton = getByText('Register');
    
    // Assert that the login button is rendered
    expect(registerButton).toBeTruthy();
  });

  it('renders login link', () => {
    // Arrange
    const { getByText } = renderRegister();

    // Act that the Pressable is rendered
    const loginLink = getByText("Login here");

    // Assert that the Pressable is rendered
    expect(loginLink).toBeTruthy();
  });
  
  it('allows typing in the username, password, confirm password, enrolment code fields', () => {
    // Arrange
    const { getByPlaceholderText } = renderRegister();

    // Act the username and password fields are rendered
    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter your password');
    const enrolmentCodeInput = getByPlaceholderText('Enter the enrollment code');

    // Act by typing into the fields
    fireEvent.changeText(usernameInput, 'testUser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.changeText(enrolmentCodeInput, 'abcdefg');

    // Assert to check if the values are updated
    expect(usernameInput.props.value).toBe('testUser');
    expect(passwordInput.props.value).toBe('password123');
    expect(confirmPasswordInput.props.value).toBe('password123');
    expect(enrolmentCodeInput.props.value).toBe('abcdefg');
  });

  it('allows navigating to login page when login link is clicked', () => {
    // Arrange
    const { getByText } = renderRegister();
    
    // Act that the Pressable is rendered
    const loginLink = getByText("Login here");
    
    renderRouter(
      {
        register: () => <Register />,
        login: () => (
            <AuthContext.Provider value={mockAuthContext}>
                <Login />
            </AuthContext.Provider>
        ),
      },
      {
        initialUrl: '/login',
      },
    );

    // Simulate clicking the register link
    userEvent.press(loginLink);

    // Assert that the router.push method was called with the correct URL
    expect(screen).toHavePathname('/login');
  });

  it('register account successfully with valid credentials', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({
          username: 'testuser',
          password: 'password123',
          confirmPassword: 'password123',
          enrolmentCode: 'abcdefg',
        })
      }),
    ) as jest.Mock;

    const { getByPlaceholderText, getByText } = renderRegister();

    renderRouter(
      {
        register: () => <Register/>,
        login: () => (
            <AuthContext.Provider value={mockAuthContext}>
                <Login />
            </AuthContext.Provider>
        ),
      },
      {
        initialUrl: '/login',
      },
    );

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');
    
    fireEvent.press(getByText('Register'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      
    });
  });

  it('shows an error message if username is empty', async () => {
    const { getByPlaceholderText, getByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), '');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Please enter your username.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows an error message if password is empty', async () => {
    const { getByPlaceholderText, getByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Please enter your password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows an error message if confirm password is empty', async () => {
    const { getByPlaceholderText, getByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), '');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Please re-confirm your password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows an error message if passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'differentPassword');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Please re-confirm your passwords.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows an error message if enrollment code is empty', async () => {
    const { getByPlaceholderText, getByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), '');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Please enter the enrolment code given.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });
});