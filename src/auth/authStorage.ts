const TOKEN_KEY = "token";

type AuthUser = {
  id: number;
  email?: string;
  rol?: string;
};

function base64UrlToJson(base64Url: string): any | null {
  try {
    // Base64URL -> Base64
    let b64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // padding
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);

    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeJwt(token: string): any | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  return base64UrlToJson(parts[1]);
}

function pickRole(payload: any): string | null {
  if (!payload) return null;

  // casos comunes
  const direct =
    payload.role ??
    payload.Rol ??
    payload.roles ??
    payload.Roles ??
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!direct) return null;

  // a veces viene como array
  if (Array.isArray(direct)) return direct[0] ?? null;

  return String(direct);
}

function pickUserId(payload: any): number {
  if (!payload) return 0;

  const raw =
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
    payload.nameid ??
    payload.NameIdentifier ??
    payload.sub;

  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = decodeJwt(token);
    return pickRole(payload);
  },

  getUser(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = decodeJwt(token);
    if (!payload) return null;

    return {
      id: pickUserId(payload),
      email: payload.email ?? payload.Email,
      rol: this.getRole() ?? undefined,
    };
  },
};
