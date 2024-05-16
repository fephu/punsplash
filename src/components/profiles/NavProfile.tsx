"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ReactNode } from "react";

interface NavProfileProps {
  title: string;
  chilren: ReactNode;
  isSelected: boolean;
  url: string;
}

const NavProfile = ({ title, chilren, isSelected, url }: NavProfileProps) => {
  return (
    <Link
      href={url}
      className={buttonVariants({
        variant: "ghost",
        className: isSelected
          ? "rounded-b-none border-b-2 border-gray-700"
          : "",
      })}
    >
      {chilren}
      {title}
    </Link>
  );
};

export default NavProfile;
