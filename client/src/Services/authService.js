export const login = async (credentials) => {
    try {
      const response = await fetch('https://localhost:7193/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
        return { success: true, token: data.token };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };
  