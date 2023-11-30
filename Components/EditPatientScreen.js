import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditPatientScreen = (props) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [additionalNotes, setAdditionalNotes] = useState(" ")
    const [address, setAddress] = useState("")
    const [department, setDepartment] = useState("")
    const [doctor, setDoctor] = useState("")
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const today = new Date()
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    const currentPatientInfo = props.route.params.currentPatientInfo
    const patientID = currentPatientInfo._id
    const currentFirstName = currentPatientInfo.first_name

    const formattedToday = today.toISOString().split('T')[0]

    console.log(currentFirstName)
    console.log(formattedToday)

    const [genderItems, setGenderItems] = useState([
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'}
      ]);

    const onChange = (event,selectedDate) => {
        const currentDate = selectedDate;
        setDateOfBirth(currentDate);
      };


    const onSubmit = async () => {
      var updatedFields = []
      var updateBody = []
      const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0]
      console.log(formattedDateOfBirth == formattedToday)
      

      if (firstName != ""){
          updatedFields.push("First Name: " + firstName)
          updateBody.push('"first_name": ' + '"' + firstName + '"')
      } 
      if (lastName != ""){
          updatedFields.push("Last Name: " + lastName)
          updateBody.push('"last_name" : ' + '"' + lastName + '"')
      }
      if (gender != ""){
          updatedFields.push("Gender:" + gender)
          updateBody.push('"gender" : ' + '"' + gender + '"')
      }
      if (address != ""){
        updatedFields.push("Address: " + address)
        updateBody.push('"address": ' + '"' + address + '"')
      }
      if (formattedDateOfBirth != formattedToday){
          updatedFields.push("Date of Birth: " + formattedDateOfBirth)
          updateBody.push('"date_of_birth": ' + '"' + formattedDateOfBirth + '"')
      }
      if (department != ""){
          updatedFields.push("Department: " + department)
          updateBody.push('"department": ' + '"' + department + '"')
      }
      if (doctor != ""){
          updatedFields.push("Doctor: " + doctor)
          updateBody.push('"doctor" : '  + '"' + doctor + '"')
      }
      if (additionalNotes != ""){
        updatedFields.push("Additional Notes: " + additionalNotes)
        updateBody.push('"additional_notes" : '  + '"' + additionalNotes + '"')
    }

      const updateBodyString = "{" + updateBody.join(", ") + "}"
      console.log(updateBodyString)

      if (updatedFields.length != 0){
          try {
            // save the update data to DB
            const data = updatePatient(updateBodyString)
            // Process the response data
            console.log(data);

            const confirmUpdatedStatement = "Are you sure you want to update this patient?\n\n" + updatedFields.join(",\n")
            Alert.alert(
              'Update Patient Information',
              confirmUpdatedStatement,
              [
                { text: 'OK', onPress: () => {
                  
                  updatePatient(updateBodyString)

                  setFirstName("")
                  setLastName("")
                  setGender("")
                  setAdditionalNotes("")
                  setAddress("")
                  setDepartment("")
                  setDoctor("")
                  setDateOfBirth(new Date())
                  
                  const infoUpdatedStatement = "You have updated:\n\n" + updatedFields.join(",\n")
                  Alert.alert(
                    'Successfully Updated Patient!',
                    infoUpdatedStatement,
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                  ],
                  { cancelable: false }
                  )} 
                  },            
                  {                     
                    text: 'Cancel',
                    onPress: () => console.log("Cancel Edit Patient Request.")
                  }
              ],);


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
     }
      else{
          Alert.alert(
              'No Information Entered',
              'Please update at least one information to proceed.',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
              ],
              { cancelable: false }
            );
      }
    }

    // Function to send data to db to update patient
    const updatePatient = async (updateBodyString) => {

      const apiURL = apiRenderString + "/" + patientID
      const response = await fetch(apiURL, {
        method: 'Patch',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateBodyString,
      });
      const data = await response.json();
      return data
    };
    

  return (
    <View style={styles.container}>
        <View style={styles.allignComponents}>
            <Text style={styles.text}>Edit First Name: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setFirstName(text)}
            value={firstName} 
            />
        </View>
        <View style={styles.allignComponents}>
            <Text style={styles.text}>Edit Last Name: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setLastName(text)}
            value={lastName} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Gender: </Text>
        <DropDownPicker 
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
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Date of Birth: </Text>
        <View style={styles.dateContainer}>
            <DateTimePicker
            maximumDate= {today}
            testID="dateTimePicker"
            value={dateOfBirth}
            mode= "date"
            is24Hour={true}
            onChange={onChange}
            display="default"
        />
        </View>
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Address: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setAddress(text)}
            value={address} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Department: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setDepartment(text)}
            value={department} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Doctor: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setDoctor(text)}
            value={doctor} 
            />
        </View>
        <View style={styles.allignComponents}>
        <Text style={styles.text}>Edit Additional Notes: </Text>
            <TextInput style={styles.textInput} 
            onChangeText={text => setAdditionalNotes(text)}
            value={additionalNotes} 
            />
        </View>
        <TouchableOpacity style={styles.button}
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
        marginBottom: 15,
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
})

export default EditPatientScreen;