import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export function getIssues(token) {
  return axios.get(`${BASE_URL}/issues`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
