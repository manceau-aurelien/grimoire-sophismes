'use strict';
// Le Grimoire des Sophismes — logique de l'appli (livre, entraînement, débats, progression)

const $ = s => document.querySelector(s);
const melange = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const hasard = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ═════════════════════════════════════════════ sauvegarde et progression
const CLE = 'grimoire-sophismes-v1';
const vierge = () => ({ found: {}, pts: {}, encre: 0, serieMax: 0, rep: 0, justes: 0, debats: {} });
let S = (() => { try { return Object.assign(vierge(), JSON.parse(localStorage.getItem(CLE)) || {}); } catch (e) { return vierge(); } })();
const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {} };

const SEUILS = [2, 7, 15];                       // points pour 1, 2, 3 sceaux
const sceaux = id => SEUILS.filter(v => (S.pts[id] || 0) >= v).length;
const trouve = id => !!S.found[id];
const nbTrouves = () => SOPHISMES.filter(s => trouve(s.id)).length;
const score = () => nbTrouves() + SOPHISMES.reduce((a, s) => a + sceaux(s.id), 0);
const RANGS = [[0, 'Apprenti lecteur'], [5, 'Copiste'], [15, 'Scribe'], [35, 'Érudit'], [70, 'Logicien'], [120, 'Maître du Grimoire']];
const rang = () => RANGS.filter(r => score() >= r[0]).pop()[1];
const MODES = {
  apprenti: { nom: 'Apprenti', ico: '🕯️', desc: "Sophisme ou argument correct ? Chaque sophisme débusqué brise le sceau de sa page.", req: 0 },
  compagnon: { nom: 'Compagnon', ico: '🗝️', desc: "Trouvez la bonne étiquette parmi quatre.", req: 6 },
  maitre: { nom: 'Maître', ico: '🪶', desc: "Écrivez le nom du sophisme. L'orthographe est pardonnée, l'approximation expliquée.", req: 15 },
  debats: { nom: 'Débats', ico: '⚖️', desc: "Dans un vrai échange, cliquez sur la réplique fautive, puis nommez le sophisme.", req: 10 },
};
const PALIERS = { 1: 10, 2: 16, 3: 22 };          // pages trouvées pour ouvrir les débats de chaque palier
const ouvert = m => nbTrouves() >= MODES[m].req;
// Toutes les phrases d'entraînement : exercices.js + phrases-*.js (seulement celles des sophismes du Grimoire).
// Au moins la moitié sont des arguments corrects, pour ne pas s'habituer à voir des sophismes partout.
const TOUTES = [...EXERCICES, ...(window.PHRASES || []).filter(e => SOPH[e.f || e.s])];
// Vérité probable des arguments corrects : sans sophisme ne veut pas dire certain.
const VERITE = {
  4: { nom: 'Démontré', def: 'La conclusion découle de faits établis : déduction valide ou preuves massives.' },
  3: { nom: 'Très probable', def: 'Des preuves solides et convergentes : études, mesures, consensus des spécialistes.' },
  2: { nom: 'Probable', def: 'Un bon indice, mais limité : on pourrait encore se tromper.' },
  1: { nom: 'Simple piste', def: "Le raisonnement est honnête, mais il ne fait que suggérer : c'est à vérifier." },
};

function toast(html) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3300);
}
function majBarre() {
  $('#rang').textContent = rang();
  $('#nbPages').textContent = `📜 ${nbTrouves()}/${SOPHISMES.length}`;
  $('#encre').textContent = `✒️ ${S.encre}`;
}
// Débloque la page d'un sophisme ; renvoie true si c'est une découverte
function decouvrir(id) {
  if (trouve(id)) return false;
  const avant = Object.keys(MODES).filter(ouvert);
  S.found[id] = Date.now();
  toast(`Sceau brisé ! Nouvelle page : <b>${esc(SOPH[id].n)}</b>`);
  for (const m of Object.keys(MODES)) if (ouvert(m) && !avant.includes(m)) setTimeout(() => toast(`Nouvelle épreuve ouverte : <b>${MODES[m].nom}</b>`), 900);
  return true;
}
function gagner(id, pts, encre) {
  const avant = sceaux(id);
  if (id) S.pts[id] = (S.pts[id] || 0) + pts;
  S.encre += encre;
  if (id && sceaux(id) > avant) setTimeout(() => toast(`Nouveau sceau de maîtrise : <b>${esc(SOPH[id].n)}</b> ${'●'.repeat(sceaux(id))}`), 400);
}

