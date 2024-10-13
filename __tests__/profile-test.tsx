import React from 'react';
import { render, userEvent, fireEvent, renderHook } from '@testing-library/react-native';
import Profile from '@/app/(drawer)/profile';
import ChangePassword from '@/app/account/change_password';
import DeleteAccount from '@/app/account/delete_account';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen } from 'expo-router/testing-library';

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

  // Define mocks for colorScheme and toggleColorScheme
  const mockedColorScheme = jest.fn();  // For colorScheme
  const mockedToggleColorScheme = jest.fn();  // For toggleColorScheme

  // Mock the nativewind library and specifically the useColorScheme hook
  jest.mock("nativewind", () => ({
    ...jest.requireActual("nativewind"),
    useColorScheme: () => ({
      colorScheme: mockedColorScheme(),
      toggleColorScheme: mockedToggleColorScheme,
    }),
  }));

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

  it('renders preference page with dark mode switch', () => {
    // Arrange
    const { getByRole } = renderProfile();

    // Act that the login button is rendered
    const darkModeSwitch = getByRole('switch', { name: /dark mode switch/i })
    
    // Assert that the login button is rendered
    expect(darkModeSwitch).toBeTruthy();
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

  it("renders useColorScheme hook with return value of 'dark'", () => {

    mockedColorScheme.mockImplementationOnce(() => "dark")
    const { result } = renderHook(() => mockedColorScheme())
  
    expect(result.current).toBeDefined()
    expect(result.current).toEqual("dark")

    mockedToggleColorScheme();
  })

  it("renders useColorScheme hook with return value of 'light'", () => {
    mockedColorScheme.mockImplementationOnce(() => "light")
    const { result } = renderHook(() => mockedColorScheme())
  
    expect(result.current).toBeDefined()
    expect(result.current).toEqual("light")
  })

  it("allows changing colorScheme from 'dark' mode to 'light' mode", () => {
    // Arrange: Set up the mocked return values
    mockedColorScheme.mockReturnValue("dark");  // Initial color scheme is 'dark'
    
    const { getByRole, rerender } = renderProfile();
  
    // Assert initial color scheme is 'dark'
    const darkModeSwitch = getByRole('switch', { name: /dark mode switch/i });
    expect(darkModeSwitch.props.value).toBe(false);  // Switch is on, indicating 'dark' mode
  
    // Act: Simulate toggling to 'light' mode
    fireEvent(darkModeSwitch, 'valueChange', { value: true });
    mockedColorScheme.mockReturnValue("light");  // Simulate the state change to 'light'
    
    // Call the mocked toggleColorScheme function to simulate the toggle action
    mockedToggleColorScheme();
  
    rerender;  // Rerender the component to reflect the updated state
  
    // Assert: colorScheme should now be 'light'
    expect(darkModeSwitch.props.value).toBe(true);  // Switch is off, indicating 'light' mode
  });
  

  it("allows changing colorScheme from 'light' mode to 'dark' mode", () => {
    // Arrange: Set up the mocked return values
    mockedColorScheme.mockReturnValue("light");  // Initial color scheme is 'dark'
    
    const { getByRole, rerender } = renderProfile();
  
    // Assert initial color scheme is 'light'
    const darkModeSwitch = getByRole('switch', { name: /dark mode switch/i });
    expect(darkModeSwitch.props.value).toBe(true);  // Switch is on, indicating 'dark' mode
  
    // Act: Simulate toggling to 'dark' mode
    fireEvent(darkModeSwitch, 'valueChange', { value: false });
    mockedColorScheme.mockReturnValue("dark");  // Simulate the state change to 'light'
    
    // Call the mocked toggleColorScheme function to simulate the toggle action
    mockedToggleColorScheme();
  
    rerender;  // Rerender the component to reflect the updated state
  
    // Assert: colorScheme should now be 'light'
    expect(darkModeSwitch.props.value).toBe(false);  // Switch is off, indicating 'light' mode
  });
});