import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function RatingModal({
  visible = false,
  rating: ratingProp = 0,
  onRate = () => {},
  onDeleteRate = () => {},
  onOutsidePress = () => {},
}) {

  const [rating, setRating] = useState(0);


  useEffect(() => {
    setRating(ratingProp);
  }, [ratingProp]);


  function handleStarPress(index) {
    setRating(index + 1);
  }

  function handleRate() {
    onRate(rating);
  }

  function handleDeleteRating() {
    onDeleteRate();
  }

  function renderStars() {
    const stars = [];

    for(let i = 0; i < 10; i++) {
      stars.push(
        <Pressable key={i} onPress={() => handleStarPress(i)}>
          <FontAwesome name={i < rating ? "star": "star-o"} size={26} color="cornflowerblue" />
        </Pressable>
      );
    }

    return stars;
  }

  return(
    <Modal visible={visible} transparent={true}>
      <Pressable
        style={styles.container}
        onPress={() => {
          onOutsidePress();
          setRating(ratingProp);
        }}
      >

        <View style={styles.contentContainer}>
          <View style={styles.ratingIconsContainer}>
            {renderStars()}
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'cornflowerblue'}]}
            onPress={() => {
              handleRate(rating);
            }}
          >
            <Text style={styles.text}>Avaliar</Text>
          </TouchableOpacity>

          {ratingProp !== 0 && (
            <TouchableOpacity style={styles.button} onPress={handleDeleteRating}>
              <Text style={{color: 'cornflowerblue'}}>Deletar avaliação</Text>
            </TouchableOpacity>
          )}
        </View>


      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa'
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderRadius: 10,
    gap: 10,
  },
  ratingIconsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});