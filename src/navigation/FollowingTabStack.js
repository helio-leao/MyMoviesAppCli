import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FollowingScreen from '../screens/FollowingScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';


const Stack = createNativeStackNavigator();


export default function FollowingTabStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={'FollowingScreen'}
        component={FollowingScreen}
        options={{title: 'Seguindo'}}
      />
      <Stack.Screen
        name={'MovieDetailsScreen'}
        component={MovieDetailsScreen}
        options={{title: 'Detalhes do filme'}}
      />
    </Stack.Navigator>
  );
}