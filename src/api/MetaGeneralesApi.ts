import axios from "axios";
import { link } from ".";
import type { MetaGenerales } from "../types";

const route : string = "api/metagenerales"

export const createMetaGenerales = async (gen : MetaGenerales) => {
    try{
        const res = await axios.post(`${link}/${route}`,gen)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaGenerales
    }catch(error){
        throw new Error('Create MetaGenerales failed: ' + (error as Error).message);
    }
}

export const getMetaGenerales = async () => {
    try{
        const res = await axios.get(`${link}/${route}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaGenerales[]
    }catch(error){
        throw new Error('Get MetaGenerales failed: ' + (error as Error).message);
    }
}

export const getMetaGeneralesById = async (id : string) => {
    try{
        const res = await axios.get(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaGenerales
    }catch(error){
        throw new Error('Get MetaGenerales by id failed: ' + (error as Error).message);
    }
}

export const updateMetaGenerales = async (id : string, gen : MetaGenerales) => {
    try{
        const res = await axios.put(`${link}/${route}/${id}`, gen)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaGenerales
    }catch(error){
        throw new Error('Update MetaGenerales failed: ' + (error as Error).message);
    }
}

export const deleteMetaGenerales = async (id : string) => {
    try{
        const res = await axios.delete(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaGenerales
    }catch(error){
        throw new Error('Delete MetaGenerales failed: ' + (error as Error).message);
    }
}