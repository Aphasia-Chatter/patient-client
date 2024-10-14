import React from 'react';
import { render, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
import DeleteAccount from '@/app/account/delete_account';
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

describe('Delete Account Screen', () => {
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
    global.fetch = jest.fn(); // Mocking the fetch function
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

  it('show delete account dialog box when filled up the delete account form', async () => {
    // Mock the fetch response
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Delete Account Permanently'));
    
    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
      expect(getByText('Are you sure you want to delete this account? The action cannot be reverted.')).toBeTruthy();
    });
  });

  it('change account account successfully with valid credentials', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'DELETE_ACCOUNT_SUCCESS',
        message: 'Patient deletion is successful. You will be logged out now.'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        deleteAccount: () => <DeleteAccount />,
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

    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Delete Account Permanently'));
    
    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
      expect(getByText('Are you sure you want to delete this account? The action cannot be reverted.')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('DELETE_ACCOUNT_SUCCESS')).toBeTruthy();
      expect(getByText('Patient deletion is successful. You will be logged out now.')).toBeTruthy();
    });

    fireEvent.press(getByText('Dismiss'));

    expect(screen).toHavePathname('/login');
  });

  it('change account account successfully with valid credentials - invalid current password', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'DELETE_ACCOUNT_FAILURE',
        message: 'Incorrect password! Unable to delete patient account.'
      }),
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = renderChangePassword();

    renderRouter(
      {
        deleteAccount: () => <DeleteAccount />,
        login: () => (
            <AuthContext.Provider value={mockAuthContext}>
                <Login />
            </AuthContext.Provider>
        ),
      },
      {
        initialUrl: '/delete_account',
      },
    );

    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Delete Account Permanently'));
    
    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
      expect(getByText('Are you sure you want to delete this account? The action cannot be reverted.')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('DELETE_ACCOUNT_FAILURE')).toBeTruthy();
      expect(getByText('Incorrect password! Unable to delete patient account.')).toBeTruthy();
    });
  });

  it('change account account successfully with valid credentials - server error', async () => {
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
        deleteAccount: () => <DeleteAccount />,
        login: () => (
            <AuthContext.Provider value={mockAuthContext}>
                <Login />
            </AuthContext.Provider>
        ),
      },
      {
        initialUrl: '/delete_account',
      },
    );

    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Delete Account Permanently'));
    
    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
      expect(getByText('Are you sure you want to delete this account? The action cannot be reverted.')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('SERVER_ERROR')).toBeTruthy();
      expect(getByText('Server encountered an error! Contact admin if persists!')).toBeTruthy();
    });
  });

  it('shows error message when delete account unsuccessfully with network request timeout', async () => {
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
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    // Simulate pressing the login button
    fireEvent.press(getByText('Delete Account Permanently'));

    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
      expect(getByText('Are you sure you want to delete this account? The action cannot be reverted.')).toBeTruthy();
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

  it('shows error message when password field is empty', async () => {
    const { getByPlaceholderText, getByText } = renderChangePassword();

    fireEvent.changeText(getByPlaceholderText('Enter your password'), '');

    fireEvent.press(getByText('Delete Account Permanently'));

    await waitFor(() => {
      expect(getByText('Please enter your password.')).toBeTruthy(); // Adjust error message based on your implementation
    });
  });
});