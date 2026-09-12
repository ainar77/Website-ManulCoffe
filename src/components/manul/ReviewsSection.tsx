import communityImage from "@/assets/community.jpg";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { creators, reviews } from "@/data/manulcoffee";
import { SectionHeading } from "./SectionHeading";

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-surface py-section">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading eyebrow="Kind words, shared slowly" title="Notes from our tables" />
        <Carousel opts={{ align: "start", loop: true }} className="mb-20">
          <CarouselContent className="-ml-5">
            {reviews.map((review) => <CarouselItem key={review.name} className="basis-[88%] pl-5 sm:basis-1/2 lg:basis-1/3"><article className="h-full border border-border bg-card p-7"><div className="mb-6 flex gap-1 text-accent" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div><blockquote className="font-display text-2xl leading-snug">“{review.text}”</blockquote><p className="mt-7 text-sm font-semibold">{review.name}</p><p className="mt-1 text-xs text-muted-foreground">Fictional demo review</p></article></CarouselItem>)}
          </CarouselContent><CarouselPrevious className="-bottom-14 left-0 top-auto translate-y-0" /><CarouselNext className="-bottom-14 left-12 right-auto top-auto translate-y-0" />
        </Carousel>
        <div className="mt-28 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-label text-accent">Community favorites</p><h3 className="font-display text-4xl font-semibold sm:text-5xl">Loved by creators</h3><p className="mt-5 max-w-md leading-relaxed text-muted-foreground">A meeting place for the people shaping Riga’s thoughtful, independent culture.</p></div>
          <Carousel opts={{ align: "start", loop: true }}><CarouselContent>{creators.map((creator, index) => <CarouselItem key={creator.name} className="basis-[88%] sm:basis-1/2"><article><div className="aspect-[4/3] overflow-hidden"><img src={communityImage} alt={`Fictional Riga creator ${creator.name} enjoying coffee`} width={1600} height={1008} loading="lazy" className={`h-full w-full object-cover ${index === 0 ? "object-left" : index === 1 ? "object-center" : "object-right"}`} /></div><p className="mt-5 font-display text-2xl">{creator.name}</p><p className="mt-1 text-xs font-semibold uppercase tracking-label text-accent">{creator.role}</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">“{creator.quote}”</p></article></CarouselItem>)}</CarouselContent><CarouselPrevious className="-bottom-14 left-4 top-auto translate-y-0" /><CarouselNext className="-bottom-14 left-16 right-auto top-auto translate-y-0" /></Carousel>
        </div>
      </div>
    </section>
  );
}