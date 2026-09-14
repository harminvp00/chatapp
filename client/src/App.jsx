import { Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/auth/Register.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { PublicRoute } from "./components/common/PublicRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Loader } from "./components/common/Elements.jsx";

/* this App.jsx is main controller of this application, it contain all neccessary information about all function and routing structure */
function App() {
  const { user, loading } = useAuth();

  if(loading){
    return <Loader/>
  }

  return (
    <div className="h-screen w-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute user={user} />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/*  Private Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
