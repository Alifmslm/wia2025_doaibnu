import RegisterPage from "../ui/page/RegisterPage.tsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../ui/page/LoginPage.tsx";
import HomePage from "../ui/page/HomePage.tsx";
import DetailPage from "../ui/page/DetailPage.tsx";
import GalleryPage from "../ui/page/GalleryPage.tsx";
import NotificationPage from "../ui/page/NotificationPage.tsx";
import LandingPage from "../ui/page/LandingPage.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/detail-page/:id" element={<DetailPage />} />
            <Route path="/gallery-page-" element={<GalleryPage />} />
            <Route path="/notification" element={<NotificationPage/>} />
            <Route path="/" element={<LandingPage/>} />
        </Routes>
    );
}

export default AppRoutes;
