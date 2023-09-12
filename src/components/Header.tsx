import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/store/slices/userSlice";
import { useMemo, useReducer } from "react";
import { RootState } from "@/store/rootReducer";
import { Icon } from "@iconify/react";
import { useDetectClickOutside } from "react-detect-click-outside";
import Notifications from "./Notifications";

type HeaderState = {
  notificationsPopup?: boolean;
};

const Header = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const notifications = [];

  const [state, updateState] = useReducer(
    (prev: HeaderState, next: HeaderState) => ({ ...prev, ...next }),
    { notificationsPopup: false }
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const pageName = useMemo(() => {
    return router.asPath.split("/")[1];
  }, [router.asPath]);

  const logoutUser = () => {
    dispatch<any>(logout(router));
  };

  const notificationPopupRef = useDetectClickOutside({
    onTriggered: () => updateState({ notificationsPopup: false }),
  });

  return (
    <nav className="h-[8vh] w-full flex items-center bg-background py-3 px-6 lg:px-8 border-b border-secondary">
      <div className="flex w-full items-center justify-between">
        <h3 className="capitalize">{!!pageName ? pageName : "Dashboard"}</h3>
        <div className="flex items-center space-x-3">
          <Notifications />
          <p className="text-sm">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs cursor-pointer" onClick={logoutUser}>
            Logout
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Header;
