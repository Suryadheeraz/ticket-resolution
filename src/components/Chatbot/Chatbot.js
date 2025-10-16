// src/components/Chatbot/Chatbot.js
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   IconButton,
//   Typography,
//   Stack,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   Divider,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import SendIcon from '@mui/icons-material/Send';
// import ChatMessage from './ChatMessage';

// const dummyChatResponses = [
//   "Hello! I'm your TicketAI assistant. How can I help you today regarding your tickets?",
//   "Please provide the ticket ID or a brief description of the issue you'd like to discuss.",
//   "I can summarize ticket history, suggest next steps, or answer general IT questions.",
//   "That's an interesting problem. Let me check the knowledge base...",
//   "Could you elaborate more on the symptoms you're observing?",
//   "Sure, what about ticket #TKT001 would you like to know?",
//   "The current status of that ticket is 'Open' and it's assigned to Alice.",
//   "I've noted your question. I'll pass it along.",
//   "I am just a demo chatbot for now, but I can simulate helpful responses!",
// ];

// // Add initialX and initialY to props
// const Chatbot = ({ open, onClose, tickets, initialX, initialY }) => {
//   const [messages, setMessages] = useState([
//     { sender: 'ai', text: "Hello! I'm your TicketAI Assistant. Ask me anything about tickets!" },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Initialize position with props if provided, otherwise default
//   const [position, setPosition] = useState({
//     x: initialX || window.innerWidth - 380,
//     y: initialY || window.innerHeight - 500,
//   });
//   const [size /* , setSize */] = useState({ width: 350, height: 400 });
//   const [isDragging, setIsDragging] = useState(false);
//   const dragOffset = useRef({ x: 0, y: 0 });

//   // Update initial position on mount/prop change for better placement
//   useEffect(() => {
//     setPosition({
//       x: initialX || window.innerWidth - 380,
//       y: initialY || window.innerHeight - 500,
//     });
//   }, [initialX, initialY]);


//   useEffect(() => {
//     if (open) {
//       scrollToBottom();
//     }
//   }, [messages, open]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (input.trim() === '') return;

//     const userMessage = input.trim();
//     setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
//     setInput('');
//     setLoading(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];
//       setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setMessages((prev) => [...prev, { sender: 'ai', text: 'Oops! My dummy brain encountered an error.' }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMouseMove = useCallback((e) => {
//     if (!isDragging) return;
//     setPosition({
//       x: e.clientX - dragOffset.current.x,
//       y: e.clientY - dragOffset.current.y,
//     });
//   }, [isDragging, dragOffset]);

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging, handleMouseMove, handleMouseUp]);

//   const handleMouseDown = (e) => {
//     const targetIsHeader = e.target.closest('.chatbot-header');
//     if (!targetIsHeader || e.target.tagName === 'BUTTON') return;

//     setIsDragging(true);
//     dragOffset.current = {
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     };
//   };

//   if (!open) return null;

