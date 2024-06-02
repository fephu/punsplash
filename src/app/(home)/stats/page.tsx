import { encodeImage } from "@/lib/encode";
import Image from "next/image";

const Page = async () => {
  const url = await encodeImage(
    "https://images.unsplash.com/photo-1711998059898-67072ebd396a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  console.log("Url la", url);
  return <div>hello</div>;
};

export default Page;
