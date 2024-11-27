import { createSlice } from "@reduxjs/toolkit";
import {
    getExampleQuestions,
    sendChatMessage,
    getQueryByType
} from "@/redux/service/chatbot";

const initialState = {
    examples: [],
    messages: [],
    loading: false,
    error: null,
    welcomeMessage: '',
};

const chatbotSlice = createSlice({
    name: "chatbot",
    initialState,
    reducers: {
        setExamples: (state, action) => {
            state.examples = action.payload.examples;
            state.welcomeMessage = action.payload.message;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setExamples, addMessage, setLoading, setError } = chatbotSlice.actions;

// Thunk actions
export const fetchExampleQuestions = (auth) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await getExampleQuestions(auth);
        dispatch(setExamples(response));
    } catch (error) {
        dispatch(setError(error.message));
        console.error("CHATBOT_EXAMPLES_ERROR ", error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const sendMessage = (message, auth) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        // Add user message
        dispatch(addMessage({
            type: 'user',
            content: message,
            timestamp: new Date()
        }));

        // Get AI response
        const response = await sendChatMessage(message, auth);
        
        // Add AI message
        dispatch(addMessage({
            type: 'assistant',
            content: response.response,
            structured_data: response.structured_data,
            visualization: response.visualization,
            query_type: response.query_type,
            timestamp: new Date()
        }));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(addMessage({
            type: 'error',
            content: 'Failed to get response. Please try again.',
            timestamp: new Date()
        }));
        console.error("CHATBOT_MESSAGE_ERROR ", error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchQueryByType = (queryType, auth) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await getQueryByType(queryType, auth);
        dispatch(addMessage({
            type: 'assistant',
            content: response.response,
            structured_data: response.structured_data,
            visualization: response.visualization,
            query_type: response.query_type,
            timestamp: new Date()
        }));
    } catch (error) {
        dispatch(setError(error.message));
        console.error("CHATBOT_QUERY_ERROR ", error);
    } finally {
        dispatch(setLoading(false));
    }
};

export default chatbotSlice.reducer;