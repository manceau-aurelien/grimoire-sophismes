# Inventaire des sophismes : une ligne par sophisme, champs séparés par « | ».
# id | nom | autres noms | exemple | dans l'appli (1/0) | parent | où ça casse | famille (arbre proposé)
#    | matière (avec quoi on triche) | niveau de preuve (1-4, branche « pas assez ») | manuel classique (d'après Copi)
#    | fréquence (1 rare - 3 partout) | difficulté (1 facile - 3 subtil) | hésitation (autre place possible)
#
# Où ça casse : Départ = ce qu'on avance est faux ou caché ;
#   Ne suit pas = le « donc » est invalide ; Pas assez = preuves trop faibles ; Autre chose = preuves hors sujet ;
#   Échange = on triche avec la discussion, pas avec l'argument.
# Niveau de preuve : 1 un seul cas · 2 quelques cas · 3 beaucoup de cas mal choisis · 4 beaucoup de cas bien choisis
#   mais lien de cause non prouvé (5 serait une preuve solide : ce n'est plus un sophisme).

DONNEES = """
faux-dilemme|Faux dilemme|faux choix|« Soit on interdit les trottinettes, soit on accepte des morts chaque semaine. »|1||Départ|Présupposés cachés|Présupposés||Présomption|3|1|
petition|Pétition de principe|raisonnement circulaire|« Ce journal dit toujours vrai : c'est écrit dans sa charte. »|1||Départ|Présupposés cachés|Présupposés||Présomption|2|3|Ne suit pas (la conclusion est déjà dans la prémisse)
question-piege|Question piège|question complexe|« Avez-vous arrêté de tricher aux examens ? »|1||Départ|Présupposés cachés|Présupposés||Présomption|2|1|Échange (piège tendu à l'autre)
juste-milieu|Faux compromis|juste milieu, appel à la modération|« L'un dit 4, l'autre dit 6 : la vérité doit être 5. »|1||Départ|Présupposés cachés|Présupposés||Présomption|2|2|Échange (dans l'appli : terrain truqué)
nirvana|Solution parfaite|sophisme du nirvana|« La ceinture n'empêche pas toutes les morts, donc elle ne sert à rien. »|0||Départ|Présupposés cachés|Présupposés||Présomption|2|2|
accident|Règle sans exception|sophisme de l'accident|« Mentir est mal : il ne fallait pas mentir à l'homme armé qui cherchait ton ami. »|0||Départ|Présupposés cachés|Présupposés||Présomption|1|3|
affirmation-gratuite|Affirmation gratuite|« c'est un fait », preuve par affirmation|« Les jeunes ne lisent plus, c'est un fait. »|0||Départ|Affirmations sans preuve|Présupposés||Présomption|3|1|
bon-sens|Appel au bon sens|appel à l'évidence|« C'est du bon sens : un pays se gère comme un ménage. »|0|affirmation-gratuite|Départ|Affirmations sans preuve|Présupposés||Présomption|3|2|Autre chose (proche de la popularité)
langage-charge|Langage chargé|mots piégés|« Ces engins de mort doivent disparaître de nos trottoirs. »|1||Départ|Mots piégés|Mots||Ambiguïté|3|1|
euphemisme|Euphémisme trompeur|double langage|« Il n'y a pas de licenciements, seulement un plan de sauvegarde de l'emploi. »|0|langage-charge|Départ|Mots piégés|Mots||Ambiguïté|3|2|
definition-persuasive|Définition persuasive||« Un vrai ami, c'est quelqu'un qui vous prête de l'argent sans poser de questions. »|0||Départ|Mots piégés|Mots||Ambiguïté|2|3|Échange (proche du vrai Écossais)
non-sequitur|Non sequitur|ça ne suit pas|« Il a beaucoup plu cette année, donc les impôts vont baisser. »|1||Ne suit pas|Logique pure|Logique||Formel|2|2|Toutes (c'est le nom générique de l'erreur de lien)
affirmation-consequent|Affirmation du conséquent||« S'il a la grippe, il a de la fièvre. Il a de la fièvre, donc il a la grippe. »|1|non-sequitur|Ne suit pas|Logique pure|Logique||Formel|2|3|
negation-antecedent|Négation de l'antécédent||« S'il pleut, la route est mouillée. Il ne pleut pas, donc la route est sèche. »|1|non-sequitur|Ne suit pas|Logique pure|Logique||Formel|1|3|
moyen-terme|Moyen terme non distribué|syllogisme bancal|« Les chats ont quatre pattes, mon chien a quatre pattes, donc mon chien est un chat. »|0|non-sequitur|Ne suit pas|Logique pure|Logique||Formel|2|2|
sophisme-sophisme|Sophisme du sophisme|argument du raisonnement fautif|« Ton argument est bancal, donc ta conclusion est fausse. »|0|non-sequitur|Ne suit pas|Logique pure|Logique||Formel|2|3|Échange
composition|Composition||« Chaque joueur est excellent, donc l'équipe sera excellente. »|1||Ne suit pas|Le tout et les parties|Ressemblances et catégories||Ambiguïté|2|2|
division|Division||« Cette entreprise est riche, donc chacun de ses employés est riche. »|1||Ne suit pas|Le tout et les parties|Ressemblances et catégories||Ambiguïté|2|2|
joueur|Sophisme du joueur|erreur du parieur|« Le rouge est sorti six fois : le noir va forcément tomber. »|0||Ne suit pas|Probabilités|Hasard et chiffres||Présomption|2|2|Départ (fausse croyance : le hasard compenserait)
conjonction|Sophisme de la conjonction|effet « Linda »|« Il est plus probable que Léa soit banquière et militante que simplement banquière. »|0||Ne suit pas|Probabilités|Hasard et chiffres||Formel|1|3|
frequence-base|Oubli de la fréquence de base|négligence du taux de base|« Le test est fiable à 99 % et il est positif : je suis malade à 99 %. »|0||Ne suit pas|Probabilités|Hasard et chiffres||Induction défectueuse|2|3|
procureur|Sophisme du procureur||« Un innocent n'a qu'une chance sur un million d'avoir cet ADN : il est donc coupable à 99,9999 %. »|0|frequence-base|Ne suit pas|Probabilités|Hasard et chiffres||Induction défectueuse|1|3|
equivoque|Équivoque|double sens|« La fin d'une chose est sa perfection ; la mort est la fin de la vie ; donc la mort est sa perfection. »|1||Ne suit pas|Double sens|Mots||Ambiguïté|2|2|
amphibologie|Amphibologie|phrase à double lecture|« "Interdit aux chiens et aux enfants non accompagnés" : mon chien est accompagné, il peut entrer. »|0|equivoque|Ne suit pas|Double sens|Mots||Ambiguïté|1|2|
anecdote|Preuve anecdotique|témoignage, « ça a marché pour moi »|« Mon grand-père a fumé toute sa vie et il a vécu jusqu'à 95 ans. »|1|generalisation|Pas assez|Échantillons|Échantillons|1|Induction défectueuse|3|1|
generalisation|Généralisation hâtive|petit échantillon|« J'ai croisé trois Lyonnais pressés : les Lyonnais sont pressés. »|1||Pas assez|Échantillons|Échantillons|2|Induction défectueuse|3|1|
echantillon-biaise|Échantillon biaisé|sondage non représentatif|« Sondage sur notre site : 92 % de nos clients nous adorent. »|0|generalisation|Pas assez|Échantillons|Échantillons|3|Induction défectueuse|3|2|
survivant|Biais du survivant||« Les vieilles maisons étaient mieux construites : regardez, elles tiennent encore. »|0|echantillon-biaise|Pas assez|Échantillons|Échantillons|3|Induction défectueuse|2|2|
cueillette|Cueillette de cerises|données triées sur le volet|« Voici les trois études qui nous donnent raison. » (en taisant les vingt autres)|1||Pas assez|Échantillons|Échantillons|3|Présomption|3|2|
tireur-elite|Tireur d'élite texan|cible dessinée après coup|« Ce voyant avait prédit trois événements de l'année ! » (on oublie ses cent prédictions ratées)|0|cueillette|Pas assez|Échantillons|Échantillons|3|Induction défectueuse|2|3|
extrapolation|Extrapolation abusive||« Les ventes ont doublé en deux mois : dans un an, nous serons millionnaires. »|0|generalisation|Pas assez|Échantillons|Hasard et chiffres|3|Induction défectueuse|2|2|
denominateur|Oubli du dénominateur|chiffre sans point de comparaison|« 500 accidents de vélo cette année ! » (sur combien de cyclistes ?)|0||Pas assez|Échantillons|Hasard et chiffres|3|Induction défectueuse|3|2|
fausse-cause|Fausse cause||« Depuis qu'il porte ce porte-bonheur, il gagne : c'est grâce à lui. »|1||Pas assez|Causes|Causes|2|Induction défectueuse|3|1|
post-hoc|Post hoc|après, donc à cause de|« J'ai pris ce sirop et mon rhume est parti en une semaine. »|1|fausse-cause|Pas assez|Causes|Causes|1|Induction défectueuse|3|1|
cause-unique|Cause unique|simplification causale|« L'échec scolaire, c'est la faute des écrans, point. »|0|fausse-cause|Pas assez|Causes|Causes|3|Induction défectueuse|3|1|
correlation|Corrélation n'est pas causalité|cum hoc|« Les pays qui mangent le plus de chocolat ont le plus de prix Nobel : mangez du chocolat ! »|1|fausse-cause|Pas assez|Causes|Causes|4|Induction défectueuse|3|2|
confusion|Facteur de confusion oublié|troisième cause cachée|« Les enfants qui prennent un petit-déjeuner réussissent mieux : c'est le petit-déjeuner qui fait réussir. »|0|correlation|Pas assez|Causes|Causes|4|Induction défectueuse|2|3|
inversion|Cause et effet inversés||« Il y a beaucoup de pompiers sur les gros incendies : les pompiers aggravent les incendies. »|0|correlation|Pas assez|Causes|Causes|4|Induction défectueuse|2|2|
regression|Régression vers la moyenne oubliée||« Après sa pire saison, le club a changé d'entraîneur et les résultats sont remontés : c'est grâce à lui. »|0|fausse-cause|Pas assez|Causes|Hasard et chiffres|4|Induction défectueuse|1|3|
pente-glissante|Pente glissante|effet domino|« Si on autorise le jean au bureau, demain ce sera le pyjama. »|1||Pas assez|Causes|Conséquences||Induction défectueuse|3|1|
fausse-analogie|Fausse analogie|analogie boiteuse|« Un salarié, c'est comme un clou : plus on tape dessus, plus il avance. »|1||Pas assez|Preuves de substitution|Ressemblances et catégories||Induction défectueuse|3|2|Départ (dans l'appli : fondations)
ignorance|Argument de l'ignorance|ad ignorantiam|« Personne n'a prouvé que les fantômes n'existent pas, donc ils existent. »|1||Pas assez|Preuves de substitution|Logique||Induction défectueuse|3|2|Échange (renversement de la charge de la preuve)
incredulite|Incrédulité personnelle||« Je ne comprends pas comment un avion aussi lourd peut voler, c'est louche. »|0|ignorance|Pas assez|Preuves de substitution|Personnes||Induction défectueuse|2|2|Autre chose (on parle de soi)
mots-fouines|Sources floues|mots fouines, « des études montrent »|« Des experts s'accordent à dire que ce régime marche. »|0||Pas assez|Preuves de substitution|Mots||Induction défectueuse|3|2|Autre chose (autorité anonyme)
ad-hominem|Ad hominem|attaque personnelle|« Il n'a pas fini ses études, son avis sur l'école ne vaut rien. »|1||Autre chose|Les personnes|Personnes||Pertinence|3|1|
tu-quoque|Tu quoque|« toi aussi »|« Tu me dis d'arrêter de fumer, mais tu fumes ! »|1|ad-hominem|Autre chose|Les personnes|Personnes||Pertinence|3|1|
circonstanciel|Procès d'intention|ad hominem circonstanciel, « à qui profite… »|« Évidemment qu'il défend ce projet : il va en profiter. »|0|ad-hominem|Autre chose|Les personnes|Personnes||Pertinence|3|2|
puits|Empoisonnement du puits||« Avant qu'il parle, rappelez-vous qu'il a déjà menti une fois. »|0|ad-hominem|Autre chose|Les personnes|Personnes||Pertinence|2|2|Échange (on sabote une parole à venir)
association|Culpabilité par association|reductio ad Hitlerum|« Ce dictateur aussi était végétarien. »|0|ad-hominem|Autre chose|Les personnes|Personnes||Pertinence|2|1|
whataboutisme|Whataboutisme|« et vous, alors ? »|« Vous critiquez nos prisons ? Et les vôtres, alors ? »|0|tu-quoque|Autre chose|Les personnes|Personnes||Pertinence|3|2|Échange (diversion, proche du hareng rouge)
autorite|Appel à l'autorité|argument d'autorité|« C'est un prix Nobel de physique qui le dit : ce vaccin est dangereux. »|1||Autre chose|Les personnes|Personnes||Pertinence|3|2|Pas assez (une autorité compétente reste un indice)
popularite|Appel à la popularité|ad populum|« Des millions de gens l'achètent, c'est forcément bien. »|1||Autre chose|La foule et le temps|Le groupe et le temps||Pertinence|3|1|
tradition|Appel à la tradition||« On a toujours fait comme ça. »|1||Autre chose|La foule et le temps|Le groupe et le temps||Pertinence|3|1|
nouveaute|Appel à la nouveauté||« C'est la toute dernière version, donc c'est mieux. »|0||Autre chose|La foule et le temps|Le groupe et le temps||Pertinence|3|1|
nature|Appel à la nature||« C'est naturel, donc c'est sans danger. »|1||Autre chose|La foule et le temps|Le groupe et le temps||Pertinence|3|1|
genetique|Sophisme génétique|argument de l'origine|« Cette idée vient d'un pays voisin, elle ne peut pas marcher chez nous. »|1||Autre chose|La foule et le temps|Le groupe et le temps||Pertinence|2|2|
emotion|Appel à l'émotion||« Pensez aux enfants ! »|1||Autre chose|Les émotions|Émotions||Pertinence|3|1|
peur|Appel à la peur||« Votez pour moi, ou ce sera le chaos. »|1|emotion|Autre chose|Les émotions|Émotions||Pertinence|3|1|
pitie|Appel à la pitié||« Mettez-moi la moyenne, j'ai eu une année si difficile. »|1|emotion|Autre chose|Les émotions|Émotions||Pertinence|2|1|
flatterie|Appel à la flatterie||« Quelqu'un d'aussi intelligent que vous verra que j'ai raison. »|0|emotion|Autre chose|Les émotions|Émotions||Pertinence|2|1|
ridicule|Appel au ridicule||« Et pourquoi pas des licornes, tant qu'on y est ? »|0|emotion|Autre chose|Les émotions|Émotions||Pertinence|3|1|Échange (on moque au lieu de répondre)
force|Appel à la force|menace, ad baculum|« Signez cette pétition, ou vous verrez à la prochaine réunion. »|0|emotion|Autre chose|Les émotions|Émotions||Pertinence|2|1|
consequences|Appel aux conséquences||« Ça ne peut pas être vrai, sinon ce serait trop triste. »|0||Autre chose|Les conséquences|Conséquences||Pertinence|2|2|
desir|Pensée désirante|prendre ses désirs pour des réalités|« Ce projet va réussir, parce qu'il le faut. »|0|consequences|Autre chose|Les conséquences|Conséquences||Pertinence|3|1|
cout-irrecuperable|Coût irrécupérable|« on a trop investi pour arrêter »|« On a déjà mis deux millions, on ne peut plus abandonner. »|0||Autre chose|Les conséquences|Conséquences||Pertinence|3|2|
homme-de-paille|Homme de paille||« Tu veux moins de voitures en ville ? Donc tu veux interdire aux gens de se déplacer ! »|1||Échange|Déformer|Conduite du débat||Pertinence|3|1|
citation|Citation hors contexte||« Il a dit "la guerre est utile". » (la phrase entière : « croire que la guerre est utile est une erreur »)|0|homme-de-paille|Échange|Déformer|Mots||Ambiguïté|2|2|
hareng|Hareng rouge|diversion|« Le budget dérape ? Parlons plutôt du succès de la fête de la ville. »|1||Échange|Esquiver|Conduite du débat||Pertinence|3|1|Autre chose
mitraillage|Mitraillage d'arguments|gish gallop|« Et les chiffres de 2019, et l'étude canadienne, et la météo, et… » (trop d'affirmations pour les réfuter toutes)|1||Échange|Esquiver|Conduite du débat||Hors manuel|2|2|
repetition|Argument par répétition|ad nauseam|« Je le répète depuis dix ans : cette réforme est un échec. »|0||Échange|Esquiver|Conduite du débat||Hors manuel|3|1|Départ (affirmation gratuite répétée)
charge-preuve|Renversement de la charge de la preuve||« Prouve-moi que mon remède ne marche pas ! »|1||Échange|Changer les règles|Conduite du débat||Induction défectueuse|3|2|Pas assez (argument de l'ignorance)
buts|Déplacement des buts||« D'accord, ça a baissé de 10 %… mais il fallait 20 %. »|1||Échange|Changer les règles|Conduite du débat||Hors manuel|3|2|
ecossais|Vrai Écossais|appel à la pureté|« Aucun vrai sportif ne fume. — Marc fume. — Alors ce n'est pas un vrai sportif. »|1|buts|Échange|Changer les règles|Mots||Hors manuel|2|2|Départ (définition persuasive)
faux-equilibre|Faux équilibre|fausse balance|Un débat télévisé oppose un climatologue et un climatosceptique, présentés comme à égalité.|0|juste-milieu|Échange|Changer les règles|Conduite du débat||Hors manuel|2|3|Départ (faux compromis)
"""

CHAMPS = ['id', 'nom', 'alias', 'exemple', 'appli', 'parent', 'ou', 'famille', 'matiere', 'preuve', 'manuel', 'freq', 'diff', 'hesite']


def charger():
    lignes = []
    for l in DONNEES.strip().splitlines():
        v = l.split('|')
        assert len(v) == len(CHAMPS), (len(v), l)
        d = dict(zip(CHAMPS, v))
        d['appli'] = d['appli'] == '1'
        d['preuve'] = int(d['preuve']) if d['preuve'] else None
        d['freq'], d['diff'] = int(d['freq']), int(d['diff'])
        lignes.append(d)
    ids = {d['id'] for d in lignes}
    assert len(ids) == len(lignes), 'id en double'
    for d in lignes:
        assert not d['parent'] or d['parent'] in ids, d['parent']
    return lignes
