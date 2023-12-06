import { StyleSheet, Text, TouchableOpacity } from 'react-native';


export default function Button({label, icon = null, onPress}) {
  return(
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      {icon}
      <Text style={{color: '#fff'}}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: 4,
  },
});