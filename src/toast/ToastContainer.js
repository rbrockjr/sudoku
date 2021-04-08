import { createPortal } from "react-dom";
import Toast from "./Toast";
import "./ToastContainer.css";

const ToastContainer = ( {toasts} ) => {
    return createPortal(
        <div className="ToastContainer">
            {toasts.map(({ id, content }) => (
                <Toast key={id} id={id} >
                    {content}
                </Toast>
            ))}
        </div>,
        document.body
    )
}

export default ToastContainer;