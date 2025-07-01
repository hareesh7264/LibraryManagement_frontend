import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export function getDashboardSummary(token) {
  return axios.get(`${BASE_URL}/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
