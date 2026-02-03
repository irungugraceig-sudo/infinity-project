const { useState, useEffect, useRef } = React;

const CosmicJourney = () => {
  const [stage, setStage] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [showInfinity, setShowInfinity] = useState(false);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [loopsCount, setLoopsCount] = useState(1);
  
  // Lab state
  const [distance, setDistance] = useState(1.0);
  const [singularity, setSingularity] = useState(1.0);
  const [chaosForce, setChaosForce] = useState(1.0);
  const [prediction, setPrediction] = useState(null);
  const [planetsData, setPlanetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000');
  
  const canvasRef = useRef(null);

  // Fetch planets data on mount
  useEffect(() => {
    fetch(`${apiUrl}/api/data/planets`)
      .then(res => res.json())
      .then(data => setPlanetsData(data))
      .catch(err => console.log('Backend not connected:', err));
  }, [apiUrl]);

  // Fetch prediction when lab params change
  useEffect(() => {
    if (stage === 19) {
      setLoading(true);
      fetch(`${apiUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distance_au: distance,
          singularity_strength: singularity,
          chaos_force: chaosForce
        })
      })
        .then(res => res.json())
        .then(data => {
          setPrediction(data);
          setLoading(false);
        })
        .catch(err => {
          console.log('Prediction failed:', err);
          setLoading(false);
        });
    }
  }, [distance, singularity, chaosForce, stage, apiUrl]);

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
    {
      content: (
        <div className="flex flex-col items-center justify-center space-y-12 text-center max-w-3xl mx-auto px-8">
          <h1 className="text-5xl font-light text-purple-200 leading-relaxed">
            A conversation about returning to zero
          </h1>
          <p className="text-2xl text-purple-400 leading-relaxed">
            What if everything you thought about chaos and order was backwards?
          </p>
          <button onClick={() => setStage(1)} className="px-10 py-4 bg-purple-900/30 hover:bg-purple-800/40 text-purple-200 rounded-lg text-xl transition-all border border-purple-600/40">
            Begin
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
                <div className="text-4xl mb-4">{item.emoji}</div>
                <p className="text-xl text-purple-200 mb-2">{item.label}</p>
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
                <div className="text-4xl mb-4">{item.emoji}</div>
                <p className="text-xl text-blue-200 mb-2">{item.label}</p>
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
          <div className="text-9xl font-mono text-purple-300 glow-text">0</div>
          <p className="text-2xl text-purple-300 leading-relaxed">You begin here</p>
          <button onClick={() => setStage(4)} className="px-10 py-4 bg-purple-900/30 hover:bg-purple-800/40 text-purple-200 rounded-lg text-xl transition-all border border-purple-600/40">Move forward</button>
        </div>
      )
    }
  ];

  // Add more stages here (4-20)... copying from the artifact

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-blue-950/20 to-indigo-950/20"></div>
      <div className="fixed inset-0">
        {[...Array(150)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: `${Math.random() * 2 + 0.5}px`, height: `${Math.random() * 2 + 0.5}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, backgroundColor: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#c084fc', opacity: Math.random() * 0.6 + 0.2, boxShadow: `0 0 ${Math.random() * 3 + 1}px ${i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#c084fc'}`, animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 3}s` }} />
        ))}
      </div>
      <div className="fixed top-8 right-8 flex space-x-2 z-20">
        {stages.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === stage ? 'bg-cyan-400 scale-150 shadow-lg shadow-cyan-400/50' : i < stage ? 'bg-purple-500 shadow-sm shadow-purple-500/50' : 'bg-purple-900/30'}`} />
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glow-text {
          text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
        }
        .glow-strong {
          box-shadow: 0 0 30px #fbbf24, 0 0 60px #fbbf24;
        }
      `}</style>
    </div>
  );
};

ReactDOM.render(<CosmicJourney />, document.getElementById('root'));