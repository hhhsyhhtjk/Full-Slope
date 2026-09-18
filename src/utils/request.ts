import axios from "axios";

const request = axios.create({
  baseURL: "你自己的请求地址",
  timeout: 10000,
});

export default request;
