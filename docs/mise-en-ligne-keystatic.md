# Mettre le back-office Keystatic en ligne

État actuel : Keystatic fonctionne **en local** (`npm run dev` → http://localhost:4321/keystatic)
**et en ligne** (https://mathilde-regaud.fr/keystatic), avec enregistrement direct sur GitHub
et reconstruction automatique du site par Netlify. Les étapes ci-dessous sont celles qui ont
été suivies ; les pièges rencontrés sont signalés au fil du texte et regroupés en fin de document.

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
clé Web3Forms). Vérifier aussi dans **Settings → Danger Zone** que le dépôt est bien
**privé** : il avait été créé public.

Les archives locales (`site-hostinger.zip`, `portfolio-a-deposer.zip`) sont dans le
`.gitignore` et ne doivent pas être ajoutées au dépôt.

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

Le projet Netlify actuel s'appelle `verdant-dolphin-bea724` (affiché « mathilde-regaud.fr »
dans la liste). S'il a été créé en déposant un dossier à la main (« Netlify Drop »), il n'est
pas relié à GitHub : **Project configuration → Developer settings → Link repository →
GitHub**, puis choisir `mathildenr/mon-portfolio`, branche `main`. Les réglages de build
viennent de `netlify.toml` (commande `npm run build:netlify`, dossier `dist`).

## 5. Activer le mode GitHub de Keystatic

1. Dans Netlify → **Environment variables**, ajouter, avant le premier déploiement relié à
   GitHub :
   - `PUBLIC_WEB3FORMS_KEY` (valeur du `.env` local, sinon le formulaire de contact casse)
   - `PUBLIC_KEYSTATIC_GITHUB_REPO` = `mathildenr/mon-portfolio`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` = `keystatic-portfolio-mathilde`
2. Redéployer (**Deploys → Trigger deploy → Deploy project**).
3. **La GitHub App.** Si elle n'existe pas encore, ouvrir `https://xxx.netlify.app/keystatic` :
   un assistant propose de la créer. Si elle existe déjà (c'est le cas :
   `keystatic-portfolio-mathilde`, sur https://github.com/settings/apps/keystatic-portfolio-mathilde),
   la réutiliser et récupérer ses valeurs :
   - **Client ID** (`Iv…`) : en haut de la page **General**. À copier-coller, sans le retaper
     (lettres qui se ressemblent : I, l, 0, O).
   - **Client secret** : menu **Credentials** → **Generate a new client secret**. Il n'est
     affiché qu'**une seule fois** : l'ajouter dans Netlify avant de copier autre chose.
   - **`KEYSTATIC_SECRET`** : une chaîne aléatoire, `openssl rand -hex 32 | pbcopy`
     (la valeur va dans le presse-papiers, sans s'afficher).
4. Les ajouter dans les variables d'environnement Netlify, avec « Contains secret values »
   pour les deux secrets :
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
5. Sur la page de l'app GitHub, section **Identifying and authorizing users**, vérifier que
   l'adresse de retour du domaine est enregistrée (puis **Save changes**) :
   `https://mathilde-regaud.fr/api/keystatic/github/oauth/callback`
   Les adresses `http://127.0.0.1:4321/...` servent à l'édition en local ; celle en
   `netlify.app` à l'adresse Netlify.
6. **Installer l'app sur le dépôt** : menu **Install App** → `mathildenr` → *Only select
   repositories* → `mon-portfolio`. Dans **Permissions & events**, **Contents** doit être sur
   *Read and write*. Sans cette installation, l'enregistrement échoue avec « The GitHub App is
   unable to commit to the repository ».
7. Redéployer une dernière fois.

À partir de là : `/keystatic` demande une connexion GitHub, et chaque enregistrement
crée un commit sur le dépôt, qui déclenche un nouveau déploiement (environ une minute,
plus un rechargement forcé du navigateur : Cmd+Shift+R).

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
- **Toujours `git pull` avant de travailler en local** si une modification a pu être faite
  en ligne : sinon le `git push` suivant est refusé.
- L'encart **Current branch** de Keystatic est facultatif : rester sur `main`. Créer une
  branche échoue avec « Resource not accessible by integration » (l'app n'a pas le droit
  de créer des branches), ce qui est sans conséquence.

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

## Dépannage

- **Netlify ne reconstruit plus à chaque push.** Dans Netlify → Deploys, le haut de la page
  indique d'où vient le dernier déploiement. « Netlify Drop » ou « Repository not found »
  (comme le 1er septembre, quand le compte GitHub était signalé) veut dire que le dépôt
  n'est plus relié : refaire **Link repository** (étape 4).
- **`/keystatic` répond 404.** Le site a été déployé en statique (`npm run build` ou dépôt
  manuel) au lieu de `npm run build:netlify`. Seul le build lancé par Netlify inclut le
  back-office.
- **`/api/keystatic/github/login` répond 500.** Une des variables `KEYSTATIC_*` manque dans
  Netlify. Il en faut 5 pour Keystatic : `KEYSTATIC_GITHUB_CLIENT_ID`,
  `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_REPO` et
  `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (plus `PUBLIC_WEB3FORMS_KEY` pour le formulaire).
- **Erreur sur `http://127.0.0.1:4321/...` à l'installation de l'app.** Sans gravité : GitHub
  redirige vers la première adresse de retour de la liste, ici l'adresse du serveur local,
  qui n'est pas lancé. Vérifier simplement dans https://github.com/settings/installations
  que l'app est bien installée sur `mon-portfolio`.
- **Client secret perdu.** Il ne se relit jamais : en générer un nouveau (Credentials),
  le remplacer dans Netlify, puis supprimer l'ancien avec **Delete**.
