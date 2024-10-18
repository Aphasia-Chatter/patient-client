import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskDetailsModal from '../TaskDetailsModal'; // Adjust the import based on your file structure

describe('TaskDetailsModal Component', () => {
  const mockSetModalVisible = jest.fn(); // Mock function for setModalVisible

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render task details correctly when modal is visible', () => {
    const { getByText } = render(
      <TaskDetailsModal
        name="Test Task"
        description="This is a test task description."
        status="true"
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
      />
    );

    expect(getByText('Task Details')).toBeTruthy(); // Check if header is rendered
    expect(getByText('Name')).toBeTruthy(); // Check if "Name" label is rendered
    expect(getByText('Test Task')).toBeTruthy(); // Check if task name is rendered
    expect(getByText('Description')).toBeTruthy(); // Check if "Description" label is rendered
    expect(getByText('This is a test task description.')).toBeTruthy(); // Check if description is rendered
    expect(getByText('Status')).toBeTruthy(); // Check if "Status" label is rendered
    expect(getByText('Completed')).toBeTruthy(); // Check if status is rendered as "Completed"
  });

  it('should set the correct status when status prop is "null"', () => {
    const { getByText } = render(
      <TaskDetailsModal
        name="Test Task"
        description="This is a test task description."
        status="null"
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
      />
    );

    expect(getByText('In Progress')).toBeTruthy(); // Check if status is rendered as "In Progress"
  });

  it('should call setModalVisible with false when Dismiss button is pressed', () => {
    const { getByText } = render(
      <TaskDetailsModal
        name="Test Task"
        description="This is a test task description."
        status="true"
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
      />
    );

    fireEvent.press(getByText('Dismiss')); // Simulate button press
    expect(mockSetModalVisible).toHaveBeenCalledWith(false); // Check if setModalVisible is called with false
  });

  it('should not render modal when modalVisible is false', () => {
    const { queryByText } = render(
      <TaskDetailsModal
        name="Test Task"
        description="This is a test task description."
        status="true"
        modalVisible={false}
        setModalVisible={mockSetModalVisible}
      />
    );

    expect(queryByText('Task Details')).toBeNull(); // Ensure modal does not render
  });
});
