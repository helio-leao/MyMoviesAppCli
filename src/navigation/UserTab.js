import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../screens/UserScreen';
import LoginScreen from '../screens/LoginScreen';
import { SignedUserContext } from '../App';


const Stack = createNativeStackNavigator();


export default function UserTab() {

  const {signedUser} = useContext(SignedUserContext);


  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      {signedUser ? (
        <Stack.Screen
          name={'UserScreen'}
          component={UserScreen}
          options={{title: 'Perfil'}}
        />
      ) : (
        <Stack.Screen
          name={'LoginScreen'}
          component={LoginScreen}
          options={{title: 'Login'}}
        />
      )}
    </Stack.Navigator>
  );
}