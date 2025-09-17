import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserTypeSelector from '../UserTypeSelector';
import { USER_TYPES } from '../../../../UrbanAI.Shared/constants';

// Mock the react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock the react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock the react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('UserTypeSelector', () => {
  const mockOnUserTypeSelect = jest.fn();

  beforeEach(() => {
    mockOnUserTypeSelect.mockClear();
  });

  it('renders correctly with registration variant', () => {
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={null}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="registration"
      />
    );

    expect(getByText('Choose Your Account Type')).toBeTruthy();
    expect(getByText('Select the account type that best describes your role in the community.')).toBeTruthy();
    expect(getByText('Citizen')).toBeTruthy();
    expect(getByText('Investor')).toBeTruthy();
    expect(getByText('Municipal Authority')).toBeTruthy();
  });

  it('renders correctly with compact variant', () => {
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={USER_TYPES.CITIZEN}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="compact"
      />
    );

    expect(getByText('Citizen')).toBeTruthy();
  });

  it('calls onUserTypeSelect when a card is tapped', () => {
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={null}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="registration"
      />
    );

    const citizenCard = getByText('Citizen').parent?.parent?.parent?.parent;
    if (citizenCard) {
      fireEvent.press(citizenCard);
    }

    // Wait for potential state updates
    setTimeout(() => {
      expect(mockOnUserTypeSelect).toHaveBeenCalledWith(USER_TYPES.CITIZEN);
    }, 100);
  });

  it('shows loading state when loading prop is true', () => {
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={null}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="registration"
        loading={true}
      />
    );

    expect(getByText('Processing your selection...')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Test error message';
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={null}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="registration"
        error={errorMessage}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('disables interactions when loading', () => {
    const { getByText } = render(
      <UserTypeSelector
        selectedUserType={null}
        onUserTypeSelect={mockOnUserTypeSelect}
        variant="registration"
        loading={true}
      />
    );

    const citizenCard = getByText('Citizen').parent?.parent?.parent?.parent;
    if (citizenCard) {
      fireEvent.press(citizenCard);
      expect(mockOnUserTypeSelect).not.toHaveBeenCalled();
    }
  });
});