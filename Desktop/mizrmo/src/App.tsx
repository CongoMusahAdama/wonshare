import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Registration from './pages/Registration'
import Verification from './pages/Verification'
import SetPassword from './pages/SetPassword'
import ProfileSetup from './pages/ProfileSetup'
import Success from './pages/Success'
import Onboarding from './pages/Onboarding'
import DriverDetails from './pages/DriverDetails'
import SignIn from './pages/SignIn'
import SendVerification from './pages/SendVerification'
import EnableLocation from './pages/EnableLocation'
import AddPaymentMethod from './pages/AddPaymentMethod'
import Payment from './pages/Payment'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/onboarding" replace />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/send-verification" element={<SendVerification />} />
                <Route path="/verify_otp" element={<Verification />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/driver-details" element={<DriverDetails />} />
                <Route path="/success" element={<Success />} />
                <Route path="/enable-location" element={<EnableLocation />} />
                <Route path="/add-payment-method" element={<AddPaymentMethod />} />
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </Router>
    )
}

export default App
