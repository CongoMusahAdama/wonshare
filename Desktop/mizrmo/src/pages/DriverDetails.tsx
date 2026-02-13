import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import './DriverDetails.css';

const DriverDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dob: '',
        emergencyContact: '',
        gender: '',
        licenseNumber: '',
        dateIssued: '',
        expiryDate: '',
        ghanaCardNumber: '',
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleSkip = () => {
        navigate('/vehicle-details');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Driver Details Submitted:', formData);
        navigate('/success');
    };

    // Shared upload icon component
    const UploadIcon = () => (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#F0F5FF" />
            <path d="M12 16.5C12 15.1193 13.1193 14 14.5 14H25.5C26.8807 14 28 15.1193 28 16.5V23.5C28 24.8807 26.8807 26 25.5 26H14.5C13.1193 26 12 24.8807 12 23.5V16.5Z" stroke="#4D8BFF" strokeWidth="1.5" />
            <path d="M12 21L16.2929 16.7071C16.6834 16.3166 17.3166 16.3166 17.7071 16.7071L22 21L24.2929 18.7071C24.6834 18.3166 25.3166 18.3166 25.7071 18.7071L28 21" stroke="#4D8BFF" strokeWidth="1.5" />
            <circle cx="21" cy="18" r="1.5" fill="#4D8BFF" />
            <rect x="23" y="11" width="8" height="8" rx="4" fill="#0056B3" />
            <path d="M27 13V17M25 15H29" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="driver-details-screen">
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
                <h1 className="page-title">Driver Details</h1>
                <button className="skip-btn" onClick={handleSkip}>Skip</button>
            </header>

            <form className="details-form" onSubmit={handleSubmit}>
                {/* 1. Date of Birth */}
                <div className="input-field-container">
                    <label>Date Of Birth<span className="required">*</span></label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="Date of Birth"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                        />
                        <span className="icon-calendar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* 2. Emergency Contact */}
                <div className="input-field-container">
                    <label>Emergency Contact<span className="required">*</span></label>
                    <input
                        type="text"
                        placeholder="Emergency Contact"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                </div>

                {/* 3. Gender */}
                <div className="gender-selection-container">
                    <label>Select Gender</label>
                    <div className="gender-options">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                            <span className="radio-custom"></span>
                            Male
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                            <span className="radio-custom"></span>
                            Female
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={formData.gender === 'other'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                            <span className="radio-custom"></span>
                            Other
                        </label>
                    </div>
                </div>

                {/* 4. Driver's License Section */}
                <div className="input-field-container">
                    <label>Driver's Licence<span className="required">*</span></label>
                    <input
                        type="text"
                        placeholder="Driver's Licence Number"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                </div>

                <div className="row">
                    <div className="input-field-container half-width">
                        <label>Date Issued<span className="required">*</span></label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                placeholder="Date Issued"
                                value={formData.dateIssued}
                                onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.type = "text")}
                            />
                            <span className="icon-calendar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="input-field-container half-width">
                        <label>Expiry Date<span className="required">*</span></label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                placeholder="Expiry Date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.type = "text")}
                            />
                            <span className="icon-calendar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 2V6" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 10H21" stroke="#94A3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="upload-section">
                    <label>Front Side of Licence<span className="required">*</span></label>
                    <div className="upload-box">
                        <div className="icon-frame-sml">
                            <UploadIcon />
                        </div>
                        <p className="upload-text">Click to Upload Front Side of Licence</p>
                        <p className="upload-hint">(Max. File size: 25 MB)</p>
                        <input type="file" hidden accept="image/*" />
                    </div>
                </div>

                <div className="upload-section">
                    <label>Back Side of Licence<span className="required">*</span></label>
                    <div className="upload-box">
                        <div className="icon-frame-sml">
                            <UploadIcon />
                        </div>
                        <p className="upload-text">Click to Upload Back Side of Licence</p>
                        <p className="upload-hint">(Max. File size: 25 MB)</p>
                        <input type="file" hidden accept="image/*" />
                    </div>
                </div>

                {/* 5. Ghana Card Section */}
                <div className="input-field-container">
                    <label>Ghana Card Number<span className="required">*</span></label>
                    <input
                        type="text"
                        placeholder="Enter Ghana Card Number"
                        value={formData.ghanaCardNumber}
                        onChange={(e) => setFormData({ ...formData, ghanaCardNumber: e.target.value })}
                    />
                </div>

                <div className="upload-section">
                    <label>Front Side of Card<span className="required">*</span></label>
                    <div className="upload-box">
                        <div className="icon-frame-sml">
                            <UploadIcon />
                        </div>
                        <p className="upload-text">Click to Upload Front Side of Card</p>
                        <p className="upload-hint">(Max. File size: 25 MB)</p>
                        <input type="file" hidden accept="image/*" />
                    </div>
                </div>

                <div className="upload-section">
                    <label>Back Side of Card<span className="required">*</span></label>
                    <div className="upload-box">
                        <div className="icon-frame-sml">
                            <UploadIcon />
                        </div>
                        <p className="upload-text">Click to Upload Back Side of Card</p>
                        <p className="upload-hint">(Max. File size: 25 MB)</p>
                        <input type="file" hidden accept="image/*" />
                    </div>
                </div>

                <div className="form-footer">
                    <button type="submit" className="register-btn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default DriverDetails;
