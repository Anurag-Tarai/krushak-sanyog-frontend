// utils/auth.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    const expiry = payload.exp * 1000; // convert to ms
    return Date.now() > expiry;
  } catch (err) {
    return true; // invalid token format
  }
};
