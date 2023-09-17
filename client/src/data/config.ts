import axios from 'axios'

export const setDefaultDomainId = (domainId: string) => {
  axios.defaults.params = { domainId };
}

// export const clearBearerToken = () => {
//   axios.defaults.headers.common = {}
// }

//export const apiUrl = import.meta.env.VITE_API_URL

export const configureDefaults = () => {
  axios.defaults.baseURL = 'http://localhost:3000';
}
