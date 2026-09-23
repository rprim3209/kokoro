// ==========================================
// Triage & Quiz Questionnaire Module
// ==========================================

// ==========================================
// ADAPTIVE TRIAGE / QUIZ JE KATEGORIE
// Erwachsen (Dual-Track) | Baby | Kind | Teenie
// ==========================================

const QUIZ_BABY = [
  {
    q: "Wie alt ist dein Säugling / Kleinkind?",
    opts: [
      { k: "Unter 6 Monate", d: "Sehr unreife Säuglingsbarriere · AAP/DGKJ: Sonnencreme meiden, strikt Textil- & Schattenschutz bevorzugen", tags: { baby_u6m: 2 } },
      { k: "6 bis 36 Monate", d: "Kleinkind · Mineralischer Breitspektrum-Sonnenschutz bei direkter Sonnenexposition zulässig", tags: { baby_o6m: 2 } }
    ]
  },
  {
    q: "Welche Hautbesonderheiten bemerkst du bei deinem Baby?",
    opts: [
      { k: "Zart & Unkompliziert", d: "Gesunde Säuglingshaut, keine anhaltenden Rötungen oder Schuppung", tags: { baby_normal: 2 } },
      { k: "Trocken / Rau", d: "Neigung zu rauen Wangen oder Schienbeinen (atopische Veranlagung / Neurodermitis-Vorbeugung)", tags: { baby_dry: 2, barrier: 2 } },
      { k: "Windelbereich gereizt", d: "Häufig Rötung oder Feuchtigkeitsreizung im Windelbereich", tags: { baby_windel: 2, baby_diaper: 2 } }
    ]
  },
  {
    q: "Wie aufwendig soll die Baby-Pflege sein?",
    opts: [
      { k: "Minimalistisch (2 Produkte)", d: "Milde seifenfreie Reinigung & schützendes Barriere-Emollient. (EDQM-Leitlinie: Minimalismus für Säuglinge)", tags: { complexity_minimal: 3 } },
      { k: "Ausgewogene Basis (3 Produkte)", d: "Milde Reinigung + Barriere-Creme + zinkhaltiger Wundschutz für den Wickeltisch.", tags: { complexity_basis: 3 } },
      { k: "Umfassend (4 Produkte)", d: "Reinigung + Barriere-Creme + Wundschutz + mineralischer Baby-Sonnenschutz LSF 50+ für aktive Tage draußen.", tags: { complexity_comprehensive: 3 } }
    ]
  }
];

const QUIZ_CHILD = [
  {
    q: "Welche Aktivitäten prägen den Alltag deines Kindes?",
    opts: [
      { k: "Schule & Hofpause", d: "Viel draußen an der frischen Luft, UV-Schutz und saubere Hände/Körper im Fokus", tags: { child_school: 2 } },
      { k: "Sport & Schwimmen", d: "Regelmäßiges Duschen, Chlorwasser oder Schwitzen strapazieren die Hautbarriere", tags: { child_active: 2 } },
      { k: "Empfindliche Augen", d: "Shampoo und Waschlotion dürfen auf keinen Fall in den Augen brennen", tags: { child_sensitive_eyes: 2 } }
    ]
  },
  {
    q: "Wie verhält sich die Haut deines Kindes nach dem Waschen / Duschen?",
    opts: [
      { k: "Ausgeglichen", d: "Braucht selten Creme, Haut fühlt sich normal weich an", tags: { child_normal: 2 } },
      { k: "Trocken / Weißlich", d: "Haut neigt zu Spannungsgefühl oder trockenen Schienbeinen nach Wasser", tags: { child_dry: 2, barrier: 2 } }
    ]
  },
  {
    q: "Wie aufwendig soll die Kinder-Routine sein?",
    opts: [
      { k: "Minimalistisch (2 Produkte)", d: "Milde Dusche/Waschlotion + täglicher Breitspektrum-Sonnenschutz LSF 50+ für Schule & Sport.", tags: { complexity_minimal: 3 } },
      { k: "Ausgewogene Basis (3 Produkte)", d: "Milde Dusche + Kinder-Pflegecreme gegen Austrocknung + LSF 50+.", tags: { complexity_basis: 3 } },
      { k: "Umfassend (4 Produkte)", d: "Milde Dusche + Kinder-Pflegecreme + LSF 50+ + mildes, tränenfreies Kindershampoo.", tags: { complexity_comprehensive: 3 } }
    ]
  }
];

const QUIZ_TEEN = [
  {
    q: "Welches Thema steht bei deiner Haut im Vordergrund?",
    opts: [
      { k: "Glanz & Poren", d: "Talgüberschuss auf Stirn, Nase oder Kinn; verstopfte Poren & Mitesser", tags: { teen_oily: 2 } },
      { k: "Pickel & Ausbrüche", d: "Rote Pickelchen, die hormonell oder schubweise auftreten", tags: { teen_blemish: 2 } },
      { k: "Sensibel / Trocken", d: "Spannt schnell, reagiert gereizt auf aggressive Mittel", tags: { teen_dry: 2, teen_sensibel: 2 } },
      { k: "Gesunder Schutz", d: "Haut ist rein, möchte gesunde Basis & UV-Schutz ohne Reizungen", tags: { teen_normal: 2 } }
    ]
  },
  {
    q: "Hast du schon Erfahrungen mit Wirkstoffen oder Social-Media-Trends?",
    opts: [
      { k: "Minimaler Einstieg", d: "Bisher nur Wasser oder Seife, möchte einfach & sicher starten", tags: { teen_starter: 2 } },
      { k: "Kenne milde Actives", d: "Nutze oder kenne Salicylsäure (BHA), Niacinamid oder Zink", tags: { teen_actives: 2 } },
      { k: "Anti-Aging-Verlockung", d: "Habe von Retinol oder starken Säuren gehört, möchte aber Barriere nicht ruinieren", tags: { teen_prevent_hype: 2 } }
    ]
  },
  {
    q: "Wie aufwendig soll deine tägliche Pflegeroutine sein?",
    opts: [
      { k: "Minimalistisch (2 Produkte)", d: "Milde Reinigung & feuchtigkeitsspendender LSF 30–50+ (max. 2 Min. vor der Schule).", tags: { complexity_minimal: 3 } },
      { k: "Ausgewogene Basis (3 Produkte)", d: "Milde Reinigung + Leichte Feuchtigkeitscreme + LSF 30–50+ (das bewährte AAD-Basis-Trio).", tags: { complexity_basis: 3 } },
      { k: "Umfassend (4 Produkte)", d: "Milde Reinigung + Salicylsäure (BHA) gegen Mitesser + Leichte Feuchtigkeit + LSF 30–50+.", tags: { complexity_comprehensive: 3 } }
    ]
  }
];

