import { BrowserRouter,
  Routes,
  Route 
} from "react-router-dom";

import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Send } from "./pages/SendMoney";
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<Send />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
