import axios from "axios";

const axiosInstance = () => {
  const token = localStorage.getItem("userToken");
  if (token) return axios.create({ headers: { "x-auth-token": token } });
  else return axios.create();
};

const instance = axiosInstance();
export default instance;
