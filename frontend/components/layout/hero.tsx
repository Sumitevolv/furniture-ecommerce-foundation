"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid min-h-[70vh] items-center gap-10 py-20 md:min-h-[80vh] md:grid-cols-2 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-bronze">
            The autumn collection
          </p>
          <h1 className="mt-4 max-w-lg text-balance font-serif text-4xl leading-tight text-charcoal sm:text-5xl md:text-6xl">
            Furniture built to be lived with, for generations.
          </h1>
          <p className="mt-6 max-w-md text-base text-text-secondary">
            Solid walnut, hand-finished joinery, and fabrics chosen to soften with age —
            every piece is made to outlast trends and enter your family&apos;s story.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/products">Shop the collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Our craft</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-sand md:aspect-auto md:h-[80vh]"
        >
          <div className="absolute inset-0 flex items-end p-8">
            <p className="font-serif text-sm italic text-walnut-dark/70">
              The Aldric armchair, in aged walnut &amp; bouclé
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
