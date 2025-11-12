import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMissionDrone = async (req: Request, res: Response) =>{
    try{
        const { dateDebutVol, dateFinVol, typeMission, capteurUtilise, statutValidation, motDePasse, motsCles, nomProprietaire, emailProprietaire, entrepriseProprietaire } = req.body;

        if (!dateDebutVol || !dateFinVol || !typeMission || !capteurUtilise || !statutValidation || !motDePasse || !motsCles || !nomProprietaire || !emailProprietaire || !entrepriseProprietaire) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const findMissionDrone = await db.missionDrone.findUnique({
            where: {
                
            }
        })
    }catch(error: any){
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}