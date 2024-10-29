import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InformativeModal from '../InformativeModal'; // Adjust the import based on your file structure

describe('InformativeModal Component', () => {
  const mockSetModalVisible = jest.fn();

  const defaultProps = {
    headerMessage: 'Test Header',
    informativeMessage: 'This is a test message.',
    modalVisible: true,
    setModalVisible: mockSetModalVisible,
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(<InformativeModal {...defaultProps} />);
    
    expect(getByText('Test Header')).toBeTruthy(); // Check header
    expect(getByText('This is a test message.')).toBeTruthy(); // Check message
    expect(getByText('Dismiss')).toBeTruthy(); // Check dismiss button
  });

  it('should call setModalVisible with false when dismiss button is pressed', () => {
    const { getByText } = render(<InformativeModal {...defaultProps} />);
    const dismissButton = getByText('Dismiss');

    fireEvent.press(dismissButton); // Simulate press
    expect(mockSetModalVisible).toHaveBeenCalledWith(false); // Check if setModalVisible was called with false
  });

  it('should not render when modalVisible is false', () => {
    const { queryByText } = render(<InformativeModal {...{ ...defaultProps, modalVisible: false }} />);
    
    expect(queryByText('Test Header')).toBeNull(); // Header should not be found
    expect(queryByText('This is a test message.')).toBeNull(); // Message should not be found
  });

  it('should handle modal close request', () => {
    const { getByText } = render(<InformativeModal {...defaultProps} />);
    
    // Simulate closing the modal (note: this may not have visual effects in the test environment)
    fireEvent(getByText('Dismiss'), 'onRequestClose'); // This may vary based on your testing setup
    // Verify Alert is triggered in the console if necessary (not usually tested in unit tests)
  });
});
