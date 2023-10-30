import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';


export default function CreateUserScreen() {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [feedback, setFeedback] = useState('');


  function handleSave() {
    try {
      const user = createUserObject();

      console.log('TODO: do something with user: ', user);

      setFeedback('Verificado com sucesso');
    } catch (error) {
      setFeedback(error.message);
    }
  }

  function createUserObject() {
    if(name.trim().length < 6) {
      throw new Error('Nome inválido');
    }

    if(phone.length !== 15) {
      throw new Error('Telefone inválido');
    }

    if(!(email.includes('@') && email.includes('.'))) {
      throw new Error('Email inválido');
    }

    if(password.trim().length < 8) {
      throw new Error('O password deve ter pelo menos 8 caracteres');
    }

    if(password !== confirmPassword) {
      throw new Error('O password de confirmação não confere');
    }

    return {name, phone, email, password};
  }

  function handlePhone(input) {
    let formatted = input
      .replace(/[^\d]/g, '')
      .replace(/(\d{2})(\d+)/, '($1) $2')
      .replace(/(.{10})(\d+)/, '$1-$2');
    
    setPhone(formatted);
  }


  return (
    <View style={styles.container}>
      <ScrollView>

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          testID='name-input'
          style={styles.input}
          placeholder='Seu nome completo'
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          testID='phone-input'
          keyboardType='numeric'
          style={styles.input}
          placeholder='(99) 99999-9999'
          maxLength={15}
          value={phone}
          onChangeText={handlePhone}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          testID='email-input'
          style={styles.input}
          placeholder='exemplo@email.com'
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha *</Text>
        <TextInput
          testID='pass-input'
          style={styles.input}
          placeholder='Pelo menos 8 caracteres'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar Senha *</Text>
        <TextInput
          testID='confirm-pass-input'
          style={styles.input}
          placeholder='Pelo menos 8 caracteres'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.feedbackContainer}>
          <Text testID='feedback-message' style={{color: feedback.includes('sucesso') ? '#0f0' : '#f00'}}>
            {feedback}
          </Text>
        </View>

        <TouchableOpacity testID='save-button' style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>

      </ScrollView>
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
  feedbackContainer: {
    color: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    height: 20,
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff'
  },
});