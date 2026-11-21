# Le Grimoire des Sophismes

Appli web (PC et téléphone, installable, hors ligne) pour apprendre à repérer les sophismes.

- **Le Grimoire** : un livre ancien dont les pages se tournent. 36 sophismes en 6 chapitres, classés selon
  **l'endroit où l'argument casse** (le schéma du pont : fondations, arche, portée, pont vers ailleurs, mots, terrain).
  Chaque page est scellée tant que le sophisme n'a pas été débusqué ; un clic ouvre la leçon complète et un mini-quiz.
- **L'entraînement** : Apprenti (sophisme ou pas ?), Compagnon (4 étiquettes), Maître (écrire le nom, tolérant
  aux fautes, « presque » si l'on nomme la famille), et Débats (cliquer la réplique fautive, puis la nommer).
- Progression incrémentale : pages débloquées, 3 sceaux de maîtrise par sophisme, encre, rangs du lecteur.

## Fichiers

- `js/sophismes.js` : chapitres et sophismes (contenu des pages et des leçons).
- `js/exercices.js` : 132 exercices de départ et 6 débats ; `js/debats-2.js` : 6 débats de plus.
- `js/phrases-grimoire-*.js` et `js/phrases-*.js` : phrases supplémentaires. L'appli n'utilise que celles de ses 36 sophismes
  (`TOUTES` dans `app.js`) : 372 phrases, dont 52 % d'arguments corrects. Une série Apprenti en compte 5 sur 10,
  Compagnon et Maître 3 sur 10 (bouton « Pas de sophisme »), suivis d'une question sur la vérité probable.
- `js/app.js` : livre, leçons, entraînement, débats, sauvegarde (`localStorage`, clé `grimoire-sophismes-v1`).
- `js/installation.js` : bouton « Installer l'appli » (Android, PC ; mode d'emploi pour iPhone) et « Ma sauvegarde »
  (export/import de la progression par fichier ou par code). Icônes : `icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png` (tirées de `icon.svg`).
- `CAHIER-DES-CHARGES.md` : les choix de départ validés avec Aurélien.
- `recherche/` : inventaire de 74 sophismes et comparaison des méthodes de classement (`TRI-DES-SOPHISMES.md`,
  `inventaire-sophismes.xlsx`, régénéré par `python construire_classeur.py` à partir de `inventaire.py`).
- `prototype-arbre/` : prototype de l'arbre de compétences (ouvrir `/prototype-arbre/` dans l'aperçu). Après une
  modification de `recherche/inventaire.py`, relancer `python recherche/exporter_arbre.py`. Progression : clé
  `grimoire-arbre-proto`.

- `js/phrases-*.js` : phrases ajoutées pour l'arbre (une par branche, plus `phrases-pistes.js`). Les phrases correctes
  portent `v`, la vérité probable de leur conclusion : 4 démontré · 3 très probable · 2 probable · 1 simple piste.
  Au moins la moitié des phrases doivent être correctes (consigne d'Aurélien).

Ajouter un exercice : une ligne dans `EXERCICES` (`f` = id du sophisme, ou `null` + `s` pour un argument correct).
Personnages politiques fictifs, camps variés, aucune fausse citation attribuée à une personne réelle.

En ligne : https://manceau-aurelien.github.io/grimoire-sophismes/ (republier seulement sur demande d'Aurélien).
Après un changement de fichier JS ou CSS, augmenter son `?v=` dans `index.html` et `sw.js`, et le nom du cache dans `sw.js`.

Lancer en local : `python -m http.server 8649 --directory Grimoire-Sophismes` depuis le dossier parent.
