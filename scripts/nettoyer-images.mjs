/**
 * Retire de `dist` les images qu'aucune page ne réclame.
 *
 * Astro écrit dans `_astro/` les versions optimisées ET les fichiers d'origine
 * importés depuis `src/assets`. Seules les premières sont servies : les
 * secondes alourdissent le déploiement et exposent les visuels en pleine
 * résolution. On supprime donc les images auxquelles rien ne renvoie.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = 'dist';
const IMAGES = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);
const TEXTES = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt']);

async function parcourir(dossier) {
	const fichiers = [];
	for (const entree of await readdir(dossier, { withFileTypes: true })) {
		const chemin = join(dossier, entree.name);
		if (entree.isDirectory()) fichiers.push(...(await parcourir(chemin)));
		else fichiers.push(chemin);
	}
	return fichiers;
}

const fichiers = await parcourir(DIST);

// Tout ce qui est cité dans une page, une feuille de style ou un script.
let references = '';
for (const f of fichiers) {
	if (TEXTES.has(extname(f).toLowerCase())) references += await readFile(f, 'utf8');
}

let supprimes = 0;
let octets = 0;

for (const f of fichiers) {
	if (!f.includes(`${DIST}/_astro/`)) continue;
	if (!IMAGES.has(extname(f).toLowerCase())) continue;

	const nom = f.split('/').pop();
	if (references.includes(nom)) continue;

	octets += (await stat(f)).size;
	await unlink(f);
	supprimes += 1;
}

if (supprimes > 0) {
	console.log(`[images] ${supprimes} fichier(s) non référencé(s) retiré(s) de dist — ${(octets / 1024 / 1024).toFixed(1)} Mo`);
}
