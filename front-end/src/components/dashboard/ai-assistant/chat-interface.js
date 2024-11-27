import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import MessageList from './message-list';
import ChatInput from './chat-input';
import { useAuth } from '@/assets/hooks/use-auth';

import { getExampleQuestions, sendChatMessage } from '@/redux/service/chatbot';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const auth = useAuth();

  // Fetch example questions on component mount
  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const response = await getExampleQuestions(auth);
        if (response.examples) {
          setMessages([{
            type: 'system',
            content: 'Welcome! Here are some example questions you can ask:',
            examples: response.examples
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch examples:', error);
        setMessages([{
          type: 'error',
          content: 'Failed to load example questions. Please try again later.'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, [auth]);

  const handleNewMessage = async (messageText) => {
    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setSending(true);

    try {
      // Send message to backend
      const response = await sendChatMessage(messageText, auth);
      
      // Add AI response to chat
      const aiMessage = {
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        structured_data: response.structured_data,
        visualization: response.visualization,
        query_type: response.query_type
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      const errorMessage = {
        type: 'error',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
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
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <MessageList 
            messages={messages} 
            isLoading={sending}
          />
          <ChatInput 
            onNewMessage={handleNewMessage} 
            disabled={sending}
          />
        </>
      )}
    </Paper>
  );
};

export default ChatInterface;