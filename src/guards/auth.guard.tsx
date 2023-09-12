import { Loader } from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import BaseLayout from "@/layouts/BaseLayout";
import { User, UserRole } from "@/models/user";
import { logout } from "@/store/slices/userSlice";
import storageUtil, { StorageKey } from "@/utils/storage.util";
import { useRouter } from "next/router";
import { useEffect, FC, ReactNode, useState } from "react";
import { useDispatch } from "react-redux";

interface GuardProps {
  children: ReactNode;
}

const AuthGuard: FC<GuardProps> = ({ children }) => {
  const user = storageUtil.getItem<User>(StorageKey.user);
  const passKey = storageUtil.getItem<string>(StorageKey.passKey);

  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setAuthentication] = useState(false);

  const publicRoutes = ["auth"];
  const custodianRoutes = ["root"];
  const betaAccessibleRoutes = ["login"];

  const { authorize } = useAuth();

  useEffect(() => {
    const path = router.asPath.split("?")[0].split("/")[1];

    let access = !!passKey ? authorize(passKey) : false;
    let authenticated = !!user;
    let authorized = true;

    if (publicRoutes.includes(path)) {
      access = true;
      authenticated = true;
    } else {
      // Check if user should be on the site at all
      if (access) {
        // Check if user is on any unauthenticated pages
        if (betaAccessibleRoutes.includes(path)) {
          authenticated = true;
        } else {
          // Check if user is logged in
          if (!authenticated) {
            dispatch<any>(logout(router));
          }

          if (
            user?.role !== UserRole.CUSTODIAN &&
            custodianRoutes.includes(path)
          ) {
            authorized = false;
          }
        }
      } else {
        router.push("/auth");
      }
    }

    setAuthentication(access && authenticated && authorized);
  }, [router.asPath]);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <BaseLayout>
      <Loader fullScreen={true} />
    </BaseLayout>
  );
};

export default AuthGuard;
