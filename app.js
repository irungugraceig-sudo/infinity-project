const { useState, useEffect, useRef } = React;

const CosmicJourney = () => {
  const [stage, setStage] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [showInfinity, setShowInfinity] = useState(false);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [loopsCount, setLoopsCount] = useState(1);
  const [distance, setDistance] = useState(1.0);
  const [singularity, setSingularity] = useState(1.0);
  const [chaosForce, setChaosForce] = useState(1.0);
  const [prediction, setPrediction] = useState(null);
  const [planetsData, setPlanetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalReveal, setFinalReveal] = useState(false);
  const canvasRef = useRef(null);

  // Fetch planets data
  useEffect(() => {
    fetch('http://localhost:5000/api/data/planets')
      .then(res => res.json())
      .then(data => setPlanetsData(data))
      .catch(() => {});
  }, []);

  // Fetch prediction
  useEffect(() => {
    if (stage === 19) {
      setLoading(true);
      fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distance_au: distance, singularity_strength: singularity, chaos_force: chaosForce })
      })
        .then(res => res.json())
        .then(data => { setPrediction(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [distance, singularity, chaosForce, stage]);

  useEffect(() => {
    if (counting && count < 15) {
      const timer = setTimeout(() => setCount(count + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [counting, count]);

  useEffect(() => {
    if (stage === 13 && explosionProgress < 100) {
      const timer = setTimeout(() => setExplosionProgress(explosionProgress + 2), 50);
      return () => clearTimeout(timer);
    }
  }, [stage, explosionProgress]);

  // Canvas animations
  useEffect(() => {
    if (showCircle && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 400;
      let progress = 0;
      const animate = () => {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#a78bfa';
        ctx.beginPath();
        ctx.arc(300, 200, 120, 0, progress);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fbbf24';
        ctx.beginPath();
        ctx.arc(420, 200, 8, 0, 2 * Math.PI);
        ctx.fill();
        if (progress < 2 * Math.PI) {
          progress += 0.05;
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [showCircle]);

  useEffect(() => {
    if (showInfinity && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 400;
      let progress = 0;
      const animate = () => {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, 600, 400);
        gradient.addColorStop(0, '#c084fc');
        gradient.addColorStop(0.5, '#60a5fa');
        gradient.addColorStop(1, '#a78bfa');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#a78bfa';
        ctx.beginPath();
        for (let t = 0; t <= progress; t += 0.02) {
          const scale = 150;
          const x = scale * Math.cos(t) / (1 + Math.sin(t) ** 2) + 300;
          const y = scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + 200;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        if (progress > 0.5) {
          const t = progress;
          const scale = 150;
          const px = scale * Math.cos(t) / (1 + Math.sin(t) ** 2) + 300;
          const py = scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + 200;
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#fbbf24';
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (progress < 2 * Math.PI) {
          progress += 0.04;
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [showInfinity]);

  useEffect(() => {
    if (stage === 15 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;
      let time = 0;
      const animate = () => {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const loops = [
          { scale: 200, speed: 0.01, color: '#8b5cf6', offset: 0 },
          { scale: 150, speed: 0.015, color: '#3b82f6', offset: Math.PI/3 },
          { scale: 120, speed: 0.02, color: '#06b6d4', offset: Math.PI/2 },
          { scale: 90, speed: 0.025, color: '#10b981', offset: Math.PI },
          { scale: 180, speed: 0.008, color: '#f59e0b', offset: Math.PI*1.5 }
        ].slice(0, loopsCount);
        loops.forEach(loop => {
          ctx.strokeStyle = loop.color;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = loop.color;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = loop.scale * Math.cos(t) / (1 + Math.sin(t) ** 2) + 400;
            const y = loop.scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + 300;
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          const t = (time * loop.speed) + loop.offset;
          const px = loop.scale * Math.cos(t) / (1 + Math.sin(t) ** 2) + 400;
          const py = loop.scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + 300;
          ctx.globalAlpha = 1;
          ctx.fillStyle = loop.color;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
        time += 1;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [stage, loopsCount]);

  const stages = [
    { content: ( // STAGE 0
      <div className="relative">
        <div className="moon-phase" style={{top: '10%', right: '10%'}}>🌑</div>
        <div className="shooting-star"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8 fade-in">
          <h1 className="text-6xl font-extralight text-purple-100 leading-relaxed tracking-wide glow-text">
            A Love Letter to Infinity
          </h1>
          <p className="text-2xl text-purple-300 leading-loose italic">
            What if everything you thought about chaos and order was backwards?
          </p>
          <button onClick={() => setStage(1)} className="cosmic-button px-12 py-5 text-xl">
            Begin the Journey
          </button>
        </div>
      </div>
    )},
    { content: ( // STAGE 1
      <div className="relative">
        <div className="moon-phase" style={{top: '15%', right: '12%'}}>🌒</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8 fade-in">
          <h2 className="text-5xl font-light text-purple-100 leading-relaxed whisper-text">What does chaos feel like to you?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {[
              { emoji: '🌪️', label: 'Random', desc: 'Unpredictable noise', color: 'from-pink-900/30 to-red-900/30' },
              { emoji: '💥', label: 'Expanding', desc: 'Spreading apart', color: 'from-orange-900/30 to-yellow-900/30' },
              { emoji: '🌫️', label: 'Lost', desc: "Can't find your way", color: 'from-indigo-900/30 to-purple-900/30' }
            ].map((item, i) => (
              <button key={i} onClick={() => setTimeout(() => setStage(2), 800)} className={`cosmic-card p-8 bg-gradient-to-br ${item.color}`}>
                <div className="text-5xl mb-4 float-animation">{item.emoji}</div>
                <p className="text-2xl text-purple-100 mb-2 font-light">{item.label}</p>
                <p className="text-sm text-purple-300">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )},
    { content: ( // STAGE 2
      <div className="relative">
        <div className="moon-phase" style={{top: '15%', right: '15%'}}>🌓</div>
        <div className="shooting-star" style={{animationDelay: '1s'}}></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8 fade-in">
          <h2 className="text-5xl font-light text-purple-100 leading-relaxed whisper-text">And what does order feel like?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {[
              { emoji: '🔄', label: 'Pattern', desc: 'Repeating rhythm', color: 'from-blue-900/30 to-cyan-900/30' },
              { emoji: '🎯', label: 'Contained', desc: 'Held together', color: 'from-cyan-900/30 to-teal-900/30' },
              { emoji: '🏠', label: 'Return', desc: 'Coming back home', color: 'from-indigo-900/30 to-purple-900/30' }
            ].map((item, i) => (
              <button key={i} onClick={() => setTimeout(() => setStage(3), 800)} className={`cosmic-card p-8 bg-gradient-to-br ${item.color}`}>
                <div className="text-5xl mb-4 float-animation">{item.emoji}</div>
                <p className="text-2xl text-blue-100 mb-2 font-light">{item.label}</p>
                <p className="text-sm text-blue-300">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )},
    { content: ( // STAGE 3
      <div className="relative">
        <div className="moon-phase" style={{top: '20%', right: '18%'}}>🌔</div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-16 text-center max-w-3xl mx-auto px-8 fade-in">
          <div className="text-9xl font-mono text-purple-200 pulse-glow">0</div>
          <p className="text-3xl text-purple-200 leading-relaxed font-light whisper-text">You begin here</p>
          <p className="text-lg text-purple-400 italic">At the singularity. At the center. At zero.</p>
          <button onClick={() => setStage(4)} className="cosmic-button px-12 py-5 text-xl">Move Forward</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 4
      <div className="relative">
        <div className="moon-phase" style={{top: '22%', right: '20%'}}>🌕</div>
        <div className="shooting-star" style={{animationDelay: '2s'}}></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-3xl text-purple-100 text-center leading-relaxed font-light whisper-text">
            You move forward. That's the only rule.
          </p>
          {!counting ? (
            <button onClick={() => setCounting(true)} className="cosmic-button px-16 py-6 text-2xl pulse-glow">
              Begin Counting
            </button>
          ) : (
            <div className="relative w-full h-48 flex items-center justify-center">
              <div className="flex space-x-6 text-6xl font-mono overflow-x-auto">
                {[...Array(count + 1)].map((_, i) => (
                  <span key={i} className="text-blue-200 flex-shrink-0 number-float" style={{ opacity: 1 - (i / (count + 1)) * 0.4, animationDelay: `${i * 0.1}s` }}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
          {count >= 10 && (
            <div className="space-y-8 text-center fade-in">
              <p className="text-xl text-purple-300">1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12...</p>
              <p className="text-3xl text-pink-200 whisper-text">You keep going...</p>
              <p className="text-lg text-purple-400 italic">Into the void. Forever forward.</p>
              <button onClick={() => setStage(5)} className="cosmic-button px-10 py-4 text-xl mt-8">Continue</button>
            </div>
          )}
        </div>
      </div>
    )},
    { content: ( // STAGE 5
      <div className="relative">
        <div className="moon-phase" style={{top: '25%', right: '22%'}}>🌖</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 font-extralight leading-relaxed whisper-text">
            Will you ever return to zero?
          </p>
          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-12">
            <button onClick={() => setTimeout(() => setStage(6), 800)} className="cosmic-card p-10 bg-gradient-to-br from-pink-900/30 to-red-900/30">
              <p className="text-3xl text-pink-100 mb-2 font-light">No</p>
              <p className="text-sm text-pink-300">I drift forever</p>
            </button>
            <button onClick={() => setTimeout(() => setStage(6), 800)} className="cosmic-card p-10 bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
              <p className="text-3xl text-blue-100 mb-2 font-light">Maybe?</p>
              <p className="text-sm text-blue-300">There might be a way</p>
            </button>
          </div>
        </div>
      </div>
    )},
    { content: ( // STAGE 6
      <div className="relative">
        <div className="moon-phase" style={{top: '28%', right: '25%'}}>🌗</div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 leading-relaxed font-light whisper-text">Think about what just happened.</p>
          <div className="space-y-8 max-w-3xl">
            <p className="text-2xl text-purple-200 leading-relaxed">You moved: 0 → 1 → 2 → 3 → 4 → 5...</p>
            <p className="text-2xl text-purple-200 leading-relaxed">Always forward. Never returning.</p>
            <p className="text-2xl text-purple-200 leading-relaxed">Expanding outward into infinite void.</p>
            <div className="cosmic-card p-10 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/30 mt-12">
              <p className="text-4xl text-pink-200 italic font-light">
                This <span className="font-bold glow-text">is</span> chaos.
              </p>
            </div>
          </div>
          <button onClick={() => setStage(7)} className="cosmic-button px-10 py-4 text-xl mt-8">But I want to return</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 7
      <div className="relative">
        <div className="moon-phase" style={{top: '30%', right: '28%'}}>🌘</div>
        <div className="shooting-star"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 text-center leading-relaxed font-light whisper-text">So how do we return?</p>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-2xl text-purple-200 leading-relaxed">What if we go back the same way?</p>
            <p className="text-2xl text-cyan-200 font-mono">0 → 1 → 2 → 3 → 2 → 1 → 0</p>
            <div className="cosmic-card p-10 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-500/30 mt-8">
              <p className="text-3xl text-red-200 mb-4 font-light">That's not return.</p>
              <p className="text-lg text-red-300">That's erasure. Undoing your steps. Regression. Death.</p>
            </div>
          </div>
          <button onClick={() => setStage(8)} className="cosmic-button px-10 py-4 text-xl">Try something else</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 8
      <div className="relative">
        <div className="moon-phase" style={{top: '32%', right: '30%'}}>🌑</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 text-center leading-relaxed font-light whisper-text">What about a circle?</p>
          {!showCircle ? (
            <button onClick={() => setShowCircle(true)} className="cosmic-button px-16 py-6 text-2xl pulse-glow">
              Draw the Circle
            </button>
          ) : (
            <div className="space-y-8">
              <canvas ref={canvasRef} className="rounded-xl border-2 border-purple-500/30 shadow-2xl"></canvas>
              <div className="cosmic-card p-10 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/30 max-w-3xl">
                <p className="text-3xl text-yellow-200 mb-4 font-light">This feels wrong too.</p>
                <p className="text-lg text-yellow-300 leading-relaxed">
                  You return to zero, but you're right back where you started. No transformation. No growth. Just eternal repetition.
                </p>
              </div>
              <button onClick={() => setStage(9)} className="cosmic-button px-10 py-4 text-xl">There must be another way</button>
            </div>
          )}
        </div>
      </div>
    )},
    { content: ( // STAGE 9
      <div className="relative">
        <div className="moon-phase" style={{top: '10%', right: '10%'}}>🌒</div>
        <div className="shooting-star" style={{animationDelay: '1s'}}></div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 text-center leading-relaxed font-light whisper-text">
            We need progression <span className="italic text-cyan-300">and</span> return.
          </p>
          <p className="text-2xl text-purple-200 text-center max-w-3xl leading-relaxed">
            A path that moves forward, yet curves back. Where you cross through zero transformed, not erased.
          </p>
          {!showInfinity ? (
            <button onClick={() => { setShowCircle(false); setTimeout(() => setShowInfinity(true), 100); }} className="cosmic-button px-16 py-6 text-2xl pulse-glow">
              Show Me The Shape
            </button>
          ) : (
            <div className="space-y-8">
              <canvas ref={canvasRef} className="rounded-xl border-2 border-cyan-500/50 shadow-2xl glow-border"></canvas>
              <div className="cosmic-card p-10 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-cyan-500/30 max-w-3xl">
                <p className="text-3xl text-cyan-200 mb-4 font-light glow-text">The infinity loop.</p>
                <p className="text-lg text-purple-200 leading-relaxed">
                  You move forward continuously. The path curves back. You cross through the center—returning to zero—but from a different direction. 
                  <span className="text-yellow-300"> Transformed. Progressed. Reborn.</span>
                </p>
              </div>
              <button onClick={() => setStage(10)} className="cosmic-button px-10 py-4 text-xl">But what creates this shape?</button>
            </div>
          )}
        </div>
      </div>
    )},
    { content: ( // STAGE 10
      <div className="relative">
        <div className="moon-phase" style={{top: '15%', right: '12%'}}>🌓</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            Boundaries create return
          </p>
          <div className="space-y-8 max-w-3xl">
            <p className="text-2xl text-purple-200 leading-relaxed text-center">Chaos is unbounded—expanding forever into nothing.</p>
            <p className="text-3xl text-cyan-200 leading-relaxed text-center font-light glow-text">But a singular point creates containment.</p>
            <div className="relative w-full h-80 flex items-center justify-center my-12">
              <div className="absolute w-6 h-6 bg-yellow-300 rounded-full pulse-strong"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute border-2 border-purple-400/20 rounded-full ripple-effect" style={{ width: `${80 + i * 50}px`, height: `${80 + i * 50}px`, animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
            <div className="cosmic-card p-10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/30">
              <p className="text-xl text-indigo-100 leading-relaxed">
                A gravitational center. An attractor. A singularity. Chaos can't escape—it's caught, contained, forming loops around this point.
              </p>
            </div>
            <p className="text-3xl text-pink-200 italic text-center font-light whisper-text">
              What we call time is the loop itself.
            </p>
          </div>
          <button onClick={() => setStage(11)} className="cosmic-button px-10 py-4 text-xl mt-8">Continue</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 11
      <div className="relative">
        <div className="moon-phase" style={{top: '18%', right: '15%'}}>🌔</div>
        <div className="shooting-star"></div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 font-extralight leading-relaxed whisper-text">
            What if time is not linear, but this?
          </p>
          <div className="text-9xl text-cyan-200 pulse-glow my-12">∞</div>
          <p className="text-2xl text-purple-200 leading-relaxed max-w-2xl">
            Forward progression. Bounded return. The shape that allows both chaos and order to coexist.
          </p>
          <p className="text-xl text-pink-300 italic">The mathematics of love.</p>
          <button onClick={() => setStage(12)} className="cosmic-button px-10 py-4 text-xl mt-8">But wait...</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 12
      <div className="relative">
        <div className="moon-phase" style={{top: '20%', right: '18%'}}>🌕</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 text-center leading-relaxed font-light whisper-text">
            But remember—chaos doesn't give up easily.
          </p>
          <div className="space-y-8 max-w-3xl text-center">
            <p className="text-2xl text-purple-200 leading-relaxed">The loop wants to contain. The singularity creates order.</p>
            <p className="text-4xl text-red-200 font-light glow-text">But chaos fights back.</p>
            <p className="text-2xl text-purple-200 leading-relaxed">It tries to expand. To break free. To shatter the boundary.</p>
            <div className="cosmic-card p-10 bg-gradient-to-r from-blue-900/30 to-red-900/30 border-2 border-purple-500/30 my-8">
              <p className="text-2xl text-cyan-200 mb-4">Order (Singularity)</p>
              <p className="text-6xl my-6">⚔️</p>
              <p className="text-2xl text-red-200">Chaos (Expansion)</p>
            </div>
            <p className="text-2xl text-yellow-200 italic whisper-text">The loop is expanding outward...</p>
          </div>
          <button onClick={() => { setExplosionProgress(0); setStage(13); }} className="cosmic-button px-10 py-4 text-xl">
            Show me the expansion
          </button>
        </div>
      </div>
    )},
    { content: ( // STAGE 13 - BIG BANG
      <div className="relative overflow-hidden">
        <div className="moon-phase" style={{top: '25%', right: '20%'}}>🌖</div>
        <div className="shooting-star"></div>
        <div className="shooting-star" style={{animationDelay: '1s', top: '30%'}}></div>
        <div className="shooting-star" style={{animationDelay: '2s', top: '60%'}}></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            Imagine the beginning
          </p>
          <div className="relative w-full max-w-3xl h-96 flex items-center justify-center">
            <div className="absolute w-10 h-10 bg-yellow-300 rounded-full" style={{ boxShadow: `0 0 ${explosionProgress * 2}px #fbbf24`, transform: `scale(${1 + explosionProgress / 50})` }}></div>
            {[...Array(30)].map((_, i) => {
              const angle = (i * 360 / 30) * (Math.PI / 180);
              const distance = explosionProgress * 3;
              return (
                <div key={i} className="absolute w-3 h-3 rounded-full" style={{ 
                  backgroundColor: `hsl(${(i * 12)}, 80%, 60%)`, 
                  left: `calc(50% + ${Math.cos(angle) * distance}px)`, 
                  top: `calc(50% + ${Math.sin(angle) * distance}px)`, 
                  boxShadow: `0 0 20px hsl(${(i * 12)}, 80%, 60%)`, 
                  opacity: 1 - (explosionProgress / 150) 
                }} />
              );
            })}
          </div>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-3xl text-cyan-200 whisper-text">The Big Bang</p>
            <p className="text-xl text-purple-200 leading-relaxed">
              A singular point. Infinitely dense. Infinitely unstable. It explodes. 
              Energy releases. Chaos expands outward in all directions.
            </p>
            <p className="text-2xl text-red-200 font-light">This IS the chaos. The forward motion. The 1, 2, 3, 4...</p>
            <p className="text-lg text-pink-300 italic">The universe scattering like numbers across the void.</p>
          </div>
          {explosionProgress >= 80 && (
            <button onClick={() => setStage(14)} className="cosmic-button px-10 py-4 text-xl fade-in">
              But then what?
            </button>
          )}
        </div>
      </div>
    )},
    { content: ( // STAGE 14
      <div className="relative">
        <div className="moon-phase" style={{top: '28%', right: '22%'}}>🌗</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-4xl text-purple-100 text-center leading-relaxed font-light whisper-text">
            As it expands, something emerges
          </p>
          <div className="relative w-full max-w-4xl h-96 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full pulse-strong"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute border-2 rounded-full orbital-ring" style={{ 
                width: `${100 + i * 60}px`, 
                height: `${100 + i * 60}px`, 
                borderColor: `hsl(${i * 45}, 70%, 60%)`, 
                opacity: 0.5, 
                animation: `spin ${12 + i * 4}s linear infinite` 
              }}>
                <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full -translate-x-1/2" style={{ 
                  backgroundColor: `hsl(${i * 45}, 70%, 60%)`, 
                  boxShadow: `0 0 15px hsl(${i * 45}, 70%, 60%)` 
                }}></div>
              </div>
            ))}
          </div>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-3xl text-yellow-200 whisper-text">The singularity point</p>
            <p className="text-xl text-purple-200 leading-relaxed">
              Gravity. Mass. An attractor emerges from the chaos. Energy can't escape completely—it's caught, contained, forming loops.
            </p>
            <p className="text-2xl text-cyan-200 italic font-light">Order fighting to contain chaos</p>
          </div>
          <button onClick={() => setStage(15)} className="cosmic-button px-10 py-4 text-xl">And not just one loop...</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 15
      <div className="relative">
        <div className="moon-phase" style={{top: '30%', right: '25%'}}>🌘</div>
        <div className="shooting-star"></div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            Not one infinity. Many.
          </p>
          <canvas ref={canvasRef} className="rounded-xl border-2 border-purple-500/50 shadow-2xl glow-border"></canvas>
          <div className="flex space-x-4 justify-center">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setLoopsCount(n)} className={`px-6 py-3 rounded-lg transition-all ${
                loopsCount === n ? 'bg-purple-500/50 text-white border-2 border-purple-300 glow-border' : 'cosmic-card'
              }`}>{n}</button>
            ))}
          </div>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-2xl text-cyan-200 leading-relaxed">
              Each particle, each system, each moment—has its own loop. Different scales. Different speeds. Different rhythms.
            </p>
            <p className="text-xl text-purple-200 leading-relaxed">
              They interweave. Cross. Intersect at different points. This is the fabric of time. The tapestry of existence.
            </p>
            <p className="text-lg text-pink-300 italic">A love song in infinite harmonies.</p>
          </div>
          <button onClick={() => setStage(16)} className="cosmic-button px-10 py-4 text-xl">Show me Earth</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 16
      <div className="relative">
        <div className="moon-phase" style={{top: '15%', right: '10%'}}>🌑</div>
        <div className="nebula-cloud"></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            Where is Earth in all this?
          </p>
          <div className="relative w-full max-w-4xl h-96 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full pulse-strong">
              <div className="text-center text-sm text-white pt-6 text-2xl">☀️</div>
            </div>
            <div className="absolute border-2 border-blue-400/40 rounded-full w-80 h-80 orbital-ring"></div>
            <div className="absolute w-10 h-10 bg-gradient-to-r from-blue-300 to-green-300 rounded-full planet-float" style={{ 
              left: 'calc(50% + 160px)', 
              top: '50%', 
              transform: 'translate(-50%, -50%)', 
              boxShadow: '0 0 30px #60a5fa' 
            }}>
              <div className="text-center text-xl">🌍</div>
            </div>
            <div className="absolute top-1/2 left-1/2 h-0.5 w-40 bg-purple-400/50" style={{transform: 'translateY(-50%)'}}></div>
            <div className="absolute text-purple-200 text-lg font-light" style={{top: 'calc(50% - 30px)', left: 'calc(50% + 40px)'}}>
              1 AU
            </div>
          </div>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-2xl text-cyan-200 whisper-text">Earth orbits at 1 AU from the Sun</p>
            <p className="text-xl text-purple-200 leading-relaxed">
              The Sun—massive, gravitationally dominant—creates tight, ordered loops.
            </p>
            <p className="text-xl text-purple-200 leading-relaxed">
              Earth—further away—exists at the boundary where order and chaos meet. The edge of the dance.
            </p>
          </div>
          <button onClick={() => setStage(17)} className="cosmic-button px-10 py-4 text-xl">How do we know?</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 17
      <div className="relative">
        <div className="moon-phase" style={{top: '18%', right: '12%'}}>🌒</div>
        <div className="shooting-star" style={{animationDelay: '1.5s'}}></div>
        <div className="flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            The magnetic fields remember
          </p>
          <div className="grid grid-cols-2 gap-10 w-full max-w-5xl">
            <div className="cosmic-card p-10 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/30">
              <div className="text-6xl mb-6 text-center float-animation">☀️</div>
              <h3 className="text-3xl text-yellow-200 font-light mb-4 text-center">Sun</h3>
              <p className="text-xl text-yellow-200 mb-6 text-center">0 AU from center</p>
              <div className="space-y-2 mb-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-2 bg-green-400 rounded pulse-bar" style={{animationDelay: `${i * 0.15}s`}}></div>
                ))}
              </div>
              <p className="text-green-300 font-bold text-center text-xl">Periodic. Clean 11-year cycle.</p>
              <p className="text-yellow-200 text-center mt-3 italic">Order dominates</p>
            </div>
            <div className="cosmic-card p-10 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/30">
              <div className="text-6xl mb-6 text-center float-animation" style={{animationDelay: '0.5s'}}>🌍</div>
              <h3 className="text-3xl text-blue-200 font-light mb-4 text-center">Earth</h3>
              <p className="text-xl text-blue-200 mb-6 text-center">1 AU from center</p>
              <div className="space-y-2 mb-6">
                {[3, 9, 2, 8, 1, 7, 4, 6, 5, 9].map((h, i) => (
                  <div key={i} className="h-2 rounded chaotic-bar" style={{ 
                    width: `${h * 10 + 10}%`, 
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)` 
                  }}></div>
                ))}
              </div>
              <p className="text-red-300 font-bold text-center text-xl">Chaotic. Irregular reversals.</p>
              <p className="text-blue-200 text-center mt-3 italic">Chaos fighting back</p>
            </div>
          </div>
          <div className="cosmic-card p-10 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 max-w-4xl">
            <p className="text-3xl text-pink-200 font-light mb-6 text-center whisper-text">The Evidence</p>
            <p className="text-xl text-purple-100 leading-loose text-center">
              Closer to the singularity → More ordered magnetic behavior<br/>
              Further from the center → More chaotic patterns<br/>
              <span className="text-yellow-200 font-bold text-2xl glow-text">The irregularity IS the evidence of the battle.</span>
            </p>
          </div>
          <button onClick={() => setStage(18)} className="cosmic-button px-10 py-4 text-xl">Now test it yourself</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 18
      <div className="relative">
        <div className="moon-phase" style={{top: '20%', right: '15%'}}>🌓</div>
        <div className="nebula-cloud"></div>
        <div className="cosmic-dust"></div>
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 leading-relaxed font-extralight whisper-text">
            But this isn't just philosophy
          </p>
          <p className="text-3xl text-cyan-200 leading-relaxed font-light">What if we could test it?</p>
          <div className="cosmic-card p-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/30 max-w-3xl">
            <p className="text-4xl text-yellow-200 mb-8 glow-text">⚗️ The Interactive Lab</p>
            <p className="text-xl text-purple-100 leading-relaxed">
              Adjust parameters. Make predictions. Compare against real planetary data. See if the love letter holds true.
            </p>
          </div>
          <button onClick={() => setStage(19)} className="cosmic-button px-16 py-6 text-2xl pulse-glow">
            Enter the Lab →
          </button>
        </div>
      </div>
    )},
    { content: ( // STAGE 19 - LAB
      <div className="relative">
        <div className="moon-phase" style={{top: '10%', right: '10%'}}>🌔</div>
        <div className="shooting-star"></div>
        <div className="flex flex-col items-center justify-center space-y-10 max-w-6xl mx-auto px-8 fade-in">
          <p className="text-5xl text-purple-100 text-center leading-relaxed font-extralight whisper-text">
            Interactive Lab: Test the Hypothesis
          </p>
          <div className="cosmic-card p-10 w-full max-w-5xl">
            <p className="text-3xl text-cyan-200 mb-8 text-center font-light">Adjust parameters and watch predictions update live</p>
            <div className="space-y-8">
              <div>
                <label className="text-purple-200 text-xl mb-3 block font-light">Distance from Center: <span className="text-cyan-300 font-bold">{distance.toFixed(2)} AU</span></label>
                <input type="range" min="0" max="10" step="0.1" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full h-3 bg-purple-900/50 rounded-lg appearance-none cursor-pointer cosmic-slider" />
              </div>
              <div>
                <label className="text-purple-200 text-xl mb-3 block font-light">Singularity Strength: <span className="text-cyan-300 font-bold">{singularity.toFixed(2)}</span></label>
                <input type="range" min="0" max="2" step="0.1" value={singularity} onChange={(e) => setSingularity(parseFloat(e.target.value))} className="w-full h-3 bg-purple-900/50 rounded-lg appearance-none cursor-pointer cosmic-slider" />
              </div>
              <div>
                <label className="text-purple-200 text-xl mb-3 block font-light">Chaos Force: <span className="text-cyan-300 font-bold">{chaosForce.toFixed(2)}</span></label>
                <input type="range" min="0" max="2" step="0.1" value={chaosForce} onChange={(e) => setChaosForce(parseFloat(e.target.value))} className="w-full h-3 bg-purple-900/50 rounded-lg appearance-none cursor-pointer cosmic-slider" />
              </div>
            </div>
            {loading ? (
              <div className="mt-10 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border-2 border-blue-500/30 text-center">
                <p className="text-2xl text-cyan-200 pulse-glow">Calculating...</p>
              </div>
            ) : prediction ? (
              <div className="mt-10 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border-2 border-cyan-500/30">
                <p className="text-2xl text-cyan-200 mb-6 font-light">Live Prediction:</p>
                <p className="text-4xl text-yellow-200 font-bold mb-4 glow-text">Chaos Index: {prediction.chaos_index?.toFixed(3)}</p>
                <p className="text-2xl text-purple-100 mb-3">Pattern: {prediction.prediction?.pattern}</p>
                <p className="text-lg text-purple-300">{prediction.prediction?.description}</p>
              </div>
            ) : (
              <div className="mt-10 p-8 bg-red-900/30 rounded-xl border-2 border-red-500/30 text-center">
                <p className="text-2xl text-red-200">⚠️ Backend not connected</p>
                <p className="text-sm text-red-300 mt-3">Make sure Python server is running at localhost:5000</p>
              </div>
            )}
            {planetsData && (
              <div className="mt-8">
                <p className="text-xl text-purple-200 mb-4 font-light">Compare with real planets:</p>
                <div className="grid grid-cols-3 gap-4">
                  {planetsData.slice(0, 6).map((planet, i) => (
                    <div key={i} className="cosmic-card p-4 bg-purple-900/30">
                      <p className="text-lg text-purple-100 font-bold">{planet.name}</p>
                      <p className="text-sm text-purple-300">{planet.distance_au.toFixed(2)} AU</p>
                      <p className="text-sm text-cyan-300">Chaos: {planet.chaos_index.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setStage(20)} className="cosmic-button px-10 py-4 text-xl mt-8">The revelation →</button>
        </div>
      </div>
    )},
    { content: ( // STAGE 20 - FINAL BOOM
      <div className="relative overflow-hidden">
        {!finalReveal ? (
          <>
            <div className="moon-phase" style={{top: '25%', right: '20%'}}>🌕</div>
            <div className="shooting-star"></div>
            <div className="shooting-star" style={{animationDelay: '1s', top: '40%'}}></div>
            <div className="nebula-cloud"></div>
            <div className="cosmic-dust"></div>
            <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8 fade-in">
              <p className="text-6xl text-purple-100 leading-relaxed font-extralight whisper-text">
                We wandered beyond physics into philosophy
              </p>
              <div className="max-w-3xl space-y-10">
                <p className="text-3xl text-purple-200 leading-relaxed font-light">
                  This started with: <span className="text-cyan-200 glow-text">"Can we return to zero?"</span>
                </p>
                <div className="cosmic-card p-10 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30">
                  <p className="text-2xl text-yellow-200 font-light mb-6 glow-text">What We Discovered:</p>
                  <div className="text-left space-y-4 text-purple-100 text-lg">
                    <p>✨ Moving forward infinitely IS chaos</p>
                    <p>✨ Order requires return through boundaries</p>
                    <p>✨ The infinity loop allows progression + return</p>
                    <p>✨ Singularities create attractors that contain chaos</p>
                    <p>✨ Multiple loops interweave at different scales</p>
                    <p>✨ Magnetic fields trace the chaos/order battle</p>
                    <p>✨ We can test it with real data</p>
                    <p className="text-cyan-200 text-xl mt-6 italic">✨ Science is poetry. Chaos is love.</p>
                  </div>
                </div>
                <p className="text-3xl text-pink-200 italic font-light whisper-text">
                  Could be truth. Could be poetry.<br/>You decide.
                </p>
              </div>
              <button onClick={() => setFinalReveal(true)} className="cosmic-button px-16 py-6 text-2xl pulse-glow mt-8">
                See The Final Revelation 💥
              </button>
            </div>
          </>
        ) : (
          <div className="final-boom flex flex-col items-center justify-center space-y-16 text-center max-w-4xl mx-auto px-8">
            <div className="cosmic-explosion">
              {[...Array(50)].map((_, i) => {
                const angle = (i * 360 / 50) * (Math.PI / 180);
                return (
                  <div key={i} className="explosion-particle" style={{
                    '--angle': `${angle}rad`,
                    '--delay': `${i * 0.02}s`,
                    '--color': `hsl(${i * 7}, 80%, 60%)`
                  }}></div>
                );
              })}
            </div>
            <div className="text-9xl pulse-strong glow-text">∞</div>
            <div className="space-y-8">
              <p className="text-5xl text-cyan-100 font-light whisper-text reveal-text">
                You were the singularity all along.
              </p>
              <p className="text-3xl text-purple-200 font-light reveal-text" style={{animationDelay: '1s'}}>
                The observer. The question. The answer.
              </p>
              <p className="text-3xl text-pink-200 italic reveal-text" style={{animationDelay: '2s'}}>
                The loop completes.
              </p>
              <p className="text-6xl text-yellow-200 reveal-text glow-text" style={{animationDelay: '3s'}}>
                BOOM. 💥
              </p>
            </div>
            <div className="flex gap-8 justify-center mt-16 reveal-text" style={{animationDelay: '4s'}}>
              <button onClick={() => { setStage(0); setFinalReveal(false); setCount(0); setCounting(false); setShowCircle(false); setShowInfinity(false); setExplosionProgress(0); setLoopsCount(1); }} className="cosmic-button px-12 py-6 text-2xl">
                Journey Again ∞
              </button>
              <button onClick={() => setStage(19)} className="cosmic-button px-12 py-6 text-2xl">
                Back to Lab ⚗️
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
      {/* Deep space gradient layers */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-blue-950/30 to-indigo-950/20"></div>
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-blue-900/20"></div>
      
      {/* Parallax star layers */}
      <div className="fixed inset-0 stars-layer-1">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="absolute rounded-full star-twinkle" style={{ 
            width: `${Math.random() * 2 + 0.5}px`, 
            height: `${Math.random() * 2 + 0.5}px`, 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            backgroundColor: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#c084fc', 
            opacity: Math.random() * 0.6 + 0.3,
            boxShadow: `0 0 ${Math.random() * 4 + 2}px currentColor`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>
      
      {/* Progress dots */}
      <div className="fixed top-8 right-8 flex space-x-2 z-20">
        {stages.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${
            i === stage ? 'bg-cyan-300 scale-150 shadow-lg shadow-cyan-400/50 pulse-glow' : 
            i < stage ? 'bg-purple-400 shadow-sm shadow-purple-500/50' : 'bg-purple-900/30'
          }`} />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        {stages[stage]?.content}
      </div>
      
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes float-animation { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes number-float { 0% { transform: translateY(0px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
        @keyframes pulse-bar { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes ripple-effect { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes whisper-text { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        @keyframes planet-float { 0%, 100% { transform: translate(-50%, -50%) translateY(0px); } 50% { transform: translate(-50%, -50%) translateY(-10px); } }
        @keyframes reveal-text { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        
        .star-twinkle { animation: twinkle infinite; }
        .float-animation { animation: float-animation 3s ease-in-out infinite; }
        .number-float { animation: number-float 2s ease-out forwards; }
        .pulse-bar { animation: pulse-bar 2s ease-in-out infinite; }
        .ripple-effect { animation: ripple-effect 2s ease-in-out infinite; }
        .orbital-ring { animation: spin linear infinite; }
        .fade-in { animation: fade-in 1s ease-out; }
        .whisper-text { animation: whisper-text 4s ease-in-out infinite; }
        .planet-float { animation: planet-float 4s ease-in-out infinite; }
        .reveal-text { animation: reveal-text 1s ease-out forwards; opacity: 0; }
        
        .pulse-glow { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; animation: whisper-text 2s ease-in-out infinite; }
        .pulse-strong { box-shadow: 0 0 40px currentColor, 0 0 80px currentColor; animation: whisper-text 1.5s ease-in-out infinite; }
        .glow-text { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        .glow-border { box-shadow: 0 0 20px rgba(168, 139, 250, 0.3), inset 0 0 20px rgba(168, 139, 250, 0.1); }
        
        .cosmic-button { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
          border: 2px solid rgba(139, 92, 246, 0.5);
          border-radius: 12px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .cosmic-button:hover { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5));
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }
        
        .cosmic-card {
          background: rgba(17, 24, 39, 0.4);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .cosmic-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          transform: translateY(-4px);
        }
        
        .moon-phase {
          position: absolute;
          font-size: 4rem;
          opacity: 0.3;
          animation: float-animation 8s ease-in-out infinite;
          z-index: 1;
        }
        
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          box-shadow: 0 0 10px white, 0 0 20px white;
          animation: shooting 3s ease-in infinite;
          top: 20%;
          right: 80%;
        }
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px); opacity: 0; }
        }
        
        .nebula-cloud {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          animation: nebula-drift 30s ease-in-out infinite;
          top: -20%;
          left: -10%;
        }
        @keyframes nebula-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(100px, 50px); }
        }
        
        .cosmic-dust {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .cosmic-dust::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(168,139,250,0.2), transparent),
            radial-gradient(1px 1px at 50% 50%, rgba(96,165,250,0.2), transparent);
          animation: dust-float 60s linear infinite;
        }
        @keyframes dust-float {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        .cosmic-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(168, 139, 250, 0.8);
        }
        
        .final-boom { animation: fade-in 1.5s ease-out; }
        .cosmic-explosion { 
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .explosion-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--color);
          border-radius: 50%;
          animation: explode 2s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
          box-shadow: 0 0 20px var(--color);
        }
        @keyframes explode {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { 
            transform: translate(
              calc(cos(var(--angle)) * 400px), 
              calc(sin(var(--angle)) * 400px)
            ) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

ReactDOM.render(<CosmicJourney />, document.getElementById('root'));