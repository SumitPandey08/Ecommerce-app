export interface UserState {
    id: string;
    email: string;
    username: string;
    cart: string[];
    orders: string[];
    address: string | null;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserState | null;
    error: string | null;
}

export const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    error: null
};
