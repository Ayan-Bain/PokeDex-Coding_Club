import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalPokedex } from "./services/PokeDexContext";
import PokemonCard from "./components/PokemonCard";

const CapturedScreen = () => {
    const { pokeData, capturedData, handleButtons, encounteredData } = useGlobalPokedex();

    const capturedList = pokeData.filter(pokemon => 
        capturedData.includes(pokemon.entry_number)
    );

    if (pokeData.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="red" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={capturedList}
                keyExtractor={(item) => item.entry_number.toString()}
                renderItem={({ item }) => (
                    <PokemonCard 
                        item={item} 
                        buttonHandler={handleButtons}
                        isCaptured={capturedData.includes(item.entry_number)}
                        isEncountered={encounteredData.includes(item.entry_number)}
                    />
                )}
                ListEmptyComponent={
                    
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>You haven't caught any Pokémon yet!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default CapturedScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 20,
        justifyContent:  'center'
    }
})