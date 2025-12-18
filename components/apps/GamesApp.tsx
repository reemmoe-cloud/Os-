import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '../ui/Icons';

// --- Types ---
interface GameDefinition {
  id: string;
  title: string;
  description: string;
  players: string;
  color: string;
  icon?: React.ReactNode;
}

// --- Yellow Jumper (Doodle Jump Clone) ---
const JumperGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState({ x: 150, y: 300, vy: 0 });
  const [platforms, setPlatforms] = useState<{ x: number; y: number; id: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const mouseX = useRef(150);

  const GRAVITY = 0.25;
  const JUMP_STRENGTH = -10;
  const WIDTH = 300;
  const HEIGHT = 500;

  const init = useCallback(() => {
    const initialPlatforms = [];
    for (let i = 0; i < 7; i++) {
      initialPlatforms.push({ x: Math.random() * (WIDTH - 60), y: i * 80, id: i });
    }
    setPlatforms(initialPlatforms);
    setPlayer({ x: 150, y: 300, vy: 0 });
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const update = useCallback(() => {
    if (gameOver) return;

    setPlayer(p => {
      let newVy = p.vy + GRAVITY;
      let newY = p.y + newVy;
      let newX = mouseX.current;

      // Wrap edges
      if (newX < 0) newX = WIDTH;
      if (newX > WIDTH) newX = 0;

      // Platform Collision
      if (newVy > 0) {
        platforms.forEach(plat => {
          if (
            p.x + 30 > plat.x && 
            p.x < plat.x + 60 && 
            p.y + 40 > plat.y && 
            p.y + 40 < plat.y + 15
          ) {
            newVy = JUMP_STRENGTH;
          }
        });
      }

      // Camera Follow / Move platforms
      if (newY < 200) {
        const diff = 200 - newY;
        newY = 200;
        setPlatforms(prev => {
          const moved = prev.map(pl => ({ ...pl, y: pl.y + diff }));
          if (moved[moved.length - 1].y > HEIGHT) {
            setScore(s => s + 10);
            moved.pop();
            moved.unshift({ x: Math.random() * (WIDTH - 60), y: moved[0].y - 80, id: Date.now() });
          }
          return moved;
        });
      }

      if (newY > HEIGHT + 50) setGameOver(true);

      return { x: newX, y: newY, vy: newVy };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [gameOver, platforms]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  return (
    <div 
      className="absolute inset-0 bg-yellow-50 overflow-hidden flex flex-col items-center justify-center font-sans"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.current = e.clientX - rect.left - 15;
      }}
    >
      <div className="absolute top-4 left-4 z-20">
        <button onClick={onExit} className="bg-white/80 p-2 rounded-full shadow-md"><Icons.Back size={20}/></button>
      </div>
      <div className="absolute top-4 right-4 bg-yellow-400 px-4 py-1 rounded-full font-bold shadow-sm z-20">Score: {score}</div>

      <div className="relative bg-white shadow-2xl overflow-hidden border-4 border-yellow-200" style={{ width: WIDTH, height: HEIGHT }}>
        {/* Platforms */}
        {platforms.map(p => (
          <div key={p.id} className="absolute bg-green-500 h-3 rounded-full shadow-sm" style={{ left: p.x, top: p.y, width: 60 }} />
        ))}
        {/* Player */}
        <div className="absolute bg-red-500 rounded-xl shadow-lg flex items-center justify-center text-xs text-white font-bold" style={{ left: player.x, top: player.y, width: 30, height: 40 }}>
           ^‿^
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30">
            <h2 className="text-3xl font-black mb-2">SPLAT!</h2>
            <p className="mb-6">Score: {score}</p>
            <button onClick={init} className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Retry</button>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-gray-400 font-medium">Move mouse to jump higher!</p>
    </div>
  );
};

// --- Speed Racer 2D ---
const RacerGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [carX, setCarX] = useState(125);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  const requestRef = useRef<number>(0);
  const targetX = useRef(125);

  const WIDTH = 250;
  const HEIGHT = 500;

  const init = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setObstacles([]);
    setCarX(125);
    targetX.current = 125;
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (gameOver) return;
    const spawner = setInterval(() => {
      setObstacles(prev => [
        ...prev, 
        { id: Date.now(), x: Math.random() * (WIDTH - 40), y: -100, speed: 5 + score / 100 }
      ]);
    }, 1000);
    return () => clearInterval(spawner);
  }, [gameOver, score]);

  const update = useCallback(() => {
    if (gameOver) return;

    setCarX(curr => curr + (targetX.current - curr) * 0.2);

    setObstacles(prev => {
      const next = prev.map(o => ({ ...o, y: o.y + o.speed })).filter(o => o.y < HEIGHT + 100);
      
      // Collision
      next.forEach(o => {
        if (Math.abs(o.x - targetX.current) < 35 && Math.abs(o.y - 400) < 50) {
          setGameOver(true);
        }
      });

      return next;
    });

    setScore(s => s + 1);
    requestRef.current = requestAnimationFrame(update);
  }, [gameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  return (
    <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center select-none" 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left - 20;
        targetX.current = Math.max(10, Math.min(WIDTH - 50, x));
      }}
    >
      <div className="absolute top-4 left-4 z-20"><button onClick={onExit} className="bg-white/20 p-2 rounded-full text-white"><Icons.Back size={20}/></button></div>
      <div className="absolute top-4 right-4 bg-white/10 text-white px-4 py-1 rounded-full font-bold backdrop-blur-md">KM: {Math.floor(score/10)}</div>

      <div className="relative bg-slate-700 w-[250px] h-[500px] border-x-4 border-dashed border-white/20 overflow-hidden shadow-2xl">
        {/* Road Stripes */}
        <div className="absolute inset-0 flex justify-center">
            <div className="w-1 h-full bg-yellow-500/20" />
        </div>

        {/* Obstacles */}
        {obstacles.map(o => (
          <div key={o.id} className="absolute bg-red-600 rounded-lg shadow-lg border-2 border-red-900" style={{ left: o.x, top: o.y, width: 40, height: 70 }}>
             <div className="absolute top-1 left-1 right-1 h-4 bg-sky-200/50 rounded-sm" />
             <div className="absolute bottom-1 left-1 w-2 h-1 bg-red-400" />
             <div className="absolute bottom-1 right-1 w-2 h-1 bg-red-400" />
          </div>
        ))}

        {/* Player Car */}
        <div className="absolute bg-yellow-400 rounded-lg shadow-xl border-2 border-yellow-600 z-10" style={{ left: carX, top: 400, width: 40, height: 70 }}>
            <div className="absolute top-1 left-1 right-1 h-4 bg-sky-100 rounded-sm" />
            <div className="absolute top-2 left-1 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-2 right-1 w-1 h-1 bg-white rounded-full animate-pulse" />
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-50">
            <h2 className="text-4xl font-black italic mb-2">WRECKED!</h2>
            <p className="mb-8 opacity-70">Distance: {Math.floor(score/10)}km</p>
            <button onClick={init} className="bg-white text-red-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform">Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Memory Cards ---
const CardsGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const symbols = ['🐱', '🍌', '🎮', '🍎', '💎', '🚀', '⭐', '🔥'];

  const initGame = useCallback(() => {
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => ({ id: index, symbol, isFlipped: false, isMatched: false }));
    setCards(deck); setFlippedIndices([]); setMoves(0); setMatches(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    const newCards = [...cards]; newCards[index].isFlipped = true; setCards(newCards);
    const newFlipped = [...flippedIndices, index]; setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, isMatched: true } : c));
          setMatches(m => m + 1); setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, isFlipped: false } : c));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-emerald-800 flex flex-col font-sans select-none overflow-hidden text-white">
      <div className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-full hover:bg-white/40"><Icons.Back size={20} /></button>
        <div className="flex gap-4 font-bold"><span>Moves: {moves}</span><span>Matches: {matches}/8</span></div>
        <button onClick={initGame} className="bg-white/20 p-2 rounded-full hover:bg-white/40"><Icons.Refresh size={20} /></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-4 gap-4 max-w-md w-full">
          {cards.map((card, i) => (
            <div key={card.id} onClick={() => handleCardClick(i)} className={`aspect-[3/4] relative cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}`}>
              <div className="absolute inset-0 bg-yellow-500 rounded-xl border-4 border-white shadow-lg flex items-center justify-center [backface-visibility:hidden]"><Icons.Star size={16} className="text-white/30" /></div>
              <div className="absolute inset-0 bg-white rounded-xl border-4 border-yellow-400 shadow-lg flex items-center justify-center text-4xl [backface-visibility:hidden] [transform:rotateY(180deg)]">{card.symbol}</div>
            </div>
          ))}
        </div>
      </div>
      {matches === 8 && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <h2 className="text-5xl font-black mb-4 text-yellow-400">WINNER!</h2>
            <button onClick={initGame} className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-full">Play Again</button>
        </div>
      )}
    </div>
  );
};

