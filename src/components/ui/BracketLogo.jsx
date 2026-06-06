function BracketLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#0a0a0f" rx="6" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'IBM Plex Mono', monospace" fontWeight="700" fontSize="52">
        <tspan fill="#00e5ff">[</tspan>
        <tspan fill="#e8e8f0">B</tspan>
        <tspan fill="#00e5ff">]</tspan>
      </text>
    </svg>
  )
}
export default BracketLogo
