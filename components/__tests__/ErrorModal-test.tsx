import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorModal from '../ErrorModal'; // Adjust the import according to your file structure

describe('ErrorModal Component', () => {
  const mockSetModalVisible = jest.fn();
  const defaultProps = {
    headerMessage: 'Error Header',
    errorMessage: 'This is an error message.',
    modalVisible: false,
    setModalVisible: mockSetModalVisible,
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render correctly when modalVisible is true', () => {
    const { getByText } = render(
      <ErrorModal {...defaultProps} modalVisible={true} />
    );

    expect(getByText('Error Header')).toBeTruthy();
    expect(getByText('This is an error message.')).toBeTruthy();
    expect(getByText('Dismiss')).toBeTruthy();
  });

  it('should not render when modalVisible is false', () => {
    const { queryByText } = render(<ErrorModal {...defaultProps} />);

    expect(queryByText('Error Header')).toBeNull();
    expect(queryByText('This is an error message.')).toBeNull();
  });

  it('should call setModalVisible with false when Dismiss button is pressed', () => {
    const { getByText } = render(
      <ErrorModal {...defaultProps} modalVisible={true} />
    );

    fireEvent.press(getByText('Dismiss'));
    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });
});