// ═════════════════════════════════════════════ le schéma du pont
// zone : fondations | forme | court | ailleurs | mots | terrain | tout (carte annotée) | aucune
function pont(zone, cls = '') {
  const R = '#b3261e', D = '#4a3622', PIERRE = '#a8916d', z = k => zone === k, tout = zone === 'tout';
  let s = `<svg class="pont ${cls}" viewBox="0 0 320 172" role="img" aria-label="Schéma du pont de l'argument">`;
  // VI terrain
  s += `<path d="M0,144 L320,144 L320,172 L0,172Z" fill="${z('terrain') ? R : '#6b5236'}" opacity="${z('terrain') ? .9 : .55}"/>`;
  if (z('terrain')) s += `<path d="M40,150 l12,8 l-6,6 l14,6 M150,146 l-8,10 l10,4 l-6,10 M250,148 l10,6 l-4,8 l12,8" stroke="#f3e6c8" stroke-width="2" fill="none"/>`;
  // rives
  s += `<path d="M0,144 L0,84 L72,84 L84,144Z" fill="#9c8462" stroke="${D}" stroke-width="2"/>`;
  s += `<path d="M320,144 L320,84 L248,84 L236,144Z" fill="#9c8462" stroke="${D}" stroke-width="2"/>`;
  // I piliers (fondations)
  const pc = z('fondations') ? R : PIERRE;
  s += `<rect x="116" y="92" width="16" height="52" fill="${pc}" stroke="${D}" stroke-width="2"/><rect x="188" y="92" width="16" height="52" fill="${pc}" stroke="${D}" stroke-width="2"/>`;
  if (z('fondations')) s += `<path d="M120,100 l8,8 l-6,8 l8,10 M192,104 l8,6 l-8,10 l6,10" stroke="#f3e6c8" stroke-width="2" fill="none"/>`;
  // arche et tablier
  const tablier = (x1, x2, c) => `<rect x="${x1}" y="78" width="${x2 - x1}" height="9" fill="${c}" stroke="${D}" stroke-width="2"/>`;
  if (z('court')) {
    s += `<path d="M72,92 Q130,46 196,84" stroke="${D}" stroke-width="7" fill="none"/>` + tablier(72, 206, R);
    s += `<rect x="208" y="76" width="38" height="13" fill="none" stroke="${R}" stroke-width="2" stroke-dasharray="4 3"/><text x="227" y="72" text-anchor="middle" class="lab">?</text>`;
  } else if (z('ailleurs')) {
    s += `<path d="M72,92 Q160,40 248,92" stroke="${D}" stroke-width="7" fill="none" opacity=".35"/>`;
    s += `<path d="M72,82 L150,82 Q210,80 246,40" stroke="${R}" stroke-width="9" fill="none"/>`;
    s += `<ellipse cx="270" cy="34" rx="38" ry="9" fill="#9c8462" stroke="${R}" stroke-width="2"/><text x="270" y="22" text-anchor="middle" class="lab">autre sujet</text>`;
  } else if (z('forme')) {
    s += `<path d="M72,92 Q110,56 150,50" stroke="${R}" stroke-width="7" fill="none"/><path d="M170,50 Q210,56 248,92" stroke="${R}" stroke-width="7" fill="none"/>`;
    s += tablier(72, 152, PIERRE) + tablier(168, 248, PIERRE);
    s += `<rect x="154" y="100" width="10" height="9" fill="${R}" transform="rotate(25 159 104)"/><rect x="160" y="120" width="8" height="7" fill="${R}" transform="rotate(-20 164 123)"/>`;
  } else {
    s += `<path d="M72,92 Q160,34 248,92" stroke="${D}" stroke-width="7" fill="none"/>` + tablier(72, 248, '#b89c74');
  }
  // drapeau de la conclusion
  s += `<line x1="292" y1="84" x2="292" y2="50" stroke="${D}" stroke-width="3"/><path d="M292,50 L316,57 L292,64Z" fill="#c9a24a" stroke="${D}" stroke-width="1"/>`;
  // V bannière des mots
  const bc = z('mots') ? R : '#c9a24a';
  s += z('mots')
    ? `<path d="M96,10 Q130,0 160,12 T224,10 L224,28 Q192,38 160,28 T96,28Z" fill="${bc}" stroke="${D}" stroke-width="1.5"/><text x="160" y="23" text-anchor="middle" fill="#f3e6c8" style="fill:#f3e6c8">« mots »</text>`
    : `<path d="M100,10 L220,10 L212,19 L220,28 L100,28 L108,19Z" fill="${bc}" stroke="${D}" stroke-width="1.5" opacity="${tout ? 1 : .55}"/><text x="160" y="23" text-anchor="middle">« mots »</text>`;
  if (tout) {
    s += `<ellipse cx="282" cy="30" rx="30" ry="7" fill="none" stroke="${D}" stroke-dasharray="3 3"/>`;
    const L = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" class="lab">${t}</text>`;
    s += L(160, 166, 'VI · terrain') + L(42, 116, 'I · fondations') + `<path d="M82,113 L114,110" stroke="#b3261e" stroke-width="1.2"/>` + L(160, 60, 'II · arche') + L(228, 72, 'III · portée') + L(282, 48, 'IV · ailleurs') + L(94, 23, 'V ·', 'end');
    s += `<text x="36" y="78" text-anchor="middle">prémisses</text><text x="282" y="104" text-anchor="middle">conclusion</text>`;
  }
  return s + '</svg>';
}
const SCEAU_CIRE = `<svg class="cire" viewBox="0 0 100 100"><path d="M50,4 C62,6 66,0 74,8 C82,14 92,14 94,26 C98,36 92,42 96,52 C98,64 90,68 88,78 C84,90 72,88 64,94 C54,100 46,94 36,96 C24,96 20,86 12,80 C4,72 8,62 4,52 C2,40 10,34 10,24 C12,12 24,12 32,6 C40,0 44,4 50,4Z" fill="#8e1b1b"/><circle cx="50" cy="50" r="30" fill="none" stroke="#c44" stroke-width="3" opacity=".7"/><text x="50" y="62" text-anchor="middle" font-family="Cinzel, serif" font-size="34" fill="#e8a0a0" opacity=".9">S</text></svg>`;
const htmlSceaux = id => `<span class="sceaux" title="Maîtrise">${[0, 1, 2].map(i => `<i class="sceau ${i < sceaux(id) ? '' : 'vide'}"></i>`).join('')}</span>`;

// ═════════════════════════════════════════════ navigation entre écrans
let ecran = 'accueil';
function montrer(nom) {
  ecran = nom;
  document.querySelectorAll('.ecran').forEach(e => e.classList.toggle('actif', e.id === 'ecran-' + nom));
  majBarre();
}
function accueil() {
  const n = nbTrouves();
  $('#ecran-accueil').innerHTML = `
    <div class="livre-ferme" id="livreFerme" role="button" aria-label="Ouvrir le grimoire">
      <div class="orne">❦</div><h1>Le Grimoire<br>des Sophismes</h1><small>où l'on apprend à voir<br>les ponts qui cèdent</small><div class="orne">❦</div>
    </div>
    <div class="accueil-btns">
      <button class="btn" id="aLivre">Ouvrir le Grimoire</button>
      <button class="btn" id="aEntr">S'entraîner</button>
    </div>
    <div class="accueil-stats">${n ? `${n} page${n > 1 ? 's' : ''} sur ${SOPHISMES.length} · ${rang()}` : "Toutes les pages sont encore scellées. L'entraînement brisera les sceaux."}</div>
    <div class="accueil-btns outils" id="accueilOutils"></div>`;
  $('#livreFerme').onclick = $('#aLivre').onclick = () => ouvrirLivre();
  $('#aEntr').onclick = entrainement;
  if (typeof majBoutonsAccueil === 'function') majBoutonsAccueil();   // défini dans installation.js
  montrer('accueil');
}

