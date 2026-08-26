
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthScreen } from "./Auth/pages/AuthScreen.jsx";
import { Register } from "./Auth/pages/Register.jsx";
import Needhelp from './Auth/components/Needhelp.jsx';
import { LoginMethods } from './Auth/components/LoginMethods.jsx';
/* this App.jsx is main controller of this application, it contain all neccessary information about all function and routing structure */
function App() {
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
      <Routes>
        /auth/singin
        <Route path="/" element={<AuthScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-help" element={<Needhelp />} />
        <Route path="/auth/signup" element={<LoginMethods />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;

