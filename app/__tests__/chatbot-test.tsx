import React from 'react';
import { render, userEvent, fireEvent, waitFor } from '@testing-library/react-native';
import Chatbot from '@/app/chatbot/chatbot';
import { AuthContext } from '@/context/AuthContext'; // Adjust context path
import { renderRouter, screen, } from 'expo-router/testing-library';

// Import the module
import { Audio } from 'expo-av';

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

// Mock the module using the mock function created above
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => mockSearchParams
}));

// Mock the expo-av module
jest.mock('expo-av', () => {
  const actualExpoAv = jest.requireActual('expo-av'); // Import actual module
  return {
    ...actualExpoAv, // Spread the actual module to preserve anything else you might use
    Audio: {
      ...actualExpoAv.Audio, // Spread the actual Audio object to preserve anything else in Audio
      usePermissions: jest.fn(() => [
        {
          granted: true,
          status: 'granted',
          canAskAgain: true,
          expires: 'never',
        },
        jest.fn(), // requestPermission function mock
        jest.fn()  // getPermissions function mock
      ]),
      setAudioModeAsync: jest.fn(), // Mock setAudioModeAsync
      Recording: {
        createAsync: jest.fn(() => Promise.resolve({ recording: {} })), // Mock createAsync
      },
    },
  };
});


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

  it('renders multiple word retrieval task chat conversations in chat history after task, task image, and chat history are retrieved', async () => {
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
            {
              id: 'msg3',
              author: 'user',
              content: "This is the user's message",
              timestamp: new Date().toISOString(),
              hasAudio: false,
            },
            {
              id: 'msg4',
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
    const { getByTestId, getAllByLabelText, getAllByRole} = renderChatbot();

    // Wait for the task image to be rendered
    await waitFor(() => {
      const taskChatHistory = getByTestId('chat-history-list');
      expect(taskChatHistory).toBeDefined();

      expect(getAllByLabelText('bot icon image')).toBeTruthy();
      expect(getAllByLabelText('bot message bubble')).toBeTruthy();
      expect(getAllByLabelText('bot message content')).toBeTruthy();
      expect(getAllByLabelText('bot message tts')).toBeTruthy();
      expect(getAllByRole('button', { name: /bot message tts/i, hidden: false })).toBeTruthy();

      expect(getAllByLabelText('user message bubble')).toBeTruthy();
      expect(getAllByLabelText('user message content')).toBeTruthy();
    });
  });

  it('renders single word retrieval task chat conversation in chat history after task, task image, and chat history are retrieved', async () => {
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
            }
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
    const { getByText, getByTestId, getByLabelText, getByRole} = renderChatbot();

    // Wait for the task image to be rendered
    await waitFor(() => {
      const taskChatHistory = getByTestId('chat-history-list');
      expect(taskChatHistory).toBeDefined();

      expect(getByLabelText('bot icon image')).toBeTruthy();
      expect(getByLabelText('bot message bubble')).toBeTruthy();
      expect(getByLabelText('bot message content')).toBeTruthy();
      expect(getByLabelText('bot message tts')).toBeTruthy();
      expect(getByRole('button', { name: /bot message tts/i, hidden: false })).toBeTruthy();

      expect(getByLabelText('user message bubble')).toBeTruthy();
      expect(getByLabelText('user message content')).toBeTruthy();
    });
  });

  it('renders empty word retrieval task chat history when press upon task image after task, task image, and chat history are retrieved', async () => {
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
          messages: [],
        },
      }),
    };

    // Mock fetch calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse)   // First fetch (task)
      .mockResolvedValueOnce(mockResponseTwo) // Second fetch (task image)
      .mockResolvedValueOnce(mockResponseThree); // Third fetch (chat history)

    // Render the chatbot component
    const { getByText, getByTestId, queryAllByLabelText, queryAllByRole} = renderChatbot();

    // Wait for the task image to be rendered
    await waitFor(() => {
      const taskChatHistory = getByTestId('chat-history-list');
      expect(taskChatHistory).toBeDefined();

      expect(queryAllByLabelText('bot icon image')).toBeUndefined;
      expect(queryAllByLabelText('bot message bubble')).toBeUndefined;
      expect(queryAllByLabelText('bot message content')).toBeUndefined;
      expect(queryAllByLabelText('bot message tts')).toBeUndefined;
      expect(queryAllByRole('button', { name: /bot message tts/i, hidden: false })).toBeUndefined;

      expect(queryAllByLabelText('user message bubble')).toBeUndefined;
      expect(queryAllByLabelText('user message content')).toBeUndefined;
    });
  });

  it('renders start recording button when task, task image, and chat history are retrieved', async () => {
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

  it('renders stop and clear recording buttons when pressed start recording button after task, task image, and chat history are retrieved', async () => {
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
    const { getByRole, queryByText, queryByRole, getByLabelText } = renderChatbot();

    const startRecordingMessage = queryByText('Tap and say your answer')
    const startRecordingButton = queryByRole('button', { name: /start recording/i, hidden: false })

    // Wait for the task image to be rendered
    await waitFor(() => {
      expect(startRecordingMessage).toBeTruthy();
      expect(startRecordingButton).toBeTruthy();
    });

    // Simulate a click on the "Start Recording" button
    fireEvent.press(getByRole('button', { name: /start recording/i }));

    // Wait for the component to rerender and the "Stop Recording" and "Clear Recording" buttons to appear
    await waitFor(() => {
      const stopRecordingButton = getByRole('button', { name: /stop recording/i });
      const clearRecordingButton = getByRole('button', { name: /clear recording/i });

      expect(stopRecordingButton).toBeTruthy();  // Ensure "Stop Recording" button appears
      expect(clearRecordingButton).toBeTruthy(); // Ensure "Clear Recording" button appears
    });
  });

  it('retrieve selected word retrieval task unsuccessfully with invalid session - empty username and session token in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: null,
      setAppUser: mockSetAppUser,
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <Chatbot />
      </AuthContext.Provider>
    );

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('retrieve selected word retrieval task, task image, and chat history unsuccessfully with invalid session - empty username in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "",
        sessionToken: "testSession123"
      },
      setAppUser: mockSetAppUser,
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <Chatbot />
      </AuthContext.Provider>
    );

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('retrieve selected word retrieval task, task image, and chat history unsuccessfully with invalid session - empty session token in context', () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "testUser",
        sessionToken: ""
      },
      setAppUser: mockSetAppUser,
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <Chatbot />
      </AuthContext.Provider>
    );

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });
});
