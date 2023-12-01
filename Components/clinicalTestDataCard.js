import { Text, StyleSheet, View, Alert } from 'react-native';
import { Octicons } from "@expo/vector-icons";
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { deleteClinicalData, updateClinicalDataCondition } from "./PatientDetails";

export default function ClinicalTestDataCard(props) {
    const nav = props.navigation
    const patientName = props.patientName
    const selectedPatientId = props.selectedPatientId
    const patientCondition = props.patientCondition
    
    console.log(selectedPatientId)
    var dateTimeString = new Date(props.oneRecord.item.date_time)
    var dateString = dateTimeString.toLocaleDateString();
    var timeString = dateTimeString.toLocaleTimeString();
    var condition = "";
    console.log(props.oneRecord.item.data_type)

    // Data card condition colour switch statement
    switch (props.oneRecord.item.data_type) {
        case 'Blood Pressure':
            var bloodPressure = props.oneRecord.item.reading_value.split("/")
            bloodPressure[1] = bloodPressure[1].split(" ")[0];
            bloodPressure[0] = parseInt(bloodPressure[0], 10)
            bloodPressure[1] = parseInt(bloodPressure[1], 10)

            if ((bloodPressure[0] >= 180) || (bloodPressure[1] >= 120)) condition = "critical";
            else if ((bloodPressure[0] >= 140) || (bloodPressure[1] >= 90)) condition = "bad";
            else if ((140 > bloodPressure[0] >= 130) && (90 > bloodPressure[1] >= 80)) condition = "average";
            else if ((130 > bloodPressure[0] >= 120) && (bloodPressure[1] > 80)) condition = "fine";
            else condition = "good";

            updateClinicalDataCondition(props.oneRecord.item._id, condition, props.oneRecord.item.patient_id, patientCondition)
            break;
        
        case 'Respiratory Rate':
            var respiratoryRate = props.oneRecord.item.reading_value.split("/")
            respiratoryRate = parseInt(respiratoryRate[0])

            if (respiratoryRate > 24) condition = "critical";
            else if (respiratoryRate > 20) condition = "average";
            else if (20 >= respiratoryRate >= 12) condition = "good";

            updateClinicalDataCondition(props.oneRecord.item._id, condition, props.oneRecord.item.patient_id, patientCondition)
            break;
        
        case 'Blood Oxygen Level':
            var bloodOxygenLevel = props.oneRecord.item.reading_value.split(" ")
            bloodOxygenLevel = parseInt(bloodOxygenLevel[0])

            if (bloodOxygenLevel <= 67) condition = "critical";
            else if (bloodOxygenLevel <= 85 ) condition = "bad";
            else if (bloodOxygenLevel <= 90 ) condition = "average";
            else if (bloodOxygenLevel <= 95) condition = "fine";
            else condition = "good";

            updateClinicalDataCondition(props.oneRecord.item._id, condition, props.oneRecord.item.patient_id, patientCondition)
            break;

        case 'Heartbeat Rate':
            var bpm = props.oneRecord.item.reading_value.split(" ")
            bpm = parseInt(bpm[0])

            if (48 <= bpm <= 61) condition = "good";
            else if (62 <= bpm <= 69) condition = "fine";
            else if (70 <= bpm <= 73) condition = "average";
            else if (74 <= bpm <= 79) condition = "bad";
            else if (80 <= bpm) condition = "critical";

            updateClinicalDataCondition(props.oneRecord.item._id, condition, props.oneRecord.item.patient_id, patientCondition)
            break;
        
        default:
            break;
    }

    return (
        <MenuProvider skipInstanceCheck={true}>
                <View style={[ styles.card,
                        condition=="good"?styles.cardBackground1:null ||
                        condition=="fine"?styles.cardBackground2:null ||
                        condition=="average"?styles.cardBackground3:null ||
                        condition=="bad"?styles.cardBackground4:null ||
                        condition=="critical"?styles.cardBackground5:null 
                    ]}>
                    <View style={styles.cardContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.typeText, condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]}>{props.oneRecord.item.data_type}</Text>
                            <Menu>
                                <MenuTrigger>
                                    <Octicons name="three-bars" size={20} style={[{paddingTop: 10}, condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]} />
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={ () => 
                                    { 
                                        nav.navigate('Edit Clinical Records',{
                                            currentClinicalDataInfo: props.oneRecord.item,
                                            patientName: patientName,
                                            selectedPatientId: selectedPatientId
                                        });
                                    }}>
                                        <Text>Edit</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={ () => {
                                        //setRefreshIndicator(false)
                                        createAlert(props.oneRecord.item._id)
                                        }}>
                                        <Text style={{color: 'red'}}>Delete</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                        <Text style={[styles.readingText, condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]}>{props.oneRecord.item.reading_value}</Text>
                        <Text style={[styles.body, condition=="bad"?{color: '#fff'}:null || condition=="critical"?{color: '#fff'}:null]}>{dateString} at {timeString}</Text>
                    </View>
                    
                </View>
            </MenuProvider>
    )
}

// Delete alert
const createAlert = (id) => 
Alert.alert("Delete Clinical Data", "Are you sure you want to delete this data entry?", [
    {
        text: 'DELETE',
        onPress: () => {
            console.log("DELETE Pressed")
            deleteClinicalData(id)
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
        borderRadius: 10
    },
    cardContent: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: 18,
        marginVertical: 10,
        width: '85%',
    },
    typeText: {
        fontSize: 20,
        flexGrow: 1,
    },
    body: {
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
})