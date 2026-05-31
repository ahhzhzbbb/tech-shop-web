const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** Backend may return a bare JWT or a Set-Cookie-style string in jwtToken. */
export function extractJwtFromLoginResponse(data) {
    const raw = data?.jwtToken;
    if (!raw || typeof raw !== 'string') {
        return null;
    }

    if (raw.startsWith('eyJ')) {
        return raw;
    }

    const cookiePair = raw.match(/(?:^|;\s*)[^=]+=([^;]+)/);
    if (cookiePair?.[1]) {
        return cookiePair[1];
    }

    return raw;
}

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setStoredUser(user) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function clearStoredUser() {
    localStorage.removeItem(USER_KEY);
}

export function getInitialAuthUser() {
    if (!getAuthToken()) {
        return null;
    }
    return getStoredUser();
}
