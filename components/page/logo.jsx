import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="select-none">
      <div className="flex items-center gap-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#6E8AFF" />
            </linearGradient>
          </defs>
          <path
            d="M9 18V5l12-2v13"
            stroke="url(#grad1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="6"
            cy="18"
            r="3"
            stroke="url(#grad1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="18"
            cy="16"
            r="3"
            stroke="url(#grad1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <h1 className="text-xl font-bold">
          Krishan<span className="opacity-70 font-light">Music</span>
        </h1>
      </div>
    </Link>
  );
} 