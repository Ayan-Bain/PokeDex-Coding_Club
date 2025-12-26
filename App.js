import { StyleSheet} from 'react-native';
import { useState } from 'react';
//import { useEffect } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PokedexProvider } from './services/PokeDexContext';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import CapturedScreen from './CapturedScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const kantoPokedex = 'https://pokeapi.co/api/v2/pokedex/kanto';

  const [isLoading, setLoading] = useState(true);

  const getApiData = async (API_URL) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      console.log(json);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
    <PokedexProvider>

    <NavigationContainer>
      <Tab.Navigator initialRouteName='Home' backBehavior='initialRoute' screenOptions={{
        headerShown: false,
      }}>
        <Tab.Screen name='Captured' component={CapturedScreen} options={{
      tabBarIcon: ({color, size})=> (
        <Ionicons name="checkmark-circle" size={size+5} color={color}/>
      )
    }}/>
        <Tab.Screen name='Home' component={HomeScreen} options={{
          tabBarIcon: (({color, size})=> (
            <Ionicons name='home' size={size+5} color={color}/>
          )),
        }}/>
        <Tab.Screen name='Search' component={SearchScreen} options={{
      tabBarIcon: ({color, size})=> (
        <Ionicons name="search-circle" size={size+5} color={color}/>
      )
    }}/>
      </Tab.Navigator>
    </NavigationContainer>
    </PokedexProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
