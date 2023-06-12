import React, { ReactElement } from "react";
import { LayoutProps } from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/pages/_app";
import BaseLayout from "@/layouts/BaseLayout";

const useLayout = <P extends {}>(
  Layout: React.FC<LayoutProps> = BaseLayout,
  WrappedComponent: NextPageWithLayout<P>,
  pageName?: string
) => {
  return (WrappedComponent.getLayout = function getLayout(page: ReactElement) {
    return <Layout pageName={pageName}>{page}</Layout>;
  });
};

export default useLayout;
