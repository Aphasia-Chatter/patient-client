import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Help from '@/app/(drawer)/help';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path

describe('Help Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
      username: "testUser",
      sessionToken: "testSession123"
    },
    setAppUser: mockSetAppUser,
  };

  const renderHelp = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Help />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders the help screen correctly', () => {
    const { getByText } = renderHelp();

    expect(getByText("We're here to help you with anything and everything on AphasiaChatter!")).toBeTruthy();
    expect(getByText('Tutorials')).toBeTruthy();
    expect(getByText('FAQs')).toBeTruthy();
  });

  it('renders the video player for "how to start a practice task?"', async () => {
    const { getByText, queryByTestId } = renderHelp();

    const toggleButton = getByText('How do I start a practice task?');
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(queryByTestId('start-practice-task-video-player')).toBeTruthy();
    });
  });

  it('should expand and collapse the "How do I start a practice task?" section', async () => {
    const { getByText, queryByTestId } = renderHelp();
    
    // Test "How to start a practice task?" collapsible
    const collapsibleTitle = getByText('How do I start a practice task?');
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('start-practice-task-video-player')).toBeTruthy();
    });

    // Collapse it back
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('start-practice-task-video-player')).toBeNull();
    });
  });

  it('should expand and collapse the "How do I update my account password?" section', async () => {
    const { getByText, queryByTestId } = renderHelp();
    
    // Collapse the section
    const collapsibleTitle = getByText('How do I update my account password?');
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('update-account-password-video-player')).toBeTruthy();
    });

    // Collapse it back
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('update-account-password-video-player')).toBeNull();
    });
  });

  it('should expand and collapse the "How do I delete my account?" section', async () => {
    const { getByText, queryByTestId } = renderHelp();
    
    // Collapse the section
    const collapsibleTitle = getByText('How do I delete my account?');
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('delete-account-video-player')).toBeTruthy();
    });

    // Collapse it back
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('delete-account-video-player')).toBeNull();
    });
  });

  it('should collapse other sections when collapse a collapsible section', async () => {
    const { getByText, queryByTestId } = renderHelp();
    
    // Collapse the section
    const collapsibleTitle = getByText('How do I start a practice task?');
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByTestId('start-practice-task-video-player')).toBeTruthy();
    });

    // Collapse it back
    const collapsibleTitleTwo = getByText('How do I update my account password?');
    fireEvent.press(collapsibleTitleTwo);

    await waitFor(() => {
      expect(queryByTestId('start-practice-task-video-player')).toBeNull();
    });
  });
});