import React from "react";
import useMeta from "@/hooks/useMeta";
import helperUtil from "@/utils/helper.util";
import { Icon } from "@iconify/react";

type TableProps = {
  data: any[];
  exclude?: string[];
  className?: string;
  emptyMessage?: string;
  onClick?: (data: any) => void;
};

const Table = ({
  data,
  exclude,
  className,
  emptyMessage,
  onClick,
}: TableProps) => {
  const excludedHeaders = exclude || [];
  const headers =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (header) => !excludedHeaders.includes(header)
        )
      : [];

  const { getCategory, getAccount } = useMeta();

  return (
    <>
      {data.length > 0 ? (
        <table className={`min-w-full divide-y divide-background ${className}`}>
          <thead className="bg-primary text-white">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                >
                  {{
                    receivingAccount: <>Receiving Account</>,
                  }[header] || <>{helperUtil.normalizeCamelCase(header)}</>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-secondary text-white">
            {data.map((row, index) => (
              <React.Fragment key={index}>
                <tr
                  className={onClick && "cursor-pointer"}
                  onClick={() => {
                    if (onClick) onClick(row);
                  }}
                >
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {{
                        amount: (
                          <>
                            {header == "amount" &&
                              helperUtil.currencyConverter(row["amount"])}
                          </>
                        ),
                        projectedIncome: (
                          <>
                            {header == "projectedIncome" &&
                              helperUtil.currencyConverter(
                                row["projectedIncome"]
                              )}
                          </>
                        ),
                        totalExpenditure: (
                          <>
                            {header == "totalExpenditure" &&
                              helperUtil.currencyConverter(
                                row["totalExpenditure"]
                              )}
                          </>
                        ),
                        date: (
                          <>
                            {header == "date" &&
                              helperUtil.readableDateFormatter(
                                helperUtil
                                  .timestampToDateConverter(row[header])
                                  .toDateString()
                              )}
                          </>
                        ),
                        startDate: (
                          <>
                            {helperUtil.readableDateFormatter(row["startDate"])}
                          </>
                        ),
                        endDate: (
                          <>
                            {helperUtil.readableDateFormatter(row["endDate"])}
                          </>
                        ),
                        category: <>{getCategory(row["category"])?.name}</>,
                        type: <div className="capitalize">{row[header]}</div>,
                        account: (
                          <div
                            className="p-1.5 px-3 text-center w-max text-white rounded"
                            style={{
                              backgroundColor: getAccount(row["account"])
                                ?.colorCode,
                            }}
                          >
                            {getAccount(row["account"])?.name}
                          </div>
                        ),
                        receivingAccount: (
                          <div className="flex items-center space-x-6">
                            <Icon
                              className="-ml-6"
                              width={24}
                              icon="solar:arrow-right-line-duotone"
                            />
                            <div
                              className="p-1.5 px-3 text-center w-max text-white rounded"
                              style={{
                                backgroundColor:
                                  getAccount(row["receivingAccount"])
                                    ?.colorCode ?? "#1E1E25",
                              }}
                            >
                              {getAccount(row["receivingAccount"])?.name ??
                                "External"}
                            </div>
                          </div>
                        ),
                      }[header] || <>{row[header]}</>}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={`h-52 grid place-items-center ${className}`}>
          <p>{emptyMessage ?? "Table is empty"} </p>
        </div>
      )}
    </>
  );
};

export default Table;
