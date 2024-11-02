import React from 'react';
import { render, fireEvent, within, waitFor, cleanup, act } from '@testing-library/react-native';
import TaskFilterModal from '../TaskFilterModal'; // Adjust import based on your file structure
import DropDownPicker from 'react-native-dropdown-picker';

describe('TaskFilterModal Component', () => {
  const mockSetModalVisible = jest.fn();
  const mockOnConfirm = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
    cleanup();
  });

  it('should render correctly when modal is visible', () => {
    const { getByText, getByLabelText } = render(
      <TaskFilterModal
        headerMessage="Filter Tasks"
        taskFilterMessage="Select your filters"
        currentTaskCategoryValue={1}
        currentTaskStatusValue={1}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onConfirm={mockOnConfirm}
      />
    );

    expect(getByText('Filter Tasks')).toBeTruthy(); // Check header message
    expect(getByText('Select your filters')).toBeTruthy(); // Check filter message
    expect(getByLabelText('task type dropdown')).toBeTruthy(); // Check category placeholder
    expect(getByLabelText('task status dropdown')).toBeTruthy(); // Check status placeholder
  });

  it('should close the modal when Dismiss button is pressed', () => {
    const { getByText } = render(
      <TaskFilterModal
        headerMessage="Filter Tasks"
        taskFilterMessage="Select your filters"
        currentTaskCategoryValue={1}
        currentTaskStatusValue={1}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.press(getByText('Dismiss')); // Simulate pressing Dismiss button
    expect(mockSetModalVisible).toHaveBeenCalledWith(false); // Check if modal is closed
  });

  test.skip('should call onConfirm with the selected category and status', async () => {
    const { getByText, getByLabelText } = render(
      <TaskFilterModal
        headerMessage="Filter Tasks"
        taskFilterMessage="Select your filters"
        currentTaskCategoryValue={1}
        currentTaskStatusValue={1}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onConfirm={mockOnConfirm}
      />
    );

    // Open category dropdown and select a value
    const dropdownMenu = getByLabelText('task type dropdown');
    const categoryTasks = within(dropdownMenu).getAllByText('Word Retrieval Task', { hidden: false }); // Scope search to dropdown
    expect(categoryTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown

    await (async() => {
      fireEvent.press(categoryTasks[0]); // Press the first and only visible element
    });

    // Open status dropdown and select a value
    waitFor(async () => {
        const dropdownMenuTwo = getByLabelText('task status dropdown');
        expect(dropdownMenuTwo).toBeTruthy();
    
        const notStartedTasks = within(dropdownMenuTwo).getAllByText('In Progress', { hidden: false }); // Scope search to dropdown
        expect(notStartedTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown
        
        await (async() => {
          fireEvent.press(notStartedTasks[0]); // Press the first and only visible element
        });

        await (async() => {
          fireEvent.press(getByText('Confirm')); // Simulate pressing Confirm button
        });

        expect(mockOnConfirm).toHaveBeenCalledWith(1, 3); // Verify onConfirm was called with correct values
    });
  });

  test.skip('should not call onConfirm when selected values are the same as current values', async () => {
    const { getByText, getByLabelText } = render(
      <TaskFilterModal
        headerMessage="Filter Tasks"
        taskFilterMessage="Select your filters"
        currentTaskCategoryValue={1}
        currentTaskStatusValue={1}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onConfirm={mockOnConfirm}
      />
    );

    // Open category dropdown and select the same value
    const dropdownMenu = getByLabelText('task type dropdown');
    const categoryTasks = within(dropdownMenu).getAllByText('Word Retrieval Task', { hidden: false }); // Scope search to dropdown
    expect(categoryTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown

    await (async() => {
      fireEvent.press(categoryTasks[0]); // Press the first and only visible element
    });

    // Open status dropdown and select the same value
    waitFor(async () => {
        const dropdownMenuTwo = getByLabelText('task status dropdown');
        const notStartedTasks = within(dropdownMenuTwo).getAllByText('All', { hidden: false }); // Scope search to dropdown
        expect(notStartedTasks.length).toBe(1); // Ensure there's one visible "Not Started" task in the dropdown

        await (async() => {
          fireEvent.press(notStartedTasks[0]); // Press the first and only visible element
          fireEvent.press(getByText('Confirm')); // Simulate pressing Confirm button
        });

        expect(mockOnConfirm).not.toHaveBeenCalled(); // Ensure onConfirm is not called
    });
  });

  it('should not render when modalVisible is false', () => {
    const { queryByText } = render(
      <TaskFilterModal
        headerMessage="Filter Tasks"
        taskFilterMessage="Select your filters"
        currentTaskCategoryValue={1}
        currentTaskStatusValue={1}
        modalVisible={false} // Modal is not visible
        setModalVisible={mockSetModalVisible}
        onConfirm={mockOnConfirm}
      />
    );

    expect(queryByText('Filter Tasks')).toBeNull(); // Ensure modal does not render
  });
});