const QUIZ_BEGINNER = [
  {
    q: "Wie fühlt sich dein Gesicht 2 Minuten nach dem Waschen und Abtrocknen an?",
    opts: [
      { k: "Normal", d: "Spannt nicht, fettet nicht, der Haut fehlt nach dem Waschen nichts", tags: { normal: 2, barrier_ok: 1 } },
      { k: "Trocken", d: "Spannt unangenehm oder fühlt sich 'eine Nummer zu klein' an", tags: { trocken: 2, barrier: 1 } },
      { k: "Mischhaut", d: "Wangen spannen leicht, Stirn & Nase sind neutral", tags: { misch: 2 } },
      { k: "Ölig", d: "Schnell wieder entspannt, bildet bald neuen Glanz", tags: { oelig: 2 } },
      { k: "Sensibel", d: "Brennt, kribbelt oder rötet sich (auch nach der Rasur)", tags: { sensibel: 3, barrier: 2 } }
    ]
  },
  {
    q: "Wie sieht deine Haut am Nachmittag im natürlichen Zustand aus (ohne Mattierung / Puder)?",
    opts: [
      { k: "Ausgeglichen", d: "Vital & matt, gesunder Zustand ohne Spannungsgefühl oder Fettglanz", tags: { normal: 2 } },
      { k: "Matt / Schuppig", d: "Komplett matt, teils feine Trockenheitsfältchen oder Schüppchen", tags: { trocken: 2 } },
      { k: "T-Zone glänzt", d: "Stirn, Nase oder Kinn glänzen, die Wangen bleiben matt", tags: { misch: 2 } },
      { k: "Vollflächig ölig", d: "Deutlicher Ölglanz im gesamten Gesicht", tags: { oelig: 2 } },
      { k: "Dehydriert", d: "Glänzt ölig, spannt aber gleichzeitig unangenehm darunter", tags: { oelig: 1, barrier: 2 } }
    ]
  },
  {
    q: "Wie reagiert deine Haut auf Pflegeprodukte, Rasuren oder Wetterumschwünge?",
    opts: [
      { k: "Robust", d: "Völlig unkompliziert, verträgt fast alles problemlos", tags: { robust: 2, normal: 1 } },
      { k: "Leicht reizbar", d: "Gelegentlich Rötung oder Brennen (z.B. nach Rasur, Kälte, Parfüm)", tags: { sensibel: 1 } },
      { k: "Hochsensibel", d: "Häufig Brennen, Stechen, Rötung oder Hitzegefühl", tags: { sensibel: 3, barrier: 2 } }
    ]
  },
  {
    q: "Welche Unreinheiten oder Hautthemen beschäftigen dich am ehesten?",
    opts: [
      { k: "Keine / Rein", d: "Haut ist gesund, Fokus liegt auf Frische & täglichem Sonnenschutz", tags: { rein: 2, normal: 2 } },
      { k: "Rasurbrand", d: "Gelegentlich Rasur-Pickelchen, eingewachsene Haare oder Reizung", tags: { rasur: 1, sensibel: 1 } },
      { k: "Mitesser", d: "Verstopfte Poren, Mitesser (schwarz/weiß) oder raue Textur", tags: { "akne-prone": 2 } },
      { k: "Entzündliche Pickel", d: "Rote Pickelchen und Pusteln, die schubweise auftreten", tags: { "akne-prone": 3 } },
      { k: "Unterlagerungen", d: "Tiefe, harte Knoten unter der Haut, die bei Druck schmerzen", tags: { "akne-prone": 2, "arzt-thema": 1 } }
    ]
  },
  {
    q: "Nutzt du aktuell ein medizinisches Mittel oder spezielle Wirkstoffe?",
    opts: [
      { k: "Keine", d: "Nur Basispflege oder Wasser – möchte gesunde Haut einfach richtig schützen", tags: { gesunde_haut: 2, normal: 1, basic: 1 } },
      { k: "Drogerie-Actives", d: "Freiverkäufliche Säuren (BHA/AHA), Retinol oder Vitamin C", tags: { actives: 1 } },
      { k: "Hautarzt (Rx)", d: "Rezeptpflichtiges Mittel (z.B. Adapalen, Epiduo, BPO, Tretinoin)", tags: { begleitpflege: 3, rx: 1 } }
    ]
  },
  {
    q: "Brauchst du tagsüber zwingend eine Creme, damit sich deine Haut gut anfühlt?",
    opts: [
      { k: "Nicht zwingend", d: "Der Haut fehlt nichts, ein leichter Sonnenschutz genügt vollkommen", tags: { normal: 2 } },
      { k: "Immer nötig", d: "Ohne Feuchtigkeitscreme spannt, schuppt oder juckt die Haut", tags: { trocken: 2, barrier: 2 } },
      { k: "Nur situativ", d: "Vor allem im Winter, bei trockener Heizungsluft oder nach dem Rasieren", tags: { barrier: 1 } },
      { k: "Eher nein", d: "Normale Cremes fühlen sich schnell schwer, fettig oder klebrig an", tags: { oelig: 1 } }
    ]
  },
  {
    q: "Was ist dein wichtigstes persönliches Ziel für deine Pflegeroutine?",
    opts: [
      { k: "Gesunderhaltung", d: "Barriere bewahren und mit täglichem UV-Schutz vorzeitiger Alterung vorbeugen", tags: { praevention: 2, normal: 2 } },
      { k: "Poren-Balance", d: "Verstopfte Poren, Mitesser oder Glanz mild regulieren", tags: { "akne-prone": 2 } },
      { k: "Beruhigung", d: "Rötungen lindern und Barriere (auch nach Rasur) reparieren", tags: { sensibel: 2, barrier: 2 } },
      { k: "Reizarmut", d: "100% parfümfrei, ohne Alkohol denat., vegan & Cruelty-Free", tags: { duftstofffrei: 1, cruelty_free: 1 } }
    ]
  },
  {
    q: "Wie verhält sich deine Haut nach Pickeln, Hautreizungen oder Mückenstichen?",
    opts: [
      { k: "Rötungen verblassen zügig", d: "Flüchtige Rötung (PIE), hinterlässt selten dauerhafte braune Flecken (typisch Fitzpatrick I–III)", tags: { pie_prone: 2 } },
      { k: "Dunkle Flecken bleiben monatelang", d: "Post-inflammatorische Hyperpigmentierung (PIH): Pickel heilen braun/grau ab (typisch Fitzpatrick IV–VI / Melanin-reich)", tags: { "pih-prone": 3, "skin-of-color": 2 } },
      { k: "Sonnenschutz hinterlässt oft Grauschleier", d: "Störender White-Cast bei LSF; Fokus auf transparente Formulierungen & Pigmentschutz", tags: { zero_white_cast_prio: 2, "skin-of-color": 2 } }
    ]
  },
  {
    q: "Wie aufwendig soll deine tägliche Pflegeroutine sein?",
    opts: [
      { k: "Minimalistisch (2 Produkte)", d: "Morgens: Milde Reinigung & feuchtigkeitsspendender LSF 50+ · Abends: Milde Reinigung & Barrierepflege. Zeitaufwand: max. 2 Min.", tags: { complexity_minimal: 3 } },
      { k: "Ausgewogene Basis (3 Produkte)", d: "Morgens: Reinigung + Feuchtigkeit/Serum + LSF 50+ · Abends: Reinigung + gezielter Active + Feuchtigkeitscreme. Der Goldstandard.", tags: { complexity_basis: 3 } },
      { k: "Umfassend (4–5 Produkte)", d: "Morgens: Reinigung + Tiefen-Hydrator + Active + Creme + LSF 50+ · Abends: Reinigung + Puffer + Retinoid/Peeling + Barriere-Versiegelung.", tags: { complexity_comprehensive: 3 } }
    ]
  }
];

