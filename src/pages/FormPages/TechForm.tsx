import { cn } from "../../lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import L from "leaflet";

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
import {
	createMetaTechniques,
	updateMetaTechniques,
} from "@/api/MetaTechniquesApi";

const formSchema = z.object({
	xMin: z.string(),
	xMax: z.string(),
	yMin: z.string(),
	yMax: z.string(),
});

export interface TechFormHandle {
	submit: () => Promise<boolean>;
}

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const TechForm = forwardRef<TechFormHandle>((_props, ref) => {
	const { techData, setTechData } = useData();
	const { getJwt } = useJwt();
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const rectangleRef = useRef<L.Rectangle | null>(null);
	const markersRef = useRef<L.Marker[]>([]);

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

	// Watch coordinate values for map updates
	const xMin = form.watch("xMin");
	const xMax = form.watch("xMax");
	const yMin = form.watch("yMin");
	const yMax = form.watch("yMax");

	// Initialize map
	useEffect(() => {
		if (mapContainerRef.current && !mapRef.current) {
			mapRef.current = L.map(mapContainerRef.current).setView(
				[48.8566, 2.3522],
				5
			);

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current);
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	// Update map view and rectangle when coordinates change
	useEffect(() => {
		if (!mapRef.current) return;

		const x1 = parseFloat(xMin) || 0;
		const x2 = parseFloat(xMax) || 0;
		const y1 = parseFloat(yMin) || 0;
		const y2 = parseFloat(yMax) || 0;

		// Only update if we have valid coordinates (non-zero)
		if (x1 && x2 && y1 && y2) {
			// Create bounds: [[south, west], [north, east]] = [[yMin, xMin], [yMax, xMax]]
			const bounds: L.LatLngBoundsExpression = [
				[y1, x1],
				[y2, x2],
			];

			// Remove existing rectangle
			if (rectangleRef.current) {
				rectangleRef.current.remove();
			}

			// Remove existing markers
			markersRef.current.forEach((marker) => marker.remove());
			markersRef.current = [];

			// Create numbered icon function
			const createNumberedIcon = (num: number) =>
				L.divIcon({
					className: "numbered-marker",
					html: `<div style="
					background-color: #3b82f6;
					color: white;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					font-size: 14px;
					border: 2px solid white;
					box-shadow: 0 2px 4px rgba(0,0,0,0.3);
				">${num}</div>`,
					iconSize: [24, 24],
					iconAnchor: [12, 12],
				});

			// Add numbered markers at corners (1: SW, 2: SE, 3: NE, 4: NW)
			const corners: [number, number, number][] = [
				[1, y1, x1], // 1: Bottom-left (yMin, xMin)
				[2, y1, x2], // 2: Bottom-right (yMin, xMax)
				[3, y2, x2], // 3: Top-right (yMax, xMax)
				[4, y2, x1], // 4: Top-left (yMax, xMin)
			];

			corners.forEach(([num, lat, lng]) => {
				const marker = L.marker([lat, lng], {
					icon: createNumberedIcon(num),
				}).addTo(mapRef.current!);
				markersRef.current.push(marker);
			});

			// Add new rectangle
			rectangleRef.current = L.rectangle(bounds, {
				color: "#3b82f6",
				weight: 2,
				fillOpacity: 0.2,
			}).addTo(mapRef.current);

			// Fit map to bounds with padding
			mapRef.current.fitBounds(bounds, { padding: [50, 50] });
		}
	}, [xMin, xMax, yMin, yMax]);

	// ? Compare function to check if values have changed
	// const compareValues = (
	// 	val: MetaTechniques,
	// 	techData: MetaTechniques | null
	// ): boolean => {
	// 	if (!techData) return true;

	// 	return (
	// 		val.xMin !== techData.xMin ||
	// 		val.xMax !== techData.xMax ||
	// 		val.yMin !== techData.yMin ||
	// 		val.yMax !== techData.yMax
	// 	);
	// };

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

			if (techData && techData.id)
				update({ ...val, id: techData.id });
			else mutate(val);
			// if (compareValues(val, techData)) mutate(val);
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

	const { mutate: update } = useMutation({
		mutationFn: (val: MetaTechniques) => {
			const id = val.id || "";
			loadToast("updating Techniques", "", 0, "blue");
			return updateMetaTechniques(id, val);
		},
		onSuccess: (data) => {
			loadToast("Techniques Updated", "", 3000, "green");
			console.log("Techniques updated successfully:", data);
			setTechData(data);
		},
		onError: (error) => {
			loadToast("Error updating Techniques", "", 3000, "red");
			console.error("Error updating Techniques:", error);
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
				{/* Leaflet map */}
				<div>
					<div className="h-[400px] w-full rounded-lg overflow-hidden border">
						<link
							rel="stylesheet"
							href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
							integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
							crossOrigin=""
						/>
						<div ref={mapContainerRef} className="h-full w-full"></div>
					</div>
				</div>
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
