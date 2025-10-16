import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Card } from '@mui/material';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats'; // Now for Conversation Stats
// Removed RecentTicketList
// Removed TicketFormModal
// Removed EngineerTicketDetail
import EngineerTicketDetail from './components/EngineerTicketDetail';
import AdminPanel from './components/AdminPanel';

import Chatbot from './components/Chatbot/Chatbot';
import UserSidebar from './components/UserSidebar';

import AdminManagementPanel from './components/Admin/AdminManagementPanel';
import KnowledgeBaseManagement from './components/Admin/KnowledgeBaseManagement';
import RecentConversationList from './components/Admin/RecentConversationList';


// --- Mock Data for Conversations --- (This is the primary data source now)
const initialConversations = [
  {
    id: 'CONV001',
    topic: 'Login Issues with SSO', // Use topic instead of ticketTitle
    startDate: '2024-01-15',
    isResolved: false,
    messages: [
      { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
      { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
      { sender: 'user', text: 'Yes, I tried that and still no luck.' },
      { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
    ],
    user: 'John Doe',
    category: 'Account Access',
    priority: 'High',
  },
  {
    id: 'CONV002',
    topic: 'Dashboard Loading Slowly',
    startDate: '2024-01-14',
    isResolved: true,
    resolvedDate: '2024-01-15',
    messages: [
      { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
      { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
      { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
      { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
      { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
    ],
    resolutionNotes: `Solution for Dashboard Loading Slowly:
1. Try refreshing the page after 5 minutes.
2. Check your internet connection speed.
3. If using a VPN, try disconnecting and reconnecting.
4. Reduce the data range of the dashboard view if possible.
5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`,
    user: 'Alice Smith',
    category: 'Performance',
    priority: 'Medium',
  },
  {
    id: 'CONV003',
    topic: 'API Rate Limiting Error',
    startDate: '2024-01-13',
    isResolved: false, // This conversation is still open
    messages: [
      { sender: 'user', text: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.' },
      { sender: 'ai', text: 'I understand you are encountering API rate limiting issues. Can you provide the API endpoint and the approximate time the errors started?' }
    ],
    user: 'Hrishikesh Kumar',
    category: 'API Integration',
    priority: 'Critical',
  },
  {
    id: 'CONV004',
    topic: 'Email Notifications Failing',
    startDate: '2024-01-16',
    isResolved: false,
    messages: [
      { sender: 'user', text: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.' },
    ],
    user: 'Bob Engineer',
    category: 'Notifications',
    priority: 'High',
  },
];


// Mock User Data for the system (used for displaying user names in conversations)
const initialUsers = [
  { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'user' },
  { id: 'usr002', name: 'Hrishikesh Kumar', email: 'hrishikeskumar@it.com', role: 'admin' },
  { id: 'usr003', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'user' },
  { id: 'usr004', name: 'Bob Engineer', email: 'bob@company.com', role: 'user' },
];


const drawerWidth = 280;
const collapsedDrawerWidth = 60;
const appBarHeight = 64;

function App() {
  // REMOVED `tickets` state
  const [conversations, setConversations] = useState(initialConversations);
  const [users, setUsers] = useState(initialUsers);
  const [currentUserRole, setCurrentUserRole] = useState('user');
  // Removed `openCreateTicketModal` as it was for tickets
  // Removed `selectedEngineerTicket` as it was for tickets
  const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null); // New state for admin to view specific conversation details

  const [currentConversationId, setCurrentConversationId] = useState(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats calculation now based on conversations
  const stats = useMemo(() => {
    const totalConversations = conversations.length;
    const openConversations = conversations.filter(c => !c.isResolved).length;
    const resolvedConversations = conversations.filter(c => c.isResolved).length;
    const aiAssistedConversations = conversations.filter(c => c.messages.some(m => m.sender === 'ai')).length; // Simple heuristic
    const aiCosts = conversations.reduce((sum, c) => {
        const aiMessagesCount = c.messages.filter(m => m.sender === 'ai').length;
        return sum + (aiMessagesCount * 0.005); // Mock cost per AI message
    }, 0);

    return {
      open: openConversations,
      inProgress: 0, // In this simplified model, 'in progress' is just part of 'open'
      resolved: resolvedConversations,
      total: totalConversations, // Add total for a possible new stat card
      aiAssisted: aiAssistedConversations,
      aiCosts: aiCosts
    };
  }, [conversations]);

  // UseEffect for cleanup/auto-selection
  useEffect(() => {
    if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    }
    // No selectedEngineerTicket check as it's removed
    if (currentUserRole !== 'admin' && selectedConversationForAdmin) {
      setSelectedConversationForAdmin(null);
    }
    if (currentUserRole !== 'user' && currentConversationId) {
      setCurrentConversationId(null);
    }
  }, [currentUserRole, currentConversationId, conversations, selectedConversationForAdmin]);


  // REMOVED handleNewTicket (ticket creation)
  // REMOVED handleResolveTicket (ticket resolution)
  // REMOVED handleLLMSuggestion (LLM suggestion for tickets)

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setCurrentUserRole(newRole);
      // Removed setOpenCreateTicketModal
      // Removed setSelectedEngineerTicket
      setSelectedConversationForAdmin(null); // Clear admin-selected conversation on role change
      if (newRole === 'user') {
          setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
      } else {
          setCurrentConversationId(null);
      }
    }
  };

  const handleNewChat = () => {
    const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
    const newConversation = {
      id: newConvId,
      topic: 'New Chat',
      startDate: new Date().toISOString().split('T')[0],
      isResolved: false,
      messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
      user: 'John Doe', // Assume 'John Doe' is the current user for new chats
      category: 'General Inquiry',
      priority: 'Low',
    };
    setConversations((prevConversations) => [newConversation, ...prevConversations]);
    setCurrentConversationId(newConvId);
  };

  const handleSendMessageToChatbot = async (message) => {
    if (message.trim() === '' || !currentConversationId) return;

    setChatLoading(true);
    const userMessage = message.trim();

    setConversations(prev => prev.map(conv =>
      conv.id === currentConversationId
        ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
        : conv
    ));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dummyChatResponses = [
        "Hello! I'm your TicketAI assistant. How can I help you today?",
        "Please provide more details.",
        "I can summarize information or suggest next steps.",
        "That's an interesting problem. Let me check the knowledge base...",
        "Could you elaborate more on the symptoms?",
        "Thank you for the information. I'm processing your request.",
        "I am just a demo chatbot for now, but I can simulate helpful responses!",
      ];
      const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
      const aiResponseText = dummyChatResponses[randomIndex];

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
          : conv
      ));
    } catch (error) {
      console.error('Error simulating chatbot response:', error);
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
          : conv
      ));
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  const handleMarkConversationResolved = (conversationId, solutionText) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
          // No interaction with `tickets` needed here
          return {
            ...conv,
            isResolved: true,
            resolvedDate: new Date().toLocaleDateString(),
            resolutionNotes: solutionText,
            messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by the user.`}],
          };
        }
        return conv;
      })
    );
    alert(`Conversation ${conversationId} marked as resolved!`);
  };

  // Admin-specific conversation resolution
  const handleResolveConversationForAdmin = (conversationId, resolutionNotes) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId && !conv.isResolved
          ? {
              ...conv,
              isResolved: true,
              resolvedDate: new Date().toLocaleDateString(),
              messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by Admin with notes: "${resolutionNotes}"`}],
              resolutionNotes: resolutionNotes,
            }
          : conv
      )
    );
    setSelectedConversationForAdmin(null); // Clear the detail view
    alert(`Conversation ${conversationId} resolved successfully by Admin!`);
  };

  const handleAddUser = (newUser) => {
    const newId = `usr${String(users.length + 1).padStart(3, '0')}`;
    setUsers((prevUsers) => [...prevUsers, { ...newUser, id: newId }]);
  };

  const handleUpdateUser = (userId, updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? updatedUser : user))
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };


  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [currentConversationId, conversations]);

  const adminSelectedConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversationForAdmin?.id) || null;
  }, [selectedConversationForAdmin, conversations]);


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200', borderRadius: 0 }}
        elevation={1}
      >
        <Toolbar>
          {currentUserRole === 'user' && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              edge="start"
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Header
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
          />
        </Toolbar>
      </AppBar>

      {/* Main content area below the AppBar */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px`, width: '100%' }}>

        {currentUserRole === 'user' && (
          <>
            <UserSidebar
              conversations={conversations}
              onNewChat={handleNewChat}
              onSelectConversation={setCurrentConversationId}
              currentConversationId={currentConversationId}
              userDisplayName="John Doe"
              userEmail="johndoe@it.com"
              sidebarOpen={sidebarOpen}
              appBarHeight={appBarHeight}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                ml: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
                transition: (theme) => theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                display: 'flex',
                flexDirection: 'column',
                height: `calc(100vh - ${appBarHeight}px)`,
                overflow: 'hidden',
              }}
            >
              <Chatbot
                currentConversation={currentConversation}
                onSendMessage={handleSendMessageToChatbot}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatLoading={chatLoading}
                onMarkConversationResolved={handleMarkConversationResolved}
              />
            </Box>
          </>
        )}

        {/* ADMIN CONTENT AREA */}
        {/* ADMIN CONTENT AREA */}
{/* ADMIN CONTENT AREA */}
{currentUserRole === 'admin' && (
  <Container maxWidth="xl" sx={{ mt: 4, pb: 4, flexGrow: 1, height: `calc(100vh - ${appBarHeight}px)`, overflow: 'auto' }}>
    {/* Header */}
    {/* User Management Section */}
<Box sx={{ display: 'flex', gap: 3, flexDirection:'column' }}>
  {/* Card 1: Conversation Management / Ticket Detail */}
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Conversation Management
      </Typography>
            <DashboardStats stats={stats} />
      {adminSelectedConversation && (
        <EngineerTicketDetail
          ticket={{
            id: adminSelectedConversation.id,
            title: adminSelectedConversation.topic,
            description: adminSelectedConversation.messages.map(m => `${m.sender}: ${m.text}`).join('\n\n'),
            status: adminSelectedConversation.isResolved ? 'resolved' : 'open',
            priority: adminSelectedConversation.priority || 'Medium',
            user: adminSelectedConversation.user,
            createdAt: adminSelectedConversation.startDate,
            engineerNotes: adminSelectedConversation.resolutionNotes || '',
            llmSuggestion: 'AI Chat conversation. Review messages above.',
            llmCost: 0,
            llmTokens: 0,
            llmModel: '',
          }}
          onBack={() => setSelectedConversationForAdmin(null)}
          onResolveTicket={(convId, resolutionNotes) => handleResolveConversationForAdmin(convId, resolutionNotes)}
          onLLMSuggestion={() => alert('LLM Suggestion not directly applicable here; conversation history provides context.')}
          
        />
        
      )}
    </Box>
</Box>
  {/* Card 2: Dashboard Stats / Recent Conversations */}
  <Box sx={{ display: 'flex', gap: 3 }}>
  {/* Card 1: Recent Conversation List */}
  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', flex: 1 }}>
    <Box sx={{ p: 3 }}>
      <RecentConversationList
        conversations={conversations}
        users={users}
        onConversationClick={(conv) => setSelectedConversationForAdmin(conv)}
      />
    </Box>
  </Card>

  {/* Card 2: Admin Management Panel */}
  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', flex: 1 }}>
    <Box sx={{ p: 3 }}>
      <AdminManagementPanel
        users={users}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </Box>
  </Card>
</Box>

    {/* Knowledge Base Section */}
    <Box sx={{ mb: 4 }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 3 }}>
          <KnowledgeBaseManagement />
        </Box>
      </Card>
    </Box>

    {/* Conversation Management */}

  </Container>
)}
      </Box>

      {/* Removed TicketFormModal as tickets concept is gone */}
      {/* openCreateTicketModal is also removed, so this block should be deleted */}
      {/* If an Admin still needs to "create a formal issue", they'd use a new dedicated form */}
    </Box>
  );
}

export default App;