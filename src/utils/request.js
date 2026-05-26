import axios from "axios";

const request = axios.create({
  baseURL: "https://wyj-travel-assistant-sever2-262567-8-1437172584.sh.run.tcloudbase.com/api/travel",
  timeout: 60000,
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
