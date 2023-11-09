import { useEffect, useState, createContext, useContext } from "react";
import { Text, StyleSheet, ScrollView, View, FlatList, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Feather, Octicons } from "@expo/vector-icons";
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export const PageContext = createContext();

export default function PatientDetails({route, navigation}) {
    const {id} = route.params;
    const [patientDetails, setPatientDetails] = useState({})
    const [testDataDetails, setTestDataDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    var hasAdditionalNotes = false

    useEffect(() => {
        const fetchPatientDetails = async () => {
            await fetch ('http://127.0.0.1:3000/patients/'+id)
                .then(response => response.json())
                .then(data => {
                    setPatientDetails(data)
                    setIsLoading(false)
                    })
                .catch(error => console.log(error))
        };
        fetchPatientDetails();
    }, []);

    if (isLoading) return (<Text>LOADING</Text>)

    const Tab = createMaterialTopTabNavigator();

    // Main details screen tab navigator
    return (
        <PageContext.Provider value={[patientDetails, setPatientDetails, testDataDetails, setTestDataDetails]}>
            <Tab.Navigator>
                <Tab.Screen name="Patient Details" component={DetailsScreen} />
                <Tab.Screen name="Clinical Test Data" component={ClinicalTestDataScreen} />
            </Tab.Navigator>
        </PageContext.Provider>
    )
}

function DetailsScreen() {

    const [patientDetails] = useContext(PageContext);

    var dateString = new Date(patientDetails.date_of_birth)
    dateString = dateString.toLocaleDateString();

    var hasAdditionalNotes = false

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.name}>{patientDetails.first_name} {patientDetails.last_name}</Text>
                <Text style={styles.header}>Address: </Text>
                <Text style={styles.body}>{patientDetails.address}</Text>
                <Text style={styles.header}>Date of Birth: </Text>
                <Text style={styles.body}>{dateString}</Text>
                <Text style={styles.header}>Gender: </Text>
                <Text style={styles.body}>{patientDetails.gender}</Text>
                <Text style={styles.header}>Department: </Text>
                <Text style={styles.body}>{patientDetails.department}</Text>
                <Text style={styles.header}>Doctor: </Text>
                <Text style={styles.body}>{patientDetails.doctor}</Text>
                {hasAdditionalNotes &&
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.header}>Additional Notes: </Text>
                <Text style={styles.body}>{patientDetails.additional_notes}</Text>
                </View>
                }
            </View>
        </ScrollView>
    )
}

