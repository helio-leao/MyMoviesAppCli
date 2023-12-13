import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

// NOTE: maybe more descriptive names would be better for components, like
// containerStyle instead of style


export default function SwitchButtons({options, value, onChangeSelection, style}) {
  return (
    <View style={style}>
      <View style={styles.buttonsContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
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