import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning.jsx"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"} />
                <SubHeading label={"Enter your creditials to access your account"} />
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} placeholder="adarsh@gmail.com" label={"Email"}  />
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} placeholder="123456" label={"Password"}  />
                <div className="pt-4">
                    <Button onClick={async () => {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                            username,
                            password
                        });
                        localStorage.setItem("token", response.data.token)
                        navigate("/dashboard")
                    }} label={"Sign in"} />
                </div>
                <BottomWarning label={"Don't have an account?"} bottonText={"Sign up"} to={"/signup"} />
            </div>
        </div>
    </div>
}