import { config, fields, collection } from '@keystatic/core';

const depotGithub = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as string | undefined;

export default config({
	// Sur ton Mac (npm run dev) : mode local, Keystatic écrit dans les fichiers du projet.
	// En ligne : mode GitHub, chaque enregistrement devient un commit sur le dépôt.
	// Le basculement se fait par la variable d'environnement PUBLIC_KEYSTATIC_GITHUB_REPO
	// (à définir dans Netlify uniquement, au format "utilisateur/mon-portfolio").
	storage:
		import.meta.env.DEV || !depotGithub
			? { kind: 'local' }
			: { kind: 'github', repo: depotGithub },

	ui: {
		brand: { name: 'Portfolio Mathilde' },
		navigation: {
			Contenu: ['projets'],
		},
	},

	collections: {
		projets: collection({
			label: 'Projets',
			path: 'src/content/projets/*',
			slugField: 'titre',
			format: { data: 'yaml' },
			columns: ['titre', 'categorie', 'ordre'],
			schema: {
				titre: fields.slug({
					name: {
						label: 'Titre',
						description: 'Nom du projet, affiché sur la vignette et dans l’aperçu.',
					},
					slug: {
						label: 'Nom du fichier',
						description: 'Généré depuis le titre. À ne modifier que si nécessaire.',
					},
				}),
				categorie: fields.select({
					label: 'Catégorie',
					description: 'Détermine le filtre sous lequel le projet apparaît.',
					options: [
						{ label: 'Graphisme', value: 'Graphisme' },
						{ label: 'Site web', value: 'Site web' },
						{ label: 'Photos et vidéos', value: 'Photos et vidéos' },
						{ label: 'Podcast', value: 'Podcast' },
						{ label: 'Réseaux sociaux', value: 'Réseaux sociaux' },
					],
					defaultValue: 'Graphisme',
				}),
				image: fields.image({
					label: 'Visuel',
					description: 'Format paysage recommandé, en .webp si possible.',
					directory: 'public/images/projets',
					publicPath: '/images/projets/',
					validation: { isRequired: true },
				}),
				description: fields.text({
					label: 'Description',
					description: 'Une à deux phrases, affichées dans l’aperçu au clic.',
					multiline: true,
				}),
				lien: fields.url({
					label: 'Lien vers le projet',
					description: 'Optionnel. Laisser vide s’il n’y a rien à montrer en ligne.',
				}),
				couleur: fields.text({
					label: 'Couleur d’accent',
					description: 'Code hexadécimal, par ex. #f9d999.',
					defaultValue: '#f9d999',
				}),
				ordre: fields.integer({
					label: 'Ordre d’affichage',
					description: 'Les plus petits nombres apparaissent en premier.',
					defaultValue: 0,
					validation: { isRequired: true },
				}),
			},
		}),
	},
});
