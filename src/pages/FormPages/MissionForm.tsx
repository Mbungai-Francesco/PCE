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
import { useMutation } from "@tanstack/react-query";
import type { MissionDrone } from "@/types";
import { createMissionsDrones } from "@/api/MissionDroneApi";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";

const formSchema = z.object({
	dateDebutVol: z.string().min(1, "Flight date is required"),
	dateFinVol: z.string().min(1, "Flight end date is required"),
	typeMission: z.string().optional(),
  capteurUtilise: z.string().min(1, "Sensor used is required"),
  statutValidation: z.boolean(),
  motDePasse: z.string().min(1, "Password is required"),
  motsCles: z.string().min(1, "Keywords are required"),
  nomProprietaire: z.string().min(1, "Owner name is required"),
  emailProprietaire: z.email(("Invalid email address")).min(1, "Owner email is required"),
  entrepriseProprietaire: z.string().min(1, "Owner company is required"), 
});

export interface MissionFormHandle {
	submit: () => Promise<boolean>;
}


export const MissionForm = forwardRef<MissionFormHandle>((_props, ref) => {
	// const { initialData } = props;
  const { missionData, setMissionData } = useData();
  
  // Use prop data if provided, otherwise use context
  // const data = initialData || missionData;
  const data = missionData;

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateDebutVol: data?.dateDebutVol ? new Date(data.dateDebutVol).toISOString().split('T')[0] : "",
			dateFinVol: data?.dateFinVol ? new Date(data.dateFinVol).toISOString().split('T')[0] : "",
			typeMission: data?.typeMission || "",
      capteurUtilise: data?.capteurUtilise || "",
      statutValidation: data?.statutValidation || false,
      motDePasse: data?.motDePasse || "",
      motsCles: data?.motsCles || "",
      nomProprietaire: data?.nomProprietaire || "",
      emailProprietaire: data?.emailProprietaire || "",
      entrepriseProprietaire: data?.entrepriseProprietaire || "",
		},
	});
  
	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
    
    const val : MissionDrone = {
      ...values,
      dateDebutVol : new Date(values.dateDebutVol),
      dateFinVol : new Date(values.dateFinVol),
    }
    console.log(val);

    mutate(val);
	}

  const { mutate } = useMutation({
    mutationFn: ( val : MissionDrone) => {
      loadToast('Creating Mission', '', 0, 'blue')
      return createMissionsDrones(val)
    },
    onSuccess: (data) =>{
      loadToast('Mission Created', '', 3000, 'green')
      console.log("Mission Drone created successfully:", data);
      setMissionData(data);
    },
    onError: (error) =>{
      loadToast('Error Creating Mission', '', 3000, 'red')
      console.error("Error creating Mission Drone:", error);
    },
  })

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
					<p className="text-black/70">
						Informations principales du vol de drone
					</p>
				</div>
				<FormField
					control={form.control}
					name="dateDebutVol"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date de Vol</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
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
							<FormLabel>Date Fin de Vol</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
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
								<Input placeholder="Enter mission type" {...field} />
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
              <FormLabel>Capteur Utilisé</FormLabel>
              <FormControl>
                <Input placeholder="Enter sensor used" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
        />
        <FormField
          control={form.control}
          name="motsCles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot cles</FormLabel>
              <FormControl>
                <Input placeholder="Keywords for data" {...field} />
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
              <FormLabel>Nom Propriétaire</FormLabel>
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
              <FormLabel>Email Propriétaire</FormLabel>
              <FormControl>
                <Input placeholder="Owner's email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entrepriseProprietaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'entreprise</FormLabel>
              <FormControl>
                <Input placeholder="Entreprise name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
			</form>
		</Form>
	);
});
