const { useState, useEffect, useRef } = React;

const CosmicJourney = () => {
  const [stage, setStage] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [showInfinity, setShowInfinity] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (counting && count < 15) {
      const timer = setTimeout(() => setCount(count + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [counting, count]);

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

  const stages = [
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8">
          <h1 className="text-6xl font-light text-purple-200 leading-relaxed">
            A Love Letter to Infinity
          </h1>
          <p className="text-2xl text-purple-400 leading-relaxed italic">
            What if everything you thought about chaos and order was backwards?
          </p>
          <button onClick={() => setStage(1)} className="px-12 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all">
            Begin the Journey
          </button>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-light text-purple-200 leading-relaxed">What does chaos feel like to you?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {[
              { emoji: '🌪️', label: 'Random', desc: 'Unpredictable noise' },
              { emoji: '💥', label: 'Expanding', desc: 'Spreading apart' },
              { emoji: '🌫️', label: 'Lost', desc: "Can't find your way" }
            ].map((item, i) => (
              <button key={i} onClick={() => setTimeout(() => setStage(2), 800)} className="p-8 bg-purple-950/50 hover:bg-purple-900/60 rounded-xl transition-all border border-purple-700/30 hover:border-pink-600/50">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <p className="text-2xl text-purple-200 mb-2">{item.label}</p>
                <p className="text-sm text-purple-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-light text-purple-200 leading-relaxed">And what does order feel like?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {[
              { emoji: '🔄', label: 'Pattern', desc: 'Repeating rhythm' },
              { emoji: '🎯', label: 'Contained', desc: 'Held together' },
              { emoji: '🏠', label: 'Return', desc: 'Coming back home' }
            ].map((item, i) => (
              <button key={i} onClick={() => setTimeout(() => setStage(3), 800)} className="p-8 bg-blue-950/50 hover:bg-blue-900/60 rounded-xl transition-all border border-blue-700/30 hover:border-cyan-600/50">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <p className="text-2xl text-blue-200 mb-2">{item.label}</p>
                <p className="text-sm text-blue-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-16 text-center max-w-3xl mx-auto px-8">
          <div className="text-9xl font-mono text-purple-300" style={{textShadow: '0 0 20px currentColor, 0 0 40px currentColor'}}>0</div>
          <p className="text-3xl text-purple-200 leading-relaxed">You begin here</p>
          <p className="text-lg text-purple-400 italic">At the singularity. At zero.</p>
          <button onClick={() => setStage(4)} className="px-12 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all">Move Forward</button>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8">
          <p className="text-3xl text-purple-200 text-center leading-relaxed">
            You move forward. That's the only rule.
          </p>
          {!counting ? (
            <button onClick={() => setCounting(true)} className="px-16 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-2xl transition-all">
              Begin Counting
            </button>
          ) : (
            <div className="relative w-full h-48 flex items-center justify-center">
              <div className="flex space-x-6 text-6xl font-mono">
                {[...Array(count + 1)].map((_, i) => (
                  <span key={i} className="text-blue-300 flex-shrink-0" style={{ opacity: 1 - (i / (count + 1)) * 0.4 }}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
          {count >= 10 && (
            <div className="space-y-8 text-center">
              <p className="text-xl text-purple-400">1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12...</p>
              <p className="text-3xl text-pink-200">You keep going...</p>
              <p className="text-lg text-purple-400 italic">Into the void. Forever forward.</p>
              <button onClick={() => setStage(5)} className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all mt-8">Continue</button>
            </div>
          )}
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8">
          <p className="text-5xl text-purple-200 font-light leading-relaxed">
            Will you ever return to zero?
          </p>
          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-12">
            <button onClick={() => setTimeout(() => setStage(6), 800)} className="p-10 bg-pink-950/50 hover:bg-pink-900/60 rounded-xl transition-all border border-pink-700/30">
              <p className="text-3xl text-pink-200 mb-2">No</p>
              <p className="text-sm text-pink-400">I drift forever</p>
            </button>
            <button onClick={() => setTimeout(() => setStage(6), 800)} className="p-10 bg-blue-950/50 hover:bg-blue-900/60 rounded-xl transition-all border border-blue-700/30">
              <p className="text-3xl text-blue-200 mb-2">Maybe?</p>
              <p className="text-sm text-blue-400">There might be a way</p>
            </button>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-4xl mx-auto px-8">
          <p className="text-4xl text-purple-200 leading-relaxed">Think about what just happened.</p>
          <div className="space-y-8 max-w-3xl">
            <p className="text-2xl text-purple-300 leading-relaxed">You moved: 0 → 1 → 2 → 3 → 4 → 5...</p>
            <p className="text-2xl text-purple-300 leading-relaxed">Always forward. Never returning.</p>
            <p className="text-2xl text-purple-300 leading-relaxed">Expanding outward into infinite void.</p>
            <div className="p-10 bg-pink-900/30 rounded-xl border border-pink-700/40 mt-12">
              <p className="text-4xl text-pink-300 italic">
                This <span className="font-bold" style={{textShadow: '0 0 20px currentColor'}}>is</span> chaos.
              </p>
            </div>
          </div>
          <button onClick={() => setStage(7)} className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all mt-8">But I want to return</button>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8">
          <p className="text-4xl text-purple-200 text-center leading-relaxed">So how do we return?</p>
          <div className="space-y-6 text-center max-w-3xl">
            <p className="text-2xl text-purple-300 leading-relaxed">What if we go back the same way?</p>
            <p className="text-2xl text-cyan-300 font-mono">0 → 1 → 2 → 3 → 2 → 1 → 0</p>
            <div className="p-10 bg-red-900/30 rounded-xl border border-red-700/40 mt-8">
              <p className="text-3xl text-red-300 mb-4">That's not return.</p>
              <p className="text-lg text-red-200">That's erasure. Undoing your steps. Regression.</p>
            </div>
          </div>
          <button onClick={() => setStage(8)} className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all">Try something else</button>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8">
          <p className="text-4xl text-purple-200 text-center leading-relaxed">What about a circle?</p>
          {!showCircle ? (
            <button onClick={() => setShowCircle(true)} className="px-16 py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-2xl transition-all">
              Draw the Circle
            </button>
          ) : (
            <div className="space-y-8">
              <canvas ref={canvasRef} className="rounded-xl border-2 border-purple-500/30"></canvas>
              <div className="p-10 bg-yellow-900/30 rounded-xl border border-yellow-700/40 max-w-3xl">
                <p className="text-3xl text-yellow-300 mb-4">This feels wrong too.</p>
                <p className="text-lg text-yellow-200 leading-relaxed">
                  You return to zero, but you're right back where you started. No transformation. No growth.
                </p>
              </div>
              <button onClick={() => setStage(9)} className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl transition-all">There must be another way</button>
            </div>
          )}
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto px-8">
          <p className="text-4xl text-purple-200 text-center leading-relaxed">
            We need progression <span className="italic text-cyan-300">and</span> return.
          </p>
          {!showInfinity ? (
            <button onClick={() => { setShowCircle(false); setTimeout(() => setShowInfinity(true), 100); }} className="px-16 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-2xl transition-all">
              Show Me The Shape
            </button>
          ) : (
            <div className="space-y-8">
              <canvas ref={canvasRef} className="rounded-xl border-2 border-cyan-500/50"></canvas>
              <div className="p-10 bg-purple-900/30 rounded-xl border border-cyan-500/30 max-w-3xl">
                <p className="text-3xl text-cyan-300 mb-4" style={{textShadow: '0 0 20px currentColor'}}>The infinity loop.</p>
                <p className="text-lg text-purple-200 leading-relaxed">
                  You move forward continuously. The path curves back. You cross through zero—transformed, not erased.
                </p>
              </div>
              <div className="text-center">
                <button onClick={() => { setStage(0); setCount(0); setCounting(false); setShowCircle(false); setShowInfinity(false); }} className="px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-2xl transition-all">
                  Journey Again ∞
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-blue-950/20 to-indigo-950/20"></div>
      <div className="fixed inset-0">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#c084fc',
              opacity: Math.random() * 0.6 + 0.2,
              boxShadow: `0 0 ${Math.random() * 3 + 1}px currentColor`,
              animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      <div className="fixed top-8 right-8 flex space-x-2 z-20">
        {stages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === stage ? 'bg-cyan-400 scale-150' : i < stage ? 'bg-purple-500' : 'bg-purple-900/30'
            }`}
          />
        ))}
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        {stages[stage]?.content || <div className="text-purple-300">Loading...</div>}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

ReactDOM.render(<CosmicJourney />, document.getElementById('root'));