import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const CapturedScreen = () => {


    return(
        <SafeAreaView>
            <View>
                <Text>This is Captured Screen</Text>
            </View>
        </SafeAreaView>
    )
}

export default CapturedScreen;