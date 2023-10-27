import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { Feather, Octicons } from "@expo/vector-icons";
import Card from './card'

export default function PatientsList(props) {
  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      await fetch('http://127.0.0.1:3000/patients')
        .then(response => response.json())
        .then(data => setPatients(data))
        .catch(error => console.log(error))
    };
    fetchPatients();
  }, []);
  renderItem = (data) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PatientDetails', {
        id: data.item._id
      })}>
        <Card>
          <Text style={styles.text}>{data.item.first_name} {data.item.last_name}</Text>
          <TouchableOpacity onPress={()=>{}}>
            <Octicons name="three-bars" size={16} style={{paddingTop: 5}} />
          </TouchableOpacity>
        </Card>
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
        data= {patients} 
        renderItem= {item=> this.renderItem(item)} 
      />     
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
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