const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    let message = "Something went wrong";
    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length) {
      message = data.detail[0].msg;
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const getEmployees = () => request("/employees");

export const createEmployee = (data) =>
  request("/employees", { method: "POST", body: JSON.stringify(data) });

export const updateEmployee = (id, data) =>
  request(`/employees/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteEmployee = (id) =>
  request(`/employees/${id}`, { method: "DELETE" });
