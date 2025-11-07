import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { isAuthenticated } from "../utils/auth"
import { api } from "../config/api"
import axios from "axios"
import { getAuthHeaders } from "../utils/auth"

export const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [stats, setStats] = useState({
        totalSent: 0,
        totalReceived: 0,
        transactionCount: 0
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch transactions
                const transactionsResponse = await axios.get(api.endpoints.getTransactions, {
                    headers: getAuthHeaders()
                });
                const fetchedTransactions = transactionsResponse.data.transactions || [];
                setTransactions(fetchedTransactions);

                // Fetch balance
                const balanceResponse = await axios.get(api.endpoints.getBalance, {
                    headers: getAuthHeaders()
                });
                setBalance(balanceResponse.data.balance || 0);

                // Calculate stats
                const sent = fetchedTransactions
                    .filter(t => t.type === 'sent')
                    .reduce((sum, t) => sum + t.amount, 0);
                const received = fetchedTransactions
                    .filter(t => t.type === 'received')
                    .reduce((sum, t) => sum + t.amount, 0);

                setStats({
                    totalSent: sent,
                    totalReceived: received,
                    transactionCount: fetchedTransactions.length
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return new Intl.DateTimeFormat('en-IN', {
                hour: 'numeric',
                minute: 'numeric'
            }).format(date) + ' (Today)';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }

        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(amount);
    };

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Appbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Manage your finances and transactions</p>
            </div>

            {/* Balance Card */}
            <div className="mb-8">
                <Balance />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Sent</p>
                            <p className="text-2xl font-bold text-gray-900">₹{formatCurrency(stats.totalSent)}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Received</p>
                            <p className="text-2xl font-bold text-gray-900">₹{formatCurrency(stats.totalReceived)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-9-9m9 9l9-9" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.transactionCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users Section - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <Users />
                </div>

                {/* Transactions Section - Takes 1 column on large screens */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Recent Activity
                            </h2>
                            {transactions.length > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                    {transactions.length}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-500 font-medium">No transactions yet</p>
                                <p className="text-sm text-gray-400 mt-2">Start sending money to see your history</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {transactions.slice(0, 10).map((transaction) => (
                                    <div key={transaction.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 hover:scale-[1.01]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className={`p-2.5 rounded-full flex-shrink-0 ${
                                                    transaction.type === 'sent' 
                                                        ? 'bg-red-100' 
                                                        : 'bg-green-100'
                                                }`}>
                                                    {transaction.type === 'sent' ? (
                                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-9-9m9 9l9-9" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                                            {transaction.type === 'sent' 
                                                                ? transaction.to.name
                                                                : transaction.from.name
                                                            }
                                                        </p>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                                                            transaction.type === 'sent' 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {transaction.type === 'sent' ? 'Sent' : 'Received'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(transaction.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-lg font-bold flex-shrink-0 ${
                                                transaction.type === 'sent' 
                                                    ? 'text-red-600' 
                                                    : 'text-green-600'
                                            }`}>
                                                {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}