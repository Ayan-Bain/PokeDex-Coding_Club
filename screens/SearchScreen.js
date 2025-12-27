import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList, TextInput, StyleSheet, ImageBackground, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState, useRef } from "react";
import SearchHeader from "../components/SearchHeader";
import PokemonCard from "../components/PokemonCard";
import { useGlobalPokedex } from "../services/PokeDexContext";

const SearchScreen = () => {
  const flatListRef = useRef(null);
    const [text, setText] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const backgroundImage = require('../assets/background.jpg');
    const {pokeData, capturedData, encounteredData, handleButtons} = useGlobalPokedex();
    const renderData = data=> {
        setData([]);
        let filtered;
        // console.log('render called');
        // console.log(data);
        // console.log(text.toLowerCase());
        // console.log(Number(text), typeof Number(text));
        if(Number(text)<152 && Number(text)>0){
            filtered = data.filter(element => 
                element.entry_number===Number(text)
            )
        }
        else {
            filtered = data.filter(element => 
                element.pokemon_species.name.includes(text.toLowerCase())
            )
        }
        if(filtered.length > 0) {
            setData(filtered);
        }
        else {
            Alert.alert('No results found');
        }
    }
    const Search = async ()=>{
        try{
            if (pokeData !==null) {
              console.log('Data retrieved from Local storage');
            //   console.log(JSON.parse(data));
              renderData(pokeData);
            }
        }
        catch (e) {
            console.error(e);
        } 
        // console.log('After try catch block')
        setLoading(false);
    }
    const onSearch = ()=> {
        if(text==='') {
            Alert.alert('Field cannot be empty');
            setSearchTerm('');
        }
        else {
            setSearchTerm(text);
            Search();
            setText('');
        }
    }
    useFocusEffect(
        useCallback(()=> {


            return()=> {
                console.log('Cleanup Search Screen');
                flatListRef.current?.scrollToOffset({offset: 0})
                setData([]);
                setText('');
                setSearchTerm('');
            }
        },[])
    )

    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle={"light-content"} />

          <View style={styles.container}>
            {isLoading ? (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={100} />
              </View>
            ) : (
              <FlatList
                data={data}
                ref={flatListRef}
                ListHeaderComponent={
                  <SearchHeader
                    color={"orange"}
                    onChangeText={setText}
                    value={text}
                    onSearch={onSearch}
                    text={searchTerm}
                  />
                }
                keyboardShouldPersistTaps="always"
                renderItem={({ item }) => (
                  <PokemonCard
                    item={item}
                    key={item.entry_number}
                    buttonHandler={handleButtons}
                    isCaptured={capturedData.includes(item.entry_number)}
                    isEncountered={encounteredData.includes(item.entry_number)}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
}


export default SearchScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    }
})