import React,{useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiHeart } from 'react-icons/bi';
import { AiFillHeart } from 'react-icons/ai';

const Favorite = ()=>{
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        alert("Event added to favorites!");
    };

    const handleDislike = () => {
        setIsLiked(!isLiked);
        alert("Event removed from favorites!");
    };
    return (
        <div style={{margin:"20px auto 15px auto", cursor:"pointer"}}>
            {!isLiked && (<BiHeart className="me-2" color="black" style={{backgroundColor:"white", border:"0px", borderRadius:"50%", padding:"7px", width:"40px", height:"auto"}} onClick={handleLike}/>)}
            {isLiked && (<AiFillHeart className="me-2" color="red" style={{backgroundColor:"white", border:"0px", borderRadius:"50%", padding:"7px", width:"40px", height:"auto"}} onClick={handleDislike}/>)}
        </div>
    )
};

export default Favorite;
