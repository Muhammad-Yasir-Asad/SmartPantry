// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPantryItems = async (token) => {
    return axios.get(`${API_URL}/pantry`, { headers: { Authorization: `Bearer ${token}` } });
};

export const addPantryItem = async (item, token) => {
    return axios.post(`${API_URL}/pantry`, item, { headers: { Authorization: `Bearer ${token}` } });
};

export const updatePantryItem = async (id, item, token) => {
    return axios.put(`${API_URL}/pantry/${id}`, item, { headers: { Authorization: `Bearer ${token}` } });
};

export const deletePantryItem = async (id, token) => {
    return axios.delete(`${API_URL}/pantry/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getExpiringItems = async (token) => {
    return axios.get(`${API_URL}/pantry/expiring-soon`, { headers: { Authorization: `Bearer ${token}` } });
};

export const loginUser = async (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
};

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
};

export const fetchRecipes = async (ingredients, token) => {
    return axios.post(`${API_URL}/recipes`, { ingredients }, { headers: { Authorization: `Bearer ${token}` } });
};
