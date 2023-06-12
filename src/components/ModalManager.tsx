import React, { useState, useEffect, ReactNode } from "react";

type ModalManangerProps = {
  children: ReactNode;
};

interface ModalContextValue {
  showModal: (modalContent: ReactNode) => void;
  hideModal: () => void;
  hideAllModals: () => void;
}

const ModalContext = React.createContext<ModalContextValue>({
  showModal: () => {},
  hideModal: () => {},
  hideAllModals: () => {},
});

export const useModal = () => {
  return React.useContext(ModalContext);
};

const ModalManager: React.FC<ModalManangerProps> = ({ children }) => {
  const [modals, setModals] = useState<ReactNode[]>([]);

  const showModal = (modalContent: ReactNode) => {
    setModals((prevModals) => [...prevModals, modalContent]);
  };

  const hideModal = () => {
    setModals((prevModals) => prevModals.slice(0, -1));
  };

  const hideAllModals = () => {
    setModals([]);
  };

  useEffect(() => {
    // Add event listener to handle closing of modals when Esc key is pressed
    const handleEscape = (event: KeyboardEvent) => {
      if (event.keyCode === 27 && modals.length > 0) {
        hideAllModals();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modals]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, hideAllModals }}>
      <div>
        {modals.map((modal, index) => (
          <React.Fragment key={index}>{modal}</React.Fragment>
        ))}
      </div>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalManager;
