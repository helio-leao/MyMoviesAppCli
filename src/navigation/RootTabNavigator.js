import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeTab from './HomeTab';
import SearchTab from './SearchTab';
import FollowingTab from './FollowingTab';
import { SignedUserContext } from '../App';
import UserTab from './UserTab';


const Tab = createBottomTabNavigator();


export default function RootTabNavigator() {

  const {signedUser} = useContext(SignedUserContext);


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333',
          borderTopWidth: 0,
        },
      }}
      initialRouteName='HomeTab'
    >
      <Tab.Screen
        name='HomeTab'
        component={HomeTab}
        options={{
          tabBarTestID: 'tab-home',
          tabBarIcon: ({color, size, focused}) => (            
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen
        name='SearchTab'
        component={SearchTab}
        options={{
          tabBarTestID: 'tab-search',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
          tabBarLabel: 'Buscar',
        }}
      />

      <Tab.Screen
        name='FollowingTab'
        component={FollowingTab}
        options={{
          tabBarTestID: 'tab-following',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
          tabBarLabel: 'Seguindo',
        }}
      />

      <Tab.Screen
        name='UserTab'
        component={UserTab}
        options={{
          tabBarTestID: 'tab-user',
          tabBarIcon: ({color, size}) => {
            if(signedUser) {
              return <FontAwesome name="sign-out" size={size} color={color} />
            } else {
              return <FontAwesome name="sign-in" size={size} color={color} />
            }
          },
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};