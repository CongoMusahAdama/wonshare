import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './Onboarding.css';
import onboardingIllustration from '../assets/onboarding-illustration.png';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            navigate('/register');
        }
    };

    const handleSkip = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleCreateAccount = () => {
        navigate('/register');
    };

    if (step === 1) {
        return (
            <div className="onboarding-screen screen-1">
                {/* Status Bar Component (94px total) */}
                <div className="status-bar-container">
                    <div className="top-status-bar-inner">
                        <StatusBar />
                    </div>
                    <div className="status-bar-parent-layout">
                        {/* Back-Skip: True, Show Back: False, Show Skip: False, Page Title: False */}
                    </div>
                </div>

                <div className="logo-group">
                    <div className="mizrmo">
                        mizrm<span></span>
                    </div>
                    <p className="tagline">Let's Go Together</p>
                </div>

                <button className="arrow-btn" onClick={handleNext}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#004DA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <HomeIndicator />
            </div>
        );
    }

    // Determine content based on step
    const getStepContent = (currentStep: number) => {
        switch (currentStep) {
            case 3:
                return {
                    title: 'Reduce Emissions, Make Impact',
                    text: 'Every shared ride means fewer cars on the road, cleaner air, and a greener planet. Together, we drive towards a sustainable future.',
                    layoutClass: 'step-3'
                };
            case 4:
                return {
                    title: 'Ride Safe, Ride Smart',
                    text: 'Our app ensures verified profiles and secure payments so you can enjoy stress-free rides every time.',
                    layoutClass: 'step-3' // Same layout as step 3
                };
            case 5:
                return {
                    title: 'Welcome To Mizrmo',
                    text: 'We are a community built on respect for each other who share rides, share costs and share experiences. We are so glad you joined us.',
                    layoutClass: 'step-5'
                };
            default: // Step 2
                return {
                    title: 'Share Rides, Save Money!',
                    text: "Cut down on commuting costs by carpooling with people headed your way. It's easy, affordable, and hassle-free!",
                    layoutClass: ''
                };
        }
    };

    const content = getStepContent(step);
    const isWelcomeScreen = step === 5;

    return (
        <div className="onboarding-screen screen-2">
            {/* System Status Bar (iOS Style) */}
            <div className="system-status-bar-bg"></div> {/* Background #D6D9DD */}

            <div className="status-bar-container dark">
                <div className="top-status-bar-inner">
                    <StatusBar dark />
                </div>
                <div className="status-bar-parent-layout">
                    {/* Top Navigation Component - Back/Skip (Hidden as per prompt) */}
                    {/* Left Accessory Container */}
                    <div className="nav-left-accessory" style={{ display: 'none' }}>
                        {/* Back Icon, Title */}
                    </div>
                    {/* Right Accessory Container */}
                    <div className="nav-right-accessory" style={{ display: 'none' }}>
                        {/* Skip Text */}
                    </div>
                </div>
            </div>

            {/* Welcome Illustration Section */}
            <div className="welcome-illustration-section">
                {/* Main Illustration Container / Image Frame */}
                <div className="welcome-image-asset-container">
                    {/* Placeholder for the "Hands holding phone" illustration. 
                        User: Please save your uploaded image as 'src/assets/onboarding-illustration.png' and update this src. 
                    */}
                    <img src={onboardingIllustration} alt="Welcome Illustration" />
                </div>

                {/* Primary Avatar Group */}

            </div>

            {/* Onboarding Text Content */}
            <div className={`onboarding-text-content ${content.layoutClass}`}>
                <h1>{content.title}</h1>
                <p>{content.text}</p>
            </div>

            {/* Pagination Indicator - Hidden on Welcome Screen (Step 5) */}
            {!isWelcomeScreen && (
                <div className="pagination-indicator">
                    {/* Dot 1 */}
                    <div className={step === 2 ? 'ellipse-active' : 'ellipse-inactive'}></div>
                    {/* Dot 2 */}
                    <div className={step === 3 ? 'ellipse-active' : 'ellipse-inactive'}></div>
                    {/* Dot 3 */}
                    <div className={step === 4 ? 'ellipse-active' : 'ellipse-inactive'}></div>
                </div>
            )}

            {/* Actions Buttons */}
            {isWelcomeScreen ? (
                <>
                    {/* Secondary Action - Login */}
                    <button className="btn-skip" onClick={handleLogin}>
                        Login
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {/* Primary Action - Create Account */}
                    <button className="btn-next" onClick={handleCreateAccount}>
                        Create An Account
                    </button>
                </>
            ) : (
                <>
                    <button className="btn-skip" onClick={handleSkip}>
                        Skip
                    </button>
                    <button className="btn-next" onClick={handleNext}>
                        Next
                    </button>
                </>
            )}

            <HomeIndicator dark />
        </div>
    );
};

export default Onboarding;
