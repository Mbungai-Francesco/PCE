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
import type { MetaTechniques } from "@/types";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";
import { createMetaTechniques } from "@/api/MetaTechniquesApi";

const formSchema = z.object({
	xMin: z.string(),
	xMax: z.string(),
	yMin: z.string(),
	yMax: z.string(),
});

export interface TechFormHandle {
	submit: () => Promise<boolean>;
}

export const TechForm = forwardRef<TechFormHandle>((_props, ref) => {
	const { techData, setTechData } = useData();
	const { getJwt } = useJwt();
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			xMin: techData?.xMin ? String(techData?.xMin) : "0",
			xMax: techData?.xMax ? String(techData?.xMax) : "0",
			yMin: techData?.yMin ? String(techData?.yMin) : "0",
			yMax: techData?.yMax ? String(techData?.yMax) : "0",
		},
	});

	// Reset form when techData changes
	useEffect(() => {
		if (techData) {
			form.reset({
				xMin: techData?.xMin ? String(techData?.xMin) : "0",
				xMax: techData?.xMax ? String(techData?.xMax) : "0",
				yMin: techData?.yMin ? String(techData?.yMin) : "0",
				yMax: techData?.yMax ? String(techData?.yMax) : "0",
			});
		}
	}, [techData, form]);

	const compareValues = (
		val: MetaTechniques,
		techData: MetaTechniques | null
	): boolean => {
		if (!techData) return true;

		return (
			val.xMin !== techData.xMin ||
			val.xMax !== techData.xMax ||
			val.yMin !== techData.yMin ||
			val.yMax !== techData.yMax
		);
	};

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		const id = getJwt();
		if (id) {
			const val: MetaTechniques = {
				...values,
				xMin: Number(values.xMin),
				xMax: Number(values.xMax),
				yMin: Number(values.yMin),
				yMax: Number(values.yMax),
				idMission: id,
				datePublication: new Date(),
			};
			console.log(val);

			if (compareValues(val, techData)) mutate(val);
		}
	}

	const { mutate } = useMutation({
		mutationFn: (val: MetaTechniques) => {
			loadToast("Creating techniques", "", 0, "blue");
			return createMetaTechniques(val);
		},
		onSuccess: (data) => {
			console.log("Techniques created successfully:", data);
			loadToast("Techniques Created", "", 1, "green");
			setTechData(data);
		},
		onError: (error) => {
			loadToast("Error Creating Techniques", "", 3000, "red");
			console.error("Error creating Techniques:", error);
		},
	});

	// Expose submit method to parent
	useImperativeHandle(ref, () => ({
		submit: async () => {
			let isValid = await form.trigger();
			const values = form.getValues();

			// ? checking to make sure no coordinate is zero
			isValid =
				!Number(values.xMax) ||
				!Number(values.xMin) ||
				!Number(values.yMax) ||
				!Number(values.yMin)
					? false
					: true;
			console.log(values);
			if (isValid) {
				form.handleSubmit(onSubmit)();
			} else {
				form.setError("xMin", {
					type: "manual",
					message: "X Min is required and cannot be zero",
				});
				form.setError("xMax", {
					type: "manual",
					message: "X Max is required and cannot be zero",
				});
				form.setError("yMin", {
					type: "manual",
					message: "Y Min is required and cannot be zero",
				});
				form.setError("yMax", {
					type: "manual",
					message: "Y Max is required and cannot be zero",
				});
			}

			return isValid;
		},
	}));

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className={cn("space-y-2")}>
					<h1 className={cn("text-2xl font-bold")}>Mission Techniques</h1>
					<div>
						<p className="text-black/70">
							{" "}
							Informations techniques du vol de drone
						</p>
						<p className="text-black/70 text-sm">
							<span className="red-star">*</span> indicates required fields
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="xMin"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									X Min <span className="red-star">*</span>
								</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>
									Coordonnée X minimale de la zone de vol
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="xMax"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									X Max <span className="red-star">*</span>
								</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>
									Coordonnée X maximale de la zone de vol
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="yMin"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Y Min <span className="red-star">*</span>
								</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>
									Coordonnée Y minimale de la zone de vol
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="yMax"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Y Max <span className="red-star">*</span>
								</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>
									Coordonnée Y maximale de la zone de vol
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
});
