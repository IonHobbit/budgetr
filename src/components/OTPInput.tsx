import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

const OTPInput: React.FC<{
  length: number;
  onChange: (value: string) => void;
}> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<any[]>([]);

  const transformAndEmitChange = (value: string[]) => {
    onChange(value.join("").toLocaleUpperCase());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value !== "") {
      if (index === length - 1) {
        inputRefs.current[index].blur();
      } else {
        inputRefs.current[index + 1].focus();
      }
    }

    transformAndEmitChange(newOtp);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const otpArray = pastedData.slice(0, length).split("");
    const newOtp = [...otp];

    otpArray.forEach((val, index) => {
      newOtp[index] = val;
    });

    setOtp(newOtp);
    transformAndEmitChange(newOtp);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    transformAndEmitChange(otp);
  };

  return (
    <div className="flex justify-between space-x-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="w-12 h-12 text-center border-2 uppercase focus:outline-none focus:border-primary"
        />
      ))}
    </div>
  );
};

export default OTPInput;
