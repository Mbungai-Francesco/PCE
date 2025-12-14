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
import type { MetaAdmin } from "@/types";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";
import { createMetaAdmin } from "@/api/MetaAdminApi";
import { createMissionsFinistere } from "@/api/MetaFinistereApi";

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
			if (compareValues(val, adminData)) {
				loadToast("Creating admin data", "", 0, "blue");
				createMetaAdmin(val)
					.then((data) => {
						console.log("Admin data created successfully:", data);
						loadToast("Admin data Created", "", 1, "green");
						setAdminData(data);
						createMissionsFinistere(getJwt() || "").then((res) =>{
                            
                        })
					})
					.catch((error) => {
						loadToast("Error Creating Admin data", "", 3000, "red");
						console.error("Error creating Admin data:", error);
					});
			}
		}
	}

	const { mutate } = useMutation({
		mutationFn: (val: MetaAdmin) => {
			loadToast("Creating admin data", "", 0, "blue");
			return createMetaAdmin(val);
		},
		onSuccess: (data) => {
			console.log("Admin data created successfully:", data);
			loadToast("Admin data Created", "", 1, "green");
			setAdminData(data);
			createMissionsFinistere(getJwt() || "");
		},
		onError: (error) => {
			loadToast("Error Creating Admin data", "", 3000, "red");
			console.error("Error creating Admin data:", error);
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
					<p className="text-black/70">
						Informations administratives du vol de drone
					</p>
				</div>
				<FormField
					control={form.control}
					name="langue"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Langue</FormLabel>
							<FormControl>
								<Input placeholder="Enter mission langue" {...field} />
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
							<FormLabel>SRS CRS Utilise</FormLabel>
							<FormControl>
								<Input placeholder="Enter mission SRS CRS Utilise" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contraintesLegales"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraintes Légales</FormLabel>
							<FormControl>
								<Input placeholder="Enter legal constraints" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});
