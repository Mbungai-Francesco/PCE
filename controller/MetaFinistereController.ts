import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMissionFinistere = async (req: Request, res: Response) =>{
    try{
        // const { idMission } = req.body;
        const { idMission } = req.params;

        if (!idMission) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get existing mission
		const mission = await db.missionDrone.findUnique({ where: { id: idMission } });
		if (!mission) {
			return res.status(404).json({ message: 'Referenced MissionDrone not found' });
		}

        const generalesExist = await db.metadonneesGenerales.findUnique({ where: { idMission } });
        if (!generalesExist) {
            return res.status(404).json({ message: 'MetadonneesGenerales not found' });
        }
        
        const techniquesExist = await db.metadonneesTechniques.findUnique({ where: { idMission } });
        if (!techniquesExist) {
            return res.status(404).json({ message: 'MetadonneesTechniques not found' });
        }

        const adminExist = await db.metadonneesAdmin.findUnique({ where: { idMission } });
        if (!adminExist) {
            return res.status(404).json({ message: 'MetadonneesAdmin not found' });
        }

        const finistereExist = await db.metadonnees_finistere.findUnique({ where: { idMission } });
        if (finistereExist) {
            return res.status(409).json({ message: 'metadonnees_finistere for this mission already exists' });
        }   

        const newMissionFinistere = await db.metadonnees_finistere.create({
            data: {
                ...mission,
                ...generalesExist,
                ...techniquesExist,
                ...adminExist,
            },
        });

        // Compute geometry from centroid of bounding box and update the record
        const x_centro = (techniquesExist.xMin + techniquesExist.xMax) / 2;
        const y_centro = (techniquesExist.yMin + techniquesExist.yMax) / 2;

        await db.$executeRaw`
            UPDATE metadonnees_finistere
            SET geometry = ST_SetSRID(ST_MakePoint(${x_centro}, ${y_centro}), 4326)
            WHERE id = ${newMissionFinistere.id}::uuid
        `;

        if(!newMissionFinistere){
            return res.status(500).json({ message: 'Failed to create mission finistere' });
        }

        return res.status(201).json({message : "Mission finistere created", data:newMissionFinistere});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const GetAllMissionsFinistere = async (req: Request, res: Response) =>{
    try{
        const missions =  await db.metadonnees_finistere.findMany();
        return res.status(200).json({message : "Finistere Missions found", data: missions});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const GetMissionFinistereById = async (req: Request, res: Response) =>{
    try{
        const { id } = req.params;
        const mission =  await db.metadonnees_finistere.findUnique({
            where: { id: id },
        });

        if(!mission){
            return res.status(404).json({ message: 'Finistere Mission not found' });
        }

        return res.status(200).json({message : "Finistere Mission found", data: mission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const GetMissionFinistereByIdMission = async (req: Request, res: Response) =>{
    try{
        const { idMission } = req.params;
        const mission =  await db.metadonnees_finistere.findUnique({
            where: { idMission: idMission },
        });

        if(!mission){
            return res.status(404).json({ message: 'Finistere Mission not found' });
        }

        return res.status(200).json({message : "Finistere Mission found", data: mission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const DeleteMissionFinistereById = async (req: Request, res: Response) =>{
    try{
        const { id } = req.params;
        const mission =  await db.metadonnees_finistere.delete({
            where: { id: id },
        });

        if(!mission){
            return res.status(404).json({ message: 'Finistere Mission not found' });
        }

        return res.status(200).json({message : "Finistere Mission deleted", data: mission});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const UpdateMissionFinistereByIdMission = async (req: Request, res: Response) =>{
    try{
        // const { idMission } = req.body;
        const { idMission } = req.params;

        if (!idMission) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get existing mission
		const mission = await db.missionDrone.findUnique({ where: { id: idMission } });
		if (!mission) {
			return res.status(404).json({ message: 'Referenced MissionDrone not found' });
		}

        const generalesExist = await db.metadonneesGenerales.findUnique({ where: { idMission } });
        if (!generalesExist) {
            return res.status(404).json({ message: 'MetadonneesGenerales not found' });
        }
        
        const techniquesExist = await db.metadonneesTechniques.findUnique({ where: { idMission } });
        if (!techniquesExist) {
            return res.status(404).json({ message: 'MetadonneesTechniques not found' });
        }

        const adminExist = await db.metadonneesAdmin.findUnique({ where: { idMission } });
        if (!adminExist) {
            return res.status(404).json({ message: 'MetadonneesAdmin not found' });
        }

        const updatedFinistere =  await db.metadonnees_finistere.update({
            where: { idMission: idMission },
            data: {
                ...mission,
                ...generalesExist,
                ...techniquesExist,
                ...adminExist,
            },
        });

        if(!updatedFinistere){
            return res.status(404).json({ message: 'Finistere Mission not found' });
        }

        return res.status(200).json({message : "Finistere Mission updated", data: updatedFinistere});
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}