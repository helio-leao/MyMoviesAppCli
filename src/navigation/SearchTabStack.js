import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import TvShowDetailsScreen from '../screens/TvShowDetailsScreen';


const Stack = createNativeStackNavigator();


export default function SearchTabStack() {
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
        name={'MovieDetailsScreen'}
        component={MovieDetailsScreen}
        options={{title: 'Detalhes do filme'}}
      />
      <Stack.Screen
        name={'TvShowDetailsScreen'}
        component={TvShowDetailsScreen}
        options={{title: 'Detalhes da série'}}
      />
    </Stack.Navigator>
  );
}