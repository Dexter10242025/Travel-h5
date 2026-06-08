import axios from "axios";
// http://localhost:80/api/travel
const request = axios.create({
  baseURL: "https://wyj-travel-assistant-sever2-262567-8-1437172584.sh.run.tcloudbase.com/api/travel",
  // baseURL: "http://localhost:80/api/travel",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
