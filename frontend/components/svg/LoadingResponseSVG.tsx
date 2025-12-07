export default function LoadingResponseSVG() {
  return (
    <svg viewBox="0 0 120 30" className="w-10 h-full flex flex-1 fill-white/80">
      <circle cx="30" cy="15" r="10">
        <animate
          attributeName="cy"
          from="15"
          to="15"
          dur="0.6s"
          begin="0s"
          repeatCount="indefinite"
          values="15;5;15"
          keyTimes="0;0.5;1"
        ></animate>
      </circle>
      <circle cx="60" cy="15" r="10">
        <animate
          attributeName="cy"
          from="15"
          to="15"
          dur="0.6s"
          begin="0.2s"
          repeatCount="indefinite"
          values="15;5;15"
          keyTimes="0;0.5;1"
        ></animate>
      </circle>
      <circle cx="90" cy="15" r="10">
        <animate
          attributeName="cy"
          from="15"
          to="15"
          dur="0.6s"
          begin="0.4s"
          repeatCount="indefinite"
          values="15;5;15"
          keyTimes="0;0.5;1"
        ></animate>
      </circle>
    </svg>
  );
}
