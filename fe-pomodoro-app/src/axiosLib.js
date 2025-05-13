import axios from 'axios';
import config from './config';

const uiUrl = config.uiUrl;

const axiosCustomApi = axios.create({
  baseURL: uiUrl,
});

export default axiosCustomApi;
