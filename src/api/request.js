import axios from 'axios';
import router from '@/router';
import { setLoading, setToast } from '@/utils/auth';
import { getToken, setToken, removeToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    setLoading(true);
    const token = getToken();

    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    setLoading(false);

    if (!res.code) {
      return response;
    }

    if (res.code === 200) {
      /**
       * 令牌失效后重新替换
       */
      if (response.headers.authorization) {
        setToken(response.headers.authorization);
      }

      return res;
    } else {
      if (res.code === 401) {
        removeToken();
        router.go('/login'); // redirect to login form
      }
      setToast({
        type: 'error',
        code: res.code,
        message: res.message,
      });

      return Promise.reject(res);
    }
  },
  (error) => {
    setToast({
      type: 'error',
      code: error.code,
      message: error.message,
    });
    setLoading(false);
    return Promise.reject(error);
  }
);

export default service;
