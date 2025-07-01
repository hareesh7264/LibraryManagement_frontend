export function getAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
