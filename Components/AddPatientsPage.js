import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const AddPatientsPage = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
  return (
    <View style={styles.container}>
      <Text>First Name: </Text>
      <TextInput style={styles.textInput} 
      onChangeText={text => setFirstName(text)}
      value={firstName} 
      />

      <Text>Last Name: </Text>
      <TextInput style={styles.textInput} 
      onChangeText={text => setLastName(text)}
      value={lastName} 
      />
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
        width: 100,
        height: 30,
        borderWidth: 2,
        borderRadius: 50,
        backgroundColor: 'white',
      },

})

export default AddPatientsPage;