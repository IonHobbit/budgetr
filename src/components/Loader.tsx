import { COLORS } from "@/constants/constants";
import { useMemo } from "react";
import LoadingIcons from "react-loading-icons";

type Props = {
  size?: "small" | "medium" | "large";
  color?: "primary";
  fullScreen?: boolean;
};

export const Loader = (props: Props) => {
  const injectedClasses = useMemo(() => {
    const classes = [];
    let stroke = "";
    switch (props.size) {
      case "small":
        classes.push("w-5 h-5");
        break;
      case "medium":
        classes.push("w-7 h-7");
        break;
      case "large":
        classes.push("w-10 h-10");
        break;
      default:
        classes.push("w-5 h-5");
        break;
    }
    return classes.join().replaceAll(",", " ");
  }, [props.size]);

  const injectedColor = useMemo(() => {
    let color = "";
    switch (props.color) {
      case "primary":
        color = COLORS.primary;
        break;
      default:
        color = COLORS.white;
        break;
    }
    return color;
  }, [props.color]);

  return (
    <div
      className={`${
        props.fullScreen ? "h-screen w-screen grid place-items-center" : ""
      }`}
    >
      <LoadingIcons.TailSpin
        className={injectedClasses}
        stroke={injectedColor}
      />
    </div>
  );
};
