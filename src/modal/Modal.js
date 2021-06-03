import { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";

const Modal = ({ show, animate, children }) => {

  useEffect(() => {
    animate.current = false;
  }, [animate]);

  const Overlay = animate.current ? Overlay1 : Overlay2;

  return !show ? null :ReactDOM.createPortal(
    <Overlay>
      <Dialog>
        {children}
      </Dialog>
    </Overlay>,
    document.getElementById('modal')
  );
}

const fadeIn = keyframes`from { opacity: 0; }`;

const Overlay1 = styled.div`
  animation: ${fadeIn} 500ms ease-out;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const Overlay2 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const Dialog = styled.div`
  background: white;
  border-radius: 5px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;

export default Modal;