const QUIZ_PRO = [
  {
    q: "Welche aktiven Leit-Wirkstoffe sind fester Bestandteil deiner Routine?",
    opts: [
      { k: "Barriere & LSF", d: "Täglicher Breitband-UV-Schutz, Ceramide & Feuchtigkeit (keine Reiz-Actives)", tags: { normal: 2, barrier: 2 } },
      { k: "Retinoid (Rx)", d: "Medizinisches Retinoid oder BPO (Adapalen, Tretinoin, Epiduo, Benzaknen)", tags: { begleitpflege: 3, rx: 1 } },
      { k: "Retinol (OTC)", d: "Freiverkäufliches kosmetisches Retinoid (Retinol, Retinal)", tags: { retinoid_cos: 1 } },
      { k: "Chemische Peelings", d: "AHA Glykolsäure, Milchsäure oder 2% BHA Salicylsäure", tags: { acids: 1 } },
      { k: "Milde Regulatoren", d: "Azelainsäure 10%, Niacinamid 5–10% oder Vitamin C", tags: { mild_actives: 1 } }
    ]
  },
  {
    q: "Wie strukturierst du deine Abende?",
    opts: [
      { k: "Basispflege", d: "Konstante milde Reinigung, Feuchtigkeit & gesunde Regeneration", tags: { minimal_basis: 1 } },
      { k: "Skin Cycling", d: "Fester Rhythmus (z.B. Tag 1 Säure, Tag 2 Retinoid, Tag 3–4 Pause)", tags: { cycling: 1 } },
      { k: "Tägliches Schichten", d: "Wirkstoff fast jeden Abend aufgetragen, Haut ist adaptiert", tags: { high_freq: 1 } },
      { k: "Nach Bedarf", d: "Dynamisch & intuitiv je nach aktuellem Hautgefühl", tags: { dynamic: 1 } }
    ]
  },
  {
    q: "Zeigt deine Haut aktuell Anzeichen von Überreizung oder Schälung?",
    opts: [
      { k: "Tolerant & stabil", d: "Gesunde Barriere, keine Schälung, keine Rötung", tags: { robust: 2, normal: 1 } },
      { k: "Situativ gereizt", d: "Nur wenn zu viele Actives gestapelt werden oder nach Rasur", tags: { sensibel: 1 } },
      { k: "Akut irritiert", d: "Trockenheitsinseln, Schuppung um Mund/Nase oder Brennen beim Eincremen", tags: { barrier: 3, sensibel: 2 } }
    ]
  },
  {
    q: "Wie oft nutzt du chemische Leave-on Peelings (AHA/BHA)?",
    opts: [
      { k: "Gar nicht", d: "Haut ist im Gleichgewicht oder Säuren beißen sich mit Retinoid", tags: { no_acids: 1 } },
      { k: "1–2× pro Woche", d: "Gezielt zur sanften Porenklärung und Hautglättung", tags: { peeling_moderate: 1 } },
      { k: "3× oder öfter", d: "Fast täglich im Toner oder Peeling-Serum", tags: { peeling_high: 1 } }
    ]
  },
  {
    q: "Welche Galenik bevorzugst du für deine Feuchtigkeitsstufe?",
    opts: [
      { k: "Leichte Lotion", d: "Klassische Feuchtigkeitspflege für normale bis ausgeglichene Haut", tags: { normal: 2 } },
      { k: "Gel-Creme / Fluid", d: "Zieht matt ein, klebt nicht im Bart, neigt nicht zu Glanz", tags: { oelig: 2 } },
      { k: "Reichhaltige Creme", d: "Lipide & Ceramide (auch für Sandwich-Methode geeignet)", tags: { trocken: 2, barrier: 1 } },
      { k: "Hybrid-Layering", d: "Feuchtigkeitsserum + leichte Creme kombiniert", tags: { misch: 2 } }
    ]
  },
  {
    q: "Welche Filter sollen bei jedem Scan sofort rot flaggen?",
    opts: [
      { k: "Duftstoffe & Alkohol", d: "Limonene, Linalool, Parfüm & austrocknender Alkohol denat.", tags: { duftstofffrei: 1 } },
      { k: "Cruelty-Free", d: "Offizielle Leaping Bunny oder PETA Zertifizierung", tags: { cruelty_free: 1 } },
      { k: "Keine Filter", d: "Hauptsache wissenschaftlich und evidenzbasiert belegt", tags: {} }
    ]
  },
  {
    q: "Neigst du zu hartnäckigen Pigmentflecken, Melasma oder post-inflammatorischer Hyperpigmentierung (PIH)?",
    opts: [
      { k: "Kaum Pigmentprobleme", d: "Fokus liegt auf Barriere, Textur und Standard-UV-Schutz", tags: {} },
      { k: "Ja, starke PIH / Melasma", d: "Reaktive Melanozyten · Schutz vor sichtbarem Licht (Eisenoxide) & Tyrosinasehemmer (Azelainsäure, Niacinamid) bevorzugt", tags: { "pih-prone": 3, "skin-of-color": 2, iron_oxide_prio: 2 } },
      { k: "White-Cast & Reizempfindlich", d: "Mineralische Filter hinterlassen Grauschleier, Säuren triggern Rebound-Pigmentierung", tags: { "pih-prone": 2, "skin-of-color": 3, zero_white_cast_prio: 3 } }
    ]
  },
  {
    q: "Wie aufwendig soll deine tägliche Pflegeroutine sein?",
    opts: [
      { k: "Minimalistisch (2 Produkte)", d: "Morgens: Milde Reinigung & feuchtigkeitsspendender LSF 50+ · Abends: Milde Reinigung & Barrierepflege. Zeitaufwand: max. 2 Min.", tags: { complexity_minimal: 3 } },
      { k: "Ausgewogene Basis (3 Produkte)", d: "Morgens: Reinigung + Feuchtigkeit/Serum + LSF 50+ · Abends: Reinigung + gezielter Active + Feuchtigkeitscreme. Der Goldstandard.", tags: { complexity_basis: 3 } },
      { k: "Umfassend (4–5 Produkte)", d: "Morgens: Reinigung + Tiefen-Hydrator + Active + Creme + LSF 50+ · Abends: Reinigung + Puffer + Retinoid/Peeling + Barriere-Versiegelung.", tags: { complexity_comprehensive: 3 } }
    ]
  }
];

