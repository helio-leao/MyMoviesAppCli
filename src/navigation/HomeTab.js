import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MediaDetailsScreen from '../screens/MediaDetailsScreen';

const Stack = createNativeStackNavigator();


export default function HomeTab() {
  return(
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        options={{title: 'Início'}}
      />
      <Stack.Screen
        name={'MediaDetailsScreen'}
        component={MediaDetailsScreen}
        options={{title: 'Detalhes'}}
      />
    </Stack.Navigator>
  );
}