function ClinicalTestDataScreen() {

    const [patientDetails] = useContext(PageContext)

    const [testDataDetails, setTestDataDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [refreshIndicator, setRefreshIndicator] = useState(false);

    // Fetch test data for specific patient
    const fetchTestDataDetails = async () => {
        await fetch ('http://127.0.0.1:3000/patients/'+patientDetails._id+'/testdata')
            .then(response => response.json())
            .then(data => {
                setTestDataDetails(data)
                setIsLoading(false)
            })
            .catch(error => console.log(error))
    };

    useEffect(() => {
        fetchTestDataDetails();
    }, []);

    if (isLoading) return (<Text>LOADING</Text>)

    renderItem = (data) => {
        var dateTimeString = new Date(data.item.date_time)
        var dateString = dateTimeString.toLocaleDateString();
        var timeString = dateTimeString.toLocaleTimeString();
        var condition = 0;
        console.log(data.item.data_type)

        // Data card condition colour switch statement
        switch (data.item.data_type) {
            case 'Blood Pressure':
                var bloodPressure = data.item.reading_value.split("/")
                bloodPressure[1] = bloodPressure[1].split(" ")[0];
                bloodPressure[0] = parseInt(bloodPressure[0], 10)
                bloodPressure[1] = parseInt(bloodPressure[1], 10)

                if ((bloodPressure[0] >= 180) || (bloodPressure[1] >= 120)) condition = 5;
                else if ((bloodPressure[0] >= 140) || (bloodPressure[1] >= 90)) condition = 4;
                else if ((140 > bloodPressure[0] >= 130) && (90 > bloodPressure[1] >= 80)) condition = 3;
                else if ((130 > bloodPressure[0] >= 120) && (bloodPressure[1] > 80)) condition = 2;
                else condition = 1;
                console.log(condition)
                break;
            
            case 'Respiratory Rate':
                var respiratoryRate = data.item.reading_value.split(" ")
                respiratoryRate = parseInt(respiratoryRate[0])

                if (respiratoryRate > 24) condition = 5;
                else if (respiratoryRate > 20) condition = 3;
                else if (20 >= respiratoryRate >= 12) condition = 1;
                break;
            
            case 'Blood Oxygen Level':
                var bloodOxygenLevel = data.item.reading_value.split(" ")
                bloodOxygenLevel = parseInt(bloodOxygenLevel[0])

                if (95 <= bloodOxygenLevel) condition = 1;
                else if (91 <= bloodOxygenLevel <= 95) condition = 2;
                else if (85 < bloodOxygenLevel <= 90 ) condition = 3;
                else if (80 < bloodOxygenLevel <= 85 ) condition = 4;
                else if (bloodOxygenLevel <= 67) condition = 5;
                break;

            case 'Heartbeat Rate':
                var bpm = data.item.reading_value.split(" ")
                bpm = parseInt(bpm[0])

                if (48 <= bpm <= 61) condition = 1;
                else if (62 <= bpm <= 69) condition = 2;
                else if (70 <= bpm <= 73) condition = 3;
                else if (74 <= bpm <= 79) condition = 4;
                else if (80 <= bpm) condition = 5;
                break;
            
            default:
                break;
        }

        // Delete alert
        const createAlert = () => 
            Alert.alert("Delete Clinical Data", "Are you sure you want to delete this data entry?", [
                {
                    text: 'DELETE',
                    onPress: () => {
                        console.log("DELETE Pressed")
                        deleteClinicalData(data.item._id)
                        setRefreshIndicator(true)
                        fetchTestDataDetails()
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel Pressed")
                }
            ]);

        // Data cards
        return (
            <MenuProvider skipInstanceCheck={true}>
                <View style={[ styles.card,
                        condition==1?styles.cardBackground1:null ||
                        condition==2?styles.cardBackground2:null ||
                        condition==3?styles.cardBackground3:null ||
                        condition==4?styles.cardBackground4:null ||
                        condition==5?styles.cardBackground5:null 
                    ]}>
                    <View style={styles.cardContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.typeText, condition==4?{color: '#fff'}:null || condition==5?{color: '#fff'}:null]}>{data.item.data_type}</Text>
                            <Menu>
                                <MenuTrigger>
                                    <Octicons name="three-bars" size={16} style={[{paddingTop: 10}, condition==4?{color: '#fff'}:null || condition==5?{color: '#fff'}:null]} />
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption >
                                        <Text>Edit</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={ () => {
                                        setRefreshIndicator(false)
                                        createAlert()} }>
                                        <Text style={{color: 'red'}}>Delete</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                        <Text style={[styles.readingText, condition==4?{color: '#fff'}:null || condition==5?{color: '#fff'}:null]}>{data.item.reading_value}</Text>
                        <Text style={[styles.body2, condition==5?{color: '#fff'}:null || condition==4?{color: '#fff'}:null]}>{dateString} at {timeString}</Text>
                    </View>
                    
                </View>
            </MenuProvider>
        )
    }

    return (
            <View style={styles.container}>
                <FlatList
                    data = {testDataDetails} 
                    renderItem = {item=> this.renderItem(item)}
                    ListEmptyComponent = {<Text>No Clinical Records</Text>}
                    extraData={refreshIndicator}
                />
            </View>
    )
}

function deleteClinicalData(id) {
    console.log(id)

    const deleteTestData = async () => {
        await fetch('http://127.0.0.1:3000/patients/testdata/'+id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Data deleted successfully
                console.log('Data deleted');
            } 
            else {
                // Error occurred while deleting data
                console.log('Error deleting data');
            }
        })
        .catch(error => {
            // Error occurred while making the request
            console.error('Error:', error);
        });
    };

    return deleteTestData();
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        elevation: 3,
        backgroundColor: '#fff',
        marginHorizontal: 4,
        marginVertical: 6,
        borderRadius: 10
    },
    cardContent: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: 18,
        marginVertical: 10,
        width: '85%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 60,
        paddingBottom: 60,
    },
    header: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    body: {
        fontSize: 16,
        paddingBottom: 20,
    },
    typeText: {
        fontSize: 20,
        flexGrow: 1,
    },
    body2: {
        fontSize: 16,
        flexGrow: 1,
        paddingTop: 10
    },
    readingText: {
        fontSize: 16,
        flexGrow: 1,
        fontWeight: 'bold',
        paddingTop: 5
    },
    cardBackground1: {
        backgroundColor: '#008000'
    },
    cardBackground2: {
        backgroundColor: '#f9e802'
    },
    cardBackground3: {
        backgroundColor: '#f3b610'
    },
    cardBackground4: {
        backgroundColor: '#b94723'
    },
    cardBackground5: {
        backgroundColor: '#9a1b22'
    },
})