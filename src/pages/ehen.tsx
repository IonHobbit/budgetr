import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import useLayout from "@/hooks/useLayout";
import BaseLayout from "@/layouts/BaseLayout";

const AboutPage = () => {
  return (
    <div className="max-w-5xl px-6 mx-auto h-screen pt-10 pb-6">
      <div className="grid place-items-center h-full">
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Icon
                icon="solar:arrow-left-line-duotone"
                className="text-white"
              />
            </Link>
            <div className="w-40 h-20 relative">
              <Image
                alt="logo"
                fill={true}
                className="object-contain"
                src="/budgetr-logo-alt.png"
              />
            </div>
          </div>
          <div className="p-8 w-full transition-all bg-secondary text-white text-center border border-primary space-y-6">
            <h3>EHEN!</h3>
            <div className="space-y-2">
              <p className="text-sm text-primary">what this is</p>
              <p>
                Budgetr is a finance tracking application that provides you with
                tools to seamlessly track income and expenses, categorize
                spending, set budget targets, and generate insightful financial
                reports
                <span className="text-xs text text-primary align-super">
                  [coming soon]
                </span>
                . The goal is to help you gain a deeper understanding of your
                financial habits. With our user-friendly and secure end-to-end
                encrypted platform, you can stay organized, make informed
                decisions, and pave the way to a more financially secure future.
              </p>
              <p className="text-xs">
                note (again): its a proof of concept, so it is currently missing
                a few bells and whistles :)
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                Built with{" "}
                <span className="text-xs text text-primary align-super">
                  [for you nerds]
                </span>
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-20 h-10 relative">
                  <Image
                    alt="Next JS logo"
                    fill={true}
                    className="object-contain"
                    src="/logos/nextjs-logo.png"
                  />
                </div>
                <p>X</p>
                <div className="w-20 h-10 relative">
                  <Image
                    alt="Firebase logo"
                    fill={true}
                    className="object-contain"
                    src="/logos/firebase.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

useLayout(BaseLayout, AboutPage, "Ehen!");

export default AboutPage;
