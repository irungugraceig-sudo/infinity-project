const { useState, useEffect, useRef } = React;

const CosmicJourney = () => {
  const [stage, setStage] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [showInfinity, setShowInfinity] = useState(false);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [loopsCount, setLoopsCount] = useState(1);
  
  // Lab state - NO BACKEND NEEDED
  const [pullStrength, setPullStrength] = useState(1.0);
  const [chaosResistance, setChaosResistance] = useState(1.0);
  const [distanceFromLove, setDistanceFromLove] = useState(1.0);
  const [canReturn, setCanReturn] = useState(true);
  const [returnProbability, setReturnProbability] = useState(0.5);
  
  const [finalReveal, setFinalReveal] = useState(false);
  const [shake, setShake] = useState(false);
  const canvasRef = useRef(null);

  // Calculate if return is possible (in browser, no backend)
  useEffect(() => {
    const force = pullStrength / (distanceFromLove * chaosResistance);
    const probability = Math.min(1, Math.max(0, force / 2));
    setReturnProbability(probability);
    setCanReturn(probability > 0.5);
  }, [pullStrength, chaosResistance, distanceFromLove]);

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
    { // STAGE 0
      title: "Chapter One: You",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <div className="text-8xl mb-8">📖</div>
            <h1 className="text-7xl font-extralight text-purple-100 mb-8 page-title">
              A Love Letter to Infinity
            </h1>
            <p className="text-3xl text-purple-300 italic mb-12 breathing-text">
              What if the universe wants you to come home?
            </p>
            <button onClick={() => setStage(1)} className="cosmic-btn text-2xl px-16 py-6">
              Open the Book
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 1
      title: "What is chaos?",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Close your eyes.<br/>Think of chaos.
            </p>
            <p className="text-2xl text-purple-300 mb-16">
              How does it feel?
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-5xl">
              {[
                { emoji: '🌪️', word: 'Lost', feeling: 'Like you'll never find your way back' },
                { emoji: '💥', word: 'Scattered', feeling: 'Pieces flying apart forever' },
                { emoji: '🌫️', word: 'Forgotten', feeling: 'No one remembers where you came from' }
              ].map((item, i) => (
                <button key={i} onClick={() => setTimeout(() => setStage(2), 800)} className="cosmic-card p-10 hover-lift">
                  <div className="text-7xl mb-6 float-slow">{item.emoji}</div>
                  <p className="text-3xl text-purple-100 mb-4">{item.word}</p>
                  <p className="text-sm text-purple-400 leading-relaxed">{item.feeling}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { // STAGE 2
      title: "What is order?",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Now think of order.
            </p>
            <p className="text-2xl text-purple-300 mb-16">
              How does it feel?
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-5xl">
              {[
                { emoji: '🔄', word: 'Rhythm', feeling: 'Like a heartbeat. You know what comes next.' },
                { emoji: '🏠', word: 'Home', feeling: 'A place you can always return to' },
                { emoji: '🫂', word: 'Held', feeling: 'Something keeps you from drifting away' }
              ].map((item, i) => (
                <button key={i} onClick={() => setTimeout(() => setStage(3), 800)} className="cosmic-card p-10 hover-lift">
                  <div className="text-7xl mb-6 float-slow">{item.emoji}</div>
                  <p className="text-3xl text-blue-100 mb-4">{item.word}</p>
                  <p className="text-sm text-blue-400 leading-relaxed">{item.feeling}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { // STAGE 3
      title: "You begin at zero",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <div className="text-9xl font-light text-purple-200 pulse-soft mb-12">0</div>
            <p className="text-4xl text-purple-100 mb-8 breathing-text">
              You begin here.
            </p>
            <p className="text-2xl text-purple-300 mb-8">
              At the center. At home.
            </p>
            <p className="text-xl text-purple-400 italic mb-16">
              Everything starts from somewhere.
            </p>
            <button onClick={() => setStage(4)} className="cosmic-btn text-2xl px-12 py-5">
              What happens next?
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 4
      title: "You move forward",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              You move forward.<br/>Because that's what everything does.
            </p>
            {!counting ? (
              <button onClick={() => setCounting(true)} className="cosmic-btn text-2xl px-16 py-6 pulse-soft">
                Start Walking
              </button>
            ) : (
              <div className="w-full">
                <div className="flex space-x-8 text-7xl font-light justify-center mb-12 overflow-hidden">
                  {[...Array(Math.min(count + 1, 10))].map((_, i) => (
                    <span key={i} className="text-blue-200 number-drift" style={{ opacity: 1 - (i / 10) * 0.5 }}>
                      {i}
                    </span>
                  ))}
                  {count >= 10 && <span className="text-blue-200">...</span>}
                </div>
                {count >= 10 && (
                  <div className="fade-in-slow space-y-8">
                    <p className="text-2xl text-purple-300">
                      1, 2, 3, 4, 5...
                    </p>
                    <p className="text-3xl text-pink-200 breathing-text">
                      You keep going.
                    </p>
                    <p className="text-xl text-purple-400 italic mb-8">
                      Further and further from where you started.
                    </p>
                    <button onClick={() => setStage(5)} className="cosmic-btn text-xl px-12 py-4">
                      Keep walking
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    },
    { // STAGE 5
      title: "The question",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-6xl font-light text-purple-100 mb-16 breathing-text">
              Will you ever<br/>come home?
            </p>
            <div className="grid grid-cols-2 gap-12 max-w-3xl">
              <button onClick={() => setTimeout(() => setStage(6), 800)} className="cosmic-card p-12 hover-lift">
                <p className="text-4xl text-pink-100 mb-4">No</p>
                <p className="text-lg text-pink-400">I'll drift forever</p>
              </button>
              <button onClick={() => setTimeout(() => setStage(6), 800)} className="cosmic-card p-12 hover-lift">
                <p className="text-4xl text-blue-100 mb-4">Maybe</p>
                <p className="text-lg text-blue-400">If there's a way back</p>
              </button>
            </div>
          </div>
        </div>
      )
    },
    { // STAGE 6
      title: "This is chaos",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              Think about what just happened.
            </p>
            <div className="space-y-8 max-w-4xl text-center">
              <p className="text-3xl text-purple-200">
                You walked: 0 → 1 → 2 → 3 → 4...
              </p>
              <p className="text-3xl text-purple-200">
                Always forward.
              </p>
              <p className="text-3xl text-purple-200 mb-8">
                Never looking back.
              </p>
              <div className="cosmic-card p-12 bg-pink-900/20 border-pink-500/30 mt-12">
                <p className="text-5xl text-pink-200 italic breathing-text">
                  This is chaos.
                </p>
                <p className="text-xl text-pink-300 mt-6">
                  Moving forward forever.<br/>Never finding home.
                </p>
              </div>
            </div>
            <button onClick={() => setStage(7)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              But I want to go home
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 7
      title: "Going backwards?",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              What if you just turn around?
            </p>
            <p className="text-3xl text-cyan-200 font-mono mb-12">
              0 → 1 → 2 → 3 → 2 → 1 → 0
            </p>
            <div className="cosmic-card p-12 bg-red-900/20 border-red-500/30 max-w-3xl">
              <p className="text-4xl text-red-200 mb-6">That's not home.</p>
              <p className="text-2xl text-red-300 leading-relaxed">
                That's erasure.<br/>
                You're just undoing your steps.<br/>
                Becoming nothing again.
              </p>
            </div>
            <button onClick={() => setStage(8)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              There must be another way
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 8
      title: "A circle?",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              What about going in a circle?
            </p>
            {!showCircle ? (
              <button onClick={() => setShowCircle(true)} className="cosmic-btn text-2xl px-16 py-6 pulse-soft">
                Draw the circle
              </button>
            ) : (
              <div className="space-y-8">
                <canvas ref={canvasRef} className="rounded-2xl border-2 border-purple-500/30 shadow-2xl"></canvas>
                <div className="cosmic-card p-12 bg-yellow-900/20 border-yellow-500/30 max-w-3xl">
                  <p className="text-4xl text-yellow-200 mb-6">This feels wrong too.</p>
                  <p className="text-2xl text-yellow-300 leading-relaxed">
                    You return to zero, yes.<br/>
                    But you're exactly where you started.<br/>
                    No change. No growth. Just repetition.
                  </p>
                </div>
                <button onClick={() => setStage(9)} className="cosmic-btn text-xl px-12 py-4">
                  Show me the real way
                </button>
              </div>
            )}
          </div>
        </div>
      )
   { // STAGE 9
  title: "The shape of love",
  content: (
    <div className="page-turn">
      <div className="cosmic-page">
        <p className="text-4xl text-purple-100 mb-12 breathing-text">
          What if you need both?
        </p>
        <p className="text-3xl text-cyan-200 mb-16">
          To move forward <span className="italic">and</span> return home.
        </p>
        {!showInfinity ? (
          <button 
            onClick={() => { 
              setShowCircle(false); 
              setShowInfinity(true); 
            }} 
            className="cosmic-btn text-2xl px-16 py-6 pulse-soft"
          >
            Show me the shape
          </button>
        ) : (
          <div className="space-y-12">
            <canvas 
              ref={canvasRef} 
              className="rounded-2xl border-2 border-cyan-500/50 shadow-2xl glow-strong"
            ></canvas>
            
            <div className="cosmic-card p-12 bg-purple-900/20 border-cyan-500/30 max-w-4xl">
              <p className="text-5xl text-cyan-200 mb-8 glow-text">∞</p>
              <p className="text-3xl text-purple-100 mb-6">The infinity loop.</p>
              <p className="text-2xl text-purple-200 leading-relaxed">
                You keep moving forward.<br/>
                But the path curves back through the center.<br/>
                You pass through home—through zero—transformed.<br/>
                <span className="text-yellow-300">Not erased. Reborn.</span>
              </p>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setStage(10)} 
                className="cosmic-btn text-2xl px-16 py-6 pulse-soft"
              >
                But what creates this shape? →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
},
    { // STAGE 10
      title: "The force that pulls you home",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Something has to pull you back.
            </p>
            <div className="relative w-full h-80 flex items-center justify-center my-12">
              <div className="absolute w-8 h-8 bg-yellow-300 rounded-full pulse-strong"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute border-2 border-purple-400/20 rounded-full ripple" style={{ 
                  width: `${80 + i * 60}px`, 
                  height: `${80 + i * 60}px`,
                  animationDelay: `${i * 0.3}s`
                }} />
              ))}
            </div>
            <div className="space-y-8 max-w-4xl">
              <p className="text-3xl text-purple-200 leading-relaxed">
                Without this force, you drift forever.
              </p>
              <p className="text-3xl text-cyan-200 leading-relaxed">
                With it, you always find your way home.
              </p>
              <p className="text-4xl text-pink-200 italic breathing-text mt-8">
                We call this force love.
              </p>
            </div>
            <button onClick={() => setStage(11)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              Continue
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 11
      title: "Time itself",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              What if time isn't a straight line?
            </p>
            <div className="text-9xl text-cyan-200 pulse-soft my-16">∞</div>
            <p className="text-3xl text-purple-200 mb-8">
              What if time is the shape<br/>that love creates?
            </p>
            <p className="text-2xl text-pink-300 italic">
              Forward motion. Eternal return.
            </p>
            <button onClick={() => setStage(12)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              But there's more
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 12
      title: "Chaos fights back",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              But chaos doesn't give up easily.
            </p>
            <div className="space-y-8 max-w-4xl">
              <p className="text-3xl text-purple-200">
                Love tries to pull you back.
              </p>
              <p className="text-5xl text-red-200 font-light my-8">
                Chaos tries to scatter you.
              </p>
              <div className="cosmic-card p-12 bg-gradient-to-r from-blue-900/20 to-red-900/20 border-purple-500/30">
                <p className="text-3xl text-cyan-200 mb-4">Love (The Pull Home)</p>
                <p className="text-6xl my-8">⚔️</p>
                <p className="text-3xl text-red-200">Chaos (The Drift Away)</p>
              </div>
              <p className="text-3xl text-yellow-200 italic breathing-text">
                They're fighting over you right now.
              </p>
            </div>
            <button onClick={() => { setExplosionProgress(0); setStage(13); }} className="cosmic-btn text-xl px-12 py-4 mt-12">
              Show me
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 13
      title: "The universe explodes",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Imagine the beginning.
            </p>
            <div className="relative w-full h-96 flex items-center justify-center my-12">
              <div className="absolute w-12 h-12 bg-yellow-300 rounded-full" style={{ 
                boxShadow: `0 0 ${explosionProgress * 3}px #fbbf24`,
                transform: `scale(${1 + explosionProgress / 80})`
              }}></div>
              {[...Array(40)].map((_, i) => {
                const angle = (i * 360 / 40) * (Math.PI / 180);
                const distance = explosionProgress * 3;
                return (
                  <div key={i} className="absolute w-3 h-3 rounded-full" style={{ 
                    backgroundColor: `hsl(${(i * 9)}, 80%, 65%)`,
                    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                    boxShadow: `0 0 15px currentColor`,
                    opacity: 1 - (explosionProgress / 150)
                  }} />
                );
              })}
            </div>
            <div className="space-y-6 max-w-4xl">
              <p className="text-3xl text-cyan-200">The Big Bang.</p>
              <p className="text-2xl text-purple-200">
                Everything scattered.<br/>
                Pure chaos.<br/>
                Everything drifting apart forever.
              </p>
              <p className="text-2xl text-red-200">
                This is what 1, 2, 3, 4... feels like.
              </p>
            </div>
            {explosionProgress >= 80 && (
              <button onClick={() => setStage(14)} className="cosmic-btn text-xl px-12 py-4 mt-12 fade-in-slow">
                Then what?
              </button>
            )}
          </div>
        </div>
      )
    },
    { // STAGE 14
      title: "Love emerges",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              But as things scatter...<br/>something emerges.
            </p>
            <div className="relative w-full h-96 flex items-center justify-center my-12">
              <div className="absolute w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full pulse-strong"></div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute border-2 rounded-full orbital" style={{ 
                  width: `${100 + i * 70}px`,
                  height: `${100 + i * 70}px`,
                  borderColor: `hsl(${i * 45}, 70%, 60%)`,
                  opacity: 0.5,
                  animation: `spin ${12 + i * 4}s linear infinite`
                }}>
                  <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full -translate-x-1/2" style={{ 
                    backgroundColor: `hsl(${i * 45}, 70%, 60%)`,
                    boxShadow: `0 0 12px currentColor`
                  }}></div>
                </div>
              ))}
            </div>
            <div className="space-y-8 max-w-4xl">
              <p className="text-3xl text-yellow-200">The center point.</p>
              <p className="text-2xl text-purple-200 leading-relaxed">
                A force that pulls.<br/>
                Like gravity. Like home. Like love.<br/>
                Things can't escape completely anymore.
              </p>
              <p className="text-3xl text-cyan-200 italic breathing-text">
                Loops begin to form.
              </p>
            </div>
            <button onClick={() => setStage(15)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              Not just one loop
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 15
      title: "Many infinities",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Not one infinity.<br/>Many.
            </p>
            <canvas ref={canvasRef} className="rounded-2xl border-2 border-purple-500/50 shadow-2xl mb-8"></canvas>
            <div className="flex space-x-4 justify-center mb-12">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setLoopsCount(n)} className={`px-6 py-3 rounded-lg transition-all ${
                  loopsCount === n ? 'bg-purple-500 text-white shadow-lg' : 'bg-purple-900/30 text-purple-400 hover:bg-purple-800/40'
                }`}>{n}</button>
              ))}
            </div>
            <div className="space-y-6 max-w-4xl">
              <p className="text-2xl text-cyan-200 leading-relaxed">
                Every particle has its own loop.<br/>
                Every moment. Every heartbeat.
              </p>
              <p className="text-2xl text-purple-200">
                They cross. Interweave. Dance together.
              </p>
              <p className="text-3xl text-pink-200 italic breathing-text">
                This is the fabric of time.
              </p>
            </div>
            <button onClick={() => setStage(16)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              Where is Earth?
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 16
      title: "Earth remembers",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              Let's find Earth.
            </p>
            <div className="relative w-full h-96 flex items-center justify-center mb-12">
              <div className="absolute w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full pulse-strong">
                <div className="text-center text-2xl pt-6">☀️</div>
              </div>
              <div className="absolute border-2 border-blue-400/40 rounded-full w-80 h-80"></div>
              <div className="absolute w-12 h-12 bg-gradient-to-r from-blue-300 to-green-300 rounded-full" style={{ 
                left: 'calc(50% + 160px)',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 25px #60a5fa'
              }}>
                <div className="text-center text-2xl pt-3">🌍</div>
              </div>
            </div>
            <div className="space-y-8 max-w-4xl">
              <p className="text-3xl text-cyan-200">Earth lives at the edge.</p>
              <p className="text-2xl text-purple-200 leading-relaxed">
                Close enough to feel the pull home.<br/>
                Far enough to feel chaos tugging away.
              </p>
              <p className="text-2xl text-yellow-200 italic">
                Right where love and chaos meet.
              </p>
            </div>
            <button onClick={() => setStage(17)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              How do we know?
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 17
      title: "The universe remembers",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-4xl text-purple-100 mb-12 breathing-text">
              The universe remembers everything.
            </p>
            <div className="grid grid-cols-2 gap-10 max-w-5xl mb-12">
              <div className="cosmic-card p-10 bg-yellow-900/20 border-yellow-500/30">
                <div className="text-6xl mb-6 text-center float-slow">☀️</div>
                <h3 className="text-3xl text-yellow-200 mb-6 text-center">The Sun</h3>
                <p className="text-xl text-yellow-200 mb-6 text-center">Close to center</p>
                <div className="space-y-2 mb-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-2 bg-green-400 rounded pulse-bar" style={{animationDelay: `${i * 0.2}s`}}></div>
                  ))}
                </div>
                <p className="text-green-300 text-center text-xl">Steady rhythm. Predictable.</p>
                <p className="text-yellow-200 text-center italic mt-3">Love is strong here.</p>
              </div>
              <div className="cosmic-card p-10 bg-blue-900/20 border-blue-500/30">
                <div className="text-6xl mb-6 text-center float-slow" style={{animationDelay: '0.5s'}}>🌍</div>
                <h3 className="text-3xl text-blue-200 mb-6 text-center">Earth</h3>
                <p className="text-xl text-blue-200 mb-6 text-center">Far from center</p>
                <div className="space-y-2 mb-6">
                  {[4, 9, 2, 8, 3, 7, 5, 6].map((h, i) => (
                    <div key={i} className="h-2 rounded" style={{ 
                      width: `${h * 12}%`,
                      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
                    }}></div>
                  ))}
                </div>
                <p className="text-red-300 text-center text-xl">Irregular. Unpredictable.</p>
                <p className="text-blue-200 text-center italic mt-3">Chaos fights back here.</p>
              </div>
            </div>
            <div className="cosmic-card p-10 bg-purple-900/20 border-purple-500/30 max-w-4xl">
              <p className="text-3xl text-pink-200 mb-6 breathing-text">The Evidence</p>
              <p className="text-2xl text-purple-100 leading-loose">
                The closer you are to love, the steadier your rhythm.<br/>
                The further away, the more chaos pulls at you.
              </p>
            </div>
            <button onClick={() => setStage(18)} className="cosmic-btn text-xl px-12 py-4 mt-12">
              Now it's your turn
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 18
      title: "Your turn",
      content: (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-5xl font-light text-purple-100 mb-12 breathing-text">
              Can you create the force<br/>that brings things home?
            </p>
            <div className="cosmic-card p-12 max-w-5xl bg-purple-900/20 border-purple-500/30">
              <p className="text-3xl text-cyan-200 mb-12 text-center">The Laboratory of Love</p>
              <button onClick={() => setStage(19)} className="cosmic-btn text-2xl px-16 py-6 pulse-soft">
                Enter the Lab
              </button>
            </div>
          </div>
        </div>
      )
    },
    { // STAGE 19 - LAB (NO BACKEND NEEDED)
      title: "The Lab",
      content: (
        <div className="page-turn">
          <div className="cosmic-page max-w-6xl">
            <p className="text-4xl text-purple-100 mb-12 text-center breathing-text">
              Creating the Force of Return
            </p>
            <div className="cosmic-card p-12 mb-8">
              <p className="text-2xl text-cyan-200 mb-8 text-center">
                Adjust the forces. Can you make it return?
              </p>
              <div className="space-y-8">
                <div>
                  <label className="text-purple-200 text-2xl mb-4 block">
                    💫 Pull of Love: <span className="text-cyan-300 font-bold">{pullStrength.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0" max="3" step="0.1" value={pullStrength} onChange={(e) => setPullStrength(parseFloat(e.target.value))} className="cosmic-slider w-full" />
                </div>
                <div>
                  <label className="text-purple-200 text-2xl mb-4 block">
                    🌪️ Force of Chaos: <span className="text-red-300 font-bold">{chaosResistance.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0" max="3" step="0.1" value={chaosResistance} onChange={(e) => setChaosResistance(parseFloat(e.target.value))} className="cosmic-slider w-full" />
                </div>
                <div>
                  <label className="text-purple-200 text-2xl mb-4 block">
                    📏 Distance from Home: <span className="text-yellow-300 font-bold">{distanceFromLove.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0.1" max="10" step="0.1" value={distanceFromLove} onChange={(e) => setDistanceFromLove(parseFloat(e.target.value))} className="cosmic-slider w-full" />
                </div>
              </div>
              <div className={`mt-12 p-10 rounded-2xl border-2 ${canReturn ? 'bg-green-900/20 border-green-500/40' : 'bg-red-900/20 border-red-500/40'}`}>
                <p className="text-3xl mb-6 text-center">
                  {canReturn ? '✨ It will return home' : '💔 Lost forever'}
                </p>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300" style={{ width: `${returnProbability * 100}%` }}></div>
                </div>
                <p className="text-xl text-center text-purple-200">
                  Probability of Return: <span className="text-cyan-300 font-bold">{(returnProbability * 100).toFixed(0)}%</span>
                </p>
                <p className="text-lg text-center text-purple-400 mt-6 italic">
                  {returnProbability > 0.8 ? 'Love is strong. It will always find its way back.' :
                   returnProbability > 0.5 ? 'Love and chaos are balanced. It might return.' :
                   'Chaos is winning. It's drifting away.'}
                </p>
              </div>
            </div>
            <button onClick={() => setStage(20)} className="cosmic-btn text-2xl px-16 py-6 mt-12">
              The Final Truth →
            </button>
          </div>
        </div>
      )
    },
    { // STAGE 20 - FINALE
      title: "The truth",
      content: !finalReveal ? (
        <div className="page-turn">
          <div className="cosmic-page">
            <p className="text-6xl font-extralight text-purple-100 mb-12 breathing-text">
              One last thing.
            </p>
            <div className="space-y-10 max-w-4xl">
              <p className="text-3xl text-purple-200 leading-relaxed">
                You've learned about chaos and order.
              </p>
              <p className="text-3xl text-purple-200 leading-relaxed">
                About moving forward and coming home.
              </p>
              <p className="text-3xl text-purple-200 leading-relaxed">
                About the shape that love creates.
              </p>
              <p className="text-4xl text-cyan-200 mt-12 breathing-text">
                But who creates the love?
              </p>
            </div>
            <button onClick={() => { setFinalReveal(true); setShake(true); setTimeout(() => setShake(false), 2000); }} className="cosmic-btn text-3xl px-20 py-8 mt-16 pulse-soft">
              REVEAL 💥
            </button>
          </div>
        </div>
      ) : (
        <div className={`final-reveal ${shake ? 'screen-shake' : ''}`}>
          <div className="cosmic-page">
            <div className="explosion-container mb-16">
              {[...Array(60)].map((_, i) => {
                const angle = (i * 360 / 60) * (Math.PI / 180);
                return (
                  <div key={i} className="explosion-ray" style={{
                    '--angle': `${angle}rad`,
                    '--delay': `${i * 0.015}s`,
                    '--color': `hsl(${i * 6}, 85%, 65%)`
                  }}></div>
                );
              })}
            </div>
            <div className="text-9xl mb-12 pulse-strong glow-text">∞</div>
            <div className="space-y-12 max-w-5xl">
              <p className="text-6xl text-cyan-100 font-light reveal-text breathing-text">
                You.
              </p>
              <p className="text-4xl text-purple-200 reveal-text" style={{animationDelay: '1s'}}>
                You are the center.<br/>
                You are the pull home.
              </p>
              <p className="text-4xl text-pink-200 reveal-text" style={{animationDelay: '2s'}}>
                Every time you love,<br/>
                you create a loop.
              </p>
              <p className="text-4xl text-yellow-200 reveal-text" style={{animationDelay: '3s'}}>
                Every time you remember,<br/>
                something returns.
              </p>
              <p className="text-7xl text-white reveal-text glow-text" style={{animationDelay: '4s'}}>
                💥 BOOM 💥
              </p>
              <p className="text-3xl text-purple-200 reveal-text italic" style={{animationDelay: '5s'}}>
                The universe exhales.<br/>
                You were the breath all along.
              </p>
            </div>
            <div className="flex gap-12 justify-center mt-20 reveal-text" style={{animationDelay: '6s'}}>
              <button onClick={() => { setStage(0); setFinalReveal(false); setCount(0); setCounting(false); setShowCircle(false); setShowInfinity(false); setExplosionProgress(0); setLoopsCount(1); }} className="cosmic-btn text-2xl px-16 py-6">
                Read Again ∞
              </button>
              <button onClick={() => setStage(19)} className="cosmic-btn text-2xl px-16 py-6">
                Back to Lab ⚗️
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/30 via-blue-950/40 to-indigo-950/30"></div>
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-purple-900/15 to-blue-900/25"></div>
      <div className="starfield">
        {[...Array(200)].map((_, i) => (
          <div key={i} className="star" style={{ 
            width: `${Math.random() * 2.5 + 0.5}px`,
            height: `${Math.random() * 2.5 + 0.5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#c084fc',
            opacity: Math.random() * 0.7 + 0.2,
            boxShadow: `0 0 ${Math.random() * 5 + 2}px currentColor`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 5}s`
          }} />
        ))}
      </div>
      <div className="progress-dots">
        {stages.map((_, i) => (
          <div key={i} className={`progress-dot ${i === stage ? 'active' : i < stage ? 'complete' : ''}`} />
        ))}
      </div>
      <div className="content-wrapper">
        {stages[stage]?.content}
      </div>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
        @keyframes number-drift { 0% { opacity: 0; transform: translateX(-20px); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateX(20px); } }
        @keyframes pulse-soft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes pulse-strong { 0%, 100% { transform: scale(1); box-shadow: 0 0 30px currentColor; } 50% { transform: scale(1.1); box-shadow: 0 0 60px currentColor; } }
        @keyframes pulse-bar { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes ripple { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes page-turn { from { opacity: 0; transform: translateX(50px) rotateY(20deg); } to { opacity: 1; transform: translateX(0) rotateY(0); } }
        @keyframes fade-in-slow { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathing-text { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes reveal-text { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes screen-shake { 0%, 100% { transform: translate(0); } 10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 5px); } 20%, 40%, 60%, 80% { transform: translate(5px, -5px); } }
        @keyframes explosion-burst { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(calc(cos(var(--angle)) * 500px), calc(sin(var(--angle)) * 500px)) scale(0); opacity: 0; } }
        
        .star { position: absolute; border-radius: 50%; animation: twinkle infinite; }
        .starfield { position: fixed; inset: 0; pointer-events: none; }
        .float-slow { animation: float-slow 4s ease-in-out infinite; }
        .number-drift { animation: number-drift 3s ease-out forwards; }
        .pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .pulse-strong { animation: pulse-strong 2s ease-in-out infinite; }
        .pulse-bar { animation: pulse-bar 2s ease-in-out infinite; }
        .ripple { animation: ripple 2s ease-in-out infinite; }
        .orbital { animation: spin linear infinite; }
        .page-turn { animation: page-turn 0.8s ease-out; }
        .fade-in-slow { animation: fade-in-slow 1.2s ease-out; }
        .breathing-text { animation: breathing-text 4s ease-in-out infinite; }
        .reveal-text { animation: reveal-text 1s ease-out forwards; opacity: 0; }
        .screen-shake { animation: screen-shake 0.5s ease-in-out; }
        
        .glow-text { text-shadow: 0 0 25px currentColor, 0 0 50px currentColor; }
        .glow-strong { box-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
        
        .cosmic-btn { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
          border: 2px solid rgba(139, 92, 246, 0.6);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: all 0.4s ease;
          color: white;
          font-weight: 300;
        }
        .cosmic-btn:hover { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
          border-color: rgba(139, 92, 246, 0.9);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          transform: translateY(-4px);
        }
        
        .cosmic-card {
          background: rgba(17, 24, 39, 0.5);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          transition: all 0.4s ease;
        }
        .cosmic-card:hover { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 0 30px rgba(139, 92, 246, 0.3); }
        .hover-lift { transition: transform 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px); }
        
        .cosmic-page { padding: 3rem; max-width: 90vw; margin: 0 auto; }
        .content-wrapper { position: relative; z-index: 10; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        
        .progress-dots { position: fixed; top: 2rem; right: 2rem; display: flex; gap: 0.5rem; z-index: 20; }
        .progress-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: rgba(139, 92, 246, 0.3); transition: all 0.3s ease; }
        .progress-dot.active { background: #60a5fa; transform: scale(2); box-shadow: 0 0 15px #60a5fa; }
        .progress-dot.complete { background: #8b5cf6; }
        
        .cosmic-slider { height: 12px; appearance: none; background: rgba(139, 92, 246, 0.2); border-radius: 10px; outline: none; }
        .cosmic-slider::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; background: linear-gradient(135deg, #a78bfa, #60a5fa); border-radius: 50%; cursor: pointer; box-shadow: 0 0 20px rgba(168, 139, 250, 0.8); }
        
        .explosion-container { position: relative; width: 200px; height: 200px; margin: 0 auto; }
        .explosion-ray { position: absolute; width: 6px; height: 6px; background: var(--color); border-radius: 50%; top: 50%; left: 50%; animation: explosion-burst 1.5s ease-out forwards; animation-delay: var(--delay); box-shadow: 0 0 20px var(--color); }
        
        .final-reveal { animation: fade-in-slow 2s ease-out; }
      `}</style>
    </div>
  );
};

ReactDOM.render(<CosmicJourney />, document.getElementById('root'));