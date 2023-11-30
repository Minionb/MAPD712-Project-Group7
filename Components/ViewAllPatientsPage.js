import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View, FlatList } from 'react-native';
import { Feather, Octicons } from "@expo/vector-icons";
import PatientCard from './patientCard';

export default function PatientsList(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [condition, setCondition] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [patients, setPatients] = useState([]);
  const [refreshIndicator, setRefreshIndicator] = useState(false);

  const apiString = 'http://127.0.0.1:3000/patients'
  const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

  const fetchPatients = async () => {
    await fetch(apiRenderString)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error))
  };

  const getPatientsByCondition = async (conditionNum) => {
    var endpoint = apiRenderString
    var condition = ''

    if (conditionNum == 1) {
      condition = 'critical'
    }
    else if (conditionNum == 2) {
      condition = 'bad'
    }
    else if (conditionNum == 3) {
      condition = 'average'
    }
    else if (conditionNum == 4) {
      condition = 'fine'
    }
    else if (conditionNum == 5) {
      condition = 'good'
    }

    if (condition != ''){
      endpoint = apiRenderString + '?condition=' + condition
      console.log(condition)
    }
    await fetch (endpoint)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error))
  }

  const getPatientsByName = async (firstName, lastName) => {
    var endpoint = apiRenderString
    if (firstName != '' && lastName != ''){
      endpoint = apiRenderString + '?first_name=' + firstName + '&last_name=' + lastName
      console.log(firstName)
      console.log(lastName)
    }
    else if (firstName != ''){
      endpoint = apiRenderString + '?first_name=' + firstName
      console.log(firstName)
    }
    else if (lastName != ''){
      endpoint = apiRenderString + '?last_name=' + lastName
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
        <TouchableHighlight onPress={()=>{
            setCondition(1)
            handleRefresh()
            
          }}>
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

        <TouchableHighlight onPress={()=>{
          if (condition == 0) {
            setCondition(1)
          }
          if (condition == 1) {
            setCondition(2)
          }
          if (condition == 2) {
            setCondition(3)
          }
          if (condition == 3) {
            setCondition(4)
          }
          if (condition == 4) {
            setCondition(5)
          }
          if (condition == 5) {
            setCondition(1)
          }

          getPatientsByCondition(condition)
        }}>
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

export const sortPatient = function(count) {
  console.log(count)
}

export const deletePatient = function(id) {
  console.log(id)
  const apiString = 'http://127.0.0.1:3000/patients'
  const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

  const deletePatientData = async () => {
    await fetch(apiRenderString + '/'+id, {
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
  const apiString = 'http://127.0.0.1:3000/patients'
  const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

  const deleteRespectivePatientClinicalData = async () => {
      await fetch(apiRenderString + '/' + id + '/testdata', {
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