// --- Fruit Ninja ---
const FruitNinjaGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<{ id: number; x: number; y: number; vx: number; vy: number; type: 'fruit' | 'bomb'; emoji: string; isSliced: boolean }[]>([]);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const requestRef = useRef<number>(0);

  const spawnItem = useCallback(() => {
    if (!containerRef.current) return;
    const isBomb = Math.random() < 0.2;
    const emojis = ['🍎', '🍌', '🍉', '🍍', '🍊', '🥝'];
    const newItem = {
      id: nextId.current++,
      x: Math.random() * (containerRef.current.clientWidth - 100) + 50,
      y: containerRef.current.clientHeight + 50,
      vx: (Math.random() - 0.5) * 8,
      vy: -15 - Math.random() * 10,
      type: (isBomb ? 'bomb' : 'fruit') as 'bomb' | 'fruit',
      emoji: isBomb ? '💣' : emojis[Math.floor(Math.random() * emojis.length)],
      isSliced: false
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  useEffect(() => { const spawner = setInterval(spawnItem, 1200); return () => clearInterval(spawner); }, [spawnItem]);

  const update = useCallback(() => {
    if (lives <= 0) return;
    setItems(prev => prev.map(item => ({ ...item, x: item.x + item.vx, y: item.y + item.vy, vy: item.vy + 0.3 })).filter(item => {
      if (item.y > 1000 && !item.isSliced && item.type === 'fruit') setLives(l => l - 1);
      return item.y < 1200;
    }));
    requestRef.current = requestAnimationFrame(update);
  }, [lives]);

  useEffect(() => { requestRef.current = requestAnimationFrame(update); return () => cancelAnimationFrame(requestRef.current); }, [update]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || lives <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    setTrail(prev => [...prev.slice(-10), { x, y }]);
    setItems(prev => prev.map(item => {
      if (!item.isSliced && Math.abs(item.x - x) < 50 && Math.abs(item.y - y) < 50) {
        if (item.type === 'bomb') { setLives(0); return { ...item, isSliced: true }; }
        setScore(s => s + 10); return { ...item, isSliced: true };
      }
      return item;
    }));
  };

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-hidden select-none cursor-crosshair" ref={containerRef} onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <button onClick={onExit} className="bg-white/20 p-2 rounded-full text-white"><Icons.Back size={24} /></button>
        <div className="bg-yellow-500 px-6 py-2 rounded-full text-black font-black text-2xl shadow-lg">SCORE: {score}</div>
      </div>
      {items.map(item => (
        <div key={item.id} className="absolute text-6xl" style={{ left: item.x, top: item.y, transform: `translate(-50%, -50%) ${item.isSliced ? 'scale(1.5) opacity-0' : 'scale(1)'}` }}>{item.emoji}</div>
      ))}
      <svg className="absolute inset-0 pointer-events-none z-20"><polyline points={trail.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="6" className="opacity-60" /></svg>
      {lives <= 0 && <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-white"><h2 className="text-6xl font-black text-red-500">GAME OVER</h2><button onClick={() => { setScore(0); setLives(3); setItems([]); }} className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full">Try Again</button></div>}
    </div>
  );
};

// --- Block World ---
const BlockWorldGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const GRID_SIZE = 12;
  const [world, setWorld] = useState<Record<string, string>>({});
  const [selectedBlock, setSelectedBlock] = useState('grass');
  const [mode, setMode] = useState<'build' | 'erase'>('build');
  const blocks = [
    { id: 'grass', color: 'bg-emerald-500', name: 'Grass' },
    { id: 'dirt', color: 'bg-amber-800', name: 'Dirt' },
    { id: 'stone', color: 'bg-slate-500', name: 'Stone' },
    { id: 'wood', color: 'bg-orange-900', name: 'Wood' },
    { id: 'leaves', color: 'bg-green-600', name: 'Leaves' },
    { id: 'water', color: 'bg-blue-400', name: 'Water' },
    { id: 'sand', color: 'bg-yellow-200', name: 'Sand' },
  ];
  const handleTileClick = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (mode === 'erase') { const newWorld = { ...world }; delete newWorld[key]; setWorld(newWorld); } 
    else { setWorld({ ...world, [key]: selectedBlock }); }
  };
  return (
    <div className="absolute inset-0 bg-sky-300 flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-white/20 backdrop-blur-md z-10">
        <button onClick={onExit} className="bg-white/80 p-2 rounded-full"><Icons.Back size={20} /></button>
        <div className="flex gap-2">
          <button onClick={() => setMode('build')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${mode === 'build' ? 'bg-yellow-400' : 'bg-white/50'}`}>Build</button>
          <button onClick={() => setMode('erase')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${mode === 'erase' ? 'bg-red-500 text-white' : 'bg-white/50'}`}>Erase</button>
        </div>
        <button onClick={() => setWorld({})} className="bg-white/50 p-2 rounded-full"><Icons.Trash size={18} /></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid gap-0.5 bg-white/10 p-1 rounded-xl shadow-2xl" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, width: 'min(90vw, 90vh)', aspectRatio: '1/1' }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE; const y = Math.floor(i / GRID_SIZE); const b = blocks.find(b => b.id === world[`${x},${y}`]);
            return <div key={`${x},${y}`} onClick={() => handleTileClick(x, y)} className={`w-full h-full rounded-sm cursor-pointer border border-white/5 ${b ? b.color : 'bg-white/10 hover:bg-white/30'}`} />;
          })}
        </div>
      </div>
      <div className="p-6 bg-white/20 backdrop-blur-xl border-t border-white/20 flex gap-3 overflow-x-auto">
        {blocks.map((b) => <button key={b.id} onClick={() => { setSelectedBlock(b.id); setMode('build'); }} className={`flex flex-col items-center gap-1 transition-all ${selectedBlock === b.id && mode === 'build' ? 'scale-110' : 'opacity-70'}`}><div className={`w-12 h-12 rounded-xl ${b.color} border-2 ${selectedBlock === b.id ? 'border-yellow-400' : 'border-transparent'}`} /></button>)}
      </div>
    </div>
  );
};

