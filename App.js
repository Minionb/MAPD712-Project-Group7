import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AddPatientsPage from './Components/AddPatientsPage';
import ViewAllPatientsPage from './Components/ViewAllPatientsPage'


export default function App() {
  const Tab = createBottomTabNavigator();
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="View Patients" component={ViewAllPatientsPage} />
        <Tab.Screen name="Add Patients" component={AddPatientsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
