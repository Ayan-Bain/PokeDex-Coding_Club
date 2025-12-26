import { StatusBar } from "react-native";
import { View, Text, Button, FlatList, ActivityIndicator, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "./components/PokemonCard";

const HomeScreen = ()=> {
    const kantoPokedex = 'https://pokeapi.co/api/v2/pokedex/kanto';
   const [fontsLoaded] = useFonts({
    'Pacifico' : require('./assets/fonts/Pacifico-Regular.ttf')
   })
    // useEffect(()=> {

    // },[text]);
    const windowWidth = useWindowDimensions().width;
      const [isLoading, setLoading] = useState(true);
        const [pokeData, setPokeData] = useState([]);
      const getApiData = async (API_URL) => {
        setLoading(true);
        try {
            const data = await AsyncStorage.getItem("pokemon_entries");
            if (data !==null) {
              setPokeData(JSON.parse(data));
              console.log('Data retrieved from Local storage')
            }
            else {
              const response = await fetch(API_URL);
              const json = await response.json();
              setPokeData(json.pokemon_entries);
              console.log('Data retrieved from API')
              try {
                await AsyncStorage.setItem('pokemon_entries', JSON.stringify(json.pokemon_entries));
                console.log('Data Saved to local storage');
              }
              catch (e) {
                console.error(e);
              }
            }
          }
          catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      useEffect(()=> {
        getApiData(kantoPokedex);
      },[]);

      if (!fontsLoaded) {
        return(
          <View>
            <ActivityIndicator size={100}/>
          </View>
        )
      }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor: 'yellowgreen'}}>
        <StatusBar barStyle={'dark-content'}/>
            {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size={100}/>
                </View>
            ): (
                <FlatList
                data={pokeData}
                ListHeaderComponent={ <View style={{
                  height: 250,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  borderRadius: 30,
                  margin: 20
                }}>
                  <Text style={{textAlign: 'center', alignSelf :'center', fontSize: 100, color: 'yellow', fontFamily: 'Pacifico'}}>PokeDex</Text>
                </View>}
                keyboardShouldPersistTaps='always'
                renderItem={({item})=> <PokemonCard item={item}/>}
                showsHorizontalScrollIndicator= {false}
                />
            )}
        </SafeAreaView>
    );
}

export default HomeScreen;

