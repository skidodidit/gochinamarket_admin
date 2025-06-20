import { toast } from 'react-toastify';

export const notifySuccess = (msg: string) => toast.success(msg);
export const notifyError = (msg: string) => toast.error(msg);
export const notifyInfo = (msg: string) => toast.info(msg);
export const notifyWarning = (msg: string) => toast.warning(msg);
