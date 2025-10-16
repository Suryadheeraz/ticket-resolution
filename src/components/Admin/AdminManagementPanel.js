// src/components/Admin/AdminManagementPanel.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RecentConversationList from './RecentConversationList';

/**
 * Polished AdminManagementPanel
 * - Responsive: side-by-side on wide screens, stacked on small.
 * - Top visual polish: cards, shadows, spacing.
 * - Page fits viewport (100vh). Internal lists scroll.
 */
const AdminManagementPanel = () => {
  const theme = useTheme();

  const [users, setUsers] = useState([
    { id: 'U001', name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 'U002', name: 'Bob', email: 'bob@example.com', role: 'agent' },
    { id: 'U003', name: 'Charlie', email: 'charlie@example.com', role: 'agent' },
  ]);

  const [conversations] = useState([
    { id: 'C001', topic: 'Login issue', user: 'Alice', startDate: '2025-10-10', isResolved: false, messages: [{text:'I cannot login'}, {text:'Tried resetting password.'}] },
    { id: 'C002', topic: 'Payment failed', user: 'Bob', startDate: '2025-10-11', isResolved: true, resolvedDate: '2025-10-12', messages: [{text:'Payment failed at checkout.'}] },
    { id: 'C003', topic: 'Feature request', user: 'Charlie', startDate: '2025-10-13', isResolved: false, messages: [] },
  ]);

  const [openAdd, setOpenAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formUser, setFormUser] = useState({ name: '', email: '', role: 'agent' });

  const handleOpenAdd = () => { setFormUser({ name: '', email: '', role: 'agent' }); setEditingUser(null); setOpenAdd(true); };
  const handleCloseAdd = () => { setOpenAdd(false); setEditingUser(null); };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(u => u.map(x => x.id === editingUser.id ? { ...editingUser, ...formUser } : x));
    } else {
      const id = `U${(Math.floor(Math.random()*900)+100).toString()}`;
      setUsers(u => [{ id, ...formUser }, ...u]);
    }
    handleCloseAdd();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormUser({ name: user.name, email: user.email, role: user.role || 'agent' });
    setOpenAdd(true);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        boxSizing: 'border-box',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>Add User</Button>
        </Box>
      </Box>
        {/* User Management - right or bottom */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Paper sx={{ p: 2, height: '100%', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>User Management</Typography>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEdit(u)}><EditIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

      {/* Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Name" value={formUser.name} onChange={e=>setFormUser({...formUser, name: e.target.value})} fullWidth />
            <TextField label="Email" value={formUser.email} onChange={e=>setFormUser({...formUser, email: e.target.value})} fullWidth />
            <TextField label="Role" value={formUser.role} onChange={e=>setFormUser({...formUser, role: e.target.value})} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser} disabled={!formUser.name || !formUser.email}>{editingUser ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagementPanel;
