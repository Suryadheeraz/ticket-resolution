// src/components/Admin/ConversationCard.js
import React from 'react';
import { Paper, Typography, Chip, Stack, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
//import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ConversationCard = ({ conversation, users, onClick }) => {
  const isClickable = typeof onClick === 'function';
  const associatedUser = users.find(u => u.name === conversation.user); // Assuming conversation.user stores the user's name

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        cursor: isClickable ? 'pointer' : 'default',
        '&:hover': isClickable ? { boxShadow: 3 } : {},
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={isClickable ? () => onClick(conversation) : null}
    >
      {/* Top Row: Title, Status, User Info */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {conversation.isResolved ? (
            <CheckCircleOutlineIcon color="success" fontSize="small" />
          ) : (
            <HelpOutlineIcon color="warning" fontSize="small" />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {conversation.ticketTitle || `Conversation ${conversation.id}`}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {associatedUser && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Avatar sx={{ bgcolor: 'grey.300', width: 24, height: 24, fontSize: '0.75rem' }}>
                {associatedUser.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {associatedUser.name}
              </Typography>
            </Stack>
          )}
          <Chip
            label={conversation.isResolved ? 'Resolved' : 'Open'}
            size="small"
            color={conversation.isResolved ? 'success' : 'warning'}
            variant="outlined"
          />
        </Stack>
      </Stack>

      {/* Description / Last Message Snippet */}
      <Typography variant="body2" color="text.secondary" mb={1}>
        {conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1].text.substring(0, 100) + '...'
          : 'No messages yet.'}
      </Typography>

      {/* Bottom Row: Details */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mt: 'auto', pt: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.disabled">
            #{conversation.id.slice(4)} {/* Assuming CONVXXX format */}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {conversation.startDate}
          </Typography>
          {conversation.isResolved && (
            <Typography variant="caption" color="text.disabled">
              Resolved: {conversation.resolvedDate}
            </Typography>
          )}
        </Stack>
        {/* You could add more details here like AI costs if applicable to conversations */}
      </Stack>
    </Paper>
  );
};

export default ConversationCard;