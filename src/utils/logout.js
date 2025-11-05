export const logout = async () => {
  try {
    // Call logout endpoint
    const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
      method: "POST",
      credentials: "include", // ✅ include cookies
      headers: {
        "Accept": "*/*",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};