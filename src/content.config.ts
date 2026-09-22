import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Les textes fixes du site : une fiche unique par section, éditée via Keystatic.
const dossierSite = './src/content/site';

const hero = defineCollection({
	loader: glob({ pattern: 'hero.yaml', base: dossierSite }),
	schema: z.object({
		badge: z.string(),
		titre: z.string(),
		accroche: z.string(),
		sous_titre: z.string(),
		portrait: z.string(),
		bouton_principal: z.string(),
		bouton_secondaire: z.string(),
	}),
});

const realisations = defineCollection({
	loader: glob({ pattern: 'realisations.yaml', base: dossierSite }),
	schema: z.object({
		surtitre: z.string(),
		titre: z.string(),
		// Les projets, dans l'ordre défini au glisser-déposer dans Keystatic.
		liste: z
			.array(
				z.object({
					titre: z.string(),
					categorie: z.enum(['Graphisme', 'Site web', 'Photos et vidéos', 'Podcast', 'Réseaux sociaux']),
					image: z.string(),
					galerie: z.array(z.string()).default([]),
					description: z.string().optional(),
					// Keystatic écrit une chaîne vide quand le champ est laissé vide.
					lien: z.union([z.string().url(), z.literal('')]).optional(),
					couleur: z.string().default('#f9d999'),
				}),
			)
			.default([]),
	}),
});

const services = defineCollection({
	loader: glob({ pattern: 'services.yaml', base: dossierSite }),
	schema: z.object({
		surtitre: z.string(),
		titre: z.string(),
		liste: z.array(
			z.object({
				icone: z.string(),
				titre: z.string(),
				description: z.string(),
				outils: z.array(z.string()).default([]),
			}),
		),
	}),
});

const formules = defineCollection({
	loader: glob({ pattern: 'formules.yaml', base: dossierSite }),
	schema: z.object({
		surtitre: z.string(),
		titre: z.string(),
		liste: z.array(
			z.object({
				nom: z.string(),
				icone: z.string(),
				objectif: z.string(),
				avantages: z.array(z.string()).default([]),
				mise_en_avant: z.boolean().default(false),
			}),
		),
	}),
});

const contact = defineCollection({
	loader: glob({ pattern: 'contact.yaml', base: dossierSite }),
	schema: z.object({
		surtitre: z.string(),
		titre: z.string(),
		intro: z.string(),
		bouton: z.string(),
	}),
});

export const collections = { hero, realisations, services, formules, contact };
