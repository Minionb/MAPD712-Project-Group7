import { useEffect, useState, createContext, useContext } from "react";
import { Text, StyleSheet, View, FlatList, Button} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ClinicalTestDataCard from './clinicalTestDataCard'
import PatientDeatialsTabScreen from "./patientDetailsTabScreen";

export const PageContext = createContext();
export const Navigation = createContext();

export default function PatientDetails({route, navigation}) {
    const {id} = route.params;
    const [patientDetails, setPatientDetails] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    var hasAdditionalNotes = false
    
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    useEffect(() => {
        const fetchPatientDetails = async () => {
            await fetch (apiRenderString + '/' + id)
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
        <PageContext.Provider value={[patientDetails, setPatientDetails]}>
            <Navigation.Provider value={[navigation]}>
                <Tab.Navigator>
                    <Tab.Screen name="Patient Info" component={DetailsScreen} />
                    <Tab.Screen name="Clinical Test Data" component={ClinicalTestDataScreen} />
                </Tab.Navigator>
            </Navigation.Provider>
        </PageContext.Provider>
    )
}

function DetailsScreen() {

    const [patientDetails] = useContext(PageContext);

    return (
        <PatientDeatialsTabScreen details={patientDetails} />
    )
}

function ClinicalTestDataScreen() {

    const [patientDetails] = useContext(PageContext)
    const [nav] = useContext(Navigation)

    const [testDataDetails, setTestDataDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [refreshIndicator, setRefreshIndicator] = useState(false);
    //const [patientCondition, setPatientCondition] = useState(0)
    var patientCondition = 0
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    // Fetch test data for specific patient
    const fetchTestDataDetails = async () => {
        await fetch (apiRenderString+'/'+patientDetails._id+'/testdata')
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

    const handleRefresh = () => {
        fetchTestDataDetails();
        setRefreshIndicator(!refreshIndicator);
    }
    const patientName = patientDetails.first_name + " " + patientDetails.last_name

    renderItem = (data) => {

        console.log('\nRecord Condition: ' + data.item.condition + '\n');
        if (data.item.condition == 'good') {
            if (1 > patientCondition) {
                patientCondition = 1
                console.log("\nPatient condition set to good")
            }
        }
        else if (data.item.condition == 'fine') {
            if (2 > patientCondition) {
                patientCondition = 2
                console.log("Patient condition set to fine")
            }
        }
        else if (data.item.condition == 'average') {
            if (3 > patientCondition) {
                patientCondition = 3
                console.log("Patient condition set to average")
            }
        }
        else if (data.item.condition == 'bad') {
            if (4 > patientCondition) {
                patientCondition = 4
                console.log("Patient condition set to bad")
            }
        }
        else if (data.item.condition == 'critical') {
            patientCondition = 5
            console.log("Patient condition set to critical")
        }

        // Data cards
        return (
            <ClinicalTestDataCard oneRecord={data} patientName={patientName} selectedPatientId={patientDetails._id} patientCondition={patientCondition} navigation={nav} />
        )
    }

    return (
        <View style={styles.container}>
            <Button onPress={() => {handleRefresh()}} title="Refresh"></Button>
            <FlatList
                data = {testDataDetails} 
                renderItem = {item=> this.renderItem(item)}
                ListEmptyComponent = {<Text>No Clinical Records</Text>}
                extraData={refreshIndicator}
            />
            {/* <Button onPress={() => nav.navigate('New Clinical Record',{
                patientId: patientDetails._id
            })} title="New Record"></Button> */}
            <Button onPress={() => nav.navigate('New Clinical Record',{
                selectedPatientId: patientDetails._id,
                patientName: patientDetails.first_name + " " + patientDetails.last_name
            })} title="New Record" />
        </View>
    )
}

export const deleteClinicalData = function(id) {
    console.log(id)
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    const deleteTestData = async () => {
        await fetch(apiRenderString+'/testdata/'+id, {
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

const updatePatientCondition = function(id, newData) {
    console.log(id)
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    const updateCondition = async () => {
        await fetch(apiRenderString + '/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ condition: newData }),
        })
        .then(response => {
            if (response.ok) {
                // Data deleted successfully
                console.log('Patient condition updated');
            } 
            else {
                // Error occurred while deleting data
                console.log('Error updating patient condition');
            }
        })
        .catch(error => {
            // Error occurred while making the request
            console.error('Error:', error);
        });
    }
    return updateCondition();
}

export const updateClinicalDataCondition = function(id, newData, patientId, pCondition) {
    //console.log("update " + newData)
    const [patientDetails] = useContext(PageContext)
    const apiString = 'http://127.0.0.1:3000/patients'
    const apiRenderString = 'https://mapd713-project-group7.onrender.com/patients'

    const updateClinicalCondition = async () => {
        await fetch(apiRenderString + '/testdata/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ condition: newData }),
        })
        .then(response => {
            if (response.ok) {
                // Data condition updated successfully
                console.log('Data condition updated');
            } 
            else {
                // Error occurred while updating data condition
                console.log('Error updating data condition');
            }
        })
        .catch(error => {
            // Error occurred while making the request
            console.error('Error:', error);
        });
    }
    
    var conRange = 0;

    if (newData == "critical") conRange = 5;
    else if (newData == "bad") conRange = 4;
    else if (newData == "average") conRange = 3;
    else if (newData == "fine") conRange = 2;
    else if (newData == "good") conRange = 1;

    console.log("PCondition: " + pCondition + "\nconRange: " + conRange)

    if (conRange >= pCondition) {
        console.log("Patient Condition updated to: " + newData)
        updatePatientCondition(patientId, newData)
    }

    //console.log(patientDetails.condition)
    return updateClinicalCondition();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})