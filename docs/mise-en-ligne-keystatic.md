# Mettre le back-office Keystatic en ligne

État actuel : Keystatic fonctionne **en local** (`npm run dev` → http://localhost:4321/keystatic).
Ce document décrit les étapes pour l'utiliser **depuis n'importe où**, avec enregistrement
direct sur GitHub et reconstruction automatique du site.

Compter une heure la première fois. Chaque étape est indépendante : on peut s'arrêter
entre deux, le site en ligne actuel n'est pas touché tant que le DNS n'a pas bougé (étape 6).

---

## 1. Créer un compte GitHub

https://github.com/signup — compte gratuit. Noter le **nom d'utilisateur** choisi,
il sert partout ensuite (appelé `<utilisateur>` dans la suite).

Puis, dans le terminal, à la racine du projet, aligner l'identité Git sur l'adresse
utilisée pour le compte :

```sh
git config user.email "l-adresse-du-compte-github"
```

## 2. Créer le dépôt

Sur GitHub : **New repository**, nom `mon-portfolio`, visibilité **Private**,
et surtout **ne cocher aucune case** (pas de README, pas de .gitignore) — le dépôt
doit rester vide, le projet local a déjà son historique.

## 3. Envoyer le projet sur GitHub

Le dossier est déjà un dépôt Git avec un premier commit. Il reste à le relier :

```sh
git remote add origin https://github.com/<utilisateur>/mon-portfolio.git
git branch -M main
git push -u origin main
```

GitHub demandera une authentification. Le plus simple est d'installer
**GitHub Desktop** (https://desktop.github.com) et de s'y connecter une fois :
il gère l'authentification pour le terminal aussi.

À vérifier après le push : le fichier `.env` **ne doit pas** apparaître sur GitHub
(il est ignoré volontairement, il contient la clé Web3Forms).

## 4. Déployer sur Netlify

1. https://app.netlify.com → **Sign up with GitHub**.
2. **Add new site → Import an existing project → GitHub** → choisir `mon-portfolio`.
3. Netlify détecte Astro tout seul. Vérifier :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. Avant le premier déploiement, ouvrir **Environment variables** et ajouter :
   - `PUBLIC_WEB3FORMS_KEY` = la valeur qui est dans le `.env` local
     (sans elle, le formulaire de contact ne fonctionnera pas en ligne).
5. Déployer. Le site est visible sur une adresse en `xxx.netlify.app`.

## 5. Activer le mode GitHub de Keystatic

1. Dans Netlify → **Environment variables**, ajouter :
   - `PUBLIC_KEYSTATIC_GITHUB_REPO` = `<utilisateur>/mon-portfolio`
2. Redéployer (**Deploys → Trigger deploy**).
3. Ouvrir `https://xxx.netlify.app/keystatic` : un assistant propose de créer
   une **GitHub App**. Se laisser guider ; lui donner accès au dépôt `mon-portfolio`.
4. L'assistant affiche quatre valeurs. Les recopier dans les variables
   d'environnement Netlify :
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
5. Redéployer une dernière fois.

À partir de là : `/keystatic` demande une connexion GitHub, et chaque enregistrement
crée un commit sur le dépôt, qui déclenche un nouveau déploiement (environ une minute).

## 6. Basculer le nom de domaine

Dans Netlify → **Domain management → Add a custom domain** → `mathilde-regaud.fr`.
Netlify indique les enregistrements DNS à créer chez le registrar du domaine
(ou propose de gérer le DNS lui-même). Le certificat HTTPS est automatique.

Une fois le domaine actif, retourner dans les réglages de la GitHub App créée à
l'étape 5 et remplacer l'URL de callback par
`https://mathilde-regaud.fr/api/keystatic/github/oauth/callback`.

Hostinger peut rester en place quelques jours, le temps de vérifier que tout va bien.

---

## Au quotidien, après tout ça

- **Depuis n'importe quel navigateur** : `https://mathilde-regaud.fr/keystatic`,
  modifier un projet, enregistrer → le site se reconstruit tout seul.
- **Depuis le Mac** : `npm run dev`, puis http://localhost:4321/keystatic.
  En local, Keystatic écrit directement dans les fichiers — penser à faire
  `git add -A && git commit -m "..." && git push` ensuite.

## Si un jour il faut redéployer à la main (retour sur Hostinger ou autre)

```sh
npm run build:statique
```

produit un `dist/` entièrement statique, sans back-office — comme avant.

## Ajouter d'autres contenus au back-office

Pour l'instant seuls les **projets** sont éditables depuis Keystatic. Les textes
du hero, des services, des formules et du contact sont encore écrits en dur dans
les composants. Les rendre modifiables suppose de créer des *singletons* dans
`keystatic.config.ts` et de faire lire ces fichiers aux composants concernés.
