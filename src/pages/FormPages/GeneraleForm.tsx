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
import { useMutation } from "@tanstack/react-query";
import type { MetaGenerales } from "@/types";
import { loadToast } from "@/lib/loadToast";
import {
	createMetaGenerales,
	updateMetaGenerales,
} from "@/api/MetaGeneralesApi";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";

const formSchema = z.object({
	titre: z.string().min(1, "Title is required"),
	resume: z.string().min(1, "Summary is required"),
	categorieThematique: z.string().min(1, "Thematic category is required"),
});

export interface GeneraleFormHandle {
	submit: () => Promise<boolean>;
}

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
					<h1 className={cn("text-2xl font-bold")}>Mission generales</h1>
					<div>
						<p className="text-black/70">
							Informations generales du vol de drone
						</p>
						<p className="text-black/70 text-sm">
							<span className="red-star">*</span> indicates required fields
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
								Résumé <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter mission summary" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="categorieThematique"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Catégorie Thématique <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter thematic category" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});
