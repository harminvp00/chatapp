import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthScreen } from "./components/layouts/AuthScreen.jsx";
import { Register } from "./pages/auth/Register.jsx";
import Needhelp from "./components/auth/Needhelp.jsx";
import { LoginMethods } from "./components/auth/LoginMethods.jsx";

/* this App.jsx is main controller of this application, it contain all neccessary information about all function and routing structure */
function App() {
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthScreen />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-help" element={<Needhelp />} />
          <Route path="/auth/signup" element={<LoginMethods />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
