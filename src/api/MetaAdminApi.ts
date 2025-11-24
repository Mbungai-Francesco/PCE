import axios from "axios";
import { link } from ".";
import type { MetaAdmin } from "../types";

const route : string = "api/metadmin"

export const createMetaAdmin = async (tech : MetaAdmin) => {
    try{
        const res = await axios.post(`${link}/${route}`,tech)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaAdmin
    }catch(error){
        throw new Error('Create MetaAdmin failed: ' + (error as Error).message);
    }
}

export const getMetaAdmin = async () => {
    try{
        const res = await axios.get(`${link}/${route}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaAdmin[]
    }catch(error){
        throw new Error('Get MetaAdmin failed: ' + (error as Error).message);
    }
}

export const getMetaAdminById = async (id : string) => {
    try{
        const res = await axios.get(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaAdmin
    }catch(error){
        throw new Error('Get MetaAdmin by id failed: ' + (error as Error).message);
    }
}

export const updateMetaAdmin = async (id : string, tech : MetaAdmin) => {
    try{
        const res = await axios.put(`${link}/${route}/${id}`, tech)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaAdmin
    }catch(error){
        throw new Error('Update MetaAdmin failed: ' + (error as Error).message);
    }
}

export const deleteMetaAdmin = async (id : string) => {
    try{
        const res = await axios.delete(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaAdmin
    }catch(error){
        throw new Error('Delete MetaAdmin failed: ' + (error as Error).message);
    }
}