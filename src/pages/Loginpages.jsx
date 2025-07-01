import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const data = qs.stringify({ username, password });

      const res = await axios.post("http://127.0.0.1:8000/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Library Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        onClick={handleLogin}
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Container>
  );
}
