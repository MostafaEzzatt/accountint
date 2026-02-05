"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Password = ({ children }: { children: React.ReactNode }) => {
  const [unlock, setUnlock] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const currectPassword = "mostafa";

  function handleClick() {
    if (password === currectPassword) {
      setUnlock(true);
      setError("");
    } else {
      setError("Try Again");
    }
  }

  return !unlock ? (
    <div className="absolute inset-0 bg-black flex justify-center items-center">
      <div className="w-2/3">
        <Label className="text-center text-4xl mb-9 mx-auto block font-black text-gray-100">
          Enter Your Passowrd To Be Able To Use This Application
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(i) => setPassword(i.target.value)}
          className="text-center"
        />
        {error ? (
          <span className="text-center w-full block mt-2 text-red-400">
            {error}
          </span>
        ) : (
          <></>
        )}
        <Button
          onClick={() => handleClick()}
          className="w-full mt-6"
          variant={"secondary"}
        >
          Enter
        </Button>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default Password;
