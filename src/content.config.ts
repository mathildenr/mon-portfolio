import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projets = defineCollection({
	// Les projets sont des fichiers de données YAML, édités via Keystatic (/keystatic).
	loader: glob({ pattern: '**/*.yaml', base: './src/content/projets' }),
	schema: z.object({
		titre: z.string(),
		categorie: z.enum(['Graphisme', 'Site web', 'Photos et vidéos', 'Podcast', 'Réseaux sociaux']),
		// Keystatic écrit une chaîne vide quand le champ est laissé vide.
		lien: z.union([z.string().url(), z.literal('')]).optional(),
		image: z.string(),
		description: z.string().optional(),
		couleur: z.string().default('#f9d999'),
		ordre: z.number().default(0),
	}),
});

export const collections = { projets };