let quizTrack = null; // "baby" | "child" | "teen" | "beginner" | "pro"
let quizIndex = 0;
let quizAnswers = [];

function openQuizModal() {
  quizIndex = 0;
  quizAnswers = [];
  quizTrack = null;
  renderQuizCountryStep();
}

/** First quiz step: shopping country (same state field as Options / catalog). */
function renderQuizCountryStep() {
  if (typeof window !== "undefined") window._quizCountryStepActive = true;
  const country = typeof getProfileCountry === "function" ? getProfileCountry() : "AT";
  const countryName = typeof countryLabel === "function" ? countryLabel(country) : country;
  const picker = typeof renderCountryPickerHtml === "function"
    ? renderCountryPickerHtml(country, "selectQuizCountry", { uid: "quizCountryPicker", maxHeight: "200px" })
    : "";

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Dein Einstieg</div>
    <h2>In welchem Land einkaufen?</h2>
    <p style="font-size:0.9rem;color:var(--muted);margin:-0.2rem 0 0.85rem">
      Aktuell: <strong>${country}</strong> · ${countryName}. Gilt für Katalog &amp; Live-Suche — später in Optionen änderbar.
    </p>

    <div style="display:flex;gap:8px;align-items:center;margin-bottom:0.55rem;flex-wrap:wrap">
      <button type="button" class="country-location-btn" id="btnDetectCountryLocationQuiz" onclick="detectCountryFromLocationUI(this)" style="padding:0.42rem 0.85rem;font-size:0.8rem;font-weight:700;display:inline-flex;align-items:center;gap:6px;background:#eef6f3;color:#1e4620;border:1px solid #b7dfca;border-radius:8px;cursor:pointer">
        <span aria-hidden="true">📍</span> Standort des Handys verwenden
      </button>
      <span id="countryLocationStatusQuiz" style="font-size:0.76rem;color:var(--muted)"></span>
    </div>

    ${picker}

    <div style="display:flex;gap:8px;margin-top:1.2rem">
      <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.75rem 1.1rem" onclick="window._quizCountryStepActive=false; closeModal()">Abbrechen</button>
      <button class="primary" style="margin-top:0;flex:1" onclick="proceedAfterQuizCountry()">Weiter →</button>
    </div>
  `);
}

function proceedAfterQuizCountry() {
  if (typeof window !== "undefined") window._quizCountryStepActive = false;
  const p = typeof getActiveProfile === "function" ? getActiveProfile() : { category: "adult" };
  quizIndex = 0;
  quizAnswers = [];
  if (p.category === "baby") {
    startQuiz("baby");
  } else if (p.category === "child") {
    startQuiz("child");
  } else if (p.category === "teen") {
    startQuiz("teen");
  } else {
    quizTrack = null;
    renderQuizBranch();
  }
}

function renderQuizBranch() {
  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Dein Einstieg</div>
    <h2>Wie gut kennst du dich mit Skincare aus?</h2>
    <p style="font-size:0.9rem;color:var(--muted);margin:-0.2rem 0 1rem">Wir passen die Fragen an dein Vorwissen an:</p>
    
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="sim-item" onclick="startQuiz('beginner')" style="padding:1rem">
        <div>
          <div style="font-weight:700;font-size:0.98rem">🌱 Ich stehe am Anfang / brauche Orientierung</div>
          <div style="font-size:0.8rem;color:var(--muted);margin-top:3px">8 alltagsnahe Fragen zu Hautgefühl, Glanz, Brennen, Pickelmustern und gewünschtem Aufwand.</div>
        </div>
      </div>

      <div class="sim-item" onclick="startQuiz('pro')" style="padding:1rem">
        <div>
          <div style="font-weight:700;font-size:0.98rem">🔬 Ich kenne meine Wirkstoffe (Skincare-Pro)</div>
          <div style="font-size:0.8rem;color:var(--muted);margin-top:3px">7 Fragen zu Retinoiden, Skin Cycling, Peeling-Frequenz, No-Go Filtern und Routine-Umfang.</div>
        </div>
      </div>
    </div>

    <button class="ghost-btn" style="margin-top:1.2rem" onclick="closeModal()">Abbrechen</button>
  `);
}

