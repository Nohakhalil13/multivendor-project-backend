// import axios from "axios";

// const token = localStorage.getItem("token"); // JWT من تسجيل الدخول

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: token ? { Authorization: `Bearer ${token}` } : {},
// });

// export default api;

////////////////////////////////////////////////
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Cache-Control": "no-cache",
//   },
// });

// export default api;
/////////////////////////////////////////////////


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // لازم الكلمة تكون Authorization ويبدأ بـ Bearer
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

export default api;