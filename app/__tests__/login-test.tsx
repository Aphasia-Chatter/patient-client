import React from 'react';
import { render, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import Register from '@/app/(auth)/register';
import Preference from '@/app/(auth)/preference';
import Tasks, { TaskData } from '@/app/(drawer)/tasks';
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

describe('Login Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: null, // Assuming user is not logged in initially
    setAppUser: mockSetAppUser,
  };

  // Define mock TaskData
  const mockTaskData: TaskData = {
    word_retrieval_task: {
      taskID: '1',
      imagePath: '/path/to/image',
      answer: 'sample answer',
      inputRestriction: 'none'
    },
    task_editor: {
      taskID: '1',
      staffID: '123',
      role: 'editor'
    },
    task: {
      id: '1',
      name: 'Sample Task',
      description: 'This is a sample task description',
      taskVisibility: 'public',
      createdAt: new Date().toISOString(),
    },
    staff: {
      id: '123',
      username: 'staff1',
      hashedPassword: 'hashed_password'
    },
    status: 'completed',
    session: {
      taskSessionID: 'session1',
      startedAt: new Date(),
      completedAt: new Date()
    }
  };

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Login />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch
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

  it('login account successfully with valid credentials', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue({
        status: 'LOGIN_SUCCESS',
        message: 'Login successful, save the session token inside data!',
        data: {
          username: 'testuser',
          sessionToken: 'mockedToken123'
        },
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderLogin();

    renderRouter(
      {
        login: () => <Login/>,
        Tasks: () => <Tasks {...mockTaskData} />
      },
      {
        initialUrl: '/(drawer)/tasks',
      },
    );

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      // Assert that the username and session saved into auth context
      expect(mockSetAppUser).toHaveBeenCalledWith({
        username: 'testuser',
        sessionToken: 'mockedToken123',
      });

      // Assert that the router.push method was called with the correct URL
      expect(screen).toHavePathname('/(drawer)/tasks');
    });
  });

  it('shows error message when login account unsuccessfully with network request timeout', async () => {
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
  
    const { getByPlaceholderText, getByText, findByText } = renderLogin();
  
    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
  
    // Simulate pressing the login button
    fireEvent.press(getByText('Login'));
  
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

  it('shows an error message when logging in account unsuccessfully with invalid credentials - invalid username', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_USERNAME',
        message: 'User does not exist!',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderLogin();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'invalidtestuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(getByText('BAD_USERNAME')).toBeTruthy();
      expect(getByText('User does not exist!')).toBeTruthy();
    });
  });

  it('shows an error message when logging in account unsuccessfully with invalid credentials - invalid password', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_PASSWORD',
        message: 'Password mismatch!',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderLogin();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'invalidpassword');
    
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(getByText('BAD_PASSWORD')).toBeTruthy();
      expect(getByText('Password mismatch!')).toBeTruthy();
    });
  });

  it('shows an error message when logging in account unsuccessfully with invalid credentials - server error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'SERVER_ERROR',
        message: 'Server encountered an error! Contact admin if persists!',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderLogin();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(getByText('SERVER_ERROR')).toBeTruthy();
      expect(getByText('Server encountered an error! Contact admin if persists!')).toBeTruthy();
    });
  });

  it('shows error message when username field is missing', async () => {
    const { getByPlaceholderText, getByText, findByText } = renderLogin();

    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Login'));
    
    const errorHeader = await findByText('MISSING_USERNAME');
    const errorMessage = await findByText('Please enter your username.');
    
    expect(errorHeader).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  it('shows error message when password field is missing', async () => {
    const { getByPlaceholderText, getByText, findByText } = renderLogin();

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.press(getByText('Login'));
    
    const errorHeader = await findByText('MISSING_PASSWORD');
    const errorMessage = await findByText('Please enter your password.');
    
    expect(errorHeader).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });
});