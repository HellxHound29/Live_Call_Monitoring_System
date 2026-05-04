const BASE = "http://127.0.0.1:8000";

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Login error:", err);
      throw new Error("Invalid credentials");
    }
    const data = await res.json();
    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  },

  getToken: () => localStorage.getItem("token"),

  getCalls: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}/api/calls/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch calls");
    return res.json();
  },
};