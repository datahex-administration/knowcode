// eslint-disable-next-line @next/next/no-img-element
export function Logo({ className = "h-12 w-auto max-w-[180px] object-contain" }: { className?: string }) {
  return (
    <img
      src="/logo-web.png"
      alt="KnowCode Academy"
      className={className}
    />
  );
}
