export type FragmentAccroche =
	| { type: 'texte'; valeur: string }
	| { type: 'accent'; valeur: string }
	| { type: 'saut' };

/**
 * Découpe une accroche saisie dans Keystatic en fragments affichables :
 *  - **un passage** devient un fragment « accent », mis en couleur
 *  - un retour à la ligne devient un fragment « saut »
 * On renvoie des fragments plutôt que du HTML pour que les styles de la
 * section s'appliquent normalement.
 */
export function decouperAccroche(texte: string): FragmentAccroche[] {
	const fragments: FragmentAccroche[] = [];

	texte.split(/\r?\n/).forEach((ligne, index) => {
		if (index > 0) fragments.push({ type: 'saut' });

		for (const morceau of ligne.split(/(\*\*.+?\*\*)/g)) {
			if (!morceau) continue;
			if (morceau.startsWith('**') && morceau.endsWith('**')) {
				fragments.push({ type: 'accent', valeur: morceau.slice(2, -2) });
			} else {
				fragments.push({ type: 'texte', valeur: morceau });
			}
		}
	});

	return fragments;
}
