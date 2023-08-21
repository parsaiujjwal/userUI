import { Link, useNavigate } from 'react-router-dom';
import '../Navbar/navbar.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { AddPostModal } from '../Modal/AddPost.madal';

import { setToken, setUser, setIslogin } from '../../redux-conflig/userSlice';
import Avtar from "../../user.png"
import api from '../../Webapi/api';
import nodata from "../../no-data.png"

export function Navebar() {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    // dispatch(setUser(""));
    // dispatch(setToken(""));
    // navigate("/");
    localStorage.removeItem("user");
    window.location.reload();
  }

  const toggleBellIcon = async () => {
    const notify = document.getElementById("notify");
    if (notify.style.display == "none") {
      notify.style.display = "block";
      try {
        let response = await axios.get(api.URL + api.NOTIFICATION + "/" + user._id);
        setNotifications(response.data.notification);
      } catch (err) {
        console.log(err);
      }
    }
    else {
      notify.style.display = "none";
    }
  }


  return <>
    <ToastContainer />
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top mb-4 sidebar" >
      <div className="container-fluid">
        <a className="navbar-brand me-5" href="#">
          User PAGE</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse stroke" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item " style={{ marginTop: '-5px' }}>
              <Link className='navLinks' to="/"> Home </Link>
            </li>
            {/* <li className="nav-item " style={{ marginTop: '-5px' }}>
              <Link className='navLinks' to="/about"> About </Link>
            </li>
            <li className="nav-item " style={{ marginTop: '-5px' }}>
              <a data-bs-toggle="modal"
                data-bs-target="#staticBackdrop" className='navLinks'> Collaborate </a>
            </li> */}
            <li className="nav-item " style={{ marginTop: '-5px' }}>
              <Link className='navLinks' onClick={signOut} > Sign Out </Link>
            </li>
          </ul>
        
        </div>
      </div>
    </nav>

    <div className='notify-container' >
      <div id='notify' className='notify-main' style={{ display: "none", paddingTop: "10px" }}>
        {(notifications.length != 0)
          ? notifications.map((notification, index) => <div key={index} className='notification-block ps-3 pe-3'>
            <div className='d-flex' style={{ width: "90%" }}>
              <div style={{ height: "100%" ,marginTop:"5px" }}>
                <img src={notification.frienduserid.profilePhoto ? api.profilepic + notification.frienduserid.profilePhoto : Avtar} className='me-2' style={{ borderRadius: "50%", height: "40px", width: "40px" }} alt='photo' />
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>{notification.frienduserid.userName}</div>
                <div>{notification.frienduseract == "like" ? <span class="bi bi-balloon-heart-fill" style={{ color: "crimson" }}><span className='ms-1' style={{ color: "black" }}>is liked your post</span></span> : <span class="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}><span className='ms-1' style={{ color: "black" }}>{notification.frienduseract}</span></span>}</div>
              </div>
            </div>
            <div className='d-flex justify-content-end' style={{ width: "10%",marginTop:"5px" }}>
              {notification.currentPost.type == "video/mp4" ? <video className="video" loop src={api.file + notification.currentPost.file} style={{ height: "40px", width: "40px" }} autoPlay="false" /> :
                <img src={api.file + notification.currentPost.file} style={{ height: "40px", width: "30px" }} />
              }
            </div>
          </div>)
          : <div style={{height:"100%"}} className="d-flex justify-content-center align-items-center"><div ><img width={"100%"} src={nodata} alt="" /></div></div> 
        }
      </div>
    </div>


    <AddPostModal />
      </>
}