// ═════════════════════════════════════════════ le livre
const PAGES = (() => {
  const p = [{ t: 'titre' }, { t: 'sommaire' }, { t: 'carte' }, { t: 'mode' }];
  for (const c of CHAPITRES) { p.push({ t: 'chap', ch: c.id }); for (const s of SOPHISMES.filter(s => s.ch === c.id)) p.push({ t: 'soph', id: s.id }); }
  p.push({ t: 'fin' });
  if (p.length % 2) p.push({ t: 'blanc' });
  return p;
})();
const indexChap = id => PAGES.findIndex(p => p.t === 'chap' && p.ch === id);
const indexSoph = id => PAGES.findIndex(p => p.t === 'soph' && p.id === id);
let pos = 0, anim = false;
const simple = () => window.matchMedia('(max-width: 820px)').matches;
const pas = () => simple() ? 1 : 2;

function htmlPage(i) {
  const p = PAGES[i]; if (!p) return '';
  const folio = `<div class="folio">${i + 1}</div>`;
  let h = '';
  if (p.t === 'titre') {
    h = `<div class="page-titre"><div class="filet">✦ ✦ ✦</div><h1>Le Grimoire<br>des Sophismes</h1><p><i>Traité pratique des raisonnements qui trompent,<br>à l'usage de ceux qui veulent voir clair.</i></p><div class="filet">❦</div>
      <p>${nbTrouves()} page${nbTrouves() > 1 ? 's' : ''} déchiffrée${nbTrouves() > 1 ? 's' : ''} sur ${SOPHISMES.length}</p><p class="famille">Rang du lecteur : ${rang()}</p></div>`;
  } else if (p.t === 'sommaire') {
    h = `<h2>Sommaire</h2><div class="sommaire"><ul>
      <li data-goto="2"><span class="num">✦</span><span class="nom">La carte du pont</span></li>
      ${CHAPITRES.map(c => { const l = SOPHISMES.filter(s => s.ch === c.id); return `<li data-goto="${indexChap(c.id)}"><span class="num">${c.num}</span><span class="nom">${c.nom}<br><small><i>${c.sous}</i></small></span><span class="compte">${l.filter(s => trouve(s.id)).length}/${l.length}</span></li>`; }).join('')}
      </ul></div>`;
  } else if (p.t === 'carte') {
    h = `<h2>La carte du pont</h2><p class="lettrine">Un argument est un pont. Des <b>prémisses</b> (les piliers) portent un <b>raisonnement</b> (l'arche) jusqu'à une <b>conclusion</b> (l'autre rive). Un sophisme est un pont qui a l'air solide mais qui cède à un endroit précis.</p>
      ${pont('tout', 'grand')}
      <ul class="zones-carte">${CHAPITRES.map(c => `<li data-goto="${indexChap(c.id)}"><b>${c.num}.</b> ${c.nom} — <i>${c.question}</i></li>`).join('')}</ul>`;
  } else if (p.t === 'mode') {
    h = `<h2>Comment lire ce grimoire</h2>
      <p>Chaque sophisme a sa page, scellée à la cire tant qu'il n'a pas été <b>débusqué à l'entraînement</b>.</p>
      <p>En feuilletant, vous lisez une définition rapide. En cliquant sur <b>« Entrer dans la leçon »</b>, vous découvrez la leçon complète : exemples, comment le repérer, comment y répondre, et où passe la frontière avec un argument honnête.</p>
      <p>Chaque bonne réponse remplit les <b>trois sceaux de maîtrise</b> du sophisme ${htmlSceaux('__')}.</p>
      <p>Retenez surtout <b>où le pont casse</b> : c'est la question à se poser qui vous fera reconnaître un sophisme que vous n'avez jamais vu.</p>
      <div class="filet">❦</div><p style="text-align:center"><button class="btn-lecon" data-entr="1">Aller à l'entraînement</button></p>`;
  } else if (p.t === 'chap') {
    const c = CHAP[p.ch], l = SOPHISMES.filter(s => s.ch === c.id);
    h = `<div class="surtitre">Chapitre ${c.num} · ${c.sous}</div><h2>${c.nom}</h2>${pont(c.id)}
      <div class="question">« ${c.question} »</div><p>${c.intro}</p>
      <ul class="liste-soph">${l.map(s => trouve(s.id) ? `<li data-goto="${indexSoph(s.id)}">❧ ${s.n}</li>` : `<li class="scelle" data-goto="${indexSoph(s.id)}">❧ page scellée</li>`).join('')}</ul>`;
  } else if (p.t === 'soph') {
    const s = SOPH[p.id], c = CHAP[s.ch];
    if (!trouve(s.id)) {
      h = `<div class="scelle-page">${SCEAU_CIRE}<h3>Page scellée</h3><p>Chapitre ${c.num} · ${c.nom}</p><p><i>Débusquez ce sophisme à l'entraînement pour briser le sceau.</i></p><p class="famille">Indice : ici, le pont casse au niveau ${c.sous === 'le langage' ? 'des mots' : 'de ' + c.sous}.</p></div>`;
    } else {
      const parent = s.p ? `<p class="famille">Famille : ${trouve(s.p) ? SOPH[s.p].n : 'un sophisme encore scellé'}</p>` : '';
      h = `<div class="surtitre">Chapitre ${c.num} · ${c.nom}</div><h2>${s.n}</h2>${pont(s.ch, 'mini')}
        <p class="lettrine">${s.c}</p><p class="exemple">${s.e}</p>${parent}
        <p>Maîtrise : ${htmlSceaux(s.id)}</p>
        <button class="btn-lecon" data-lecon="${s.id}">Entrer dans la leçon ›</button>`;
    }
  } else if (p.t === 'fin') {
    h = `<div class="page-titre"><div class="filet">❦</div><p><i>Ici s'achève le grimoire.</i></p><p>Un sophisme n'est pas toujours un mensonge : c'est souvent un raccourci qui a l'air d'un pont. Le reconnaître, c'est d'abord se poser la bonne question.</p><div class="filet">✦ ✦ ✦</div></div>`;
  } else h = '<div class="page-blanche"></div>';
  return `<div class="contenu">${h}</div>${p.t !== 'blanc' ? folio : ''}`;
}

