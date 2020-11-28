import AsyncStorage from '@react-native-community/async-storage';
const API_URL = 'http://playvideo.online/api';

const login = (email, password) => {
  let params = new FormData();
  params.append('email', email);
  params.append('password', password);

  return fetch(API_URL + '/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const register = (email, password, name) => {
  let params = new FormData();
  params.append('email', email);
  params.append('name', name);
  params.append('password', password);

  return fetch(API_URL + '/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const changeUserPassword = async (oldPassword, newPassword) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  // eslint-disable-next-line no-undef
  const formData = new URLSearchParams();
  formData.append('old_password', oldPassword);
  formData.append('new_password', newPassword);

  return fetch(API_URL + '/user/password', {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  }).then(response => response.json());
}

const updateUser = async (name) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  // eslint-disable-next-line no-undef
  const formData = new URLSearchParams();
  formData.append('name', name);

  return fetch(API_URL + '/user', {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  }).then(response => response.json());
}

const getUser = async () => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/user', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getTags = async () => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/tags', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const addUserTags = async (tags) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let params = new FormData();
  params.append('tags', JSON.stringify(tags));

  return fetch(API_URL + '/user/tags', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
}

const getCollections = async () => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/collections', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const addVideoToCollection = async (collectionId, videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/collection/' + collectionId + '/video/' + videoId, {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getFeed = async (nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/feed?limit=10';

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const likeVideo = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/video/' + videoId + "/liked", {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const dislikeVideo = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/video/' + videoId + "/liked", {
    method: 'DELETE',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const watchVideo = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/video/' + videoId + "/watched", {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getRecentVideos = async (nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/videos/recent?limit=10';

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getLikedVideos = async (nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/videos/liked?limit=10';

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const searchVideos = async (keyword, nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/videos/search?limit=10&q=' + keyword;

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const createCollection = async (title) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let params = new FormData();
  params.append('title', title);

  return fetch(API_URL + "/collection", {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params
  }).then(response => response.json());
}

const deleteCollection = async (collectionId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + "/collection/" + collectionId, {
    method: 'DELETE',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const deleteVideoFromCollection = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + "/collection/video/" + videoId, {
    method: 'DELETE',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getCollectionVideo = async (collectionId, nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/collection/' + collectionId + "/video?limit=12" ;

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getCategories = async () => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/categories', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const getCategoryVideos = async (categoryId, nextURL = undefined) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let URL = API_URL + '/category/' + categoryId + "/video?limit=10" ;

  if (nextURL) {
    URL = nextURL;
  }

  return fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const saveVideo = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + '/video/' + videoId + '/save', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

const deleteVideoSaved = async (videoId) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  return fetch(API_URL + "/video/" + videoId + "/save", {
    method: 'DELETE',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
}

export default {
  login,
  register,
  getTags,
  addUserTags,
  getCollections,
  addVideoToCollection,
  getFeed,
  likeVideo,
  watchVideo,
  dislikeVideo,
  getRecentVideos,
  getLikedVideos,
  searchVideos,
  createCollection,
  deleteCollection,
  getCollectionVideo,
  deleteVideoFromCollection,
  getCategories,
  getCategoryVideos,
  saveVideo,
  deleteVideoSaved,
  changeUserPassword,
  updateUser,
  getUser
};
