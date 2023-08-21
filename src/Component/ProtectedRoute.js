import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser } from "../redux-conflig/userSlice";

function ProtectedRoute({children}){
    const dispatch = useDispatch();
    // const {token} = useSelector(state=>state.user);
    // if(!token){
    //     return <Navigate to="/signin" replace/>
    // }
    let user = localStorage.getItem("user");
    user=user?JSON.parse(user): null;
    dispatch(setUser(user));
    if(!user) return <Navigate to="/signin" replace/>
    return children;
}
export default ProtectedRoute;
