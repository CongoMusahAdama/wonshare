import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './SendVerification.css';

const SendVerification = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState('');

    const handleBack = () => {
        navigate(-1);
    };

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigation logic
        navigate('/verify_otp');
    };

    return (
        <div className="send-verification-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </header>

            <div className="send-verification-content">
                <h1 className="page-title-verification">Verify email or phone number</h1>

                <form className="verification-form" onSubmit={handleSendOTP}>
                    <div className="input-field-container">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter Email or Phone Number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                            <div className="input-icon-right">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="footer-button-container">
                        <button type="submit" className="send-otp-btn">
                            Send OTP
                        </button>
                    </div>
                </form>
            </div>
            <HomeIndicator dark />
        </div>
    );
};

export default SendVerification;
