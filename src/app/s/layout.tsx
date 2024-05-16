import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SideBarSearch from "@/components/search/SidebarSearch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  Folder,
  ImageIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideBarSearch />

      {children}

      <MaxWidthWrapper>
        <div className="flex flex-col gap-6 items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <Icons.logo className="w-6 h-6" />
            Make something awesome.
          </div>
          <div className="flex items-center text-sm gap-6">
            <Link href={"/privacy"}>Privacy Policy</Link>
            <Link href={"/privacy"}>Terms</Link>
            <Link href={"/privacy"}>Security</Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
