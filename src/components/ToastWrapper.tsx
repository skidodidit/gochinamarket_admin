"use client";

import { ToastContainer } from "react-toastify";
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";

export default function ToastWrapper() {
  return (
    <ToastContainer
      autoClose={3000} 
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      icon={({ type }) => {
        switch (type) {
          case "success":
            return <IoCheckmark color="black" />;
          case "error":
            return <IoMdClose color="white" />;
          default:
            return <IoIosNotificationsOutline color="white" />;
        }
      }}
    />
  );
}
