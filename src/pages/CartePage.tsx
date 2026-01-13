import { getMissionsDronesAllData } from "@/api/MissionDroneApi";
import Navbar from "@/components/ui/navbar";
import type { MissionDrone } from "@/types";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { cn } from "@/lib/utils";

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

const CartePage = () => {
	const [missions, setMissions] = useState<Array<MissionDrone>>([]);
	const [selectedMission, setSelectedMission] = useState<MissionDrone | null>(null);
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const markersRef = useRef<L.Marker[]>([]);
	const activeRectangleRef = useRef<L.Rectangle | null>(null);

	// Fetch missions
	useEffect(() => {
		getMissionsDronesAllData()
			.then((data) => {
				setMissions(data);
			})
			.catch((error) => {
				console.error("Error fetching missions:", error);
			});
	}, []);

	// Initialize map
	useEffect(() => {
		if (mapContainerRef.current && !mapRef.current) {
			mapRef.current = L.map(mapContainerRef.current).setView(
				[46.603354, 1.888334], // Center of France
				6
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

	// Update map with mission markers
	useEffect(() => {
		if (!mapRef.current) return;

		// Remove existing markers and rectangle
		markersRef.current.forEach((marker) => marker.remove());
		markersRef.current = [];
		if (activeRectangleRef.current) {
			activeRectangleRef.current.remove();
			activeRectangleRef.current = null;
		}

		// Colors for different missions
		const colors = [
			"#3b82f6", // blue
			"#ef4444", // red
			"#22c55e", // green
			"#f59e0b", // amber
			"#8b5cf6", // violet
			"#ec4899", // pink
			"#06b6d4", // cyan
			"#f97316", // orange
		];

		const allPositions: L.LatLng[] = [];

		missions.forEach((mission, index) => {
			const tech = mission.technique;
			if (tech && tech.xMin && tech.xMax && tech.yMin && tech.yMax) {
				// Calculate center of the zone for marker placement
				const centerLat = (tech.yMin + tech.yMax) / 2;
				const centerLng = (tech.xMin + tech.xMax) / 2;
				const color = colors[index % colors.length];

				// Create custom location icon
				const locationIcon = L.divIcon({
					className: "custom-location-icon",
					html: `
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));">
							<path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
						</svg>
					`,
					iconSize: [32, 32],
					iconAnchor: [16, 32],
				});

				// Create marker at center of zone
				const marker = L.marker([centerLat, centerLng], {
					icon: locationIcon,
				}).addTo(mapRef.current!);

				// Add tooltip with mission name
				marker.bindTooltip(mission.typeMission || `Mission ${index + 1}`, {
					permanent: false,
					direction: "top",
					offset: [0, -32],
				});

				// Add click handler to draw rectangle and select mission
				marker.on("click", () => {
					// Remove previous rectangle if exists
					if (activeRectangleRef.current) {
						activeRectangleRef.current.remove();
					}

					// Draw rectangle for this mission
					const bounds: L.LatLngBoundsExpression = [
						[tech.yMin, tech.xMin],
						[tech.yMax, tech.xMax],
					];

					activeRectangleRef.current = L.rectangle(bounds, {
						color: color,
						weight: 3,
						fillOpacity: 0.25,
						dashArray: "5, 10",
					}).addTo(mapRef.current!);

					// Fit map to rectangle bounds
					mapRef.current!.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });

					// Select mission for sidebar
					setSelectedMission(mission);
				});

				markersRef.current.push(marker);
				allPositions.push(L.latLng(centerLat, centerLng));
			}
		});

		// Fit map to show all markers
		if (allPositions.length > 0) {
			const group = L.latLngBounds(allPositions);
			mapRef.current.fitBounds(group, { padding: [50, 50] });
		}
	}, [missions]);

	// Function to clear selection and rectangle
	const clearSelection = () => {
		if (activeRectangleRef.current) {
			activeRectangleRef.current.remove();
			activeRectangleRef.current = null;
		}
		setSelectedMission(null);
		
		// Reset map view to show all markers
		if (mapRef.current && markersRef.current.length > 0) {
			const positions = markersRef.current.map(m => m.getLatLng());
			const group = L.latLngBounds(positions);
			mapRef.current.fitBounds(group, { padding: [50, 50] });
		}
	};

	return (
		<main className="w-full min-h-screen bg-white flex flex-col">
			<header className="pb-10 text-center bg-sky-900/90">
				<Navbar />
			</header>
			{/* Leaflet map */}
			<div className="w-full grow flex bg-amber-600">
				<link
					rel="stylesheet"
					href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
					integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
					crossOrigin=""
				/>
				<div ref={mapContainerRef} className="grow w-[75%] "></div>

				{/* Display data of selected mission here */}
				<div className={cn("w-[25%] grow bg-gray-50 p-4 overflow-y-auto")}>
					{selectedMission ? (
						<div className="space-y-4">
							<div className="flex justify-between items-start">
								<h2 className="text-xl font-bold text-gray-900">
									{selectedMission.generale?.titre || "Mission"}
								</h2>
								<button
									onClick={clearSelection}
									className="text-gray-400 hover:text-gray-600 text-xl"
								>
									×
								</button>
							</div>

							{/* Mission Info */}
							<div className="bg-white rounded-lg p-4 shadow-sm border">
								<h3 className="font-semibold text-gray-700 mb-3">📋 Informations Générales</h3>
								<div className="space-y-2 text-sm">
									<p><span className="text-gray-500">Propriétaire:</span> <span className="font-medium text-value">{selectedMission.nomProprietaire}</span></p>
									<p><span className="text-gray-500">Email:</span> <span className="font-medium text-value">{selectedMission.emailProprietaire}</span></p>
									<p><span className="text-gray-500">Entreprise:</span> <span className="font-medium text-value">{selectedMission.entrepriseProprietaire}</span></p>
									<p><span className="text-gray-500">Capteur:</span> <span className="font-medium text-value">{selectedMission.capteurUtilise}</span></p>
									<p><span className="text-gray-500">Mots-clés:</span> <span className="font-medium text-value">{selectedMission.motsCles}</span></p>
								</div>
							</div>

							{/* Dates */}
							<div className="bg-white rounded-lg p-4 shadow-sm border">
								<h3 className="font-semibold text-gray-700 mb-3">📅 Dates du Vol</h3>
								<div className="space-y-2 text-sm">
									<p><span className="text-gray-500">Début:</span> <span className="font-medium text-value">{new Date(selectedMission.dateDebutVol).toLocaleDateString('fr-FR')}</span></p>
									<p><span className="text-gray-500">Fin:</span> <span className="font-medium text-value">{new Date(selectedMission.dateFinVol).toLocaleDateString('fr-FR')}</span></p>
								</div>
							</div>

							{/* Technical Data */}
							{selectedMission.technique && (
								<div className="bg-white rounded-lg p-4 shadow-sm border">
									<h3 className="font-semibold text-gray-700 mb-3">🗺️ Coordonnées</h3>
									<div className="space-y-2 text-sm">
										<div className="grid grid-cols-2 gap-2">
											<p><span className="text-gray-500">X Min:</span> <span className="font-medium text-value">{selectedMission.technique.xMin}</span></p>
											<p><span className="text-gray-500">X Max:</span> <span className="font-medium text-value">{selectedMission.technique.xMax}</span></p>
											<p><span className="text-gray-500">Y Min:</span> <span className="font-medium text-value">{selectedMission.technique.yMin}</span></p>
											<p><span className="text-gray-500">Y Max:</span> <span className="font-medium text-value">{selectedMission.technique.yMax}</span></p>
										</div>
										<p><span className="text-gray-500">Date Publication:</span> <span className="font-medium text-value">{new Date(selectedMission.technique.datePublication).toLocaleDateString('fr-FR')}</span></p>
										{selectedMission.technique.debut && <p><span className="text-gray-500">Début:</span> <span className="font-medium text-value">{new Date(selectedMission.technique.debut).toLocaleDateString('fr-FR')}</span></p>}
										{selectedMission.technique.fin && <p><span className="text-gray-500">Fin:</span> <span className="font-medium text-value">{new Date(selectedMission.technique.fin).toLocaleDateString('fr-FR')}</span></p>}
									</div>
								</div>
							)}

							{/* Generale Data */}
							{selectedMission.generale && (
								<div className="bg-white rounded-lg p-4 shadow-sm border">
									<h3 className="font-semibold text-gray-700 mb-3">📄 Métadonnées Générales</h3>
									<div className="space-y-2 text-sm">
										<p><span className="text-gray-500">Titre:</span> <span className="font-medium text-value">{selectedMission.generale.titre}</span></p>
										<p><span className="text-gray-500">Résumé:</span> <span className="font-medium text-value">{selectedMission.generale.resume}</span></p>
										<p><span className="text-gray-500">Catégorie:</span> <span className="font-medium text-value">{selectedMission.generale.categorieThematique}</span></p>
									</div>
								</div>
							)}

							{/* Admin Data */}
							{selectedMission.admin && (
								<div className="bg-white rounded-lg p-4 shadow-sm border">
									<h3 className="font-semibold text-gray-700 mb-3">⚖️ Métadonnées Administratives</h3>
									<div className="space-y-2 text-sm">
										<p><span className="text-gray-500">Langue:</span> <span className="font-medium text-value">{selectedMission.admin.langue}</span></p>
										<p><span className="text-gray-500">SRS/CRS:</span> <span className="font-medium text-value">{selectedMission.admin.SRS_CRSUtilise}</span></p>
										<p><span className="text-gray-500">Contraintes légales:</span> <span className="font-medium text-value">{selectedMission.admin.contraintesLegales}</span></p>
									</div>
								</div>
							)}

							{/* Validation Status */}
							<div className="bg-white rounded-lg p-4 shadow-sm border">
								<h3 className="font-semibold text-gray-700 mb-3">✅ Statut</h3>
								<span className={cn(
									"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
									selectedMission.statutValidation
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								)}>
									{selectedMission.statutValidation ? "Validé" : "En attente"}
								</span>
							</div>
						</div>
					) : (
						<div className="h-full flex items-center justify-center text-gray-400">
							<div className="text-center">
								<p className="text-4xl mb-2">🗺️</p>
								<p>Cliquez sur une zone pour voir les détails</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default CartePage;
