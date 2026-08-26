import quickchat from "/chat.png";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

const CreateQR = ({ session }) => {
  return (
    // this is the main container for the QR and step of login
    <div className="bg-white w-fit mx-5 mt-2 rounded-xl px-10 flex flex-col-reverse gap-5 justify-center items-center py-10 md:flex-row md:gap-10 md:mx-auto md:items-start shadow-xl border-2 border-black ">
      <ol className="flex-1 pt-3">

        <h3 className="text-xl font-bold my-4"> Instruction for Login </h3>

        <li>
          <b>1.</b> Scan the QR Code with your phone camera{" "}
        </li>
        <li className="flex items-center gap-1">
          <b>2.</b> Tap the link to open
          <b>QuickChat </b>
          <img className="w-6 h-6" src={quickchat} alt="" />
        </li>
        <li>
          <b>3.</b> Scan the QR code again to link to your account{" "}
        </li>

        <li className="pt-3">
          <Link className="underline text-blue-500 font-bold" to="/login-help">
            {" "}
            Need Help?{" "}
          </Link>
        </li>

        <li className="pt-1 flex gap-1">
          Don't have an account
          <Link className="underline text-blue-500 font-bold" to="/auth/signup">
            create one
          </Link>
        </li>
      </ol>

      <div>
        {/* This is the QR code */}
        <QRCodeSVG value={session} size={250} />
        <p className="text-2xl text-center pt-3"> Scan to login </p>
      </div>
    </div>
  );
};

export default CreateQR;
