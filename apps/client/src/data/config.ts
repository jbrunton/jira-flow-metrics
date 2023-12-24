import axios from "axios";

export const configureDefaults = () => {
  axios.defaults.baseURL = "http://localhost:3000/api";
};
