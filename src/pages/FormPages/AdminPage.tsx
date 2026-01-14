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
import type { MetaAdmin } from "@/types";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";
import { createMetaAdmin, updateMetaAdmin } from "@/api/MetaAdminApi";
import { updateMissionFinistere } from "@/api/MetaFinistereApi";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
	langue: z.string().min(3, "Language is required"),
	SRS_CRSUtilise: z.string().min(3, "SRS_CRSUtilise is required"),
	contraintesLegales: z.string().min(3, "Constrainte legale is required"),
});

export interface AdminFormHandle {
	submit: () => Promise<boolean>;
}

export const AdminForm = forwardRef<AdminFormHandle>((_props, ref) => {
	const { adminData, setAdminData } = useData();
	const { getJwt } = useJwt();
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			langue: adminData?.langue || "",
			SRS_CRSUtilise: adminData?.SRS_CRSUtilise || "",
			contraintesLegales: adminData?.contraintesLegales || "",
		},
	});
	const navigate = useNavigate();

	// Reset form when adminData changes
	useEffect(() => {
		if (adminData) {
			form.reset({
				langue: adminData.langue || "",
				SRS_CRSUtilise: adminData.SRS_CRSUtilise || "",
				contraintesLegales: adminData.contraintesLegales || "",
			});
		}
	}, [adminData, form]);

	// ? Compare function to check if values have changed
	const compareValues = (
		val: MetaAdmin,
		adminData: MetaAdmin | null
	): boolean => {
		if (!adminData) return true;

		return (
			val.langue !== adminData.langue ||
			val.SRS_CRSUtilise !== adminData.SRS_CRSUtilise ||
			val.contraintesLegales !== adminData.contraintesLegales
		);
	};

	// 2. Define a submit handler.
	
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		const id = getJwt();
		if (id) {
			const val: MetaAdmin = {
				...values,
				idMission: id,
			};
			if(adminData && adminData.id){
				if(compareValues(val, adminData)){
					const adminId = adminData.id || '';	
					loadToast("Updating admin data", "", 0, "blue");
					updateMetaAdmin(adminId, val)
						.then((data) => {
							console.log("Admin data updated successfully:", data);
							loadToast("Admin data Updated", "", 1, "green");
							setAdminData(data);
							updateMissionFinistere(data.idMission).then(() => {
								navigate("/carte");
								// window.location.href = "https://cerema-groupe-16.netlify.app/";
							});
						})
						.catch((error) => {
							loadToast("Error updating Admin data", "", 3000, "red");
							console.error("Error updating Admin data:", error);
						});
				}
				else console.log("Nothing changed");
			}
			else {
				loadToast("Creating admin data", "", 0, "blue");
				createMetaAdmin(val)
					.then((data) => {
						console.log("Admin data created successfully:", data);
						loadToast("Admin data Created", "", 1, "green");
						setAdminData(data);
					})
					.catch((error) => {
						loadToast("Error Creating Admin data", "", 3000, "red");
						console.error("Error creating Admin data:", error);
					})
					.finally(()=>{
						navigate("/carte");
						// window.location.href = "https://cerema-groupe-16.netlify.app/";
					})
			}
			// if (compareValues(val, adminData)) {
			// 	loadToast("Creating admin data", "", 0, "blue");
			// 	createMetaAdmin(val)
			// 		.then((data) => {
			// 			console.log("Admin data created successfully:", data);
			// 			loadToast("Admin data Created", "", 1, "green");
			// 			setAdminData(data);
			// 			createMissionsFinistere(data.idMission).then(() => {
			// 				window.location.href = "https://cerema-groupe-16.netlify.app/";
			// 			});
			// 		})
			// 		.catch((error) => {
			// 			loadToast("Error Creating Admin data", "", 3000, "red");
			// 			console.error("Error creating Admin data:", error);
			// 		});
			// }
		}
	}

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
					<h1 className={cn("text-2xl font-bold")}>Donnee admin</h1>
					<div>
						<p className="text-black/70">
							Informations administratives du vol de drone
						</p>
						<p className="text-black/70 text-sm">
							<span className="red-star">*</span> indicates required fields
						</p>
					</div>
				</div>
				<FormField
					control={form.control}
					name="langue"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Langue <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
									<option value="">Select a language</option>
									<option value="English">English</option>
									<option value="German">German</option>
									<option value="French">French</option>
									<option value="Italian">Italian</option>
									<option value="Spanish">Spanish</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="SRS_CRSUtilise"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								SRS CRS Utilise <span className="red-star">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter mission SRS CRS Utilise" {...field} />
							</FormControl>
							<FormDescription>Exemple: EPSG:4326</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contraintesLegales"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Contraintes Légales
								<span className="red-star h-fit">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Enter legal constraints" {...field} />
							</FormControl>
							<FormDescription>Exemple: License Libre</FormDescription>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});
