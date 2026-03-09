import { Routes, Route } from "react-router-dom";
import LandingPortal from "./LandingPortal";
import ChronicCareAgent from "./ChronicCareAgent";
import PatientCareAgent from "./PatientCareAgent";

export default function App(){

return(

<Routes>

<Route path="/" element={<LandingPortal/>} />

<Route path="/doctor" element={<ChronicCareAgent/>} />

<Route path="/patient" element={<PatientCareAgent/>} />

</Routes>

)

}