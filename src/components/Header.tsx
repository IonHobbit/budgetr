import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/store/slices/userSlice";
import { useMemo, useReducer } from "react";
import { RootState } from "@/store/rootReducer";
import { Icon } from "@iconify/react";
import { useDetectClickOutside } from "react-detect-click-outside";

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
          <div className="relative" ref={notificationPopupRef}>
            <Icon
              onClick={() =>
                updateState({ notificationsPopup: !state.notificationsPopup })
              }
              className="cursor-pointer w-5 h-5 hover:text-primary"
              icon="solar:bell-bing-bold-duotone"
            />
            {state.notificationsPopup && (
              <div className="absolute z-20 bg-white rounded p-3 text-text mt-4 top-full right-0 h-60 w-52">
                {notifications.length > 0 ? (
                  <></>
                ) : (
                  <div className="grid place-items-center h-full">
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <Icon
                        className="w-10 h-10 text-yellow-500"
                        icon="solar:lightbulb-minimalistic-bold-duotone"
                      />
                      <p className="text-sm font-medium">
                        You too like good thing
                      </p>
                      <p className="text-xs">Notifications coming soon sha</p>
                      <p className="text-xs">Come here for all app updates</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
