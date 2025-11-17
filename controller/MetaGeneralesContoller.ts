import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMetaGenerales = async (req: Request, res: Response) => {
	try {
		const { idMission, titre, resume, categorieThematique } = req.body;

		if (!idMission || !titre || !resume || !categorieThematique) {
			return res.status(400).json({ message: 'Missing required fields: idMission, titre, resume or categorieThematique' });
		}

		// Ensure the referenced mission exists
		const mission = await db.missionDrone.findUnique({ where: { id: idMission } });
		if (!mission) {
			return res.status(404).json({ message: 'Referenced MissionDrone not found' });
		}

		const meta = await db.metadonneesGenerales.create({
			data: {
				idMission,
				titre,
				resume,
				categorieThematique,
				mission: { connect: { id: idMission } },
			},
		});

		return res.status(201).json({ message: 'MetadonneesGenerales created', data: meta });
	} catch (error: any) {
		// Prisma unique constraint error
		if (error?.code === 'P2002') {
			return res.status(409).json({ message: 'MetadonneesGenerales for this mission already exists', meta: error.meta });
		}
		console.error('CreateMetaGenerales error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const GetAllMetaGenerales = async (req: Request, res: Response) => {
	try {
		const metas = await db.metadonneesGenerales.findMany({ include: { mission: true } });
		return res.status(200).json({ message: 'MetadonneesGenerales found', data: metas });
	} catch (error: any) {
		console.error('GetAllMetaGenerales error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const GetMetaGeneralesById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const meta = await db.metadonneesGenerales.findUnique({ where: { id } , include: { mission: true } });
		if (!meta) {
			return res.status(404).json({ message: 'MetadonneesGenerales not found' });
		}
		return res.status(200).json({ message: 'MetadonneesGenerales found', data: meta });
	} catch (error: any) {
		console.error('GetMetaGeneralesById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const UpdateMetaGeneralesById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updated = await db.metadonneesGenerales.update({ where: { id }, data: req.body });
		if (!updated) {
			return res.status(404).json({ message: 'MetadonneesGenerales not found' });
		}
		return res.status(200).json({ message: 'MetadonneesGenerales updated', data: updated });
	} catch (error: any) {
		console.error('UpdateMetaGeneralesById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const DeleteMetaGeneralesById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deleted = await db.metadonneesGenerales.delete({ where: { id } });
		if (!deleted) {
			return res.status(404).json({ message: 'MetadonneesGenerales not found' });
		}
		return res.status(200).json({ message: 'MetadonneesGenerales deleted', data: deleted });
	} catch (error: any) {
		console.error('DeleteMetaGeneralesById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

