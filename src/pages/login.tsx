import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import Input from "@/components/Input";

import notification from "@/utils/notification";

import { GENERIC_ERROR } from "@/constants/errorMessages";

import { FirebaseUser, loginWithGooglePopup } from "@/utils/firebase.util";
import { fetchUser, register } from "./api/user.api";
import useDispatcher from "@/hooks/useDispatcher";
import { setUser } from "@/store/slices/userSlice";
import { User } from "@/models/user";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatcher = useDispatcher();

  const socialAuthentication = async () => {
    setLoading(true);
    try {
      const response = await loginWithGooglePopup();
      if (response) await authenticate(response);
    } catch (error) {
      setLoading(false);
    }
  };

  const authenticate = async (user: FirebaseUser) => {
    try {
      let _userData: User;

      if (user.additionalData.isNewUser) {
        _userData = await register(user);
      } else {
        _userData = await fetchUser(user.data.uid);

        if (!_userData) {
          _userData = await register(user);
        }
      }
      setLoading(false);
      dispatcher(setUser(_userData));
      router.push("/");
    } catch (error) {
      notification.error(
        "There was an issue authenticating you, please try again later"
      );
    }
  };

  return (
    <div className="max-w-5xl px-6 mx-auto h-screen pt-10 pb-6">
      <div className="grid place-items-center h-full">
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="w-40 h-20 relative">
            <Image
              alt="logo"
              fill={true}
              className="object-contain"
              src="/budgetr-logo-alt.png"
            />
          </div>
          <Button
            loading={loading}
            fullWidth={false}
            onClick={socialAuthentication}
            variation="google"
          >
            <div className="w-8 h-8 relative">
              <Image
                fill={true}
                src="/illustrations/google-logo.svg"
                alt="google logo"
              />
            </div>
            <p>Continue with Google</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