function afficherLivre() {
  const L = $('#livre'); L.classList.toggle('simple', simple());
  if (!simple()) pos -= pos % 2;
  $('#pageG').innerHTML = htmlPage(pos);
  $('#pageD').innerHTML = simple() ? '' : htmlPage(pos + 1);
  $('#numPage').textContent = simple() ? `${pos + 1} / ${PAGES.length}` : `${pos + 1}-${pos + 2} / ${PAGES.length}`;
  $('#prec').disabled = pos === 0; $('#suiv').disabled = pos + pas() >= PAGES.length;
}
function ouvrirLivre(i) {
  montrer('livre');
  if (i !== undefined) pos = i;
  afficherLivre();
}
function tourner(dir) {
  if (anim) return;
  const st = pas(), np = pos + dir * st;
  if (np < 0 || np >= PAGES.length) return;
  anim = true;
  const F = $('#feuille'), recto = F.querySelector('.recto'), verso = F.querySelector('.verso');
  F.style.transition = 'none';
  if (st === 2) {
    if (dir > 0) { $('#pageG').innerHTML = htmlPage(pos); $('#pageD').innerHTML = htmlPage(np + 1); recto.innerHTML = htmlPage(pos + 1); verso.innerHTML = htmlPage(np); F.style.transform = 'rotateY(0deg)'; }
    else { $('#pageG').innerHTML = htmlPage(np); $('#pageD').innerHTML = htmlPage(pos + 1); recto.innerHTML = htmlPage(np + 1); verso.innerHTML = htmlPage(pos); F.style.transform = 'rotateY(-180deg)'; }
  } else {
    if (dir > 0) { $('#pageG').innerHTML = htmlPage(np); recto.innerHTML = htmlPage(pos); F.style.transform = 'rotateY(0deg)'; }
    else { $('#pageG').innerHTML = htmlPage(pos); recto.innerHTML = htmlPage(np); F.style.transform = 'rotateY(-180deg)'; }
    verso.innerHTML = '<div class="contenu page-blanche"></div>';
  }
  F.style.display = 'block'; void F.offsetWidth;
  F.style.transition = ''; F.style.transform = dir > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)';
  setTimeout(() => { pos = np; F.style.display = 'none'; anim = false; afficherLivre(); }, 720);
}
function allerA(i) {
  if (simple()) { pos = i; } else { pos = i - (i % 2); }
  afficherLivre();
}

// clics dans le livre
$('#livre').addEventListener('click', e => {
  const t = e.target.closest('[data-goto],[data-lecon],[data-entr]');
  if (!t || anim) return;
  if (t.dataset.lecon) ouvrirLecon(t.dataset.lecon);
  else if (t.dataset.entr) entrainement();
  else allerA(+t.dataset.goto);
});
$('#prec').onclick = () => tourner(-1);
$('#suiv').onclick = () => tourner(1);
$('#versSommaire').onclick = () => allerA(1);
$('#versEntrainement').onclick = () => entrainement();
let tx = null, ty = null;
$('#livre').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
$('#livre').addEventListener('touchend', e => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) tourner(dx < 0 ? 1 : -1);
});
document.addEventListener('keydown', e => {
  if ($('#lecon').classList.contains('ouvert')) { if (e.key === 'Escape') fermerLecon(); return; }
  if (ecran === 'livre') { if (e.key === 'ArrowRight') tourner(1); if (e.key === 'ArrowLeft') tourner(-1); }
});
let largeurAvant = simple();
window.addEventListener('resize', () => { if (simple() !== largeurAvant) { largeurAvant = simple(); if (ecran === 'livre') afficherLivre(); } });

// ═════════════════════════════════════════════ la leçon
function ouvrirLecon(id) {
  const s = SOPH[id], c = CHAP[s.ch];
  const enfants = SOPHISMES.filter(x => x.p === id);
  const famille = (s.p ? `<p>Cas particulier de : <b>${trouve(s.p) ? SOPH[s.p].n : 'un sophisme encore scellé'}</b>.</p>` : '')
    + (enfants.length ? `<p>Cas particuliers : ${enfants.map(x => trouve(x.id) ? `<b>${x.n}</b>` : '<i>page scellée</i>').join(', ')}.</p>` : '');
  // mini-quiz : 2 exemples de ce sophisme, 1 autre sophisme du même chapitre (hors famille), 1 argument correct
  const famille2 = x => x.f === s.p || SOPH[x.f].p === id;
  const siens = melange(TOUTES.filter(x => x.f === id)).slice(0, 2);
  const voisins = TOUTES.filter(x => x.f && x.f !== id && !famille2(x));
  const proches = voisins.filter(x => SOPH[x.f].ch === s.ch);
  const corrects = TOUTES.filter(x => !x.f), corrSiens = corrects.filter(x => x.s === id);
  const quiz = melange([...siens, hasard(proches.length ? proches : voisins), hasard(corrSiens.length ? corrSiens : corrects)]);
  const repQuiz = x => x.f === id ? 'ce' : x.f ? 'autre' : 'aucun';
  $('#leconPapier').innerHTML = `
    <button class="fermer" aria-label="Fermer la leçon">×</button>
    <div class="surtitre">Chapitre ${c.num} · ${c.nom}</div>
    <h2>${s.n}</h2>
    ${s.a.length ? `<p class="famille">Aussi appelé : ${s.a.slice(0, 3).join(', ')}</p>` : ''}
    ${pont(s.ch, 'grand')}
    <div class="question">« ${c.question} »</div>
    <h3>Définition</h3><p class="lettrine">${s.d}</p>
    <h3>Dans la vie courante</h3><p class="exemple">${s.q}</p>
    <h3>Dans les médias, la pub ou la politique</h3><p class="exemple">${s.m}</p>
    <h3>Comment le repérer</h3><p class="encadre">${s.r}</p>
    <h3>Comment y répondre</h3><p>${s.rep}</p>
    <h3>La frontière</h3><p>${s.f}</p>
    ${famille ? `<h3>Sa famille</h3>${famille}` : ''}
    <h3>Mini-quiz</h3><p class="famille">Pour chaque phrase : est-ce « ${s.n} », un autre sophisme, ou pas de sophisme du tout ?</p>
    <div id="quizLecon">${quiz.map((x, k) => `<div class="quiz-item" data-k="${k}"><div>${esc(x.t)}</div><div class="choix"><button data-r="ce">${s.n}</button><button data-r="autre">Un autre sophisme</button><button data-r="aucun">Pas de sophisme</button></div><div class="verdict"></div></div>`).join('')}</div>
    <div class="filet">❦</div>`;
  $('#leconPapier').querySelector('.fermer').onclick = fermerLecon;
  $('#quizLecon').onclick = e => {
    const v = e.target.closest('[data-voir]');
    if (v) { const cible = v.dataset.voir; if (ecran === 'livre') allerA(indexSoph(cible)); ouvrirLecon(cible); return; }
    const b = e.target.closest('button[data-r]'); if (!b) return;
    const it = b.closest('.quiz-item'), x = quiz[+it.dataset.k];
    if (it.dataset.fait) return; it.dataset.fait = 1;
    const bon = repQuiz(x), juste = b.dataset.r === bon;
    b.classList.add(juste ? 'bonne' : 'mauvaise');
    if (!juste) it.querySelector(`[data-r="${bon}"]`).classList.add('attendue');
    let info = '';
    if (bon === 'ce') info = juste ? '' : `C'était bien « ${s.n} ». `;
    else if (bon === 'autre') info = trouve(x.f)
      ? `C'est un autre sophisme : <a href="#" class="lien-soph" data-voir="${x.f}">${SOPH[x.f].n}</a> (ouvrir sa page). `
      : `C'est un autre sophisme, que vous n'avez pas encore découvert : sa page est encore scellée. `;
    else info = juste ? '' : `Il n'y a pas de sophisme ici. `;
    it.querySelector('.verdict').innerHTML = (juste ? '✔ <b>Juste.</b> ' : '✘ <b>Pas tout à fait.</b> ') + info + esc(x.x);
    if (juste && bon === 'ce') { gagner(id, 1, 1); sauver(); majBarre(); }
  };
  $('#lecon').classList.add('ouvert'); $('#lecon').setAttribute('aria-hidden', 'false');
  $('#leconPapier').scrollTop = 0;
}
function fermerLecon() {
  $('#lecon').classList.remove('ouvert'); $('#lecon').setAttribute('aria-hidden', 'true');
  if (ecran === 'livre') afficherLivre();
}
$('#lecon').addEventListener('click', e => { if (e.target.id === 'lecon') fermerLecon(); });

