
export const HTTP_BACKEND = "https://draw-app-trial.onrender.com"
export const WS_URL = "wss://draw-app-trial.onrender.com";

import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL : HTTP_BACKEND
})