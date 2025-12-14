import axios from "axios";
import { link } from ".";

const route : string = "api/mission"

export const createMissionsFinistere = async (idMission : string) => {
    try{
        const res = await axios.post(`${link}/${route}/${idMission}`,)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data 
    }catch(error){
        throw new Error('Create Mission Finistere failed: ' + (error as Error).message);
    }
}

export const getMissionsFinistere = async () => {
    try{
        const res = await axios.get(`${link}/${route}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as []
    }catch(error){
        throw new Error('Get Missions Finistere failed: ' + (error as Error).message);
    }
}

export const getMissionFinistereById = async (id : string) => {
    try{
        const res = await axios.get(`${link}/${route}/${id}`)
        console.log("message", res.statusText, " mission gotten");
        console.log(res.data.data);
        return res.data.data
    }catch(error){
        throw new Error('Get Mission Finistere by id failed: ' + (error as Error).message);
    }
}

export const updateMissionFinistere = async (idMission : string) => {
    try{
        const res = await axios.put(`${link}/${route}/${idMission}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data
    }catch(error){
        throw new Error('Update Mission Finistere failed: ' + (error as Error).message);
    }
}

export const deleteMissionFinistere = async (id : string) => {
    try{
        const res = await axios.delete(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data
    }catch(error){
        throw new Error('Delete Mission Finistere failed: ' + (error as Error).message);
    }
}