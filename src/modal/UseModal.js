import { useRef, useState } from "react";
import Modal from "./Modal";

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const animate = useRef(false);

  let modalEl = document.getElementById('modal');
  if (!modalEl) {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      modalEl = document.createElement('div');
      modalEl.setAttribute('id', 'modal');
      rootEl.appendChild(modalEl);
    } else {
      throw new Error('useModal: root element expected, but not found.');
    }
  }
  
  const openModal = () => {
    animate.current = true;
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const modal = ({children}) => {
    return (
      <Modal show={modalOpen} animate={animate} >
        {children}
      </Modal>
    )
  }

  return [modal, openModal, closeModal];
}

export default useModal;