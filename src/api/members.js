import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export function getMembers(token) {
  return axios.get(`${BASE_URL}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