// ═════════════════════════════════════════════ l'entraînement
function entrainement() {
  fermerLecon();
  const n = nbTrouves();
  $('#ecran-entrainement').innerHTML = `<div class="panneau">
    <h1>Salle d'entraînement</h1>
    <p class="sous">${n} sophisme${n > 1 ? 's' : ''} débusqué${n > 1 ? 's' : ''} sur ${SOPHISMES.length} · ${S.justes} bonne${S.justes > 1 ? 's' : ''} réponse${S.justes > 1 ? 's' : ''} · meilleure série : ${S.serieMax}</p>
    <div class="modes">${Object.entries(MODES).map(([k, m]) => `
      <button class="mode" data-mode="${k}" ${ouvert(k) ? '' : 'disabled'}>
        <span class="ico">${m.ico}</span><h3>${m.nom}</h3><p>${m.desc}</p>
        ${ouvert(k) ? '' : `<p class="verrou">🔒 Débloqué à ${m.req} pages trouvées (${n}/${m.req})</p>`}
      </button>`).join('')}</div>
    <button class="lien-discret" id="effacer">Effacer ma progression</button>
  </div>`;
  $('#ecran-entrainement').querySelectorAll('.mode').forEach(b => b.onclick = () => b.dataset.mode === 'debats' ? listeDebats() : lancer(b.dataset.mode));
  $('#effacer').onclick = () => { if (confirm('Effacer toute votre progression ? Les pages seront à nouveau scellées.')) { S = vierge(); sauver(); entrainement(); } };
  montrer('entrainement');
}

