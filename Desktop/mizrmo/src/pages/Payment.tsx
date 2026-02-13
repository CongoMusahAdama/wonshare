
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import visaLogo from '../assets/visa-logo-img.png';
import mtnLogo from '../assets/mtn-logo-img.png';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/add-payment-method');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="payment-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="payment-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="payment-title">Payment</h1>
                <div className="header-spacer"></div>
            </header>

            <div className="payment-methods-list">
                <div className="payment-card" onClick={handleCardClick}>
                    <div className="card-logo visa-bg">
                        <img
                            src={visaLogo}
                            alt="Visa"
                            className="visa-logo"
                        />
                    </div>
                    <div className="card-details">
                        <span className="card-number">**** **** **** 8970</span>
                        <span className="card-expiry">Expires: 12/26</span>
                    </div>
                </div>

                <div className="payment-card" onClick={handleCardClick}>
                    <div className="card-logo">
                        <img
                            src={mtnLogo}
                            alt="MTN"
                            className="mtn-logo-img"
                        />
                    </div>
                    <div className="card-details">
                        <span className="card-number">*** *** 1234</span>
                        <span className="card-expiry mtn-label">mtn mobile money</span>
                    </div>
                </div>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default Payment;
