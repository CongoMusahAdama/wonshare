import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './ProfileSetup.css';

function ProfileSetup() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        image: null as string | null,
        gender: '',
        age: '',
        occupation: '',
        hobbies: '',
        language: ''
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleSave = () => {
        // Mock save
        navigate('/success');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="onboarding-screen profile-setup-page">
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

            <div className="profile-setup-content-scroll">
                <div className="profile-image-picker">
                    <div className="image-circle">
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" />
                        ) : (
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="#D0D0D0" strokeWidth="2" />
                                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                        <label className="add-btn">
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </label>
                    </div>
                    <p>Add Profile Photo</p>
                </div>

                <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="input-group">
                        <label>Gender</label>
                        <select
                            className="mobile-select"
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Age</label>
                        <input
                            type="number"
                            placeholder="Enter your age"
                            value={profile.age}
                            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Occupation</label>
                        <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={profile.occupation}
                            onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Language</label>
                        <select
                            className="mobile-select"
                            value={profile.language}
                            onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        >
                            <option value="">Select language</option>
                            <option value="english">English</option>
                            <option value="french">French</option>
                            <option value="spanish">Spanish</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        Save All
                    </button>
                </form>
            </div>
            <HomeIndicator dark />
        </div>
    );
}

export default ProfileSetup;
