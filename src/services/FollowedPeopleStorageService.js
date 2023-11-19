import AsyncStorage from '@react-native-async-storage/async-storage';


const FOLLOWED_PEOPLE_STORAGE_KEY = (userId) => `@user:${userId}:followed_people`;


// NOTE: alternative to the result object return strategy could be the try/catch here sending one
// generic error up like "Ocorreu um erro." and logging the error on the highest level with
// console.log or .warn or .error
async function addFollowedPerson(userId, newPerson) {
  const followedPeople = await getFollowedPeople(userId);
  
  if(followedPeople.find(person => newPerson.id === person.id)) {
    // NOTE: it's common to use "ok" too instead of "success"
    return {success: false, message: `Você já segue ${newPerson.name}.`}; 
  }
  
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY(userId),
    JSON.stringify([...followedPeople, newPerson]));

  return {success: true};
}

async function getFollowedPeople(userId) {
  const followedPeople = await AsyncStorage.getItem(FOLLOWED_PEOPLE_STORAGE_KEY(userId));
  return followedPeople ? JSON.parse(followedPeople) : [];
}

async function removeFollowedPerson(userId, followedPersonId) {
  const followedPeople = await getFollowedPeople(userId);
  const updatedFollowedPeople = followedPeople.filter(person => person.id !== followedPersonId);

  if(updatedFollowedPeople.length === 0) {
    await AsyncStorage.removeItem(FOLLOWED_PEOPLE_STORAGE_KEY(userId));
    return;
  }
  await AsyncStorage.setItem(FOLLOWED_PEOPLE_STORAGE_KEY(userId),
    JSON.stringify(updatedFollowedPeople));
}


export default {
  addFollowedPerson,
  getFollowedPeople,
  removeFollowedPerson,
}