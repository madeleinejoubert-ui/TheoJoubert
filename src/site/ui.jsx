// Minimal UI primitives for the public site (ported from the Base44 build's
// shadcn components, trimmed to what the site actually uses).

export function Button({ className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex w-full border border-input bg-white/70 px-4 py-2 text-base placeholder:text-foreground/40 focus-ring ${className}`}
      {...props}
    />
  )
}

export function Label({ className = '', ...props }) {
  return <label className={`text-sm font-medium text-foreground/80 ${className}`} {...props} />
}

// The Base44 build used a Wix-media-optimising Image component; images are
// served from /public here, so a plain img with object-fit does the job.
export function Img({ src, alt = '', className = '', ...props }) {
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} {...props} />
}
