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

    const handleRefresh = () => {
        setRefreshIndicator(!refreshIndicator);
        fetchTestDataDetails();
    }

    renderItem = (data) => {

        // Data cards
        return (
            <ClinicalTestDataCard oneRecord={data}/>
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
            <Button onPress={() => nav.navigate('New Clinical Record',{
                patientId: patientDetails._id
            })} title="New Record"></Button>
        </View>
    )
}

export const deleteClinicalData = function(id) {
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

const updatePatientCondition = function(id, newData) {
    console.log(id)

    const updateCondition = async () => {
        await fetch('http://127.0.0.1:3000/patients/' + id, {
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

export const updateClinicalDataCondition = function(id, newData, patientId) {
    //console.log("update " + newData)
    const [patientDetails] = useContext(PageContext)

    const updateClinicalCondition = async () => {
        await fetch('http://127.0.0.1:3000/patients/testdata/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ condition: newData }),
        })
        .then(response => {
            if (response.ok) {
                // Data deleted successfully
                console.log('Data condition updated');
            } 
            else {
                // Error occurred while deleting data
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

    var pCondition = 0;

    if (patientDetails.condition == "critical") pCondition = 5;
    else if (patientDetails.condition == "bad") pCondition = 4;
    else if (patientDetails.condition == "average") pCondition = 3;
    else if (patientDetails.condition == "fine") pCondition = 2;
    else if (patientDetails.condition == "good") pCondition = 1;

    if (conRange > pCondition) {
        console.log("Patient Condition updated")
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