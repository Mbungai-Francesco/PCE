import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMissionDrone = async (req: Request, res: Response) =>{
    try{
        const { dateDebutVol, dateFinVol, capteurUtilise, motDePasse, motsCles, nomProprietaire, emailProprietaire, entrepriseProprietaire } = req.body;

        if (!dateDebutVol || !dateFinVol || !capteurUtilise || !motDePasse || !motsCles || !nomProprietaire || !emailProprietaire || !entrepriseProprietaire) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newMission = await db.missionDrone.create({
            data: {
                ...req.body,
                statutValidation: false
            },
        });

        if(!newMission){
            return res.status(500).json({ message: 'Failed to create mission' });
        }

        return res.status(201).json({message : "Mission created", data:newMission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const GetAllMissionsDrones = async (req: Request, res: Response) =>{
    try{
        const missions =  await db.missionDrone.findMany();
        return res.status(200).json({message : "Missions found", data: missions});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const GetMissionDroneById = async (req: Request, res: Response) =>{
    try{
        const { id } = req.params;
        const mission =  await db.missionDrone.findUnique({
            where: { id: id },
            include: {
                technique: true,
                generale: true,
                admin: true,
            },
        });

        if(!mission){
            return res.status(404).json({ message: 'Mission not found' });
        }

        return res.status(200).json({message : "Mission found", data: mission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const DeleteMissionDroneById = async (req: Request, res: Response) =>{
    try{
        const { id } = req.params;
        const mission =  await db.missionDrone.delete({
            where: { id: id },
        });

        if(!mission){
            return res.status(404).json({ message: 'Mission not found' });
        }

        return res.status(200).json({message : "Mission deleted", data: mission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const UpdateMissionDroneById = async (req: Request, res: Response) =>{
    try{
        const { id } = req.params;
        const updatedMission =  await db.missionDrone.update({
            where: { id: id },
            data: req.body,
        });

        if(!updatedMission){
            return res.status(404).json({ message: 'Mission not found' });
        }

        return res.status(200).json({message : "Mission updated", data: updatedMission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}