import AsyncStorage from '@react-native-async-storage/async-storage';


const FOLLOWING_KEY = 'following';


export const Error = {
  ALREADY_STORED: 'ID already in storage.',
}


export async function addFollowedPerson(newPerson) {
  const followedPersons = await getFollowedPersons();

  if(followedPersons.find(person => newPerson.id === person.id)) {
    throw Error(Error.ALREADY_STORED);
  }
  
  await AsyncStorage.setItem(FOLLOWING_KEY, JSON.stringify([...followedPersons, newPerson]));
}

export async function getFollowedPersons() {
  const followedPersons = await AsyncStorage.getItem(FOLLOWING_KEY);
  return followedPersons ? JSON.parse(followedPersons) : [];
}

export async function removeFollowedPerson(id) {
  const followedPersons = await getFollowedPersons();
  const updatedFollowedPersons = followedPersons.filter(person => person.id !== id);
  await AsyncStorage.setItem(FOLLOWING_KEY, JSON.stringify(updatedFollowedPersons));
}