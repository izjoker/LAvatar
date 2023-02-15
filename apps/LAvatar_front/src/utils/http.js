import axios from 'axios';

export const httpClient = axios.create();
httpClient.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export default httpClient;