// --- Pop the Balloon ---
const PopTheBalloonGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<{ id: number; x: number; y: number; speed: number; color: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500', 'bg-pink-500'];
  useEffect(() => {
    const spawn = setInterval(() => {
      if (!containerRef.current) return;
      setBalloons(prev => [...prev, { id: nextId.current++, x: Math.random() * (containerRef.current!.clientWidth - 60), y: containerRef.current!.clientHeight + 50, speed: 2 + Math.random() * 3, color: colors[Math.floor(Math.random() * colors.length)] }]);
    }, 800);
    return () => clearInterval(spawn);
  }, []);
  const update = useCallback(() => {
    setBalloons(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -100));
    requestAnimationFrame(update);
  }, []);
  useEffect(() => { const req = requestAnimationFrame(update); return () => cancelAnimationFrame(req); }, [update]);
  return (
    <div className="absolute inset-0 bg-sky-200 overflow-hidden" ref={containerRef}>
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10"><button onClick={onExit} className="bg-white/80 p-2 rounded-full shadow-md"><Icons.Back size={24} /></button><div className="bg-white/90 px-6 py-2 rounded-full shadow-lg font-bold text-sky-600">Score: {score}</div></div>
      {balloons.map(b => <div key={b.id} onClick={() => { setScore(s => s + 1); setBalloons(prev => prev.filter(bl => bl.id !== b.id)); }} className={`absolute w-14 h-16 rounded-full cursor-pointer shadow-lg active:scale-125 transition-transform ${b.color}`} style={{ left: b.x, top: b.y }} />)}
    </div>
  );
};

