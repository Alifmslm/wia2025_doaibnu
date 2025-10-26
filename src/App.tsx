import './style/App.css'
import RegisterPage from './page/RegisterPage.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './page/LoginPage.tsx';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<RegisterPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
