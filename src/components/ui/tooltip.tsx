import * as React from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
      <style>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }

        .tooltip-content {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5rem 0.75rem;
          background-color: rgba(0, 0, 0, 0.92);
          color: white;
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1.4;
          border-radius: 0.5rem;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: tooltipFadeIn 0.15s ease;
        }

        .tooltip-content::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.92);
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (prefers-color-scheme: dark) {
          .tooltip-content {
            background-color: rgba(255, 255, 255, 0.95);
            color: #000;
          }

          .tooltip-content::before {
            border-top-color: rgba(255, 255, 255, 0.95);
          }
        }
      `}</style>
    </div>
  )
}
