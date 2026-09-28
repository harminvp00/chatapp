
import { Loader } from "../../components/common/Elements";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/common/Navbar";

export const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Please waits 2 min while we fetching details" />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar/>
    </div>
  );
};
