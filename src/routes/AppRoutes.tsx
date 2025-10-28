import RegisterPage from "../ui/page/RegisterPage.tsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../ui/page/LoginPage.tsx";
import HomePage from "../ui/page/HomePage.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    );
}

export default AppRoutes;
