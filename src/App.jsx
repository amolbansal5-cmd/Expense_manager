import './App.css';
import background from './assets/background.png';
import plain from './assets/plain.png';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import { useState } from "react";
import Dashboard from './Dashboard.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Expenses from "./component/Expenses.jsx";
import { toast } from "react-toastify";
import Income from "./component/Income.jsx";
import Analytics from "./component/Analytics";
import Profile from "./component/Profile.jsx";
import UserManagement from "./component/UserManagement.jsx";

function Home() {
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();
 const handleSignup = async () => {

  if (!validateEmail(email)) {
    toast.error("Please enter a valid email");
    return;
  }

  if (name === "" || email === "" || password === "") {
    toast.error("Please fill all fields");
    return;
  }

  try {

    const response = await fetch("http:///api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    toast.success(data.message);

    if (response.ok) {
      navigate("/login");
    }

  } catch (error) {
    console.log(error);
   toast.error("Unable to connect to server");
  }
};




  return (
    <div className="App">

      <div 
        className="left" 
        style={{ backgroundImage: `url(${background})` }}
      >
        <p className="title">Welcome Back</p>

        <p className="subtitle">
          To keep connected with us please login with your personal information
        </p>

        <button 
          className="butt"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>

      </div>


      <div 
        className="Apsp"
        style={{ backgroundImage: `url(${plain})` }}
      >
        <h1>Create Account</h1>

        <div>
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Enter your Name" 
             value={name}
 onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your Email" 
         value={email}
 onChange={(e)=>setEmail(e.target.value)} />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
           value={password}
 onChange={(e)=>setPassword(e.target.value)}/>
        </div>

      <button onClick={handleSignup}>
 Signup
</button>

      </div>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>
<Route path="/Expenses" element={<Expenses />} />
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

       <Route 
 path="/dashboard" 
 element={
   <PrivateRoute>
     <Dashboard />
   </PrivateRoute>
 }
/>
<Route
    path="/income"
    element={
        <PrivateRoute>
            <Income />
        </PrivateRoute>
    }
/>
<Route
    path="/profile"
    element={
        <PrivateRoute>
            <Profile />
        </PrivateRoute>
    }
/>
<Route
    path="/analytics"
    element={
        <PrivateRoute>
            <Analytics />
        </PrivateRoute>
    }
/>
<Route
    path="/user-management"
    element={
        <PrivateRoute>
            <UserManagement />
        </PrivateRoute>
    }
/>



      </Routes>

    </BrowserRouter>
  );
}


export default App;