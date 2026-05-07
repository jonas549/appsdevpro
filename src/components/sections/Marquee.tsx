'use client'
const technologies = [
  {
    name: 'Shopify',
    icon: (
      <svg viewBox="0 0 109 124" className="w-5 h-5 fill-current" fill="#96BF48">
        <path d="M74.7,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0 c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1C43.2,0.5,36.5,5.2,31.2,13.5c-3.7,5.8-6.5,13.1-7.3,18.8 c-7.5,2.3-12.7,3.9-12.8,4c-3.8,1.2-3.9,1.3-4.4,4.9C6.3,44,0,92.4,0,92.4l56.6,9.8V0C56.3,0,74.7,14.8,74.7,14.8z"/>
      </svg>
    ),
  },
  { name: 'React', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#61DAFB"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)"/></svg> },
  { name: 'TypeScript', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3178C6"><rect width="24" height="24" rx="3" fill="#3178C6"/><path d="M13.2 12.9v1.4c.4.2.8.3 1.3.3s1-.1 1.3-.4c.3-.2.5-.6.5-1s-.1-.7-.4-1c-.3-.2-.7-.5-1.3-.7-.5-.2-.8-.4-1-.5-.2-.1-.2-.3-.2-.5s.1-.4.3-.5.4-.2.7-.2.6.1.9.2v-1.3c-.3-.1-.7-.2-1.1-.2s-.9.1-1.3.3c-.4.2-.7.5-.9.9-.2.4-.3.8-.3 1.2 0 .6.2 1 .5 1.4.3.4.8.7 1.4.9.5.2.8.4 1 .5.2.2.3.4.3.6s-.1.4-.3.5-.5.2-.8.2c-.5 0-1-.2-1.6-.6zm-4.6-2.3H6V9.2h6.2v1.4h-2.2v5.4H8.6v-5.4z" fill="white"/></svg> },
  { name: 'Node.js', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#339933"><path d="M12 1.85c-.27 0-.55.07-.78.2L3.78 6.35c-.48.28-.78.79-.78 1.35v8.3c0 .56.3 1.07.78 1.35l7.44 4.3c.23.13.5.2.78.2.27 0 .55-.07.78-.2l7.44-4.3c.48-.28.78-.79.78-1.35v-8.3c0-.56-.3-1.07-.78-1.35L12.78 2.05c-.23-.13-.5-.2-.78-.2z"/></svg> },
  { name: 'Remix', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff"><path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H2.574v-5.056h9.356c2.768 0 4.152-.85 4.152-3.103 0-1.985-1.384-3.185-4.152-3.185H2.574V0h10.328c6.693 0 10.008 3.068 10.008 8.054 0 3.407-1.955 5.638-4.954 6.72 2.586.765 4.184 2.446 4.555 5.734z"/></svg> },
  { name: 'PostgreSQL', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#4169E1"><path d="M17.128 0a10.134 10.134 0 00-2.755.403l-.009.006a10.064 10.064 0 00-.594-.138C12.172.125 10.653.33 9.373.89L9.35.9a6.268 6.268 0 00-.437.223 3.5 3.5 0 00-.613.017C5.042 1.363 2.4 4.048 1.682 7.742 1.28 9.819 1.56 11.71 2.46 13.13c.566.881 1.371 1.45 2.267 1.609a3.85 3.85 0 001.439-.048 3.73 3.73 0 001.226-.481.782.782 0 01.188-.087c.045.143.09.285.137.425l.042.13c.404 1.24.77 2.55.64 3.507-.025.179-.014.34.026.48L7.46 19.2a2.94 2.94 0 001.29 1.48c.555.317 1.153.454 1.72.454.424 0 .833-.083 1.198-.24.367-.16.68-.4.914-.7a3.93 3.93 0 00.63-1.355c.065-.212.115-.434.151-.657.034-.21.073-.422.118-.63.182-.862.426-1.66.797-2.207a.754.754 0 01.058-.072 5.657 5.657 0 001.397.105c1.07-.046 2.121-.417 2.924-1.131a5.57 5.57 0 00.426-.44c1.65-.015 3.18-.856 4.246-2.37 1.009-1.43 1.558-3.47 1.289-5.938C22.152 2.842 19.811.192 17.128 0z"/></svg> },
  { name: 'Vercel', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg> },
  { name: 'Tailwind CSS', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#06B6D4"><path d="M12 6C9.33 6 7.67 7.33 7 10c1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15C19.67 12 21.33 10.67 22 8c-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-4 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C9.39 17.85 10.5 19 13 19c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C11.61 13.15 10.5 12 8 12z"/></svg> },
  { name: 'GraphQL', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#E10098"><path d="M12.001 2.01l9.02 5.19v10.38l-9.02 5.19-9.02-5.19V7.2L12 2.01zM5.27 7.76l6.73 11.66 6.73-11.66H5.27zm8.7.7H10.03l-2.48 4.3 2.48 4.3h3.94l2.48-4.3-2.48-4.3zm-7.13-.61l2.05 3.54H6.87L5.19 8.28a7.84 7.84 0 011.65-.43zm9.3.43l-1.68 3.11h-2.05l2.05-3.54a7.84 7.84 0 011.68.43zm-10.05 9.9a7.84 7.84 0 01-1.65-.43l1.68-3.11h2.05l-2.08 3.54zm8.52-3.54h2.05l1.68 3.11a7.84 7.84 0 01-1.65.43l-2.08-3.54z"/></svg> },
  { name: 'Klaviyo', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff"><rect width="24" height="24" rx="4" fill="#1B1B1B"/><text x="4" y="17" fontSize="12" fill="#F7F7F7" fontWeight="bold" fontFamily="sans-serif">KL</text></svg> },
  { name: 'Prisma', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff"><path d="M21.807 18.285L13.553.756a1.324 1.324 0 00-1.129-.754 1.31 1.31 0 00-1.189.64L2.191 15.385a1.321 1.321 0 00.069 1.471l4.049 5.365a1.32 1.32 0 001.401.46l13.611-3.858a1.321 1.321 0 00.486-2.538zM5.918 17.307l-.889-1.18 6.663-11.48 5.36 11.638-11.134.022z" opacity=".8"/></svg> },
]

const items = [...technologies, ...technologies]

export default function MarqueeSection() {
  return (
    <div id="tecnologias" className="bg-[#0C0F1A] border-y border-white/[0.06] py-4 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #0C0F1A 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #0C0F1A 0%, transparent 100%)' }} />

      {/* Label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <span className="font-mono text-[10px] uppercase text-[#7B8DB0] tracking-widest bg-[#0C0F1A] pr-3">TECNOLOGÍAS</span>
      </div>

      <div className="marquee-wrapper pl-36">
        <div className="animate-marquee">
          {items.map((tech, i) => (
            <div key={i} className="flex items-center gap-2.5 mx-6 text-[#7B8DB0] hover:text-primary transition-colors cursor-default flex-shrink-0">
              <span className="opacity-70">{tech.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
