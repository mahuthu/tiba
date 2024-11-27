import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderVisualization = (message) => {
    if (!message.visualization || !message.data) return null;

    switch (message.visualization.type) {
      case 'bar':
        return (
          <Box sx={{ height: 300, width: '100%', mt: 2 }}>
            <ResponsiveContainer>
              <BarChart
                data={message.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={message.visualization.x} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey={message.visualization.y} 
                  fill="#8884d8" 
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        );

      case 'pie':
        return (
          <Box sx={{ height: 300, width: '100%', mt: 2 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={message.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={message.visualization.value}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                >
                  {message.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderExamples = (examples) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {Object.entries(examples).map(([category, questions]) => (
        questions.map((question, idx) => (
          <Chip
            key={`${category}-${idx}`}
            label={question}
            variant="outlined"
            size="small"
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
            onClick={() => {
              // You can add click handler to auto-fill the question
              if (typeof onQuestionClick === 'function') {
                onQuestionClick(question);
              }
            }}
          />
        ))
      ))}
    </Box>
  );

  if (isLoading && !messages.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography sx={{ mt: 1 }}>Loading initial messages...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: message.visualization ? '90%' : '70%',
            backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.100',
            color: message.type === 'user' ? 'white' : 'text.primary',
            borderRadius: 2,
            p: 2,
            transition: 'all 0.3s ease'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {message.content}
          </Typography>
          
          {message.examples && renderExamples(message.examples)}
          
          {message.data && !message.visualization && (
            <Box sx={{ mt: 2 }}>
              <pre style={{ 
                whiteSpace: 'pre-wrap',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                padding: '8px',
                borderRadius: '4px',
                margin: 0
              }}>
                {JSON.stringify(message.data, null, 2)}
              </pre>
            </Box>
          )}
          
          {message.visualization && renderVisualization(message)}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;