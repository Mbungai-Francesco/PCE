// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";

const HomePage = () => {
	// const navigate = useNavigate();

	const features = [
		"Conformité aux normes COVADIS et INSPIRE",
		// "Import et export XML pour interopérabilité",
		"Gestion des systèmes de référence spatiale (EPSG)",
		"Sauvegarde progressive et reprise possible",
		"Interface intuitive en quelques étapes",
	];

	const metadataTypes = [
		{
			icon: "📋",
			title: "Métadonnées Générales",
			description:
				"Titre, résumé, identifiant unique, type de ressource et informations de contact",
		},
		{
			icon: "🛠️",
			title: "Métadonnées Techniques",
			description:
				"Emprise géographique, système de référence, dates et étendue temporelle",
		},
		{
			icon: "⚖️",
			title: "Métadonnées Administratives",
			description:
				"Licences, droits d'auteur, contraintes légales et conditions d'accès",
		},
	];

	return (
		<div className="">
			{/* Main Content Card */}
			<main className="w-full min-h-screen bg-white">
				{/* Header Section */}
				<header className="pb-10 text-center bg-sky-900/90">
					<Navbar />
					<p className="text-white/90 text-lg max-w-3xl mx-auto px-4">
						Centre d'études et d'expertise sur les risques, l'environnement, la
						mobilité et l'aménagement
					</p>
				</header>
				<div className=" overflow-hidden w-4/5 mx-auto ">
					{/* Hero Section */}
					<div className="text-center py-12 px-8 border-b border-gray-100">
						<div className="w-20 h-20 bg-linear-to-br from-blue-400 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-4xl">🚁</span>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Saisie de Métadonnées
						</h1>
						<h2 className="text-3xl font-bold text-gray-900 mb-6">
							Vol de Drone
						</h2>
						<p className="text-gray-500 max-w-2xl mx-auto">
							Gérez et documentez vos vols de drone de manière professionnelle
							avec notre système de saisie de métadonnées conforme aux standards
							internationaux.
						</p>
					</div>

					{/* Metadata Types */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-gray-100">
						{metadataTypes.map((type, index) => (
							<div
								key={index}
								className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
							>
								<div className="w-14 h-14 bg-linear-to-br from-blue-400 to-purple-700/80 rounded-xl flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">{type.icon}</span>
								</div>
								<h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
								<p className="text-gray-500 text-sm">{type.description}</p>
							</div>
						))}
					</div>

					{/* CTA Section */}
					<div className="text-center py-12 px-8 border-b border-gray-100">
						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							Prêt à commencer ?
						</h3>
						<p className="text-gray-500 mb-8">
							Créez un nouveau projet ou importez des métadonnées existantes
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								onClick={() => window.open("/form", "_blank")}
								className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full"
							>
								🚀 NOUVEAU PROJET
							</Button>
							{/* <Button
								variant="outline"
								className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full"
							>
								📥 IMPORTER DES DONNÉES
							</Button> */}
						</div>
					</div>

					{/* Features Section */}
					<div className="p-8">
						<div className="flex items-center gap-2 mb-6">
							<span className="text-yellow-400">✨</span>
							<h3 className="text-xl font-bold text-gray-900">
								Fonctionnalités principales
							</h3>
						</div>
						<ul className="space-y-4">
							{features.map((feature, index) => (
								<li key={index} className="flex items-center gap-3">
									<span className="text-green-500 text-lg">✓</span>
									<span className="text-gray-600">{feature}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				{/* Footer */}
				<footer className="bg-sky-900/90 text-white/80 text-center py-4">
					<p className="text-sm">
						© 2025 CEREMA - Tous droits réservés | Système de gestion de
						métadonnées pour vols de drone
					</p>
				</footer>
			</main>
		</div>
	);
};

export default HomePage;
