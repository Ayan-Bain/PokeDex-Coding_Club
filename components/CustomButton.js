import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title, backgroundColor, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, {backgroundColor: backgroundColor? backgroundColor : '#000000'}]} activeOpacity={0.8}>
      <Text style={[styles.buttonText,{color: color ? color : '#fff'}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',    
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomButton;
