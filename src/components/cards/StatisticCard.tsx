import { useMemo } from "react";
import { Icon } from "@iconify/react";
import helperUtil from "@/utils/helper.util";

type StatisticCardProps = {
  icon?: string;
  title?: string;
  statistic: number;
};

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon,
  title,
  statistic,
}) => {
  return (
    <div className="bg-secondary p-4 rounded flex flex-col w-full text-white space-y-2">
      <div className="flex items-center justify-between">
        {title && <p className="text-sm">{title}</p>}
        {icon && <Icon width={30} className="text-primary" icon={icon} />}
      </div>
      <div className="flex flex-col justify-center h-full space-y-2">
        <h2>{statistic}</h2>
      </div>
    </div>
  );
};

export default StatisticCard;
