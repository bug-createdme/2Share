import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import Card3D from '../Card3D';
import DiscloseImage from '../animate-ui/components/image/disclose-image';
import AuroraText from '../animate-ui/components/text/aurora-text';
import TypingText from '../animate-ui/components/text/typing-text';

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [rawName, setRawName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  // Very light slugify for username: trim, lowercase, remove spaces -> '-', strip accents
  const slugify = (s: string) => {
    const noAccent = s
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .replace(/đ/gi, 'd');
    return noAccent
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 20);
  };

  const username = useMemo(() => slugify(rawName), [rawName]);

  // Check username availability by trying to fetch portfolio with that slug
  // If portfolio exists, username is taken. If 404 or null, username is available.
  useEffect(() => {
    if (!username || username.length < 4) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://2share.icu/portfolios/get-portfolio/${encodeURIComponent(username)}`);
        
        // 404 means portfolio doesn't exist -> username available
        if (response.status === 404) {
          setIsAvailable(true);
          setIsChecking(false);
          return;
        }
        
        const data = await response.json();
        
        // If 200 OK and result exists, username is taken
        // If result is null/undefined, username is available
        const portfolioExists = response.ok && data.result !== null && data.result !== undefined;
        setIsAvailable(!portfolioExists);
      } catch (error) {
        console.error('Username check error:', error);
        // On network error, assume available (will be validated on backend anyway)
        setIsAvailable(true);
      } finally {
        setIsChecking(false);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timer);
  }, [username]);

  const goRegister = () => {
    if (!username || username.length < 4) {
      return;
    }
    if (isAvailable === false) {
      // Username already taken
      return;
    }
    navigate(`/register?username=${encodeURIComponent(username)}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 max-w-3xl">
          <h1 className="text-[#D48A8A] font-['Unbounded'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] sm:leading-[1.3] md:leading-[1.4] lg:leading-[80px] mb-4 sm:mb-6 md:mb-8 font-semibold text-center md:text-left">
            Không còn hỏi<br />
            'Link ở đâu?'<br />
            chỉ cần <AuroraText className="inline">2Share!</AuroraText>
          </h1>
          
          <div className="text-[#440808] font-spartan text-lg sm:text-xl md:text-2xl leading-[1.4] sm:leading-[1.5] md:leading-[30px] mb-6 sm:mb-8 md:mb-12 max-w-2xl text-center md:text-left">
            <TypingText
              text="Tạo hồ sơ cá nhân siêu tốc, gom mọi liên kết quan trọng về một nơi. Chia sẻ profile của bạn qua link, QR hoặc NFC – cực tiện lợi, cực chuyên nghiệp."
              smooth={true}
              delay={50}
              repeat={true}
              waitTime={3000}
              className="!font-spartan !text-lg sm:!text-xl md:!text-2xl"
              grow={true}
              hideCursorOnComplete={false}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="input-glow-focus bg-[#ece6e6] rounded-[10px] py-3 sm:py-4 pl-4 sm:pl-6 pr-2 flex items-center w-full sm:w-[270px] relative">
              <span className="text-[#A18686] font-['League_Spartan'] font-bold text-lg sm:text-xl mr-1 sm:mr-2 select-none">
                2sha.re/
              </span>
              <input
                type="text"
                placeholder="tên-của-bạn"
                value={rawName}
                onChange={(e) => setRawName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') goRegister(); }}
                className="bg-transparent outline-none text-[#A18686] font-['League_Spartan'] font-bold text-lg sm:text-xl flex-1 min-w-0 placeholder-[#A18686]"
                style={{ paddingLeft: 0 }}
              />
              {/* Checking indicator */}
              {isChecking && username.length >= 4 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#A18686] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {/* Available indicator */}
              {!isChecking && isAvailable === true && username.length >= 4 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {/* Unavailable indicator */}
              {!isChecking && isAvailable === false && username.length >= 4 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={goRegister}
              disabled={isChecking || (username.length >= 4 && isAvailable === false)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="group relative bg-[#dea2a2] text-black font-['League_Spartan'] font-bold text-lg sm:text-xl px-4 sm:px-8 py-3 sm:py-4 rounded-[15px] sm:rounded-[20px] hover:bg-[#B88484] transition-colors transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Nhận tên của bạn
              {!!particleState && (
                <Particles
                  id="whatever"
                  className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
                  particlesLoaded={async () => {
                    setParticlesReady("ready");
                  }}
                  options={modifiedOptions}
                />
              )}
            </button>
          </div>
          {/* Hint messages */}
          {username && username.length >= 4 && (
            <div className="mt-3 space-y-1 text-center md:text-left">
              <div className="text-xs sm:text-sm text-[#A18686]">
                Tên đề xuất: <span className="font-semibold">{username}</span>
              </div>
              {!isChecking && isAvailable === false && (
                <div className="text-xs sm:text-sm text-red-600 font-semibold">
                  ❌ Tên này đã có người sử dụng. Vui lòng chọn tên khác.
                </div>
              )}
              {!isChecking && isAvailable === true && (
                <div className="text-xs sm:text-sm text-green-600 font-semibold">
                  ✅ Tên này có sẵn! Bạn có thể đăng ký.
                </div>
              )}
            </div>
          )}
          {username && username.length > 0 && username.length < 4 && (
            <div className="mt-2 text-xs sm:text-sm text-orange-600 text-center md:text-left">
              Tên người dùng phải có ít nhất 4 ký tự
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 lg:ml-16">
          <DiscloseImage
            src="/images/hero-custom.png"
            alt="Mobile App Preview"
            containerClassName="w-[240px] sm:w-[280px] md:w-[340px] lg:w-[400px] h-[360px] sm:h-[420px] md:h-[510px] lg:h-[600px]"
            doorClassName="!bg-[#D48A8A]"
            onError={(e) => { 
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null; 
              target.src = 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/MFrg9GUwY3.png'; 
            }}
          />
        </div>
      </div>

      {/* 3D Card Carousel Section */}
      <div className="mt-16 sm:mt-20 md:mt-24">
        <div className="text-center mb-8">
          <h2 className="text-[#D48A8A] font-['Unbounded'] text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
            Chia sẻ mọi liên kết của bạn
          </h2>
          <p className="text-[#440808] font-spartan text-base sm:text-lg md:text-xl">
            Tất cả trong một nơi, dễ dàng truy cập
          </p>
        </div>
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[510px] lg:h-[600px]">
          <Card3D images={[
            '/images/card1.png',
            '/images/card2.png',
            '/images/card3.png',
            '/images/card4.png',
            '/images/card5.png',
            '/images/card6.png',
            '/images/card7.png',
            '/images/card8.png',
            '/images/card9.png',
            '/images/card10.png',
          ]} />
        </div>
      </div>
    </main>
  )
}

export default Hero
