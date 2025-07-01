import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import BookIcon from "@mui/icons-material/LibraryBooks";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function DashboardPage() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data));
  }, [token]);

  if (!data)
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 5, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={3}>
        <StatCard
          title="Total Book Titles"
          value={data.total_book_titles}
          icon={<BookIcon color="primary" sx={{ fontSize: 40 }} />}
        />
        <StatCard
          title="Issued Books"
          value={data.total_issued_books}
          icon={
            <AssignmentReturnIcon color="secondary" sx={{ fontSize: 40 }} />
          }
        />
        <StatCard
          title="Remaining Books"
          value={data.total_remaining_books}
          icon={<BookIcon sx={{ fontSize: 40, color: "#43a047" }} />}
        />
        <StatCard
          title="Total Members"
          value={data.total_members}
          icon={<GroupIcon sx={{ fontSize: 40, color: "#1976d2" }} />}
        />
        <StatCard
          title="Members with Issued Books"
          value={data.members_with_issued_books}
          icon={<GroupIcon sx={{ fontSize: 40, color: "#9c27b0" }} />}
        />
        <StatCard
          title="Total Fines Collected"
          value={`₹ ${data.total_fines_collected}`}
          icon={<MonetizationOnIcon sx={{ fontSize: 40, color: "#ff9800" }} />}
        />
      </Grid>

      {/* Remaining books table */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Remaining Books
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.remaining_books_details?.map((b, i) => (
              <TableRow key={i}>
                <TableCell>{b.title}</TableCell>
                <TableCell align="right">{b.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 120,
          p: 2,
          backgroundColor: "#f9f9f9",
        }}
        elevation={3}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box>{icon}</Box>
      </Card>
    </Grid>
  );
}

