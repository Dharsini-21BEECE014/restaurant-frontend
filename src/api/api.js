import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5021/api",
});

export default api;
