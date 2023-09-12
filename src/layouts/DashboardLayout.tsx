import Head from "next/head";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { ReactNode, useEffect, useMemo } from "react";

import { RootState } from "@/store/rootReducer";
import { selectUser, subscribeToUser } from "@/store/slices/userSlice";
import { fetchBudgets } from "@/store/slices/budgetsSlice";
import { fetchAccounts } from "@/store/slices/accountsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";

import useNetwork from "@/hooks/useNetwork";
import useDispatcher from "@/hooks/useDispatcher";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useModal } from "@/components/ModalManager";
import TransactionModal from "@/components/modals/TransactionModal";

import routes, { civilianRoutes } from "@/constants/routes";
import { UserRole } from "@/models/user";

export interface LayoutProps {
  children: ReactNode;
  pageName?: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, pageName }) => {
  const user = useSelector((state: RootState) => selectUser(state));
  const pageTitle = useMemo(() => {
    return `${pageName} | Budgetr`;
  }, [pageName]);

  const dispatcher = useDispatcher();
  const { showModal } = useModal();
  const { isOffline } = useNetwork();

  const accessibleRoutes = useMemo(() => {
    if (user?.role == UserRole.CUSTODIAN) {
      return routes;
    } else {
      return civilianRoutes;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatcher(subscribeToUser());
      dispatcher(fetchBudgets(user!.id));
      dispatcher(fetchAccounts(user!.id));
      dispatcher(fetchCategories(user!.id));
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
      </Head>
      <div
        onClick={() => showModal(<TransactionModal />)}
        className="mobile-hidden lg:!grid fixed bottom-5 right-5 place-items-center cursor-pointer bg-primary text-white rounded-full w-14 h-14"
      >
        <Icon width={28} icon="solar:notes-bold-duotone" />
      </div>
      <main
        className={`${
          isOffline ? "border-2 border-error overflow-hidden" : ""
        }`}
      >
        {isOffline && (
          <div className="bg-error flex justify-center text-white p-1 w-screen">
            <p className="text-sm text-center">
              Offline mode: You're still able to work, and we'll sync everything
              when you're back online.
            </p>
          </div>
        )}
        <div
          className={`bg-background text-white w-screen ${
            isOffline ? "h-[77vh]" : ""
          } h-screen overflow-hidden`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full">
            <aside className="lg:col-span-2 px-4 space-y-6 mobile-hidden bg-secondary">
              <Navigation routes={accessibleRoutes} />
            </aside>
            <div className="lg:col-span-10 h-[92vh] lg:h-screen">
              <Header />
              <div className="px-6 pb-20 lg:px-8 lg:pb-0 h-full lg:h-[92vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="desktop-hidden fixed bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-lg w-[90%] max-w-sm mx-auto flex items-center px-4 py-2">
          <Navigation routes={accessibleRoutes} mobile={true} />
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
