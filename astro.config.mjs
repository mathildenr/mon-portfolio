// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// Deux modes de build :
//  - par défaut (dev + Netlify) : le back-office Keystatic est monté sur /keystatic
//  - avec SKIP_KEYSTATIC=true (npm run build) : site 100 % statique, sans back-office,
//    pour un dépôt classique par FTP/zip.
const sansKeystatic = Boolean(process.env.SKIP_KEYSTATIC);

// https://astro.build/config
export default defineConfig({
	site: 'https://mathilde-regaud.fr',
	integrations: sansKeystatic ? [sitemap()] : [sitemap(), react(), keystatic()],
	...(sansKeystatic ? {} : { adapter: netlify() }),
});
