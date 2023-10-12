import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FollowingScreen from '../screens/FollowingScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import TvShowDetailsScreen from '../screens/TvShowDetailsScreen';

export const Screens = {
  HomeScreen: 'HomeScreen',
  MovieDetailsScreen: 'MovieDetailsScreen',
  TvShowDetailsScreen: 'TvShowDetailsScreen',
  SearchScreen: 'SearchScreen',
  FollowingScreen: 'FollowingScreen',
}


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function HomeStack() {
  return(
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={Screens.HomeScreen}
        component={HomeScreen}
        options={{title: 'Início'}}
      />
      <Stack.Screen
        name={Screens.MovieDetailsScreen}
        component={MovieDetailsScreen}
        options={{title: 'Detalhes do filme'}}
      />
      <Stack.Screen
        name={Screens.TvShowDetailsScreen}
        component={TvShowDetailsScreen}
        options={{title: 'Detalhes do seriado'}}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={Screens.SearchScreen}
        component={SearchScreen}
        options={{title: 'Busca'}}
      />
      <Stack.Screen
        name={Screens.MovieDetailsScreen}
        component={MovieDetailsScreen}
        options={{title: 'Detalhes do filme'}}
      />
      <Stack.Screen
        name={Screens.TvShowDetailsScreen}
        component={TvShowDetailsScreen}
        options={{title: 'Detalhes do seriado'}}
      />
    </Stack.Navigator>
  );
}

function FollowingStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerStyle: {backgroundColor: '#333'}, headerTintColor: '#fff'}}
    >
      <Stack.Screen
        name={Screens.FollowingScreen}
        component={FollowingScreen}
        options={{title: 'Seguindo'}}
      />
      <Stack.Screen
        name={Screens.MovieDetailsScreen}
        component={MovieDetailsScreen}
        options={{title: 'Detalhes do filme'}}
      />
    </Stack.Navigator>
  );
}


export default function TabNavigator() {
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
        component={HomeStack}
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
        component={SearchStack}
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
        component={FollowingStack}
        options={{
          tabBarTestID: 'tab-following',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
          tabBarLabel: 'Seguindo',
        }}
      />
    </Tab.Navigator>
  );
};