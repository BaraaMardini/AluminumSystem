import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "authToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  // انتهاء صلاحية التوكن أو عدم صلاحيته → تسجيل خروج تلقائي
  if (response.status === 401) {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
}

// ────────────────────────────────────────────────────────────────
// getCurrentUser — يقرا بيانات المستخدم الحالي من الـ JWT المخزّن
// ────────────────────────────────────────────────────────────────
const CLAIM_TYPES = {
  nameIdentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  role: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
};

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return {
      userId: payload[CLAIM_TYPES.nameIdentifier] ?? null,
      email: payload[CLAIM_TYPES.email] ?? null,
      role: payload[CLAIM_TYPES.role] ?? null,
      permissionMask: payload.PermissionMask != null ? Number(payload.PermissionMask) : null,
    };
  } catch {
    return null;
  }
}