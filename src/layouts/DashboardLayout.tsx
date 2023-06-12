import Head from "next/head";
import { ReactNode, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import routes from "@/constants/routes";
import useNetwork from "@/hooks/useNetwork";
import { Icon } from "@iconify/react";
import { useModal } from "@/components/ModalManager";
import TransactionModal from "@/components/modals/TransactionModal";
import { fetchBudgets } from "@/store/slices/budgetsSlice";
import { fetchAccounts } from "@/store/slices/accountsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import CategoryModal from "@/components/modals/CategoryModal";
import useDispatcher from "@/hooks/useDispatcher";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { selectUser } from "@/store/slices/userSlice";

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

  useEffect(() => {
    dispatcher(fetchBudgets(user!.id));
    dispatcher(fetchAccounts(user!.id));
    dispatcher(fetchCategories());
  }, [user]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
      </Head>
      <div
        onClick={() => showModal(<CategoryModal />)}
        className="mobile-hidden fixed bottom-5 right-24 !grid place-items-center cursor-pointer bg-primary text-white rounded-full w-14 h-14"
      >
        <Icon width={28} icon="solar:folder-favourite-bookmark-bold-duotone" />
      </div>
      <div
        onClick={() => showModal(<TransactionModal />)}
        className="mobile-hidden fixed bottom-5 right-5 !grid place-items-center cursor-pointer bg-primary text-white rounded-full w-14 h-14"
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
            isOffline ? "h-[77vh]" : "h-[92vh]"
          } lg:h-screen overflow-hidden`}
        >
          <div className="grid lg:grid-cols-12 h-full w-full">
            <aside className="lg:col-span-2 px-4 space-y-6 mobile-hidden bg-secondary">
              <Navigation routes={routes} />
            </aside>
            <div className="lg:col-span-10 h-[92vh] lg:h-screen">
              <Header />
              <div className="px-6 pb-20 lg:px-8 lg:pb-0 h-full lg:h-[92vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="w-screen h-[8vh] bg-background desktop-hidden px-6 flex items-center">
          <div className="bg-white rounded-lg w-full mx-auto flex items-center px-4 py-2">
            <Navigation routes={routes} mobile={true} />
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
