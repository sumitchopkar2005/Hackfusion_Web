import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
        {/* Pokeball 1 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit1 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 2 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit2 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 3 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit3 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 4 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit4 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 5 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit5 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 6 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit6 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        {/* Pokeball 7 */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'orbit7 3s linear infinite'
          }}
        >
          <img
            src="hero-img.png"
            alt="pokeball"
            className="w-full h-full object-contain"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
        </div>

        <style>{`
          @keyframes orbit1 {
            from { transform: translate(-50%, -50%) rotate(0deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(360deg) translateX(60px); }
          }
          @keyframes orbit2 {
            from { transform: translate(-50%, -50%) rotate(51.43deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(411.43deg) translateX(60px); }
          }
          @keyframes orbit3 {
            from { transform: translate(-50%, -50%) rotate(102.86deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(462.86deg) translateX(60px); }
          }
          @keyframes orbit4 {
            from { transform: translate(-50%, -50%) rotate(154.29deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(514.29deg) translateX(60px); }
          }
          @keyframes orbit5 {
            from { transform: translate(-50%, -50%) rotate(205.71deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(565.71deg) translateX(60px); }
          }
          @keyframes orbit6 {
            from { transform: translate(-50%, -50%) rotate(257.14deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(617.14deg) translateX(60px); }
          }
          @keyframes orbit7 {
            from { transform: translate(-50%, -50%) rotate(308.57deg) translateX(60px); }
            to { transform: translate(-50%, -50%) rotate(668.57deg) translateX(60px); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (min-width: 640px) {
            @keyframes orbit1 {
              from { transform: translate(-50%, -50%) rotate(0deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(360deg) translateX(80px); }
            }
            @keyframes orbit2 {
              from { transform: translate(-50%, -50%) rotate(51.43deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(411.43deg) translateX(80px); }
            }
            @keyframes orbit3 {
              from { transform: translate(-50%, -50%) rotate(102.86deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(462.86deg) translateX(80px); }
            }
            @keyframes orbit4 {
              from { transform: translate(-50%, -50%) rotate(154.29deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(514.29deg) translateX(80px); }
            }
            @keyframes orbit5 {
              from { transform: translate(-50%, -50%) rotate(205.71deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(565.71deg) translateX(80px); }
            }
            @keyframes orbit6 {
              from { transform: translate(-50%, -50%) rotate(257.14deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(617.14deg) translateX(80px); }
            }
            @keyframes orbit7 {
              from { transform: translate(-50%, -50%) rotate(308.57deg) translateX(80px); }
              to { transform: translate(-50%, -50%) rotate(668.57deg) translateX(80px); }
            }
          }

          @media (min-width: 768px) {
            @keyframes orbit1 {
              from { transform: translate(-50%, -50%) rotate(0deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(360deg) translateX(100px); }
            }
            @keyframes orbit2 {
              from { transform: translate(-50%, -50%) rotate(51.43deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(411.43deg) translateX(100px); }
            }
            @keyframes orbit3 {
              from { transform: translate(-50%, -50%) rotate(102.86deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(462.86deg) translateX(100px); }
            }
            @keyframes orbit4 {
              from { transform: translate(-50%, -50%) rotate(154.29deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(514.29deg) translateX(100px); }
            }
            @keyframes orbit5 {
              from { transform: translate(-50%, -50%) rotate(205.71deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(565.71deg) translateX(100px); }
            }
            @keyframes orbit6 {
              from { transform: translate(-50%, -50%) rotate(257.14deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(617.14deg) translateX(100px); }
            }
            @keyframes orbit7 {
              from { transform: translate(-50%, -50%) rotate(308.57deg) translateX(100px); }
              to { transform: translate(-50%, -50%) rotate(668.57deg) translateX(100px); }
            }
          }

          @media (min-width: 1024px) {
            @keyframes orbit1 {
              from { transform: translate(-50%, -50%) rotate(0deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(360deg) translateX(120px); }
            }
            @keyframes orbit2 {
              from { transform: translate(-50%, -50%) rotate(51.43deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(411.43deg) translateX(120px); }
            }
            @keyframes orbit3 {
              from { transform: translate(-50%, -50%) rotate(102.86deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(462.86deg) translateX(120px); }
            }
            @keyframes orbit4 {
              from { transform: translate(-50%, -50%) rotate(154.29deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(514.29deg) translateX(120px); }
            }
            @keyframes orbit5 {
              from { transform: translate(-50%, -50%) rotate(205.71deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(565.71deg) translateX(120px); }
            }
            @keyframes orbit6 {
              from { transform: translate(-50%, -50%) rotate(257.14deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(617.14deg) translateX(120px); }
            }
            @keyframes orbit7 {
              from { transform: translate(-50%, -50%) rotate(308.57deg) translateX(120px); }
              to { transform: translate(-50%, -50%) rotate(668.57deg) translateX(120px); }
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;