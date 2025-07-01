import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export default function ReportsPage() {
  const { token } = useContext(AuthContext);

  const [reports, setReports] = useState({
    fines: [],
    overdue: [],
    history: [],
  });
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const BASE_URL = "http://localhost:8000";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadReports = () => {
    axios
      .get(`${BASE_URL}/issues/reports/fines`, { headers })
      .then((res) => setReports((prev) => ({ ...prev, fines: res.data })));

    axios
      .get(`${BASE_URL}/issues/overdue`, { headers })
      .then((res) => setReports((prev) => ({ ...prev, overdue: res.data })));

    axios
      .post(`${BASE_URL}/issues/reports/history`, {}, { headers })
      .then((res) => setReports((prev) => ({ ...prev, history: res.data })));

    axios
      .get(`${BASE_URL}/books`, { headers })
      .then((res) => setBooks(res.data));

    axios
      .get(`${BASE_URL}/members`, { headers })
      .then((res) => setMembers(res.data));
  };

  useEffect(() => {
    loadReports();
  }, [token]);

  // Create maps for lookup
  const bookMap = {};
  books.forEach((b) => {
    bookMap[b.id] = b.title;
  });

  const memberMap = {};
  members.forEach((m) => {
    memberMap[m.id] = m.name;
  });

  // Apply filtering to reports.history
  const filteredHistory = reports.history.filter((h) => {
    const bookName = bookMap[h.book_id] || "";
    const memberName = memberMap[h.member_id] || "";
    return (
      h.id.includes(search) ||
      bookName.toLowerCase().includes(search.toLowerCase()) ||
      memberName.toLowerCase().includes(search.toLowerCase()) ||
      h.issue_date?.toLowerCase().includes(search.toLowerCase()) ||
      h.due_date?.toLowerCase().includes(search.toLowerCase()) ||
      (h.return_date || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredOverdue = reports.overdue.filter((o) => {
    return o.id.includes(search);
  });

  const filteredFines = reports.fines.filter((f) => {
    return f.member_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={loadReports}>
          Reload Reports
        </Button>
        <TextField
          label="Search by Issue ID, Book, Member, Date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </Box>

      {filteredFines.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Total Fines</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member Name</TableCell>
                <TableCell>Total Fine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFines.map((r) => (
                <TableRow key={r.member_id}>
                  <TableCell>{r.member_name}</TableCell>
                  <TableCell>{r.total_fine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {filteredOverdue.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Overdue Books</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue ID</TableCell>
                <TableCell>Days Overdue</TableCell>
                <TableCell>Current Fine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOverdue.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.days_overdue}</TableCell>
                  <TableCell>{r.current_fine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {filteredHistory.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Issued History</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue ID</TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell>Member Name</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Fine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.id}</TableCell>
                  <TableCell>{bookMap[h.book_id] || h.book_id}</TableCell>
                  <TableCell>{memberMap[h.member_id] || h.member_id}</TableCell>
                  <TableCell>{h.issue_date}</TableCell>
                  <TableCell>{h.due_date}</TableCell>
                  <TableCell>{h.return_date || "-"}</TableCell>
                  <TableCell>{h.fine}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

