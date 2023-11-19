import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Text, ToastAndroid } from 'react-native';
import SearchResultCard from '../components/SearchResultCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ApiService from '../services/ApiService';


export default function SearchScreen() {

  const [query, setQuery] = useState('');
  const [pageData, setPageData] = useState(null);


  async function handleSearch() {
    try {
      const data = await ApiService.fetchMulti(query);
      setPageData(data);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  return (
    <View style={styles.container}>
      {/* searchbar */}
      <View>
        <TextInput
          style={styles.searchBarInput}
          placeholder='O que você procura?'
          placeholderTextColor='#888'
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBarButton} onPress={handleSearch}>
          <FontAwesome name="search" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      {/* result list */}
      <FlatList
        contentContainerStyle={styles.resultsContainer}
        data={pageData?.results}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <SearchResultCard item={item} />}
        ItemSeparatorComponent={<View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#333', fontSize: 18}}>Nenhum resultado para exibir.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  searchBarInput: {
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 4,
    margin: 20,
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 60,
    fontSize: 16,
  },
  searchBarButton: {
    position: 'absolute',
    top: 21,
    right: 30,
    padding: 10,
  },
  resultsContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});