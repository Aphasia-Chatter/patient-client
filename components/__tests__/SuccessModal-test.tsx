import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SuccessModal from '../SuccessModal'; // Adjust the import according to your file structure

describe('SuccessModal Component', () => {
  const mockOnDismiss = jest.fn();
  const defaultProps = {
    headerMessage: 'Success Header',
    successMessage: 'This is a success message.',
    modalVisible: false,
    onDismiss: mockOnDismiss,
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render correctly when modalVisible is true', () => {
    const { getByText } = render(
      <SuccessModal {...defaultProps} modalVisible={true} />
    );

    expect(getByText('Success Header')).toBeTruthy();
    expect(getByText('This is a success message.')).toBeTruthy();
    expect(getByText('Dismiss')).toBeTruthy();
  });

  it('should not render when modalVisible is false', () => {
    const { queryByText } = render(<SuccessModal {...defaultProps} />);

    expect(queryByText('Success Header')).toBeNull();
    expect(queryByText('This is a success message.')).toBeNull();
  });

  it('should call onDismiss when Dismiss button is pressed', () => {
    const { getByText } = render(
      <SuccessModal {...defaultProps} modalVisible={true} />
    );

    fireEvent.press(getByText('Dismiss'));
    expect(mockOnDismiss).toHaveBeenCalled();
  });
});
