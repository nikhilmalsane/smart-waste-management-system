import { Routes, Route } from "react-router-dom"
import Splash from "./pages/Splash.jsx"
import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register.jsx"
import ProtectedRoutes from "./components/ProtectedRoutes.jsx"

import AdminDashboard from "./pages/admin/Dashboard.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"
import ManageBins from "./pages/admin/ManageBins.jsx"
import ManageStaff from "./pages/admin/ManageStaff.jsx"
import AssignStaff from "./pages/admin/AssignStaff.jsx"
import CollectionHistory from "./pages/admin/CollectionHistory.jsx"
import OfflineRequest from "./pages/admin/OfflineRequest.jsx"
import StaffApprovals from "./pages/admin/StaffApprovals.jsx"
import Leaderboard from "./pages/admin/Leaderboard.jsx"
import MapView from "./pages/admin/MapView.jsx"

import StaffDashboard from "./pages/staff/Dashboard.jsx"
import StaffLayout from "./layouts/StaffLayout.jsx"
import MyAssignedBins from "./pages/staff/MyAssignedBins.jsx"
import MyCollections from "./pages/staff/MyCollections.jsx"
import RequestOffline from "./pages/staff/RequestOffline.jsx"
import Notification from "./pages/staff/Notification.jsx"
import StaffMap from "./pages/staff/StaffMAp.jsx"
import Profile from "./pages/staff/Profile.jsx"

function App() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 

            <Route path="/admin"
              element={
                <ProtectedRoutes role="admin" >
                  <AdminLayout />
                </ProtectedRoutes>} >
                   <Route index element={<AdminDashboard />} />
                   <Route path="manage-bins" element={<ManageBins />} />
                   <Route path="manage-staff" element={<ManageStaff />} />
                   <Route path="assign-staff" element={<AssignStaff />} />
                   <Route path="collection-history" element={<CollectionHistory />} />
                   <Route path="offline-requests" element={<OfflineRequest />} />
                   <Route path="staff-approvals" element={<StaffApprovals />} />
                   <Route path="leaderboard" element={<Leaderboard />} />
                   <Route path="map-view" element={<MapView />} />
            </Route>
      
            <Route path="/staff"
              element={
                <ProtectedRoutes role="staff" >
                  <StaffLayout />
                </ProtectedRoutes>} >
                    <Route path="dashboard" element={<StaffDashboard />} />
                    <Route path="assigned-bins" element={<MyAssignedBins />} />
                    <Route path="collections" element={<MyCollections />} />
                    <Route path="request-offline" element={<RequestOffline />} />
                    <Route path="notifications" element={<Notification />} />
                    <Route path="map" element={<StaffMap />} />
                    <Route path="profile" element={<Profile />} />
                  
            </Route>
            
        </Routes>
    </div>
  )
}

export default App