import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Editor from "@/components/blog/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user) return notFound();

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-start gap-6 w-full">
        {/* heading */}
        <div className="border-b border-gray-200 pb-5">
          <Link href={"/blog"} className={buttonVariants({ variant: "ghost" })}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Home
          </Link>
          <div className="-ml-2 mt-4 flex flex-wrap items-baseline">
            <h3 className="ml-2 mt-2 text-4xl font-semibold leading-6 text-gray-900">
              Create Blog
            </h3>
          </div>
        </div>

        {/* form */}
        <Editor />

        <div className="w-full flex justify-end">
          <Button type="submit" className="w-full" form="subreddit-post-form">
            Post
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
