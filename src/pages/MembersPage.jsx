import {
  Button,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export default function MembersPage() {
  const { token } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    membership_number: "",
  });

  const BASE_URL = "http://localhost:8000";

  const loadMembers = () => {
    axios
      .get(`${BASE_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadMembers();
  }, [token]);

  const handleOpen = (member) => {
    setError(null);
    if (member) {
      setEditingMember(member);
      setForm({
        name: member.name,
        email: member.email,
        membership_number: member.membership_number,
      });
    } else {
      setEditingMember(null);
      setForm({
        name: "",
        email: "",
        membership_number: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Name is required.";
    }
    if (!form.email.match(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)) {
      return "Invalid email format.";
    }
    if (!form.membership_number.match(/^[A-Za-z0-9\-]+$/)) {
      return "Membership number must be alphanumeric.";
    }
    return null;
  };

  const handleSave = () => {
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      membership_number: form.membership_number,
    };

    const request = editingMember
      ? axios.put(`${BASE_URL}/members/${editingMember.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(`${BASE_URL}/members`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        loadMembers();
        handleClose();
      })
      .catch((err) => {
        if (err.response && err.response.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("An error occurred.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios
        .delete(`${BASE_URL}/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => loadMembers())
        .catch((err) => console.error(err));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Members
      </Typography>
      <Button variant="contained" onClick={() => handleOpen(null)}>
        Add Member
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Membership Number</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.membership_number}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpen(m)}
                >
                  Edit
                </Button>{" "}
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingMember ? "Edit Member" : "Add Member"}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Membership Number"
            fullWidth
            value={form.membership_number}
            onChange={(e) =>
              setForm({ ...form, membership_number: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
