import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper } from '@mui/material';
import MessageList from './message-list';
import ChatInput from './chat-input';
import { useAuth } from '@/hooks/use-auth';
import { fetchExampleQuestions, sendMessage } from '@/redux/features/chatbot';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { messages, loading, error } = useSelector((state) => state.chatbot);

  // Fetch example questions when component mounts
  useEffect(() => {
    dispatch(fetchExampleQuestions(auth));
  }, [dispatch, auth]);

  const handleNewMessage = async (messageText) => {
    dispatch(sendMessage(messageText, auth));
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '80vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <MessageList 
        messages={messages} 
        isLoading={loading}
      />
      <ChatInput 
        onNewMessage={handleNewMessage} 
        disabled={loading}
      />
    </Paper>
  );
};

export default ChatInterface;