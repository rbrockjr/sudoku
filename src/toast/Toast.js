import './Toast.css';
import { useEffect } from 'react';
import { useToast } from './Toaster';

const Toast = ({ children, id }) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, [id, removeToast]);

    return (
        <div className="Toast">{children}</div>
    )

}

export default Toast;