import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/auth';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './SetPassword.css';

function SetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { firstName, lastName, email, phone } = location.state || {};

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [activeField, setActiveField] = useState<'password' | 'confirmPassword'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Custom Keypad Logic
    const handleKeyClick = (val: string) => {
        setFormData(prev => ({
            ...prev,
            [activeField]: prev[activeField] + val
        }));
    };

    const handleDelete = () => {
        setFormData(prev => ({
            ...prev,
            [activeField]: prev[activeField].slice(0, -1)
        }));
    };

    const handleRegister = async (role: 'RIDER' | 'DRIVER' | 'ADMIN') => {
        if (!formData.password || !formData.confirmPassword) {
            alert('Please enter and confirm your password');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // First and Last name are now received directly from state

            await registerUser({
                firstName,
                lastName,
                identifier: email,
                phoneNumber: phone,
                password: formData.password,
                role
            });

            if (role === 'RIDER') {
                navigate('/enable-location');
            } else {
                navigate('/driver-details');
            }
        } catch (error: any) {
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueAsRider = () => {
        handleRegister('RIDER');
    };

    const handleContinueAsDriver = () => {
        handleRegister('DRIVER');
    };

    // Keyboard Key Data (Standard Layout)
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
        ['123', 'space', 'return']
    ];

    return (
        <div className="onboarding-screen set-password-page no-scroll">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            {/* Back Button */}
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </header>

            <div className="set-password-content">
                <div className="title-section centered">
                    <h1>Set password</h1>
                    <p className="subtitle">Set your password</p>
                </div>

                <div className="mobile-form">
                    <div className={`password-group ${activeField === 'password' ? 'active' : ''}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={formData.password}
                            readOnly
                            onClick={() => setActiveField('password')}
                        />
                        <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                                {!showPassword && <line x1="4" y1="4" x2="20" y2="20" stroke="#B8B8B8" strokeWidth="2" />}
                            </svg>
                        </button>
                    </div>

                    <div className={`password-group ${activeField === 'confirmPassword' ? 'active' : ''}`}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            readOnly
                            onClick={() => setActiveField('confirmPassword')}
                        />
                        <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                                {!showConfirmPassword && <line x1="4" y1="4" x2="20" y2="20" stroke="#B8B8B8" strokeWidth="2" />}
                            </svg>
                        </button>
                    </div>

                    <button className="btn-rider" onClick={handleContinueAsRider} disabled={isLoading}>
                        {isLoading ? "creating account..." : "Continue As Rider"}
                    </button>

                    <button className="btn-driver" onClick={handleContinueAsDriver} disabled={isLoading}>
                        {isLoading ? "creating account..." : "Continue As Driver"}
                    </button>
                </div>
            </div>

            {/* Custom Alphanumeric Keyboard (Mock to match vision) */}
            <div className="alphanumeric-keyboard">
                <div className="keyboard-suggested">
                    <span>I</span>
                    <span>Ride</span>
                    <span>Go</span>
                </div>
                {keyboardRows.map((row, i) => (
                    <div key={i} className={`kb-row kb-row-${i}`}>
                        {row.map(key => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (key === 'backspace') handleDelete();
                                    else if (key === 'space') handleKeyClick(' ');
                                    else if (key === 'return') handleContinueAsDriver();
                                    else if (key !== 'shift' && key !== '123') handleKeyClick(key);
                                }}
                                className={`kb-key ${key === 'space' ? 'kb-space' : ''} ${key === 'shift' || key === 'backspace' || key === '123' || key === 'return' ? 'kb-special' : ''}`}
                            >
                                {key === 'backspace' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 4H8L1 12L8 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" />
                                        <line x1="18" y1="9" x2="12" y2="15" />
                                        <line x1="12" y1="9" x2="18" y2="15" />
                                    </svg>
                                ) : key === 'shift' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L4 10H8V18H16V10H20L12 2Z" />
                                    </svg>
                                ) : key}
                            </button>
                        ))}
                    </div>
                ))}

                {/* Visual Home Indicator Mock in Keyboard area */}
            </div>
            <HomeIndicator dark />
        </div>
    );
}

export default SetPassword;
