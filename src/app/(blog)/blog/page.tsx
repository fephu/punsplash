import HomeBlog from "@/components/blog/HomeBlog";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/infinite";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import { waitForDebugger } from "inspector";

const Page = async () => {
  const session = await getAuthSession();

  const blogs = await db.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });
  return <HomeBlog initialBlogs={blogs} />;
};

export default Page;
