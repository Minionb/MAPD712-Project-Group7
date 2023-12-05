import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddPatientsPage = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [additionalNotes, setAdditionalNotes] = useState(" ")
    const [address, setAddress] = useState("")
    const [department, setDepartment] = useState("")
    const [doctor, setDoctor] = useState("")
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [show, setShow] = useState(Platform.OS === 'android' ? false : true);
    const [plat, setPlat] = useState(Platform.OS)
    const today = new Date()
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    const [genderItems, setGenderItems] = useState([
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'}
      ]);

    const onChange = (event,selectedDate) => {
        if (Platform.OS === 'android') {
          setShow(!show)
        }
        const currentDate = selectedDate;
        setDateOfBirth(currentDate);
    };

    const MyDatePicker = () => {
      if (Platform.OS === 'android') {
        return (
          <TouchableOpacity style={{alignItems: 'center', paddingLeft: 40 }} onPress={() => setShow(true)}>
            <TextInput style={styles.dateButton}
              editable={false}
              placeholder="YYYY-MM-DD"
              value={dateOfBirth.toLocaleDateString()}
              textAlign='center'
            />
          </TouchableOpacity>
        )
      }
      else {
        return null
      }
    }

    const onSubmit = async () => {
      var missingFields = []
      if (firstName == ""){
          missingFields.push("First Name")
      }
      if (lastName == ""){
          missingFields.push("Last Name")
      }
      if (gender == ""){
          missingFields.push("Gender")
      }
      if (dateOfBirth == ""){
          missingFields.push("Date of Birth")
      }
      if (address == ""){
          missingFields.push("Address")
      }
      if (department == ""){
          missingFields.push("Department")
      }
      if (doctor == ""){
          missingFields.push("Doctor")
      }

      if (missingFields.length == 0){
        var dateOfBirthString = (new Date(dateOfBirth)).toLocaleDateString();

        Alert.alert(
          'Create New Patient',
          'Are you sure you want to save this as a new patient entry?\n\nFirst Name: '+ firstName + '\nLast Name: '+ lastName + '\nGender: '+ gender 
                  + "\nAddress: " + address + "\nDate of Birth: " + dateOfBirthString + "\nDepartment: " + department
                  + "\nDoctor: " + doctor + "\nAdditional Notes: " + additionalNotes,
          [
            { text: 'Save', onPress: () => {
              
              try {
                const data = saveData()
                
                Alert.alert(
                  'Successfully Created Patient!',
                  'First Name: '+ firstName + '\nLast Name: '+ lastName + '\nGender: '+ gender 
                  + "\nAddress: " + address + "\nDate of Birth: " + dateOfBirthString + "\nDepartment: " + department
                  + "\nDoctor: " + doctor + "\nAdditional Notes: " + additionalNotes,
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                  ],
                  { cancelable: false }
                );
                setFirstName("")
                setLastName("")
                setGender("")
                setAdditionalNotes("")
                setAddress("")
                setDepartment("")
                setDoctor("")
                setDateOfBirth(new Date())
    
              } catch (error) {
                // Handle any errors that occurred during the API call
                console.error(error);
                Alert.alert(
                  'Server Error! Please contact Support.',
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                  ],
                  { cancelable: false }
                );
              }
            }},
            { text: 'Cancel', onPress: () => console.log('Cancel Create Patient Request')  }
          ],
        );
      }
      else{
          const missingFieldsString = missingFields.join(', ')
          Alert.alert(
              'Missing Fields',
              'You miss the following fields: '+ missingFieldsString + '. Please enter the required fields to proceed.',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
              ],
              { cancelable: false }
            );
      }
    }

    // Function to send data to db
    const saveData = async () => {
      const response = await fetch(apiRenderString, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            address: address,
            date_of_birth: dateOfBirth,
            department: department,
            doctor: doctor,
            additional_notes: additionalNotes,
        }),
      });
      const data = await response.json();
      // Process the response data
      console.log(data);
      return data
    };
    

  return (
    <View style={styles.container}>
        <View style={styles.allignComponents}>
            <Text testID="firstName" style={styles.text}>First Name: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setFirstName(text)}
            value={firstName} 
            />
        </View>
        <View style={styles.allignComponents}>
            <Text style={styles.text}>Last Name: </Text>
            <TextInput testID="lastName" style={styles.textInput} 
            onChangeText={text => setLastName(text)}
            value={lastName} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Gender: </Text>
        <DropDownPicker testID="gender"
            open={open}
            value={gender}
            items={genderItems}
            setOpen={setOpen}
            setValue={setGender}
            setItems={setGenderItems}
            placeholder="Select Gender"
            containerStyle={{height:115,width: 175, }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
        />
        </View>
        <View style={[styles.allignComponents, plat == 'android' ? {paddingLeft: 145} : null ]}>
        <Text style={styles.text}>Date of Birth: </Text>
        <MyDatePicker/>
        <View style={styles.dateContainer}>
            {show && <DateTimePicker 
            maximumDate= {today}
            testID="dateTimePicker"
            value={dateOfBirth}
            mode= "date"
            is24Hour={true}
            onChange={onChange}
            display="default"
        />}
        </View>
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Address: </Text>
            <TextInput testID="address" style={styles.textInput} 
            onChangeText={text => setAddress(text)}
            value={address} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Department: </Text>
            <TextInput testID="department" style={styles.textInput} 
            onChangeText={text => setDepartment(text)}
            value={department} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Doctor: </Text>
            <TextInput testID="doctor" style={styles.textInput} 
            onChangeText={text => setDoctor(text)}
            value={doctor} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Additional Notes: </Text>
            <TextInput testID="additionalNotes" style={styles.textInput} 
            onChangeText={text => setAdditionalNotes(text)}
            value={additionalNotes} 
            />
        </View>
        <TouchableOpacity testID="submitButton" style={styles.button}
            onPress={() => onSubmit()}>
            <Text>Submit</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    textInput:{
        alignSelf: 'center',
        fontSize: 20,
        borderColor:"black",
        marginBottom: 5,
        color: 'black',
        width: 200,
        height: 30,
        borderWidth: 2,
        backgroundColor: 'white',
        paddingLeft: 5,
        marginBottom: 15,
      },
      text:{
        fontSize: 20,
        marginBottom: 15,
        width: 155,
      },
      allignComponents: {
        flexDirection: 'row',
        marginBottom: 20,
      },
      pickerStyle: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, 
      },
      dateContainer: {
        width: 200,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        width: 120,
        height: 45,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      dateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        backgroundColor: 'white', 
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 8
      }
})

export default AddPatientsPage;