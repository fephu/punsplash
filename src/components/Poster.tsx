"use client";

import Image from "next/image";
import Link from "next/link";

const Poster = () => {
  return (
    <Link href={"/pricing"} className="relative w-[280px] h-[280px]">
      <Image
        src={`/download.jpg`}
        fill
        alt="Poster image"
        className="object-cover rounded-lg absolute opacity-100"
      />

      <div className="absolute bottom-4 left-4">
        <span className="text-white font-semibold flex flex-col">
          <span className="text-sm">Discover Punsplash+</span>
          <span className="text-xl tracking-wide">Unlimited downloads.</span>
          <span className="text-xl tracking-wide">Full legal protections.</span>
          <span className="text-xl tracking-wide">No ads.</span>
        </span>
      </div>
    </Link>
  );
};

export default Poster;
