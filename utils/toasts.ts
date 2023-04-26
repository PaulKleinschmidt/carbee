import { toast } from 'react-toastify';

export const errorToast = (text: string) => {
  return toast.error(text, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
  });
};
