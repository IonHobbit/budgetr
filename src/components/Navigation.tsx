import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Route } from "@/constants/routes";
import ResizedImage from "./ResizedImage";
import CategoryModal from "./modals/CategoryModal";
import TransactionModal from "./modals/TransactionModal";
import { useModal } from "./ModalManager";
import IssueModal from "./modals/IssueModal";

type NavigationProps = {
  mobile?: boolean;
  routes: Route[];
};

const Navigation: React.FC<NavigationProps> = ({ mobile, routes }) => {
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState("");
  const activeClasses = "bg-white font-semibold";

  const { showModal } = useModal();
  useEffect(() => {
    const route = router.asPath.split("?")[0];
    setCurrentRoute(route);
  }, [router.asPath]);

  return (
    <div
      className={`${
        mobile
          ? "flex items-center w-full justify-between text-primary"
          : "space-y-4 flex flex-col h-screen relative"
      }`}
    >
      <Link href="/" className="mobile-hidden">
        <ResizedImage
          src="/budgetr-logo-alt.png"
          alt="Budgetr Logo"
          className="w-32 xl:w-44 mx-auto"
        />
      </Link>
      {routes.map(({ url, icon, name }: Route, index: number) => {
        return (
          <Link
            href={url}
            key={index}
            className={`flex items-center font-header text-text rounded transition-all lg:hover:bg-white
            ${mobile ? "p-2" : "p-4 py-3 space-x-3"}
            ${
              currentRoute === url &&
              (mobile ? "bg-primary text-white" : activeClasses)
            }`}
          >
            <Icon icon={icon} width={mobile ? 24 : 20} />
            {!mobile && (
              <p className={`${currentRoute !== url && "text-bay-leaf"}`}>
                {name}
              </p>
            )}
          </Link>
        );
      })}
      {mobile && (
        <>
          <div
            onClick={() => showModal(<IssueModal />)}
            className="grid place-items-center cursor-pointer p-2"
          >
            <Icon width={24} icon="solar:chat-line-bold-duotone" />
          </div>
          <div
            onClick={() => showModal(<TransactionModal />)}
            className="grid place-items-center cursor-pointer p-2"
          >
            <Icon width={24} icon="solar:notes-bold-duotone" />
          </div>
        </>
      )}
      <div
        className="absolute bottom-5 w-full items-center font-header text-white rounded transition-all bg-primary p-4 py-3 space-x-3 cursor-pointer mobile-hidden lg:!flex"
        onClick={() => showModal(<IssueModal />)}
      >
        <Icon icon="solar:chat-line-bold-duotone" width={20} />
        <p>Give Feedback</p>
      </div>
    </div>
  );
};

export default Navigation;
