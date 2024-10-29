import React from 'react';
import { Text } from "react-native";
import { render, fireEvent, } from '@testing-library/react-native';
import { Collapsible } from '../Collapsible'; // Assuming this is the path of your component
import { Feather } from '@expo/vector-icons';

// Mock Feather and useColorScheme
jest.mock('@expo/vector-icons', () => ({
  Feather: jest.fn(() => null),
}));

describe('Collapsible Component', () => {
  const title = 'Test Title';
  const onPressMock = jest.fn();

  const renderCollapsible = () => {
    return render(
        <Collapsible title={title} isOpen={false} onPress={onPressMock}>
            <Text>Collapsible Content</Text>
        </Collapsible>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with title and not display children when closed', () => {
    const { queryByText, getByText } = renderCollapsible();

    expect(getByText(title)).toBeTruthy(); // Title should be visible
    expect(queryByText('Collapsible Content')).toBeNull(); // Content should not be visible
  });

  it('should display children when opened', () => {
    const { getByText } = render(
      <Collapsible title={title} isOpen={true} onPress={onPressMock}>
        <Text>Collapsible Content</Text>
      </Collapsible>
    );

    expect(getByText('Collapsible Content')).toBeTruthy(); // Content should be visible
  });

  it('should trigger onPress when button is pressed', () => {
    const { getByText } = render(
      <Collapsible title={title} isOpen={false} onPress={onPressMock}>
        <Text>Collapsible Content</Text>
      </Collapsible>
    );

    fireEvent.press(getByText(title)); // Simulate press on title
    expect(onPressMock).toHaveBeenCalled(); // Check if onPress was called
  });

  it('should show "plus" icon when closed and "minus" icon when opened', () => {
    const { rerender } = render(
      <Collapsible title={title} isOpen={false} onPress={onPressMock}>
        <Text>Collapsible Content</Text>
      </Collapsible>
    );

    // Check for "plus" icon
    expect(Feather).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'plus' }),
      {}
    );

    // Rerender with isOpen = true
    rerender(
      <Collapsible title={title} isOpen={true} onPress={onPressMock}>
        <Text>Collapsible Content</Text>
      </Collapsible>
    );

    // Check for "minus" icon
    expect(Feather).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'minus' }),
      {}
    );
  });
});
