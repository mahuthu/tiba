import axios from "axios";

export const backendAxiosInstance = axios.create({
    baseURL: "http://34.35.68.156/api",
});

backendAxiosInstance.interceptors.request.use(async (request) => {
    console.log("REQUEST ",request);
    return request;
});
// http://127.0.0.1:8080/
//http://backend:8080