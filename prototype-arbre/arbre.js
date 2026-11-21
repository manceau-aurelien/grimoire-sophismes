// L'Arbre des Sophismes — prototype d'arbre de compétences.
// Chaque branche s'ouvre sur son sophisme le plus caricatural ; le maîtriser divise la branche en familles,
// et chaque famille se dévoile un sophisme à la fois, du plus simple au plus subtil (ou du moins au plus robuste).
// Structure issue de ../recherche/TRI-DES-SOPHISMES.md ; contenu dans inventaire-data.js et ../js/exercices.js.

const BRANCHES = [
  { nom: 'Le départ', sous: "Ce qu'on avance est faux ou caché", q: 'Est-ce vrai ? Est-ce tout ?', coul: '#c9852b', entree: 'faux-dilemme', familles: [
    { nom: 'Présupposés cachés', ch: ['question-piege', 'juste-milieu', 'nirvana', 'petition', 'accident'] },
    { nom: 'Affirmations sans preuve', ch: ['affirmation-gratuite', 'bon-sens'] },
    { nom: 'Mots piégés', ch: ['langage-charge', 'euphemisme', 'definition-persuasive'] }] },
  { nom: 'Ça ne suit pas', tronc: 'lien', q: 'Même si tout est vrai, est-ce que ça découle ?', coul: '#4f86c0', entree: 'non-sequitur', familles: [
    { nom: 'Logique pure', ch: ['moyen-terme', 'affirmation-consequent', 'negation-antecedent', 'sophisme-sophisme'] },
    { nom: 'Le tout et les parties', ch: ['composition', 'division'] },
    { nom: 'Probabilités', ch: ['joueur', 'frequence-base', 'conjonction', 'procureur'] },
    { nom: 'Double sens', ch: ['equivoque', 'amphibologie'] }] },
  { nom: 'Pas assez de preuves', tronc: 'lien', q: 'Est-ce assez pour conclure ?', coul: '#5f9a4a', entree: 'anecdote', familles: [
    { nom: 'Échantillons', ch: ['generalisation', 'echantillon-biaise', 'cueillette', 'survivant', 'extrapolation', 'denominateur', 'tireur-elite'] },
    { nom: 'Causes', ch: ['post-hoc', 'fausse-cause', 'pente-glissante', 'cause-unique', 'correlation', 'inversion', 'confusion', 'regression'] },
    { nom: 'Preuves de substitution', ch: ['fausse-analogie', 'ignorance', 'incredulite', 'mots-fouines'] }] },
  { nom: "Ça parle d'autre chose", tronc: 'lien', q: 'Est-ce que ça parle du sujet ?', coul: '#c0503f', entree: 'ad-hominem', familles: [
    { nom: 'Les personnes', ch: ['tu-quoque', 'association', 'circonstanciel', 'whataboutisme', 'puits', 'autorite'] },
    { nom: 'La foule et le temps', ch: ['popularite', 'tradition', 'nouveaute', 'nature', 'genetique'] },
    { nom: 'Les émotions', ch: ['emotion', 'peur', 'pitie', 'flatterie', 'ridicule', 'force'] },
    { nom: 'Les conséquences', ch: ['desir', 'consequences', 'cout-irrecuperable'] }] },
  { nom: "L'échange", sous: 'On triche avec la discussion', q: "Répond-on vraiment à l'autre ?", coul: '#9466b8', entree: 'homme-de-paille', familles: [
    { nom: 'Déformer', ch: ['citation'] },
    { nom: 'Esquiver', ch: ['hareng', 'repetition', 'mitraillage'] },
    { nom: 'Changer les règles', ch: ['charge-preuve', 'buts', 'ecossais', 'faux-equilibre'] }] },
];
const REQUIS = 3;                       // sceaux pour maîtriser un sophisme
const CLE = 'grimoire-arbre-proto';
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hasard = a => a[Math.floor(Math.random() * a.length)];
const melange = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ───────────── construction des nœuds
const N = {};          // id -> nœud
const CW = 165, BG = 70, ETROIT = 240, PAS = 118, PREMIER = 195;
BRANCHES.forEach((b, bi) => {
  N[b.entree] = { id: b.entree, b: bi, fam: -1, k: -1, prev: null, suiv: [], y: 0 };
  b.familles.forEach((f, fi) => f.ch.forEach((id, k) => {
    const prev = k === 0 ? b.entree : f.ch[k - 1];
    N[id] = { id, b: bi, fam: fi, k, prev, suiv: [], y: -PREMIER - k * PAS };
    N[prev].suiv.push(id);
  }));
});
const lien = BRANCHES.filter(b => b.tronc === 'lien');
let RACINE, FOURCHE, FOURCHE_LIEN;
// L'arbre s'élargit en grandissant : une branche pas encore divisée n'occupe qu'une colonne.
const divisee = b => toutVoir || maitrise(b.entree);
function disposer() {
  let x = 0;
  BRANCHES.forEach(b => {
    if (divisee(b)) { b.familles.forEach(f => { f.x = x + CW / 2; x += CW; }); b.x = b.familles.reduce((s, f) => s + f.x, 0) / b.familles.length; }
    else { b.x = x + ETROIT / 2; b.familles.forEach(f => f.x = b.x); x += ETROIT; }
    x += BG;
    N[b.entree].x = b.x;
    b.familles.forEach(f => f.ch.forEach(id => N[id].x = f.x));
  });
  const cx = (x - BG) / 2, lx = lien.reduce((s, b) => s + b.x, 0) / lien.length;
  RACINE = { x: cx, y: 380 }; FOURCHE = { x: cx, y: 270 }; FOURCHE_LIEN = { x: lx, y: 170 };
}
(() => {   // contrôle : chaque sophisme de l'inventaire est placé une fois
  const ids = Object.keys(N), inv = Object.keys(INVENTAIRE);
  const manque = inv.filter(i => !N[i]), inconnu = ids.filter(i => !INVENTAIRE[i]);
  if (manque.length || inconnu.length || ids.length !== inv.length) console.error('Arbre incomplet', { manque, inconnu });
})();

