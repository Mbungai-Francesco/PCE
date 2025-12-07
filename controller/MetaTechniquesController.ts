import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMetaTechniques = async (req: Request, res: Response) => {
  try {
    const { idMission, datePublication, xMin, yMin, xMax, yMax, debut, fin } = req.body;

    if (!idMission || !datePublication || xMin == null || yMin == null || xMax == null || yMax == null) {
      return res.status(400).json({ message: 'Missing required fields: idMission, datePublication, xMin, yMin, xMax, yMax' });
    }

    // Ensure referenced mission exists
    const mission = await db.missionDrone.findUnique({ where: { id: idMission } });
    if (!mission) {
      return res.status(404).json({ message: 'Referenced MissionDrone not found' });
    }

    const techniquesExist = await db.metadonneesTechniques.findUnique({ where: { idMission } });
    if (techniquesExist) {
      return res.status(409).json({ message: 'MetadonneesTechniques for this mission already exists' });
    }

    const meta = await db.metadonneesTechniques.create({
      data: {
        ...req.body,
        xMin: Number(xMin),
        yMin: Number(yMin),
        xMax: Number(xMax),
        yMax: Number(yMax),
        mission: { connect: { id: idMission } },
      },
    });

    return res.status(201).json({ message: 'MetadonneesTechniques created', data: meta });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'MetadonneesTechniques for this mission already exists', meta: error.meta });
    }
    console.error('CreateMetaTechniques error:', error?.message ?? error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const GetAllMetaTechniques = async (req: Request, res: Response) => {
  try {
    const metas = await db.metadonneesTechniques.findMany({ include: { mission: true } });
    return res.status(200).json({ message: 'MetadonneesTechniques found', data: metas });
  } catch (error: any) {
    console.error('GetAllMetaTechniques error:', error?.message ?? error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const GetMetaTechniquesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meta = await db.metadonneesTechniques.findUnique({ where: { id }, include: { mission: true } });
    if (!meta) {
      return res.status(404).json({ message: 'MetadonneesTechniques not found' });
    }
    return res.status(200).json({ message: 'MetadonneesTechniques found', data: meta });
  } catch (error: any) {
    console.error('GetMetaTechniquesById error:', error?.message ?? error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const UpdateMetaTechniquesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // If dates or numeric fields are provided, convert them
    const data: any = { ...req.body };
    if (data.datePublication) data.datePublication = new Date(data.datePublication);
    if (data.debut) data.debut = new Date(data.debut);
    if (data.fin) data.fin = new Date(data.fin);
    if (data.xMin != null) data.xMin = Number(data.xMin);
    if (data.yMin != null) data.yMin = Number(data.yMin);
    if (data.xMax != null) data.xMax = Number(data.xMax);
    if (data.yMax != null) data.yMax = Number(data.yMax);

    const updated = await db.metadonneesTechniques.update({ where: { id }, data });
    if (!updated) {
      return res.status(404).json({ message: 'MetadonneesTechniques not found' });
    }
    return res.status(200).json({ message: 'MetadonneesTechniques updated', data: updated });
  } catch (error: any) {
    console.error('UpdateMetaTechniquesById error:', error?.message ?? error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const DeleteMetaTechniquesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.metadonneesTechniques.delete({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'MetadonneesTechniques not found' });
    }
    return res.status(200).json({ message: 'MetadonneesTechniques deleted', data: deleted });
  } catch (error: any) {
    console.error('DeleteMetaTechniquesById error:', error?.message ?? error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
