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
  Select,
  MenuItem,
  Alert,
  Box,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export default function IssuePage() {
  const { token } = useContext(AuthContext);

  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [form, setForm] = useState({
    book_id: "",
    member_id: "",
  });
  const [returnId, setReturnId] = useState("");
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:8000";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadData = () => {
    axios
      .get(`${BASE_URL}/issues`, { headers })
      .then((res) => setIssues(res.data));

    axios
      .get(`${BASE_URL}/members`, { headers })
      .then((res) => setMembers(res.data));

    axios
      .get(`${BASE_URL}/books`, { headers })
      .then((res) => setBooks(res.data));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleOpen = () => {
    setForm({
      book_id: "",
      member_id: "",
    });
    setError(null);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.book_id || !form.member_id) {
      setError("Please select both book and member.");
      return;
    }

    axios
      .post(`${BASE_URL}/issues/issue-book`, form, { headers })
      .then(() => {
        loadData();
        setOpen(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Error issuing book.");
      });
  };

  const handleReturnOpen = (id) => {
    setReturnId(id);
    setReturnOpen(true);
  };

  const handleReturn = () => {
    axios
      .post(
        `${BASE_URL}/issues/return-book`,
        { issue_id: returnId },
        { headers }
      )
      .then(() => {
        loadData();
        setReturnOpen(false);
      })
      .catch((err) => {
        alert(err.response?.data?.detail || "Error returning book.");
      });
  };

  // Maps
  const bookMap = {};
  books.forEach((b) => {
    bookMap[b.id] = b.title;
  });

  const memberMap = {};
  members.forEach((m) => {
    memberMap[m.id] = m.name;
  });

  // Filter issues based on search text
  const filteredIssues = issues.filter((i) => {
    const bookName = bookMap[i.book_id] || "";
    const memberName = memberMap[i.member_id] || "";
    return (
      i.id.includes(search) ||
      bookName.toLowerCase().includes(search.toLowerCase()) ||
      memberName.toLowerCase().includes(search.toLowerCase()) ||
      i.issue_date?.toLowerCase().includes(search.toLowerCase()) ||
      i.due_date?.toLowerCase().includes(search.toLowerCase()) ||
      (i.return_date || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Issue Records
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={handleOpen}>
          Issue Book
        </Button>
        <TextField
          label="Search Issue ID, Book, Member,Date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </Box>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Issue ID</TableCell>
            <TableCell>Book</TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Issue Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell>Fine</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredIssues.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.id}</TableCell>
              <TableCell>{bookMap[i.book_id] || i.book_id}</TableCell>
              <TableCell>{memberMap[i.member_id] || i.member_id}</TableCell>
              <TableCell>{i.issue_date}</TableCell>
              <TableCell>{i.due_date}</TableCell>
              <TableCell>{i.return_date || "-"}</TableCell>
              <TableCell>{i.fine}</TableCell>
              <TableCell>
                {!i.return_date && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleReturnOpen(i.id)}
                  >
                    Return
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Issue Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Issue Book</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <Select
            fullWidth
            sx={{ mt: 2 }}
            value={form.book_id}
            displayEmpty
            onChange={(e) => setForm({ ...form, book_id: e.target.value })}
          >
            <MenuItem value="">Select Book</MenuItem>
            {books.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            sx={{ mt: 2 }}
            value={form.member_id}
            displayEmpty
            onChange={(e) => setForm({ ...form, member_id: e.target.value })}
          >
            <MenuItem value="">Select Member</MenuItem>
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnOpen} onClose={() => setReturnOpen(false)}>
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to return this book?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReturn}>
            Return
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

