import React, { useState, useContext, useEffect } from "react";
import {
    useNavigate 
  } from "react-router-dom";
  
export default function NavigateforRefreshToken() {
  const navigate = useNavigate();
  // Refresh token
  useEffect(() => {
    setTimeout(() => {
      navigate("/refresh_token");
    }, 10000);
  }, [navigate]);
}
