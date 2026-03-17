import FaultyTerminal from './components/FaultyTerminal';

// The Ballpit canvas uses size:'parent' which reads
// parentNode.offsetWidth / offsetHeight at mount time.
// If the parent only has min/max height (not an explicit height),
// offsetHeight returns 0 and the canvas stays invisible.
// Fix: use a plain `height` value on the wrapper, not min/maxHeight.

function Test() {
  return (
    <div className="relative w-full bg-[#0a0a0a] text-white">
<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <FaultyTerminal
    scale={1.5}
    gridMul={[2, 1]}
    digitSize={1.2}
    timeScale={0.5}
    pause={false}
    scanlineIntensity={0.5}
    glitchAmount={1}
    flickerAmount={1}
    noiseAmp={1}
    chromaticAberration={0}
    dither={0}
    curvature={0.1}
    tint="#0000ff"
    mouseReact
    mouseStrength={0.5}
    pageLoadAnimation
    brightness={0.6}
  />
</div>
    </div>
  );
}

export default Test;