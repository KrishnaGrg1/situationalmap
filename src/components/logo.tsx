interface LogoProps {
  variant?: 'full' | 'compact' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M16 6L10 9V16C10 21.5 13 24 16 28C19 24 22 21.5 22 16V9L16 6Z"
          fill="#003893"
          stroke="#4F6EBD"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="15" r="2.5" fill="#60A5FA" />
        <path
          d="M16 10C13.2 10 11 12.2 11 15C11 18.5 15 22 16 23C17 22 21 18.5 21 15C21 12.2 18.8 10 16 10Z"
          fill="#3B82F6"
          opacity="0.8"
        />
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 5L9 7.5V14C14 17 19 14 19 14V7.5L14 5Z"
            fill="#003893"
            stroke="#4F6EBD"
            strokeWidth="1.2"
          />
          <circle cx="14" cy="13" r="2" fill="#60A5FA" />
          <path
            d="M14 9C12 9 10.5 10.5 10.5 13C10.5 15.5 13.5 18 14 18.5C14.5 18 17.5 15.5 17.5 13C17.5 10.5 16 9 14 9Z"
            fill="#3B82F6"
            opacity="0.8"
          />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-[#E8EAF0] font-['Syne']">
            SM
          </span>
          <span className="text-xs font-extrabold text-[#3B82F6] tracking-wider font-['Syne']">
            NP
          </span>
        </div>
      </div>
    )
  }

  // Full logo
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 6L10 9V16C10 21.5 13 24 16 28C19 24 22 21.5 22 16V9L16 6Z"
          fill="#003893"
          stroke="#4F6EBD"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="15" r="2.5" fill="#60A5FA" />
        <path
          d="M16 10C13.2 10 11 12.2 11 15C11 18.5 15 22 16 23C17 22 21 18.5 21 15C21 12.2 18.8 10 16 10Z"
          fill="#3B82F6"
          opacity="0.8"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <div className="text-base font-bold text-[#E8EAF0] tracking-tight font-['Syne']">
          SituationalMap{' '}
          <span className="text-[#3B82F6] font-extrabold tracking-wide">
            NP
          </span>
        </div>
        <div className="text-[9px] text-[#5A6480] tracking-wide font-['IBM_Plex_Mono']">
          Nepal Police — Command Operations
        </div>
      </div>
      {/* Live indicator */}
      <div className="relative ml-2">
        <div className="absolute inset-0 rounded-full bg-[#10B981] opacity-30 animate-ping" />
        <div className="relative w-2 h-2 rounded-full bg-[#10B981]" />
      </div>
    </div>
  )
}
