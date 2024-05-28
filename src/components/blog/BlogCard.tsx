import Image from "next/image";
import { Card } from "../ui/card";
import { format } from "date-fns";
import Link from "next/link";

const BlogCard = () => {
  return (
    <Link
      href={"/blog/6-million-images"}
      className="relative bg-white border shadow-md rounded-md flex flex-col w-[30rem] h-[26rem] z-20"
    >
      <div className="relative w-full h-[16rem]">
        <Image
          src={"/images/6-2-2.gif"}
          fill
          alt="Card image"
          className="rounded-t-md"
        />
      </div>
      <div className="flex flex-col justify-between p-4 h-[10rem]">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Blog</span>
          <span className="text-2xl font-semibold">6 Million Images</span>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="font-semibold">Tuan Phu</span>{" "}
          <span className="text-muted-foreground">
            {format(Date.now(), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
