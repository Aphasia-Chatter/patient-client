import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react-native';
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
      json: jest.fn().mockReturnValue(
        Promise.resolve({
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
        })
      ),
    };
    

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByRole } = renderTasks();

    await waitFor(() => {
      expect(getByRole('button', { name: /filter/i, hidden: false })).toBeTruthy();
    });
  });

  it('does not render filter button when retrieved word retrieval tasks is not called', async () => {
    const { queryByRole } = renderTasks();

    await waitFor(() => {
      expect(queryByRole('button', { name: /filter/i, hidden: false })).toBeUndefined;
    });
  });

  it('retrieve word retrieval tasks successfully with valid session', async () => {
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

  it('retrieve word retrieval tasks successfully with valid session after refreshed when pulled down', async () => {    
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

  it('retrieve word retrieval word retrieval tasks unsuccessfully with invalid session - empty username and session token in context', () => {
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

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('retrieve word retrieval tasks unsuccessfully with invalid session - empty username in context', () => {
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

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });
  
  it('retrieve word retrieval word retrieval tasks unsuccessfully with invalid session - empty session token in context', () => {
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

    expect(getByText('INVALID_USERNAME_SESSION')).toBeTruthy();
    expect(getByText('Invalid username and/or session token.')).toBeTruthy();
  });

  it('retrieve word retrieval tasks unsuccessfully with invalid session - invalid session token', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_SESSION_TOKEN',
        message: 'Session token for user does not exist!',
        data: {}
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText } = renderTasks();

    await waitFor(() => {
      expect(getByText('No tasks are found.')).toBeTruthy();
    });
  });

  it('retrieve word retrieval tasks unsuccessfully with invalid session - invalid username', async () => {
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
      expect(getByText('No tasks are found.')).toBeTruthy();
    });
  });

  it('retrieve word retrieval tasks unsuccessfully with invalid session - server error', async () => {
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
      expect(getByText('No tasks are found.')).toBeTruthy();
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
      expect(getByText('No tasks are found.')).toBeTruthy();
    });
  });

  it('retrieve only "Not Started" word retrieval tasks successfully with valid session when filtering', async () => {
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
              status: 'In Progress',
              session: {
                taskSessionID: 'session2',
                startedAt: new Date(),
                completedAt: new Date()
              }
            },
            {
              word_retrieval_task: {
                taskID: '3',
                imagePath: '/path/to/image',
                answer: 'sample answer3',
                inputRestriction: 'none'
              },
              task_editor: {
                taskID: '3',
                staffID: '123',
                role: 'editor'
              },
              task: {
                id: '3',
                name: 'Sample Task 3',
                description: 'This is a sample task description 3',
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

    // Mock the fetch response
    const mockResponseSorted = {
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
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce(mockResponseSorted);

    const { getByRole, getByText, getAllByText, queryByText, getByLabelText } = renderTasks();

    await waitFor(() => {
      expect(getByRole('button', { name: /filter/i, hidden: false })).toBeTruthy();
    });

    fireEvent.press(getByRole('button', { name: /filter/i, hidden: false }));
    expect(getByText('Word Retrieval Task')).toBeTruthy();
    expect(getByText('All')).toBeTruthy();

    fireEvent.press(getByText('All'));
    const dropdownMenu = getByLabelText('task status dropdown');
    const notStartedTasks = within(dropdownMenu).getAllByText('Not Started', { hidden: false }); // Scope search to dropdown
    expect(notStartedTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown
    fireEvent.press(notStartedTasks[0]); // Press the first and only visible element

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getAllByText('Not Started')).toBeTruthy();
      expect(queryByText('In Progress')).toBeNull();
      expect(queryByText('Completed')).toBeNull();
    });
  });

  it('retrieve only "In Progress" word retrieval tasks successfully with valid session when filtering', async () => {
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
              status: 'In Progress',
              session: {
                taskSessionID: 'session2',
                startedAt: new Date(),
                completedAt: new Date()
              }
            },
            {
              word_retrieval_task: {
                taskID: '3',
                imagePath: '/path/to/image',
                answer: 'sample answer3',
                inputRestriction: 'none'
              },
              task_editor: {
                taskID: '3',
                staffID: '123',
                role: 'editor'
              },
              task: {
                id: '3',
                name: 'Sample Task 3',
                description: 'This is a sample task description 3',
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

    // Mock the fetch response
    const mockResponseSorted = {
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
              status: 'In Progress',
              session: {
                taskSessionID: 'session1',
                startedAt: new Date(),
                completedAt: new Date()
              }
            },
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce(mockResponseSorted);

    const { getByRole, getByText, getAllByText, queryByText, getByLabelText } = renderTasks();

    await waitFor(() => {
      expect(getByRole('button', { name: /filter/i, hidden: false })).toBeTruthy();
    });

    fireEvent.press(getByRole('button', { name: /filter/i, hidden: false }));
    expect(getByText('Word Retrieval Task')).toBeTruthy();
    expect(getByText('All')).toBeTruthy();

    fireEvent.press(getByText('All'));
    const dropdownMenu = getByLabelText('task status dropdown');
    const notStartedTasks = within(dropdownMenu).getAllByText('In Progress', { hidden: false }); // Scope search to dropdown
    expect(notStartedTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown
    fireEvent.press(notStartedTasks[0]); // Press the first and only visible element

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getAllByText('In Progress')).toBeTruthy();
      expect(queryByText('Not Started')).toBeNull();
      expect(queryByText('Completed')).toBeNull();
    });
  });

  it('retrieve only "Completed" word retrieval tasks successfully with valid session when filtering', async () => {
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
              status: 'In Progress',
              session: {
                taskSessionID: 'session2',
                startedAt: new Date(),
                completedAt: new Date()
              }
            },
            {
              word_retrieval_task: {
                taskID: '3',
                imagePath: '/path/to/image',
                answer: 'sample answer3',
                inputRestriction: 'none'
              },
              task_editor: {
                taskID: '3',
                staffID: '123',
                role: 'editor'
              },
              task: {
                id: '3',
                name: 'Sample Task 3',
                description: 'This is a sample task description 3',
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

    // Mock the fetch response
    const mockResponseSorted = {
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
              status: 'Completed',
              session: {
                taskSessionID: 'session1',
                startedAt: new Date(),
                completedAt: new Date()
              }
            },
          ],
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce(mockResponseSorted);

    const { getByRole, getByText, getAllByText, queryByText, getByLabelText } = renderTasks();

    await waitFor(() => {
      expect(getByRole('button', { name: /filter/i, hidden: false })).toBeTruthy();
    });

    fireEvent.press(getByRole('button', { name: /filter/i, hidden: false }));
    expect(getByText('Word Retrieval Task')).toBeTruthy();
    expect(getByText('All')).toBeTruthy();

    fireEvent.press(getByText('All'));
    const dropdownMenu = getByLabelText('task status dropdown');
    const notStartedTasks = within(dropdownMenu).getAllByText('Completed', { hidden: false }); // Scope search to dropdown
    expect(notStartedTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown
    fireEvent.press(notStartedTasks[0]); // Press the first and only visible element

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getAllByText('Completed')).toBeTruthy();
      expect(queryByText('Not Started')).toBeNull();
      expect(queryByText('In Progress')).toBeNull();
    });
  });

  it('create a word retrieval task session successfully by pressing on "Not Started" status button', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        status: 'CREATE_WORD_RETRIEVAL_TASK_SESSION_SUCCESS',
        message: 'The new task session for task Sample Task has been created',
        data: {
          taskSessionID: 'taskSession123',
          taskID: '1',
        },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    renderRouter(
      {
        tasks: () => <Tasks {...mockTaskData} />,
        chatbot: () => <Chatbot />
      },
      {
        initialUrl: '/chatbot/chatbot',
      },
    );

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      // Assert that the router.push method was called with the correct URL
      expect(screen).toHavePathname('/chatbot/chatbot');
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - empty username in context', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'MISSING_USERNAME',
        message: 'Username is missing in the request body field.',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('MISSING_USERNAME')).toBeTruthy();
      expect(getByText('Username is missing in the request body field.')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - empty session token in context', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'MISSING_SESSION',
        message: 'Session is missing in the request body field.',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('MISSING_SESSION')).toBeTruthy();
      expect(getByText('Session is missing in the request body field.')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - empty task id', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'MISSING_TASK_ID',
        message: 'Task ID is missing in the request body field.',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('MISSING_TASK_ID')).toBeTruthy();
      expect(getByText('Task ID is missing in the request body field.')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - invalid user-session token', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_SESSION_TOKEN',
        message: 'Session token for user does not exist!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('BAD_SESSION_TOKEN')).toBeTruthy();
      expect(getByText('Session token for user does not exist!')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - task does not exist', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_TASK',
        message: 'Task does not exist!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('BAD_TASK')).toBeTruthy();
      expect(getByText('Task does not exist!')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - task session already exist', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'BAD_TASK_SESSION',
        message: 'Task session already exist!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('BAD_TASK_SESSION')).toBeTruthy();
      expect(getByText('Task session already exist!')).toBeTruthy();
    });
  });

  it('create a word retrieval task session unsuccessfully by pressing on "Not Started" status button - server error', async () => {
    // Mock the fetch response
    const mockResponse = {
      ok: true,
      status: 201,
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

    // Mock the fetch response
    const mockResponseTwo = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        status: 'SERVER_ERROR',
        message: 'Server encountered an error! Contact admin if persists!',
        data: {},
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByText, getAllByText, getByTestId } = renderTasks();

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Not Started')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Not Started'));
      expect(getByText('Start Task')).toBeTruthy();

      fireEvent.press(getByText('Confirm'));

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponseTwo);

      expect(getByText('SERVER_ERROR')).toBeTruthy();
      expect(getByText('Server encountered an error! Contact admin if persists!')).toBeTruthy();
    });
  });

  it('enter an existing word retrieval task session by pressing on "In Progress" status button', async () => {
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
              status: 'In Progress',
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

    const { getByText, getAllByText, getByTestId } = renderTasks();

    renderRouter(
      {
        tasks: () => <Tasks {...mockTaskData} />,
        chatbot: () => <Chatbot />
      },
      {
        initialUrl: '/chatbot/chatbot',
      },
    );

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('In Progress')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('In Progress'));

      // Assert that the router.push method was called with the correct URL
      expect(screen).toHavePathname('/chatbot/chatbot');
    });
  });

  it('enter an existing word retrieval task session by pressing on "Completed" status button', async () => {
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
              status: 'Completed',
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

    const { getByText, getAllByText, getByTestId } = renderTasks();

    renderRouter(
      {
        tasks: () => <Tasks {...mockTaskData} />,
        chatbot: () => <Chatbot />
      },
      {
        initialUrl: '/chatbot/chatbot',
      },
    );

    await waitFor(() => {
      expect(getByTestId('task-list')).toBeTruthy();
      expect(getByText('Sample Task')).toBeTruthy();
      expect(getByText('Completed')).toBeTruthy();
      expect(getAllByText('doctor123')).toBeTruthy();
      expect(getAllByText('Word Retrieval')).toBeTruthy();

      fireEvent.press(getByText('Completed'));

      // Assert that the router.push method was called with the correct URL
      expect(screen).toHavePathname('/chatbot/chatbot');
    });
  });
});