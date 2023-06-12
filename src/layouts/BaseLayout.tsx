import useNetwork from "@/hooks/useNetwork";
import Head from "next/head";
import { ReactNode, useMemo } from "react";

interface LayoutProps {
  children: ReactNode;
  pageName?: any;
}

const BaseLayout: React.FC<LayoutProps> = ({ children, pageName }) => {
  const pageTitle = useMemo(() => {
    if (pageName) return `${pageName} | Budgetr`;
    return "Budgetr";
  }, [pageName]);

  const { isOffline } = useNetwork();

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
      </Head>
      <main
        className={`bg-background min-h-screen w-screen overflow-x-hidden ${
          isOffline && "border-2 border-error overflow-hidden"
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
        {children}
      </main>
    </>
  );
};

export default BaseLayout;
