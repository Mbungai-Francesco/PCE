import { cn } from "../../lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useImperativeHandle } from "react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	titre: z.string().min(1, "Title is required"),
	resume: z.string().min(1, "Summary is required"),
	categorieThematique: z.string().min(1, "Thematic category is required"),
});

export interface GeneraleFormHandle {
	submit: () => Promise<boolean>;
}

export const GeneraleForm = forwardRef<GeneraleFormHandle>((_props, ref) => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			titre: "",
			resume: "",
			categorieThematique: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
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
					<h1 className={cn("text-2xl font-bold")}>Mission generales</h1>
					<p className="text-black/70">
						Informations generales du vol de drone
					</p>
				</div>
				<FormField
					control={form.control}
					name="titre"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Titre</FormLabel>
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
							<FormLabel>Résumé</FormLabel>
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
							<FormLabel>Catégorie Thématique</FormLabel>
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
