import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import MessageList from './message-list';
import ChatInput from './chat-input';
import { useGetExampleQuestionsQuery } from '@/redux/service/chatbot';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const { data: exampleQuestions, isLoading: loadingExamples } = useGetExampleQuestionsQuery();

  // Add example questions as first message when they load
  React.useEffect(() => {
    if (exampleQuestions) {
      setMessages([{
        type: 'system',
        content: 'Welcome! Here are some example questions you can ask:',
        examples: exampleQuestions.examples
      }]);
    }
  }, [exampleQuestions]);

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <MessageList 
        messages={messages} 
        isLoading={loadingExamples}
      />
      <ChatInput onNewMessage={handleNewMessage} />
    </Paper>
  );
};

export default ChatInterface;