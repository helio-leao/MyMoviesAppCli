import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';


export default function CreateUserScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState('');


  function handleSave() {
    let incorrectDataFields = [];

    if(name.trim().length < 6) {
      incorrectDataFields.push('nome');
    }

    if(!(email.includes('@') && email.includes('.'))) {
      incorrectDataFields.push('email');
    }

    if(phone.length !== 15) {
      incorrectDataFields.push('telefone');
    }


    if(incorrectDataFields.length !== 0) {
      setErrorMessage(incorrectDataFields.join(', ')
        + (incorrectDataFields.length > 1 ? ' inválidos' : ' inválido'));
    } else {
      setErrorMessage('');
      Alert.alert('Verificado com sucesso')
    }
  }

  function formatPhone(input) {
    const digits = input.match(/[\d]/g)?.slice(0, 11) || [];
    let formatted = digits.join('');
    
    if (digits.length > 7) {
      formatted = '(' + digits.slice(0, 2).join('') + ') ' +
        + digits.slice(2, 7).join('') + '-' + digits.slice(7).join('');
    } else if(digits.length > 2) {
      formatted = '(' + digits.slice(0, 2).join('') + ') ' +
        + digits.slice(2).join('');
    } else if(digits.length > 0) {
      formatted = '(' + digits.join('');
    }
    
    setPhone(formatted);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome *</Text>
      <TextInput
        testID='name-input'
        style={styles.input}
        placeholder='Pelo menos 6 caracteres'
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        testID='email-input'
        style={styles.input}
        placeholder='exemplo@email.com'
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Telefone *</Text>
      <TextInput
        testID='phone-input'
        keyboardType='numeric'
        style={styles.input}
        placeholder='(99) 99999-9999'
        value={phone}
        onChangeText={formatPhone}
      />

      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SALVAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 60,
    fontSize: 16,
  },
  errorMessageContainer: {
    color: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    height: 20,
    justifyContent: 'center',
  },
  errorMessageText: {
    color: '#f55',
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: '#444',
    borderRadius: 4,
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff'
  },
});