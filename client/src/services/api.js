import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api' // backend base URL (change if needed)
});

export default API;
