import axios from 'axios';
import { API_BASE_URL } from 'core/constants';

export { request };

const request = axios.create({
  baseURL: API_BASE_URL,
});