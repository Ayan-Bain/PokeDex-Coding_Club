import { View, TextInput, Keyboard, Text, ActivityIndicator } from "react-native";
import CustomButton from "./CustomButton";
import { useWindowDimensions } from "react-native";
import { useRef } from "react";
import { useFonts } from "expo-font";


const SearchHeader = ({color, value, onChangeText, onSearch, text})=> {
    const windowWidth = useWindowDimensions().width;
    const [fontsLoaded] = useFonts({
      'Playfair': require('../assets/fonts/PlayfairDisplay-BoldItalic.ttf')
    });
    const inputRef = useRef(null);
      const search = (text=='') ? '' : 'Search results for: '+text;
     const HandleSearch = () => {
      Keyboard.dismiss();
      inputRef.current.blur();
        if(onSearch) {
          onSearch();
        }
          }
          if(!fontsLoaded) {
            return(
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={100}/>
              </View>
            )
          }
    return (
      <View
        style={{
          height: 250,
            backgroundColor: color,
            marginBottom: 20,
            borderRadius: 45,
            marginHorizontal: 15,
            justifyContent: 'center'
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 0.7,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TextInput
            placeholder="Search Pokemon"
            ref={inputRef}
            style={{
              backgroundColor: "white",
              width: 0.65 * windowWidth,
              borderRadius: 15,
              paddingLeft: 10,
              fontSize: 20,
            }}
            onSubmitEditing={HandleSearch}
            returnKeyType="search"
            placeholderTextColor={"black"}
            onChangeText={onChangeText}
            value={value}
          />
          <CustomButton title={"Search"} onPress={HandleSearch} />
        </View>
        <Text style={{
          paddingLeft: 20,
          fontFamily: 'Playfair',
          fontSize: 26
        }}>{search}</Text>
      </View>
    );
}

export default SearchHeader;