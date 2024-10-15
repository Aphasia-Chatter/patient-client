import React from 'react';
import { render, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
import ChangePassword from '@/app/account/change_password';
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
    global.fetch = jest.fn(); // Mocking the fetch function
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

  it('show change account password dialog box when filled up the change password form', async () => {
    // Mock the fetch response
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });
  });

  it('change account password successfully with valid credentials', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'CHANGE_ACCOUNT_PASSWORD_SUCCESS',
        message: 'Patient account password update is successful. You will be logged out now.'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        changePassword: () => <ChangePassword/>,
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

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('CHANGE_ACCOUNT_PASSWORD_SUCCESS')).toBeTruthy();
      expect(getByText('Patient account password update is successful. You will be logged out now.')).toBeTruthy();
    });

    fireEvent.press(getByText('Dismiss'));

    expect(screen).toHavePathname('/login');
  });

  it('change account password unsuccessfully with invalid credentials - empty username and session token in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "",
        sessionToken: ""
      },
      setAppUser: mockSetAppUser,
    };

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <ChangePassword />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('change account password unsuccessfully with invalid credentials - empty username in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "",
        sessionToken: "testSession123"
      },
      setAppUser: mockSetAppUser,
    };

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <ChangePassword />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('change account password unsuccessfully with invalid credentials - empty session token in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "testuser",
        sessionToken: ""
      },
      setAppUser: mockSetAppUser,
    };

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <ChangePassword />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('change account password unsuccessfully with invalid credentials - invalid user-session token', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_SESSION_TOKEN',
        message: 'Session token for user does not exist!'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        changePassword: () => <ChangePassword/>,
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

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('BAD_SESSION_TOKEN')).toBeTruthy();
      expect(getByText('Session token for user does not exist!')).toBeTruthy();
    });
  });

  it('change account password unsuccessfully with invalid credentials - invalid current password', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'CHANGE_ACCOUNT_PASSWORD_FAILURE',
        message: 'Incorrect current password! Unable to update patient account password.'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        changePassword: () => <ChangePassword/>,
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

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('CHANGE_ACCOUNT_PASSWORD_FAILURE')).toBeTruthy();
      expect(getByText('Incorrect current password! Unable to update patient account password.')).toBeTruthy();
    });
  });

  it('change account password unsuccessfully with invalid credentials - hashing error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'HASHING_ERROR',
        message: 'Failed to update patient account new password due to hashing issues.'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        changePassword: () => <ChangePassword/>,
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

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('HASHING_ERROR')).toBeTruthy();
      expect(getByText('Failed to update patient account new password due to hashing issues.')).toBeTruthy();
    });
  });

  it('change account password unsuccessfully with invalid credentials - server error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({
        status: 'SERVER_ERROR',
        message: 'Server encountered an error! Contact admin if persists!'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        changePassword: () => <ChangePassword/>,
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

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    fireEvent.press(getByText('Update Password'));
    
    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('SERVER_ERROR')).toBeTruthy();
      expect(getByText('Server encountered an error! Contact admin if persists!')).toBeTruthy();
    });
  });

  it('shows error message when change account password unsuccessfully with network request timeout', async () => {
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
  
    const { getByPlaceholderText, getByText, findByText } = renderChangePassword();
  
    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');
    
    // Simulate pressing the login button
    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('Change Account Password')).toBeTruthy();
      expect(getByText('Are you sure you want to update your account password?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));
  
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

  it('shows error message when current password field is empty', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), '');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password456');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password456');

    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('Please enter your current password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows error message when new password field is empty', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), '');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password456');

    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('Please enter your new password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows error message when confirm new password field is empty', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password456');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), '');

    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('Please re-confirm your new password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows error message when new passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password456');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'abcdefg');

    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('INCORRECT_NEW_PASSWORDS')).toBeTruthy();
      expect(getByText('Please re-confirm your new passwords.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });

  it('shows error message when new passwords are the same as the current password', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your current password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your new password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your confirm password'), 'password123');

    fireEvent.press(getByText('Update Password'));

    await waitFor(() => {
      expect(getByText('INVALID_NEW_PASSWORDS')).toBeTruthy();
      expect(getByText('Please check that your new password is not the same as old password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });
});