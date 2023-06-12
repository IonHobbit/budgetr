import { ReactNode, useMemo } from "react";
import { Loader } from "./Loader";

type Props = {
  variation?: "primary" | "secondary" | "errored" | "google";
  loading?: boolean;
  size?: "x-small" | "small" | "medium";
  fullWidth?: boolean;
  children: ReactNode | string;
  className?: string;
  onClick?: () => void;
};

const Button = (props: Props) => {
  const {
    size = "medium",
    variation = "primary",
    fullWidth = true,
    loading = false,
    className,
    onClick,
  } = props;

  const injectedClasses = useMemo(() => {
    let classes = [
      "uppercase font-header font-semibold flex justify-center items-center space-x-2 transition-all",
    ];
    const googleClasses = [
      "flex items-center space-x-3 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
    ];

    switch (size) {
      case "x-small":
        classes.push("px-4 py-2 text-xs");
        break;
      case "small":
        classes.push("px-4 py-2 text-sm ");
        break;
      case "medium":
        classes.push("px-7 py-3 text-sm ");
        break;
    }

    switch (variation) {
      case "primary":
        classes.push("bg-primary text-white");
        break;
      case "secondary":
        classes.push(
          "border border-primary text-primary hover:bg-primary hover:text-white"
        );
        break;
      case "errored":
        classes.push("bg-error text-white");
        break;
      case "google":
        classes = googleClasses;
        break;
    }

    return classes.join().replaceAll(",", " ");
  }, [variation, size]);

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={
        injectedClasses + ` ${fullWidth ? "w-full" : "w-max"} ` + className
      }
    >
      {loading ? (
        <Loader
          size="small"
          color={variation == "google" ? "primary" : undefined}
        />
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;
