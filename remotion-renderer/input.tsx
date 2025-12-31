import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, random } from 'remotion';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'CybersecurityShield',
  durationInSeconds: 12, // Match the loop requirement
  fps: 30,
  width: 3840, // 4K Resolution
  height: 2160,
};

// =============================================================================
// PRE-GENERATED DATA & UTILS
// =============================================================================

// Deterministic random number generator
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Generate static grid lines with slight noise
const VERTICAL_LINES = new Array(60).fill(0).map((_, i) => {
  const noise = seededRandom(i) * 40 - 20; // +/- 20px offset
  return {
    id: `v-line-${i}`,
    percent: (i / 60) * 100,
    offset: noise,
  };
});

// Colors
const COLORS = {
  bg: '#050A14',
  grid: 'rgba(50, 80, 140, 0.25)',
  shield: '#64ffda',
  shieldGlow: 'rgba(100, 255, 218, 0.5)',
  threat: '#ef4444',
  text: '#e6f1ff',
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const ShieldIcon: React.FC<{ frame: number }> = ({ frame }) => {
  // Pulsing effect: Sine wave loop every 3 seconds (90 frames)
  // To ensure seamless loop over 12s, 3s fits perfectly (4 cycles)
  const pulse = Math.sin((frame / 90) * Math.PI * 2);
  const scale = interpolate(pulse, [-1, 1], [0.98, 1.02]);
  const glowOpacity = interpolate(pulse, [-1, 1], [0.4, 0.7]);

  // Inner ring rotation (360 degrees over 12 seconds = 360 frames)
  const rotation = interpolate(frame, [0, 360], [0, 360]);

  return (
    <div
      style={{
        width: 500,
        height: 600,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow Effect */}
      <div
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${COLORS.shieldGlow} 0%, transparent 60%)`,
          opacity: glowOpacity,
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* Main Shield SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.shield}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ zIndex: 2, filter: 'drop-shadow(0 0 15px rgba(100,255,218,0.4))' }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(5, 10, 20, 0.9)" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="0.8" />

        {/* Inner concentric details */}
        <path d="M12 18.5s5.5-2.5 5.5-6.5V7l-5.5-2-5.5 2v5c0 4 5.5 6.5 5.5 6.5z" strokeOpacity={0.6} strokeWidth="0.4"/>
        <path d="M12 15s3-1.5 3-4V8l-3-1-3 1v3c0 2.5 3 4 3 4z" strokeOpacity={0.4} strokeWidth="0.3"/>
      </svg>

      {/* Rotating Ring */}
       <svg
        width="70%"
        height="70%"
        viewBox="0 0 100 100"
        style={{
            position: 'absolute',
            zIndex: 3,
            transform: `rotate(${rotation}deg)`
        }}
      >
        <circle cx="50" cy="50" r="48" stroke={COLORS.shield} strokeWidth="0.5" strokeDasharray="5 15" strokeOpacity={0.4} fill="none" />
        <circle cx="50" cy="50" r="42" stroke={COLORS.shield} strokeWidth="0.2" strokeOpacity={0.2} fill="none" />
      </svg>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const CybersecurityShield: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Grid Configuration
  const gridSize = 200; // Larger grid for 4K
  const gridSpeed = 2; // Pixels per frame
  // Modulo creates the loop. Ensure durationInFrames * speed is a multiple of gridSize or handles seamlessly visually
  const gridOffset = (frame * gridSpeed) % gridSize;

  // Generate Threats dynamically based on loop
  // To make it loop, we need a deterministic set of threats that fits within the duration
  const threatCount = 12;
  const threats = new Array(threatCount).fill(0).map((_, i) => {
    // Distribute starts evenly over the timeline to avoid clumps
    const startTime = (i / threatCount) * durationInFrames;
    const lifeTime = 90; // 3 seconds to travel

    // We need to calculate progress based on current frame relative to start time
    // Handling the loop wrap-around for seamlessness
    let relativeFrame = (frame - startTime);
    if (relativeFrame < 0) relativeFrame += durationInFrames;

    // Only render if within lifetime (or wrapping around close to end)
    // For simplicity in a loop, we just render if 0 <= relativeFrame <= lifeTime
    // But to be perfectly seamless, we generally avoid spawning right at the very end unless they fade out quickly.

    const isActive = relativeFrame >= 0 && relativeFrame <= lifeTime;

    const seed = i * 55.5;
    const startX = (0.2 + seededRandom(seed) * 0.6) * width; // Random X between 20-80%

    return { isActive, progress: isActive ? relativeFrame / lifeTime : 0, startX, id: i };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>

      {/* 1. Background Gradient / Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, #0f1c30 0%, #020408 90%)`,
        }}
      />

      {/* 2. Animated Grid (Perspective Plane) */}
      <AbsoluteFill style={{ perspective: '2000px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '200%',
            top: '-50%',
            transform: 'rotateX(60deg) scale(2)',
            transformStyle: 'preserve-3d',
            opacity: 0.6,
          }}
        >
          {/* Vertical Lines */}
          {VERTICAL_LINES.map((line) => (
            <div
              key={line.id}
              style={{
                position: 'absolute',
                left: `calc(${line.percent}% + ${line.offset}px)`,
                top: 0,
                bottom: 0,
                width: 2, // Thicker for 4K visibility
                backgroundColor: COLORS.grid,
                boxShadow: `0 0 10px ${COLORS.grid}`,
              }}
            />
          ))}

          {/* Horizontal Lines (Moving Up) */}
          {new Array(Math.ceil((height * 4) / gridSize)).fill(0).map((_, i) => {
            const basePos = i * gridSize;
            // Subtract offset to move UP (visualizing moving forward/up into the grid)
            const currentPos = basePos - gridOffset;

            return (
              <div
                key={`h-grid-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: currentPos,
                  height: 2,
                  backgroundColor: COLORS.grid,
                  boxShadow: `0 0 10px ${COLORS.grid}`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {/* 3. Threats (Red Squares) */}
      <AbsoluteFill>
        {threats.map((threat) => {
          if (!threat.isActive) return null;

          // Curve logic
          const startY = height * 1.1; // Start below screen
          const endY = height * 0.5;   // End at center

          const endX = width * 0.5;

          const easedProgress = Easing.out(Easing.quad)(threat.progress);

          const currentY = interpolate(easedProgress, [0, 1], [startY, endY]);
          const currentX = interpolate(easedProgress, [0, 1], [threat.startX, endX]);

          // Fade out as it gets close to the shield (0.8 -> 1.0)
          const opacity = interpolate(threat.progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
          const scale = interpolate(threat.progress, [0, 1], [1, 0.1]);

          return (
            <div
              key={threat.id}
              style={{
                position: 'absolute',
                left: currentX,
                top: currentY,
                width: 20, // Small square
                height: 20,
                backgroundColor: COLORS.threat,
                opacity,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${threat.progress * 360}deg)`,
                boxShadow: `0 0 20px ${COLORS.threat}`,
                borderRadius: '2px',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 4. Center Shield */}
      <ShieldIcon frame={frame} />

      {/* 5. Typography */}
      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'SF Pro Display, Roboto, Helvetica, Arial, sans-serif',
            fontSize: 100,
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: COLORS.text,
            margin: 0,
            textShadow: `0 0 30px ${COLORS.shieldGlow}`,
            textTransform: 'uppercase',
          }}
        >
          Cyber Defense
        </h1>
        <h2
            style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 40,
                color: COLORS.shield,
                margin: '20px 0 0 0',
                opacity: 0.8,
                letterSpacing: '0.05em',
            }}
        >
            THREAT MONITORING: ACTIVE
        </h2>
      </div>

      {/* 6. Scanline Overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};

export default CybersecurityShield;
