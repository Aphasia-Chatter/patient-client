import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Chatbot from '@/app/chatbot/chatbot';
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

describe('Chatbot Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
      username: "testUser",
      sessionToken: "testSession123"
    },
    setAppUser: mockSetAppUser,
  };

  const renderChatbot = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Chatbot />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders correctly with initial state', () => {
    const mockTaskSession = {
        taskSessionID: 'taskSession123',
        completedAt: null, // Ensure completedAt is null
    };

    const { getByText } = renderChatbot(mockTaskSession);

    // Expect the task title to be rendered
    const taskTitle = getByText('Tap and say your answer');
    expect(taskTitle).toBeTruthy();
  });

  it('renders record button with initial state', () => {
    const { getByText } = renderTasks();

    const taskTitle = getByText('Tap and say your answer');

    expect(taskTitle).toBeTruthy();
  });
});