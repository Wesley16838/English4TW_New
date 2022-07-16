import { useQuery } from "react-query";
import authDeviceStorage from "./authDeviceStorage";
import api from "./api";

// { word: "test1", detail: "A test1", speech: "v. 動詞", subtitle: "可數與不可數 --" }
export const fetchSavedWords = async() => {
    try{
        console.log('fetchSavedWords!')
        const res = []
        const promises: any[] = []
        const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
        const token = userInfo && JSON.parse(userInfo).token
        const result = await api.get('api/getUserWords',{
            headers: {
            "Authorization" : `Bearer ${token}`,
            }
        })
        if(result.data.message === 'Unauthorized') throw new Error('Unauthorized')
        console.log('result,', result)
        return result.data.data.words
    }catch (e: unknown) {
        if(e instanceof Error){
            return e.message
        }
    }
}

export const getSavedWords = (keys: any[], onSuccess: (data: any) => void, onError: (data: any) => void, parameters?: any) => {
    return  useQuery('saved_words', fetchSavedWords, {
        onSuccess,
        onError,
        refetchOnMount: parameters?.refetchOnMount || false,
        refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false
    })
}