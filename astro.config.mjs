// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Les mentions légales restent accessibles sur le site, mais ne sont pas proposées
// au référencement : elles n'ont rien à faire dans les résultats de recherche.
const plan = sitemap({ filter: (page) => !page.includes('/mentions-legales') });
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// Trois situations :
//  - `npm run dev`          : back-office Keystatic actif, aucun adaptateur
//                             (pas d'émulation Netlify en local, elle n'apporte rien ici)
//  - `npm run build`        : site 100 % statique, sans back-office (dépôt FTP/zip)
//  - `npm run build:netlify`: site + back-office, lancé par Netlify (cf. netlify.toml)
const sansKeystatic = Boolean(process.env.SKIP_KEYSTATIC);
const buildNetlify = Boolean(process.env.NETLIFY_BUILD);

// https://astro.build/config
export default defineConfig({
	site: 'https://mathilde-regaud.fr',
	integrations: sansKeystatic ? [plan] : [plan, react(), keystatic()],
	...(buildNetlify ? { adapter: netlify() } : {}),
});
