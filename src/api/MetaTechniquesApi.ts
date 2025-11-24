import axios from "axios";
import { link } from ".";
import type { MetaTechniques } from "../types";

const route : string = "api/metatechniques"

export const createMetaTechniques = async (tech : MetaTechniques) => {
    try{
        const res = await axios.post(`${link}/${route}`,tech)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaTechniques
    }catch(error){
        throw new Error('Create MetaTechniques failed: ' + (error as Error).message);
    }
}

export const getMetaTechniques = async () => {
    try{
        const res = await axios.get(`${link}/${route}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaTechniques[]
    }catch(error){
        throw new Error('Get MetaTechniques failed: ' + (error as Error).message);
    }
}

export const getMetaTechniquesById = async (id : string) => {
    try{
        const res = await axios.get(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaTechniques
    }catch(error){
        throw new Error('Get MetaTechniques by id failed: ' + (error as Error).message);
    }
}

export const updateMetaTechniques = async (id : string, tech : MetaTechniques) => {
    try{
        const res = await axios.put(`${link}/${route}/${id}`, tech)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaTechniques
    }catch(error){
        throw new Error('Update MetaTechniques failed: ' + (error as Error).message);
    }
}

export const deleteMetaTechniques = async (id : string) => {
    try{
        const res = await axios.delete(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MetaTechniques
    }catch(error){
        throw new Error('Delete MetaTechniques failed: ' + (error as Error).message);
    }
}