import React from "react";
import "./AppLoader.css";


const AppLoader = () => {
  return (
    <section className='app-loader'>
      <div className='bouncing-loader'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <img src= "/textures/UBC_Alternate_reverse_white.png" class="img1" alt="EML logo"/>
        <img src= "/textures/PALSOL-1.2b-Primary-UBC-Shield(white).png" class="img2" alt="AL logo"/>
    </section>
  );
};

export default AppLoader