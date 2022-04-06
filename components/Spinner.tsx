export const Spinner = () => {
  return (
    <div
      className="absolute w-screen h-screen backdrop-blur-sm z-10 flex items-center justify-center"
      role="status"
    >
      <svg
        className={"animate-spin h-24 w-24 animate-spin inline"}
        viewBox={"0 0 24 24"}
      >
        <path
          fill="#580E95"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        <circle
          className="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};
