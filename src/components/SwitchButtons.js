import { StyleSheet, TouchableOpacity, View, Text } from "react-native";


export default function SwitchButtons({options, value, onChangeSelection, style}) {
  return (
    <View style={[style, styles.container]}>
      {options.map(option => (
        <TouchableOpacity
          key={option.label}
          style={value === option.value ? styles.activeButton : styles.inactiveButton}
          onPress={() => onChangeSelection(option.value)}
        >
          <Text style={styles.text}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  activeButton: {
    backgroundColor: '#888',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inactiveButton: {
    backgroundColor: '#444',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    color: '#fff',
  },
});