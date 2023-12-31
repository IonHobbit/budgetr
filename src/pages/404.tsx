import Link from "next/link";
import { Icon } from "@iconify/react";

const NotFoundPage = () => {
  return (
    <main className="h-screen w-screen center-content text-white">
      <div className="space-y-6 max-w-sm w-full">
        <h1 className="!text-6xl !font-semibold">404!</h1>
        <div className="space-y-4">
          <h2>lol!</h2>

          <Link
            href="/"
            className="flex items-center group relative cursor-pointer"
          >
            <Icon
              className="absolute transition-all opacity-0 left-4 group-hover:left-0 group-hover:opacity-100"
              icon="mdi:arrow-left"
            />
            <p className="absolute transition-all left-0 group-hover:left-6">
              Go back home
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
