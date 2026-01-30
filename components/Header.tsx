
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';

interface HeaderProps {
  page: 'landing' | 'signup' | 'dashboard' | 'login';
  onNavigate: (page: 'landing' | 'signup' | 'dashboard' | 'login') => void;
  signUpStep: number;
  signUpMaxStep: number;
  onSetSignUpStep: (step: number) => void;
  onLogout?: () => void;
}

const SignUpNavMenu: React.FC<{ currentStep: number; maxStepReached: number; setStep: (step: number) => void; onHomeClick: () => void }> = ({ currentStep, maxStepReached, setStep, onHomeClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const menuItems = [
        { label: 'Select Plan', step: 1 },
        { label: 'Your Info', step: 2 },
        { label: 'Choose Format', step: 3 },
        { label: 'Payment', step: 4 }
    ];

    return (
        <div ref={menuRef} className="relative z-50">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                {isOpen ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                }
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[#1c1c1c] border border-white/10 rounded-lg shadow-2xl shadow-black/50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {menuItems.map(item => {
                            const isDisabled = item.step > maxStepReached;
                            return (
                                <button key={item.step} onClick={() => { if (!isDisabled) { setStep(item.step); setIsOpen(false); } }}
                                    disabled={isDisabled}
                                    className={`w-full text-left block px-4 py-2 text-sm transition-colors ${
                                        currentStep === item.step ? 'bg-[#c8102e] text-white' : 'text-gray-300'
                                    } ${
                                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                                    }`}
                                >
                                    Step {item.step}: {item.label}
                                </button>
                            );
                        })}
                        <hr className="border-white/10 my-1" />
                         <button onClick={() => { onHomeClick(); setIsOpen(false); }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                        >
                           Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ page, onNavigate, signUpStep, signUpMaxStep, onSetSignUpStep, onLogout }) => {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="w-full max-w-[1920px] mx-auto px-4 py-4 md:px-16 md:py-6 flex items-center justify-between">
        <button onClick={() => onNavigate('landing')} className="flex items-center space-x-3 group">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-[#c8102e] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            <span className="text-white font-bold text-base md:text-lg tracking-tighter">RTA</span>
          </div>
          <span className="text-sm md:text-lg font-semibold text-white whitespace-nowrap">3D Models</span>
        </button>

        <div className="flex items-center gap-3 md:gap-8">
            {page === 'landing' && (
                <>
                    <button 
                        onClick={() => onNavigate('login')} 
                        className="text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                        Check Status
                    </button>
                    <Button onClick={() => onNavigate('signup')} className="!py-2 !px-4 md:!py-2.5 md:!px-6 text-xs md:text-sm !rounded-md whitespace-nowrap">
                        Get Access
                    </Button>
                </>
            )}
            
            {page === 'login' && (
                 <Button onClick={() => onNavigate('signup')} className="!py-2 !px-4 md:!py-2.5 md:!px-6 text-xs md:text-sm !rounded-md whitespace-nowrap">
                    Get Access
                </Button>
            )}

            {page === 'dashboard' && onLogout && (
                 <button 
                    onClick={onLogout} 
                    className="text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                 >
                    Log Out
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
            )}

            {page === 'signup' && (
                <SignUpNavMenu 
                    currentStep={signUpStep}
                    maxStepReached={signUpMaxStep}
                    setStep={onSetSignUpStep}
                    onHomeClick={() => onNavigate('landing')}
                />
            )}
        </div>
      </nav>
    </header>
  );
};
