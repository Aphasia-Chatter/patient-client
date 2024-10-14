// import React from 'react';
// import { render, fireEvent, userEvent } from '@testing-library/react-native';
// import Tasks, { TaskFilterType, TaskData } from '@/app/(drawer)/tasks';
// import Chatbot from '@/app/chatbot/chatbot';
// import { AuthContext } from '@/context/AuthContext'; // Adjust context path
// import { renderRouter, screen } from 'expo-router/testing-library';

// // Mock the saveValue function and router
// jest.mock('@/utils/SecureStore', () => ({
//   saveValue: jest.fn(),
// }));

// describe('Tasks Screen', () => {
//   // Mock AuthContext with appUser and setAppUser
//   const mockSetAppUser = jest.fn();
//   const mockAuthContext = {
//     appUser: {
//       username: "testUser",
//       sessionToken: "testSession123"
//     },
//     setAppUser: mockSetAppUser,
//   };
  
//   // Define mock TaskData
//   const mockTaskData: TaskData = {
//     word_retrieval_task: {
//       taskID: '1',
//       imagePath: '/path/to/image',
//       answer: 'sample answer',
//       inputRestriction: 'none'
//     },
//     task_editor: {
//       taskID: '1',
//       staffID: '123',
//       role: 'editor'
//     },
//     task: {
//       id: '1',
//       name: 'Sample Task',
//       description: 'This is a sample task description',
//       taskVisibility: 'public',
//       createdAt: new Date().toISOString(),
//     },
//     staff: {
//       id: '123',
//       username: 'staff1',
//       hashedPassword: 'hashed_password'
//     },
//     status: 'completed',
//     session: {
//       taskSessionID: 'session1',
//       startedAt: new Date(),
//       completedAt: new Date()
//     }
//   };
//   const renderTasks = () => {
//     return render(
//       <AuthContext.Provider value={mockAuthContext}>
//         <Tasks {...mockTaskData} />
//       </AuthContext.Provider>
//     );
//   };

//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mocks before each test
//   });
// });