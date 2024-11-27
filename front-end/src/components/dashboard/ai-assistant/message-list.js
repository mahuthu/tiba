import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
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

  const renderVisualization = (visualization, data) => {
    if (!visualization || !data) return null;

    switch (visualization.type) {
      case 'bar':
        return (
          <Box sx={{ height: 300, width: '100%', mt: 2 }}>
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={visualization.x} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey={visualization.y} 
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={visualization.value}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
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
          />
        ))
      ))}
    </Box>
  );

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
            p: 2
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
          
          {message.examples && renderExamples(message.examples)}
          
          {message.structured_data && renderVisualization(message.visualization, message.structured_data)}
        </Box>
      ))}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;