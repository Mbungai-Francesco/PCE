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
	const rectanglesRef = useRef<L.Rectangle[]>([]);

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

	// Update map with mission rectangles
	useEffect(() => {
		if (!mapRef.current) return;

		// Remove existing rectangles
		rectanglesRef.current.forEach((rect) => rect.remove());
		rectanglesRef.current = [];

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

		const allBounds: L.LatLngBounds[] = [];

		missions.forEach((mission, index) => {
			const tech = mission.technique;
			if (tech && tech.xMin && tech.xMax && tech.yMin && tech.yMax) {
				const bounds: L.LatLngBoundsExpression = [
					[tech.yMin, tech.xMin],
					[tech.yMax, tech.xMax],
				];

				const color = colors[index % colors.length];

				// Create rectangle with popup
				const rectangle = L.rectangle(bounds, {
					color: color,
					weight: 2,
					fillOpacity: 0.3,
				}).addTo(mapRef.current!);

				// Add click handler to select mission
				rectangle.on("click", () => {
					setSelectedMission(mission);
				});

				// Add popup with mission info
				rectangle.bindPopup(`
					<div style="min-width: 200px;">
						<h3 style="font-weight: bold; margin-bottom: 8px;">
							${mission.typeMission || "Mission " + (index + 1)}
						</h3>
						<p><strong>Propriétaire:</strong> ${mission.nomProprietaire}</p>
						<p><strong>Entreprise:</strong> ${mission.entrepriseProprietaire}</p>
						<p><strong>Début:</strong> ${new Date(
							mission.dateDebutVol
						).toLocaleDateString()}</p>
						<p><strong>Fin:</strong> ${new Date(
							mission.dateFinVol
						).toLocaleDateString()}</p>
						<p><strong>Capteur:</strong> ${mission.capteurUtilise}</p>
					</div>
				`);

				rectanglesRef.current.push(rectangle);
				allBounds.push(L.latLngBounds(bounds));
			}
		});

		// Fit map to show all rectangles
		if (allBounds.length > 0) {
			const combinedBounds = allBounds.reduce((acc, bounds) =>
				acc.extend(bounds)
			);
			mapRef.current.fitBounds(combinedBounds, { padding: [50, 50] });
		}
	}, [missions]);

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
									onClick={() => setSelectedMission(null)}
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
