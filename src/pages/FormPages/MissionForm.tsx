import { cn } from "../../lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import type { MissionDrone } from "@/types";
import { createMissionsDrones, updateMissionDrone } from "@/api/MissionDroneApi";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";

const formSchema = z.object({
	dateDebutVol: z.string().min(1, "Flight date is required"),
	dateFinVol: z.string().min(1, "Flight end date is required"),
	typeMission: z.string().optional(),
	capteurUtilise: z.string().min(1, "Sensor used is required"),
	statutValidation: z.boolean(),
	// motDePasse: z.string().min(1, "Password is required"),
	motsCles: z.string().min(1, "Keywords are required"),
	nomProprietaire: z.string().min(1, "Owner name is required"),
	emailProprietaire: z
		.email("Invalid email address")
		.min(1, "Owner email is required"),
	entrepriseProprietaire: z.string().min(1, "Owner company is required"),
});

export interface MissionFormHandle {
	submit: () => Promise<boolean>;
}

export const MissionForm = forwardRef<MissionFormHandle>((_props, ref) => {
	// const { initialData } = props;
	const { missionData, setMissionData } = useData();
	const { setJwt } = useJwt();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateDebutVol: missionData?.dateDebutVol
				? new Date(missionData.dateDebutVol).toISOString().split("T")[0]
				: "",
			dateFinVol: missionData?.dateFinVol
				? new Date(missionData.dateFinVol).toISOString().split("T")[0]
				: "",
			typeMission: missionData?.typeMission || "",
			capteurUtilise: missionData?.capteurUtilise || "",
			statutValidation: missionData?.statutValidation || false,
			motsCles: missionData?.motsCles || "",
			nomProprietaire: missionData?.nomProprietaire || "",
			emailProprietaire: missionData?.emailProprietaire || "",
			entrepriseProprietaire: missionData?.entrepriseProprietaire || "",
		},
	});

	// Reset form when missionData changes
	useEffect(() => {
		if (missionData) {
			form.reset({
				dateDebutVol: missionData.dateDebutVol
					? new Date(missionData.dateDebutVol).toISOString().split("T")[0]
					: "",
				dateFinVol: missionData.dateFinVol
					? new Date(missionData.dateFinVol).toISOString().split("T")[0]
					: "",
				typeMission: missionData.typeMission || "",
				capteurUtilise: missionData.capteurUtilise || "",
				statutValidation: missionData.statutValidation || false,
				motsCles: missionData.motsCles || "",
				nomProprietaire: missionData.nomProprietaire || "",
				emailProprietaire: missionData.emailProprietaire || "",
				entrepriseProprietaire: missionData.entrepriseProprietaire || "",
			});
		}
	}, [missionData, form]);

	// ? Compare function to check if values have changed
	// const compareValues = (
	// 	val: MissionDrone,
	// 	missionData: MissionDrone | null
	// ): boolean => {
	// 	if (!missionData) return true;

	// 	const dateVol = new Date(missionData.dateDebutVol);
	// 	const dataFin = new Date(missionData.dateFinVol);

	// 	return (
	// 		val.dateDebutVol.toISOString().split("T")[0] !==
	// 			dateVol.toISOString().split("T")[0] ||
	// 		val.dateFinVol.toISOString().split("T")[0] !==
	// 			dataFin.toISOString().split("T")[0] ||
	// 		val.typeMission !== missionData.typeMission ||
	// 		val.capteurUtilise !== missionData.capteurUtilise ||
	// 		val.statutValidation !== missionData.statutValidation ||
	// 		val.motsCles !== missionData.motsCles ||
	// 		val.nomProprietaire !== missionData.nomProprietaire ||
	// 		val.emailProprietaire !== missionData.emailProprietaire ||
	// 		val.entrepriseProprietaire !== missionData.entrepriseProprietaire
	// 	);
	// };

	// 2. Define a submit handler.
	
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		const val: MissionDrone = {
			...values,
			dateDebutVol: new Date(values.dateDebutVol),
			dateFinVol: new Date(values.dateFinVol),
			motDePasse: " ",
		};
		console.log(val);
		if(missionData && missionData.id) update({...val, id: missionData.id});
		else mutate(val)
		// if (compareValues(val, missionData)) mutate(val);
	}

	const { mutate } = useMutation({
		mutationFn: (val: MissionDrone) => {
			loadToast("Creating Mission", "", 0, "blue");
			return createMissionsDrones(val);
		},
		onSuccess: (data) => {
			loadToast("Mission Created", "", 3000, "green");
			console.log("Mission Drone created successfully:", data);
			setJwt(data.id || "");
			setMissionData(data);
		},
		onError: (error) => {
			loadToast("Error Creating Mission", "", 3000, "red");
			console.error("Error creating Mission Drone:", error);
		},
	});

	const { mutate : update } = useMutation({
		mutationFn: (val: MissionDrone) => {
			const id = val.id || "";
			loadToast("updating Mission", "", 0, "blue");
			return updateMissionDrone(id,val);
		},
		onSuccess: (data) => {
			loadToast("Mission Updated", "", 3000, "green");
			console.log("Mission Drone updated successfully:", data);
			setMissionData(data);
		},
		onError: (error) => {
			loadToast("Error updating Mission", "", 3000, "red");
			console.error("Error updating Mission Drone:", error);
		},
	});

	// Expose submit method to parent
	useImperativeHandle(ref, () => ({
		submit: async () => {
			const isValid = await form.trigger();
			if (isValid) {
				form.handleSubmit(onSubmit)();
			}
			return isValid;
		},
	}));

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className={cn("space-y-2")}>
					<h1 className={cn("text-2xl font-bold")}>Mission Drone</h1>
					<div className="">
						<p className="text-black/70">
							Informations principales du vol de drone
						</p>
						<p className="text-black/70 text-sm">
							<span className="red-star">*</span> indicates required fields
						</p>
					</div>
				</div>
        <FormField
					control={form.control}
					name="entrepriseProprietaire"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Nom de l'entreprise <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Entreprise name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
        <FormField
					control={form.control}
					name="nomProprietaire"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Nom Propriétaire <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Owner's name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="emailProprietaire"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Email Propriétaire <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Owner's email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="dateDebutVol"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Date de Vol <span className="red-star">*</span>
							</FormLabel>
              <FormControl>
                <Input type="date" max={new Date().toISOString().split("T")[0]} {...field} />
              </FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="dateFinVol"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Date Fin de Vol <span className="red-star">*</span>
							</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  min={form.watch("dateDebutVol")} 
                  max={new Date().toISOString().split("T")[0]} 
                  {...field} 
                />
              </FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="typeMission"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type de Mission</FormLabel>
							<FormControl>
								<select 
									{...field} 
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">-- Sélectionner un type de mission --</option>
									<option value="cartographie">Cartographie générale</option>
									<option value="inspection_infrastructure">Inspection d'infrastructure (ponts, routes, bâtiments)</option>
									<option value="inspection_ouvrage_art">Inspection d'ouvrages d'art</option>
									<option value="surveillance_environnementale">Surveillance environnementale</option>
									<option value="releve_topographique">Relevé topographique</option>
									<option value="photogrammetrie">Photogrammétrie</option>
									<option value="thermographie">Thermographie (infrarouge)</option>
									<option value="agriculture_precision">Agriculture de précision</option>
									<option value="gestion_risques">Gestion des risques naturels</option>
									<option value="suivi_chantier">Suivi de chantier</option>
									<option value="cartographie_reseau">Cartographie de réseaux</option>
									<option value="evaluation_dommages">Évaluation de dommages</option>
									<option value="autre">Autre mission</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="capteurUtilise"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Capteur Utilisé <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<select 
									{...field} 
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">-- Sélectionner un ou plusieurs capteurs --</option>
									
									{/* Drones DJI (les plus courants) */}
									<option value="DJI Phantom 4 RTK">DJI Phantom 4 RTK (Photogrammétrie RTK)</option>
									<option value="DJI Mavic 3 Enterprise">DJI Mavic 3 Enterprise</option>
									<option value="DJI Mavic 3 Multispectral">DJI Mavic 3 Multispectral (Agriculture)</option>
									<option value="DJI Matrice 300 RTK">DJI Matrice 300 RTK (Professionnel)</option>
									<option value="DJI Matrice 350 RTK">DJI Matrice 350 RTK</option>
									<option value="DJI Inspire 3">DJI Inspire 3 (Cinématique)</option>
									
									{/* Caméras RGB haute résolution */}
									<option value="Sony RX1R II">Sony RX1R II (42 MP plein format)</option>
									<option value="Sony A7R IV">Sony A7R IV (61 MP)</option>
									<option value="Canon EOS R5">Canon EOS R5 (45 MP)</option>
									<option value="Phase One iXM-100">Phase One iXM-100 (100 MP)</option>
									
									{/* Caméras thermiques */}
									<option value="FLIR Vue Pro R">FLIR Vue Pro R (Caméra thermique)</option>
									<option value="DJI Zenmuse H20T">DJI Zenmuse H20T (Hybride zoom + thermique)</option>
									<option value="DJI Zenmuse XT2">DJI Zenmuse XT2 (Thermique FLIR)</option>
									<option value="Teledyne FLIR Duo Pro R">Teledyne FLIR Duo Pro R</option>
									
									{/* Caméras multispectrales (agriculture) */}
									<option value="MicaSense RedEdge-MX">MicaSense RedEdge-MX (Multispectral 5 bandes)</option>
									<option value="MicaSense Altum">MicaSense Altum (Multispectral + thermique)</option>
									<option value="Parrot Sequoia+">Parrot Sequoia+ (Multispectral agriculture)</option>
									<option value="Sentera 6X">Sentera 6X (Multispectral)</option>
									
									{/* LiDAR */}
									<option value="Velodyne VLP-16">Velodyne VLP-16 (LiDAR 16 canaux)</option>
									<option value="Velodyne VLP-32">Velodyne VLP-32 (LiDAR 32 canaux)</option>
									<option value="DJI Zenmuse L1">DJI Zenmuse L1 (LiDAR + RGB)</option>
									<option value="DJI Zenmuse L2">DJI Zenmuse L2 (LiDAR haute précision)</option>
									<option value="YellowScan Surveyor">YellowScan Surveyor (LiDAR topographique)</option>
									<option value="RIEGL miniVUX-1UAV">RIEGL miniVUX-1UAV (LiDAR professionnel)</option>
									
									{/* Autres capteurs spécialisés */}
									<option value="Hyperspectral Headwall">Headwall Nano-Hyperspec (Hyperspectral)</option>
									<option value="GPR (radar sol)">GPR - Radar à pénétration de sol</option>
									<option value="Autre">🔧 Autre capteur (préciser dans le résumé)</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
          control={form.control}
          name="motDePasse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input placeholder="Password for data" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
				<FormField
					control={form.control}
					name="motsCles"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Mot cles <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Keywords for data" {...field} />
							</FormControl>
              <FormDescription>Example: plage, militaire</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});
