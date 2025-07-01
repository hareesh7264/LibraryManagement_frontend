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
  Alert
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export default function BooksPage() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    quantity: "",
  });

  const BASE_URL = "http://localhost:8000";

  const loadBooks = () => {
    axios
      .get(`${BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBooks();
  }, [token]);

  const handleOpen = (book) => {
    if (book) {
      setEditingBook(book);
      setForm({
        title: book.title,
        author: book.author,
        isbn:book.isbn,
        quantity: book.quantity,
      });
    } else {
      setEditingBook(null);
      setForm({
        title: "",
        author: "",
        isbn: "",
        quantity: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
    const validateForm = () => {
      if (!form.title.trim()) {
        return "Title is required.";
      }
      if (!form.author) {
        return "Author name is required.";
      }
      if (!form.isbn) {
        return "Isbn Number is required.";
      }
      if(!form.quantity){
        return "Quantity is required."
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
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      quantity: parseInt(form.quantity),
    };

    const request = editingBook
      ? axios.put(`${BASE_URL}/books/${editingBook.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(`${BASE_URL}/books`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        loadBooks();
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
        .delete(`${BASE_URL}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => loadBooks())
        .catch((err) => console.error(err));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      <Button variant="contained" onClick={() => handleOpen(null)}>
        Add Book
      </Button>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Isbn</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpen(book)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Isbn"
            type="number"
            fullWidth
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
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
