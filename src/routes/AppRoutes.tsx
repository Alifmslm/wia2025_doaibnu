import RegisterPage from "../page/RegisterPage.tsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default AppRoutes;
