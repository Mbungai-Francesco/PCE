import { db } from '../lib/db';
import type { Request, Response } from 'express';

export const CreateMetaAdmin = async (req: Request, res: Response) => {
	try {
		const { idMission, langue, SRS_CRSUtilise, contraintesLegales } = req.body;

		if (!idMission || !langue || !SRS_CRSUtilise || !contraintesLegales) {
			return res.status(400).json({ message: 'Missing required fields: idMission, langue, SRS_CRSUtilise, contraintesLegales' });
		}

		// Ensure mission exists
		const mission = await db.missionDrone.findUnique({ where: { id: idMission } });
		if (!mission) {
			return res.status(404).json({ message: 'Referenced MissionDrone not found' });
		}

		const adminExists = await db.metadonneesAdmin.findUnique({ where: { idMission } });
		if (adminExists) {
			return res.status(409).json({ message: 'MetadonneesAdmin for this mission already exists' });
		}

		const meta = await db.metadonneesAdmin.create({
			data: {
				idMission,
				langue,
				SRS_CRSUtilise,
				contraintesLegales,
				mission: { connect: { id: idMission } },
			},
		});

		return res.status(201).json({ message: 'MetadonneesAdmin created', data: meta });
	} catch (error: any) {
		if (error?.code === 'P2002') {
			return res.status(409).json({ message: 'MetadonneesAdmin for this mission already exists', meta: error.meta });
		}
		console.error('CreateMetaAdmin error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const GetAllMetaAdmin = async (req: Request, res: Response) => {
	try {
		const metas = await db.metadonneesAdmin.findMany({ include: { mission: true } });
		return res.status(200).json({ message: 'MetadonneesAdmin found', data: metas });
	} catch (error: any) {
		console.error('GetAllMetaAdmin error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const GetMetaAdminById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const meta = await db.metadonneesAdmin.findUnique({ where: { id }, include: { mission: true } });
		if (!meta) {
			return res.status(404).json({ message: 'MetadonneesAdmin not found' });
		}
		return res.status(200).json({ message: 'MetadonneesAdmin found', data: meta });
	} catch (error: any) {
		console.error('GetMetaAdminById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const UpdateMetaAdminById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updated = await db.metadonneesAdmin.update({ where: { id }, data: req.body });
		if (!updated) {
			return res.status(404).json({ message: 'MetadonneesAdmin not found' });
		}
		return res.status(200).json({ message: 'MetadonneesAdmin updated', data: updated });
	} catch (error: any) {
		console.error('UpdateMetaAdminById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const DeleteMetaAdminById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deleted = await db.metadonneesAdmin.delete({ where: { id } });
		if (!deleted) {
			return res.status(404).json({ message: 'MetadonneesAdmin not found' });
		}
		return res.status(200).json({ message: 'MetadonneesAdmin deleted', data: deleted });
	} catch (error: any) {
		console.error('DeleteMetaAdminById error:', error?.message ?? error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

