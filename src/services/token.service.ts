import { jwtDecode } from 'jwt-decode';

export const tokenService = {
  getAccessToken: () => {
    const token = localStorage.getItem('accessToken');
    return token;
  },
  
  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },
  
  removeAccessToken: () => {
    localStorage.removeItem('accessToken');
  },
  
  decodeToken: (token: string) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};

export default tokenService