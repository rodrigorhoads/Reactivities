import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";


const sleep = (delay: number)=>{
    return new Promise((resolve)=>    {
        setTimeout(resolve, delay);
    } );
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response=>{
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/Activity'),
    details: (id: string)=> requests.get<Activity>(`/Activity/${id}`),
    create:(activity: Activity)=>requests.post<void>('/Activity/',activity),
    update:(activity: Activity)=>requests.put<void>(`/Activity/${activity.id}`,activity),
    delete: (id: string)=> requests.del<void>(`/Activity/${id}`)
}

const agent = {
    Activities
}

export default agent;