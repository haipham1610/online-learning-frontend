





import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// 📦 Pages
import Auth from "./pages/auth/Auth.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ManaCourse from "./pages/admin/ManaCourse.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import Login from "./pages/auth/Login.jsx";
import Otp from "./pages/auth/Otp.jsx";
import Register from "./pages/auth/Register.jsx";

// 🔐 Admin Pages
import DiscountManagement from './components/admin/discounts/DiscountManagement.jsx';
import UserManagement from './pages/admin/UserManagement';
import DashboardPage from "./pages/admin/DashboardPage";
import AdminCommentPage from './pages/admin/AdminCommentPage.jsx';


// 👨‍🎓 User Rating Page
import CourseRatingsManager from "./components/admin/ratings/CourseRatingsManager";

// 🔧 Fake login để test chức năng nhanh
// 🔧 Fake login để test chức năng nhanh
const FakeLogin = ({ role = 'user' }) => {
  useEffect(() => {
    const fakeUser = {
      userId: role === 'admin' ? 'admin-001' : 'U07de5297',
      fullName: role === 'admin' ? 'Admin Test' : 'User Test',
      roles: role === 'admin' ? [1] : [2]  // 1 = Admin, 2 = User
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));

    // ✅ Tạo JWT hợp lệ giả
    const fakePayload = {
      sub: fakeUser.userId,
      role: role,
      exp: Math.floor(Date.now() / 1000) + 3600  // +1h
    };
    const base64 = (obj) => btoa(JSON.stringify(obj));
    const fakeToken = `${base64({ alg: "HS256", typ: "JWT" })}.${base64(fakePayload)}.signature`;

    localStorage.setItem("token", fakeToken); // ✅ Lưu token giả đúng định dạng JWT
  }, [role]);

  return null;
};


// 🔐 Route guards
const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && Array.isArray(user.roles) && user.roles.includes(1);
  return isAdmin ? children : <Navigate to="/login" />;
};

const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  return user && token ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <BrowserRouter>
      {/* 🧪 Fake login - đổi 'user' ↔ 'admin' để test */}
      <FakeLogin role="admin" />

      {/* Global toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#10b981' } },
          error: { style: { background: '#ef4444' } },
        }}
      />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courseDetail" element={<CourseDetails />} />

        {/* 👨‍🎓 Học viên đánh giá khóa học */}
        <Route path="/ratings/:courseId" element={
          <RequireAuth>
            <CourseRatingsManager />
          </RequireAuth>
        } />


        {/* 👑 Admin Pages */}
        <Route path="/admin/discounts" element={<RequireAdmin><DiscountManagement /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
        <Route path="/admin/dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>} />
        <Route path="/admin/comments" element={<RequireAdmin><AdminCommentPage /></RequireAdmin>} />


        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/manaCourse" element={<ManaCourse />} />
        <Route path="/manaCourses/add" element={<AddCourse />} />
        <Route path="/manaCourses/edit/:id" element={<EditCourse />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
