import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Tasks, { TaskData } from '@/app/(drawer)/tasks';
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

describe('Tasks Screen', () => {
  // Mock AuthContext with appUser and setAppUser
  const mockSetAppUser = jest.fn();
  const mockAuthContext = {
    appUser: {
      username: "testUser",
      sessionToken: "testSession123"
    },
    setAppUser: mockSetAppUser,
  };
  
  // Define mock TaskData
  const mockTaskData: TaskData = {
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
  };

  const renderTasks = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <Tasks {...mockTaskData} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    global.fetch = jest.fn(); // Mock fetch
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders correctly with initial state', () => {
    const { getByText } = renderTasks();

    const taskTitle = getByText('Word Retrieval');

    expect(taskTitle).toBeTruthy();
  });

  it('renders filter button when retrieved tasks', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'Word retrieval tasks successfully retrieved',
        data: {
          tasks: [
            {
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
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByRole } = renderTasks();

    await waitFor(() => {
      expect(getByRole('button', { name: /filter/i, hidden: false })).toBeTruthy();
    });
  });

  it('does not render filter button when retrieved tasks is not called', async () => {
    const { queryByRole } = renderTasks();

    await waitFor(() => {
      expect(queryByRole('button', { name: /filter/i, hidden: false })).toBeUndefined;
    });
  });

  it('retrieve tasks successfully with valid session', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'Word retrieval tasks successfully retrieved',
        data: {
          tasks: [
            {
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
            },
            {
              word_retrieval_task: {
                taskID: '2',
                imagePath: '/path/to/image',
                answer: 'sample answer2',
                inputRestriction: 'none'
              },
              task_editor: {
                taskID: '2',
                staffID: '123',
                role: 'editor'
              },
              task: {
                id: '2',
                name: 'Sample Task 2',
                description: 'This is a sample task description 2',
                taskVisibility: 'public',
                createdAt: new Date().toISOString(),
              },
              staff: {
                id: '123',
                username: 'doctor123',
                hashedPassword: 'hashed_password123'
              },
              status: 'Completed',
              session: {
                taskSessionID: 'session2',
                startedAt: new Date(),
                completedAt: new Date()
              }
            }
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Sample Task 2')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();
    });
  });

  it('retrieve tasks successfully with valid session after refreshed when pulled down', async () => {    
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        message: 'Word retrieval tasks successfully retrieved',
        data: {
          tasks: [
            {
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
            },
            {
              word_retrieval_task: {
                taskID: '2',
                imagePath: '/path/to/image',
                answer: 'sample answer2',
                inputRestriction: 'none'
              },
              task_editor: {
                taskID: '2',
                staffID: '123',
                role: 'editor'
              },
              task: {
                id: '2',
                name: 'Sample Task 2',
                description: 'This is a sample task description 2',
                taskVisibility: 'public',
                createdAt: new Date().toISOString(),
              },
              staff: {
                id: '123',
                username: 'doctor123',
                hashedPassword: 'hashed_password123'
              },
              status: 'Completed',
              session: {
                taskSessionID: 'session2',
                startedAt: new Date(),
                completedAt: new Date()
              }
            }
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      const flatList = getByTestId('task-list');

      expect(flatList).toBeDefined();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Sample Task 2')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();
      expect(fetch).toHaveBeenCalledTimes(1);

      const { refreshControl } = flatList.props;

      if (flatList != undefined || null)
        refreshControl.props.onRefresh();
        expect(fetch).toHaveBeenCalled();
    });

  });

  it('retrieve tasks unsuccessfully with invalid session - empty username and session token in context', async () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "",
        sessionToken: ""
      },
      setAppUser: mockSetAppUser,
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <Tasks {...mockTaskData} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('There was a problem with the network request.')).toBeTruthy();
    });
  });

  it('retrieve tasks unsuccessfully with invalid session - empty username in context', async () => {
    const mockSetAppUser = jest.fn();
    const mockInvalidAuthContext = {
      appUser: {
        username: "",
        sessionToken: "session123"
      },
      setAppUser: mockSetAppUser,
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockInvalidAuthContext}>
        <Tasks {...mockTaskData} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('There was a problem with the network request.')).toBeTruthy();
    });
  });
  
  it('retrieve tasks unsuccessfully with invalid session - empty session token in context', async () => {
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
        <Tasks {...mockTaskData} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('There was a problem with the network request.')).toBeTruthy();
    });
  });

  it('retrieve tasks unsuccessfully with invalid session - invalid username', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_USERNAME',
        message: 'User does not exist!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText } = renderTasks();

    await waitFor(() => {
      expect(getByText('No word retrieval tasks found.')).toBeTruthy();
    });
  });

  it('retrieve tasks unsuccessfully with invalid session - invalid username', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_USERNAME',
        message: 'User does not exist!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText } = renderTasks();

    await waitFor(() => {
      expect(getByText('No word retrieval tasks found.')).toBeTruthy();
    });
  });

  it('retrieve tasks unsuccessfully with invalid session - server error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'SERVER_ERROR',
        message: 'Server encountered an error! Contact admin if persists!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText } = renderTasks();

    await waitFor(() => {
      expect(getByText('No word retrieval tasks found.')).toBeTruthy();
    });
  });

  it('retrieve zero tasks successfully with valid session', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'FAILED',
        message: 'No word retrieval tasks found!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText } = renderTasks();

    await waitFor(() => {
      expect(getByText('No word retrieval tasks found.')).toBeTruthy();
    });
  });
});