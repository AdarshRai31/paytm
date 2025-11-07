import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from 'react';
import { api } from "../config/api";
import { getAuthHeaders } from "../utils/auth";

export const Send = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!id || !name) {
            navigate("/dashboard");
        }
    }, [id, name, navigate]);

    const handleTransfer = async () => {
        setError("");
        setSuccess(false);

        const amountNum = parseFloat(amount);
        if (!amount || amountNum <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                api.endpoints.transfer,
                {
                    to: id,
                    amount: amountNum
                },
                {
                    headers: getAuthHeaders()
                }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            setError(
                error.response?.data?.message || 
                error.response?.data?.errors?.[0]?.message ||
                "Transfer failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const userInitial = name ? (name[0] || "U").toUpperCase() : "U";

    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Send Money
                    </h2>
                </div>

                {/* Recipient Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <span className="text-2xl text-white font-bold">{userInitial}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Sending to</p>
                            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-start gap-3 animate-shake">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-semibold">Transfer Successful!</p>
                            <p className="text-sm mt-1">Redirecting to dashboard...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3 animate-shake">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }} className="space-y-6">
                    <div>
                        <label
                            className="block text-sm font-semibold text-gray-700 mb-2"
                            htmlFor="amount"
                        >
                            Amount (₹)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-lg font-semibold">₹</span>
                            </div>
                            <input
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError("");
                                }}
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold transition-all"
                                id="amount"
                                placeholder="0.00"
                                value={amount}
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={handleTransfer}
                            disabled={loading || success || !amount}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                                loading || success || !amount
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : success ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Transfer Successful!
                                </span>
                            ) : (
                                'Send Money'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
}