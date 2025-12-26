import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import PokemonCard from "./components/PokemonCard";
import { useGlobalPokedex } from "./services/PokeDexContext";
import CustomButton from "./components/CustomButton";

const KANTO_POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/kanto';

const HomeScreen = () => {
    const { capturedData, encounteredData, handleButtons, isLoading: isPokedexLoading } = useGlobalPokedex();
    
    const [pokeData, setPokeData] = useState([]);
    const [isListLoading, setListLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        'Pacifico': require('./assets/fonts/Pacifico-Regular.ttf'),
        'Rubik': require('./assets/fonts/RubikGemstones-Regular.ttf')
    });

    const fetchPokedexList = async () => {
        setListLoading(true);
        try {
            const cachedPokedex = await AsyncStorage.getItem("pokemon_entries");
            if (cachedPokedex) {
                setPokeData(JSON.parse(cachedPokedex));
            } else {
                const response = await fetch(KANTO_POKEDEX_URL);
                const json = await response.json();
                setPokeData(json.pokemon_entries);
                await AsyncStorage.setItem('pokemon_entries', JSON.stringify(json.pokemon_entries));
            }
        } catch (error) {
            console.error("List Fetch Error:", error);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchPokedexList();
    }, []);

    const isAppBusy = !fontsLoaded || isPokedexLoading || isListLoading;

    if (isAppBusy) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={100} color="red" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle={'dark-content'} />
            <FlatList
                data={pokeData}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerText}>PokéDex</Text>
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity>
                        <Text style={styles.statsText}>
                            Captured: {capturedData.length}
                        </Text>
                        </TouchableOpacity>
                        <Text style={styles.statsText}> | </Text>
                        <TouchableOpacity>
                        <Text style={styles.statsText}>Seen: {encounteredData.length}</Text>
                        {/* <CustomButton title={'Encountered'}/> */}
                        </TouchableOpacity>
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
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 30,
        margin: 20,
        elevation: 5
    },
    headerText: { fontSize: 70, color: 'yellow', fontFamily: 'Rubik' },
    statsText: { fontSize: 18, color: 'white', fontWeight: 'bold', marginTop: 10 }
});

export default HomeScreen;