//   return (
//     <Paper
//       elevation={5}
//       sx={{
//         position: 'fixed',
//         left: position.x,
//         top: position.y,
//         width: size.width,
//         height: size.height,
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: 2,
//         zIndex: 1300,
//         resize: 'both',
//         overflow: 'auto',
//         minWidth: 300,
//         minHeight: 300,
//         maxWidth: '90vw',
//         maxHeight: '90vh',
//       }}
//     >
//         {/* Header - Drag Handle */}
//         <Stack
//           className="chatbot-header"
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{
//             p: 1.5,
//             bgcolor: 'primary.main',
//             color: 'white',
//             cursor: 'grab',
//             flexShrink: 0,
//           }}
//           onMouseDown={handleMouseDown}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//             TicketAI Chat
//           </Typography>
//           <IconButton onClick={onClose} color="inherit" size="small">
//             <CloseIcon />
//           </IconButton>
//         </Stack>
//         <Divider />

//         {/* Chat Messages Area */}
//         <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
//           {messages.map((msg, index) => (
//             <ChatMessage key={index} message={msg.text} sender={msg.sender} />
//           ))}
//           {loading && (
//             <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
//                 <CircularProgress size={20} sx={{ mr: 1 }} />
//                 <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
//             </Box>
//           )}
//           <div ref={messagesEndRef} />
//         </Box>
//         <Divider />

//         {/* Input Area */}
//         <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             size="small"
//             placeholder="Ask about a ticket..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter' && !loading) {
//                 handleSendMessage();
//               }
//             }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleSendMessage} disabled={loading || !input.trim()} color="primary">
//                     <SendIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>
//     </Paper>
//   );
// };

// export default Chatbot;

// // src/components/Chatbot/Chatbot.js
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   IconButton,
//   Typography,
//   Stack,
//   TextField,
//   InputAdornment,
//   CircularProgress,
//   Divider,
// } from '@mui/material';
// // CloseIcon and other window controls are removed as it's no longer a floating window
// import SendIcon from '@mui/icons-material/Send';
// import ChatMessage from './ChatMessage';

// // Dummy responses for the chatbot (remains the same)
// const dummyChatResponses = [
//   "Hello! I'm your TicketAI assistant. How can I help you today regarding your tickets?",
//   "Please provide the ticket ID or a brief description of the issue you'd like to discuss.",
//   "I can summarize ticket history, suggest next steps, or answer general IT questions.",
//   "That's an interesting problem. Let me check the knowledge base...",
//   "Could you elaborate more on the symptoms you're observing?",
//   "Sure, what about ticket #TKT001 would you like to know?",
//   "The current status of that ticket is 'Open' and it's assigned to Alice.",
//   "I've noted your question. I'll pass it along.",
//   "I am just a demo chatbot for now, but I can simulate helpful responses!",
// ];

// // Props are simplified for static chat display
// const Chatbot = ({ messages, input, setInput, loading, onSendMessage }) => {
//   const messagesEndRef = useRef(null);

//   // Removed all draggable/resizable state and logic

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]); // Scroll whenever messages change

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleInternalSendMessage = async () => {
//     await onSendMessage(input); // Pass the input to the parent's (App.js) sendMessage handler
//     setInput(''); // Clear input after sending
//   };


//   return (
//     <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', borderRadius: 2 }}>
//       {/* Chat Messages Area - No header bar as it's part of the main layout */}
//       <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
//         {messages.map((msg, index) => (
//           <ChatMessage key={index} message={msg.text} sender={msg.sender} />
//         ))}
//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
//               <CircularProgress size={20} sx={{ mr: 1 }} />
//               <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
//           </Box>
//         )}
//         <div ref={messagesEndRef} />
//       </Box>
//       <Divider />

//       {/* Input Area */}
//       <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           placeholder="Enter a prompt here..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter' && !loading) {
//               handleInternalSendMessage();
//             }
//           }}
//           InputProps={{
//             startAdornment: ( // Added start adornment for "tools" like in the image
//                 <InputAdornment position="start" sx={{ mr: 1 }}>
//                     <IconButton color="primary" size="small" sx={{ bgcolor: 'primary.light', '&:hover': {bgcolor: 'primary.dark'}, color: 'white' }}>
//                         <AddIcon />
//                     </IconButton>
//                     <IconButton color="primary" size="small" sx={{ ml: 1, mr: 1 }}>
//                         <AttachFileIcon />
//                     </IconButton>
//                     <Typography variant="body2" color="text.secondary">Tools</Typography> {/* Text for tools */}
//                 </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={handleInternalSendMessage} disabled={loading || !input.trim()} color="primary">
//                   <SendIcon />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
//             Prompt gallery
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Chatbot;

// src/components/Chatbot/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Stack, // Re-added Stack for layout
  TextField,
  InputAdornment,
  CircularProgress,
  Divider, // Re-added Divider for separation
  Button, // Re-added Button for "Mark as Resolved"
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, // For resolution dialog
  Paper // Re-added Paper for styling chat messages
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatMessage from './ChatMessage'; // Re-added ChatMessage for displaying messages
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For "Mark as Resolved" icon
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For "New Chat" question mark icon


// Dummy Knowledge Base Solutions for demonstration (from UserChatThread)
const mockKnowledgeBaseSolutions = {
  'TKT001': `Solution for Login Issues with SSO:
1. Ensure your company email is correct and active.
2. Clear browser cache and cookies, then try logging in again.
3. Attempt to log in using an incognito/private browser window.
4. Verify your network connection is stable.
5. If the issue persists, contact IT support directly for a password reset on the SSO system.`,
  'TKT002': `Solution for Dashboard Loading Slowly:
1. Try refreshing the page after 5 minutes.
2. Check your internet connection speed.
3. If using a VPN, try disconnecting and reconnecting.
4. Reduce the data range of the dashboard view if possible.
5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`,
  'TKT004': `Solution for Email Notifications Failing:
1. Check your spam/junk folder for missing notifications.
2. Ensure your email client is correctly configured and receiving other emails.
3. Verify your notification settings in your profile.
4. If you have an IT ticketing system, check if notification logs show successful delivery.`,
  'default': `General solution from knowledge base:
1. Restart your device (computer, phone, router).
2. Check for pending updates and install them.
3. Clear temporary files and browser cache.
4. If it's a software issue, try reinstalling the application.
5. If none of these work, please provide more details to IT support.`
};


// The Chatbot component is now the full chat window (message display + input)
// It takes currentConversation and related handlers
// const Chatbot = ({ currentConversation, onSendMessage, chatInput, setChatInput, chatLoading, onMarkConversationResolved }) => {
//   const messagesEndRef = useRef(null);

//   const [openResolveDialog, setOpenResolveDialog] = useState(false); // For resolution dialog

//   useEffect(() => {
//     // Only scroll if there are messages
//     if (currentConversation?.messages.length > 0) {
//       scrollToBottom();
//     }
//   }, [currentConversation?.messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleInternalSendMessage = async () => {
//     await onSendMessage(chatInput); // Use chatInput directly
//   };

//   const handleOpenResolveDialog = () => {
//     setOpenResolveDialog(true);
//   };

//   const handleCloseResolveDialog = () => {
//     setOpenResolveDialog(false);
//   };

//   const handleConfirmResolve = () => {
//     if (currentConversation) {
//         // Determine the solution based on the conversation's ticketId, or a default
//         const solutionText = mockKnowledgeBaseSolutions[currentConversation.ticketId] || mockKnowledgeBaseSolutions['default'];
//         onMarkConversationResolved(currentConversation.id, solutionText);
//     }
//     handleCloseResolveDialog();
//   };


//   // If no conversation is selected, display a centered message
//   if (!currentConversation) {
//     return (
//         <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//             <Typography variant="h5" color="text.secondary">
//                 Select a chat from the sidebar or start a new one.
//             </Typography>
//         </Box>
//     );
//   }

//   return (
//     <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
//       {/* Conversation Header (formerly part of UserChatThread) */}
//       <Paper elevation={1} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
//         <Stack direction="row" alignItems="center" spacing={1}>
//           {currentConversation.isResolved ? (
//             <CheckCircleOutlineIcon color="success" />
//           ) : (
//             <HelpOutlineIcon color="warning" />
//           )}
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//             {currentConversation.ticketTitle || `Conversation ${currentConversation.id}`}
//           </Typography>
//         </Stack>
//         {!currentConversation.isResolved && (
//           <Button
//             variant="outlined"
//             color="success"
//             startIcon={<CheckCircleOutlineIcon />}
//             onClick={handleOpenResolveDialog}
//             size="small"
//           >
//             Mark as Resolved
//           </Button>
//         )}
//       </Paper>

//       {/* Conversation Metadata (formerly part of UserChatThread) */}
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}>
//         Started: {currentConversation.startDate}
//         {currentConversation.isResolved && ` | Resolved: ${currentConversation.resolvedDate}`}
//       </Typography>

