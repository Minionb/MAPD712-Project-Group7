import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, View } from 'react-native';

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
                    setIsLoading(false)})
                .catch(error => console.log(error))
        };
        fetchPatientDetails();
    }, []);

    if (isLoading) return (<Text>LOADING</Text>)

    var dateString = new Date(patientDetails.date_of_birth)
    dateString = dateString.toLocaleDateString();

    if (patientDetails.additional_notes != ""){
        hasAdditionalNotes = true
    }

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

const styles = StyleSheet.create({
    scrollContainer: {
        alignSelf:'stretch',
        marginLeft:20,
        marginRight: 10,
        marginTop: 10,
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
    }
})