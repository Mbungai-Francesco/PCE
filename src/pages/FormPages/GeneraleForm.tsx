import { cn } from "../../lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import type { MetaGenerales } from "@/types";
import { loadToast } from "@/lib/loadToast";
import {
	createMetaGenerales,
	updateMetaGenerales,
} from "@/api/MetaGeneralesApi";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
	titre: z.string().min(1, "Title is required"),
	resume: z.string().min(1, "Summary is required"),
	categorieThematique: z.string().min(1, "Thematic category is required"),
});

export interface GeneraleFormHandle {
	submit: () => Promise<boolean>;
}

const CATEGORIE_THEMATIQUE_OPTIONS = [
	{ value: "farming", label: "Farming (Agriculture)" },
	{ value: "biota", label: "Biota (Faune/Flore)" },
	{ value: "boundaries", label: "Boundaries (Limites administratives)" },
	{
		value: "climatologyMeteorologyAtmosphere",
		label: "Climatology/Meteorology (Climat/Météo)",
	},
	{ value: "economy", label: "Economy (Économie)" },
	{ value: "elevation", label: "Elevation (Altimétrie/Relief)" },
	{ value: "environment", label: "Environment (Environnement)" },
	{
		value: "geoscientificInformation",
		label: "Geoscientific Information (Géologie)",
	},
	{ value: "health", label: "Health (Santé)" },
	{
		value: "imageryBaseMapsEarthCover",
		label: "Imagery/Base Maps/Earth Cover (Imagerie/Couverture terrestre)",
	},
	{ value: "intelligenceMilitary", label: "Intelligence Military (Militaire)" },
	{ value: "inlandWaters", label: "Inland Waters (Eaux intérieures)" },
	{ value: "location", label: "Location (Localisation)" },
	{ value: "oceans", label: "Oceans (Océans)" },
	{
		value: "planningCadastre",
		label: "Planning Cadastre (Urbanisme/Cadastre)",
	},
	{ value: "society", label: "Society (Société)" },
	{ value: "structure", label: "Structure (Infrastructure/Bâtiments)" },
	{ value: "transportation", label: "Transportation (Transport)" },
	{
		value: "utilitiesCommunication",
		label: "Utilities Communication (Réseaux/Communication)",
	}
];

export const GeneraleForm = forwardRef<GeneraleFormHandle>((_props, ref) => {
	const { generaleData, setGeneraleData } = useData();
	const { getJwt } = useJwt();
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			titre: "",
			resume: "",
			categorieThematique: "",
		},
	});

	// Reset form when generaleData changes
	useEffect(() => {
		if (generaleData) {
			form.reset({
				titre: generaleData.titre || "",
				resume: generaleData.resume || "",
				categorieThematique: generaleData.categorieThematique || "",
			});
		}
	}, [generaleData, form]);

	// ? Compare function to check if values have changed
	// const compareValues = (
	// 	val: MetaGenerales,
	// 	missionData: MetaGenerales | null
	// ): boolean => {
	// 	if (!missionData) return true;

	// 	return (
	// 		val.titre !== missionData.titre ||
	// 		val.resume !== missionData.resume ||
	// 		val.categorieThematique !== missionData.categorieThematique
	// 	);
	// };

	// 2. Define a submit handler.

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		const id = getJwt();
		if (id) {
			const val: MetaGenerales = {
				...values,
				idMission: id,
			};
			if (generaleData && generaleData.id)
				update({ ...val, id: generaleData.id });
			else mutate(val);
			// if (compareValues(val, generaleData)) mutate(val);
		}
	}

	const { mutate } = useMutation({
		mutationFn: (val: MetaGenerales) => {
			loadToast("Creating generales", "", 0, "blue");
			return createMetaGenerales(val);
		},
		onSuccess: (data) => {
			console.log("Generales created successfully:", data);
			loadToast("Generales Created", "", 1, "green");
			setGeneraleData(data);
		},
		onError: (error) => {
			loadToast("Error Creating Generales", "", 3000, "red");
			console.error("Error creating Generales:", error);
		},
	});

	const { mutate: update } = useMutation({
		mutationFn: (val: MetaGenerales) => {
			const id = val.id || "";
			loadToast("updating Generales", "", 0, "blue");
			return updateMetaGenerales(id, val);
		},
		onSuccess: (data) => {
			loadToast("Generales Updated", "", 3000, "green");
			console.log("Generales updated successfully:", data);
			setGeneraleData(data);
		},
		onError: (error) => {
			loadToast("Error updating Generales", "", 3000, "red");
			console.error("Error updating Generales:", error);
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
					<h1 className={cn("text-2xl font-bold")}>Informations Mission</h1>
					<div>
						<p className="text-black/70">
							Informations generales du vol de drone
						</p>
						<p className="text-black/70 text-sm">
							<span className="red-star">*</span> Champs obligatoires
						</p>
					</div>
				</div>
				<FormField
					control={form.control}
					name="titre"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Titre <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter mission title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="resume"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Déscription de la Mission <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter mission summary"
									{...field}
									className="resize-none"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="w-full ">
					<FormField
						control={form.control}
						name="categorieThematique"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									Catégorie Thématique <span className="red-star">*</span>
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a thematic category" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{CATEGORIE_THEMATIQUE_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
});
