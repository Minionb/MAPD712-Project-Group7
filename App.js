import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddPatientsPage from './Components/AddPatientsPage';
import ViewAllPatientsPage from './Components/ViewAllPatientsPage'
import PatientDetails from './Components/PatientDetails'
import NewClinicalRecord from './Components/NewClinicalRecordScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function PatientStack() {
    return (
      <Stack.Navigator >
        <Stack.Screen name="Patients" component={ViewAllPatientsPage} />
        <Stack.Screen name="Patient Details" component={PatientDetails} />
        <Stack.Screen name="New Clinical Record" component={NewClinicalRecord} />

      </Stack.Navigator>
    )
  }
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="View Patients" component={PatientStack} options={{unmountOnBlur: true}}/>
        <Tab.Screen name="Add Patients" component={AddPatientsPage} options={{unmountOnBlur: true}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