//       <Divider sx={{ my: 2 }} />

//       {/* Chat Messages Area */}
//       <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
//         {currentConversation.messages.map((msg, index) => (
//           <ChatMessage key={index} message={msg.text} sender={msg.sender} />
//         ))}
//         {chatLoading && (
//           <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
//               <CircularProgress size={20} sx={{ mr: 1 }} />
//               <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
//           </Box>
//         )}
//         {currentConversation.resolutionNotes && (
//           <Box sx={{ p: 1.5, bgcolor: 'success.light', color: 'white', borderRadius: 1, mt: 1 }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//               Resolution Notes (from Knowledge Base):
//             </Typography>
//             <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
//               {currentConversation.resolutionNotes}
//             </Typography>
//           </Box>
//         )}
//         <div ref={messagesEndRef} />
//       </Box>
//       <Divider />

//       {/* Input Area */}
//       <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           placeholder="Enter a prompt here..."
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter' && !chatLoading) {
//               handleInternalSendMessage();
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//                 <InputAdornment position="start" sx={{ mr: 1 }}>
//                     <IconButton color="primary" size="small" sx={{ bgcolor: 'primary.light', '&:hover': {bgcolor: 'primary.dark'}, color: 'white' }}>
//                         <AddIcon />
//                     </IconButton>
//                     <IconButton color="primary" size="small" sx={{ ml: 1, mr: 1 }}>
//                         <AttachFileIcon />
//                     </IconButton>
//                     <Typography variant="body2" color="text.secondary">Tools</Typography>
//                 </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 {chatLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
//                 <IconButton onClick={handleInternalSendMessage} disabled={chatLoading || !chatInput.trim()} color="primary">
//                   <SendIcon />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
//             Prompt gallery
//         </Typography>
//       </Box>

