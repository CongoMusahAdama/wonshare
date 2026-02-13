import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import mapBg from '../assets/map-bg.png';
import './EnableLocation.css';

const EnableLocation = () => {
    const navigate = useNavigate();

    const handleUseLocation = () => {
        navigate('/add-payment-method');
    };

    const handleSkip = () => {
        navigate('/add-payment-method');
    };

    return (
        <div className="enable-location-screen">
            {/* Map background using direct asset import for Vite reliability */}
            <div className="background-map-placeholder">
                <img src={mapBg} alt="Map Background" className="map-image-bg" />
                <div className="map-overlay"></div>
            </div>

            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            <div className="location-popup-container">
                <div className="location-popup">
                    <div className="location-illustration">
                        <div className="ripple-container">
                            <div className="ripple ripple-1"></div>
                            <div className="ripple ripple-2"></div>
                            <div className="ripple ripple-3"></div>
                            <div className="pin-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="#FFCC00" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22ZM12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="#FFCC00" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="location-text">
                        <h1>Enable your location</h1>
                        <p>Choose your location to start find the request around you</p>
                    </div>

                    <div className="location-actions">
                        <button className="use-location-btn" onClick={handleUseLocation}>
                            Use my location
                        </button>
                        <button className="skip-link-btn" onClick={handleSkip}>
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default EnableLocation;
