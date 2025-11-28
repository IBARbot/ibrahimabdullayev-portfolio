// API utility functions
const API_BASE_URL = '/api'

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API Error: ${response.statusText}`)
    }
    return response.json()
  },
}

// Admin API endpoints
export const adminApi = {
  login: (username: string, password: string) => 
    api.post<{ success: boolean; token?: string; message?: string }>('/admin/login', { username, password }),
  
  getContent: () => 
    api.get('/content'),
  
  updateContent: (content: unknown, token: string) => 
    api.put('/admin/content', content, token),
  
  getBookings: (token: string) => 
    fetch(`${API_BASE_URL}/admin/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch bookings')
      return res.json()
    }),
  
  updateBookingStatus: (id: string, status: string, token: string) => 
    fetch(`${API_BASE_URL}/admin/bookings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update booking')
      return res.json()
    }),
}

