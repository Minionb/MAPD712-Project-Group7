import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditClinicalRecord from '../Components/EditClinicalRecordScreen';

describe('EditClinicalRecord', () => {
  test('displays error message for invalid input', () => {
    const mockParams = {
      selectedPatientId: 'patient123',
      patientName: 'John Ho',
      currentClinicalDataInfo: {
        _id: 'record123',
      },
    };

    const { getByText } = render(
      <EditClinicalRecord route={{ params: mockParams }} navigation={{}} />
    );

    // Mock user input
    const saveButton = getByText('Update Record');

    // Mock API response
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    // Submit form without selecting data type and reading value
    fireEvent.press(saveButton);

    // Check if the error message for data type is displayed
    const dataTypeErrorMessage = getByText('*Invalid Data Type*');
    expect(dataTypeErrorMessage).toBeTruthy();

    // Check if the error message for reading value is displayed
    const readingValueErrorMessage = getByText('*Invalid Value*');
    expect(readingValueErrorMessage).toBeTruthy();

    // Check if the API request is not made
    expect(fetch).not.toHaveBeenCalled();
  });
});