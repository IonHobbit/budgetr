import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NextPageWithLayout } from "./_app";
import { RootState } from "@/store/rootReducer";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import helperUtil from "@/utils/helper.util";
import { TRANSACTION_TYPES } from "@/constants/constants";

import Table from "@/components/Table";
import EmptyState from "@/components/EmptyState";

import {
  selectUsers,
  selectUsersLoading,
  subscribeToUsers,
} from "@/store/slices/usersSlice";
import useDispatcher from "@/hooks/useDispatcher";
import StatisticCard from "@/components/cards/StatisticCard";
import { Loader } from "@/components/Loader";

const RootPage: NextPageWithLayout = () => {
  const users = useSelector((state: RootState) => selectUsers(state));
  const loading = useSelector((state: RootState) => selectUsersLoading(state));

  const [selectedType, setSelectedType] = useState(TRANSACTION_TYPES[0]);

  const disptacher = useDispatcher();

  const userList = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        helperUtil.timestampToDateConverter(b.timestamp).getTime() -
        helperUtil.timestampToDateConverter(a.timestamp).getTime()
    );
  }, [users]);

  useEffect(() => {
    disptacher(subscribeToUsers());
  }, []);

  return (
    <>
      <div className="py-6 space-y-6 h-full overflow-y-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
          <StatisticCard
            title="Total Users"
            statistic={users.length}
            icon="solar:user-bold-duotone"
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {users.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                  <div className={`col-span-7 overflow-x-auto`}>
                    <Table
                      className="overflow-hidden"
                      data={userList}
                      arrange={["firstName", "lastName", "email", "timestamp"]}
                      emptyMessage="No users found"
                    />
                  </div>
                </div>
              </>
            ) : (
              <EmptyState message="No users found" />
            )}
          </>
        )}
      </div>
    </>
  );
};

useLayout(DashboardLayout, RootPage, "Root");

export default RootPage;
