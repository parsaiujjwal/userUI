import { Link, Navigate, useNavigate } from "react-router-dom";
import "./signup.css";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../../redux-conflig/userSlice";
import { ToastContainer, toast } from "react-toastify";
export default function SignUp() {
    const [name,setName] = useState("");
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [contact,setContact] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const eventHandler = async (event)=>{
        try{
            event.preventDefault();
            let response = await axios.post("http://localhost:3000/user/signUp",{name,userName,email,password,contact});
            localStorage.setItem("user",JSON.stringify(response.data.user));
            dispatch(setUser(response.data.user));
            dispatch(setToken(response.data.token));
            navigate("/");
        }
        catch(err){
            toast.error(err.response.data.message[0].msg);
            console.log(err);
        }
    }
    return <>
    <ToastContainer />
    <div style={{height:"100vh",width:"100%", backgroundColor:"#ffffff",position:"absolute" , display:"flex" , justifyContent:"center", alignItems:"center"}}>
        <div className="container" style={{ padding: "2vw", width: "60%" }}>
            <div className="row row1" style={{ height: 500 }}>
                <div className="col-6" id="msg" style={{ backgroundColor: "white smoke", height: 500 }}>
                    <h2 id="heading">Hello, Friend!</h2>
                    <p style={{ color: "black", marginTop: "3vw" }}>
                        Enter your personal details and start journay with us
                    </p>
                    <Link to="/signin" id="link1">
                    <button className="btn btn-dark ghost" id="signUp">
                        
                            Sign In
                        
                    </button>
                    </Link>
                </div>
                <div className="col-6" style={{ backgroundColor: "white", height: 500 }}>
                    <form onSubmit={eventHandler} >
                        <h2 id="heading">CREATE ACCOUNT</h2>
                        <span>Or use your email for registration</span>

                        <input onChange={(event)=>setName(event.target.value)} className="ps-3 input1" type="text" placeholder="Enter Name" />
                        <input onChange={(event)=>setUserName(event.target.value)} className="ps-3 input1" type="text" placeholder="Enter User Name" />
                        <input onChange={(event)=>setEmail(event.target.value)} className="ps-3 input1" type="text" placeholder="Enter email" />
                        <input onChange={(event)=>setContact(event.target.value)} className="ps-3 input1" type="text" placeholder="Enter contact number" />
                        <input onChange={(event)=>setPassword(event.target.value)} className="ps-3 input1" type="password" placeholder="Enter Password" />

                        <button className="btn btn-dark btn-success1"> Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </>
}