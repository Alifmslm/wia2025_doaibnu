import RegisterPage from "../ui/page/RegisterPage.tsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../ui/page/LoginPage.tsx";
import HomePage from "../ui/page/HomePage.tsx";
import DetailPage from "../ui/page/DetailPage.tsx";
import GalleryPage from "../ui/page/GalleryPage.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/detail-page" element={<DetailPage />} />
            <Route path="/gallery-page-" element={<GalleryPage />} />
        </Routes>
    );
}

export default AppRoutes;
