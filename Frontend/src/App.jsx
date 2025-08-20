import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateProfile from "./pages/CreateProfile";
import ViewProfile from "./pages/ViewProfile";
import Dashboard from "./pages/Dashboard";
import UserPage from "./pages/UserPage";
import MessageBox from "./pages/MessageBox";
import NotificationPanel from "./pages/NotificationPanel";
import AdminDashboard from "./Admin/AdminDashboard";
import JobsPage from "./pages/JobsPage/JobsPage";
import UserProfile from "./Admin/adminPages/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userpage/:id" element={<UserPage />} />
        <Route path="/chat" element={<MessageBox />} />
        <Route path="/notifications" element={<NotificationPanel />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/jobs" element={<JobsPage/>}/>
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
