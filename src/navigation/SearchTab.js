import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import PersonDetailsScreen from '../screens/PersonDetailsScreen';
import MediaDetailsScreen from '../screens/MediaDetailsScreen';


const Stack = createNativeStackNavigator();


export default function SearchTab() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={'SearchScreen'}
        component={SearchScreen}
        options={{title: 'Busca'}}
      />
      <Stack.Screen
        name={'MediaDetailsScreen'}
        component={MediaDetailsScreen}
        options={{title: 'Detalhes'}}
      />
      <Stack.Screen
        name={'PersonDetailsScreen'}
        component={PersonDetailsScreen}
        options={{title: 'Detalhes'}}
      />
    </Stack.Navigator>
  );
}