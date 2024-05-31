"use client";

import { useEffect } from "react";
import Intro from "./Intro";
import Lenis from "lenis";
import Description from "./Description";
import Section from "./Section";
import Top from "./Top";
import BlogCard from "./BlogCard";

const HomeBlog = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <main>
      <Intro />
      <Description />
      <Section />
      <div className="h-screen p-2 py-10 md:p-20">
        <BlogCard />
      </div>
    </main>
  );
};

export default HomeBlog;