// ───────────── progression
let S = { sceaux: {} };
try { S = JSON.parse(localStorage.getItem(CLE)) || S; } catch (e) { }
const sauver = () => localStorage.setItem(CLE, JSON.stringify(S));
const sceaux = id => S.sceaux[id] || 0;
const maitrise = id => sceaux(id) >= REQUIS;
const ouvert = id => !N[id].prev || maitrise(N[id].prev);
const teaser = id => !ouvert(id) && ouvert(N[id].prev);
let toutVoir = false, choisi = null, focus = null;
const visible = id => ouvert(id) || teaser(id) || toutVoir;
const nomDe = id => INVENTAIRE[id].nom;
const famDe = id => N[id].fam < 0 ? null : BRANCHES[N[id].b].familles[N[id].fam];

// ───────────── dessin
const svg = $('#arbre');
let vusAvant = null;
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) if (attrs[k] !== undefined) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function texte(parent, x, y, cls, t, attrs = {}) { const e = el('text', { x, y, class: cls, ...attrs }, parent); e.textContent = t; return e; }
function lignes(nom, max = 17) {
  const mots = nom.split(' '), l = ['']; mots.forEach(m => { const c = l[l.length - 1]; if (c && (c + ' ' + m).length > max && l.length < 3) l.push(m); else l[l.length - 1] = c ? c + ' ' + m : m; }); return l;
}
function courbe(a, b, larg, cls) {
  const my = (a.y + b.y) / 2;
  return el('path', { d: `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`, class: 'bois ' + cls, 'stroke-width': larg });
}
function rendre() {
  svg.innerHTML = '';
  const gB = el('g', {}, svg), gT = el('g', {}, svg), gN = el('g', {}, svg);
  const neufs = new Set();
  disposer();
  const vus = new Set(Object.keys(N).filter(id => visible(id) && (N[id].fam < 0 || divisee(BRANCHES[N[id].b]))));
  if (vusAvant) vus.forEach(id => { if (!vusAvant.has(id)) neufs.add(id); });
  vusAvant = vus;
  // le tronc et les grosses branches
  el('path', { d: `M${RACINE.x - 46},${RACINE.y + 18} Q${RACINE.x - 18},${RACINE.y - 10} ${RACINE.x - 14},${FOURCHE.y} L${RACINE.x + 14},${FOURCHE.y} Q${RACINE.x + 18},${RACINE.y - 10} ${RACINE.x + 46},${RACINE.y + 18} Z`, fill: '#5a3720', stroke: '#7a4b2a', 'stroke-width': 2 }, gB);
  gB.appendChild(courbe(FOURCHE, { x: BRANCHES[0].x, y: 30 }, 18, 'vif'));
  gB.appendChild(courbe(FOURCHE, { x: BRANCHES[4].x, y: 30 }, 18, 'vif'));
  gB.appendChild(courbe(FOURCHE, FOURCHE_LIEN, 24, 'vif'));
  lien.forEach(b => gB.appendChild(courbe(FOURCHE_LIEN, { x: b.x, y: 30 }, 14, 'vif')));
  texte(gT, FOURCHE_LIEN.x, FOURCHE_LIEN.y + 46, 'tronc-nom', 'LE LIEN');
  texte(gT, RACINE.x, RACINE.y + 56, 'branche-q', "Où l'argument casse-t-il ?", { style: 'font-size:20px' });
  // les branches fines
  Object.values(N).forEach(n => {
    if (!n.prev || !vus.has(n.id)) return;
    const p = N[n.prev], a = { x: p.x, y: p.y - (p.fam < 0 ? 32 : 26) }, b = { x: n.x, y: n.y + 26 };
    const cls = maitrise(n.id) ? 'or' : ouvert(n.id) ? 'vif' : 'pointille';
    const c = courbe(a, b, n.k === 0 ? 7 : 5, cls); if (neufs.has(n.id)) c.classList.add('neuf-trait'); gB.appendChild(c);
  });
  // noms de branches et de familles
  BRANCHES.forEach(b => {
    texte(gT, b.x, 106, 'branche-nom', b.nom, { fill: b.coul });
    texte(gT, b.x, 128, 'branche-q', '« ' + b.q + ' »');
    b.familles.forEach(f => {
      if (!vus.has(f.ch[0]) || !(ouvert(f.ch[0]) || toutVoir)) return;
      lignes(f.nom, 13).forEach((l, i, a) => {
        const t = texte(gT, f.x, -78 - (a.length - 1 - i) * 15, 'famille-nom', l, { fill: b.coul });
        if (neufs.has(f.ch[0])) t.classList.add('neuf');
      });
    });
  });
  // bourgeon : la branche va se diviser
  BRANCHES.forEach(b => {
    if (divisee(b)) return;
    gB.appendChild(courbe({ x: b.x, y: -32 }, { x: b.x, y: -124 }, 5, 'pointille'));
    const g = el('g', { class: 'noeud scelle', 'data-id': b.entree, transform: `translate(${b.x},-150)` }, gN);
    el('circle', { class: 'rond', r: 24 }, g); texte(g, 0, 8, 'sym', '?', { 'text-anchor': 'middle' });
    texte(g, 0, -36, 'famille-nom', b.familles.length + ' familles à découvrir', { fill: b.coul, style: 'font-size:11px' });
  });
  // les nœuds
  Object.values(N).forEach(n => {
    if (!vus.has(n.id)) return;
    const b = BRANCHES[n.b], m = maitrise(n.id), o = ouvert(n.id), t = teaser(n.id);
    const etat = m ? 'maitrise' : o ? 'ouvert' : t ? 'scelle' : 'fantome';
    const g = el('g', { class: `noeud ${etat}${n.fam < 0 ? ' entree' : ''}${choisi === n.id ? ' choisi' : ''}`, 'data-id': n.id, transform: `translate(${n.x},${n.y})` }, gN);
    const gi = el('g', {}, g); if (neufs.has(n.id)) gi.classList.add('neuf');
    const r = n.fam < 0 ? 32 : 26;
    if (choisi === n.id) el('circle', { class: 'halo', r: r + 9 }, gi);
    el('circle', { class: 'rond', r, fill: m ? b.coul : undefined, stroke: o ? (m ? undefined : b.coul) : undefined }, gi);
    if (etat === 'scelle') texte(gi, 0, 8, 'sym', '?', { 'text-anchor': 'middle' });
    if (m) texte(gi, 0, 8, 'sym', '✦', { 'text-anchor': 'middle' });
    if (o && !m) for (let i = 0; i < REQUIS; i++) el('circle', { cx: (i - 1) * 11, cy: 0, r: 4, class: 'sceau ' + (i < sceaux(n.id) ? 'plein' : 'vide') }, gi);
    if (etat !== 'scelle') lignes(nomDe(n.id)).forEach((l, i) => texte(gi, 0, r + 20 + i * 18, 'nom', l));
  });
  const nm = Object.keys(N).filter(maitrise).length, no = Object.keys(N).filter(ouvert).length;
  $('#compteurs').innerHTML = `Maîtrisés <b>${nm}</b> / ${Object.keys(N).length} · Ouverts <b>${no}</b>`;
}

