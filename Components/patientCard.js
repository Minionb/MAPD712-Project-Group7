import { createContext, useContext} from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Octicons } from "@expo/vector-icons";
import { deletePatient, deletePatientClinicalData } from "./ViewAllPatientsPage";

export const PageContext = createContext();
export const Navigation = createContext();

export default function PatcientCard(props, navigation) {
    // const [nav] = useContext(Navigation)
    console.log(props.onePatient);

    var condition = props.onePatient.item.condition;

    return (
        <MenuProvider skipInstanceCheck={true}>
            <View style={[styles.card, 
                        condition=="good"?styles.cardBackground1:null ||
                        condition=="fine"?styles.cardBackground2:null ||
                        condition=="average"?styles.cardBackground3:null ||
                        condition=="bad"?styles.cardBackground4:null ||
                        condition=="critical"?styles.cardBackground5: styles.cardBackgroundD
                ]}>
                <View style={styles.cardContent}>
                    <Text style={[styles.text, condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]}>{props.onePatient.item.first_name} {props.onePatient.item.last_name}</Text>     
                    <Menu>
                        <MenuTrigger>
                        <Octicons name="three-bars" size={20} style={[condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]}/>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={ () => 
                            { 
                                // nav.navigate('Edit Patients',{
                                    
                                // })
                            }}>
                                <Text>Edit</Text>
                            </MenuOption>
                            <MenuOption onSelect={ () => 
                            { 
                                //setRefreshIndicator(false)
                                createAlert(props.onePatient.item._id) 
                            }}>
                                <Text style={{color: 'red'}}>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        </MenuProvider>
    )
}

// Delete alert
const createAlert = (id) => 
Alert.alert("Delete Patient and Respective Clinical Data", "Are you sure you want to delete this data entry?", [
    {
        text: 'DELETE',
        onPress: () => {
            console.log("DELETE Pressed")
            deletePatient(id)
            deletePatientClinicalData(id)
            //setRefreshIndicator(true)
        }
    },
    {
        text: 'Cancel',
        onPress: () => console.log("Cancel Pressed")
    }
]);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        elevation: 3,
        backgroundColor: '#fff',
        marginHorizontal: 4,
        marginVertical: 6,
        borderRadius: 7,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 18,
        marginVertical: 10,
        width: '85%',
    },
    text: {
        fontSize: 20,
        flexGrow: 1,
    },
    cardBackground1: {
        backgroundColor: '#008000'
    },
    cardBackground2: {
        backgroundColor: '#4cc9f0'
    },
    cardBackground3: {
        backgroundColor: '#f9e802'
    },
    cardBackground4: {
        backgroundColor: '#b94723'
    },
    cardBackground5: {
        backgroundColor: '#9a1b22'
    },
    cardBackgroundD: {
        backgroundColor: '#cccccc'
    }
})