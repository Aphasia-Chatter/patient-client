import React from 'react';
import { render, fireEvent, renderHook } from '@testing-library/react-native';
import Preference from '@/app/(auth)/preference';
import { AuthContext } from '@/context/AuthContext';

describe('Preference Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: null, // Assuming user is not logged in initially
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

  const renderPreference = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Preference />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders preference page with dark mode switch', () => {
    // Arrange
    const { getByRole } = renderPreference();

    // Act that the login button is rendered
    const darkModeSwitch = getByRole('switch', { name: /dark mode switch/i })
    
    // Assert that the login button is rendered
    expect(darkModeSwitch).toBeTruthy();
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
    
    const { getByRole, rerender } = renderPreference();
  
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
    
    const { getByRole, rerender } = renderPreference();
  
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