// ───────────── cadrage, zoom, déplacement
let vb = null;
function boite() {
  const ids = Object.keys(N).filter(visible);
  let x0 = Math.min(...ids.map(i => N[i].x), RACINE.x) - 110, x1 = Math.max(...ids.map(i => N[i].x), RACINE.x) + 110;
  let y0 = Math.min(...ids.map(i => N[i].y)) - 70, y1 = RACINE.y + 80;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
function ajuster(b) {   // garde le ratio de l'écran
  const r = svg.clientWidth / Math.max(1, svg.clientHeight);
  if (b.w / b.h > r) { const h = b.w / r; return { x: b.x, y: b.y - (h - b.h) / 2, w: b.w, h }; }
  const w = b.h * r; return { x: b.x - (w - b.w) / 2, y: b.y, w, h: b.h };
}
function poser(v) { vb = v; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`); }
function cadrer(anime = true) {
  const bx = boite(), wmin = svg.clientWidth / 1.25;
  if (bx.w < wmin) { bx.x -= (wmin - bx.w) / 2; bx.w = wmin; }
  let cible = ajuster(bx);
  const ECH_MIN = 0.62;     // sur un petit écran, on ne dézoome pas au point de rendre les noms illisibles
  if (svg.clientWidth < 700 && !toutVoir && svg.clientWidth / cible.w < ECH_MIN) {
    const w = svg.clientWidth / ECH_MIN, h = svg.clientHeight / ECH_MIN, f = focus && N[focus];
    const cx = f ? f.x : bx.x + bx.w / 2, cy = f ? Math.min(f.y, bx.y + bx.h - h / 2) : bx.y + bx.h - h / 2;
    cible = { x: cx - w / 2, y: Math.max(bx.y - 40, cy - h / 2), w, h };
  }
  if (!anime || !vb) return poser(cible);
  const de = { ...vb }, t0 = performance.now();
  const pas = t => { const k = Math.min(1, (t - t0) / 650), e = 1 - Math.pow(1 - k, 3);
    poser({ x: de.x + (cible.x - de.x) * e, y: de.y + (cible.y - de.y) * e, w: de.w + (cible.w - de.w) * e, h: de.h + (cible.h - de.h) * e });
    if (k < 1) requestAnimationFrame(pas); };
  requestAnimationFrame(pas);
}
function versSvg(cx, cy) { const r = svg.getBoundingClientRect(); return { x: vb.x + (cx - r.left) / r.width * vb.w, y: vb.y + (cy - r.top) / r.height * vb.h }; }
function zoomer(f, cx, cy) {
  const r = svg.getBoundingClientRect(); if (cx === undefined) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
  const p = versSvg(cx, cy), w = Math.min(6000, Math.max(260, vb.w * f)), k = w / vb.w;
  poser({ x: p.x - (p.x - vb.x) * k, y: p.y - (p.y - vb.y) * k, w, h: vb.h * k });
}
svg.addEventListener('wheel', e => { e.preventDefault(); zoomer(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
const doigts = new Map(); let bouge = 0, cibleClic = null, ecartAvant = 0;
svg.addEventListener('pointerdown', e => {
  doigts.set(e.pointerId, { x: e.clientX, y: e.clientY }); svg.setPointerCapture(e.pointerId);
  if (doigts.size === 1) { bouge = 0; cibleClic = e.target.closest('.noeud'); }
  if (doigts.size === 2) { const [a, b] = [...doigts.values()]; ecartAvant = Math.hypot(a.x - b.x, a.y - b.y); cibleClic = null; }
});
svg.addEventListener('pointermove', e => {
  if (!doigts.has(e.pointerId)) return;
  const avant = doigts.get(e.pointerId), now = { x: e.clientX, y: e.clientY };
  doigts.set(e.pointerId, now);
  if (doigts.size === 1) {
    const dx = now.x - avant.x, dy = now.y - avant.y; bouge += Math.abs(dx) + Math.abs(dy);
    if (bouge > 6) svg.classList.add('glisse');
    const r = svg.getBoundingClientRect(); poser({ ...vb, x: vb.x - dx / r.width * vb.w, y: vb.y - dy / r.height * vb.h });
  } else if (doigts.size === 2) {
    const [a, b] = [...doigts.values()], ecart = Math.hypot(a.x - b.x, a.y - b.y);
    if (ecartAvant) zoomer(ecartAvant / ecart, (a.x + b.x) / 2, (a.y + b.y) / 2);
    ecartAvant = ecart;
  }
});
const lacher = e => {
  doigts.delete(e.pointerId); svg.classList.remove('glisse');
  if (doigts.size === 0 && bouge < 7 && cibleClic) ouvrirPanneau(cibleClic.dataset.id);
  if (doigts.size === 0 && bouge < 7 && !cibleClic) fermerPanneau();
  cibleClic = null;
};
svg.addEventListener('pointerup', lacher); svg.addEventListener('pointercancel', lacher);
$('#zPlus').onclick = () => zoomer(1 / 1.3); $('#zMoins').onclick = () => zoomer(1.3); $('#zCadre').onclick = () => cadrer();
window.addEventListener('resize', () => cadrer(false));

// ───────────── panneau d'un sophisme
function ouvrirPanneau(id) {
  choisi = id; rendre();
  const n = N[id], b = BRANCHES[n.b], f = famDe(id), inv = INVENTAIRE[id];
  const o = ouvert(id), m = maitrise(id), connu = o || toutVoir;
  const ex = (EXERCICES.find(e => e.f === id) || {}).t || inv.exemple;
  let statut, chemin = '';
  if (m) statut = `✦ Maîtrisé (${REQUIS} sceaux sur ${REQUIS}).`;
  else if (o) statut = `Ouvert : ${'●'.repeat(sceaux(id))}${'○'.repeat(REQUIS - sceaux(id))} — encore ${REQUIS - sceaux(id)} bonne(s) réponse(s) pour le maîtriser.`;
  else statut = `Scellé : maîtrisez « ${ouvert(n.prev) ? nomDe(n.prev) : 'le sophisme précédent'} » pour l'ouvrir.`;
  if (f) chemin = `<p class="chemin">La famille « ${f.nom} », du plus simple au plus subtil :</p><ol>${f.ch.map(c =>
    `<li class="${maitrise(c) ? 'fait' : ''} ${c === id ? 'ici' : ''}">${ouvert(c) || toutVoir ? esc(nomDe(c)) : '???'}${maitrise(c) ? ' ✦' : ''}</li>`).join('')}</ol>`;
  else chemin = `<p class="chemin">Le porte-drapeau de la branche : le cas le plus caricatural. Une fois maîtrisé, la branche se divise en ${b.familles.length} familles :</p><ol>${b.familles.map(x => `<li>${m || toutVoir ? x.nom : '???'}</li>`).join('')}</ol>`;
  $('#panneau').innerHTML = `<button class="fermer" aria-label="Fermer">×</button>
    <span class="etiquette" style="background:${b.coul}">${b.nom}</span>
    <h2>${connu ? esc(inv.nom) : 'Page scellée'}</h2>
    ${connu && inv.alias ? `<p class="alias">Aussi : ${esc(inv.alias)}</p>` : ''}
    <p class="q">« ${b.q} »${f ? `<br>Famille : <b>${f.nom}</b>` : ''}</p>
    ${connu ? `<p class="exemple">${esc(ex)}</p>` : ''}
    <p class="statut">${statut}</p>${chemin}`;
  $('#panneau .fermer').onclick = fermerPanneau;
  $('#panneau').classList.add('ouvert'); $('#panneau').setAttribute('aria-hidden', 'false');
}
function fermerPanneau() {
  if (!$('#panneau').classList.contains('ouvert')) return;
  $('#panneau').classList.remove('ouvert'); $('#panneau').setAttribute('aria-hidden', 'true'); choisi = null; rendre();
}

// ───────────── l'algorithme d'entraînement : il puise dans ce qui est ouvert
let dernier = null, dernierTexte = null;
function proposer(seulementNonMaitrises = false) {
  const c = Object.keys(N).filter(id => ouvert(id) && (!seulementNonMaitrises || !maitrise(id)));
  const pool = c.length > 1 ? c.filter(id => id !== dernier) : c;
  if (!pool.length) return null;
  const poids = pool.map(id => maitrise(id) ? 1 : 4);     // surtout ce qui n'est pas encore maîtrisé, un peu de révision
  let r = Math.random() * poids.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { r -= poids[i]; if (r <= 0) return pool[i]; }
  return pool[pool.length - 1];
}
// Toutes les phrases : celles de l'appli (../js/exercices.js) et celles ajoutées (../js/phrases-*.js).
const PHR = [...EXERCICES, ...(window.PHRASES || [])];
// Vérité probable des phrases correctes : un argument sans sophisme n'est pas forcément certain.
const VERITE = {
  4: { nom: 'Démontré', def: 'La conclusion découle de faits établis : déduction valide ou preuves massives.' },
  3: { nom: 'Très probable', def: 'Des preuves solides et convergentes : études, mesures, consensus des spécialistes.' },
  2: { nom: 'Probable', def: 'Un bon indice, mais limité : on pourrait encore se tromper.' },
  1: { nom: 'Simple piste', def: "Le raisonnement est honnête, mais il ne fait que suggérer : c'est à vérifier." },
};
function questionsDe(id) {     // phrases fautives de ce sophisme (l'exemple de l'inventaire complète s'il en manque)
  const q = PHR.filter(e => e.f === id).map(e => ({ f: id, t: e.t, x: e.x }));
  if (q.length < 3 && !q.some(e => e.t === INVENTAIRE[id].exemple)) q.push({ f: id, t: INVENTAIRE[id].exemple, x: '' });
  return q;
}
const sosiesDe = id => PHR.filter(e => !e.f && e.s === id).map(e => ({ f: null, s: id, v: e.v, t: e.t, x: e.x }));
function choixPour(id) {
  const autres = Object.keys(N).filter(i => i !== id && ouvert(i));
  const memeBranche = melange(autres.filter(i => N[i].b === N[id].b)), ailleurs = melange(autres.filter(i => N[i].b !== N[id].b));
  return melange([id, ...[...memeBranche, ...ailleurs].slice(0, 3)]);   // les voisins de branche d'abord : c'est là que ça se corse
}
function debloques(id) { return N[id].suiv; }
function messageDeblocage(id) {
  const n = N[id], b = BRANCHES[n.b], s = debloques(id);
  if (n.fam < 0) return `La branche « ${b.nom} » se divise : ${b.familles.map(f => '<b>' + f.nom + '</b>').join(', ')}.`;
  const f = famDe(id);
  if (s.length) return `Nouveau sophisme dans « ${f.nom} » : <b>${esc(nomDe(s[0]))}</b>.`;
  return `Famille « ${f.nom} » entièrement maîtrisée !`;
}
let aRecadrer = false;
// Un sceau se gagne par une bonne réponse et se perd par une erreur : répondre au hasard
// (ou toujours « pas de sophisme ») ne fait donc pas progresser.
function changerSceau(id, d) {
  if (maitrise(id) || !ouvert(id)) return '';
  const avant = sceaux(id); S.sceaux[id] = Math.max(0, Math.min(REQUIS, avant + d)); sauver();
  $('#carte .sceaux').textContent = '●'.repeat(sceaux(id)) + '○'.repeat(Math.max(0, REQUIS - sceaux(id)));
  if (d < 0) return avant > 0 ? `<div class="perte">−1 sceau pour « ${esc(nomDe(id))} ».</div>` : '';
  if (maitrise(id)) {
    aRecadrer = true; focus = id; $('#mFermer').classList.add('principal'); $('#mSuite').classList.remove('principal');
    return `<div class="deblocage">✦ <b>${esc(nomDe(id))}</b> est maîtrisé. ${messageDeblocage(id)}</div>`;
  }
  return '';
}
function entrainer() {
  const id = proposer(); if (!id) return;
  dernier = id;
  // une fois sur deux, une phrase correcte qui ressemble à ce sophisme
  const sosies = sosiesDe(id).filter(x => x.t !== dernierTexte), fautives = questionsDe(id).filter(x => x.t !== dernierTexte);
  const correcte = sosies.length > 0 && (Math.random() < 0.5 || !fautives.length);
  const q = correcte ? hasard(sosies) : hasard(fautives.length ? fautives : questionsDe(id));
  dernierTexte = q.t;
  const opts = choixPour(id), b = BRANCHES[N[id].b];
  $('#carte').innerHTML = `<div class="entete"><span>Sophisme ou pas ? Si oui, lequel ?</span><span class="sceaux" title="Sceaux de « ${esc(nomDe(id))} »">${'●'.repeat(sceaux(id))}${'○'.repeat(Math.max(0, REQUIS - sceaux(id)))}</span></div>
    <div class="enonce">${esc(q.t)}</div>
    <div class="choix">${opts.map(o => `<button data-id="${o}"><span class="pt" style="background:${BRANCHES[N[o].b].coul}"></span>${esc(nomDe(o))}</button>`).join('')}
      <button data-id="aucun" class="aucun">✓ Pas de sophisme</button></div>
    <div class="verdict"></div><div class="niveau"></div>
    <div class="bas"><button id="mFermer">Voir l'arbre</button><button id="mSuite" class="principal cache">Question suivante ›</button></div>`;
  $('#modale').classList.remove('cache');
  $('#mFermer').onclick = fermerModale;
  $('#mSuite').onclick = entrainer;
  $('#carte .choix').onclick = e => {
    const bt = e.target.closest('button'); if (!bt || bt.disabled) return;
    $('#carte .choix').querySelectorAll('button').forEach(x => x.disabled = true);
    const bon = q.f ? id : 'aucun', juste = bt.dataset.id === bon;
    bt.classList.add(juste ? 'bonne' : 'mauvaise');
    if (!juste) $(`#carte .choix [data-id="${bon}"]`).classList.add('bonne');
    const f = famDe(id), rappel = `<br><small>Branche « ${b.nom} » : ${b.q}${f ? ` — famille « ${f.nom} »` : ''}</small>`;
    if (q.f) {   // phrase fautive
      $('#carte .verdict').innerHTML = (juste ? '✔ <b>Juste !</b> ' : `✘ <b>Non :</b> c'était <b>${esc(nomDe(id))}</b>. `) + (q.x ? esc(q.x) : '') + rappel + changerSceau(id, juste ? 1 : -1);
      $('#mSuite').classList.remove('cache');
      return;
    }
    if (!juste) {   // phrase correcte prise pour un sophisme
      $('#carte .verdict').innerHTML = `✘ <b>Non : il n'y a pas de sophisme ici.</b> La phrase ressemble à « ${esc(nomDe(id))} », mais : ${esc(q.x.replace(/^(Pas de sophisme|Pas de piège|Correct)\s*:\s*/, ''))}`
        + `<br><small>Vérité probable de la conclusion : <b>${VERITE[q.v].nom}</b> — ${VERITE[q.v].def}</small>` + changerSceau(id, -1);
      $('#mSuite').classList.remove('cache');
      return;
    }
    // bonne réponse : à quel point la conclusion est-elle sûre ?
    $('#carte .verdict').innerHTML = `✔ <b>Juste, pas de sophisme.</b> Mais sans sophisme ne veut pas dire certain : <b>à quel point la conclusion est-elle sûre ?</b>`;
    $('#carte .niveau').innerHTML = `<div class="echelle">${[4, 3, 2, 1].map(v => `<button data-v="${v}"><b>${VERITE[v].nom}</b><span>${VERITE[v].def}</span></button>`).join('')}</div>`;
    $('#carte .echelle').onclick = ev => {
      const bv = ev.target.closest('button'); if (!bv || bv.disabled) return;
      $('#carte .echelle').querySelectorAll('button').forEach(x => x.disabled = true);
      const ecart = Math.abs(+bv.dataset.v - q.v);
      bv.classList.add(ecart === 0 ? 'bonne' : ecart === 1 ? 'presque' : 'mauvaise');
      if (ecart) $(`#carte .echelle [data-v="${q.v}"]`).classList.add('bonne');
      const mot = ecart === 0 ? '✔ <b>Exactement.</b>' : ecart === 1 ? `≈ <b>Presque :</b> plutôt « ${VERITE[q.v].nom} ».` : `✘ <b>Plutôt « ${VERITE[q.v].nom} ».</b>`;
      $('#carte .niveau').insertAdjacentHTML('beforeend', `<p class="verdict">${mot} ${esc(q.x)}</p>` + changerSceau(id, 1));
      $('#mSuite').classList.remove('cache');
    };
  };
}
function fermerModale() {
  $('#modale').classList.add('cache'); $('#mFermer') && $('#mFermer').classList.remove('principal');
  rendre(); if (aRecadrer) { cadrer(); aRecadrer = false; }
}
function toast(html) { const z = $('#toasts'); while (z.children.length >= 3) z.firstChild.remove(); const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 4600); }

$('#btnEntr').onclick = entrainer;
$('#btnDemo').onclick = () => {
  const id = proposer(true); if (!id) return toast("Tout l'arbre est maîtrisé !");
  S.sceaux[id] = REQUIS; sauver(); focus = id; rendre(); cadrer();
  toast(`✦ <b>${esc(nomDe(id))}</b> maîtrisé. ${messageDeblocage(id)}`);
};
$('#btnTout').onclick = () => { toutVoir = !toutVoir; $('#btnTout').setAttribute('aria-pressed', toutVoir); rendre(); cadrer(); if (choisi) ouvrirPanneau(choisi); };
let razArmee = null;
$('#btnRaz').onclick = () => {
  if (!razArmee) { $('#btnRaz').textContent = 'Sûr ? Cliquer encore'; razArmee = setTimeout(() => { razArmee = null; $('#btnRaz').textContent = 'Recommencer'; }, 3000); return; }
  clearTimeout(razArmee); razArmee = null; $('#btnRaz').textContent = 'Recommencer';
  S = { sceaux: {} }; sauver(); vusAvant = null; fermerPanneau(); rendre(); cadrer();
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#modale').classList.contains('cache')) fermerModale(); else fermerPanneau(); } });

rendre(); cadrer(false);
