import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Chatbot from '@/app/chatbot/chatbot';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen, } from 'expo-router/testing-library';

// Mock the saveValue function and expo-linking
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

const mockSearchParams = { 
  taskCategory: "1",
  filePath: "word_retrevial_task_assets/9109c983-ac97-445d-bd38-bd209c232393.png",
  taskSessionID: "038b546e-4b26-4d5b-9695-ef5850e2f21f",
  taskID: "693ed19e-d84c-43fa-8635-b3d3c4ee2799",
  completedAt: "null",
};

// mock the module using the mock function created above
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => mockSearchParams
}));

describe('Chatbot Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
      username: 'testUser',
      sessionToken: 'testSession123',
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

  // Setting values for the variables
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders word retrieval task image when task, task image, and chat history are retrieved', async () => {
    // Mock the fetch responses

    // First fetch call: task retrieval response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          task: {
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
        'taskSession': {
          taskSessionID: "session789",
          startedAt: new Date("2024-01-02T10:00:00Z"),
          completedAt: null
      }
      }),
    };

    // Second fetch call: task image retrieval response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64'),
      }),
    };

    // Third fetch call: chat history retrieval response
    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg2',
              author: 'bot',
              content: "This is the bot's response",
              timestamp: new Date().toISOString(),
              hasAudio: true,
            },
          ],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { getByRole } = renderChatbot();

    // Wait for the task image to be rendered
    await waitFor(() => {
      const taskTitle = getByRole('image', { name: /word retrieval task image/i, hidden: false })
      expect(taskTitle).toBeTruthy();
    });
  });

  it('renders word retrieval task details when press upon task image after task, task image, and chat history are retrieved', async () => {
    // Mock the fetch responses

    // First fetch call: task retrieval response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          task: {
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
        'taskSession': {
          taskSessionID: "session789",
          startedAt: new Date("2024-01-02T10:00:00Z"),
          completedAt: null
      }
      }),
    };

    // Second fetch call: task image retrieval response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64'),
      }),
    };

    // Third fetch call: chat history retrieval response
    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg2',
              author: 'bot',
              content: "This is the bot's response",
              timestamp: new Date().toISOString(),
              hasAudio: true,
            },
          ],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { getByText, getByRole } = renderChatbot();

    // Wait for the task image to be rendered
    await waitFor(() => {
      const taskImage = getByRole('image', { name: /word retrieval task image/i, hidden: false })
      expect(taskImage).toBeTruthy();

      fireEvent.press(taskImage)
    
      expect(getByText('Name')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
      expect(getByText('Status')).toBeTruthy();
  
      fireEvent.press(getByText('Dismiss'))
      expect(taskImage).toBeTruthy();
    });
  });

  it('renders recording button when task, task image, and chat history are retrieved', async () => {
    // Mock the fetch responses

    // First fetch call: task retrieval response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          task: {
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
        'taskSession': {
          taskSessionID: "session789",
          startedAt: new Date("2024-01-02T10:00:00Z"),
          completedAt: null
      }
      }),
    };

    // Second fetch call: task image retrieval response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64'),
      }),
    };

    // Third fetch call: chat history retrieval response
    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg2',
              author: 'bot',
              content: "This is the bot's response",
              timestamp: new Date().toISOString(),
              hasAudio: true,
            },
          ],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { queryByText, queryByRole } = renderChatbot();

    const startRecordingMessage = queryByText('Tap and say your answer')
    const startRecordingButton = queryByRole('button', { name: /start recording/i, hidden: false })

    // Wait for the task image to be rendered
    await waitFor(() => {
      expect(startRecordingMessage).toBeTruthy();
      expect(startRecordingButton).toBeTruthy();
    });
  });

  it('does not render stop recording button initially when task, task image, and chat history are retrieved', async () => {
    // Mock the fetch responses

    // First fetch call: task retrieval response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          task: {
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
        'taskSession': {
          taskSessionID: "session789",
          startedAt: new Date("2024-01-02T10:00:00Z"),
          completedAt: null
      }
      }),
    };

    // Second fetch call: task image retrieval response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64'),
      }),
    };

    // Third fetch call: chat history retrieval response
    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg2',
              author: 'bot',
              content: "This is the bot's response",
              timestamp: new Date().toISOString(),
              hasAudio: true,
            },
          ],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { queryByRole } = renderChatbot();

    const stopRecordingButton = queryByRole('button', { name: /stop recording/i, hidden: false })

    // Wait for the task image to be rendered
    await waitFor(() => {
      expect(stopRecordingButton).toBeNull();
    });
  });

  it('does not render clear recording button initially when task, task image, and chat history are retrieved', async () => {
    // Mock the fetch responses

    // First fetch call: task retrieval response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'OK',
        message: 'Task found.',
        data: {
          task: {
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
        'taskSession': {
          taskSessionID: "session789",
          startedAt: new Date("2024-01-02T10:00:00Z"),
          completedAt: null
      }
      }),
    };

    // Second fetch call: task image retrieval response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        path: '/path/to/image',
        data: Buffer.from('image_data').toString('base64'),
      }),
    };

    // Third fetch call: chat history retrieval response
    const mockResponseThree = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'message sent successfully!',
        data: {
          messages: [
            {
              id: 'msg1',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg2',
              author: 'bot',
              content: "This is the bot's response",
              timestamp: new Date().toISOString(),
              hasAudio: true,
            },
          ],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { queryByRole } = renderChatbot();

    const clearRecordingButton = queryByRole('button', { name: /clear recording/i, hidden: false })

    // Wait for the task image to be rendered
    await waitFor(() => {
      expect(clearRecordingButton).toBeNull();
    });
  });
});
