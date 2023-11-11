import { Text, StyleSheet, View, Alert, TextInput, Button } from 'react-native';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewClinicalRecord({route, navigation}) {
    const { selectedPatientId, patientName } = route.params;

    const [dataType, setDataType] = useState('');
    const [readingValue, setReadingValue] = useState('');
    const [recordDateTime, setRecordDateTime] = useState(new Date());
//    const [meassurement, setMeassurement] = useState('')
    const [finalValue, setFinalValue] = useState('');
    const [open, setOpen] = useState('');
    const [invalidEnrty , setInvalidEntry] = useState('')
    const today = new Date()

    const [typeItems, setTypeItems] = useState([
        {label: 'Blood Pressure (X/Y mmHg)', value: 'Blood Pressure'},
        {label: 'Respiratory Rate(X/min)', value: 'Respiratory Rate'},
        {label: 'Blood Oxygen Level (X %)', value: 'Blood Oxygen Level'},
        {label: 'Heartbeat Rate (X bpm)', value: 'Heartbeat Rate'}
    ])

    const onChange = (event,selectedDate) => {
        const currentDate = selectedDate;
        setRecordDateTime(currentDate);
        console.log(recordDateTime)
    };

    const handleSave = () => {
        
        const newRecord = JSON.stringify({patient_id: selectedPatientId, date_time: recordDateTime, data_type: dataType, reading_value: finalValue})
        console.log(newRecord)

        const addNewRecord = async () => {
            await fetch('http://127.0.0.1:3000/patients/testdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: newRecord
            })
            .then(response => {
                if (response.ok) {
                    // Record successfully created
                    console.log('Clinical Record Created Successfully');
                } 
                else {
                    // Error occurred while creating clincial record
                    console.log('Error creating clinical record');
                }
            })
            .catch(error => {
                // Error occurred while making the request
                console.error('Error:', error);
            });
        }
                
        return addNewRecord();
    }

    // Save alert and check for empty fields
    const createAlert = () => {

        // Check if dataType drop down picker is not selected
        if (dataType == '') {
            setInvalidEntry('dt')
            console.log("dataType empty")
        }
        // Check if readingValue text field is empty
        else if (readingValue == '') {
            setInvalidEntry('rv')
            console.log("readingvalue empty")
        }
        else {
            Alert.alert("Save New Clinical Data", "Are you sure you want to save this as a new data entry?\n\nPatient: "+patientName+"\n"+dataType+": "+readingValue+"\n"+"Recorded on: "+recordDateTime, [
                {
                    text: 'Save',
                    onPress: () => {
                        console.log("Save Option Pressed")
                        handleSave();
                        navigation.goBack();
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel Pressed")
                }
            ]);
        }
        
        console.log("Save Record pressed")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Data Type</Text>
            <Text style={invalidEnrty=='dt'?styles.redText:styles.whiteText}>*Invalid Data Type*</Text>
            <DropDownPicker 
                open={open}
                value={dataType}
                items={typeItems}
                setOpen={setOpen}
                setValue={val => {
                    setDataType(val);
                }}
                setItems={setTypeItems}
                placeholder="None"
                containerStyle={{ height:115, width: 250 }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
            />
            
            <Text style={styles.header}>Enter {dataType} Value</Text>
            <Text style={invalidEnrty=='rv'?styles.redText:styles.whiteText}>*Invalid Value*</Text>
            <View style={styles.rowContainer}>
                <View style={styles.inputRow}>
                <TextInput 
                    placeholder={dataType=='Blood Pressure'?"X/Y":"X"}
                    onChangeText={text => {
                        setReadingValue(text)
                        if (dataType == 'Blood Pressure') {
                            setFinalValue(text+" mmHg")
                        }
                        else if (dataType == 'Respiratory Rate') {
                            setFinalValue(text+"/min")
                        }
                        else if (dataType == 'Blood Oxygen Level') {
                            setFinalValue(text+" %")
                        }
                        else if (dataType == 'Heartbeat Rate') {
                            setFinalValue(text+" bpm")
                        }
                    }}
                    value={readingValue}
                    style={styles.textInput}
                />
                </View>
                
                <Text style={{ paddingLeft: 10, paddingTop: 4 }}>{
                    dataType=='Blood Pressure'?"mmHg":null ||
                    dataType=='Respiratory Rate'?"/min":null ||
                    dataType=='Blood Oxygen Level'?"%":null ||
                    dataType=='Heartbeat Rate'?"bpm":"TYPE NOT SELECTED"
                }</Text>
            </View>
            <Text style={styles.header}>Select Date of Recorded Test</Text>
            <View style={styles.dateContainer}>
                <DateTimePicker
                    maximumDate= {today}
                    testID="dateTimePicker"
                    value={recordDateTime}
                    mode= "date"
                    is24Hour={true}
                    onChange={onChange}
                    display="default"
                />
            </View>
            <View style={{ paddingTop: 50 }}>
                <Button onPress={
                    () => {
                        createAlert()
                    }} title="Save Record"></Button>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#fff',
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 50,
    },
    header: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingBottom: 10,
        paddingTop: 20,
    },
    inputRow:{
        alignSelf: 'center',
        fontSize: 15,
        borderColor:"black",
        color: 'black',
        width: 100,
        height: 25,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    textInput: {
        marginLeft: 10,
        marginTop: 3,
    },
    dateContainer: {
        width: 200,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    whiteText: {
        color: 'white'
    },
    redText: {
        color: 'red'
    }
})