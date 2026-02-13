import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './Registration.css';

function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to verification or next step
            navigate('/verify_otp', {
                state: {
                    method: 'phone',
                    contact: formData.phone,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                }
            });
        }, 1500);
    };

    return (
        <div className="registration-screen">
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

            <div className="registration-content">
                <h1 className="registration-title">Sign up with your email and phone number</h1>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="input-field-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-field-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-field-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="input-field-group phone-input-group">
                        <div className="country-selector">
                            <img
                                src="https://flagcdn.com/w40/gh.png"
                                alt="Ghana Flag"
                                style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-arrow">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="divider-vertical"></div>
                        <span className="country-code">+233</span>
                        <input
                            type="tel"
                            placeholder="Your mobile number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="terms-checkbox">
                        <div className="checkbox-wrapper">
                            <input type="checkbox" id="terms" required />
                            <div className="custom-checkbox-round">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <label htmlFor="terms">
                            By signing up, you agree to the <span>Terms of service</span> and <span>Privacy policy.</span>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary btn-create-account" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create An Account"}
                    </button>
                </form>

                <div className="divider">
                    <span className="divider-line"></span>
                    <span className="divider-text">or</span>
                    <span className="divider-line"></span>
                </div>

                <div className="social-signup">
                    <button className="social-btn gmail">
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span>Sign up with Gmail</span>
                    </button>
                    <button className="social-btn apple">
                        <svg width="24" height="24" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-97.3-66.2-101.7-91.8zM301.1 34.4c-22.3-26.6-52-44.3-88.5-44.3-1.6 0-4.1.2-5.7.2C208.2 59.4 238.4 100 274.5 131c1.6 1.4 4.5 2.1 6.1 2.1 34.2-42.6 42.8-72.1 20.5-98.7z" />
                        </svg>
                        <span>Sign up with Apple</span>
                    </button>
                </div>

                <div className="registration-footer">
                    <p>Already have an account? <span className="signin-link" onClick={() => navigate('/signin')}>Sign in</span></p>
                </div>
            </div>
            <HomeIndicator dark />
        </div>
    );
}

export default Registration;
