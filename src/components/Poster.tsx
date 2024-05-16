"use client";

import Image from "next/image";
import Link from "next/link";

const Poster = () => {
  return (
    <Link href={"/pricing"} className="relative w-[280px] h-[280px]">
      <Image
        src={`/boston-public-library-Bgxy4rRsxSM-unsplash.jpg`}
        fill
        alt="Poster image"
        className="object-cover rounded-lg absolute opacity-100"
      />

      <div className="absolute bottom-4 left-4">
        <span className="text-white font-semibold">
          <span className="text-sm">Explore</span>
          <br />
          <span className="text-blue-400 text-2xl tracking-wide">
            Punsplash+
          </span>
        </span>
      </div>
    </Link>
  );
};

export default Poster;
