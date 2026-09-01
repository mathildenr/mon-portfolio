# Mettre le back-office Keystatic en ligne

État actuel : Keystatic fonctionne **en local** (`npm run dev` → http://localhost:4321/keystatic).
Ce document décrit les étapes pour l'utiliser **depuis n'importe où**, avec enregistrement
direct sur GitHub et reconstruction automatique du site.

Compter une heure la première fois. Chaque étape est indépendante : on peut s'arrêter
entre deux, le site en ligne actuel n'est pas touché tant que le DNS n'a pas bougé (étape 6).

---

## 1 à 3. Publier le projet sur GitHub

Compte GitHub : `mathildenr`.

Le dossier est déjà un dépôt Git avec son historique. Le plus simple, depuis
**VS Code**, ouvre le projet puis :

1. Icône **Source Control** dans la barre latérale (le petit embranchement).
2. Bouton **Publish to GitHub**.
3. Choisir **Publish to a private repository**, nom `mon-portfolio`.
4. VS Code ouvre le navigateur pour autoriser la connexion à GitHub, puis crée
   le dépôt et envoie le code.

Rien à créer à la main sur github.com : VS Code s'en charge.

Vérification après coup, sur github.com/mathildenr/mon-portfolio : le fichier
`.env` **ne doit pas** y figurer (il est ignoré volontairement, il contient la
clé Web3Forms).

### Variante en ligne de commande

Créer d'abord le dépôt vide sur github.com (**New repository**, `mon-portfolio`,
**Private**, aucune case cochée), puis :

```sh
cd ~/mon-portfolio
git remote add origin https://github.com/mathildenr/mon-portfolio.git
git branch -M main
git push -u origin main
```

## 4. Déployer sur Netlify

1. https://app.netlify.com → **Sign up with GitHub**.
2. **Add new site → Import an existing project → GitHub** → choisir `mathildenr/mon-portfolio`.
3. Le fichier `netlify.toml` du projet fixe déjà la commande de build
   (`npm run build:netlify`) et le dossier publié (`dist`) — rien à saisir.
4. Avant le premier déploiement, ouvrir **Environment variables** et ajouter :
   - `PUBLIC_WEB3FORMS_KEY` = la valeur qui est dans le `.env` local
     (sans elle, le formulaire de contact ne fonctionnera pas en ligne).
5. Déployer. Le site est visible sur une adresse en `xxx.netlify.app`.

## 5. Activer le mode GitHub de Keystatic

1. Dans Netlify → **Environment variables**, ajouter :
   - `PUBLIC_KEYSTATIC_GITHUB_REPO` = `mathildenr/mon-portfolio`
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

## 6. Basculer le nom de domaine (domaine géré chez Hostinger)

**Côté Netlify.** Project configuration → **Domain management** → **Add a domain**
→ `mathilde-regaud.fr`. Netlify ajoute automatiquement la version avec et sans
`www`, puis affiche « Awaiting external DNS ». Ne pas accepter la proposition de
confier le DNS à Netlify : cela déplacerait aussi la messagerie du domaine.

**Côté Hostinger.** hPanel → **Domaines** → `mathilde-regaud.fr` → **Zone DNS**.

Avant de toucher à quoi que ce soit, faire une capture d'écran de la zone
existante. Puis :

| Type | Nom | Valeur |
| --- | --- | --- |
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `verdant-dolphin-bea724.netlify.app` |

- L'enregistrement `A` existe déjà et pointe vers Hostinger : il faut le
  **modifier**, pas en ajouter un second.
- Supprimer un éventuel enregistrement `AAAA` sur `@` (adresse IPv6 vers
  Hostinger) : s'il reste, une partie des visiteurs continuera d'atterrir sur
  l'ancien site.
- **Ne pas toucher aux enregistrements MX ni aux TXT** : ce sont les adresses
  e-mail du domaine et les vérifications associées.

La propagation prend de quelques minutes à quelques heures. Le certificat HTTPS
est ensuite émis automatiquement par Netlify.

**Une fois le domaine actif :**

1. Dans Netlify, définir `mathilde-regaud.fr` comme **Primary domain**.
2. Dans les réglages de la GitHub App (étape 5), remplacer l'URL de callback par
   `https://mathilde-regaud.fr/api/keystatic/github/oauth/callback`.

Les fichiers déposés sur Hostinger peuvent rester en place quelques jours : ils
ne seront simplement plus servis.

---

## Au quotidien, après tout ça

- **Depuis n'importe quel navigateur** : `https://mathilde-regaud.fr/keystatic`,
  modifier un projet, enregistrer → le site se reconstruit tout seul.
- **Depuis le Mac** : `npm run dev`, puis http://localhost:4321/keystatic.
  En local, Keystatic écrit directement dans les fichiers — penser à faire
  `git add -A && git commit -m "..." && git push` ensuite.

## Si un jour il faut redéployer à la main (retour sur Hostinger ou autre)

```sh
npm run build
```

produit un `dist/` entièrement statique, sans back-office — comme avant.
C'est `npm run build:netlify` (lancé par Netlify) qui construit la version
avec le back-office.

## Ce qui est éditable depuis Keystatic

- **Réalisations → Projets** : les 9 fiches projet (`src/content/projets/*.yaml`)
- **Sections du site** : cinq fiches uniques (`src/content/site/*.yaml`)
  - *Accueil (haut de page)* : étiquette, titre, accroche, phrase de précision,
    portrait, libellés des deux boutons
  - *Réalisations (titres)* : surtitre et titre de la section projets
  - *Services* : surtitre, titre, et les cartes (émoji, titre, description, outils)
  - *Formules* : surtitre, titre, et les formules (nom, émoji, objectif,
    ce qu'elle comprend, mise en avant)
  - *Contact* : surtitre, titre, texte d'introduction, libellé du bouton

Dans l'accroche de l'accueil, deux astérisques autour d'un passage le mettent en
couleur (`**comme ceci**`) et un retour à la ligne en crée un sur le site.

Restent écrits en dur : le menu, le pied de page, les mentions légales et les
libellés du formulaire de contact. Ils peuvent basculer de la même façon si le
besoin s'en fait sentir.
