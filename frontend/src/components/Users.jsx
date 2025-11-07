import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { api } from "../config/api";
import { getAuthHeaders } from "../utils/auth";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`${api.endpoints.getUsers}?filter=${encodeURIComponent(filter)}`, {
                    headers: getAuthHeaders()
                });
                setUsers(response.data.user || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the API call
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(timer);
    }, [filter])

    return <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Find Users
            </h2>
            {users.length > 0 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {users.length} {users.length === 1 ? 'user' : 'users'}
                </span>
            )}
        </div>
        
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                onChange={(e) => {
                    setFilter(e.target.value)
                }} 
                type="text" 
                placeholder="Search users by name..." 
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={filter}
            />
        </div>

        {loading && (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-500">Loading users...</p>
            </div>
        )}
        {error && (
            <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        )}
        {!loading && !error && users.length === 0 && (
            <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-500 font-medium">
                    {filter ? "No users found" : "Start typing to search for users"}
                </p>
                {!filter && (
                    <p className="text-sm text-gray-400 mt-2">Try searching by first or last name</p>
                )}
            </div>
        )}
        <div className="space-y-3">
            {users.map(user => (
                <User key={user._id} user={user} />
            ))}
        </div>
    </div>
}

function User({user}) {
    const navigate = useNavigate();
    const userInitial = (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`;

    return <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:scale-[1.01]">
        <div className="flex items-center gap-4 flex-1">
            <div className="rounded-full h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex justify-center items-center text-xl font-bold shadow-md">
                {userInitial}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-lg">
                    {fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                    {user.username}
                </div>
            </div>
        </div>

        <div className="ml-4">
            <button
                onClick={() => {
                    navigate(`/send?id=${user._id}&name=${encodeURIComponent(fullName)}`);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
                Send Money
            </button>
        </div>
    </div>
}