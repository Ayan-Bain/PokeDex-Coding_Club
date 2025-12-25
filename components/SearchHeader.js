import { View, TextInput, Alert } from "react-native";
import CustomButton from "./CustomButton";
import { useWindowDimensions } from "react-native";
import { useState } from "react";

const SearchHeader = ()=> {
    const windowWidth = useWindowDimensions().width;
     const [text, setText] = useState('');
    return (
      <View
        style={{
          flexDirection: "row",
          height: 250,
          backgroundColor: "greenyellow",
          marginBottom: 20,
          borderRadius: 45,
          marginHorizontal: 15,
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TextInput
          placeholder="Search Pokemon"
          style={{
            backgroundColor: "white",
            width: 0.65 * windowWidth,
            borderRadius: 15,
            paddingLeft: 10,
            fontSize: 20,
          }}
          placeholderTextColor={"black"}
          onChangeText={(newText) => setText(newText)}
          value={text}
        />
        <CustomButton
          title={"Search"}
          onPress={() => {
            Alert.alert(text);
            setText('');
          }}
        />
      </View>
    );
}

export default SearchHeader;