//       {/* Confirmation Dialog for Marking as Resolved (moved from UserChatThread) */}
//       <Dialog
//         open={openResolveDialog}
//         onClose={handleCloseResolveDialog}
//         aria-labelledby="resolve-dialog-title"
//         aria-describedby="resolve-dialog-description"
//       >
//         <DialogTitle id="resolve-dialog-title">Confirm Resolution</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="resolve-dialog-description">
//             Are you sure you want to mark this conversation as resolved? This will add a knowledge base solution to the ticket notes.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseResolveDialog}>Cancel</Button>
//           <Button onClick={handleConfirmResolve} variant="contained" color="success" autoFocus>
//             Resolve
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Chatbot;

const Chatbot = ({ currentConversation, onSendMessage, chatInput, setChatInput, chatLoading, onMarkConversationResolved }) => {
  const messagesEndRef = useRef(null);

  const [openResolveDialog, setOpenResolveDialog] = useState(false);

  useEffect(() => {
    if (currentConversation?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInternalSendMessage = async () => {
    await onSendMessage(chatInput);
  };

  const handleOpenResolveDialog = () => {
    setOpenResolveDialog(true);
  };

  const handleCloseResolveDialog = () => {
    setOpenResolveDialog(false);
  };

  const handleConfirmResolve = () => {
    if (currentConversation) {
        const solutionText = mockKnowledgeBaseSolutions[currentConversation.ticketId] || mockKnowledgeBaseSolutions['default'];
        onMarkConversationResolved(currentConversation.id, solutionText);
    }
    handleCloseResolveDialog();
  };


  if (!currentConversation) {
    return (
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" color="text.secondary">
                Select a chat from the sidebar or start a new one.
            </Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Conversation Header (formerly part of UserChatThread) */}
      {/* REMOVE p:2 from Paper, ADD px:2 to Stack children */}
      <Paper elevation={1} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderRadius: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{p: 2}}> {/* ADD p:2 here */}
          {currentConversation.isResolved ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <HelpOutlineIcon color="warning" />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {currentConversation.topic || `Conversation ${currentConversation.id}`} {/* Use topic here */}
          </Typography>
        </Stack>
        {!currentConversation.isResolved && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleOpenResolveDialog}
            size="small"
            sx={{ p: 2, mr: 2}} // ADD p:2 and mr:2 for button spacing
          >
            Mark as Resolved
          </Button>
        )}
      </Paper>

      {/* Conversation Metadata */}
      {/* ADD px: 2 to align with the Paper's content. */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}> {/* ADD px:2 here */}
        Started: {currentConversation.startDate}
        {currentConversation.isResolved && ` | Resolved: ${currentConversation.resolvedDate}`}
      </Typography>

      {/* Dividers also need horizontal padding to align */}
      <Divider sx={{ my: 2, px: 2 }} /> {/* ADDED px:2 and restored my:2 for vertical margin */}


      {/* Chat Messages Area */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}> {/* Keep p:2 here */}
        {currentConversation.messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} sender={msg.sender} />
        ))}
        {chatLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
          </Box>
        )}
        {currentConversation.resolutionNotes && (
          <Box sx={{ p: 1.5, bgcolor: 'success.light', color: 'white', borderRadius: 1, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Resolution Notes (from Knowledge Base):
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {currentConversation.resolutionNotes}
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Divider sx={{ mx: 2 }} /> {/* ADD mx:2 for horizontal margin for consistency */}

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}> {/* Keep p:2 here */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Enter a prompt here..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !chatLoading) {
              handleInternalSendMessage();
            }
          }}
          InputProps={{
            startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1 }}>
                    <IconButton color="primary" size="small" sx={{ bgcolor: 'primary.light', '&:hover': {bgcolor: 'primary.dark'}, color: 'white' }}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color="primary" size="small" sx={{ ml: 1, mr: 1 }}>
                        <AttachFileIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">Tools</Typography>
                </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {chatLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                <IconButton onClick={handleInternalSendMessage} disabled={chatLoading || !chatInput.trim()} color="primary">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Prompt gallery
        </Typography>
      </Box>

      {/* Confirmation Dialog for Marking as Resolved */}
      <Dialog
        open={openResolveDialog}
        onClose={handleCloseResolveDialog}
        aria-labelledby="resolve-dialog-title"
        aria-describedby="resolve-dialog-description"
      >
        <DialogTitle id="resolve-dialog-title">Confirm Resolution</DialogTitle>
        <DialogContent>
          <DialogContentText id="resolve-dialog-description">
            Are you sure you want to mark this conversation as resolved? This will add a knowledge base solution to the ticket notes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResolveDialog}>Cancel</Button>
          <Button onClick={handleConfirmResolve} variant="contained" color="success" autoFocus>
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chatbot;