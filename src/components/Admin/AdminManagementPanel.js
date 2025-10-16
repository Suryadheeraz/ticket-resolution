// src/components/Admin/AdminManagementPanel.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Mock user data if not passed from App.js
// const defaultUsers = [
//   { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'user' },
//   { id: 'usr002', name: 'Admin User', email: 'admin@company.com', role: 'admin' },
//   { id: 'usr003', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'user' },
// ];

const AdminManagementPanel = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [editingUser, setEditingUser] = useState(null); // User object being edited
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Handlers for adding user
  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewUser({ name: '', email: '', role: 'user' }); // Reset form
  };
  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      onAddUser(newUser);
      handleCloseAddDialog();
    }
  };

  // Handlers for editing user
  const handleEdit = (user) => setEditingUser({ ...user });
  const handleSave = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };
  const handleCancelEdit = () => setEditingUser(null);
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
          Add New User
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user management table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found.</TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {editingUser && editingUser.id === user.id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        >
                          <MenuItem value="user">User</MenuItem>
                          {/* <MenuItem value="engineer">Engineer</MenuItem> */} {/* Engineer role removed */}
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={handleSave} aria-label="save">
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="default" onClick={handleCancelEdit} aria-label="cancel">
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="info" onClick={() => handleEdit(user)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(user.id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              {/* <MenuItem value="engineer">Engineer</MenuItem> */}
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" disabled={!newUser.name || !newUser.email}>Add User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagementPanel;