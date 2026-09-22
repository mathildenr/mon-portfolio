import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// Les fiches Keystatic stockent un chemin en « @assets/... ». Vite, lui, veut un
// chemin depuis la racine du projet : on fait le pont ici.
const fichiers = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/images/**/*.{jpeg,jpg,png,webp,avif,gif,svg}',
);

/** Largeurs de rendu, en pixels, pensées pour un écran deux fois plus dense. */
export const LARGEUR_VIGNETTE = 800;
export const LARGEUR_APERCU = 1200;
export const LARGEUR_PORTRAIT = 450;

/**
 * Redimensionne une image déposée dans Keystatic et la convertit en WebP.
 * Le fichier d'origine reste intact : Astro écrit une copie optimisée à la
 * compilation. Une image jamais agrandie au-delà de sa taille réelle.
 */
export async function optimiser(valeur: string | undefined, largeur: number): Promise<string> {
	if (!valeur) return '';

	const chemin = valeur.replace(/^@assets\//, '/src/assets/');
	const charger = fichiers[chemin];

	// Chemin inconnu : en développement, c'est presque toujours une image tout
	// juste déposée dans Keystatic que le serveur n'a pas encore indexée. Le
	// glob ci-dessus est figé au démarrage : il faut relancer `npm run dev`.
	// On le dit dans la console plutôt que d'afficher une image cassée sans
	// explication.
	if (!charger) {
		console.warn(
			`[images] « ${valeur} » introuvable. Si l'image vient d'être déposée dans Keystatic, relancer le serveur de développement.`,
		);
		return valeur;
	}

	const { default: source } = await charger();

	// Le SVG n'a rien à gagner à passer par sharp.
	if (source.format === 'svg') return source.src;

	const { src } = await getImage({
		src: source,
		width: Math.min(largeur, source.width),
		format: 'webp',
	});

	return src;
}
