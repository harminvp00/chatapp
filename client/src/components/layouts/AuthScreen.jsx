
// components 
import CreateQR from "../auth/CreateQR.jsx";
import Header from "../common/Header.jsx";
// Main Auth Screen (first view of any user in this application)
export const AuthScreen = () => {
  return (

    //  this is container for the entire page on the screen
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black/20">

      {/* this is header (contain logo) */}
      <Header />
      
      {/* this component is responsible for generating QR Code */}
      <CreateQR session={"thisisachatapplications"} />

    </div>
  );
};
