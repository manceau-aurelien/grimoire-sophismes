# Le Grimoire des Sophismes — cahier des charges (brouillon v0, 20/11/2026)

Appli web (PC et téléphone, PWA, HTML/JS sans dépendance, sauvegarde locale) pour apprendre au **grand public**
à repérer les sophismes. Deux parties : **l'Entraînement** et **le Grimoire** (un livre ancien qui se remplit).

## 1. L'idée centrale : où l'argument se casse

Un argument, c'est un **pont** : des **fondations** (les prémisses) portent une **arche** (le raisonnement)
qui mène à une **rive** (la conclusion). Le tout se passe sur un **terrain** (le débat) et se dit avec des
**mots**. Un sophisme, c'est un pont qui *a l'air* solide mais qui cède à un endroit précis.
On classe donc les sophismes par **l'endroit où ça casse**, pas par leur sujet. Six chapitres :

| Chapitre (zone du pont) | Question à se poser | Ce qui casse | Exemples |
|---|---|---|---|
| I. **Les Fondations** — prémisses | « Est-ce vrai ? Est-ce tout ? » | une prémisse fausse, cachée ou qui contient déjà la conclusion | faux dilemme, pétition de principe (raisonnement circulaire), question piège, fausse prémisse cachée |
| II. **L'Arche brisée** — la forme logique | « Est-ce que ça découle *forcément* ? » | la structure est invalide, quel que soit le contenu | affirmation du conséquent, négation de l'antécédent, non sequitur, composition / division |
| III. **Le Pont trop court** — suffisance | « Est-ce *assez* pour conclure ? » | les preuves sont pertinentes mais trop faibles | généralisation hâtive, anecdote, cueillette de cerises, post hoc, corrélation ≠ causalité, pente glissante, appel à l'ignorance |
| IV. **Le Pont vers ailleurs** — pertinence | « Est-ce que ça parle *du sujet* ? » | les prémisses ne concernent pas la conclusion | ad hominem, tu quoque, appel à l'autorité non pertinente, à la popularité, à la tradition, à la nature, à la peur, à la pitié, sophisme génétique, hareng rouge |
| V. **Les Mots qui glissent** — langage | « Le mot garde-t-il le même sens ? » | un mot change de sens ou est déformé | équivoque, vrai Écossais (redéfinir pour exclure), mots chargés, fausse précision |
| VI. **Le Terrain truqué** — règles du débat | « Est-ce que l'on répond vraiment à l'autre ? » | on triche avec l'échange lui-même | homme de paille, renversement de la charge de la preuve, déplacement des buts, mitraillage d'arguments, faux compromis (juste milieu) |

Chaque page du Grimoire montre ce petit **schéma du pont** avec la zone qui casse en rouge : c'est la
« représentation mentale » qui se construit page après page.

**Familles et parents** : certains sophismes sont des cas particuliers d'un autre (tu quoque ⊂ ad hominem,
appel à la peur ⊂ appel à l'émotion, post hoc ⊂ fausse cause…). Cet arbre sert au niveau 3 : nommer le parent
au lieu de l'enfant donne « Presque ! C'est bien un ad hominem, plus précisément un tu quoque » (points partiels).

**Nuance importante** : beaucoup de sophismes sont la version abusive d'un raccourci *légitime* (citer un vrai
expert, prévoir une conséquence probable). Chaque leçon dit où passe la frontière, et le niveau 1 contient
des arguments corrects qui *ressemblent* à des sophismes.

## 2. Le Grimoire

- Livre ancien (cuir, parchemin, enluminures, sceaux), tournage de page animé. PC : double page ; téléphone : une page.
- Sommaire = les 6 chapitres et le schéma du pont. Pages verrouillées = silhouette scellée à la cire.
- **En feuilletant** : nom, chapitre, définition en une phrase, un exemple court, la maîtrise (0 à 3 sceaux).
- **En cliquant** : la leçon complète — définition ; exemple de la vie courante ; exemple tiré des médias,
  de la pub ou de la politique ; comment le repérer (la question à se poser) ; comment y répondre ; la
  frontière avec un argument légitime ; mini-quiz.
- Environ **35 sophismes** au lancement.

## 3. L'Entraînement (trois niveaux + débats)

1. **Apprenti** — « Sophisme ou pas ? » (vrai / faux), avec explication après chaque réponse.
2. **Compagnon** — trouver la bonne étiquette parmi 4 (les pièges sont des sophismes voisins).
3. **Maître** — écrire le nom. Tolérant : accents, majuscules, fautes légères, synonymes
   (« attaque personnelle » = ad hominem). Nom du parent = réponse « presque juste » expliquée.
- **Débats** — un échange entre personnages ; cliquer sur la réplique qui contient le sophisme, puis le nommer.
- **Incrémental** : trouver un sophisme pour la première fois **débloque sa page** ; les bonnes réponses
  remplissent sa maîtrise (sceaux) ; les chapitres complets débloquent des enluminures, les niveaux supérieurs
  et des débats plus difficiles. Série de bonnes réponses, « encre » gagnée, rang du lecteur (Apprenti → Maître).

## 4. Exemples et neutralité

- Exemples politiques **variés** (gauche, droite, centre, écologistes, souverainistes, gouvernement, opposition…),
  sans rééquilibrer artificiellement.
- Pas de fausse citation attribuée à une personne réelle : exemples **inventés mais réalistes** (personnages
  fictifs), et exemples réels seulement s'ils sont bien documentés, avec leur source.

## 5. À décider

- Nom : « Le Grimoire des Sophismes » (proposition).
- Plus tard : publication GitHub Pages, voix (Vivienne) pour lire les débats.
