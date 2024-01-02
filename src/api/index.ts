import axios from 'axios';
import { HTTP_BASE_URL } from '../constants/api';

export const instance = axios.create({
  baseURL: HTTP_BASE_URL,
});
