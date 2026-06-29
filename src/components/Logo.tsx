// eslint-disable-next-line @next/next/no-img-element
export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logo-web.png"
      alt="KnowCode Academy"
      className={className}
    />
  );
}
