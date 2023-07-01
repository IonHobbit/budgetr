import ReactDOM from "react-dom";
import React, { ReactNode, useMemo } from "react";
import { useModal } from "./ModalManager";

type ModalProps = {
  spacing?: boolean;
  padded?: boolean;
  children: ReactNode;
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  position?: "top" | "middle" | "bottom";
};

const Modal: React.FC<ModalProps> = (props) => {
  const {
    padded = true,
    size = "x-small",
    spacing,
    position = "middle",
  } = props;
  const { hideModal } = useModal();

  const injectedClasses = useMemo(() => {
    const classes = ["bg-white rounded-lg shadow-md transition-all"];

    padded ? classes.push("p-6") : null;
    spacing ? classes.push("space-y-4") : null;

    switch (size) {
      case "x-small":
        classes.push("w-[320px] xs:w-[360px] sm:w-[340px]");
        break;
      case "small":
        classes.push("w-[320px] xs:w-[360px] sm:w-[448px]");
        break;
      case "medium":
        classes.push("w-[320px] xs:w-[360px] lg:w-[640px]");
        break;
      case "large":
        classes.push("w-[320px] xs:w-[360px] lg:w-[768px]");
        break;
      case "x-large":
        classes.push("w-[320px] xs:w-[360px] lg:w-[896px]");
        break;
    }

    return classes.sort().join().replaceAll(",", " ");
  }, [padded, size]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
      <div
        className="w-screen h-screen bg-black bg-opacity-50 fixed"
        onClick={hideModal}
      />
      <div className="absolute mt-20 lg:mt-0">
        <div className={injectedClasses}>{props.children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
