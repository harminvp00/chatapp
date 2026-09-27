import { Routes, Route } from "react-router-dom";
import { Register } from "./pages/auth/Register.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Dashboard } from "./pages/user/Dashboard.jsx";
import { Profile } from "./pages/user/Profile.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Loader } from "./components/common/Elements.jsx";
import { OAtuhExist } from "./pages/auth/OAtuhExist.jsx";
import { PasswordVerification } from "./pages/auth/PasswordVerification.jsx";
import { useEffect } from "react";

/* this App.jsx is main controller of this application, it contain all neccessary information about all function and routing structure */
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message={"Fetching user data from server"} />;
  }

  useEffect(() => {}, []);

  return (
    <div className="h-screen w-screen">
      <Routes>
        {!user ? (
          <>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-exists" element={<OAtuhExist />} />
            <Route path="/password-verify" element={<PasswordVerification />} />
          </>
        ) : (
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
