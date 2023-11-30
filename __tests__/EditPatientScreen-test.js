import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditPatientScreen from '../Components/EditPatientScreen';

describe('EditPatientScreen', () => {
    const currentPatientInfo = {
      firstName: 'John',
      lastName: 'Ho',
      gender: 'Male',
      dateOfBirth: '1943-01-01',
      address: 'Downtown',
      department: 'A',
      doctor: 'Dr. Smith',
      additionalNotes: 'Diabetes',
    };
  
    const patientID = '12345';
  
    it('renders without crashing', () => {
      render(<EditPatientScreen route={{ params: { currentPatientInfo, patientID } }} />);
    });
  
    it('updates first name field', () => {
      const { getByTestId } = render(<EditPatientScreen route={{ params: { currentPatientInfo, patientID } }}/>);
      const firstNameInput = getByTestId('edit-first-name-input');
      fireEvent.changeText(firstNameInput, 'Jane');
      expect(firstNameInput.props.value).toBe('Jane');
    });
  
    it('updates last name field', () => {
      const { getByTestId } = render(<EditPatientScreen route={{ params: { currentPatientInfo, patientID } }}/>);
      const lastNameInput = getByTestId('edit-last-name-input');
      fireEvent.changeText(lastNameInput, 'Smith');
      expect(lastNameInput.props.value).toBe('Smith');
    });
  
  });