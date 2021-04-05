// First we need to import axios.js
import axios, { AxiosInstance } from 'axios';
// Next we make an 'instance' of it

const instance: AxiosInstance = axios.create({
  // .. where we make our configurations
  baseURL: 'https://www.my-apps.me/api',
  withCredentials: true
});

export default instance;
