import React, { useState } from 'react';
import { render, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
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

  it('should expand and collapse the collapsible sections', async () => {
    const { getByText, queryByText } = renderHelp();
    
    // Test "How to start a practice task?" collapsible
    const collapsibleTitle = getByText('How to start a practice task?');
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(getByText('Word Retrieval Practice Task')).toBeTruthy();
    });

    // Collapse it back
    fireEvent.press(collapsibleTitle);

    await waitFor(() => {
      expect(queryByText('Word Retrieval Practice Task')).toBeNull();
    });
  });

  it('renders the video player for "how to start a practice task?"', async () => {
    const { getByText, getByTestId  } = renderHelp();

    // Optionally, you may need to trigger the opening of the Collapsible component
    const toggleButton = getByText('How to start a practice task?'); // Replace with the actual toggle button text
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(getByText('Word Retrieval Practice Task')).toBeTruthy();
    });

    // Use findByRole to find the video element by accessibilityRole="image"
    const videoComponent = getByTestId('help-video-player');

    await waitFor(() => {
      expect(videoComponent).toBeTruthy();
    });
  });
});