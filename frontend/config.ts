
export const HTTP_BACKEND = "https://draw-app-trial-p2c1.vercel.app/api"
export const WS_URL = "https://draw-app-trial-p2c1.vercel.app:8080";

import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL : HTTP_BACKEND
})