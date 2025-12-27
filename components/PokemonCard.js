import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useWindowDimensions } from "react-native";
import { playPokemonCry } from "../services/PlayPokemonCry";
import CustomButton from "./CustomButton";

const PokemonCard = ({item, buttonHandler, isCaptured, isEncountered})=> {
    const [modalVisible, setModalVisibility] = useState(false);
    const windowWidth = useWindowDimensions().width;
    // const windowHeight = useWindowDimensions().height;
    const imageWidth = windowWidth - (windowWidth %100)-175;
    const [isImageLoading, setImageLoading]  =useState(true);
    const [fontsLoaded] = useFonts({
        'Playfair': require('../assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
        'Quicksand': require('../assets/fonts/Quicksand-Bold.ttf')
    })

      useEffect(()=> {
        if(modalVisible && item?.cries?.latest) {
          playPokemonCry(item.cries.latest)
        }
      },[modalVisible])
      if(!fontsLoaded) {
        return(
          <View>
            <ActivityIndicator size={100}/>
          </View>
        )
      } 

  console.log(item);

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
            {item !== "" ? (
              <Image
                source={{
                  uri: item.imageUrl,
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 60,
              }}
            >
              <View style={{ flex: 0 }}></View>
              <CustomButton
                title={isCaptured ? "Release" : "Captured"}
                backgroundColor={isCaptured ? "red" : "blue"}
                onPress={() => buttonHandler("setCaptured", item.entry_number)}
              />
              <CustomButton
                title={!isEncountered ? "Encountered" : "Forgot"}
                backgroundColor={!isEncountered ? "green" : "orange"}
                color={!isEncountered?'white': 'purple'}
                onPress={() =>
                  buttonHandler("setEncountered", item.entry_number)
                }
              />
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
            <ScrollView style={styles.contentContainer}>
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
              {item !== "" ? (
                <Image
                  source={{
                    uri: item.imageUrl,
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
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <FlatList
                  data={item.abilities}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        alignItems: "flex-start",
                        paddingHorizontal: 20,
                        marginVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "greenyellow",
                          fontSize: 25,
                          padding: 10,
                          borderRadius: 20,
                          color: 'purple'
                        }}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </View>
                  )}
                  ListHeaderComponent={
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginLeft: -40,
                        }}
                      >
                        Abilities
                      </Text>
                    </View>
                  }
                />
                <View>
                  <Text style={[styles.middleText, {textAlign: 'center', color: 'black'}]}>Height:</Text>
                  <Text style={[styles.middleText, {textAlign: 'center', color: 'black'}]}>{item.height}</Text>
                  <Text style={{ color: "white" }}>....</Text>
                  <Text style={[styles.middleText, {textAlign: 'center', color: 'black'}]}>Weight</Text>
                  <Text style={[styles.middleText, {textAlign: 'center', color: 'black'}]}>{item.weight}</Text>
                </View>
                <FlatList
                  data={item.types}
                  ListHeaderComponent={
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginRight: -40,
                        }}
                      >
                        Type{item.types.length > 1 ? "s" : null}
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        alignItems: "flex-end",
                        paddingHorizontal: 20,
                        marginVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: TYPE_COLORS[item],
                          fontSize: 25,
                          padding: 10,
                          borderRadius: 20,
                          color: item==='ghost'|| item==='poison' || item==='water' || item==='fighting' || item==='dragon' ? 'white': 'purple',
                        }}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </View>
                  )}
                />
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 15}}>
                <Text style={styles.middleText}>HP: {item.stats[0].base_stat}</Text>
                <Text style={styles.middleText}>Attack: {item.stats[1].base_stat}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
                <Text style={styles.middleText}>Defense: {item.stats[2].base_stat}</Text>
                <Text style={styles.middleText}>Special Attack: {item.stats[3].base_stat}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 40}}>
                <Text style={styles.middleText}>Special Defense: {item.stats[4].base_stat}</Text>
                <Text style={styles.middleText}>Speed: {item.stats[5].base_stat}</Text>
              </View>
            </ScrollView>
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
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 2
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
        height: 450
    },
    middleText: {
      fontFamily: 'Quicksand',
      fontSize: 25,
      color: 'purple'
    }

})


const TYPE_COLORS = {
    grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820',
    normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
    fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
    ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', steel: '#B8B8D0',
    flying: '#A890F0', all: '#333'
};