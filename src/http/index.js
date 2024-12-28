import Vue from "vue";
import Axios from "axios";
import { Message } from "element-ui";
import router from "../router";

// 创建axios实例
const instance = Axios.create({
    baseURL: 'http://localhost:8080/api',  // 添加 /api 前缀
    timeout: 60000,
    withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        console.log('请求配置:', config);
        
        // 根据请求方法设置不同的Content-Type
        if (config.method.toLowerCase() === 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            // 将POST请求数据转换为表单格式
            if (config.data) {
                const formData = new URLSearchParams();
                for (const key in config.data) {
                    formData.append(key, config.data[key]);
                }
                config.data = formData;
            }
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config;
    },
    error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        console.log('响应数据:', response.data);
        return response.data;
    },
    error => {
        console.error('响应错误:', error);
        Message.error(error.response?.data?.message || error.message || '服务器错误');
        return Promise.reject(error);
    }
);

// 封装请求方法
export default function http(url, method = 'get', data = {}) {
    return instance({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: data
    });
}