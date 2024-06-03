import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Editor from "@/components/blog/Editor";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-start gap-6 w-full">
        {/* heading */}
        <div className="border-b border-gray-200 pb-5">
          <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
            <h3 className="ml-2 mt-2 text-3xl font-semibold leading-6 text-gray-900">
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
