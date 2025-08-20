// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { GoogleOAuthProvider } from "@react-oauth/google";
// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>,
//   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//   <App />
// </GoogleOAuthProvider>
// )


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "871128691459-hehepa30uascg6n8mb4luufmg6o0su9e.apps.googleusercontent.com"; // console se mila hua ID

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

