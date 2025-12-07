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
import type { MissionDrone } from "@/types";
import { createMissionsDrones } from "@/api/MissionDroneApi";
import { loadToast } from "@/lib/loadToast";
import { useData } from "@/hook/useData";
import { useJwt } from "@/hook/useJwt";

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
  const { setJwt } = useJwt();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateDebutVol: missionData?.dateDebutVol ? new Date(missionData.dateDebutVol).toISOString().split('T')[0] : "",
			dateFinVol: missionData?.dateFinVol ? new Date(missionData.dateFinVol).toISOString().split('T')[0] : "",
			typeMission: missionData?.typeMission || "",
      capteurUtilise: missionData?.capteurUtilise || "",
      statutValidation: missionData?.statutValidation || false,
      motDePasse: missionData?.motDePasse || "",
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
				dateDebutVol: missionData.dateDebutVol ? new Date(missionData.dateDebutVol).toISOString().split('T')[0] : "",
				dateFinVol: missionData.dateFinVol ? new Date(missionData.dateFinVol).toISOString().split('T')[0] : "",
				typeMission: missionData.typeMission || "",
				capteurUtilise: missionData.capteurUtilise || "",
				statutValidation: missionData.statutValidation || false,
				motDePasse: missionData.motDePasse || "",
				motsCles: missionData.motsCles || "",
				nomProprietaire: missionData.nomProprietaire || "",
				emailProprietaire: missionData.emailProprietaire || "",
				entrepriseProprietaire: missionData.entrepriseProprietaire || "",
			});
		}
	}, [missionData, form]);

  const compareValues = (val: MissionDrone, missionData: MissionDrone | null): boolean => {
    if (!missionData) return true;

    const dateVol = new Date(missionData.dateDebutVol)
    const dataFin = new Date(missionData.dateFinVol)
    
    return (
      val.dateDebutVol.toISOString().split('T')[0] !== dateVol.toISOString().split('T')[0] ||
      val.dateFinVol.toISOString().split('T')[0] !== dataFin.toISOString().split('T')[0] ||
      val.typeMission !== missionData.typeMission ||
      val.capteurUtilise !== missionData.capteurUtilise ||
      val.statutValidation !== missionData.statutValidation ||
      val.motDePasse !== missionData.motDePasse ||
      val.motsCles !== missionData.motsCles ||
      val.nomProprietaire !== missionData.nomProprietaire ||
      val.emailProprietaire !== missionData.emailProprietaire ||
      val.entrepriseProprietaire !== missionData.entrepriseProprietaire
    );
  };

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
    if(compareValues(val, missionData)) mutate(val);
	}

  const { mutate } = useMutation({
    mutationFn: ( val : MissionDrone) => {
      loadToast('Creating Mission', '', 0, 'blue')
      return createMissionsDrones(val)
    },
    onSuccess: (data) =>{
      loadToast('Mission Created', '', 3000, 'green')
      console.log("Mission Drone created successfully:", data);
      setJwt(data.id || '')
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
