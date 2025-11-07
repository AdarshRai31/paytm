import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../config/api"
import { logout, getAuthHeaders } from "../utils/auth"
import axios from "axios"

export const Appbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(api.endpoints.getUser, {
                    headers: getAuthHeaders()
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                if (error.response?.status === 403) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const userInitial = user ? (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase() : "U";
    const userName = user ? `${user.firstName} ${user.lastName}` : "User";

    return <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        PayTM
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="rounded-full h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center text-lg font-bold text-white shadow-md">
                            {userInitial}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">Hello, {loading ? "..." : userName}</span>
                            <span className="text-xs text-gray-500">{user?.username || ""}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
}