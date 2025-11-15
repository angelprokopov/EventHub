import {http} from "./httpClient.ts";

type AuthResponse = {token: string;userId: string;displayName: string;email: string};

export function login(payload: {email: string; password: string }) : Promise<AuthResponse> {
    return http('', {method: 'POST', body: JSON.stringify(payload)});
}

export function register(payload: {email: string; password: string; displayName: string}): Promise<AuthResponse>{
    return http('', {method: 'POST', body: JSON.stringify(payload)});
}