function getQuizList() {
  if (quizTrack === "baby") return QUIZ_BABY;
  if (quizTrack === "child") return QUIZ_CHILD;
  if (quizTrack === "teen") return QUIZ_TEEN;
  return quizTrack === "beginner" ? QUIZ_BEGINNER : QUIZ_PRO;
}

function getQuizTrackTitle() {
  if (quizTrack === "baby") return "👶 Pädiatrische Baby-Triage (<3 Jahre)";
  if (quizTrack === "child") return "🧒 Kinder-Triage (3–11 Jahre)";
  if (quizTrack === "teen") return "🧑‍🦱 Teenie-Triage (12–17 Jahre)";
  return quizTrack === "beginner" ? "🌱 Einsteiger-Triage" : "🔬 Skincare-Pro Triage";
}

function startQuiz(track) {
  quizTrack = track;
  quizIndex = 0;
  quizAnswers = [];
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const list = getQuizList();
  const q = list[quizIndex];
  const trackTitle = getQuizTrackTitle();
  const selectedIndices = quizAnswers[quizIndex] || [];

  showModalSheet(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">${trackTitle} (${quizIndex + 1}/${list.length})</div>
      <div style="font-size:0.7rem;background:#ede5d7;color:#5a4f3e;padding:2px 8px;border-radius:99px;font-weight:600">Mehrfachauswahl möglich</div>
    </div>
    <h2 style="font-size:1.15rem;margin:0.4rem 0 1rem">${q.q}</h2>
    
    <div style="display:flex;flex-direction:column;gap:8px">
      ${q.opts.map((opt, i) => {
        const isSelected = selectedIndices.includes(i);
        return `
          <button id="quizOptBtn_${i}" class="sim-item" onclick="toggleQuizOption(${i})" style="text-align:left;padding:0.75rem 0.95rem;cursor:pointer;border:1.5px solid ${isSelected ? 'var(--ink)' : 'var(--line)'};background:${isSelected ? '#f8f4ec' : '#fff'}">
            <div style="display:flex;align-items:center;gap:10px;width:100%">
              <div class="quiz-check-box" style="width:20px;height:20px;border-radius:6px;border:2px solid ${isSelected ? 'var(--ink)' : '#c4b9aa'};background:${isSelected ? 'var(--ink)' : '#fff'};display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;flex-shrink:0">
                ${isSelected ? '✓' : ''}
              </div>
              <div style="flex:1;min-width:0">
                <span style="font-weight:700;font-size:0.93rem;color:var(--ink)">${opt.k}:</span>
                <span style="font-size:0.84rem;color:var(--muted);line-height:1.35;margin-left:3px">${opt.d}</span>
              </div>
            </div>
          </button>
        `;
      }).join("")}
    </div>

    <div style="display:flex;gap:8px;margin-top:1.2rem">
      ${quizIndex > 0 ? `<button class="ghost-btn" style="width:auto;margin-top:0;padding:0.75rem 1.1rem" onclick="prevQuizQuestion()">Zurück</button>` : ""}
      <button class="primary" style="margin-top:0;flex:1" onclick="nextQuizQuestion()">
        ${quizIndex < list.length - 1 ? 'Weiter →' : 'Profil berechnen →'}
      </button>
    </div>
  `);
}

function toggleQuizOption(optIdx) {
  if (!quizAnswers[quizIndex]) {
    quizAnswers[quizIndex] = [];
  }
  const arr = quizAnswers[quizIndex];
  const pos = arr.indexOf(optIdx);
  if (pos > -1) {
    arr.splice(pos, 1);
  } else {
    arr.push(optIdx);
  }
  
  const btn = document.getElementById(`quizOptBtn_${optIdx}`);
  const isSelected = arr.includes(optIdx);
  if (btn) {
    btn.style.borderColor = isSelected ? 'var(--ink)' : 'var(--line)';
    btn.style.background = isSelected ? '#f8f4ec' : '#fff';
    const checkEl = btn.querySelector('.quiz-check-box');
    if (checkEl) {
      checkEl.style.borderColor = isSelected ? 'var(--ink)' : '#c4b9aa';
      checkEl.style.background = isSelected ? 'var(--ink)' : '#fff';
      checkEl.textContent = isSelected ? '✓' : '';
    }
  }
}

function nextQuizQuestion() {
  const list = getQuizList();
  const current = quizAnswers[quizIndex] || [];
  if (current.length === 0) {
    alert("Bitte wähle mindestens eine Option aus (oder mehrere, falls zutreffend).");
    return;
  }
  if (quizIndex < list.length - 1) {
    quizIndex++;
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuizQuestion() {
  if (quizIndex > 0) {
    quizIndex--;
    renderQuizQuestion();
  }
}

function finishQuiz() {
  const scores = {};
  const list = getQuizList();
  const activeP = getActiveProfile();

  quizAnswers.forEach((selectedArr, qIdx) => {
    if (!selectedArr || !list[qIdx]) return;
    selectedArr.forEach(optIdx => {
      const opt = list[qIdx].opts[optIdx];
      if (opt && opt.tags) {
        for (const k in opt.tags) {
          scores[k] = (scores[k] || 0) + opt.tags[k];
        }
      }
    });
  });

  const chosenComplexity = (scores.complexity_minimal || 0) >= 2
    ? "minimal"
    : ((scores.complexity_comprehensive || 0) >= 2 ? "comprehensive" : "basis");

  if (quizTrack === "baby") {
    appState.babyComplexity = chosenComplexity;
    if (!appState.profileSubtitles) appState.profileSubtitles = {};
    let sub = "Parfümfrei-Prio";
    if (scores.baby_dry) sub = "Trockene Barriere";
    else if (scores.baby_windel || scores.baby_diaper) sub = "Sensible Windelzone";
    else if (scores.baby_normal) sub = "Gesunde Babyhaut";
    appState.profileSubtitles.baby = sub;
    activeP.subtitle = sub;
    activeP.complexity = chosenComplexity;

    saveState();
    updateCategoryNav();

    const compLabel = chosenComplexity === "minimal" ? "Minimalistisch (2 Produkte)" : (chosenComplexity === "basis" ? "Ausgewogene Basis (3 Produkte)" : "Umfassend (4 Produkte)");

    showModalSheet(`
      <h2>Baby-Profil steht</h2>
      <p style="font-size:0.92rem;color:var(--muted)">Dein Kosmetikschrank hat die Voraussetzungen für Säuglingshaut (&lt; 3 Jahre) ermittelt:</p>
      
      <div class="tags-list" style="margin:0.8rem 0">
        <span class="tag ok">Baby (&lt; 3 J.)</span>
        <span class="tag ok">${sub}</span>
        <span class="tag ok">100% Parfümfrei</span>
        <span class="tag ok">${compLabel}</span>
      </div>

      <div class="pharma-box" style="margin-bottom:1rem">
        <div class="pharma-title">👶 Säuglingshaut-Schutz aktiv</div>
        <div class="pharma-text">Die Hautbarriere von Säuglingen ist bis zu 30% dünner und stark resorptionsfähig. Alle Produkte werden strikt auf Parfümfreiheit, reizarme Lipide und Eignung für unter 3 Jahren geprüft.</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:9px">
        <button class="primary" onclick="loadBabyPreset(); closeModal(); renderMain(); showToast('🎯 Empfohlene Baby-Starter-Routine geladen!');">
          🎯 Empfohlene Starter-Routine laden (${compLabel})
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="openBudgetRoutineModal()">
          💰 Routine nach Budget zusammenstellen (z. B. 20 €, 30 €, 50 €)
        </button>
        <button class="ghost-btn" style="margin-top:0" onclick="closeModal(); renderMain();">
          🧴 Mit leerem Schrank starten (eigene Produkte einsortieren)
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="shareKokoroProfil()">
          📤 Profil teilen (an Prim)
        </button>
        <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
          ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    `);
    return;
  }

  if (quizTrack === "child") {
    appState.childComplexity = chosenComplexity;
    if (!appState.profileSubtitles) appState.profileSubtitles = {};
    const isDry = (scores.child_dry || 0) > 0;
    const isSensibel = (scores.child_sensibel || 0) > 0;
    let sub = "Sanft & LSF 50+";
    if (isDry && isSensibel) sub = "Trocken & Sensibel";
    else if (isDry) sub = "Trocken";
    else if (isSensibel) sub = "Sensibel";
    else if (scores.child_normal) sub = "Sanft & LSF 50+";
    appState.profileSubtitles.child = sub;
    activeP.subtitle = sub;
    activeP.complexity = chosenComplexity;

    saveState();
    updateCategoryNav();

    const compLabel = chosenComplexity === "minimal" ? "Minimalistisch (2 Produkte)" : (chosenComplexity === "basis" ? "Ausgewogene Basis (3 Produkte)" : "Umfassend (4 Produkte)");

    showModalSheet(`
      <h2>Kinder-Profil steht</h2>
      <p style="font-size:0.92rem;color:var(--muted)">Dein Kosmetikschrank hat die Voraussetzungen für Kinderhaut (3–11 Jahre) ermittelt:</p>
      
      <div class="tags-list" style="margin:0.8rem 0">
        <span class="tag ok">Kind (3–11 J.)</span>
        <span class="tag ok">${sub}</span>
        <span class="tag ok">Duftstoffarm / Parfümfrei</span>
        <span class="tag ok">${compLabel}</span>
      </div>

      <div class="pharma-box" style="margin-bottom:1rem">
        <div class="pharma-title">🧒 Kinderhaut-Schutz aktiv</div>
        <div class="pharma-text">Kinderhaut benötigt keine aggressiven Säuren oder Anti-Aging-Stoffe. Die Routine konzentriert sich auf sanfte Reinigung, Feuchtigkeitsschutz und zuverlässigen Breitband-Sonnenschutz (LSF 50+).</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:9px">
        <button class="primary" onclick="loadChildPreset(); closeModal(); renderMain(); showToast('🎯 Empfohlene Kinder-Starter-Routine geladen!');">
          🎯 Empfohlene Starter-Routine laden (${compLabel})
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="openBudgetRoutineModal()">
          💰 Routine nach Budget zusammenstellen (z. B. 20 €, 30 €, 50 €)
        </button>
        <button class="ghost-btn" style="margin-top:0" onclick="closeModal(); renderMain();">
          🧴 Mit leerem Schrank starten (eigene Produkte einsortieren)
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="shareKokoroProfil()">
          📤 Profil teilen (an Prim)
        </button>
        <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
          ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    `);
    return;
  }

  if (quizTrack === "teen") {
    appState.teenComplexity = chosenComplexity;
    if (!appState.profileSubtitles) appState.profileSubtitles = {};
    const hasAcne = (scores.teen_blemish || 0) > 0 || (scores.teen_oily || 0) > 0;
    const isSensibel = (scores.teen_sensibel || 0) > 0;
    const isDry = (scores.teen_dry || 0) > 0;

    let sub = "Basis & Akne";
    if (hasAcne && isSensibel) sub = "Akne & Sensibel";
    else if (hasAcne && isDry) sub = "Akne & Trocken";
    else if (hasAcne) sub = "Akne";
    else if (isDry && isSensibel) sub = "Trocken & Sensibel";
    else if (isDry) sub = "Trocken";
    else if (isSensibel) sub = "Sensibel";
    else if (scores.teen_normal) sub = "Normale Haut";
    appState.profileSubtitles.teen = sub;
    activeP.subtitle = sub;
    activeP.complexity = chosenComplexity;

    // Soft-Prefs auch Teen (constraints-v1)
    let teenTags = Array.isArray(activeP.tags) ? activeP.tags.slice() : [];
    if (hasAcne) teenTags.push("Akne-Neigung");
    if (isSensibel) teenTags.push("Sensibel");
    if (typeof applySoftPrefsToTagList === "function") teenTags = applySoftPrefsToTagList(teenTags);
    activeP.tags = teenTags;
    appState.tags = teenTags;

    saveState();
    updateCategoryNav();

    const compLabel = chosenComplexity === "minimal" ? "Minimalistisch (2 Produkte)" : (chosenComplexity === "basis" ? "Ausgewogene Basis (3 Produkte)" : "Umfassend (4 Produkte)");

    showModalSheet(`
      <h2>Teenie-Profil steht</h2>
      <p style="font-size:0.92rem;color:var(--muted)">Dein Kosmetikschrank hat die Voraussetzungen für Teeniehaut ermittelt:</p>
      
      <div class="tags-list" style="margin:0.8rem 0">
        <span class="tag ok">Teen (12–19 J.)</span>
        <span class="tag ok">${sub}</span>
        <span class="tag ok">${compLabel}</span>
      </div>

      <div class="pharma-box" style="margin-bottom:1rem">
        <div class="pharma-title">👱 Teeniehaut-Balance aktiv</div>
        <div class="pharma-text">Fokus auf evidenzbasierte Klärung von Talg & Mitessern ohne schwere Anti-Aging-Stoffe oder barrierezerstörende aggressive Alkohole.</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:9px">
        <button class="primary" onclick="loadTeenPreset(); closeModal(); renderMain(); showToast('🎯 Empfohlene Teenie-Starter-Routine geladen!');">
          🎯 Empfohlene Starter-Routine laden (${compLabel})
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="openBudgetRoutineModal()">
          💰 Routine nach Budget zusammenstellen (z. B. 20 €, 30 €, 50 €)
        </button>
        <button class="ghost-btn" style="margin-top:0" onclick="closeModal(); renderMain();">
          🧴 Mit leerem Schrank starten (eigene Produkte einsortieren)
        </button>
        <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="shareKokoroProfil()">
          📤 Profil teilen (an Prim)
        </button>
        <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
          ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    `);
    return;
  }

  // Adult scoring
  let newTags = [];

  // Feuchte / Sebum-Achse:
  const isDry = (scores.trocken || 0) >= 2;
  const isOily = (scores.oelig || 0) >= 2;
  const isMixed = (scores.misch || 0) >= 2 || (isDry && isOily);
  const isHealthy = ((scores.normal || 0) >= 1 || (scores.rein || 0) >= 1 || (scores.gesunde_haut || 0) >= 1 || (scores.praevention || 0) >= 1) && !isDry && !isOily;

  if (isHealthy) {
    newTags.push("Gesunde Haut");
  } else if (isMixed) {
    newTags.push("Mischhaut");
  } else if (isDry) {
    newTags.push("Trocken");
  } else if (isOily) {
    newTags.push("Ölig");
  } else if ((scores.normal || 0) >= 1) {
    newTags.push("Normale Haut");
  } else {
    newTags.push("Ausgeglichen");
  }

  // Barriere & Reaktivität:
  if ((scores.sensibel || 0) >= 2) newTags.push("Sensibel");
  if ((scores.barrier || 0) >= 2) newTags.push("Barriere-fragil");
  if ((scores.rasur || 0) >= 1) newTags.push("Rasur-sensibel");

  // Unreinheiten:
  if ((scores["akne-prone"] || 0) >= 2) newTags.push("Akne-Neigung");
  if ((scores["arzt-thema"] || 0) >= 1) newTags.push("Arzt-Thema");

  // Melanin & Pigmentierung (Skin of Color / Fitzpatrick IV-VI / PIH):
  if ((scores["pih-prone"] || 0) >= 2) newTags.push("PIH-prone");
  if ((scores["skin-of-color"] || 0) >= 2) newTags.push("Skin-of-Color");
  if ((scores["zero_white_cast_prio"] || 0) >= 2) newTags.push("Zero-White-Cast");
  if ((scores["iron_oxide_prio"] || 0) >= 2) newTags.push("Eisenoxid-Schutz");

  // Filter & Werte:
  if (scores.duftstofffrei) newTags.push("Parfümfrei");
  if (scores.cruelty_free) newTags.push("Cruelty-Free");
  if ((scores.praevention || 0) >= 1 || isHealthy) newTags.push("Prävention & LSF");

  // Begleitpflege / Rx:
  const isBegleit = (scores.begleitpflege || 0) > 0 || (scores.rx || 0) > 0;
  if (isBegleit) newTags.push("Rx-Begleitpflege");

  // Soft-Prefs (constraints-v1 Entscheidungen 2026-09-08): abwählbar
  if (typeof applySoftPrefsToTagList === "function") {
    const before = newTags.slice();
    newTags = applySoftPrefsToTagList(newTags);
    // Merker für UI-Chips
    quizSoftPrefsAdded = newTags.filter(t => !before.includes(t));
  }

  // Routine-Komplexität (Aufwand):
  if (chosenComplexity === "minimal") {
    appState.routineComplexity = "minimal";
    newTags.push("2 Schritte (Minimal)");
  } else if (chosenComplexity === "comprehensive") {
    appState.routineComplexity = "comprehensive";
    newTags.push("4–5 Schritte (Umfassend)");
  } else {
    appState.routineComplexity = "basis";
    newTags.push("3 Schritte (Basis)");
  }

  appState.tags = newTags;
  appState.view = "cabinet";

  if (!appState.profileSubtitles) appState.profileSubtitles = {};
  const adultSub = computeAdultSubtitleFromTags(newTags);
  appState.profileSubtitles.adult = adultSub;
  activeP.subtitle = adultSub;
  activeP.tags = newTags;
  activeP.complexity = appState.routineComplexity;

  let pharmaTitle = "🛡️ Schutz-Profil aktiviert";
  let pharmaDesc = "";

  if (isBegleit) {
    pharmaTitle = "🛡️ Begleitpflege-Modus aktiv";
    pharmaDesc = "Deine Routine schützt deine Haut während der Behandlung vor Säure-Stacking und reizenden Duftstoffen.";
  } else if (newTags.includes("Gesunde Haut")) {
    pharmaTitle = "✨ Gesunderhaltung & Prävention aktiv";
    pharmaDesc = "<strong>Jede Haut profitiert von täglichem Schutz:</strong> Deine Haut ist im Gleichgewicht! Die 3 wichtigsten evidenzbasierten Säulen: Sanfte Reinigung (befreit von Schweiß & Feinstaub), leichte Feuchtigkeit und täglicher Breitband-LSF (30–50) als #1 Schutz gegen vorzeitige Hautalterung und Zellschäden.";
  } else {
    pharmaTitle = "🛡️ Individueller Barriere-Filter aktiv";
    pharmaDesc = "Produkte werden ab sofort gegen deine Feuchte- und Empfindlichkeits-Tags geprüft, um Reiz-Stacking zu verhindern.";
  }

  const hasAcneOrRx = newTags.some(function (t) { return /akne|unrein/i.test(String(t||"")); }) || newTags.includes("Arzt-Thema") || isBegleit;
  const compLabel = appState.routineComplexity === "minimal" ? "Minimalistisch (2 Produkte)" : (appState.routineComplexity === "basis" ? "Ausgewogene Basis (3 Produkte)" : "Umfassend (4–5 Produkte)");

  saveState();
  updateCategoryNav();

  showModalSheet(`
    <h2>Dein Hautprofil steht</h2>
    <p style="font-size:0.92rem;color:var(--muted)">Dein Kosmetikschrank hat deine Voraussetzungen ermittelt:</p>
    
    <div class="tags-list" style="margin:0.8rem 0">
      ${newTags.map(t => {
        const soft = (t === 'Parfümfrei' || t === 'NC-Preference');
        const auto = (typeof quizSoftPrefsAdded !== 'undefined') && quizSoftPrefsAdded.includes(t);
        const cls = t === 'Rx-Begleitpflege' ? 'rx' : (t === 'Gesunde Haut' ? 'ok' : '');
        if (soft && auto) {
          return `<span class="tag ${cls}" title="Soft-Preference (abwählbar)" style="cursor:pointer" onclick="removeSoftPrefTag('${t}'); this.remove();">${t} ×</span>`;
        }
        return `<span class="tag ${cls}">${t}</span>`;
      }).join("")}
    </div>
    ${(quizSoftPrefsAdded && quizSoftPrefsAdded.length) ? `<div style="font-size:0.78rem;color:var(--muted);margin:-0.4rem 0 0.8rem">Soft-Prefs (Tippen zum Abwählen): ${quizSoftPrefsAdded.join(', ')}</div>` : ''}

    <div style="background:#f4ece0;border-radius:10px;padding:8px 12px;font-size:0.84rem;font-weight:600;color:#5a4328;margin-bottom:0.9rem">
      🎯 Gewählter Umfang: <strong>${compLabel}</strong>
    </div>

    <div class="pharma-box" style="margin-bottom:1rem">
      <div class="pharma-title">${pharmaTitle}</div>
      <div class="pharma-text">${pharmaDesc}</div>
    </div>

    ${hasAcneOrRx ? `
      <div style="background:#edf2fa;border:1px solid #c5d4ea;border-radius:12px;padding:0.85rem 1rem;margin-bottom:1.1rem">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <span style="font-size:1.4rem;line-height:1">🩺</span>
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.92rem;color:var(--rx)">Dermatologie & Ärztliche Optionen (Rx)</div>
            <div style="font-size:0.82rem;color:var(--muted);line-height:1.35;margin-top:2px">
              Kosmetik stößt bei tieferen Entzündungen & Unterlagerungen an gesetzliche Grenzen. Erfahre, wann der Hautarztbesuch ratsam ist und welche 4 echten Wirkstoffklassen verschrieben werden.
            </div>
            <button class="btn-text" style="color:var(--rx);margin-top:6px;font-weight:700;padding:2px 0;font-size:0.84rem" onclick="openDoctorGuideModal()">
              ➔ Hautarzt- & Rx-Wegweiser öffnen
            </button>
          </div>
        </div>
      </div>
    ` : ""}

    <div style="display:flex;flex-direction:column;gap:9px">
      <button class="primary" onclick="applyStarterRoutine()">
        🎯 Empfohlene Starter-Routine laden (${compLabel})
      </button>
      <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="openBudgetRoutineModal()">
        💰 Routine nach Budget zusammenstellen (z. B. 20 €, 30 €, 50 €)
      </button>
      <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="openMarketGuideModal()">
        🛒 Markt-Navigator: Beste Produkte für dein Profil
      </button>
      <button class="ghost-btn" style="margin-top:0" onclick="startWithEmptyCabinet(); closeModal();">
        🧴 Mit leerem Schrank starten (eigene Produkte einsortieren)
      </button>
      <button class="ghost-btn" style="margin-top:0;display:flex;align-items:center;justify-content:center;gap:6px" onclick="shareKokoroProfil()">
        📤 Profil teilen (an Prim)
      </button>
      <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>
    </div>
  `);
}

function applyStarterRoutine() {
  const comp = appState.routineComplexity || "basis";
  const routineId = typeof getSelectedIdealRoutineId === "function" ? getSelectedIdealRoutineId() : "acne_barrier";
  if (typeof syncAdultRoutineToComplexity === "function") {
    syncAdultRoutineToComplexity(comp, routineId, true);
  } else {
    appState.am = ["baleaWash", "baleaSpf"];
    appState.pm_a = ["baleaWash", "baleaCreme"];
    appState.pm_b = ["baleaWash", "baleaCreme"];
    appState.pm_c = ["baleaWash", "baleaCreme"];
  }

  appState.am = sortRoutine(appState.am, true);
  appState.pm_a = sortRoutine(appState.pm_a, false);
  appState.pm_b = sortRoutine(appState.pm_b, false);
  appState.pm_c = sortRoutine(appState.pm_c, false);

  saveState();
  closeModal();
  renderMain();
  const sub = (appState.profileSubtitles && appState.profileSubtitles.adult) || "Routine";
  showToast(`🎯 Starter-Routine (${sub}) in den Schrank gestellt!`);
}

window.openQuizModal = openQuizModal;
window.renderQuizCountryStep = renderQuizCountryStep;
window.proceedAfterQuizCountry = proceedAfterQuizCountry;

