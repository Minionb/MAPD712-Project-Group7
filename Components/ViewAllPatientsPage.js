import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Image, FlatList, Alert } from 'react-native';
import { Feather, Octicons } from "@expo/vector-icons";
import Card from './card'
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default function PatientsList(props) {
  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [patients, setPatients] = useState([]);
  const [refreshIndicator, setRefreshIndicator] = useState(false);

  const fetchPatients = async () => {
    await fetch('http://127.0.0.1:3000/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.log(error))
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  renderItem = (data) => {

    
    function deletePatient(id) {
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
  
  function deletePatientClinicalData(id) {
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
  
    // Delete alert
    const createAlert = () => 
    Alert.alert("Delete Patient and Respective Clinical Data", "Are you sure you want to delete this data entry?", [
        {
            text: 'DELETE',
            onPress: () => {
                console.log("DELETE Pressed")
                deletePatient(data.item._id)
                deletePatientClinicalData(data.item._id)
                setRefreshIndicator(true)
                fetchPatients()
            }
        },
        {
            text: 'Cancel',
            onPress: () => console.log("Cancel Pressed")
        }
    ]);

    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PatientDetails', {
        id: data.item._id
      })}>
        <MenuProvider skipInstanceCheck={true}>
        <Card>
          <Text style={styles.text}>{data.item.first_name} {data.item.last_name}</Text>     
          <Menu>
            <MenuTrigger>
              <Octicons name="three-bars" size={20} />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption >
                    <Text>Edit</Text>
                </MenuOption>
                <MenuOption onSelect={ () => 
                { setRefreshIndicator(false)
                  createAlert() 
                }
                }>
                    <Text style={{color: 'red'}}>Delete</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
        </Card>
        </MenuProvider>
        
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableHighlight onPress={()=>{}}>
          <View style={{paddingRight: 5, paddingTop: 3}}>
            <Octicons name='arrow-switch' size={24}/>
          </View>
        </TouchableHighlight>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="black"
            style={{marginLeft: 1, paddingLeft: 5}}
          />
          <TextInput
            style={styles.input}
            placeholder='Search patient'
            onChangeText={text=>setSearch(text)}
            onFocus={() => {setClicked(true);}}
          />
        </View>
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
    width: '85%',
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
  text: {
    fontSize: 20,
    flexGrow: 1,
  },
});