import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeTabStack from './HomeTabStack';
import SearchTabStack from './SearchTabStack';
import FollowingTabStack from './FollowingTabStack';
import { SignedUserContext } from '../App';
import UserTabStack from './UserTabStack';


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
      initialRouteName='HomeStack'
    >
      <Tab.Screen
        name='HomeStack'
        component={HomeTabStack}
        options={{
          tabBarTestID: 'tab-home',
          tabBarIcon: ({color, size, focused}) => (            
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen
        name='SearchStack'
        component={SearchTabStack}
        options={{
          tabBarTestID: 'tab-search',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
          tabBarLabel: 'Buscar',
        }}
      />

      <Tab.Screen
        name='FollowingStack'
        component={FollowingTabStack}
        options={{
          tabBarTestID: 'tab-following',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
          tabBarLabel: 'Seguindo',
        }}
      />

      <Tab.Screen
        name='UserTabStack'
        component={UserTabStack}
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