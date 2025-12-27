import { View, Text, FlatList, StyleSheet, ImageBackground, useWindowDimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalPokedex } from "../services/PokeDexContext";
import PokemonCard from "../components/PokemonCard";
import { useFonts } from "expo-font";

const CapturedScreen = () => {
    const { pokeData, capturedData, handleButtons, encounteredData } = useGlobalPokedex();
    const windowHeight = useWindowDimensions().height;
    const capturedList = pokeData.filter(pokemon => 
        capturedData.includes(pokemon.entry_number)
    );

    const [fontsLoaded] = useFonts({
        'Saira' : require('../assets/fonts/Saira_Condensed-Italic.ttf'),
        'Bebas' : require('../assets/fonts/BebasNeue-Regular.ttf'),
        'Quicksand' : require('../assets/fonts/Quicksand-Bold.ttf'),
    })

    if (pokeData.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="red" />
            </View>
        );
    }

    if(!fontsLoaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={100}/>
            </View>
        )
    }

    return (
        <ImageBackground source={require('../assets/backgroundCaptured.jpg')} style={{flex: 1}} resizeMode="cover">
        <SafeAreaView style={styles.container}>
            <FlatList
                data={capturedList}
                ListHeaderComponent={
                    <View style={{height: 200, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontFamily: 'Quicksand', fontSize: 55,color: 'yellow', marginTop: -30}}>CapturedScreen</Text>
                    </View>
                }
                keyExtractor={(item) => item.entry_number.toString()}
                contentContainerStyle={capturedList.length === 0 ? {flex: 1} : null}
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
                        <Text style={[styles.emptyText, {marginTop: 0.03*windowHeight}]}>You haven't caught any Pokémon yet!</Text>
                    </View>
                }
            />
        </SafeAreaView>
        </ImageBackground>
    );
};

export default CapturedScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    emptyContainer: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 50,
        color: 'white',
        fontFamily: 'Saira'
    }
})