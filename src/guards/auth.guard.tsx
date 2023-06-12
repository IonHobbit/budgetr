import useAuth from "@/hooks/useAuth";
import { logout, setUser } from "@/store/slices/userSlice";
import storageUtil, { StorageKey } from "@/utils/storage.util";
import { useRouter } from "next/router";
import { useEffect, FC, ReactNode, useState } from "react";
import { useDispatch } from "react-redux";

interface GuardProps {
  children: ReactNode;
}

const AuthGuard: FC<GuardProps> = ({ children }) => {
  const user = storageUtil.getItem(StorageKey.user);
  const passKey = storageUtil.getItem<string>(StorageKey.passKey);

  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setAuthentication] = useState(false);

  const publicPaths = ["auth"];
  const betaAccessiblePaths = ["login"];

  const { authorize } = useAuth();

  useEffect(() => {
    const path = router.asPath.split("?")[0].split("/")[1];

    let access = !!passKey ? authorize(passKey) : false;
    let authenticated = !!user;

    if (publicPaths.includes(path)) {
      access = true;
      authenticated = true;
    } else {
      // Check if user should be on the site at all
      if (access) {
        // Check if user is on any unauthenticated pages
        if (betaAccessiblePaths.includes(path)) {
          authenticated = true;
        } else {
          // Check if user is logged in
          if (!authenticated) {
            dispatch<any>(logout(router));
          }
        }
      } else {
        router.push("/auth");
      }
    }

    setAuthentication(access && authenticated);
  }, [router.asPath]);

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
