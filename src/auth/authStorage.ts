const TOKEN_KEY = "token";

type AuthUser = {
  id: number;
  email?: string;
  rol?: string;
};

function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
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

    return (
      payload?.role ||
      payload?.Rol ||
      payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  },

  getUser(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = decodeJwt(token);

    return {
      id: Number(
        payload?.sub ??
        payload?.nameid ??
        payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
        0
      ),
      email: payload?.email,
      rol: this.getRole() ?? undefined
    };
  }
};
