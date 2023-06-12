import Image from "next/image";
import Button from "./Button";

type EmptyStateProps = {
  message: string;
  image?: string;
  actionText?: string;
  onClick?: () => void;
};

const EmptyState = ({
  message,
  image,
  actionText,
  onClick,
}: EmptyStateProps) => {
  return (
    <div className="h-full min-h-[400px] grid place-items-center">
      <div className="flex flex-col items-center space-y-6 max-w-[250px] w-full">
        <div className="w-40 h-40 relative">
          <Image
            src={image ? image : "/illustrations/whirl.svg"}
            fill
            sizes="100%"
            alt="Empty state image"
          />
        </div>
        <p className="text-center">{message}</p>
        {actionText && <Button onClick={onClick}>{actionText}</Button>}
      </div>
    </div>
  );
};

export default EmptyState;
