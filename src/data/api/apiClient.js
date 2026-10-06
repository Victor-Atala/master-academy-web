import { API_BASE_URL } from '../../core/constants/api.constants';

export class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

      getAuthToken() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
      if (token && (token.startsWith('mock_') || token.startsWith('demo_'))) {
        return null;
      }
      return token;
    } catch (e) {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = {
      'Accept': 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Laravel returns validation errors in errors object
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null;
        const errorMsg = firstError || data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      if (error.status !== 401 && !error.message?.includes('401')) {
        console.warn(`[ApiClient Warning] ${options.method || 'GET'} ${url}:`, error.message);
      }
      throw error;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
  }

  put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers });
  }

  patch(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const defaultApiClient = new ApiClient();
export const apiClient = defaultApiClient;
