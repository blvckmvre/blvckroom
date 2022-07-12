import axios from "axios";
import { IAuthResponse } from "../types/auth-types";
import url from "../url";

const params = {
    baseURL: url+"api",
    withCredentials: true
}

export const $req = axios.create(params);

$req.interceptors.request.use(conf=>{
    conf.headers!.authorization = "Bearer "+localStorage.getItem("accessToken");
    return conf;
});

$req.interceptors.response.use(res=>res, async (e: any)=>{
    if(e.response.status===401 && !e.config.repeats){
        e.config.repeats = true;
        try {
            const res = await axios.get<IAuthResponse>(url+"api/refresh", {withCredentials: true});
            localStorage.setItem("accessToken", res.data.user!.accessToken);
            return $req.request(e.config);
        } catch(err) {
            throw err;
        }
    } else throw e;
})
