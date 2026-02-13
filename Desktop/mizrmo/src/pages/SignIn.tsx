import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleForgotPassword = () => {
        navigate('/send-verification'); // Updated to point to the intermediate screen
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // Log in logic
        navigate('/home_screen_Transport'); // As per user text
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="signin-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <header className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </header>

            <div className="signin-content">
                <h1 className="signin-title">Sign in with your email or phone number</h1>

                <form className="signin-form" onSubmit={handleSignIn}>
                    <div className="input-field-container">
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <div className="input-icons">
                                <button type="button" className="icon-btn" onClick={togglePasswordVisibility}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        {!showPassword && <line x1="1" y1="1" x2="23" y2="23" stroke="#94A3B3" strokeWidth="2" />}
                                    </svg>
                                </button>
                                <button type="button" className="icon-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="input-field-container">
                        <div className="input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <div className="input-icons">
                                <button type="button" className="icon-btn" onClick={toggleConfirmPasswordVisibility}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        {!showConfirmPassword && <line x1="1" y1="1" x2="23" y2="23" stroke="#94A3B3" strokeWidth="2" />}
                                    </svg>
                                </button>
                                <button type="button" className="icon-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="button" className="forgot-password" onClick={handleForgotPassword}>
                        Forget password?
                    </button>

                    <button type="submit" className="signin-btn">
                        Sign In
                    </button>
                </form>

                <div className="divider">
                    <span className="divider-line"></span>
                    <span className="divider-text">or</span>
                    <span className="divider-line"></span>
                </div>

                <div className="social-signin">
                    <button className="social-btn gmail">
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        <span>Sign in with Gmail</span>
                    </button>
                    <button className="social-btn apple">
                        <svg width="24" height="24" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-97.3-66.2-101.7-91.8zM301.1 34.4c-22.3-26.6-52-44.3-88.5-44.3-1.6 0-4.1.2-5.7.2C208.2 59.4 238.4 100 274.5 131c1.6 1.4 4.5 2.1 6.1 2.1 34.2-42.6 42.8-72.1 20.5-98.7z" />
                        </svg>
                        <span>Sign in with Apple</span>
                    </button>
                </div>

                <div className="signup-footer">
                    <p>Don't have an account? <span className="signup-link" onClick={handleSignUp}>Sign Up</span></p>
                </div>
            </div>
            <HomeIndicator dark />
        </div>
    );
};

export default SignIn;
