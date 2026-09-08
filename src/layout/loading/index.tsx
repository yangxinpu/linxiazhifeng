import logo from "@/assets/images/logo.png"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <img
            src={logo}
            alt="GroveGrace Logo"
            className="h-16 w-16 object-contain relative z-10"
          />
          
          <svg 
            className="absolute inset-0 w-20 h-20 animate-spin"
            style={{ animationDuration: '2s', animationTimingFunction: 'ease-in-out' }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              style={{
                strokeDasharray: '283',
                strokeDashoffset: '0',
                animation: 'loading-circle 2s ease-in-out infinite',
              }}
            />
          </svg>
        </div>
        
        <div className="text-center">
          <h1 
            className="text-3xl font-serif font-bold mb-2 tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #0fd9a6 0%, #2b8ae0 50%, #0fd9a6 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s ease infinite',
            }}
          >
            GroveGrace
          </h1>
        </div>
      </div>
    </div>
  )
}
