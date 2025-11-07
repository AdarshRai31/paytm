import { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../config/api"
import { getAuthHeaders } from "../utils/auth"

export const Balance = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(api.endpoints.getBalance, {
                    headers: getAuthHeaders()
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setError("Failed to fetch balance");
            } finally {
                setLoading(false);
            }
        };
        fetchBalance();
    }, []);

    const formatBalance = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(amount);
    };

    return <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Total Balance</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? (
                            <div className="h-10 w-48 bg-white/20 rounded animate-pulse"></div>
                        ) : error ? (
                            <p className="text-red-200">{error}</p>
                        ) : (
                            <>
                                <span className="text-5xl font-bold">{formatBalance(balance).split('.')[0]}</span>
                                <span className="text-2xl text-blue-100">.{formatBalance(balance).split('.')[1]}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">Account Active</span>
                </div>
            </div>
        </div>
    </div>
}