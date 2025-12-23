const API_BASE_URL = "https://oryzem-backend.onrender.com";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    alert("Sessão expirada ou acesso não autorizado.");
    logout();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro na API");
  }

  return response.json();
}
