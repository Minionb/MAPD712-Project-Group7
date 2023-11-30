import { Text, StyleSheet, ScrollView, View } from 'react-native';

export default function PatientDeatialsTabScreen(props) {

    var dateString = new Date(props.details.date_of_birth)
    dateString = dateString.toISOString().split('T')[0];
    var additional_notes = props.details.additional_notes
    
    var hasAdditionalNotes = false
    if (additional_notes != ""){
        hasAdditionalNotes = true
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.name}>{props.details.first_name} {props.details.last_name}</Text>
                <Text style={styles.header}>Address: </Text>
                <Text style={styles.body}>{props.details.address}</Text>
                <Text style={styles.header}>Date of Birth: </Text>
                <Text style={styles.body}>{dateString}</Text>
                <Text style={styles.header}>Gender: </Text>
                <Text style={styles.body}>{props.details.gender}</Text>
                <Text style={styles.header}>Department: </Text>
                <Text style={styles.body}>{props.details.department}</Text>
                <Text style={styles.header}>Doctor: </Text>
                <Text style={styles.body}>{props.details.doctor}</Text>
                {hasAdditionalNotes &&
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.header}>Additional Notes: </Text>
                <Text style={styles.body}>{props.details.additional_notes}</Text>
                </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
})