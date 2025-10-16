// // src/components/AdminPanel.js
// import React from 'react';
// import { Typography, Paper } from '@mui/material';

// const AdminPanel = () => {
//   return (
//     <Paper sx={{ p: 3, borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//         Admin Panel (Under Construction)
//       </Typography>
//       <Typography variant="body1" color="text.secondary" paragraph>
//         This section will be for administrators to manage user roles, system configurations, and review knowledge base submissions.
//       </Typography>
//       <Typography variant="body2" color="text.secondary">
//         Expected features include:
//       </Typography>
//       <ul>
//         <li>User Management (view, add, edit roles)</li>
//         <li>LLM Integration Settings (API keys, default models)</li>
//         <li>Knowledge Base Review and Approval</li>
//         <li>System Analytics and Audit Logs</li>
//       </ul>
//     </Paper>
//   );
// };

// export default AdminPanel;

// src/components/Admin/AdminPanel.js (This remains a general placeholder for other admin tools)
import React from 'react';
import { Typography, Paper } from '@mui/material';

const AdminPanel = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Admin Specific Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This section can contain tools unique to the Admin role, like system settings, audit logs, or configuration management.
      </Typography>
    </Paper>
  );
};

export default AdminPanel;