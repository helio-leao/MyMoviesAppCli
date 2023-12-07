import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeTab from './HomeTab';
import SearchTab from './SearchTab';
import UserTab from './UserTab';
import { Image } from 'react-native';
import ApiService from '../services/ApiService';
import { SessionContext } from '../contexts/SessionContext';

const Tab = createBottomTabNavigator();


export default function RootTabNavigator() {

  const {session} = useContext(SessionContext);


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
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
          tabBarLabel: 'Buscar',
        }}
      />

      <Tab.Screen
        name='UserTab'
        component={UserTab}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            // no user logged
            if(!session?.user) {
              return <FontAwesome name="sign-in" size={size} color={color} />
            }

            // NOTE: could be the gravatar, add it later???
            // user logged has no avatar
            if(!session?.user.avatar.tmdb.avatar_path) {
              return <FontAwesome name={focused ? "user-circle" : "user-circle-o"} size={size} color={color} />
            }

            // user avatar
            return (
              <Image
                style={{height: size, width: size, borderRadius: size / 2}}
                source={{uri: ApiService.fetchFullImagePath(session?.user.avatar.tmdb.avatar_path)}}
              />
            )
          },
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};