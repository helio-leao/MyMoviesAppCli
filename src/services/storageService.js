import AsyncStorage from '@react-native-async-storage/async-storage';


const FOLLOWED_PEOPLE_STORAGE_KEY = '@social:followed_people';


export const Error = {
  ALREADY_STORED: 'ID already in storage.',
}


export async function addFollowedPerson(newPerson) {
  const followedPeople = await getFollowedPeople();

  if(followedPeople.find(person => newPerson.id === person.id)) {
    throw Error(Error.ALREADY_STORED);
  }
  
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY, JSON.stringify([...followedPeople, newPerson]));
}

export async function getFollowedPeople() {
  const followedPeople = await AsyncStorage.getItem(FOLLOWED_PEOPLE_STORAGE_KEY);
  return followedPeople ? JSON.parse(followedPeople) : [];
}

export async function removeFollowedPerson(id) {
  const followedPeople = await getFollowedPeople();
  const updatedFollowedPeople = followedPeople.filter(person => person.id !== id);
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY, JSON.stringify(updatedFollowedPeople));
}