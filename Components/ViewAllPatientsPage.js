import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Feather, Octicons } from "@expo/vector-icons";

const AddPatientsPage = () => {
  const [search, setSearch] = useState('')
  const [clicked, setClicked] = useState(false)

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
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default AddPatientsPage;

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
});