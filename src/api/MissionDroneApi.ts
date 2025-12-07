import axios from "axios";
import { link } from ".";
import type { MissionDrone } from "../types";

const route : string = "api/mission"

export const createMissionsDrones = async (mission : MissionDrone) => {
    try{
        const res = await axios.post(`${link}/${route}`,mission)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MissionDrone
    }catch(error){
        throw new Error('Create Mission drone failed: ' + (error as Error).message);
    }
}

export const getMissionsDrones = async () => {
    try{
        const res = await axios.get(`${link}/${route}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MissionDrone[]
    }catch(error){
        throw new Error('Get Missions drones failed: ' + (error as Error).message);
    }
}

export const getMissionDroneById = async (id : string) => {
    try{
        const res = await axios.get(`${link}/${route}/${id}`)
        console.log("message", res.statusText, " mission gotten");
        console.log(res.data.data);
        return res.data.data as MissionDrone
    }catch(error){
        throw new Error('Get Mission drone by id failed: ' + (error as Error).message);
    }
}

export const updateMissionDrone = async (id : string, mission : MissionDrone) => {
    try{
        const res = await axios.put(`${link}/${route}/${id}`, mission)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MissionDrone
    }catch(error){
        throw new Error('Update Mission drone failed: ' + (error as Error).message);
    }
}

export const deleteMissionDrone = async (id : string) => {
    try{
        const res = await axios.delete(`${link}/${route}/${id}`)
        console.log("message", res.statusText);
        console.log(res.data.data);
        return res.data.data as MissionDrone
    }catch(error){
        throw new Error('Delete Mission drone failed: ' + (error as Error).message);
    }
}