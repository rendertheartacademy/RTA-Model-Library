
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/pages/LandingPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { LoginPage } from './components/pages/LoginPage';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { FormData, Duration, PlanName } from './types';
import { supabase } from './lib/supabaseClient';
import { PLANS, CURRENCY_RATES } from './constants';

type Page = 'landing' | 'signup' | 'dashboard' | 'login';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // State for sign-up flow
  const [signUpStep, setSignUpStep] = useState(1);
  const [signUpMaxStep, setSignUpMaxStep] = useState(1);

  // Load data from local storage on load
  useEffect(() => {
    const savedData = localStorage.getItem('rta_user_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            setSubmittedData(parsed);
            // Verify status in background with Supabase
            if (parsed.email) {
                checkSupabaseStatus(parsed.email, parsed.phone);
            }
            if (page === 'landing') {
                 setPage('dashboard');
            }
        } catch (e) {
            console.error("Failed to parse saved data");
        }
    }
  }, []);

  const checkSupabaseStatus = async (email: string, phone: string) => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', email)
        .eq('phone_number', phone)
        .single();
      
      if (data) {
          // Update local state if status changed in DB
          const mappedData = mapDbToFormData(data);
          setSubmittedData(mappedData);
          localStorage.setItem('rta_user_data', JSON.stringify(mappedData));
      }
  };

  const navigateTo = useCallback((newPage: Page) => {
    setPage(newPage);
    setLoginError(undefined);
    if (newPage !== 'signup') {
        setSignUpStep(1);
        setSignUpMaxStep(1);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSetSignUpStep = (step: number) => {
    if (step <= signUpMaxStep) {
      setSignUpStep(step);
    }
  };

  // Helper to calculate payment amount string
  const getAmountString = (data: FormData) => {
      if (!data.plan) return '0';
      const plan = PLANS.find(p => p.name === data.plan);
      if (!plan) return '0';
      
      const priceUSD = plan.prices[data.duration].total;
      if (data.country === 'Myanmar') {
          return `${(priceUSD * CURRENCY_RATES.MMK).toLocaleString()} MMK`;
      } else {
          return `${(priceUSD * CURRENCY_RATES.THB).toLocaleString()} THB`;
      }
  };

  const handleSignUpSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
        let paymentSlipUrl = '';

        // 1. Upload Screenshot to Supabase Storage
        if (data.screenshot) {
            const fileExt = data.screenshot.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('payment-slips')
                .upload(filePath, data.screenshot);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('payment-slips')
                .getPublicUrl(filePath);
            
            paymentSlipUrl = publicUrl;
        }

        // 2. Map Duration Enum to String for DB
        const durationMap = {
            [Duration.ThreeMonths]: '3 Months',
            [Duration.SixMonths]: '6 Months',
            [Duration.TwelveMonths]: '12 Months'
        };

        const calculatedAmount = getAmountString(data);
        const isMyanmar = data.country === 'Myanmar';

        // 3. Insert into Database
        const dbPayload = {
            full_name: data.fullName,
            email: data.email,
            phone_number: data.phone,
            telegram_username: data.telegram,
            plan_tier: data.plan,
            plan_duration: durationMap[data.duration],
            
            // Updated Logic: Split currencies into specific columns
            amount_mmk: isMyanmar ? calculatedAmount : null,
            amount_thb: !isMyanmar ? calculatedAmount : null,
            // amount_paid is no longer populated

            is_rta_student: data.isRtaStudent,
            rta_class_name: data.rtaClasses.join(', ') + (data.otherRtaClass ? `, ${data.otherRtaClass}` : ''),
            software_format: data.format,
            payment_method: isMyanmar ? 'KBZPay' : 'Thai Bank',
            payment_slip_url: paymentSlipUrl,
            status: 'pending'
        };

        const { error: insertError } = await supabase
            .from('subscriptions')
            .insert([dbPayload]);

        if (insertError) throw insertError;

        // 4. Success - Update UI
        const newData = { ...data, status: 'pending' as const, screenshot: null }; // Don't store File object in localstorage
        localStorage.setItem('rta_user_data', JSON.stringify(newData));
        setSubmittedData(newData);
        setIsLoading(false);
        navigateTo('dashboard');

    } catch (error: any) {
        console.error("Submission error:", error);
        alert(`Error submitting application: ${error.message}`);
        setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, phone: string) => {
      setIsLoading(true);
      setLoginError(undefined);

      try {
          // Query Supabase
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('email', email)
            .eq('phone_number', phone)
            .maybeSingle();

          if (error) throw error;

          if (data) {
              const mappedData = mapDbToFormData(data);
              setSubmittedData(mappedData);
              localStorage.setItem('rta_user_data', JSON.stringify(mappedData));
              navigateTo('dashboard');
          } else {
              setLoginError("Account not found. Please check your details or sign up.");
          }
      } catch (err: any) {
          console.error(err);
          setLoginError("Connection error. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  // Helper to map DB response back to Frontend Types
  const mapDbToFormData = (dbRecord: any): FormData => {
      const revDurationMap: Record<string, Duration> = {
          '3 Months': Duration.ThreeMonths,
          '6 Months': Duration.SixMonths,
          '12 Months': Duration.TwelveMonths
      };

      return {
          fullName: dbRecord.full_name,
          email: dbRecord.email,
          phone: dbRecord.phone_number,
          telegram: dbRecord.telegram_username,
          country: dbRecord.payment_method === 'KBZPay' ? 'Myanmar' : 'Thailand' as any,
          plan: dbRecord.plan_tier as PlanName,
          duration: revDurationMap[dbRecord.plan_duration] || Duration.TwelveMonths,
          format: dbRecord.software_format,
          isRtaStudent: dbRecord.is_rta_student,
          rtaClasses: dbRecord.rta_class_name ? dbRecord.rta_class_name.split(', ') : [],
          otherRtaClass: '',
          screenshot: null,
          status: dbRecord.status
      };
  };

  const handleLogout = () => {
      localStorage.removeItem('rta_user_data');
      setSubmittedData(null);
      navigateTo('landing');
  }
  
  const renderPage = () => {
    switch (page) {
      case 'signup':
        return isLoading ? (
            <div className="flex h-screen items-center justify-center text-white flex-col">
                <div className="w-12 h-12 border-4 border-[#c8102e] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Processing Application...</p>
            </div>
        ) : (
            <SignUpPage 
                onSignUpSubmit={handleSignUpSubmit} 
                onNavigate={navigateTo}
                step={signUpStep}
                setStep={setSignUpStep}
                maxStepReached={signUpMaxStep}
                setMaxStepReached={setSignUpMaxStep}
            />
        );
      case 'login':
          return (
              <LoginPage 
                onLogin={handleLogin}
                onNavigate={navigateTo}
                error={loginError}
              />
          );
      case 'dashboard':
        return submittedData ? <DashboardPage userData={submittedData} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  const mainPadding = page === 'landing' ? '' : 'pt-24';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans antialiased relative overflow-x-hidden">
      <BackgroundOrbs />
      <Header 
        page={page}
        onNavigate={navigateTo}
        signUpStep={signUpStep}
        signUpMaxStep={signUpMaxStep}
        onSetSignUpStep={handleSetSignUpStep}
        onLogout={handleLogout}
      />
      <main className={`relative z-10 ${mainPadding}`}>
        {renderPage()}
      </main>
    </div>
  );
}
