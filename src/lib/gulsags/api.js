// Central frontend API client: credentials/CSRF handling, readable errors, and shared TanStack Query options live here.
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
export const configured = Boolean(import.meta.env.VITE_API_BASE_URL);
export const api = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL || '/api-unconfigured',withCredentials:true,timeout:20000});
let csrf;
function messageFor(error){return error.response?.data?.message || (error.response?.status===401?'Your session has expired. Please sign in again.':error.message==='Network Error'?'We couldn’t connect. Please try again later.':error.message)}
export async function request(method,path,data,config={}){
 if(!configured) throw new Error('This service is not available yet. Please try again later.');
 try {
  if(method!=='get' && !csrf){csrf=(await api.get('/auth/csrf')).data.token;}
  const options={method,url:path,data,...config,headers:{...config.headers,...(method!=='get'?{'X-CSRF-Token':csrf}:{})}};
  let result;
  try{result=await api.request(options)}catch(error){
   if(method==='get'||error.response?.data?.code!=='CSRF_TOKEN_INVALID')throw error;
   csrf=(await api.get('/auth/csrf')).data.token;
   options.headers={...options.headers,'X-CSRF-Token':csrf};
   result=await api.request(options);
  }
  if(result.data?.csrfToken) csrf=result.data.csrfToken;
  if(path==='/auth/admin/logout') csrf=undefined;
  return result.data;
 }catch(error){if(error.response?.status===401)csrf=undefined;throw new Error(messageFor(error));}
}
export const publicQuery=(resource,fallback)=>queryOptions({queryKey:['public',resource],queryFn:()=>{if(configured)return request('get',`/public/${resource}`);if(fallback!==undefined)return Promise.resolve(fallback);throw new Error('The database service is not configured. Please try again later.')},staleTime:resource==='projects'?0:60000});
