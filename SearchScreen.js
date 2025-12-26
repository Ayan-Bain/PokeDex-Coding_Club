import { View, Text, FlatList, TextInput, StyleSheet, ImageBackground, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchHeader from "./components/SearchHeader";
import PokemonCard from "./components/PokemonCard";

const SearchScreen = () => {
    const [text, setText] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const backgroundImage = require('./assets/background.jpeg');
    const renderData = data=> {
        console.log('render called');
        // console.log(data);
        console.log(text.toLowerCase());
        const filtered = data.filter(element => 
            element.pokemon_species.name.includes(text.toLowerCase())
        )
        setData(filtered);
    }
    const Search = async ()=>{
        try{
            const data = await AsyncStorage.getItem("pokemon_entries");
            if (data !==null) {
              console.log('Data retrieved from Local storage');
            //   console.log(JSON.parse(data));
              renderData(JSON.parse(data));
            }
        }
        catch (e) {
            console.error(e);
        } 
        console.log('After try catch block')
        setLoading(false);
    }
    const onSearch = ()=> {
        Search();
        setText('');
    }
    return(
        <ImageBackground source={backgroundImage}resizeMode="cover" style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={'light-content'}/>

        <View style={styles.container}>
            
        <SearchHeader color={'orange'} onChangeText={setText} value={text} onSearch={onSearch}/>
        {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size={100}/>
                </View>
            ): (
                <FlatList
                data={data}
                keyboardShouldPersistTaps='always'
                renderItem={({item})=> <PokemonCard item={item}/>}
                showsHorizontalScrollIndicator= {false}
                />
            )}
        </View>
        </SafeAreaView>
        </ImageBackground>
    )
}


export default SearchScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    }
})