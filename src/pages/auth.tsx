import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useAuth from "@/hooks/useAuth";

import Button from "@/components/Button";
import OTPInput from "@/components/OTPInput";

import storageUtil, { StorageKey } from "@/utils/storage.util";

const LoginPage = () => {
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState({
    success: false,
    data: false,
  });

  const router = useRouter();
  const { login } = useAuth();

  const updateAttempt = (field: string, value: boolean) => {
    setAttempted((data) => ({ ...data, data: true, [field]: value }));
  };

  const submitForm = async () => {
    if (loading || passCode.length < 5) return;

    setLoading(true);
    const response = await login(passCode);
    if (response) {
      updateAttempt("success", true);
    } else {
      updateAttempt("success", false);
      setTimeout(() => {
        updateAttempt("data", false);
      }, 3000);
    }
    setPassCode("");
    setLoading(false);
  };

  useEffect(() => {
    if (storageUtil.getItem(StorageKey.passKey)) {
      if (storageUtil.getItem(StorageKey.user)) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }, []);

  return (
    <div className="max-w-5xl px-6 mx-auto h-screen pt-10 pb-6">
      <div className="grid place-items-center h-full">
        <div className="flex flex-col items-center w-full max-w-sm">
          <div className="w-40 h-20 relative">
            <Image
              alt="logo"
              fill={true}
              className="object-contain"
              src="/budgetr-logo-alt.png"
            />
          </div>
          {attempted.data ? (
            <>
              {attempted.success ? (
                <div className="p-8 w-full transition-all bg-secondary text-white text-center border border-primary space-y-4">
                  <h3>WELCOME!</h3>
                  <div className="space-y-2">
                    <p>
                      This is a private test for an application I would like to
                      build out in the future.
                    </p>
                    <p>
                      I would like you to peruse through the application and
                      check out all the functionality. It's a prototype [break
                      it if you like] and I want to see how it tests in user's
                      hands.
                    </p>
                    <p>Any and all feedback is appreciated.</p>
                    <p className="text-xs">
                      note: its a proof of concept, so it is currently missing a
                      few bells and whistles :)
                    </p>
                  </div>
                  <Button onClick={() => router.push("/login")}>
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="p-8 w-full transition-all bg-secondary text-white text-center border border-error space-y-4">
                  <h3>ACCESS DENIED!</h3>
                  <p>
                    You're probably not supposed to be here, but if you think
                    you are..
                  </p>
                  <p>Try again in a few hours</p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
                className="space-y-8"
              >
                <div className="flex flex-col space-y-3">
                  <p className="text-xs text-white">Enter your passcode</p>
                  <OTPInput
                    length={5}
                    onChange={(value) => setPassCode(value)}
                  />
                </div>
                <Button loading={loading}>Enter</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
