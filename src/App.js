import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import Routes from './routes/Routes';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Routes />
      <StatusBar style="light" backgroundColor='#000' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})