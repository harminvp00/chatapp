import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthScreen } from "./components/layouts/AuthScreen.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { Login } from "./pages/auth/Login.jsx";
import Needhelp from "./components/auth/Needhelp.jsx";
import { LoginMethods } from "./components/auth/LoginMethods.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

/* this App.jsx is main controller of this application, it contain all neccessary information about all function and routing structure */
function App() {
  const { user, loading} = useAuth();
  if(loading){
    return <div className="h-screen flex items-center justify-center"> Loading... </div>
  }
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<AuthScreen />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/login-help" element={<Needhelp />} />
              <Route path="/auth/signup" element={<LoginMethods />} />
            </>
          ) : (
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
