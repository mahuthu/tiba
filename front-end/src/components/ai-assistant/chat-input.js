import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSendMessageMutation } from '@/redux/service/chatbot';

const ChatInput = ({ onNewMessage }) => {
  const [message, setMessage] = useState('');
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      // Add user message
      onNewMessage({
        type: 'user',
        content: message.trim()
      });

      try {
        // Send to API and get response
        const response = await sendMessage(message.trim()).unwrap();
        
        // Add assistant response
        onNewMessage({
          type: 'assistant',
          content: response.response,
          data: response.structured_data,
          visualization: response.visualization,
          queryType: response.query_type
        });
      } catch (error) {
        onNewMessage({
          type: 'error',
          content: 'Sorry, I encountered an error processing your request.'
        });
      }

      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 1
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <IconButton 
        type="submit" 
        color="primary" 
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

export default ChatInput;