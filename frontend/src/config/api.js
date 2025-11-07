import { getAuthHeaders as getAuth } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const api = {
    baseURL: API_BASE_URL,
    endpoints: {
        signup: `${API_BASE_URL}/user/signup`,
        signin: `${API_BASE_URL}/user/signin`,
        getUser: `${API_BASE_URL}/user/me`,
        updateUser: `${API_BASE_URL}/user`,
        getUsers: `${API_BASE_URL}/user/bulk`,
        getBalance: `${API_BASE_URL}/account/balance`,
        transfer: `${API_BASE_URL}/account/transfer`,
        getTransactions: `${API_BASE_URL}/account/transactions`,
    }
};

export const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuth(),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "An error occurred");
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

