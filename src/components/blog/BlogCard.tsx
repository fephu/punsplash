import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { formatTimeToNow } from "@/lib/utils";
import { useRef } from "react";
import EditorOutput from "./EditorOutput";

interface BlogCardProps {
  title: string;
  authorId: string;
  createdAt: Date;
  content: any;
}

const BlogCard = ({ authorId, content, createdAt, title }: BlogCardProps) => {
  const { data: author } = trpc.getUserById.useQuery({ userId: authorId });

  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <Link
      href={"/blog/6-million-images"}
      className="relative bg-white border shadow-md rounded-md flex flex-col w-[29rem] md:w-[30rem] h-[26rem] z-20"
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
          <span className="text-2xl font-semibold">{title}</span>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="font-semibold">Tuan Phu</span>{" "}
          <span className="text-muted-foreground">
            {formatTimeToNow(new Date(createdAt))}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
