
import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PLANS } from '../../constants';
import { Duration } from '../../types';

interface LandingPageProps {
  onNavigate: (page: 'signup') => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <Card className="text-center transition-all duration-300 hover:border-[#c8102e]/50 hover:-translate-y-1 p-6">
    <div className="mx-auto w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-[#c8102e]">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-400">{description}</p>
  </Card>
);

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#c8102e]"><polyline points="20 6 9 17 4 12"></polyline></svg>;

// Increased size of check circle slightly to match larger badge text
const GreenCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    { title: 'High-Quality Models', description: 'Professionally crafted 3D assets ready for production.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { title: 'Lightning Fast', description: 'Instant downloads via Telegram. No waiting.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
    { title: 'Multiple Formats', description: '3ds Max, SketchUp, and more formats included.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> },
    { title: 'Unlimited Downloads', description: 'Download as many models as you need.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> },
    { title: 'Daily Updates', description: 'New models added every single day.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { title: 'Commercial License', description: 'Use in all your commercial projects.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> }
  ];

  return (
    <div className="w-full relative z-10">
      {/* 
        Hero Section 
      */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden">
        {/* 
            Inner Container
            - pt-20/24: Pushes content down slightly from exact center.
        */}
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center pt-20 md:pt-24">
            {/* HEADLINE */}
            <h1 className="w-full text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl uppercase">
            YOUR COMPLETE <span className="text-[#c8102e]">3D</span>
            <br />
            <span className="text-[#c8102e]">MODEL</span> LIBRARY
            </h1>
            
            {/* SUB-HEADLINE */}
            <p className="mt-6 md:mt-10 max-w-3xl mx-auto text-sm md:text-lg text-gray-300 font-normal leading-relaxed drop-shadow-md">
            Get unlimited access to thousands of high-quality 3D models for 3ds Max & SketchUp. Updated daily for professional visualization.
            </p>

            {/* CTA BUTTON */}
            <div className="mt-8 md:mt-10">
                <Button 
                    onClick={() => onNavigate('signup')} 
                    className="!px-8 !py-3 !text-base md:!px-10 md:!py-4 md:!text-xl !font-bold !rounded-lg shadow-2xl shadow-[#c8102e]/30 hover:shadow-[#c8102e]/50 hover:scale-105 !bg-[#c8102e] hover:!bg-[#a00d25] border-none transition-all duration-300"
                >
                    Subscribe Now <span aria-hidden="true" className="ml-3 text-lg md:text-xl leading-none">&rsaquo;</span>
                </Button>
            </div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-8 md:mt-10">
                <span className="flex items-center bg-[#0d0d0d] px-4 py-2 md:px-8 md:py-3 rounded-full border border-white/10 text-gray-200 text-xs md:text-base font-medium shadow-lg hover:border-green-500/30 transition-colors">
                <GreenCheckCircle /> Premium Quality
                </span>
                <span className="flex items-center bg-[#0d0d0d] px-4 py-2 md:px-8 md:py-3 rounded-full border border-white/10 text-gray-200 text-xs md:text-base font-medium shadow-lg hover:border-green-500/30 transition-colors">
                <GreenCheckCircle /> Cancel anytime
                </span>
                <span className="flex items-center bg-[#0d0d0d] px-4 py-2 md:px-8 md:py-3 rounded-full border border-white/10 text-gray-200 text-xs md:text-base font-medium shadow-lg hover:border-green-500/30 transition-colors">
                <GreenCheckCircle /> 24/7 Support
                </span>
            </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* Features Section - Strictly below the fold */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">Everything You Need, All in One Place</h2>
            <p className="text-gray-400 text-center mt-4 text-base md:text-lg max-w-2xl mx-auto">
            From interior furnishings to complex exterior scenes, our library is curated to meet the demands of modern architectural visualization.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
            </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">Choose Your Perfect Plan</h2>
            <p className="text-gray-400 text-center mt-4 text-base md:text-lg max-w-2xl mx-auto">
            Flexible plans to fit your needs. Start with our lowest launch price for immediate access.
            </p>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PLANS.map(plan => (
                    <Card key={plan.name} className={`
                        ${plan.isPopular ? 'border-[#c8102e]/50' : ''} p-6
                    `}>
                        {plan.isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8102e] text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                        <h3 className="text-xl font-bold text-[#c8102e]">{plan.name}</h3>
                        <p className="text-base text-gray-400 mt-1">(${plan.prices[Duration.ThreeMonths].monthly} / Month)</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-white">${plan.prices[Duration.ThreeMonths].total}</span>
                            <span className="text-gray-400 text-lg"> / 3 MONTHS</span>
                        </div>
                        <div className="bg-[#c8102e]/20 border border-[#c8102e]/30 text-[#c8102e] font-semibold text-center py-2 px-3 rounded-md text-base mb-6">
                            {plan.prices[Duration.ThreeMonths].bonus}
                        </div>
                        <ul className="space-y-3 text-base flex-grow">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                <CheckIcon />
                                <span className="ml-3 text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
            <div className="mt-16 text-center">
                <Button onClick={() => onNavigate('signup')} className="px-12 py-3 text-lg font-bold">See All Plans & Subscribe</Button>
            </div>
        </div>
      </section>
    </div>
  );
};
