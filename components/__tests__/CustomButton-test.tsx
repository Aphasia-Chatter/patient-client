import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton'; // Adjust the import to your file structure
import { ActivityIndicator } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

// Mock the ActivityIndicator to simplify testing

describe('CustomButton Component', () => {
  const mockPress = jest.fn();

  const renderCustomButton = () => {
    return render(
        <CustomButton title="Click Me" handlePress={mockPress} />
    );
  };

  const renderCustomButtonTwo = () => {
    return render(
        <CustomButton title="Loading..." handlePress={mockPress} isLoading={true} />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title correctly', () => {
    const { getByText } = renderCustomButton();
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should trigger handlePress when pressed', () => {
    const { getByText } = renderCustomButton();

    fireEvent.press(getByText('Click Me'));
    expect(mockPress).toHaveBeenCalled();
  });

  it('should show loading indicator when isLoading is true', () => {
    const { getByText, getByTestId} = renderCustomButtonTwo();

    expect(getByText('Loading...')).toBeTruthy();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should disable the button when isLoading is true', () => {
    const { getByText } = renderCustomButtonTwo();

    const button = getByText('Loading...');
    fireEvent.press(button); // Simulate press

    expect(mockPress).not.toHaveBeenCalled(); // The button should not trigger the handlePress function while loading
  });

  it('should apply custom text styles', () => {
    const customTextStyles = { color: 'blue', fontSize: 20 };

    const { getByText } = render(
      <CustomButton
        title="Custom Text"
        handlePress={mockPress}
        textStyles={customTextStyles}
      />
    );

    const buttonText = getByText('Custom Text');
    expect(buttonText.props.style).toContainEqual(customTextStyles);
  });
});
