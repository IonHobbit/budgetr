import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectUserNotifications,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "@/store/slices/userSlice";
import { useEffect, useMemo, useReducer } from "react";
import { RootState } from "@/store/rootReducer";
import { Icon } from "@iconify/react";
import { useDetectClickOutside } from "react-detect-click-outside";
import useDispatcher from "@/hooks/useDispatcher";
import { Notification } from "@/models/notification";

type HeaderState = {
  notificationsPopup?: boolean;
};

const Notifications = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const notifications = useSelector((state: RootState) =>
    selectUserNotifications(state)
  );

  const [state, updateState] = useReducer(
    (prev: HeaderState, next: HeaderState) => ({ ...prev, ...next }),
    { notificationsPopup: false }
  );

  const router = useRouter();
  const dispatcher = useDispatcher();

  const notificationPopupRef = useDetectClickOutside({
    onTriggered: () => updateState({ notificationsPopup: false }),
  });

  useEffect(() => {
    dispatcher(subscribeToNotifications());

    return () => {
      dispatcher(unsubscribeFromNotifications());
    };
  }, [user]);

  return (
    <div className="relative" ref={notificationPopupRef}>
      <Icon
        onClick={() =>
          updateState({ notificationsPopup: !state.notificationsPopup })
        }
        className="cursor-pointer w-5 h-5 hover:text-primary"
        icon="solar:bell-bing-bold-duotone"
      />
      {state.notificationsPopup && (
        <div className="absolute z-20 bg-white rounded text-text mt-4 top-full right-0 h-72 w-64 overflow-hidden flex flex-col justify-between">
          {notifications.length > 0 ? (
            <>
              <div className="overflow-y-auto h-56">
                {notifications.map((notification: Notification, index) => (
                  <div
                    key={index}
                    className="cursor-pointer p-3 hover:bg-gray-100"
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-primary">
                      {notification.subject}
                    </p>
                  </div>
                ))}
              </div>
              <div className="h-4 px-3 flex justify-end">
                <p className="text-xs">clear notifications</p>
              </div>
            </>
          ) : (
            <div className="grid place-items-center h-full">
              <div className="flex flex-col items-center space-y-1 text-center">
                <Icon
                  className="w-10 h-10 text-yellow-500"
                  icon="solar:lightbulb-minimalistic-bold-duotone"
                />
                <p className="text-sm font-medium">You too like good thing</p>
                <p className="text-xs">Notifications coming soon sha</p>
                <p className="text-xs">Come here for all app updates</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
