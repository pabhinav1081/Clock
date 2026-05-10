import { useState, useEffect } from 'react';
import { Palette, Maximize, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const themes = [
  {
    name: 'Golden Hour',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 100%)',
    text: '#1a1a1a',
    textSecondary: '#404040',
  },
  {
    name: 'Midnight Blue',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
  },
  {
    name: 'Elegant Gray',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    text: '#1e293b',
    textSecondary: '#475569',
  },
  {
    name: 'Lavender Dream',
    background: 'linear-gradient(135deg, #fae8ff 0%, #e9d5ff 30%, #d8b4fe 70%, #c084fc 100%)',
    text: '#581c87',
    textSecondary: '#7c3aed',
  },
  {
    name: 'Rose Quartz',
    background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 30%, #fda4af 70%, #fb7185 100%)',
    text: '#881337',
    textSecondary: '#be123c',
  },
  {
    name: 'Mint Fresh',
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #6ee7b7 70%, #34d399 100%)',
    text: '#064e3b',
    textSecondary: '#047857',
  },
  {
    name: 'Ocean Depth',
    background: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 30%, #075985 70%, #0284c7 100%)',
    text: '#e0f2fe',
    textSecondary: '#bae6fd',
  },
  {
    name: 'Sunset Bliss',
    background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 25%, #fb923c 50%, #f97316 75%, #ea580c 100%)',
    text: '#431407',
    textSecondary: '#7c2d12',
  },
  {
    name: 'Forest Night',
    background: 'linear-gradient(135deg, #14532d 0%, #166534 30%, #15803d 70%, #16a34a 100%)',
    text: '#f0fdf4',
    textSecondary: '#dcfce7',
  },
  {
    name: 'Pastel Sky',
    background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 20%, #a78bfa 40%, #fbbf24 60%, #fb923c 80%, #f87171 100%)',
    text: '#1f2937',
    textSecondary: '#374151',
  },
  {
    name: 'Dark Graphite',
    background: 'linear-gradient(135deg, #18181b 0%, #27272a 30%, #3f3f46 70%, #52525b 100%)',
    text: '#f4f4f5',
    textSecondary: '#a1a1aa',
  },
];

export default function App() {
  const [time, setTime] = useState(new Date());
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('clockTheme');
    return saved ? parseInt(saved) : 10;
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('clock24Hour');
    return saved ? saved === 'true' : true;
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);


  // Update favicon with time
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);

      // Draw background circle
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw time text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const timeStr = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      }).replace(/\s/g, '');
      ctx.fillText(timeStr.slice(0, 5), 32, 32);

      // Update favicon - reuse existing or create new
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = canvas.toDataURL();
    }
  }, [time, is24Hour]);

  const formatTime = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      const pad = (num: number) => num.toString().padStart(2, '0');

      return `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Update page title with current time
  useEffect(() => {
    document.title = `${formatTime(time)} - Clock`;
  }, [time, is24Hour]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('clockTheme', currentTheme.toString());
  }, [currentTheme]);

  // Save time format preference
  useEffect(() => {
    localStorage.setItem('clock24Hour', is24Hour.toString());
  }, [is24Hour]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent action if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number keys 1-9 for themes 1-9 (index 0-8)
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < themes.length) {
          setCurrentTheme(index);
        }
      }
      // 0 key for theme 10 (index 9)
      else if (e.key === '0') {
        if (themes.length > 9) {
          setCurrentTheme(9);
        }
      }
      // - (minus) key for theme 11 (index 10)
      else if (e.key === '-' || e.key === '_') {
        if (themes.length > 10) {
          setCurrentTheme(10);
        }
      }
      // Arrow keys for theme navigation
      else if (e.key === 'ArrowRight') {
        setCurrentTheme((prev) => (prev + 1) % themes.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentTheme((prev) => (prev - 1 + themes.length) % themes.length);
      }
      // F key for fullscreen
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // T key for time format toggle
      else if (e.key === 't' || e.key === 'T') {
        setIs24Hour((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement &&
        !(document as any).webkitFullscreenElement &&
        !(document as any).mozFullScreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Silently fail if fullscreen is not allowed
        });
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const theme = themes[currentTheme];
  const isDarkTheme = ['Midnight Blue', 'Ocean Depth', 'Forest Night', 'Dark Graphite'].includes(theme.name);

  return (
    <div
      className="size-full flex items-center justify-center relative transition-all duration-700"
      style={{ background: theme.background }}
    >
      {!isFullscreen && (
        <div className="absolute top-8 right-8 flex gap-3">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="p-3 rounded-full transition-all duration-300 backdrop-blur-sm bg-black/10 hover:bg-black/20"
            style={{ color: theme.text }}
            aria-label="Toggle time format"
            title="Toggle 12/24 hour (T)"
          >
            <Clock size={24} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full transition-all duration-300 backdrop-blur-sm bg-black/10 hover:bg-black/20"
            style={{ color: theme.text }}
            aria-label="Toggle fullscreen"
            title="Fullscreen (F)"
          >
            <Maximize size={24} />
          </button>
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="p-3 rounded-full transition-all duration-300 backdrop-blur-sm bg-black/10 hover:bg-black/20"
            style={{ color: theme.text }}
            aria-label="Change theme"
            title="Change theme (1-9, 0, -, ←→)"
          >
            <Palette size={24} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 right-8 backdrop-blur-md rounded-2xl p-4 shadow-2xl"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <div className="grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
              {themes.map((t, index) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setCurrentTheme(index);
                    setShowThemeSelector(false);
                  }}
                  className="group relative overflow-hidden rounded-xl w-32 h-24 transition-all duration-300 hover:scale-105"
                  style={{ background: t.background }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm"
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        color: '#fff',
                      }}
                    >
                      {t.name}
                    </span>
                  </div>
                  {currentTheme === index && (
                    <div className="absolute inset-0 border-4 border-white rounded-xl" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-6">
        <motion.time
          className="text-[12rem] leading-none tracking-tight transition-colors duration-700 cursor-pointer select-none"
          style={{
            fontFamily: 'Outfit, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 200,
            color: theme.text,
            textShadow: isDarkTheme ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
          }}
          onClick={() => setIsZoomed(!isZoomed)}
          animate={{ scale: isZoomed ? 1.15 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {formatTime(time)}
        </motion.time>
        <motion.div
          className="text-3xl tracking-wider transition-colors duration-700"
          style={{
            fontFamily: 'Outfit, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 300,
            color: theme.textSecondary,
            textShadow: isDarkTheme ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.05)'
          }}
          animate={{ scale: isZoomed ? 1.1 : 1, opacity: isZoomed ? 0.7 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {formatDate(time)}
        </motion.div>
      </div>

      {!isFullscreen && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p
            className="text-xs tracking-wide transition-colors duration-700 opacity-40"
            style={{
              fontFamily: 'Outfit, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 300,
              color: theme.text,
            }}
          >
            yesthings
          </p>
        </div>
      )}
    </div>
  );
}