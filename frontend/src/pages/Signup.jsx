
import { BottomWarning } from "../components/BottomWarning.jsx"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"} />
                <SubHeading label={"Enter your infromation to create an account"} />
                <InputBox onChange={e => {
                    setFirstName(e.target.value);
                }} placeholder="John" label={"First Name"}  />
                <InputBox onChange={e => {
                    setLastName(e.target.value);
                }} placeholder="Doe" label={"Last Name"}  />
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} placeholder="adarsh@gmail.com" label={"Email"}  />
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} placeholder="123456" label={"Password"}  />
                <div className="pt-4">
                    <Button onClick={async () => {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                            username,
                            firstName,
                            lastName,
                            password
                        });

                        // storing the token in a local storage for future calls with "token" as name
                        localStorage.setItem("token", response.data.token)
                        navigate("/dashboard")
                    }} label={"Sign up"} />
                </div>
                <BottomWarning label={"Already have an account?"} bottonText={"Sign in"} to={"/signin"} />
            </div>
        </div>
    </div>
}