import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    setLogoutOpen(false);
    logout();
  };

  const cancelLogout = () => {
    setLogoutOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ gap: 2 }}>
          {token ? (
            <>
              <NavButton to="/" label="Dashboard" />
              <NavButton to="/books" label="Books" />
              <NavButton to="/members" label="Members" />
              <NavButton to="/issues" label="Issue/Return" />
              <NavButton to="/reports" label="Reports" />
              <Button
                color="inherit"
                onClick={handleLogoutClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#ff9800",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Typography>Library Management System</Typography>     )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutOpen} onClose={cancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Custom NavButton with hover styles
function NavButton({ to, label }) {
  return (
    <Button
      component={Link}
      to={to}
      color="inherit"
      sx={{
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.2)",
          color: "#ff9800",
        },
      }}
    >
      {label}
    </Button>
  );
}
