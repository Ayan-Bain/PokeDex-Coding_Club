import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
    return(
        <SafeAreaView>
        <View>
        <TextInput placeholder="Search Here"/>
        </View>
        </SafeAreaView>
    )
}


export default SearchScreen;