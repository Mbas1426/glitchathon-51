import { useState } from "react";
import ChronicCareAgent from "./ChronicCareAgent";
import PatientCareAgent from "./PatientCareAgent";
import { useNavigate } from "react-router-dom";

export default function LandingPortal(){

  const navigate = useNavigate();
  
  return(
  
  <div style={styles.root}>
  
  <div style={styles.container}>
  
  <h1 style={styles.title}>
  Chronic Care Management
  </h1>
  
  <p style={styles.subtitle}>
  Select your portal
  </p>
  
  <div style={styles.portalGrid}>
  
  <div
  style={styles.portalCard}
  onClick={()=>navigate("/doctor")}
  >
  
  <div style={styles.icon}>🩺</div>
  
  <h3>Doctor Portal</h3>
  
  <p>
  Monitor chronic patients, manage outreach,
  and track care gaps.
  </p>
  
  </div>
  
  
  <div
  style={styles.portalCard}
  onClick={()=>navigate("/patient")}
  >
  
  <div style={styles.icon}>👤</div>
  
  <h3>Patient Portal</h3>
  
  <p>
  View test results, receive messages,
  and communicate with your physician.
  </p>
  
  </div>
  
  </div>
  
  </div>
  
  </div>
  
  )
  
  }

const styles = {

root:{
  width:"100vw",
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#ffffff",
  fontFamily:"JetBrains Mono, monospace"
},

container:{
  textAlign:"center",
  maxWidth:900,
  width:"90%"
},

title:{
  fontSize:42,
  marginBottom:10
},

subtitle:{
  color:"#666",
  marginBottom:50
},

portalGrid:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:40
},

portalCard:{
  padding:40,
  borderRadius:12,
  border:"1px solid #e5e5e5",
  cursor:"pointer",
  transition:"all 0.25s ease",
  background:"#fafafa",
  textAlign:"center"
},

icon:{
  fontSize:40,
  marginBottom:10
}

};