const NB_Q = 10;
let Q = null;
function choisirItems(mode) {
  const soph = TOUTES.filter(x => x.f), correct = TOUTES.filter(x => !x.f);
  const neufs = soph.filter(x => !trouve(x.f)), connus = soph.filter(x => trouve(x.f));
  const pris = new Set(), res = [];
  const prendre = pool => { const libres = pool.filter(x => !pris.has(x)); if (!libres.length) return false; const x = hasard(libres); pris.add(x); res.push(x); return true; };
  // Arguments corrects : 5 sur 10 pour l'Apprenti, 3 sur 10 pour le Compagnon et le Maître.
  const nbCorrects = mode === 'apprenti' ? 5 : 3;
  const poolCorrect = mode === 'maitre' ? correct.filter(x => trouve(x.s)) : correct;
  for (let k = 0; k < nbCorrects; k++) prendre(poolCorrect);
  while (res.length < NB_Q) {
    const r = Math.random();
    let ok;
    if (mode === 'apprenti') ok = r < .6 && neufs.length ? prendre(neufs) : prendre(soph);
    else if (mode === 'compagnon') ok = r < .3 && neufs.length ? prendre(neufs) : prendre(connus.length ? connus : soph);
    else ok = prendre(connus);
    if (!ok && !prendre(mode === 'maitre' ? connus : soph)) break;
  }
  return melange(res);
}
function lancer(mode) {
  Q = { mode, items: choisirItems(mode), i: 0, bilan: [], serie: 0, nouveaux: [] };
  question();
  montrer('exercice');
}
function apparentes(id) { const s = SOPH[id]; return new Set([id, s.p, ...SOPHISMES.filter(x => x.p === id).map(x => x.id)].filter(Boolean)); }
function options(id) {
  const proches = apparentes(id), ch = SOPH[id].ch;
  const meme = melange(SOPHISMES.filter(s => s.ch === ch && !proches.has(s.id))).slice(0, 2);
  const autres = melange(SOPHISMES.filter(s => s.ch !== ch && !proches.has(s.id))).slice(0, 3 - meme.length);
  return melange([SOPH[id], ...meme, ...autres]);
}
function question() {
  const x = Q.items[Q.i];
  const prog = `<div class="progres">${Q.items.map((_, k) => `<i class="${k < Q.i ? (Q.bilan[k] ? 'ok' : 'ko') : ''}"></i>`).join('')}</div>`;
  let rep = '';
  if (Q.mode === 'apprenti') rep = `<div class="consigne">Sophisme ou argument correct ?</div><div class="reponses deux"><button class="rep" data-v="1">Sophisme</button><button class="rep" data-v="0">Argument correct</button></div>`;
  else if (Q.mode === 'compagnon') { Q.opts = options(x.f || x.s); rep = `<div class="consigne">Quel est ce sophisme ? (ou n'y en a-t-il pas ?)</div><div class="reponses">${Q.opts.map(s => `<button class="rep" data-id="${s.id}">${s.n}</button>`).join('')}<button class="rep aucun" data-id="aucun">✓ Pas de sophisme</button></div>`; }
  else rep = `<div class="consigne">Nommez ce sophisme</div><form class="saisie" id="formNom" autocomplete="off"><input id="nomSaisi" placeholder="Votre réponse…" autocapitalize="off" spellcheck="false"><button class="btn" type="submit">Valider</button></form>
    <div class="actions" style="justify-content:flex-start"><button class="btn sombre" id="indice" ${S.encre < 3 ? 'disabled' : ''}>Indice (3 ✒️)</button><button class="btn sombre" id="passe">Je ne sais pas</button><button class="btn sombre" id="aucunM">✓ Pas de sophisme</button></div><div id="zoneIndice"></div>`;
  $('#ecran-exercice').innerHTML = `<div class="panneau">${prog}<div class="carte-q"><div class="surtitre">${MODES[Q.mode].nom} · question ${Q.i + 1}/${Q.items.length}</div><p class="enonce">${esc(x.t)}</p>${rep}<div id="retour"></div></div></div>`;
  const E = $('#ecran-exercice');
  if (Q.mode === 'maitre') {
    $('#formNom').onsubmit = e => { e.preventDefault(); const v = $('#nomSaisi').value.trim(); if (v) corrigerMaitre(v); };
    $('#passe').onclick = () => corrigerMaitre('');
    $('#aucunM').onclick = () => corrigerMaitre(null);
    $('#indice').onclick = () => { S.encre -= 3; sauver(); majBarre(); if (!x.f) { $('#zoneIndice').innerHTML = `<p class="retour mi">Relisez bien : le raisonnement casse-t-il vraiment quelque part ?</p>`; $('#indice').disabled = true; return; } const c = CHAP[SOPH[x.f].ch]; $('#zoneIndice').innerHTML = `<p class="retour mi">Le pont casse dans le chapitre <b>${c.num} · ${c.nom}</b> : « ${c.question} »</p>`; $('#indice').disabled = true; };
    setTimeout(() => $('#nomSaisi') && $('#nomSaisi').focus(), 50);
  } else E.querySelectorAll('.rep').forEach(b => b.onclick = () => corriger(b));
}
function blocSoph(id, titre) {
  const s = SOPH[id], c = CHAP[s.ch];
  return `<div class="ligne-pont">${pont(s.ch, 'mini')}<div><h4>${titre}</h4><p><b>${s.n}</b> — ${s.c}</p><p class="famille">Chapitre ${c.num} · ${c.nom} : <i>« ${c.question} »</i></p></div></div>`;
}
function finQuestion(juste, html, cls) {
  Q.bilan[Q.i] = juste;
  S.rep++; if (juste) { S.justes++; Q.serie++; S.serieMax = Math.max(S.serieMax, Q.serie); if (Q.serie % 5 === 0) { S.encre += 5; toast(`Série de ${Q.serie} ! <b>+5 encre</b>`); } } else Q.serie = 0;
  sauver(); majBarre();
  $('#ecran-exercice').querySelectorAll('.rep, #formNom button, #formNom input, #indice, #passe, #aucunM').forEach(b => b.disabled = true);
  const derniere = Q.i + 1 >= Q.items.length;
  $('#retour').innerHTML = `<div class="retour ${cls}">${html}<div class="actions">${html.includes('data-voir') ? '' : ''}<button class="btn" id="suivante">${derniere ? 'Voir le bilan' : 'Question suivante ›'}</button></div></div>`;
  $('#retour').querySelectorAll('[data-voir]').forEach(b => b.onclick = () => ouvrirLecon(b.dataset.voir));
  $('#suivante').onclick = () => { Q.i++; if (Q.i >= Q.items.length) bilan(); else question(); };
  $('#suivante').focus({ preventScroll: true });
  $('#retour').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
const lienLecon = id => trouve(id) ? `<button class="btn-lecon" data-voir="${id}">Lire la leçon</button>` : '';
// Argument correct : explication, ressemblance et vérité probable
function texteCorrect(x, titre) {
  return `<h4>${titre}</h4><p>${esc(x.x)}</p>${x.s && trouve(x.s) ? `<p class="famille">Il ressemble à : <b>${SOPH[x.s].n}</b>, mais il reste du bon côté de la frontière.</p>` : ''}`
    + (x.v ? `<p class="famille">Vérité probable de la conclusion : <b>${VERITE[x.v].nom}</b> — ${VERITE[x.v].def}</p>` : '');
}
// Argument correct bien repéré : on demande à quel point la conclusion est sûre
function demanderNiveau(x) {
  $('#ecran-exercice').querySelectorAll('.rep, #formNom button, #formNom input, #indice, #passe, #aucunM').forEach(b => b.disabled = true);
  if (!x.v) { gagner(null, 0, 1); return finQuestion(true, texteCorrect(x, "✔ Exact, l'argument tient debout"), 'ok'); }
  $('#retour').innerHTML = `<div class="retour mi"><h4>✔ Exact, pas de sophisme.</h4><p>Mais sans sophisme ne veut pas dire certain : <b>à quel point la conclusion est-elle sûre ?</b></p>
    <div class="echelle">${[4, 3, 2, 1].map(v => `<button class="niv" data-v="${v}"><b>${VERITE[v].nom}</b><span>${VERITE[v].def}</span></button>`).join('')}</div></div>`;
  $('#retour').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  $('#retour').querySelectorAll('.niv').forEach(b => b.onclick = () => {
    const ecart = Math.abs(+b.dataset.v - x.v), nom = `« ${VERITE[x.v].nom} »`;
    gagner(null, 0, ecart === 0 ? 2 : 1);
    const titre = ecart === 0 ? `✔ Exact, et bien jaugé : ${nom}` : ecart === 1 ? `≈ Exact, et presque bien jaugé : plutôt ${nom}` : `✔ Exact, mais la conclusion est plutôt ${nom}`;
    finQuestion(true, texteCorrect(x, titre), ecart <= 1 ? 'ok' : 'mi');
  });
}
function corriger(b) {
  const x = Q.items[Q.i];
  if (Q.mode !== 'apprenti' && !x.f) {     // Compagnon : argument correct
    const juste = b.dataset.id === 'aucun';
    b.classList.add(juste ? 'bonne' : 'mauvaise');
    if (juste) return demanderNiveau(x);
    $('#ecran-exercice').querySelector('.rep.aucun').classList.add('bonne');
    return finQuestion(false, texteCorrect(x, "✘ Il n'y a pas de sophisme ici"), 'ko');
  }
  if (Q.mode === 'apprenti') {
    const ditSoph = b.dataset.v === '1', juste = ditSoph === !!x.f;
    b.classList.add(juste ? 'bonne' : 'mauvaise');
    if (x.f) {
      let nouveau = false;
      if (juste) { nouveau = decouvrir(x.f); if (nouveau) Q.nouveaux.push(x.f); gagner(x.f, 1, 1); }
      finQuestion(juste, blocSoph(x.f, (juste ? '✔ Bien vu, c\'est un sophisme' : '✘ C\'était un sophisme') + (nouveau ? ' <span class="badge-nouveau">page débloquée</span>' : '')) + `<p>${esc(x.x)}</p>` + (juste ? '' : '<p class="famille">Trouvez-le une prochaine fois pour briser le sceau de sa page.</p>') + lienLecon(x.f), juste ? 'ok' : 'ko');
    } else {
      if (juste) return demanderNiveau(x);
      finQuestion(false, texteCorrect(x, '✘ Cet argument est correct'), 'ko');
    }
  } else {
    const juste = b.dataset.id === x.f;
    b.classList.add(juste ? 'bonne' : 'mauvaise');
    if (!juste) $('#ecran-exercice').querySelector(`.rep[data-id="${x.f}"]`).classList.add('bonne');
    let nouveau = false;
    if (juste) { nouveau = decouvrir(x.f); if (nouveau) Q.nouveaux.push(x.f); gagner(x.f, 2, 2); }
    finQuestion(juste, blocSoph(x.f, (juste ? '✔ Bonne étiquette' : '✘ Ce n\'était pas la bonne étiquette') + (nouveau ? ' <span class="badge-nouveau">page débloquée</span>' : '')) + `<p>${esc(x.x)}</p>` + lienLecon(x.f), juste ? 'ok' : 'ko');
  }
}

// niveau Maître : reconnaissance tolérante du nom
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, ' ').replace(/[^a-z0-9]+/g, ' ')
  .replace(/\b(le|la|les|l|un|une|du|des|de|d|c est|sophisme|argument de|argument du|argument)\b/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
  return p[n];
}
function reconnaitre(saisie) {
  const v = norm(saisie); if (!v) return null;
  let meilleur = null, md = 1e9;
  for (const s of SOPHISMES) for (const nom of [s.n, ...s.a]) {
    const k = norm(nom); if (!k) continue;
    const d = lev(v, k), tol = Math.max(1, Math.floor(k.length / 5));
    if (d <= tol && d < md) { md = d; meilleur = s.id; }
  }
  return meilleur;
}
function corrigerMaitre(saisie) {
  const x = Q.items[Q.i];
  if (!x.f) {      // argument correct
    if (saisie === null) return demanderNiveau(x);
    return finQuestion(false, texteCorrect(x, saisie ? `✘ Vous avez répondu « ${esc(saisie)} », mais il n'y a pas de sophisme ici` : "✘ Il n'y avait pas de sophisme ici"), 'ko');
  }
  if (saisie === null) return finQuestion(false, blocSoph(x.f, '✘ Il y avait bien un sophisme') + `<p>${esc(x.x)}</p>` + lienLecon(x.f), 'ko');
  const vrai = SOPH[x.f], id = reconnaitre(saisie);
  if (id === x.f) {
    gagner(x.f, 3, 3);
    finQuestion(true, blocSoph(x.f, '✔ Parfaitement nommé') + `<p>${esc(x.x)}</p>` + lienLecon(x.f), 'ok');
  } else if (id && id === vrai.p) {
    gagner(x.f, 1, 1);
    finQuestion(false, blocSoph(x.f, `≈ Presque ! C'est bien un ${SOPH[id].n.toLowerCase()}…`) + `<p>…plus précisément : <b>${vrai.n}</b>. ${esc(x.x)}</p>` + lienLecon(x.f), 'mi');
  } else if (id && SOPH[id].p === x.f) {
    finQuestion(false, blocSoph(x.f, `≈ Trop précis : ce n'est pas un ${SOPH[id].n.toLowerCase()}`) + `<p>C'est la famille plus large : <b>${vrai.n}</b>. ${esc(x.x)}</p>` + lienLecon(x.f), 'mi');
  } else if (id) {
    finQuestion(false, blocSoph(x.f, `✘ Vous avez répondu : ${SOPH[id].n}`) + `<p>${esc(x.x)}</p>` + (SOPH[id].ch === vrai.ch ? `<p class="famille">Vous étiez dans le bon chapitre : le pont casse bien au même endroit.</p>` : '') + lienLecon(x.f), 'ko');
  } else {
    finQuestion(false, blocSoph(x.f, saisie ? `✘ Je ne reconnais pas « ${esc(saisie)} »` : 'La réponse était…') + `<p>${esc(x.x)}</p>` + lienLecon(x.f), 'ko');
  }
}
function bilan() {
  const ok = Q.bilan.filter(Boolean).length, m = Q.mode;
  $('#ecran-exercice').innerHTML = `<div class="panneau"><div class="carte-q resultat">
    <div class="surtitre">Bilan · ${MODES[m].nom}</div><div class="gros">${ok} / ${Q.items.length}</div>
    <p>${ok === Q.items.length ? 'Un sans-faute ! Les sophistes tremblent.' : ok >= 7 ? 'Très bel œil.' : ok >= 4 ? 'Le regard s\'aiguise.' : 'Chaque erreur est une leçon : relisez les pages du grimoire.'}</p>
    ${Q.nouveaux.length ? `<p>Pages débloquées : ${Q.nouveaux.map(id => `<b>${SOPH[id].n}</b>`).join(', ')}</p>` : ''}
    <div class="actions" style="justify-content:center"><button class="btn" id="rejouer">Rejouer</button><button class="btn sombre" id="versLivre">Ouvrir le grimoire</button><button class="btn sombre" id="versSalle">Salle d'entraînement</button></div>
  </div></div>`;
  $('#rejouer').onclick = () => lancer(m);
  $('#versLivre').onclick = () => ouvrirLivre(Q.nouveaux.length ? indexSoph(Q.nouveaux[0]) : undefined);
  $('#versSalle').onclick = entrainement;
}

