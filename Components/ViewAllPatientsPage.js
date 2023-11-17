import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View, FlatList } from 'react-native';
import { Feather, Octicons } from "@expo/vector-icons";
import PatientCard from './patientCard';

export default function PatientsList(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [clicked, setClicked] = useState(false);
  const [patients, setPatients] = useState([]);
  const [refreshIndicator, setRefreshIndicator] = useState(false);

  const fetchPatients = async () => {
    await fetch('http://127.0.0.1:3000/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error))
  };

  const getPatientsByName = async (firstName, lastName) => {
    var endpoint = 'http://127.0.0.1:3000/patients'
    if (firstName != '' && lastName != ''){
      endpoint = 'http://127.0.0.1:3000/patients?first_name=' + firstName + '&last_name=' + lastName
      console.log(firstName)
      console.log(lastName)
    }
    else if (firstName != ''){
      endpoint = 'http://127.0.0.1:3000/patients?first_name=' + firstName
      console.log(firstName)
    }
    else if (lastName != ''){
      endpoint = 'http://127.0.0.1:3000/patients?last_name=' + lastName
      console.log(lastName)
    }
    await fetch (endpoint)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRefresh = () => {
    setRefreshIndicator(!refreshIndicator);
    fetchPatients();
}

  renderItem = (item) => {
    console.log(item.item)

    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Patient Details', {
        id: item.item._id
      })}>
        <PatientCard onePatient={item}/>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableHighlight onPress={()=>{handleRefresh()}}>
          <View style={{paddingRight: 5, paddingTop: 3}}>
            <Octicons name='arrow-switch' size={24}/>
          </View>
        </TouchableHighlight>
        <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder='First Name'
          onChangeText={text=>setFirstName(text)}
          onFocus={() => {setClicked(true);}}
        />
        </View>
        <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder='Last Name'
          onChangeText={text=>setLastName(text)}
          onFocus={() => {setClicked(true);}}
        />
        </View>
        <TouchableHighlight onPress={()=>{getPatientsByName(firstName,lastName)}}>
          <Octicons
            name="search"
            size={22}
            color="black"
             style={{marginLeft: 1, paddingLeft: 2}}
          />
        </TouchableHighlight>

        <TouchableHighlight onPress={()=>{}}>
          <View style={{paddingLeft: 5, paddingTop: 3}}>
            <Octicons name='filter' size={24}/>
          </View>
        </TouchableHighlight>
      </View>
      <FlatList
        data = {patients} 
        renderItem = {item=> this.renderItem(item)}
        extraData={refreshIndicator}
      />     
    </View>
  )
};

export const deletePatient = function(id) {
  console.log(id)

  const deletePatientData = async () => {
    await fetch('http://127.0.0.1:3000/patients/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Patient deleted successfully
            console.log('Patient deleted');
        } 
        else {
            // Error occurred while deleting data
            console.log('Error deleting patient');
        }
    })
    .catch(error => {
        // Error occurred while making the request
        console.error('Error:', error);
    });
  };

return deletePatientData();
}

export const deletePatientClinicalData = function(id) {
  console.log(id)

  const deleteRespectivePatientClinicalData = async () => {
      await fetch('http://127.0.0.1:3000/patients/'+id + '/testdata', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (response.ok) {
              // Patient deleted successfully
              console.log('Patient clinical data deleted');
          } 
          else {
              // Error occurred while deleting data
              console.log('Error deleting patient clinical data');
          }
      })
      .catch(error => {
          // Error occurred while making the request
          console.error('Error:', error);
      });
  };

  return deleteRespectivePatientClinicalData();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    padding: 10,
    minHeight: 50,
  },
  searchBar: {
    flexDirection: 'row',
    width: '40%',
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 60,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '80%'
  },
});