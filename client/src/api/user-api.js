import axios from "axios";
import baseUrl from "../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const multipartHeaders = {
  "Content-Type": "Multipart/form-data",
};

export const create = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/create`,
      data,
      {
        multipartHeaders,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/login`,
      data,
      {
        headers,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${baseUrl.server}/api/users/logout`, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const readName = async (id) => {
  try {
    const response = await axios.get(`${baseUrl.server}/api/users/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await axios.get(
      `${baseUrl.server}/api/users/is-authenticated`,
      {
        headers,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updateInfo = async (data, id) => {
  try {
    const response = await axios.put(
      `${baseUrl.server}/api/users/update-info/${id}`,
      data,
      { multipartHeaders }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const updatePassword = async (data, id) => {
  try {
    const response = await axios.put(
      `${baseUrl.server}/api/users/update-password/${id}`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const removeWithPassword = async (data, id) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/delete-with-password/${id}`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(
      `${baseUrl.server}/api/users/delete/${id}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
