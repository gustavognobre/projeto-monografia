"use client";

import { Button } from "@//components/ui/button";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const Social = () => {
  return (
    <div className=" flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FaFacebook className="w-5 h-5" />
      </Button>
    </div>
  );
};
