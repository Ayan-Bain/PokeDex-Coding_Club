import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import PokemonCard from "./components/PokemonCard";
import { useGlobalPokedex } from "./services/PokeDexContext";

const KANTO_POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/kanto';

const POKEMON_TYPES = [
  'all', 'grass', 'fire', 'water', 'bug', 'normal', 'poison', 
  'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 
  'ghost', 'ice', 'dragon', 'steel', 'flying'
];

const HomeScreen = () => {
    const {pokeData, capturedData, encounteredData, handleButtons, isPokedexLoading, pokemonTypesMap, saveTypes, isListLoading} = useGlobalPokedex();
    const [pokeFilter, setPokeFilter] = useState('all');
    const [selectedType, setSelectedType]  =useState('all');

    const [fontsLoaded] = useFonts({
        'Pacifico': require('./assets/fonts/Pacifico-Regular.ttf'),
        'Rubik': require('./assets/fonts/RubikGemstones-Regular.ttf')
    });



    const isAppBusy = !fontsLoaded || isPokedexLoading || isListLoading;

    if (isAppBusy) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={100} color="red" />
            </View>
        );
    }

    const displayedData = pokeData.filter(pokemon => {
        let status = true;
        if(pokeFilter === 'captured') {
            status = capturedData.includes(pokemon.entry_number);
        }
        else if(pokeFilter === 'encountered') {
            status = encounteredData.includes(pokemon.entry_number);
        }
        let type=true;
        if(selectedType!=='all'){
            const types = pokemonTypesMap[pokemon.entry_number] || [];
            type = types.includes(selectedType);
        }
        return type && status;
    })

    const switchFilter = ()=> {
        const modes = ['all', 'captured', 'encountered'];
        setPokeFilter(modes[(modes.indexOf(pokeFilter)+1)%modes.length]);
        console.log(modes[(modes.indexOf(pokeFilter)+1)%modes.length]);
    };


    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={"dark-content"} />
        <FlatList
          data={displayedData}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>PokéDex</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.statsText}>
                  All: {pokeData.length}
                </Text>
                <Text style={styles.statsText}> | </Text>
                <Text style={styles.statsText}>
                  Captured: {capturedData.length}
                </Text>
                <Text style={styles.statsText}> | </Text>
                <Text style={styles.statsText}>
                  Seen: {encounteredData.length}
                </Text>
                {/* <CustomButton title={'Encountered'}/> */}
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={switchFilter}>
                    <Text style={[styles.switchText,{fontSize: 25},
                    pokeFilter==='captured'&& styles.captured,
                    pokeFilter==='encountered'&& styles.encountered
                     ]}>{pokeFilter?.toUpperCase()}</Text>
                </TouchableOpacity>
                <Text style={[styles.statsText, {textAlign: 'center'}]}>Filter by Type: </Text>
                <FlatList
                    horizontal
                    data={POKEMON_TYPES}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(t)=> t}
                    renderItem={({item})=> (
                        <TouchableOpacity onPress={()=> setSelectedType(item)}
                        style={[styles.typeBadge, selectedType===item && styles.activeBadge, {backgroundColor: TYPE_COLORS[item]}]}
                        >
                            <Text style={styles.statsText}>{item.toUpperCase()}</Text>
                        </TouchableOpacity>
                    )}
                />
              </View>
            </View>
          }
          keyExtractor={(item) => item.entry_number.toString()}
          renderItem={({ item }) => (
            <PokemonCard
              item={item}
              key={item.entry_number}
              buttonHandler={handleButtons}
              isCaptured={capturedData.includes(item.entry_number)}
              isEncountered={encounteredData.includes(item.entry_number)}
              saveTypes={saveTypes}
            />
          )}
        />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'yellowgreen' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellowgreen' },
    header: {
        height: 230,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 30,
        margin: 20,
        elevation: 5
    },
    headerText: { fontSize: 70, color: 'yellow', fontFamily: 'Rubik', marginTop: 20},
    statsText: { fontSize: 18, color: 'white', fontWeight: 'bold', marginTop: 10 },
    switchText: { fontSize: 18, color: 'blue', fontWeight: 'bold', margin: 15, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15,backgroundColor: 'yellow' },
    captured: {
        backgroundColor: 'blue',
        color: 'red'
    },
    encountered: {
        backgroundColor: 'green',
        color: 'yellow'
    },
    activeBadge: {
        opacity: 1,
        borderWidth: 2,
        borderColor: 'white',
        transform: [{ scale: 1.1 }]
    },
    typeBadge: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 5,
        opacity: 0.6,
        elevation: 3
    }
});



const TYPE_COLORS = {
    grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820',
    normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
    fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
    ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', steel: '#B8B8D0',
    flying: '#A890F0', all: '#333'
};

export default HomeScreen;