import apiClient from './client';

export interface RegisterUserData {
    firstName: string;
    lastName: string;
    identifier: string; // Email
    phoneNumber: string;
    password?: string;
    role: 'RIDER' | 'DRIVER' | 'ADMIN'; // Matches backend UserRole enum
}

export const registerUser = async (userData: RegisterUserData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add login function later if needed
// export const loginUser = async (credentials: LoginCredentials) => { ... }
