import { Leaf } from "lucide-react";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center">
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-botanical-50 text-botanical-500">
        <Leaf size={32} />
      </span>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">404</p>
      <h1 className="font-display mt-3 text-3xl leading-tight text-botanical-900">
        This path has wandered off the wellness trail.
      </h1>
      <p className="mt-3 text-sm text-charcoal-soft">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <ButtonLink href="/" className="mt-8" size="lg">
        Return Home
      </ButtonLink>
    </div>
  );
}
