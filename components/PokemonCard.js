import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import { Audio } from "expo-av";
import { playPokemonCry } from "../services/PlayPokemonCry";
import CustomButton from "./CustomButton";

// Audio.setAudioModeAsync({
//   allowsRecordingIOS: false,
//   staysActiveInBackground: false,
//   playsInSilentModeIOS: true, // This is the most important line
//   shouldDuckAndroid: true,
//   playThroughEarpieceAndroid: false,
// });

const PokemonCard = ({item, playCry, buttonHandler, isCaptured, isEncountered})=> {
    const [modalVisible, setModalVisibility] = useState(false);
    const windowWidth = useWindowDimensions().width;
    const imageWidth = windowWidth - (windowWidth %100)-175;
    const [isImageLoading, setImageLoading]  =useState(true);
    const [isLoading, setLoading] = useState(true);
    const [info, setInfo] = useState('');
    const [fontsLoaded] = useFonts({
        'Playfair': require('../assets/fonts/PlayfairDisplay-BoldItalic.ttf')
    })

    const getUrl = async (API_URL) => {
        setLoading(true);
        try {
          const response = await fetch(API_URL);
          const json = await response.json();
        //   console.log(json.sprites.other.home.front_default);
          setInfo(json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(()=>{
        getUrl('https://pokeapi.co/api/v2/pokemon/'+item.pokemon_species.name);
      },[]);
      useEffect(()=> {
        if(modalVisible && info?.cries?.latest) {
          playPokemonCry(info.cries.latest)
        }
      },[modalVisible])
      if(!fontsLoaded) {
        return(
          <View>
            <ActivityIndicator size={100}/>
          </View>
        )
      } 
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => setModalVisibility(true)}
          activeOpacity={0.8}
        >
          <View style={styles.container}>
            {isImageLoading && (
              <ActivityIndicator
                size={70}
                style={{
                  position: "absolute",
                  top: "25%",
                  alignSelf: "center",
                  zIndex: 1,
                }}
              />
            )}
            <Text
              style={{
                fontFamily: "Playfair",
                fontSize: 35,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              {item.pokemon_species.name.toUpperCase()}
            </Text>
            {info !== "" ? (
              <Image
                source={{
                  uri: info.sprites.other["official-artwork"].front_default,
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                style={{
                  height: imageWidth,
                  width: imageWidth,
                  alignSelf: "center",
                }}
              />
            ) : (
              <ActivityIndicator size={100} />
            )}
            {/* <Text>This is one Pokemon card of </Text> */}
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 65}}>
            <View style={{flex: 0.8}}></View>
            <CustomButton title={isCaptured?'Release':'Captured'} backgroundColor={isCaptured?'red': 'blue'} onPress={()=> buttonHandler('setCaptured', item.entry_number)}/>
            <CustomButton title={!isEncountered?'Encountered':'Forgot'} backgroundColor={!isEncountered ? 'green': 'orange'} onPress={()=> buttonHandler('setEncountered', item.entry_number)}/>
            </View>
          </View>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisibility(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModalVisibility(false);
              }}
            ></TouchableOpacity>
            <View style={styles.contentContainer}>
              {info !== "" ? (
                <Image
                  source={{
                    uri: info.sprites.other["official-artwork"].front_default,
                  }}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  style={{
                    height: imageWidth,
                    width: imageWidth,
                    alignSelf: "center",
                  }}
                />
              ) : (
                <ActivityIndicator size={100} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
}


export default PokemonCard;


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 500,
        width: '95%',
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 30,
    },
    wrapper: {
        flex: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    contentContainer: {
        backgroundColor: 'white',
        height: 700
    }

})