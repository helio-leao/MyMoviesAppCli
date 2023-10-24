import AsyncStorage from '@react-native-async-storage/async-storage';


const FOLLOWED_PEOPLE_STORAGE_KEY = '@social:followed_people';

// NOTE: alternative to the result object return strategy could be the try/catch here sending one
// generic error up like "Ocorreu um erro." and logging the error with console.log or .warn or .error
// NOTE: it's common to use ok too instead of success
async function addFollowedPerson(newPerson) {
  const followedPeople = await getFollowedPeople();

  if(followedPeople.find(person => newPerson.id === person.id)) {
    return {success: false, message: `Você já segue ${newPerson.name}.`};
  }
  
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY, JSON.stringify([...followedPeople, newPerson]));
  return {success: true};
}

async function getFollowedPeople() {
  const followedPeople = await AsyncStorage.getItem(FOLLOWED_PEOPLE_STORAGE_KEY);
  return followedPeople ? JSON.parse(followedPeople) : [];
}

async function removeFollowedPerson(id) {
  const followedPeople = await getFollowedPeople();
  const updatedFollowedPeople = followedPeople.filter(person => person.id !== id);
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY, JSON.stringify(updatedFollowedPeople));
}


export default {
  addFollowedPerson,
  getFollowedPeople,
  removeFollowedPerson,
}