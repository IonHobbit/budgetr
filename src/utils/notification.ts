import { ToastOptions, toast } from 'react-toastify';

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}

const info = (message: string, options?: ToastOptions): void => {
  toast.info(message, { ...toastConfig, ...options })
}

const success = (message: string, options?: ToastOptions): void => {
  toast.success(message, { ...toastConfig, ...options })
}

const error = (message: string, options?: ToastOptions): void => {
  toast.error(message, { ...toastConfig, ...options })
}

const warning = (message: string, options?: ToastOptions): void => {
  toast.warning(message, { ...toastConfig, ...options })
}

export default { info, success, error, warning }