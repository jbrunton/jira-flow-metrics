import axios from "axios";

// export const setDefaultDomainId = (domainId: string) => {
//   axios.defaults.params = { domainId };
// };

export const configureDefaults = () => {
  axios.defaults.baseURL = "http://localhost:3000/api";
};