// --- Main App Component ---
export const GamesApp: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const GAMES_LIST: GameDefinition[] = [
    { id: 'balloon', title: 'Pop the Balloon', description: 'Classic carnival fun! Pop as many as you can.', players: '1.2k playing', color: 'bg-red-500' },
    { id: 'blox', title: 'Block World', description: 'Build anything you can imagine.', players: '45k playing', color: 'bg-blue-600' },
    { id: 'ninja', title: 'Fruit Ninja', description: 'Slice fruits, avoid bombs.', players: '3.4k playing', color: 'bg-orange-500' },
    { id: 'cards', title: 'Memory Cards', description: 'Match the symbols to win.', players: '500 playing', color: 'bg-emerald-600' },
    { id: 'racer', title: 'Speed Racer 2D', description: 'High octane top-down racing.', players: '8.9k playing', color: 'bg-slate-700' },
    { id: 'jump', title: 'Yellow Jumper', description: 'How high can you go?', players: '12k playing', color: 'bg-yellow-400' },
  ];

  if (activeGame === 'balloon') return <PopTheBalloonGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'blox') return <BlockWorldGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'ninja') return <FruitNinjaGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'cards') return <CardsGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'racer') return <RacerGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'jump') return <JumperGame onExit={() => setActiveGame(null)} />;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-bold flex items-center gap-3"><div className="bg-yellow-500 p-2 rounded-lg text-black"><Icons.Game size={24} /></div>Yellow Arcade</h1>
        <div className="flex items-center gap-4"><div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-yellow-400"><Icons.Trophy size={16} /> 1,240 Coins</div></div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="relative h-64 w-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-3xl overflow-hidden mb-8 shadow-2xl group cursor-pointer" onClick={() => setActiveGame('jump')}>
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-start z-10">
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4">New Release</span>
                <h2 className="text-5xl font-extrabold mb-2 text-white">Yellow Jumper</h2>
                <button className="bg-white text-yellow-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2">Play Now</button>
            </div>
        </div>
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Trending Now</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {GAMES_LIST.map((game) => (
                    <button key={game.id} onClick={() => setActiveGame(game.id)} className="group flex flex-col gap-3 text-left hover:bg-white/5 p-3 rounded-2xl transition-colors">
                        <div className={`aspect-square w-full ${game.color} rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-4xl`}>
                            {game.id === 'ninja' ? '🍎' : game.id === 'cards' ? '🎴' : game.id === 'racer' ? '🏎️' : game.id === 'jump' ? '🚀' : <Icons.Game size={48} />}
                        </div>
                        <div><h4 className="font-bold truncate text-lg">{game.title}</h4><p className="text-xs text-gray-400">{game.players}</p></div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};