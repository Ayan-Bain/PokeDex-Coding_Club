import { View, Text, Button, FlatList, ActivityIndicator, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "./components/PokemonCard";
import SearchHeader from "./components/SearchHeader";

const HomeScreen = ()=> {
    const kantoPokedex = 'https://pokeapi.co/api/v2/pokedex/kanto';
   
    // useEffect(()=> {

    // },[text]);
    const windowWidth = useWindowDimensions().width;
      const [isLoading, setLoading] = useState(true);
        const [pokeData, setPokeData] = useState([]);
      const getApiData = async (API_URL) => {
        setLoading(true);
        try {
          const response = await fetch(API_URL);
          const json = await response.json();
          setPokeData(json);
          console.log(json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      useEffect(()=> {
        getApiData(kantoPokedex);
      },[]);


    return(
        <SafeAreaView style={{flex: 1, backgroundColor: 'yellowgreen'}}>
            {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size={100}/>
                </View>
            ): (
                <FlatList
                data={pokeData.pokemon_entries}
                ListHeaderComponent={SearchHeader}
                keyboardShouldPersistTaps='always'
                renderItem={({item})=> <PokemonCard item={item}/>}
                showsHorizontalScrollIndicator= {false}
                />
            )}
        </SafeAreaView>
    );
}

export default HomeScreen;

