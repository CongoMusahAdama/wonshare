import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './Success.css';

function Success() {
    const navigate = useNavigate();

    return (
        <div className="onboarding-screen success-page">
            <div className="status-bar-wrapper">
                <StatusBar />
            </div>

            <div className="success-body">
                <div className="success-icon-container">
                    <div className="success-circle-outer">
                        <div className="success-circle-inner">
                            <svg width="40" height="30" viewBox="0 0 30 22" fill="none">
                                <path d="M2.33331 11L10.6666 19.3333L27.3333 2.66666" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="confetti-dot dot-1"></div>
                    <div className="confetti-dot dot-2"></div>
                    <div className="confetti-dot dot-3"></div>
                    <div className="confetti-dot dot-4"></div>
                </div>

                <div className="success-text">
                    <h1>Hooray! Account Created</h1>
                    <p>Your profile is ready. You can now start sharing rides and saving money with Mizrmo.</p>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/enable-location')}>
                    Get Started
                </button>
            </div>
            <HomeIndicator />
        </div>
    );
}

export default Success;
