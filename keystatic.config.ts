import { config, fields, collection, singleton } from '@keystatic/core';

const depotGithub = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as string | undefined;

export default config({
	// Le mode dépend d'une seule variable, PUBLIC_KEYSTATIC_GITHUB_REPO :
	//  - absente (cas du .env local) : mode local, Keystatic écrit dans les fichiers du projet
	//  - présente (définie dans Netlify) : mode GitHub, chaque enregistrement devient un commit
	// L'ajouter temporairement au .env local permet de lancer l'assistant /keystatic/setup
	// depuis la machine, ce qui est le seul endroit où il peut écrire les secrets.
	storage: depotGithub ? { kind: 'github', repo: depotGithub } : { kind: 'local' },

	ui: {
		brand: { name: 'Portfolio Mathilde' },
		navigation: {
			Réalisations: ['projets'],
			'Sections du site': ['hero', 'realisations', 'services', 'formules', 'contact'],
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

	singletons: {
		hero: singleton({
			label: 'Accueil (haut de page)',
			path: 'src/content/site/hero',
			format: { data: 'yaml' },
			schema: {
				badge: fields.text({
					label: 'Petite étiquette',
					description: 'La pastille jaune au-dessus du nom.',
				}),
				titre: fields.text({ label: 'Titre principal' }),
				accroche: fields.text({
					label: 'Accroche',
					description:
						'Deux astérisques autour d’un passage le mettent en couleur : **comme ceci**. Un retour à la ligne dans le texte en crée un sur le site.',
					multiline: true,
				}),
				sous_titre: fields.text({
					label: 'Phrase de précision',
					description: 'Le paragraphe gris sous l’accroche.',
					multiline: true,
				}),
				portrait: fields.image({
					label: 'Portrait',
					directory: 'public/images',
					publicPath: '/images/',
					validation: { isRequired: true },
				}),
				bouton_principal: fields.text({
					label: 'Bouton principal',
					description: 'Mène à la section Contact.',
				}),
				bouton_secondaire: fields.text({
					label: 'Bouton secondaire',
					description: 'Mène à la grille de projets.',
				}),
			},
		}),

		realisations: singleton({
			label: 'Réalisations (titres)',
			path: 'src/content/site/realisations',
			format: { data: 'yaml' },
			schema: {
				surtitre: fields.text({ label: 'Surtitre', description: 'En petites capitales.' }),
				titre: fields.text({ label: 'Titre de la section' }),
			},
		}),

		services: singleton({
			label: 'Services',
			path: 'src/content/site/services',
			format: { data: 'yaml' },
			schema: {
				surtitre: fields.text({ label: 'Surtitre' }),
				titre: fields.text({ label: 'Titre de la section' }),
				liste: fields.array(
					fields.object({
						icone: fields.text({ label: 'Émoji', description: 'Un seul caractère, par ex. 🎨' }),
						titre: fields.text({ label: 'Titre' }),
						description: fields.text({ label: 'Description', multiline: true }),
						outils: fields.array(fields.text({ label: 'Outil' }), {
							label: 'Outils',
							itemLabel: (props) => props.value,
						}),
					}),
					{
						label: 'Cartes',
						itemLabel: (props) => props.fields.titre.value || 'Sans titre',
					},
				),
			},
		}),

		formules: singleton({
			label: 'Formules',
			path: 'src/content/site/formules',
			format: { data: 'yaml' },
			schema: {
				surtitre: fields.text({ label: 'Surtitre' }),
				titre: fields.text({ label: 'Titre de la section' }),
				liste: fields.array(
					fields.object({
						nom: fields.text({ label: 'Nom de la formule' }),
						icone: fields.text({ label: 'Émoji' }),
						objectif: fields.text({ label: 'À qui elle s’adresse', multiline: true }),
						avantages: fields.array(fields.text({ label: 'Ligne' }), {
							label: 'Ce qu’elle comprend',
							itemLabel: (props) => props.value,
						}),
						mise_en_avant: fields.checkbox({
							label: 'Mettre en avant',
							description: 'Ajoute la pastille « Populaire » et détache la carte.',
							defaultValue: false,
						}),
					}),
					{
						label: 'Formules',
						itemLabel: (props) => props.fields.nom.value || 'Sans nom',
					},
				),
			},
		}),

		contact: singleton({
			label: 'Contact',
			path: 'src/content/site/contact',
			format: { data: 'yaml' },
			schema: {
				surtitre: fields.text({ label: 'Surtitre' }),
				titre: fields.text({ label: 'Titre de la section' }),
				intro: fields.text({ label: 'Texte d’introduction', multiline: true }),
				bouton: fields.text({ label: 'Texte du bouton d’envoi' }),
			},
		}),
	},
});
