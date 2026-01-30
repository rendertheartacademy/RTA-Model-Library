
import React, { useMemo, useState } from 'react';
import { Plan, PlanName, Duration, Country, FormData, SoftwareFormat } from '../../types';
import { PLANS, CURRENCY_RATES } from '../../constants';
import { PricingCard } from '../ui/PricingCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SignUpPageProps {
  onSignUpSubmit: (data: FormData) => void;
  onNavigate: (page: 'landing') => void;
  step: number;
  setStep: (step: number) => void;
  maxStepReached: number;
  setMaxStepReached: (step: number) => void;
}

const RTA_CLASSES = [
  "Beginner to Professional 3D Modeling Class",
  "Master Class (Architectural Modeling)",
  "Visualization Class",
  "AI Architecture Class",
  "AI ArchViz Class",
  "D5 Beginner Class",
  "D5 Master Class",
  "Visual Training Class",
  "Advanced Mapping Class",
  "Unreal Engine Class",
  "Other"
];

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'bg-[#c8102e] w-8' : 'bg-gray-700 w-4'}`}></div>
    ))}
  </div>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center text-sm z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
        Back
    </button>
);

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSubmit, step, setStep, maxStepReached, setMaxStepReached }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    telegram: '',
    country: Country.Myanmar,
    plan: null,
    duration: Duration.TwelveMonths,
    format: null,
    isRtaStudent: false,
    rtaClasses: [],
    otherRtaClass: '',
    screenshot: null,
    status: 'pending',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, screenshot: e.target.files![0] }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Immediately trigger parent submit handler which switches to Dashboard
    onSignUpSubmit(formData);
  };


  const selectedPlan = useMemo(() => {
    if (!formData.plan) return null;
    return PLANS.find(p => p.name === formData.plan) || null;
  }, [formData.plan]);

  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    return selectedPlan.prices[formData.duration].total;
  }, [selectedPlan, formData.duration]);

  const nextStep = () => {
    const newStep = Math.min(step + 1, 4);
    setStep(newStep);
    setMaxStepReached(Math.max(maxStepReached, newStep));
  };
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PlanSelection formData={formData} setFormData={setFormData} onNext={nextStep} selectedPlan={selectedPlan} />;
      case 2:
        return <Step2PersonalInfo formData={formData} handleInputChange={handleInputChange} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3FormatSelection formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4Payment formData={formData} totalPrice={totalPrice} onBack={prevStep} onFileChange={handleFileChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-6xl mx-auto relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">Become a Subscriber</h1>
        <p className="text-gray-400 text-center mb-12">Follow the steps below to get instant access to the library.</p>
        <StepIndicator currentStep={step} totalSteps={4} />
        <form name="subscription" onSubmit={handleSubmit} data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="subscription" />
            {renderStep()}
        </form>
      </div>
    </div>
  );
};


// Step 1: Plan Selection
const Step1PlanSelection: React.FC<{ formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; onNext: () => void, selectedPlan: Plan | null }> = ({ formData, setFormData, onNext, selectedPlan }) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDurationChange = (duration: Duration) => {
      setFormData(prev => ({ ...prev, duration, isRtaStudent: duration !== Duration.TwelveMonths ? false : prev.isRtaStudent }));
  };
  const handlePlanSelect = (planName: PlanName) => {
      setFormData(prev => ({ ...prev, plan: planName }));
  };

  const handleContinue = () => {
      setValidationError(null);

      // Validation for RTA Student
      if (formData.isRtaStudent) {
          if (formData.rtaClasses.length === 0) {
              setValidationError("Please select at least one class to proceed.");
              return;
          }
          if (formData.rtaClasses.includes('Other') && !formData.otherRtaClass.trim()) {
              setValidationError("Please specify the class name for 'Other'.");
              return;
          }
      }

      onNext();
  };

  return (
      <Card>
          <h2 className="text-2xl font-bold text-center mb-2">Step 1: Select Your Plan</h2>
          <p className="text-gray-400 text-center mb-8">Choose your commitment and unlock savings.</p>

          <div className="mb-8">
              <h3 className="font-semibold mb-4 text-center">Choose Duration</h3>
              <div className="flex justify-center flex-wrap gap-4">
                  {(Object.keys(Duration) as Array<keyof typeof Duration>)
                      .filter(key => !isNaN(Number(Duration[key])))
                      .map(key => {
                          const durationValue = Duration[key] as unknown as Duration;
                          const labels = { [Duration.ThreeMonths]: '3 Months', [Duration.SixMonths]: '6 Months', [Duration.TwelveMonths]: '1 Year' };
                          const bonus = { 
                              [Duration.ThreeMonths]: 'Launch Price', 
                              [Duration.SixMonths]: '1 Month FREE', 
                              [Duration.TwelveMonths]: '2 Months FREE + Library Class ($30)' 
                          };
                          const isSelected = formData.duration === durationValue;

                          return (
                              <button key={key} type="button" onClick={() => handleDurationChange(durationValue)}
                                  className={`px-6 py-3 rounded-lg border-2 transition-all w-48 text-center
                                      ${isSelected ? 'bg-[#c8102e] border-transparent text-white shadow-lg shadow-[#c8102e]/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                              >
                                  <span className="font-bold text-lg">{labels[durationValue]}</span>
                                  <span className="block text-xs mt-1">{bonus[durationValue]}</span>
                              </button>
                          )
                      })
                  }
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANS.map(plan => (
                  <PricingCard
                      key={plan.name}
                      plan={plan}
                      duration={formData.duration}
                      isSelected={formData.plan === plan.name}
                      onSelect={() => handlePlanSelect(plan.name)}
                  />
              ))}
          </div>

          {selectedPlan && (
              <div className="mt-8">
                  <PriceSummary 
                    plan={selectedPlan} 
                    duration={formData.duration} 
                    formData={formData} 
                    setFormData={setFormData}
                    validationError={validationError}
                   />
              </div>
          )}

          <div className="mt-8 text-center">
              <Button onClick={handleContinue} type="button" disabled={!formData.plan} className="px-10 py-3 text-lg">
                  Continue <span aria-hidden="true">&rarr;</span>
              </Button>
          </div>
      </Card>
  );
};


