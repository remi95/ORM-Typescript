import fetch from 'node-fetch';
import { API_BASE_URL } from '../../config';

enum PUSH_METHODS {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

class Request {
  static async getData(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();

      return data;
    } catch (e) {
      throw new Error(`Error while getting data : ${e}`);
    }
  }

  static async pushData(method: PUSH_METHODS, endpoint: string, body: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        body,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      const data = await response.json();

      return data;
    } catch (e) {
      throw new Error(`Error while creating data : ${e}`);
    }
  }

  static async create(endpoint: string, body: string): Promise<any> {
    return Request.pushData(PUSH_METHODS.POST, endpoint, body);
  }

  static async update(endpoint: string, body: string): Promise<any> {
    return Request.pushData(PUSH_METHODS.PUT, endpoint, body);
  }

  static async patch(endpoint: string, body: string): Promise<any> {
    return Request.pushData(PUSH_METHODS.PATCH, endpoint, body);
  }

  static deleteData = async (endpoint: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (e) {
      throw new Error(`An error occurred while deleting data : ${e}`);
    }
  };
}

export default Request;
