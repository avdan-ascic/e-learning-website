import axios from "axios";
import baseUrl from "../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const create = async (data, id) => {
  try {
    const response = await axios
      .post(`${baseUrl.server}/api/enroll/create/${id}`, data, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.reponse.data;
  }
};

const readByStudent = async (id) => {
  try {
    const response = await axios
      .get(`${baseUrl.server}/api/enroll/read-by-student/${id}`, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const update = async (data, id) => {
  try {
    const response = await axios
      .put(`${baseUrl.server}/api/enroll/update/${id}`, data, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

const remove = async (data, id) => {
  try {
    const response = await axios
      .post(`${baseUrl.server}/api/enroll/remove/${id}`, data, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export { create, readByStudent, update, remove };
