import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);



  const handleLogin = async () => {

    const validateEmail = (email) => {
      return email.includes("@") && email.includes(".");
    };


    if(email === "" || password === ""){
      toast.warning("Please fill all fields");
      return;
    }


    if(!validateEmail(email)){
      toast.warning("Please enter a valid email");
      return;
    }


    try{

      const response = await fetch(
          "https://expense-manager-h6zo.onrender.com/login",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify({
            email,
            password
          })

        }
      );


      const data = await response.json();

       

      if(response.ok){
        
       toast.success(data.message);

        localStorage.setItem("token",data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            email:email
          })
        );


        navigate("/dashboard");

      }else{
        toast.error(data.message);

      }
      


    }
    catch(error){

      console.log(error);

     toast.error("Unable to connect to server");
    }

  };




return (

<div className="login-page">


    <div className="login-left">


        <h2>
          💰 Expense Manager
        </h2>


        <p>
          Take control of your money.
          Track expenses, manage income
          and build better financial habits.
        </p>



        <div className="features">


            <div className="feature-card">

              <span>📊</span>

              <div>
                <h3>Smart Analytics</h3>
                <p>Understand your spending pattern</p>
              </div>

            </div>



            <div className="feature-card">

              <span>💳</span>

              <div>
                <h3>Expense Tracking</h3>
                <p>Manage every transaction easily</p>
              </div>

            </div>




            <div className="feature-card">

              <span>🚀</span>

              <div>
                <h3>Better Savings</h3>
                <p>Achieve your financial goals</p>
              </div>

            </div>


        </div>



      



    </div>





    <div className="login-box">


        <h1>
          Welcome Back 👋
        </h1>


        <label>Email</label>


        <input

          type="email"

          placeholder="Enter your Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          autoComplete="off"

        />




        <label>Password</label>


        <input

          type={showPassword ? "text":"password"}

          placeholder="Enter your Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          autoComplete="off"

        />



        <button onClick={handleLogin}>
          Login
        </button>




        <div className="bott">

          <p>
            Don't have an account?
            <Link to="/">
              {" "}Sign Up
            </Link>
          </p>

        </div>



    </div>


</div>

);


}


export default Login;