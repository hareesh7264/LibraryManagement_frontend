import axios from "axios";

export function loginUser(email, password) {
  return axios.post("http://127.0.0.1:8000/login", {
    email,
    password,
  });
}
