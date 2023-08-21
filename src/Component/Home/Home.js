import { Navebar } from "../Navbar/Navbar"
import _ from 'lodash';
import "./home.css";
import { useEffect, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import avtar from '../../user.png';
import api from "../../Webapi/api";
import Loader from "../Loader/loader";
import { fetchPost, setPosts } from "../../redux-conflig/postSlice";
import { removePost, savePost, setUser } from "../../redux-conflig/userSlice";
import { json, useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import nodata from "../../no-data.png"

export function Home() {

    const [comment, setcomment] = useState("")
    const { user } = useSelector((state) => state.user);
    const { postList, isLoading, error, totalpost } = useSelector(state => state.posts);
    const [postComment, setPostComment] = useState(null);
    const Navigate = useNavigate();
    const dispach = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);




    // do like
    const doLike = async (postId) => {
        const divElement = document.getElementById("div" + postId);
        let response = await axios.post(api.URL + api.doLike, { postId, friendUserId: user._id });
        if (response.data.status) {
            let postIndex = await postList.findIndex((posts) => posts._id == postId);
            const iconElement = divElement.querySelector('i');
            if (iconElement && iconElement.classList.contains('bi-suit-heart')) {
                let updatedPost = await { ...postList[postIndex], likeItems: [...postList[postIndex].likeItems, { friendUserId: user._id }] };
                let updatedPostList = [...postList.slice(0, postIndex), updatedPost, ...postList.slice(postIndex + 1)];
                dispach(setPosts(updatedPostList));
            } else if (iconElement && iconElement.classList.contains('bi-heart-fill')) {
                let likeIndex = await postList[postIndex].likeItems.findIndex((data) => data.friendUserId == user._id);
                let updatedLikeItems = [...postList[postIndex].likeItems.slice(0, likeIndex), ...postList[postIndex].likeItems.slice(likeIndex + 1)];
                let updatedPost = { ...postList[postIndex], likeItems: updatedLikeItems };
                let updatedPostList = [...postList.slice(0, postIndex), updatedPost, ...postList.slice(postIndex + 1)];
                dispach(setPosts(updatedPostList));
            }
        } else {
            toast.error("intenal server error")
        }
    }
    const doLikeDebounced = _.debounce(doLike, 500);

    const handleLikeClick = (postId) => {
        doLikeDebounced(postId);
    }
    // do like


    // view comment
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
    // view comment
    // add comment
    const sendcomment = async (postId) => {
        if (!comment)
            toast.error("please enter comment");
        else {
            try {
                setcomment("")
                let response = await axios.post(api.URL + api.postcomment, { friendUserId: user._id, postId, comment: comment });
                if (response)
                    toast.success("comment posted")

            }
            catch (err) {
                toast.error("intenal server error")
            }
        }
    }
    // add comment

    // save posts
    const savePosts = async (postId) => {
        const divElement = document.getElementById("save" + postId);
        const iconElement = divElement.querySelector('i');
        await axios.post(api.URL + api.savePost, { userId: user._id, postId });
        if (iconElement && iconElement.classList.contains('bi-bookmark')) {
            dispach(savePost({ postId }));
        } else if (iconElement && iconElement.classList.contains('bi-bookmark-fill')) {
            dispach(removePost(user.savePosts.findIndex((item) => item.postId == postId)));
        }
    }
    // save posts

  
    //..........................................
    const videos = document.querySelectorAll('.video');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    videos.forEach(video => {
        observer.observe(video);
    });

    //..................................................
    const newpost = async () => {
        let response = await axios.get("http://localhost:3000/post/getAllPost" + `?page=${page}`);
        let newPostList = response.data.result
        const updatedPostList = [...postList, ...newPostList];
        dispach(setPosts(updatedPostList));
    }

    useEffect(() => {
        (!postList.length) && dispach(fetchPost(page));
        setPage(page + 1);
    }, [])


    return <>

        <Navebar />
        <ToastContainer />
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
                                    <img style={{ cursor: "pointer" }} src={item.friendUserId.profilePhoto ? api.profilepic + item.friendUserId.profilePhoto : avtar} className="PostHeaderProfile ms-2 me-1" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>{item.friendUserId.userName}</div>
                                    <div><span className="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}><span className='ms-1' style={{ color: "black" }}>{item.comment}</span></span></div>
                                </div>
                            </div>)
                                : <div style={{ height: "100%" }} className="d-flex justify-content-center align-items-center"><div ><img width={"100%"} src={nodata} alt="" /></div></div>
                            }
                        </div>
                        <div className=" comment-likeview">
                            <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="ms-4">
                                    <span className="bi bi-chat-right-heart-fill" style={{ color: "#0275d8" }}></span> {postComment?.commentItems.length} comments
                                    
                                </div>
                                <div className="me-4">
                                    <span className="bi bi-balloon-heart-fill" style={{ color: "crimson" }}></span>{postComment?.likeItems.length} likes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* comment modal end*/}
        <div className="d-flex justify-content-center">
            {(isLoading) && <Loader />}
        </div>

        <div className="HomeContainer containerfluid">

            <InfiniteScroll
                className="infinite-scroll"
                dataLength={postList.length}
                next={newpost}
                hasMore={postList.length < totalpost}
                loader={<Loader />}
                endMessage={<p>Data End...</p>}>
                {postList.map((posts, index) =>
                    <div key={index} className="HomeScrollBox">
                        <div className="PostHeader  mt-1">
                            <div className="p-2 d-flex justify-content-center align-items-center ">
                                
                                <div>
                                    <span className="ms-2" style={{ marginTop: "-10px", position: "absolute" }}>{posts.userId.userName}</span>
                                </div>
                            </div>
                            
                        </div>
                        <hr className="HeaderLine mt-1" />
                        <div className="PostBox bg-secondary">
                            {posts.type == "video/mp4" ? <video className="video" loop src={api.file + posts.file} autoPlay="true" /> : <img className="Posts" src={api.file + posts.file} />}

                        </div>
                        <div className="PostFunctionality">
                            {/* dynamic like button */}
                            <div className="" id={"div" + posts._id}>
                                {(postList.length) && posts.likeItems.some((item) => item.friendUserId == user._id)
                                    ? <i onClick={() => { handleLikeClick(posts._id) }} className="bi bi-heart-fill ms-2" style={{ fontSize: '20px', color: "#ea1b3d", cursor: "pointer" }}></i>
                                    : <i onClick={() => { handleLikeClick(posts._id) }} className="bi bi-suit-heart ms-2 test" style={{ fontSize: '20px', color: "#ea1b3d", cursor: "pointer" }}></i>
                                }
                            </div>
                            {/* dynamic like button */}

                            {/* dynamic save button */}
                            <div className="" id={"save" + posts._id}>
                                {user.savePosts.some((item) => item.postId == posts._id)
                                    ? <i onClick={() => { savePosts(posts._id) }} className="bi bi-bookmark-fill me-2 " style={{ fontSize: '20px', color: "rgb(0, 94, 255)", cursor: "pointer" }}></i>
                                    : <i onClick={() => { savePosts(posts._id) }} className="bi bi-bookmark me-2 " style={{ fontSize: '20px', color: "rgb(0, 94, 255)", cursor: "pointer" }}></i>
                                }
                            </div>
                            {/* dynamic save button */}
                        </div>
                        <hr className="HeaderLine mt-1" />

                        {/* like count */}
                        <div style={{ width: "90%", marginTop: "-12px" }}>
                            {posts.likeItems.length}: likes
                        </div>
                        {/* like count */}

                        {/* post caption */}
                        <div style={{ width: "90%", marginTop: "-1px", fontSize: "15px" }}>
                            {posts.caption}
                        </div>
                        {/* post caption */}


                        <div style={{ width: "90%", marginTop: "-5px" }}>
                            <a onClick={() => viewComment(posts._id)} className="ViewComments" style={{ cursor: "pointer", fontWeight: "bold" }} >View all comments</a>
                        </div>

                        {/* add comment */}
                        <div style={{ width: "90%", marginTop: "-5px" }} className="d-flex " >
                            <div style={{ width: "93%" }}>
                                <input onChange={(event) => setcomment(event.target.value)} className="AddComment " value={comment} type="text" placeholder="Add a comment..." />
                            </div>
                            {/* <div className="ShareComment">
                                <button  style={{ outline: "none", border: "none", background: "none" }}><span> <i class="bi bi-emoji-smile"></i></span></button>
                            </div> */}
                            <div className="ShareComment">
                                <button onClick={() => sendcomment(posts._id)} className="" style={{ outline: "none", border: "none", background: "none" }}><i className="bi bi-send-fill"></i></button>
                            </div>
                        </div>
                        {/* add comment */} 

                        <hr className="mt-1 w-100" style={{ border: "1px solid black" }} />
                    </div>
                )}
            </InfiniteScroll>
        </div>

    </>


}


