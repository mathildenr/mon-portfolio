/**
 * Lit une fiche unique (les sections fixes du site) en échouant clairement.
 *
 * Sans ce garde-fou, une collection absente du cache d'Astro donne un
 * « Cannot read properties of undefined (reading 'data') » qui ne dit ni
 * quelle section manque, ni quoi faire.
 */
export function exigerFiche<T>(fiche: { data: T } | undefined, nom: string): T {
	if (!fiche) {
		throw new Error(
			`Section « ${nom} » introuvable dans le contenu. ` +
				`Le cache d'Astro est probablement incomplet : arrêter le serveur, ` +
				`supprimer le dossier .astro, puis relancer \`npm run dev\`.`,
		);
	}

	return fiche.data;
}
