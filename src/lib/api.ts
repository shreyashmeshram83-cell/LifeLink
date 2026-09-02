const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async signup(email: string, password: string, phone?: string, role?: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, phone, role }),
    });
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Donors
  async getDonors(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/donors?${params}`);
  }

  async getDonor(id: string) {
    return this.request(`/donors/${id}`);
  }

  async registerDonor(blood_group: string, lat: number, lng: number) {
    return this.request('/donors', {
      method: 'POST',
      body: JSON.stringify({ blood_group, lat, lng }),
    });
  }

  async updateDonorAvailability(id: string, active: boolean) {
    return this.request(`/donors/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  }

  async getDonorHistory(id: string) {
    return this.request(`/donors/${id}/donation-history`);
  }

  // Hospitals
  async getHospitals() {
    return this.request('/hospitals');
  }

  async getHospital(id: string) {
    return this.request(`/hospitals/${id}`);
  }

  async getHospitalInventory(id: string) {
    return this.request(`/hospitals/${id}/inventory`);
  }

  // Emergency Requests
  async getRequests(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/requests?${params}`);
  }

  async createRequest(data: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRequest(id: string) {
    return this.request(`/requests/${id}`);
  }

  async updateRequestStatus(id: string, status: string) {
    return this.request(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getMatchedDonors(requestId: string) {
    return this.request(`/requests/${requestId}/matched-donors`);
  }

  // Inventory
  async getInventory() {
    return this.request('/inventory');
  }

  async updateInventory(id: string, units_available: number, units_reserved: number) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ units_available, units_reserved }),
    });
  }

  // Analytics
  async getDashboard() {
    return this.request('/analytics/dashboard');
  }

  async getDonorMetrics() {
    return this.request('/analytics/donors');
  }

  async getRequestMetrics() {
    return this.request('/analytics/requests');
  }
}

export const api = new APIClient();
