import { View, TextInput, Alert, Keyboard } from "react-native";
import CustomButton from "./CustomButton";
import { useWindowDimensions } from "react-native";
import { useRef } from "react";

const SearchHeader = ({color, value, onChangeText, onSearch})=> {
    const windowWidth = useWindowDimensions().width;
     const inputRef = useRef(null);

     const HandleSearch = () => {
      Keyboard.dismiss();
      inputRef.current.blur();
        if(onSearch) {
          onSearch();
        }
          }
    return (
      <View
        style={{
          flexDirection: "row",
          height: 250,
          backgroundColor: color,
          marginBottom: 20,
          borderRadius: 45,
          marginHorizontal: 15,
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
        <CustomButton
          title={"Search"}
          onPress={HandleSearch}
        />
      </View>
    );
}

export default SearchHeader;