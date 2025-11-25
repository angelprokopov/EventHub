import {http} from "./httpClient.ts";

type AuthResponse = {token: string;userId: string;displayName: string;email: string};

export function login(email: string, password: string) {
    return http<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}
export function register(email: string, password: string, displayName: string) {
    return http<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({email, password, displayName})
    });
}