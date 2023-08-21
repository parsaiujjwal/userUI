import { useDispatch, useSelector } from "react-redux"
import { Navebar } from "../Navbar/Navbar"
import "./profile.css"
import { useEffect } from "react";

import api from "../../Webapi/api";
import Loader from "../Loader/loader";
import Avatar from "../../user.png";
import { useState } from "react";
import axios from "axios";
import nodata from "../../no-data.png";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export function Profile() {
    const { user } = useSelector(state => state.user);
    const [savedPosts, setSavedPosts] = useState([]);
    const [userPostType, setUserPostType] = useState(true);
    const { userPostList, isLoading } = useSelector(state => state.userPosts);
    const [postComment, setPostComment] = useState(null);

    const dispatch = useDispatch();


    const viewComment = async (postId) => {
        let comment = document.getElementById("comment-container");
        if (comment.style.display == "none") {
            comment.style.display = "block";
            try {
                let response = await axios.post(api.URL + "/post/getComment", { userPostId: postId });
                setPostComment(response.data.result);
            } catch (err) {
                console.log(err);
            }

        }
        else {
            comment.style.display = "none";
            setPostComment(null);
        }
    }

    const userPostModal = async (postId) => {
        let modal = document.getElementById("userPost-modal");
        if (modal.style.display == "none") {
            modal.style.display = "block";
            try {
                let response = await axios.post(api.URL + "/post/getComment", { userPostId: postId });
                setPostComment(response.data.result);
            } catch (err) {
                console.log(err);
            }

        }
        else {
            modal.style.display = "none";
            setPostComment(null);
        }
    }

    const changeUserPostType = async (value) => {
        if (value) {
            setUserPostType(value);
        }
        else {
            let response = await axios.post(api.URL + api.GET_USER_SAVED_POSTS, { userId: user._id })
            console.log(response.data.savedPosts)
            setSavedPosts(response.data.savedPosts);
            setUserPostType(value);

        }
    }
    return <>
        <Navebar />
        
        {/* comment modal start*/}
        <div id="comment-container" className="comment-container" style={{ display: "none" }}>
            <div className="comment-main">
                <div className="comment-box ">
                    <div className="bg-secondry comment-box-post">
                        {(postComment) && postComment.type == "video/mp4" ? <video className="video" loop src={api?.file + postComment?.file} autoPlay="true" /> : <img className="commentPost" src={api?.file + postComment?.file} />}
                    </div>
                    <div className="comment-box-main1">
                        <div style={{ zIndex: "2" }} className="comment-box-main  pt-3">
                            <div onClick={viewComment} className="bi bi-x-circle-fill me-1 comment-close"></div>
                            {(postComment?.commentItems.length) ? postComment?.commentItems.reverse().map((item, index) => <div className="comment-span" key={index}>
                                <div>
                                    <img style={{ cursor: "pointer" }} src={item.friendUserId.profilePhoto ? api.profilepic + item.friendUserId.profilePhoto : Avatar} className="PostHeaderProfile ms-2 me-1" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>{item.friendUserId.userName}</div>
                                    <div><span class="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}><span className='ms-1' style={{ color: "black" }}>{item.comment}</span></span></div>
                                </div>
                            </div>)
                                : <div style={{ height: "100%" }} className="d-flex justify-content-center align-items-center"><div ><img width={"100%"} src={nodata} alt="" /></div></div>
                            }
                        </div>
                        <div className=" comment-likeview">
                            <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="ms-4">
                                    <span class="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}></span> {postComment?.commentItems.length} comments
                                </div>
                                <div className="me-4">
                                    <span class="bi bi-balloon-heart-fill" style={{ color: "crimson" }}></span>{postComment?.likeItems.length} likes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* comment modal end*/}

        {/* comment modal start*/}
        <div id="userPost-modal" className="userPost-container" style={{ display: "none" }}>
            <div className="userPost-main">
                <div className="userPost-box">
                    <div className="bg-secondry userPost-box-post">
                        {(postComment) && postComment.type == "video/mp4" ? <video className="video" loop src={api?.file + postComment?.file} autoPlay="true" /> : <img className="commentPost" src={api?.file + postComment?.file} />}
                    </div>
                    <div className="userPost-box-main1">
                        <div style={{ zIndex: "2" }} className="userPost-box-main  pt-3">
                            <div onClick={userPostModal} className="bi bi-x-circle-fill me-1 userPost-close"></div>
                            {(postComment?.commentItems.length) ? postComment?.commentItems.reverse().map((item, index) => <div className="userPost-span" key={index}>
                                <div>
                                    <img style={{ cursor: "pointer" }} src={item.friendUserId.profilePhoto ? api.profilepic + item.friendUserId.profilePhoto : Avatar} className="PostHeaderProfile ms-2 me-1" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>{item.friendUserId.userName}</div>
                                    <div><span class="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}><span className='ms-1' style={{ color: "black" }}>{item.comment}</span></span></div>
                                </div>
                            </div>)
                                : <div style={{ height: "100%" }} className="d-flex justify-content-center align-items-center"><div ><img width={"100%"} src={nodata} alt="" /></div></div>
                            }
                        </div>
                        <div className=" userPost-likeview">
                            <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="ms-4">
                                    <span class="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}></span> {postComment?.commentItems.length} comments
                                </div>
                                <div className="me-4">
                                    <span class="bi bi-balloon-heart-fill" style={{ color: "crimson" }}></span>{postComment?.likeItems.length} likes
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        {/* comment modal end*/}
        <div className="profile-container">
            <div className="main-profile-container ">
                <div className="profile-header ">
                    <div className="profile-photo">
                        <img src={user.profilePhoto ? api.profilepic + user.profilePhoto : Avatar} alt="Profile Photo" />
                    </div>
                    <div className="profile-info ">
                        <h1 className="username ">{user.userName}</h1>
                        <div className="user-fuctionality">
                            <div>
                                <h2 className="name ">{user.name}</h2>
                            </div>
                            {/* <div>
                                <button className="me-2 edit-profile" data-bs-toggle="modal" data-bs-target="#updateModal">Edit profile</button>
                                <img src="/img/gear-fill.svg" />
                            </div> 
                             *******
                            */}
                            <div>
                                <button className="me-2 edit-profile"><Link style={{ textDecoration: "none", color: "black" }} to='/update' >Edit Profile</Link></button>
                                <a id="changepasswored" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                    <img src="/img/gear-fill.svg" />
                                </a>
                            </div>
                        </div>
                        <ul className="social-links">
                            <div className="ProfileRow  ">
                                <div className=""><span className="userSocials">{userPostList.length} posts</span></div>
                                                            </div>
                        </ul>
                        <p className="bio">{user.about ? user.about : "bio"} </p>
                    </div>
                </div>
                <hr />

                <section className="w-100" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>{(isLoading) && <Loader />}</section>
                <div className="user-post-grid p-5 ">
                    {(userPostType)
                        ? userPostList.map((posts, index) =>
                            <div key={index} className="product-item user-post d-flex justify-content-center" style={{ color: "lightgray" }}>
                                {posts.type == "video/mp4" ? <video className="video Posts" loop src={api.file + posts.file} autoPlay="true" /> : <img className="Posts" src={api.file + posts.file} />}
                                <div className="product-action">
                                    <a className="btn" onClick={() => userPostModal(posts._id)} style={{ display: "flex", flexDirection: "column" }}><i className="bi bi-heart-fill" style={{ color: "crimson", fontSize: "25px" }}></i><span style={{ color: "white" }}> {posts.likeItems.length} likes</span></a>

                                </div>
                            </div>

                        )
                        : savedPosts.map((posts, index) =>
                            <div key={index} className="product-item user-post d-flex justify-content-center" style={{ color: "lightgray" }}>
                                {posts.postId?.type == "video/mp4" ? <video className="video Posts" loop src={api.file + posts.postId?.file} autoPlay="true" /> : <img className="Posts" src={api.file + posts.postId?.file} />}
                                <div className="product-action">
                                    <a onClick={() => viewComment(posts.postId?._id)} className="btn" style={{ display: "flex", flexDirection: "column" }}><i className="bi bi-heart-fill" style={{ color: "crimson", fontSize: "25px" }}></i><span style={{ color: "white" }}> {posts.postId?.likeItems.length} likes</span></a>

                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>

    </>
}
