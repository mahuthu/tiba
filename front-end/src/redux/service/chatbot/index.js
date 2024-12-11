import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";

export const getExampleQuestions = (auth) => {
    const axiosInstance = UseAxios(auth);
    
    console.log('Calling chatbot API:', APP_API_URL.CHATBOT_CHAT);

    return new Promise((resolve, reject) => {
        // Use axios directly with full URL
        // axios.get(`http://localhost:8080${APP_API_URL.CHATBOT_CHAT}`, {
        axios.get(`https://34.35.68.156${APP_API_URL.CHATBOT_CHAT}`, {

            headers: {
                Authorization: `Bearer ${auth?.token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                console.log('Chatbot API response:', res.data);
                resolve({
                    examples: res.data.available_queries,
                    message: res.data.message
                });
            })
            .catch((err) => {
                console.error('Chatbot API error:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                reject(err.message);
            });
    });
};

export const sendChatMessage = (message, auth) => {
    return new Promise((resolve, reject) => {
        // axios.post(`http://localhost:8080${APP_API_URL.CHATBOT_CHAT}`, {
        axios.post(`https://34.35.68.156${APP_API_URL.CHATBOT_CHAT}`, {

            question: message
        }, {
            headers: {
                Authorization: `Bearer ${auth?.token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                resolve({
                    response: res.data.response,
                    structured_data: res.data.structured_data,
                    visualization: res.data.visualization,
                    query_type: res.data.query_type
                });
            })
            .catch((err) => {
                console.error('Chatbot API error:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                reject(err.message);
            });
    });
};

export const getQueryByType = (queryType, auth) => {
    return new Promise((resolve, reject) => {
        // axios.get(`http://localhost:8080${APP_API_URL.CHATBOT_CHAT}`, {
        axios.get(`http://34.35.68.156${APP_API_URL.CHATBOT_CHAT}`, {

            params: { query_type: queryType },
            headers: {
                Authorization: `Bearer ${auth?.token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                resolve({
                    response: res.data.response,
                    structured_data: res.data.structured_data,
                    visualization: res.data.visualization,
                    query_type: queryType
                });
            })
            .catch((err) => {
                console.error('Chatbot API error:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                reject(err.message);
            });
    });
};