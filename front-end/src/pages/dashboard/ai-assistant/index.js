import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import ChatInterface from "@/components/dashboard/ai-assistant/chat-interface";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProtectedRoute from "@/assets/hoc/protected-route";
import ErrorBoundary from "@/components/dashboard/ai-assistant/error-boundary";

const AIAssistant = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        AI Assistant
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <ErrorBoundary>
          <ChatInterface />
        </ErrorBoundary>
      </Paper>
    </Container>
  );
};

AIAssistant.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_AI_ASSISTANT_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default AIAssistant;