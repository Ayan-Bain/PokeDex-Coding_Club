import { StatusBar } from "react-native";
import { View, Text, Button, FlatList, ActivityIndicator, TextInput, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "./components/PokemonCard";

const HomeScreen = ()=> {
  const initialMount = useRef(false);
    const kantoPokedex = 'https://pokeapi.co/api/v2/pokedex/kanto';
   const [fontsLoaded] = useFonts({
    'Pacifico' : require('./assets/fonts/Pacifico-Regular.ttf'),
    'Rubik': require('./assets/fonts/RubikGemstones-Regular.ttf')
   })
    // useEffect(()=> {

    // },[text]);
    const windowWidth = useWindowDimensions().width;
      const [isLoading, setLoading] = useState(true);
        const [pokeData, setPokeData] = useState([]);
        const [capturedData, setCapturedData] = useState([]);
        const [encouteredData, setEncounteredData] = useState([]);

        const handleButtons = (type, pokemonId)=> {
          switch(type) {
            case 'setCaptured':
              if(capturedData.indexOf(pokemonId)>-1) {
                let temp = [...capturedData];
                temp.splice(capturedData.indexOf(pokemonId),1);
                setCapturedData(temp);
              }
              else {
                let temp = [...capturedData];
                temp.push(pokemonId);
                setCapturedData(temp);
              }
              break;
            case 'setEncountered':
              if(encouteredData.indexOf(pokemonId)>-1) {
                let temp = [...encouteredData];
                temp.splice(encouteredData.indexOf(pokemonId),1);
                setEncounteredData(temp);
              }
              else {
                let temp = [...encouteredData];
                temp.push(pokemonId);
                setEncounteredData(temp);
              }
              break;
          }
        }

      const getApiData = async (API_URL) => {
        setLoading(true);
        try {
            const data = await AsyncStorage.getItem("pokemon_entries");
            if (data !==null) {
              setPokeData(JSON.parse(data));
              console.log('Data retrieved from Local storage');
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
              const capturedData = await AsyncStorage.getItem("capturedData");
              if (capturedData !== null) {
                setCapturedData(JSON.parse(capturedData));
                console.log('CapturedData received from Local Storage');
                const encounteredData = await AsyncStorage.getItem("encounteredData");
                setEncounteredData(JSON.parse(encounteredData));
                console.log('EncounteredData received from Local Storage');
              } else {
                await AsyncStorage.setItem("capturedData", JSON.stringify([]));
                await AsyncStorage.setItem("encounteredData", JSON.stringify([]));
                setCapturedData([]);
                setEncounteredData([]);
            }
            initialMount.current = true;
          }
          catch (e) {
            console.error(e);
          }
        finally {
          setLoading(false);
        }
      };

const transactionStorage = async ()=> {
  if(isLoading || !initialMount.current) {
    return;
  }
    try {
      const cap = await AsyncStorage.getItem('capturedData');
      const enc = await AsyncStorage.getItem('encounteredData');
      if((cap!==null && cap===JSON.stringify(capturedData))&&(enc!==null && enc===JSON.stringify(encouteredData))){
      console.log(cap, enc);
      return;
    }
    else {
      await AsyncStorage.setItem('capturedData',JSON.stringify(capturedData));
      await AsyncStorage.setItem('encounteredData', JSON.stringify(encouteredData));
      console.log(cap, enc);
  console.log('Set new capturedData and encounteredData');
}
    }
    catch (e) {
      console.error(e);
    }
}


      useEffect(()=> {
        getApiData(kantoPokedex);
      },[]);
      useEffect(()=>{
        if(!isLoading) {
          transactionStorage();
        }
      },[capturedData, encouteredData])


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
                  <Text style={{textAlign: 'center', alignSelf :'center',fontSize: 90, color: 'yellow', fontFamily: 'Rubik'}}>PokéDex</Text>
                </View>}
                keyboardShouldPersistTaps='always'
                renderItem={({item})=> <PokemonCard item={item} buttonHandler={handleButtons}/>}
                showsHorizontalScrollIndicator= {false}
                />
            )}
        </SafeAreaView>
    );
}

export default HomeScreen;

