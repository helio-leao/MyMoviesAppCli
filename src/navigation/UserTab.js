import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../screens/UserScreen';
import LoginScreen from '../screens/LoginScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import FollowingScreen from '../screens/FollowingScreen';
import MediaDetailsScreen from '../screens/MediaDetailsScreen';
import { SessionContext } from '../contexts/SessionContext';


const Stack = createNativeStackNavigator();


export default function UserTab() {
  const {session} = useContext(SessionContext);
  
  return session ? <LoggedInStackNavigator /> : <LoggedOutStackNavigator />
}


function LoggedInStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={'UserScreen'}
        component={UserScreen}
        options={{title: 'Perfil'}}
      />
      <Stack.Screen
        name={'FavoritesScreen'}
        component={FavoritesScreen}
        options={{title: 'Favoritos'}}
      />
      <Stack.Screen
        name={'FollowingScreen'}
        component={FollowingScreen}
        options={{title: 'Seguindo'}}
      />
      <Stack.Screen
        name={'MediaDetailsScreen'}
        component={MediaDetailsScreen}
        options={{title: 'Detalhes'}}
      />
    </Stack.Navigator>
  );
}

function LoggedOutStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={'LoginScreen'}
        component={LoginScreen}
        options={{title: 'Login'}}
      />
    </Stack.Navigator>
  );
}