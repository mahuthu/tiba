import axios from "axios";

export const backendAxiosInstance = axios.create({
    // baseURL: "http://backend:8080/",
    baseURL: "http://34.35.68.156/api",
});

backendAxiosInstance.interceptors.request.use(async (request) => {
    console.log("REQUEST ",request);
    return request;
});

// backendAxiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Handle different error formats
//             const errorData = error.response.data;
//             let standardError = {
//                 non_field_errors: ['An error occurred']
//             };

//             if (errorData.non_field_errors) {
//                 standardError.non_field_errors = errorData.non_field_errors;
//             } else if (errorData.detail) {
//                 standardError.non_field_errors = [errorData.detail];
//             } else if (typeof errorData === 'string') {
//                 standardError.non_field_errors = [errorData];
//             }

//             error.response.data = standardError;
//         }
//         return Promise.reject(error);
//     }

// );
// http://127.0.0.1:8080/
//http://backend:8080