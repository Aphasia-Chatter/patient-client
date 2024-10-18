import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DialogModal from '../DialogModal'; // Adjust the import to your file structure

describe('DialogModal Component', () => {
  const mockConfirm = jest.fn();
  const mockDismiss = jest.fn();
  const defaultProps = {
    headerMessage: 'Test Header',
    dialogMessage: 'Test Message',
    modalVisible: false,
    setModalVisible: jest.fn(),
    onConfirm: mockConfirm,
    onDismiss: mockDismiss,
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render correctly when modalVisible is true', () => {
    const { getByText } = render(
      <DialogModal {...defaultProps} modalVisible={true} />
    );

    expect(getByText('Test Header')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('Dismiss')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('should not render when modalVisible is false', () => {
    const { queryByText } = render(<DialogModal {...defaultProps} />);

    expect(queryByText('Test Header')).toBeNull();
    expect(queryByText('Test Message')).toBeNull();
  });

  it('should call onDismiss when the Dismiss button is pressed', () => {
    const { getByText } = render(
      <DialogModal {...defaultProps} modalVisible={true} />
    );

    fireEvent.press(getByText('Dismiss'));
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('should call onConfirm when the Confirm button is pressed', () => {
    const { getByText } = render(
      <DialogModal {...defaultProps} modalVisible={true} />
    );

    fireEvent.press(getByText('Confirm'));
    expect(mockConfirm).toHaveBeenCalled();
  });
});
