import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator'


export default function Routes() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}