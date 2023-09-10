import axios from "axios";
import baseUrl from "../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const multipartHeaders = {
  "Content-Type": "Multipart/form-data",
};

const setActive = async (data) => {
  try {
    const response = await axios
      .post(`${baseUrl.server}/api/admin/set-active`, data, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

const setMentor = async (data) => {
  try {
    const response = await axios
      .post(`${baseUrl.server}/api/admin/set-mentor`, data, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

const readUsers = async () => {
  try {
    const response = await axios
      .get(`${baseUrl.server}/api/admin/read-users`, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

const readUserById = async (id) => {
  try {
    const response = await axios
      .get(`${baseUrl.server}/api/admin/read-user-by-id/${id}`, { headers });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

const updateUser = async (data, id) => {
  try {
    const response = await axios
      .put(`${baseUrl.server}/api/admin/update-user/${id}`, data, {
        multipartHeaders,
      });
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export { setActive, setMentor, readUsers, readUserById, updateUser };
