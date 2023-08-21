import { useState } from "react";
import axios from "axios";
import post from '../../poloadicon.png';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export function AddPostModal() {
    const [file, setfile] = useState("");
    const [caption, setcaption] = useState("");
    const [imgpath, setimgpath] = useState(post);
    const [uploadbuttonstatus, setuploadbuttonstatus] = useState(true);
    const [videoPath, setvideoPath] = useState(null);
    const [poststatus,setpoststatus]=useState(true);
    const { user } = useSelector((state) => state.user)
    let date = new Date();
    date = date.getDate() + "/" + ((date.getMonth() * 1) + 1) + "/" + date.getFullYear();

    const uploadbutton = () => {
        setuploadbuttonstatus(true)
        setimgpath(post)
        setpoststatus(true)
        setcaption("")
        setvideoPath("")
    }

    let locationOfYour = "indore";

    const uploadImage = (event) => {
        event.preventDefault();
        let file = event.target.files[0];
        if (file.type.startsWith('image/')) {
            setpoststatus(true)
            setimgpath(URL.createObjectURL(event.target.files[0]));
            setfile(event.target.files[0]);
            setuploadbuttonstatus(false);
        } else if (file.type.startsWith('video/')) {
            setpoststatus(false)
            setvideoPath(URL.createObjectURL(event.target.files[0]));
            setfile(event.target.files[0]);
            setuploadbuttonstatus(false);

        }


    }


    const submitbutton = async (event) => {
        event.preventDefault();
        let url = "http://localhost:3000/post/uploadPost";
        const formdata = new FormData();
        formdata.append('file', file);
        formdata.append('date', date);
        formdata.append('caption', caption);
        formdata.append('userId', user._id);
        formdata.append('locationOfYour', locationOfYour);

        try {
            let response = await axios.post(url, formdata)
            if (response) {
                setimgpath(post);
                setcaption("")
                toast("post uploaded");
                setvideoPath(null)
                setpoststatus(true)
                setuploadbuttonstatus(true)
            }
        } catch (err) {
            toast.error("please select file first")
        }
    }
    return <>
        <div className="modal fade" id="addPostModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" style={{ width: "400px" }}>
                <div className="modal-content">
                    <div className='text-end'>
                        <button onClick={uploadbutton} type="button" className="btn-close m-2" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    <div className="text-center">
                        <label htmlFor="file-input">
                        {/* <img style={{ height: "250px", width: "100%" }} src={imgpath} /> */}
                           {poststatus ?<img style={{ height: "250px", width: "100%" }} src={imgpath} />:
                            <video style={{width:'100%',height: "250px"}} loop src={videoPath} autoPlay="true" />}
                            <br></br><br></br>
                        </label>

                    </div>
                    <div className='text-center'>
                        <form onSubmit={submitbutton}>
                            <textarea style={{ width: "80%" }} onChange={(event) => setcaption(event.target.value)} value={caption} className="m-2" placeholder="enter caption" />
                            <input multiple="" accept='image/jpeg,image/png,video/mp4' onChange={uploadImage} name="file" style={{ display: "none" }} id="file-input" type="file" /><br />
                            <button disabled={uploadbuttonstatus} className='postuploadbutton' style={{ width: "80%" }} data-bs-dismiss="modal" type="submit">upload</button><br />

                            <br />

                        </form>

                    </div>
                </div>
            </div>
        </div>
    </>
}