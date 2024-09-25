import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:44375/',
})

export default api;