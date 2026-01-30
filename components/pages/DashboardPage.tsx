
import React, { useMemo } from 'react';
import { FormData, PlanName, SoftwareFormat, TelegramChannel, Duration } from '../../types';
import { PLANS, TELEGRAM_CHANNELS } from '../../constants';
import { Card } from '../ui/Card';

interface DashboardPageProps {
  userData: FormData;
  onLogout: () => void;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-2 flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
);

const LibraryChannelCard: React.FC<{ channel: TelegramChannel; isApproved: boolean }> = ({ channel, isApproved }) => {
    const Component = isApproved ? 'a' : 'div';
    const props = isApproved ? { href: channel.link, target: "_blank", rel: "noopener noreferrer" } : {};
    
    return (
        <Component {...props} className={`bg-white/5 px-4 py-2 rounded-lg border transition-all relative overflow-hidden flex items-center justify-between h-20
            ${isApproved 
                ? 'border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 cursor-pointer opacity-100' 
                : 'border-white/10 opacity-50 cursor-not-allowed hover:opacity-50'
            }`}
        >
            {!isApproved && <div className="absolute inset-0 bg-black/20 z-10"></div>}
            
            <div className="flex items-center relative z-20 flex-1 pr-2 overflow-hidden">
                {isApproved ? <UnlockIcon /> : <LockIcon />}
                <span className={`${isApproved ? 'text-white' : 'text-gray-300'} font-medium uppercase text-xs md:text-sm leading-tight break-words`}>
                    {channel.name}
                </span>
            </div>
            
            <span className={`relative z-20 flex-shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border
                ${isApproved 
                    ? 'text-green-500 bg-green-500/10 border-green-500/20' 
                    : 'text-gray-500 bg-black/40 border-white/5'
                }`}>
                {isApproved ? 'Open' : 'Locked'}
            </span>
        </Component>
    );
};


export const DashboardPage: React.FC<DashboardPageProps> = ({ userData, onLogout }) => {
  const selectedPlanDetails = useMemo(() => PLANS.find(p => p.name === userData.plan), [userData.plan]);
  const isApproved = userData.status === 'approved';

  const accessibleChannels = useMemo(() => {
    if (!userData || !selectedPlanDetails) return [];

    let channels = TELEGRAM_CHANNELS.filter(channel => {
      // Basic format filtering (Max vs SketchUp vs Both)
      if (channel.software === 'Max' || channel.software === 'SketchUp') {
        if(userData.format === SoftwareFormat.Both) return true;
        if(userData.format === SoftwareFormat.Max && channel.software === 'Max') return true;
        if(userData.format === SoftwareFormat.SketchUp && channel.software === 'SketchUp') return true;
      }
      
      // Texture Library Logic
      if (channel.name === 'PREMIUM TEXTURE LIBRARY' && (selectedPlanDetails.name === PlanName.Professional || selectedPlanDetails.name === PlanName.Premium)) {
        return true;
      }

      // Software Library Logic
      if (channel.name === 'SOFTWARE LIBRARY - ARCHVIZ' && selectedPlanDetails.name === PlanName.Premium) {
        return true;
      }

      // RTA Student Bonus Logic
      if (userData.isRtaStudent && (channel.name === 'MEGASCAN LIBRARY FOR ARCHVIZ')) {
          return true;
      }
      
      return false;
    });

    return [...new Set(channels)]; // Remove duplicates if any
  }, [userData, selectedPlanDetails]);
  
  const amountPaid = selectedPlanDetails ? selectedPlanDetails.prices[userData.duration].total : 0;

  const { durationDetails, totalMonths } = useMemo(() => {
      let details = `${userData.duration} Months`;
      let total = userData.duration;
      let bonus = 0;

      if (userData.duration === Duration.TwelveMonths) {
          bonus = 2;
          details = `${userData.duration} months + ${bonus} months FREE`;
          total += bonus;
      } else if (userData.duration === Duration.SixMonths) {
          bonus = 1;
          details = `${userData.duration} months + ${bonus} month FREE`;
          total += bonus;
      }
      
      return {
          durationDetails: details,
          totalMonths: `${total} months`
      };
  }, [userData.duration]);


  if (!selectedPlanDetails) {
    return <div className="text-center pt-20">Loading subscription details...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Welcome, {userData.fullName}!</h1>
        <p className="text-gray-400 mt-4 text-lg">We have received your application. Please check your status below.</p>
      </div>

      <Card className="max-w-6xl mx-auto mb-12 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Subscription Details */}
            <div className="md:col-span-1 space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Subscription Details</h2>
                <div className="space-y-4 text-base">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Plan Name</p>
                        <p className="text-white font-semibold text-lg text-[#c8102e]">{userData.plan}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-gray-300">{durationDetails}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Access</p>
                        <p className="text-white font-medium">{totalMonths}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Amount Paid</p>
                        <p className="text-white font-medium">${amountPaid} (approx.)</p>
                    </div>
                    <div className="pt-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Current Status</p>
                        {isApproved ? (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                Active / Approved
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                                Pending Verification
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* What Happens Next Letter */}
            <div className="md:col-span-2 bg-white/5 p-6 rounded-xl border border-white/10 relative">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isApproved ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            You are Approved!
                        </>
                    ) : (
                         <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            What happens next?
                        </>
                    )}
                </h2>
                <div className="text-gray-300 space-y-4 text-base leading-relaxed">
                    {isApproved ? (
                        <div>
                            <p>Great news! Your payment has been verified and your account is now active.</p>
                            <p className="mt-2">You can now access all the Telegram channels included in your <strong>{userData.plan}</strong> plan below. Simply click on the channel name to open it.</p>
                            <p className="mt-4 text-green-400 font-semibold">Your bonus time has been applied automatically.</p>
                        </div>
                    ) : (
                        <>
                            <p>Thank you for subscribing to the RTA 3D Model Library. Because we manually verify every payment to ensure security, there is a short waiting period.</p>
                            <ul className="space-y-3 list-none ml-1">
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-0.5 font-bold">1.</span>
                                    <span>Our team will verify your payment slip within <strong>24 hours</strong>.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-0.5 font-bold">2.</span>
                                    <span>Once verified, we will manually add you to the private Telegram channels using your username: <strong className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{userData.telegram}</strong></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-0.5 font-bold">3.</span>
                                    <span>You will receive a confirmation email when your access is active.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2 mt-0.5 font-bold">4.</span>
                                    <span><strong>Bonus:</strong> We have added 3 extra days to your subscription to cover this verification time.</span>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
      </Card>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Your Library Access</h2>
            {!isApproved && (
                <div className="flex items-center text-xs text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                    <LockIcon />
                    <span>Unlocks after verification</span>
                </div>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleChannels.map((channel, index) => (
                <LibraryChannelCard key={index} channel={channel} isApproved={isApproved} />
            ))}
        </div>
      </div>
    </div>
  );
};