// ═════════════════════════════════════════════ les débats
function listeDebats() {
  const n = nbTrouves();
  $('#ecran-debat').innerHTML = `<div class="panneau"><h1>Débats</h1><p class="sous">Lisez l'échange, cliquez sur chaque réplique qui contient un sophisme, puis nommez-le.</p>
    <div class="liste-debats">${DEBATS.map(d => { const ok = n >= PALIERS[d.palier], b = S.debats[d.id]; return `
      <button class="mode debat-carte" data-d="${d.id}" ${ok ? '' : 'disabled'}><span class="ico">${b ? '🏅' : '⚖️'}</span><h3>${d.titre}</h3>
      <p>${d.gens.map(g => g.n).join(' · ')}</p><p class="famille">${d.lignes.filter(l => l.f).length} sophismes cachés${b ? ` · meilleur score : ${b} pts` : ''}</p>
      ${ok ? '' : `<p class="verrou">🔒 Débloqué à ${PALIERS[d.palier]} pages trouvées (${n}/${PALIERS[d.palier]})</p>`}</button>`; }).join('')}</div>
    <div class="actions" style="justify-content:center"><button class="btn sombre" id="retourSalle">Salle d'entraînement</button></div></div>`;
  $('#ecran-debat').querySelectorAll('[data-d]').forEach(b => b.onclick = () => jouerDebat(b.dataset.d));
  $('#retourSalle').onclick = entrainement;
  montrer('debat');
}
let D = null;
function jouerDebat(id) {
  const d = DEBATS.find(x => x.id === id);
  D = { d, trouves: {}, erreurs: 0, pts: 0, enCours: null };
  dessinerDebat();
}
function dessinerDebat() {
  const d = D.d, total = d.lignes.filter(l => l.f).length, n = Object.keys(D.trouves).length;
  $('#ecran-debat').innerHTML = `<div class="panneau"><h1>${d.titre}</h1>
    <p class="etat-debat">Sophismes trouvés : <b>${n} / ${total}</b> · répliques saines cliquées : ${D.erreurs}</p>
    <div class="fil">${d.lignes.map((l, k) => { const g = d.gens[l.p], tr = D.trouves[k]; return `
      <button class="bulle ${l.p === 1 ? 'droite' : ''} ${tr ? 'trouvee' : ''}" style="--c:${g.c}" data-k="${k}">
        <span class="qui">${g.n} · ${g.r}</span>${esc(l.t)}${tr ? `<span class="etiquette">⚑ ${SOPH[l.f].n}${tr === 'aide' ? ' (avec aide)' : ''}</span>` : ''}</button>`; }).join('')}</div>
    <div id="zoneNom"></div>
    <div class="actions" style="justify-content:center"><button class="btn sombre" id="quitter">Liste des débats</button></div></div>`;
  $('#ecran-debat').querySelectorAll('.bulle').forEach(b => b.onclick = () => clicBulle(+b.dataset.k, b));
  $('#quitter').onclick = listeDebats;
  if (n === total) finDebat();
}
function clicBulle(k, b) {
  if (D.enCours !== null || D.trouves[k]) return;
  const l = D.d.lignes[k];
  if (!l.f) { D.erreurs++; b.classList.remove('saine'); void b.offsetWidth; b.classList.add('saine'); toast('Cette réplique tient la route.'); $('.etat-debat').innerHTML = $('.etat-debat').innerHTML.replace(/cliquées : \d+/, 'cliquées : ' + D.erreurs); return; }
  D.enCours = k;
  const opts = options(l.f);
  $('#zoneNom').innerHTML = `<div class="carte-q"><div class="consigne">Bien vu ! Quel sophisme dans cette réplique ?</div><p class="enonce">${esc(l.t)}</p>
    <div class="reponses">${opts.map(s => `<button class="rep" data-id="${s.id}">${s.n}</button>`).join('')}</div><div id="retourDebat"></div></div>`;
  $('#zoneNom').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('#zoneNom').querySelectorAll('.rep').forEach(o => o.onclick = () => {
    const juste = o.dataset.id === l.f;
    $('#zoneNom').querySelectorAll('.rep').forEach(x => { x.disabled = true; if (x.dataset.id === l.f) x.classList.add('bonne'); });
    if (!juste) o.classList.add('mauvaise');
    const nouveau = decouvrir(l.f);
    if (juste) { gagner(l.f, 3, 4); D.pts += 10; } else { gagner(l.f, 1, 1); D.pts += 3; }
    D.trouves[k] = juste ? 'ok' : 'aide';
    S.rep++; if (juste) S.justes++; sauver(); majBarre();
    $('#retourDebat').innerHTML = `<div class="retour ${juste ? 'ok' : 'ko'}">${blocSoph(l.f, (juste ? '✔ Exactement' : '✘ C\'était plutôt…') + (nouveau ? ' <span class="badge-nouveau">page débloquée</span>' : ''))}<p>${esc(l.x)}</p><div class="actions"><button class="btn" id="continuer">Continuer le débat</button></div></div>`;
    $('#continuer').onclick = () => { D.enCours = null; dessinerDebat(); };
  });
}
function finDebat() {
  const pts = Math.max(0, D.pts - D.erreurs * 2), id = D.d.id;
  const record = !S.debats[id] || pts > S.debats[id];
  if (record) S.debats[id] = pts;
  S.encre += 5; sauver(); majBarre();
  $('#zoneNom').innerHTML = `<div class="carte-q resultat"><div class="surtitre">Débat terminé</div><div class="gros">${pts} pts</div>
    <p>Tous les sophismes ont été démasqués${D.erreurs ? `, avec ${D.erreurs} fausse${D.erreurs > 1 ? 's' : ''} alerte${D.erreurs > 1 ? 's' : ''}` : ' sans une seule fausse alerte'}.${record ? ' Nouveau record !' : ''} <b>+5 encre</b></p></div>`;
  $('#zoneNom').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ═════════════════════════════════════════════ démarrage
$('#btnAccueil').onclick = () => { fermerLecon(); accueil(); };
accueil();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
