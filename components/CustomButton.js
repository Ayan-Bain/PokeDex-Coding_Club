import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',    
    backgroundColor: '#000000', // Example background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    // Optional: add fixed height/width if needed, but padding is usually better
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures the text itself is centered within its own bounds
    // Optional: for Android, includeFontPadding={false} can improve vertical alignment
    // textAlignVertical: 'center', // Android-only prop, but generally handled by container alignment
  },
});

export default CustomButton;
