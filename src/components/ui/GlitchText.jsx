import '../../styles/globals.css'

const INTENSITY_MAP = {
  subtle: 'glitch-subtle',
  medium: 'glitch-medium',
  intense: 'glitch-intense',
}

export default function GlitchText({ text, tag: Tag = 'span', intensity = 'medium', className = '', style = {} }) {
  const intensityClass = INTENSITY_MAP[intensity] || INTENSITY_MAP.medium

  return (
    <Tag
      className={`glitch ${intensityClass} ${className}`}
      data-text={text}
      style={style}
    >
      {text}
    </Tag>
  )
}
