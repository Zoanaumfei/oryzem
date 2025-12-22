// js/api.js

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.clear();
    window.location.href = "/login.html";
    return;
  }

  return response.json();
}
