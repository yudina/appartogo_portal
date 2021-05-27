import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const successToast = (message, closeDelay) => {
  toast.success(message, {
    position: "top-right",
    autoClose: closeDelay,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const errorToast = (message, closeDelay) => {
  toast.error(message, {
    position: "top-right",
    autoClose: closeDelay,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const infoToast = (message, closeDelay) => {
  toast.info(message, {
    position: "top-center",
    autoClose: closeDelay,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const warningToast = (message, closeDelay) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: closeDelay,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
