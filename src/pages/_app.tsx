import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { store, persistor } from "@/store/store";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer } from "react-toastify";

import BaseLayout from "@/layouts/BaseLayout";

import ModalManager from "@/components/ModalManager";

import "@/styles/globals.css";
import { outfit, inter } from "@/utils/font.util";
import "react-toastify/dist/ReactToastify.css";
import AuthGuard from "@/guards/auth.guard";
import { PersistGate } from "redux-persist/integration/react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --outfit-font: ${inter.style.fontFamily};
            --inter-font: ${outfit.style.fontFamily};
          }
        `}
      </style>
      <ToastContainer />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthGuard>
            <ModalManager>
              {getLayout(<Component {...pageProps} />)}
            </ModalManager>
          </AuthGuard>
        </PersistGate>
      </Provider>
    </>
  );
}
