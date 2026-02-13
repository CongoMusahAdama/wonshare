import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import visaLogo from '../assets/visa-logo-img.png';
import mtnLogo from '../assets/mtn-logo-img.png';
import './AddPaymentMethod.css';
import './Payment.css'; // Import payment styles for the background

const AddPaymentMethod = () => {
    const navigate = useNavigate();

    const handleBackdropClick = () => {
        navigate('/payment');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/home_screen_Transport');
    };

    return (
        <div className="add-payment-screen">
            {/* Background Content - Mocking the Payment screen */}
            <div className="payment-background-content">
                <div className="status-bar-wrapper">
                    <StatusBar dark />
                </div>

                <header className="payment-header">
                    <button className="back-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="payment-title">Payment</h1>
                    <div className="header-spacer"></div>
                </header>

                <div className="payment-methods-list">
                    <div className="payment-card">
                        <div className="card-logo visa-bg">
                            <img src={visaLogo} alt="Visa" className="visa-logo" />
                        </div>
                        <div className="card-details">
                            <span className="card-number">**** **** **** 8970</span>
                            <span className="card-expiry">Expires: 12/26</span>
                        </div>
                    </div>

                    <div className="payment-card">
                        <div className="card-logo">
                            <img src={mtnLogo} alt="MTN" className="mtn-logo-img" />
                        </div>
                        <div className="card-details">
                            <span className="card-number">*** *** 1234</span>
                            <span className="card-expiry mtn-label">mtn mobile money</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="backdrop-overlay" onClick={handleBackdropClick}></div>

            <div className="modal-sheet">
                <div className="drag-handle"></div>

                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Account Name</label>
                        <div className="input-field-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                defaultValue="Jane Doe"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Number</label>
                        <div className="input-field-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                defaultValue="123236"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bank</label>
                        <div className="input-field-wrapper">
                            <select className="select-field" defaultValue="CalBank">
                                <option value="CalBank">CalBank</option>
                                <option value="Standard Chartered">Standard Chartered</option>
                                <option value="GCB Bank">GCB Bank</option>
                                <option value="Ecobank">Ecobank</option>
                            </select>
                            <div className="chevron-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default AddPaymentMethod;
