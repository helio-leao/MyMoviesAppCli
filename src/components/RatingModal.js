import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function RatingModal({
  visible = false,
  rating: ratingProp = undefined,
  onRate = () => {},
  onDeleteRate = () => {},
  onOutsidePress = () => {},
}) {

  const [rating, setRating] = useState(ratingProp);


  useEffect(() => {
    setRating(ratingProp);
  }, [ratingProp]);


  function renderStars() {
    const stars = [];

    for(let i = 0; i < 10; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setRating(i + 1)}>
          <FontAwesome name={i < rating ? "star" : "star-o"} size={26} color="cornflowerblue" />
        </Pressable>
      );
    }
    return stars;
  }


  return(
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable
        style={styles.outside}
        onPress={() => {
          onOutsidePress();
          setRating(ratingProp);
        }}
      >

        {/* NOTE: this pressable avoids triggering parent's onPress when this wrapper is pressed */}
        <Pressable style={styles.container}>

          {/* big star on top */}
          <View style={{
              position: 'absolute',
              alignSelf: 'center',
              top: rating ? -(40 + rating) : -40,
          }}>
            <FontAwesome
              name={"star"}
              size={rating ? (80 + rating) : 80}
              color="cornflowerblue"
            />

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
            }}>
              <Text style={{
                fontSize: rating ? (16 + rating) : 16,
                color: '#fff',
              }}>
                {rating}
              </Text>
            </View>
          </View>
          {/* end big star on top */}

          {/* 10 interactible stars */}
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>

          {/* buttons */}
          <TouchableOpacity
            style={[styles.button, {backgroundColor: rating == undefined ? 'grey' : 'cornflowerblue'}]}
            onPress={() => onRate(rating)}
            disabled={rating == undefined}
          >
            <Text style={{color: '#fff'}}>Avaliar</Text>
          </TouchableOpacity>

          {ratingProp && (
            <TouchableOpacity
              style={[styles.button, {alignSelf: 'center'}]}
              onPress={onDeleteRate}
            >
              <Text style={{color: 'cornflowerblue'}}>
                Deletar avaliação
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>

      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  outside: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa'
  },
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderRadius: 10,
    gap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
});