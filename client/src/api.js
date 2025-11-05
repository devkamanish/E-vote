
const BASE =
  import.meta.env.MODE === "production"
    ? "" // In production, same domain serves API and frontend
    : "http://localhost:5000";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } else {
    // non-json
    if (!res.ok) throw { message: "Network error" };
    return {};
  }
}

