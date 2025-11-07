export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

