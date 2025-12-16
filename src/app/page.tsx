'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-black text-white min-h-[calc(87vh-80px)]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="animate-shimmer text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-[linear-gradient(110deg,#e5e5e5,45%,#16a34a,55%,#e5e5e5)] bg-[length:200%_100%]">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-neutral-500">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-neutral-900 border-neutral-800 text-neutral-200">
                  <CardHeader>
                    <CardTitle className="text-neutral-100">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-neutral-400" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-neutral-500 mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-black text-neutral-500 border-t border-neutral-900 w-full">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}

