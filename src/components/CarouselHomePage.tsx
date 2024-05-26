import { Collection } from "@prisma/client";
import Poster from "./Poster";
import CardCollections from "./collection/CardCollections";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface CarouselHomePageProps {
  collections: Collection[] | null;
}

const CarouselHomePage = ({ collections }: CarouselHomePageProps) => {
  return (
    <Carousel className="md:hidden mx-8">
      <CarouselContent>
        <CarouselItem>
          <CardCollections collections={collections} />
        </CarouselItem>
        <CarouselItem>
          <Poster />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselHomePage;
