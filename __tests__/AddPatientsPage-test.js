import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddPatientsPage from '../Components/AddPatientsPage';

describe('AddPatientsPage Component Test', () => {
  it('renders all TextInput fields correctly', () => {
      const { getByTestId } = render(<AddPatientsPage />);
      
      const firstNameInput = getByTestId('firstName');
      expect(firstNameInput).toBeDefined();
  
      const lastNameInput = getByTestId('lastName');
      expect(lastNameInput).toBeDefined();

      const address = getByTestId('address');
      expect(address).toBeDefined();

      const department = getByTestId('department');
      expect(department).toBeDefined();
  
      const doctor = getByTestId('doctor');
      expect(doctor).toBeDefined();

      const additionalNotes = getByTestId('additionalNotes');
      expect(additionalNotes).toBeDefined();

    });

    it('renders Gender Dropdown Box & Birthday Date Time Picker fields correctly', () => {
      const { getByTestId } = render(<AddPatientsPage />);
      
      const genderInput = getByTestId('gender');
      expect(genderInput).toBeDefined();
  
      const DateTimePicker = getByTestId('dateTimePicker');
      expect(DateTimePicker).toBeDefined();
  
    });

  // Add more test cases for other functionality and edge cases
});