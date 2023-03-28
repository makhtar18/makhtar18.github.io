import React from "react";
const NoResults = ({message="No results available", marginText})=>{
  return (
        <p className="col-8" style={{color:"red", textAlign:"center", borderRadius:"20px", backgroundColor:"white", fontSize:"20px", margin:marginText}}>{message}</p>
  )
};

export default NoResults;