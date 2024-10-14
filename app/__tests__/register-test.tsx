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

jest.mock('expo-linking', () => {
  const module: typeof import('expo-linking') = {
      ...jest.requireActual('expo-linking'),
      createURL: jest.fn(),
  };
  return module;
});

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
    global.fetch = jest.fn(); // Mocking the fetch function
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
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue({
        status: 'REGISTRATION SUCCESS',
        message: 'Patient account registered successfully',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText, findByText } = renderRegister();

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
      expect(findByText('REGISTRATION SUCCESS')).toBeTruthy();
      expect(findByText('Patient account registered successfully')).toBeTruthy();
    });
  });

  it('shows error message when registering account unsuccessfully with network request timeout', async () => {
    // Suppress console.error for this test case
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create a spy on the AbortController constructor and its abort method
    const abortControllerSpy = jest.spyOn(global, 'AbortController').mockImplementation(() => {
      return {
        signal: {
          aborted: true,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          onabort: null,
          dispatchEvent: jest.fn(),
          throwIfAborted: jest.fn(),
          reason: null,
        },
        abort: jest.fn(),
      } as unknown as AbortController;
    });

    // Mock fetch to simulate a network timeout
    global.fetch = jest.fn(() => {
      return new Promise((_, reject) => {
        reject(new DOMException('The operation was aborted.', 'AbortError')); // Simulate abort error
      });
    });
  
    const { getByPlaceholderText, getByText, findByText } = renderRegister();
  
    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');
  
    // Simulate pressing the login button
    fireEvent.press(getByText('Register'));
  
    // Wait for the timeout error modal to appear
    const errorHeader = await findByText('NETWORK REQUEST TIMED_OUT');
    const errorMessage = await findByText('The request has been aborted due to timeout.');
  
    // Assertions
    expect(errorHeader).toBeTruthy();
    expect(errorMessage).toBeTruthy();

    // Restore the original AbortController behavior and console.error
    abortControllerSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('shows an error message when registering account unsuccessfully with invalid credentials - invalid username', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_USERNAME',
        message: 'Username already exist. Cannot register patient user!',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText, findByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'invalidtestuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');
    
    fireEvent.press(getByText('Register'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(findByText('BAD_USERNAME')).toBeTruthy();
      expect(findByText('Username already exist. Cannot register patient user!')).toBeTruthy();
    });
  });

  it('shows an error message when registering account unsuccessfully with invalid credentials - invalid enrolment code', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_USERNAME_AND_CODE',
        message: 'Please check that your username and enrolment code is correct.',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText, findByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'invalid code');
    
    fireEvent.press(getByText('Register'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(findByText('BAD_USERNAME_AND_CODE')).toBeTruthy();
      expect(findByText('Please check that your username and enrolment code is correct.')).toBeTruthy();
    });
  });

  it('shows an error message when registering account unsuccessfully with invalid credentials - hashing error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'HASHING_ERROR',
        message: 'Failed to create patient user due to hashing issues.',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText, findByText } = renderRegister();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'invalidtestuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter the enrollment code'), 'abcdefg');
    
    fireEvent.press(getByText('Register'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(findByText('HASHING_ERROR')).toBeTruthy();
      expect(findByText('Failed to create patient user due to hashing issues.')).toBeTruthy();
    });
  });

  it('shows an error message if username field is empty', async () => {
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

  it('shows an error message if password field is empty', async () => {
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

  it('shows an error message if confirm password field is empty', async () => {
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

  it('shows an error message if enrollment code field is empty', async () => {
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