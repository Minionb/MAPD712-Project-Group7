import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewClinicalRecord from '../Components/NewClinicalRecordScreen';

describe('NewClinicalRecord', () => {
    it('updates reading value based user input', () => {
      const mockParams = {
        selectedPatientId: 'patient123',
        patientName: 'John Ho',
      };
  
      const { getByTestId } = render(
        <NewClinicalRecord route={{ params: mockParams }} navigation={{}} />
      );
  
      // Mock user input
      const readingValueInput = getByTestId('reading-value-input');
  
      // Enter reading value
      fireEvent.changeText(readingValueInput, '20');
  
      // Check if the reading value is updated correctly
      expect(readingValueInput.props.value).toBe('20');
    });


    it('displays error message if data type is not selected', () => {
        const mockParams = {
          selectedPatientId: 'patient123',
          patientName: 'John Doe',
        };
    
        const { getByText } = render(
          <NewClinicalRecord route={{ params: mockParams }} navigation={{}} />
        );
    
        // Mock user input
        const saveButton = getByText('Save Record');
    
        // Submit form without selecting data type
        fireEvent.press(saveButton);
    
        // Check if the error message is displayed
        const errorMessage = getByText('*Invalid Data Type*');
        expect(errorMessage).toBeTruthy();
      });
  });