import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "@/components/Button";

const YVYRandomizerPage = () => {
  const [numbers, setNumbers] = useState({ one: 1, two: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  const randomize = async () => {
    const one = Math.random() * 6;
    const two = Math.random() * 6;

    setNumbers({ one, two });
  };

  const randomizeOne = async () => {
    const one = Math.random() * 6;
    const two = Math.random() * 6;

    setNumbers({ one, two: 0 });
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
          <div className="w-full bg-white p-8">
            <div className="space-y-8 text-center">
              <h2>yvy Randomizer</h2>

              <div className="flex justify-around">
                <div className="text-secondary space-y-1">
                  <p>{Math.ceil(numbers.one)}</p>
                  <p className="text-xs">Die 1</p>
                </div>
                <div className="text-secondary space-y-1">
                  <p>{Math.ceil(numbers.two)}</p>
                  <p className="text-xs">Die 2</p>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <Button onClick={randomizeOne} className="truncate">
                  Only One
                </Button>
                <Button onClick={randomize}> Randomize</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YVYRandomizerPage;
