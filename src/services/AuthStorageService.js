import AsyncStorage from '@react-native-async-storage/async-storage';


const SESSION_ID_STORAGE_KEY = '@user:session_id';


async function setSessionId(id) {
  await AsyncStorage.setItem(SESSION_ID_STORAGE_KEY, id);
}

async function getSessionId() {
  return await AsyncStorage.getItem(SESSION_ID_STORAGE_KEY);
}

async function deleteSessionId() {
  await AsyncStorage.removeItem(SESSION_ID_STORAGE_KEY);
}


export default {
  setSessionId,
  getSessionId,
  deleteSessionId,
}