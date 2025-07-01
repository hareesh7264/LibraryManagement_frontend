import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export function getBooks(token) {
  return axios.get(`${BASE_URL}/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
