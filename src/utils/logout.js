import api from "../api/api";

export const logout = async () => {
  try {
    const response = await api.post("/api/v1/auth/logout"); // ✅ use Axios

    if (response.status !== 200) {
      throw new Error("Failed to logout");
    }

    return true;
  } catch (err) {
    console.error("Logout error:", err);
    return false;
  }
};
