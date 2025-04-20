import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import DoctorDashboard from "./pages/DoctorDashboard";
import FrontDeskDashboard from "./pages/FrontDeskDashboard.js";
import PatientRegister from './pages/FrontDeskPatientRegister.js'
import FrontDeskPatientDetails from "./pages/FrontDeskPatientDetails.js";
import DataEntryDashboard from "./pages/DataEntryDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorRegister from './pages/DoctorRegister';
import DoctorPatientDetails from './pages/DoctorPatientDetails.js'
import DataEntryRegister from './pages/DataEntryRegister';
import FrontdeskRegister from './pages/FrontdeskRegister';
import DataEntryPatientDetails from './pages/DataEntryPatientDetails.js'
import AdminRegister from './pages/AdminRegister';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/frontdesk/register" element={<FrontdeskRegister />} />
        <Route path="/dataentry/register" element={<DataEntryRegister />} />
        <Route path="/admin/register" element={<AdminRegister />} />

      
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/:patient_id" element={<DoctorPatientDetails />} />

        <Route path="/dataentry/:patient_id" element={<DataEntryPatientDetails />} />
        <Route path="/dataentry/dashboard" element={<DataEntryDashboard />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/frontdesk/dashboard" element={<FrontDeskDashboard />} />
        <Route path="/frontdesk/dashboard/register" element={<PatientRegister />} />
        <Route path="/frontdesk/:patient_id" element={<FrontDeskPatientDetails />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
