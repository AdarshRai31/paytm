import { useState, useEffect } from "react"
import { BottomWarning } from "../components/BottomWarning.jsx"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { api } from "../config/api"
import { isAuthenticated, setToken } from "../utils/auth"

export const Signin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) {
            newErrors.username = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            newErrors.username = "Email is invalid";
        }
        if (!password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignin = async () => {
        setErrorMessage("");
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await axios.post(api.endpoints.signin, {
                username,
                password
            });

            if (response.data.token) {
                setToken(response.data.token);
                navigate("/dashboard");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 
                error.response?.data?.errors?.[0]?.message ||
                "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <Heading label={"Welcome Back"} />
                    <SubHeading label={"Sign in to continue to your account"} />
                </div>

                {errorMessage && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3 animate-shake">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-medium">{errorMessage}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSignin(); }} className="space-y-1">
                    <InputBox 
                        onChange={e => {
                            setUsername(e.target.value);
                            setErrors({...errors, username: ""});
                        }} 
                        placeholder="john.doe@example.com" 
                        label={"Email Address"}
                        value={username}
                        error={errors.username}
                    />
                    <InputBox 
                        onChange={e => {
                            setPassword(e.target.value);
                            setErrors({...errors, password: ""});
                        }} 
                        placeholder="••••••••" 
                        label={"Password"}
                        type="password"
                        value={password}
                        error={errors.password}
                    />
                    <div className="flex items-center justify-between text-sm mb-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                    </div>
                    <div className="pt-2">
                        <Button onClick={handleSignin} label={"Sign In"} loading={loading} disabled={loading} variant="primary" />
                    </div>
                </form>

                <BottomWarning label={"Don't have an account?"} bottonText={"Sign up"} to={"/signup"} />
            </div>
        </div>
    </div>
}