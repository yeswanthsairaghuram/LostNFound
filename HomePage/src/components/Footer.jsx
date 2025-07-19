import React from 'react';
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import Logo from '../assets/image.png'
import './Footer.css';

function Footer() {
  return (
    <div className='footer-container'>
      <div className='footer-container-01'>
        <div className='footer-inner1'>
          <div className='footer-logo'>
            <img src={Logo}  width='250px' height='50px'/>
          </div>
          <div className='footer-description'>
            Your central hub for finding lost items and reporting found ones on campus. Let's help each other out!
          </div>
        </div>
        <div className='footer-inner2'>
          <div className='footer-getin-touch'>Get in touch</div>
          <div className='footer-input'>
            <input type="email"  id="" placeholder='Email' className='input-feild'/> 
            <button className='footer-button'>Send</button>
          </div>
          <div className='social-media'>
              <div className='social-media-inner'>
                <div className='media-icon-div'> <FaSquareInstagram color='#ff006e'/></div>
                <div className='media-icon-div'> <FaFacebookSquare color='#0077b6'/></div>
                <div className='media-icon-div'> <FaYoutube color='red'/></div>
                <div className='media-icon-div'><FaSquareXTwitter /></div>
              </div>
          </div>
        </div>
      </div>
      <div className='footer-container-02'></div>
    </div>
  )
}

export default Footer
