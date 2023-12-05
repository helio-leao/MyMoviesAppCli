import AsyncStorage from '@react-native-async-storage/async-storage';


const getFollowedPeopleStorageKey = (userId) => `@user:${userId}:followed_people`;


async function addFollowedPerson(userId, newPerson) {
  const followedPeople = await getFollowedPeople(userId);
  
  if(followedPeople.find(person => newPerson.id === person.id)) {
    return {success: false, message: `Você já segue ${newPerson.name}.`}; 
  }
  
  await AsyncStorage.setItem(getFollowedPeopleStorageKey(userId),
    JSON.stringify([...followedPeople, newPerson]));

  return {success: true};
}

async function getFollowedPeople(userId) {
  const followedPeople = await AsyncStorage.getItem(getFollowedPeopleStorageKey(userId));
  return followedPeople ? JSON.parse(followedPeople) : [];
}

async function removeFollowedPerson(userId, followedPersonId) {
  const followedPeople = await getFollowedPeople(userId);
  const updatedFollowedPeople = followedPeople.filter(person => person.id !== followedPersonId);

  if(updatedFollowedPeople.length === 0) {
    await AsyncStorage.removeItem(getFollowedPeopleStorageKey(userId));
    return;
  }
  await AsyncStorage.setItem(getFollowedPeopleStorageKey(userId),
    JSON.stringify(updatedFollowedPeople));
}


export default {
  addFollowedPerson,
  getFollowedPeople,
  removeFollowedPerson,
}