"use client";

import { useEffect, useRef } from "react";
import Intro from "./Intro";
import Lenis from "lenis";
import Description from "./Description";
import Section from "./Section";
import Top from "./Top";
import BlogCard from "./BlogCard";
import { Blog } from "@prisma/client";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/infinite";
import { Loader2 } from "lucide-react";

interface HomeBlogProps {
  initialBlogs: Blog[];
}

const HomeBlog = ({ initialBlogs }: HomeBlogProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/blogs?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
      const { data } = await axios.get(query);
      return data as Blog[];
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialBlogs], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const blogs = data?.pages.flatMap((page) => page) ?? initialBlogs;

  return (
    <main>
      <Intro />
      <Description />
      <Section />
      <div className="h-screen p-2 py-10 md:p-20">
        {blogs.map((blog: any, index: number) => {
          if (index === blogs.length - 1) {
            // Add a ref to the last post in the list
            return (
              <li key={blog.id} ref={ref}>
                <BlogCard
                  content={blog.content}
                  authorId={blog.authorId ?? ""}
                  title={blog.title}
                  createdAt={blog.createdAt}
                />
              </li>
            );
          } else {
            return (
              <BlogCard
                key={blog.id}
                content={blog.content}
                authorId={blog.authorId ?? ""}
                title={blog.title}
                createdAt={blog.createdAt}
              />
            );
          }
        })}
        {isFetchingNextPage && (
          <li className="flex justify-center">
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </li>
        )}
      </div>
    </main>
  );
};

export default HomeBlog;
