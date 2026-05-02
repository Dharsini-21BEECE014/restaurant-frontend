import axios from "axios";

const api = axios.create({
  baseURL: "https://restaurant-backend-iwqv.onrender.com/api",
});

export default api;
