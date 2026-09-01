/**
 * Met en forme une accroche saisie dans Keystatic :
 *  - **un passage** devient un passage mis en couleur
 *  - un retour à la ligne devient un saut de ligne
 * Le reste est échappé, pour qu'aucune balise saisie par erreur ne s'exécute.
 */
export function accrocheEnHtml(texte: string): string {
	return texte
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\*\*(.+?)\*\*/g, '<span class="highlight">$1</span>')
		.replace(/\r?\n/g, '<br />');
}
