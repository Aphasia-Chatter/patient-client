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

  it('does not renders word retrieval task image when task is not retrieved', () => {
    // Mock the fetch response
    // Get word retrieval task
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          tasks: {
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
              username: 'doctor123',
              hashedPassword: 'hashed_password123'
            },
            status: 'Not Started',
            session: {
              taskSessionID: 'session1',
              startedAt: new Date(),
              completedAt: new Date()
            }
          }
        },
        taskSession: {
          taskSessionID: 'taskSession1',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      }),
    };

    // Get word retrieval image
    const mockResponseTwo = {
      ok: true,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64')
      }),
      send: jest.fn()
    };

    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        taskSessionID: 'session1',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: 'This is the user\'s message',
              timestamp: new Date().toISOString(),
              hasAudio: false
            },
            {
              id: 'msg2',
              author: 'bot',
              content: 'This is the bot\'s response',
              timestamp: new Date().toISOString(),
              hasAudio: true
            }
          ]
        }
      })
    };


    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce(mockResponseTwo).mockResolvedValueOnce(mockResponseThree);

    const { getByRole } = renderChatbot();

    const taskTitle = getByRole('image', { name: /word retrieval task image/i, hidden: false })

    expect(taskTitle).toBeTruthy();
  });
});