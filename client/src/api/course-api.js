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
      `${baseUrl.server}/api/courses/create`,
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

export const readAll = async () => {
  try {
    const response = await axios.get(`${baseUrl.server}/api/courses/read-all`, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const readById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl.server}/api/courses/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const update = async (data, id) => {
  try {
    const response = await axios.put(
      `${baseUrl.server}/api/courses/${id}`,
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

export const remove = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl.server}/api/courses/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const readByAttribute = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/courses/filter-attributes`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const readByName = async (name) => {
  try {
    const response = await axios.get(
      `${baseUrl.server}/api/courses/name/${name}`,
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

export const readByAttributeAndName = async (data, name) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/courses/filter-attributes/${name}`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const readByMentor = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl.server}/api/courses/mentor/${id}`,
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