// Price Summary Component
const PriceSummary: React.FC<{ plan: Plan; duration: Duration; formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; validationError?: string | null }> = ({ plan, duration, formData, setFormData, validationError }) => {
    const priceInfo = plan.prices[duration];
    const regularPrice = plan.prices[duration].monthly * duration;
    const discount = regularPrice - priceInfo.total;

    const toggleClass = (className: string) => {
        setFormData(prev => {
            const currentClasses = prev.rtaClasses || [];
            if (currentClasses.includes(className)) {
                // Remove if exists
                return { ...prev, rtaClasses: currentClasses.filter(c => c !== className) };
            } else {
                // Add if doesn't exist
                return { ...prev, rtaClasses: [...currentClasses, className] };
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <BonusSection duration={duration} isRtaStudent={formData.isRtaStudent} />
            
            {duration === Duration.TwelveMonths && (
                <div className={`bg-white/5 border rounded-lg p-6 transition-all duration-300 ${validationError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-white/10'}`}>
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="rtaStudent" 
                            name="isRtaStudent" 
                            checked={formData.isRtaStudent} 
                            onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                isRtaStudent: e.target.checked,
                                rtaClasses: e.target.checked ? prev.rtaClasses : [] // Clear classes if unchecked
                            }))} 
                            className="h-6 w-6 rounded bg-gray-700 border-gray-600 text-[#c8102e] focus:ring-[#c8102e]" 
                        />
                        <label htmlFor="rtaStudent" className="ml-4 cursor-pointer">
                            <span className="font-bold text-lg text-white">I am an RTA student</span>
                            <span className="block text-sm text-gray-400 mt-1">Check this box to unlock the extra Megascan Library for FREE!</span>
                        </label>
                    </div>

                    {/* Expandable Class Selection List */}
                    {formData.isRtaStudent && (
                        <div className="mt-6 pl-2 md:pl-10 animate-fadeIn">
                             <p className={`text-base font-semibold mb-3 ${validationError ? 'text-red-400' : 'text-[#c8102e]'}`}>Please select the classes you have attended:</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {RTA_CLASSES.map((cls) => (
                                    <div key={cls}>
                                        <label className="flex items-start space-x-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.rtaClasses.includes(cls)}
                                                onChange={() => toggleClass(cls)}
                                                className="mt-1 h-4 w-4 rounded bg-gray-800 border-gray-600 text-[#c8102e] focus:ring-[#c8102e]"
                                            />
                                            <span className="text-base text-gray-300">{cls}</span>
                                        </label>
                                        
                                        {/* Conditional Input for 'Other' */}
                                        {cls === 'Other' && formData.rtaClasses.includes('Other') && (
                                            <div className="ml-7 mt-2">
                                                <input 
                                                    type="text"
                                                    value={formData.otherRtaClass}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, otherRtaClass: e.target.value }))}
                                                    placeholder="Please specify class name..."
                                                    className={`w-full bg-black/40 border rounded px-3 py-2 text-base text-white focus:outline-none focus:border-[#c8102e] ${validationError && !formData.otherRtaClass ? 'border-red-500' : 'border-white/20'}`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                             </div>
                             {validationError && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center text-red-400 text-sm font-semibold animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    {validationError}
                                </div>
                             )}
                        </div>
                    )}
                </div>
            )}

            <Card className="!p-0">
                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Price Summary</h3>
                    <div className="space-y-2 text-base">
                        <div className="flex justify-between"><span className="text-gray-400">Plan Selected:</span><span>{plan.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Monthly Price:</span><span>${priceInfo.monthly}/month</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Duration:</span><span>{duration} months</span></div>
                        <hr className="border-white/10 my-2" />
                        <div className="flex justify-between"><span className="text-gray-400">Regular Price:</span><span>${regularPrice}</span></div>
                        {discount > 0 && <div className="flex justify-between text-green-400"><span className="text-gray-400">Discount ({Math.round(discount/regularPrice * 100)}%):</span><span>-${discount}</span></div>}
                    </div>
                </div>
                <div className="bg-white/5 p-6 rounded-b-xl flex justify-between items-center">
                    <span className="text-xl font-bold">Total Price:</span>
                    <span className="text-2xl font-extrabold text-[#c8102e]">${priceInfo.total}</span>
                </div>
            </Card>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

// Bonus Section Component
const BonusSection: React.FC<{duration: Duration, isRtaStudent: boolean}> = ({ duration, isRtaStudent }) => {
    const bonusContent = {
        [Duration.TwelveMonths]: { title: '1 Year Plan Bonus:', items: ['Get 2 months FREE (14 months total)', 'Free Library Management Class (worth $30)'] },
        [Duration.SixMonths]: { title: '6 Month Plan Bonus:', items: ['Get 1 month FREE (7 months total)'] },
        [Duration.ThreeMonths]: { title: 'Launch Bonus:', items: ['Get the Lowest Launch Price'] }
    };
    const content = bonusContent[duration];
    const studentBonuses = ['RTA Student Bonus: Megascan Library FREE'];
    
    return (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg p-6 text-base">
            <h4 className="font-bold text-lg flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-yellow-400 flex-shrink-0">
                     <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                     <path d="M12 8v13"></path>
                     <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                     <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
                </svg>
                {content.title}
            </h4>
            <ul className="space-y-1 pl-10">
                {content.items.map((item, i) => <li key={i} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>{item}</li>)}
                {isRtaStudent && studentBonuses.map((item, i) => <li key={`student-${i}`} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>{item}</li>)}
            </ul>
        </div>
    );
};


// Step 2: Personal Info
const Step2PersonalInfo: React.FC<{ 
    formData: FormData; 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
    onNext: () => void; 
    onBack: () => void 
}> = ({ formData, handleInputChange, onNext, onBack }) => {
    
    // Validation State
    const [errors, setErrors] = useState({
        fullName: false,
        email: false,
        phone: false,
        telegram: false
    });

    // Validation Logic
    const validateAndProceed = () => {
        const isNameValid = formData.fullName.trim().length > 0;
        const isEmailValid = formData.email.trim().length > 0;
        
        // Phone: Must be entered (length > 0). Removed strict 9-digit check.
        const isPhoneValid = formData.phone.trim().length > 0;
        
        // Telegram: Must start with @ and have text after it
        const isTelegramValid = formData.telegram.startsWith('@') && formData.telegram.length > 1;

        const newErrors = {
            fullName: !isNameValid,
            email: !isEmailValid,
            phone: !isPhoneValid,
            telegram: !isTelegramValid
        };

        setErrors(newErrors);

        // If no errors (all false), proceed
        if (!Object.values(newErrors).some(Boolean)) {
            onNext();
        }
    };

    const getPhoneFlag = (phone: string) => {
        if (phone.startsWith('08')) return '🇹🇭';
        if (phone.startsWith('09')) return '🇲🇲';
        return '📞';
    };

    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 2: Your Information</h2>
            <div className="max-w-md mx-auto space-y-4">
                <div>
                    <label htmlFor="fullName" className={`block text-base font-medium mb-1 ${errors.fullName ? 'text-red-500' : 'text-gray-300'}`}>Full Name</label>
                    <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={`w-full bg-white/5 rounded-md px-4 py-3 text-base focus:ring-2 transition ${
                            errors.fullName 
                                ? 'border-red-500 focus:ring-red-500 border' 
                                : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">Full Name is required</p>}
                </div>
                <div>
                    <label htmlFor="email" className={`block text-base font-medium mb-1 ${errors.email ? 'text-red-500' : 'text-gray-300'}`}>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`w-full bg-white/5 rounded-md px-4 py-3 text-base focus:ring-2 transition ${
                            errors.email 
                                ? 'border-red-500 focus:ring-red-500 border' 
                                : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                     {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
                </div>
                <div>
                    <label htmlFor="phone" className={`block text-base font-medium mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-300'}`}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none select-none">
                            {getPhoneFlag(formData.phone)}
                        </div>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            placeholder="09xxxxxxxxx" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className={`w-full bg-white/5 rounded-md pl-10 pr-4 py-3 text-base focus:ring-2 transition ${
                                errors.phone 
                                    ? 'border-red-500 focus:ring-red-500 border' 
                                    : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                            }`}
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">Phone number is required.</p>}
                </div>
                <div>
                    <label htmlFor="telegram" className={`block text-base font-medium mb-1 ${errors.telegram ? 'text-red-500' : 'text-gray-300'}`}>Telegram Username</label>
                    <input 
                        type="text" 
                        name="telegram" 
                        id="telegram" 
                        placeholder="@username" 
                        value={formData.telegram} 
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 rounded-md px-4 py-3 text-base focus:ring-2 transition ${
                            errors.telegram
                            ? 'border-red-500 focus:ring-red-500 border' 
                            : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                    {errors.telegram && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Username must start with @
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="country" className="block text-base font-medium text-gray-300 mb-1">Payment Currency / Method</label>
                    <select name="country" id="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 border-white/10 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#c8102e] focus:border-[#c8102e] transition">
                        <option value={Country.Myanmar}>Myanmar (KBZPay / MMK)</option>
                        <option value={Country.Thailand}>Thailand (Bank Transfer / THB)</option>
                    </select>
                </div>
                
                <div className="pt-4 text-center">
                    <Button 
                        onClick={validateAndProceed} 
                        type="button" 
                        className="px-10 py-3 text-lg"
                    >
                        Continue <span aria-hidden="true">&rarr;</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// Step 3: Format Selection
const Step3FormatSelection: React.FC<{ formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; onNext: () => void; onBack: () => void }> = ({ formData, setFormData, onNext, onBack }) => {
    const isPremium = formData.plan === PlanName.Premium;
    
    const handleFormatSelect = (format: SoftwareFormat) => {
        setFormData(prev => ({...prev, format}));
    };

    const options = [
        { value: SoftwareFormat.Max, label: '3ds Max' },
        { value: SoftwareFormat.SketchUp, label: 'SketchUp' },
    ];
    
    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 3: Choose Your Format</h2>
            <div className="max-w-md mx-auto">
                {isPremium ? (
                    <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-lg font-semibold text-[#c8102e]">Premium Plan Includes Both</h3>
                        <p className="text-gray-400 mt-2">Your Premium subscription gives you access to both 3ds Max and SketchUp model libraries automatically.</p>
                    </div>
                ) : (
                    <fieldset className="space-y-4">
                        <legend className="sr-only">Software Format</legend>
                        {options.map(option => (
                             <label key={option.value} htmlFor={option.value}
                                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.format === option.value ? 'bg-[#c8102e]/20 border-[#c8102e]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                <input type="radio" id={option.value} name="format" value={option.value} checked={formData.format === option.value} onChange={() => handleFormatSelect(option.value)} className="h-5 w-5 bg-gray-700 border-gray-600 text-[#c8102e] focus:ring-[#c8102e]" />
                                <span className="ml-4 font-semibold text-lg">{option.label}</span>
                            </label>
                        ))}
                    </fieldset>
                )}
                 <div className="pt-8 text-center">
                    <Button onClick={() => {
                        if (isPremium) setFormData(prev => ({...prev, format: SoftwareFormat.Both}));
                        onNext();
                    }} type="button" disabled={!isPremium && !formData.format} className="px-10 py-3 text-lg">
                        Continue <span aria-hidden="true">&rarr;</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// Step 4: Payment
const Step4Payment: React.FC<{ formData: FormData; totalPrice: number; onBack: () => void; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ formData, totalPrice, onBack, onFileChange }) => {
    const isMyanmar = formData.country === Country.Myanmar;
    const localPrice = isMyanmar ? (totalPrice * CURRENCY_RATES.MMK).toLocaleString() : (totalPrice * CURRENCY_RATES.THB).toLocaleString();
    const currency = isMyanmar ? 'MMK' : 'THB';
    const paymentMethod = isMyanmar ? 'KBZPay' : 'Thai Bank Transfer';
    const accountInfo = isMyanmar ? 'Acc: 09xxxxxxxxx (Name)' : 'Acc: 123-456-7890 (Bank Name)';
    
    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 4: Complete Your Payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
                    <h3 className="font-semibold text-lg mb-4">Payment Instructions</h3>
                    <p className="text-base text-gray-400 mb-4">Transfer the total amount to the account below. Use your name and plan in the payment note (e.g., "{formData.fullName}, {formData.plan} {formData.duration}mo").</p>
                    <div className="bg-black/40 p-4 rounded-md space-y-2">
                        <div className="flex justify-between text-base"><span className="text-gray-400">Amount (USD):</span><span>${totalPrice}</span></div>
                        <div className="flex justify-between text-base"><span className="text-gray-400">Exchange Rate:</span><span>1 USD = {isMyanmar ? CURRENCY_RATES.MMK : CURRENCY_RATES.THB} {currency}</span></div>
                         <hr className="border-white/10" />
                        <div className="flex justify-between font-bold text-lg"><span className="text-gray-300">Total to Pay:</span><span className="text-[#c8102e]">{localPrice} {currency}</span></div>
                    </div>
                    <div className="mt-4 bg-black/40 p-4 rounded-md space-y-1">
                        <p className="text-base"><strong className="text-gray-400">Method:</strong> {paymentMethod}</p>
                        <p className="text-base"><strong className="text-gray-400">Account:</strong> {accountInfo}</p>
                    </div>
                </div>
                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
                    <h3 className="font-semibold text-lg mb-4">Upload Screenshot</h3>
                    <p className="text-base text-gray-400 mb-4">After payment, upload a screenshot of your transaction. This is required for verification.</p>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <input type="file" id="screenshot" name="screenshot" onChange={onFileChange} accept="image/*" className="hidden" required />
                        <label htmlFor="screenshot" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-500 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span className="text-[#c8102e] font-semibold">Click to upload</span>
                            <p className="text-sm text-gray-500 mt-1">{formData.screenshot ? formData.screenshot.name : 'PNG, JPG, GIF up to 10MB'}</p>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <Button type="submit" disabled={!formData.screenshot} className="px-10 py-3 text-lg">
                    Submit & Finish <span aria-hidden="true">&rarr;</span>
                </Button>
            </div>
        </Card>
    );
};
