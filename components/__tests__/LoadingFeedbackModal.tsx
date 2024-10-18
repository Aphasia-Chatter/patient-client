import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoadingFeedbackModal from '../LoadingFeedbackModal'; // Adjust the import based on your file structure

describe('LoadingFeedbackModal Component', () => {
  const mockSetModalVisible = jest.fn(); // Mock function for setModalVisible

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should render loading modal when modalVisible is true', () => {
    const { getByText, getByTestId } = render(
      <LoadingFeedbackModal modalVisible={true} setModalVisible={mockSetModalVisible} />
    );

    expect(getByText('Loading...')).toBeTruthy(); // Check if loading text is displayed
    expect(getByTestId('loading-indicator')).toBeTruthy(); // Check if activity indicator is displayed
  });

  it('should not render loading modal when modalVisible is false', () => {
    const { queryByText } = render(
      <LoadingFeedbackModal modalVisible={false} setModalVisible={mockSetModalVisible} />
    );

    expect(queryByText('Loading...')).toBeNull(); // Check if loading text is not found
  });
});
