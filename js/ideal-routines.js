// ==========================================
// Typ-Regal & Ideal-Vergleich Module
// (Adult, Teenie, Kind, Baby)
// ==========================================

const IDEAL_ROUTINES = {
  acne_barrier: {
    id: "acne_barrier",
    name: "Akne & Barriere-Schutz",
    badge: "Rx / Akne / Sensibel",
    color: "#206845",
    desc: "Evidenzbasiert bei unreiner Haut, Pickeln, Rx-Therapie (Adapalen/Clienzo) oder empfindlicher Barriere. Sanfte Tenside, Rötungshemmung und Reparatur ohne komedogene Öle.",
    am: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Tensid-mild & parfümfrei – greift die Säureschutzschicht nicht an" },
      { slotKey: "serum", slotName: "2. Hydratisieren", prodId: "ha", why: "Gibt tiefenwirksame Feuchtigkeit ohne Poren mit Lipiden zu belasten" },
      { slotKey: "active", slotName: "3. Wirkstoff", prodId: "apad", why: "PAD (Azelain-Derivat): Hemmt Entzündungen & Rötungen reizarm" },
      { slotKey: "creme", slotName: "4. Barrierecreme", prodId: "baleaCreme", why: "Cica & Panthenol reparieren schälende oder brennende Stellen" },
      { slotKey: "spf", slotName: "5. LSF 50+", prodId: "baleaSpf", why: "Breitband-UV-Schutz verhindert postinflammatorische Pickelmale (PIH)" }
    ],
    pm_a: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Entfernt sanft Schweiß, Talg und den LSF des Tages" },
      { slotKey: "serum", slotName: "2. Hydratisieren", prodId: "purito", why: "10% Panthenol als Pufferschicht vor dem Retinoid" },
      { slotKey: "active", slotName: "3. Nacht-Active", prodId: "adap", why: "Medizinisches Retinoid: Normalisiert Zellteilung in der Pore" },
      { slotKey: "creme", slotName: "4. Nachtpflege", prodId: "baleaCreme", why: "Schließt Wirkstoffe ein und verhindert transepidermalen Wasserverlust" }
    ],
    pm_b: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Sanfte porentiefe Reinigung ohne Austrocknen" },
      { slotKey: "active", slotName: "2. Akut-Active", prodId: "clienzo", why: "BPO 5% bekämpft C. acnes Bakterien bei akuten Pusteln" },
      { slotKey: "creme", slotName: "3. Barrierecreme", prodId: "baleaCreme", why: "Intensive Pflege gegen das Austrocknen durch BPO" }
    ],
    pm_c: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Reizarme Reinigung für die Regenerationsnacht" },
      { slotKey: "serum", slotName: "2. SOS-Hydrator", prodId: "purito", why: "Reichhaltiges Panthenol zur Beruhigung von Mikrorissen" },
      { slotKey: "creme", slotName: "3. SOS-Balsam", prodId: "mixaPanthenol", why: "13% Glycerin + Panthenol zur vollständigen Barriere-Erholung" }
    ]
  },
  oily_pores: {
    id: "oily_pores",
    name: "Ölig & Poren-Balance",
    badge: "Sebum / Mitesser / Glanz",
    color: "#0891b2",
    desc: "Für Haut mit Sebum-Überschuss, Mitessern und vergrößerten Poren. Fettlösliche Salicylsäure und talgregulierendes Niacinamid.",
    am: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "isanaWash", why: "Klärt überschüssiges Sebum der Nacht porentief und reizarm" },
      { slotKey: "serum", slotName: "2. Wirkstoff-Serum", prodId: "bbomb", why: "10% Niacinamid + Zink: Reguliert Talgproduktion und verfeinert Poren" },
      { slotKey: "creme", slotName: "3. Leichte Pflege", prodId: "isanaCreme", why: "Leichte Formulierung, spendet Feuchtigkeit ohne Glanz oder Fettfilm" },
      { slotKey: "spf", slotName: "4. Matt-LSF 50+", prodId: "baleaSpf", why: "Leichtes Sonnenfluid, klebt nicht und verstopft keine Poren" }
    ],
    pm: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "isanaWash", why: "Befreit verstopfte Poren von Talg und Umweltschmutz" },
      { slotKey: "active", slotName: "2. Peeling-Active", prodId: "bha", why: "2% Salicylsäure (BHA) dringt fettlöslich in die Pore ein und löst Talgpfropfen" },
      { slotKey: "creme", slotName: "3. Nachtpflege", prodId: "isanaCreme", why: "Beruhigende Feuchtigkeit mit Panthenol nach dem Peeling" }
    ]
  },
  dry_fragile: {
    id: "dry_fragile",
    name: "Trocken & Sensibel",
    badge: "Spannung / Trockenheit / Schuppen",
    color: "#b45309",
    desc: "Für trockene, schuppende oder leicht gerötete Haut, die spannt. Hohe Zufuhr von Ceramiden, Ectoin und regenerierenden Lipiden.",
    am: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "ceraveWash", why: "Cremige, nicht schäumende Waschlotion mit 3 essentiellen Ceramiden" },
      { slotKey: "serum", slotName: "2. Tiefen-Hydrator", prodId: "noHydrator", why: "Ectoin & Panthenol binden Wasser langanhaltend in den oberen Hautschichten" },
      { slotKey: "creme", slotName: "3. Reichhaltige Creme", prodId: "ceraveMoist", why: "MVE-Technologie gibt Ceramide über den Tag verteilt an die Haut ab" },
      { slotKey: "spf", slotName: "4. Schutz & LSF 50+", prodId: "anthelios", why: "Mexoryl 400 schützt vor tiefer UV-Zellalterung ohne die Augen zu reizen" }
    ],
    pm: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "ceraveWash", why: "Reinigt ultra-sanft, ohne Lipide aus der Barriere zu waschen" },
      { slotKey: "serum", slotName: "2. Hyaluron-Puffer", prodId: "ha", why: "Plumpt die Haut und mindert Trockenheitsfältchen über Nacht" },
      { slotKey: "creme", slotName: "3. Barriere-Regeneration", prodId: "mixaPanthenol", why: "Intensive Lipidschicht für spürbar geschmeidige Haut am Morgen" }
    ]
  },
  healthy_glow: {
    id: "healthy_glow",
    name: "Gesunde Haut & Prävention",
    badge: "Gesunderhaltung & Glow",
    color: "#16a34a",
    desc: "Deine Haut ist im Gleichgewicht! Die 3 evidenzbasierten Grundpfeiler: Sanfte Klärung, Feuchte-Balance und maximaler täglicher UV-Schutz.",
    am: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Befreit mild von Schweiß und bereitet auf den Tag vor" },
      { slotKey: "serum", slotName: "2. Feuchtigkeitsserum", prodId: "noHydrator", why: "Schützt vor oxidativem Stress und hält die Feuchtebarriere stabil" },
      { slotKey: "creme", slotName: "3. Tagespflege", prodId: "isanaCreme", why: "Unkomplizierte, leichte Feuchtigkeitscreme für den ganzen Tag" },
      { slotKey: "spf", slotName: "4. LSF 50+ Schutz", prodId: "anthelios", why: "Goldstandard-Sonnenschutz: Der wichtigste Schritt gegen vorzeitige Hautalterung" }
    ],
    pm: [
      { slotKey: "reiniger", slotName: "1. Reinigung", prodId: "baleaWash", why: "Wäscht Feinstaub und Sonnenfilter rückstandslos ab" },
      { slotKey: "serum", slotName: "2. Hydratisieren", prodId: "ha", why: "Hyaluron-Puffer für die nächtliche Zellregeneration" },
      { slotKey: "creme", slotName: "3. Nachtpflege", prodId: "baleaCreme", why: "Unterstützt die natürliche nächtliche Barriere-Reparatur" }
    ]
  }
};

const TEEN_IDEAL_ROUTINE = [
  { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "t_item_24", title: "CeraVe Ausgleichender Reinigungsschaum", why: "Befreit von Talg & Schmutz ohne die Barriere anzugreifen · Ohne aggressives Alkohol-Gel" },
  { slotKey: "active", slotName: "2. Gezielter Wirkstoff", prodId: "t_item_52", title: "Eucerin DERMOPURE Klärendes Tonic", why: "Sanfte Salicylsäure (BHA) gegen Mitesser · Verhindert Pickel ohne aggressive Anti-Aging-Stoffe" },
  { slotKey: "creme", slotName: "3. Leichte Feuchtigkeit", prodId: "t_item_25", title: "CeraVe Feuchtigkeitsspendendes HA Water Gel", why: "Ölfreie Feuchtigkeit mit Hyaluron & Ceramiden – schützt vor Schuppen & Spannungsgefühl" },
  { slotKey: "spf", slotName: "4. Täglicher Sonnenschutz", prodId: "t_ean_4005900261038", title: "NIVEA SUN Protect & Sensitive LSF 30", why: "Mattierender Schutz gegen Pickelmale (PIH) & UV-Schäden" }
];

function getSelectedIdealRoutineId() {
  if (window.selectedIdealRoutineId) {
    return window.selectedIdealRoutineId;
  }
  const tags = appState.tags || [];
  if (tags.includes("Rx-Begleitpflege") || tags.includes("Akne-prone") || tags.includes("Arzt-Thema")) {
    return "acne_barrier";
  }
  if (tags.includes("Ölig") || tags.includes("Mischhaut")) {
    return "oily_pores";
  }
  if (tags.includes("Trocken") || tags.includes("Barriere-fragil") || tags.includes("Sensibel")) {
    return "dry_fragile";
  }
  if (tags.includes("Gesunde Haut") || tags.includes("Normale Haut") || tags.includes("Prävention & LSF")) {
    return "healthy_glow";
  }
  return "acne_barrier";
}

function setIdealRoutineType(typeId) {
  window.selectedIdealRoutineId = typeId;
  if (!appState.profileSubtitles) appState.profileSubtitles = {};
  let sub = "Akne & Barriere";
  if (typeId === "dry_fragile") {
    sub = "Trocken & Sensibel";
  } else if (typeId === "oily_pores") {
    sub = "Ölig & Poren";
  } else if (typeId === "healthy_glow") {
    sub = "Gesunde Haut";
  } else if (typeId === "acne_barrier") {
    sub = "Akne & Barriere";
  }
  appState.profileSubtitles.adult = sub;
  const p = getActiveProfile();
  if (p && p.category === "adult") {
    p.subtitle = sub;
  }
  saveState();
  renderMain();
}

function setIdealRoutineComplexity(comp) {
  appState.routineComplexity = comp;
  const p = getActiveProfile();
  if (p && p.category === "adult") {
    p.complexity = comp;
  }
  saveState();
  renderMain();
  const label = comp === "minimal" ? "Minimalistisch (2 Produkte)" : (comp === "basis" ? "Ausgewogene Basis (3 Produkte)" : "Umfassend (4–5 Produkte)");
  showToast(`🎯 Routine-Aufwand auf <strong>${label}</strong> angepasst!`);
}

function getIdealRoutineSteps(routine, tab, complexity) {
  const comp = complexity || appState.routineComplexity || "basis";
  const isAM = tab === "am";
  const id = routine.id;

  if (comp === "minimal") {
    if (isAM) {
      if (id === "oily_pores") {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "isanaPure", why: "Sanfter Schaum klärt überschüssigen Talg ohne Rückfettungsschub." },
          { slotKey: "spf", slotName: "2. Mattierender LSF 50+", prodId: "niveaSunMatt", why: "Breitbandschutz mit mattierendem Finish – schützt vor Sebum-Oxidation." }
        ];
      } else if (id === "dry_fragile") {
        return [
          { slotKey: "reiniger", slotName: "1. Feuchtreinigung", prodId: "ceraveWash", why: "Nicht-schäumende Waschlotion mit 3 Ceramiden schont trockene Haut." },
          { slotKey: "spf", slotName: "2. Pflegender LSF 50+", prodId: "anthelios", why: "UVMune 400 mit feuchtigkeitsspendender Cremebasis – LSF und Pflege in 1 Schritt." }
        ];
      } else {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Tensid-mild & parfümfrei – greift die Schutzbarriere nicht an." },
          { slotKey: "spf", slotName: "2. Feuchtigkeits-LSF 50+", prodId: "baleaSpf", why: "Leichtes Sonnenfluid mit Hyaluron: Spendet Feuchtigkeit & schützt vor UV-Schäden." }
        ];
      }
    } else {
      // PM Minimal (2 Produkte)
      if (id === "acne_barrier") {
        if (appState.pmMode === "b") {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Porentiefe, reizarme Reinigung vor dem BPO." },
            { slotKey: "active", slotName: "2. Akut-Active", prodId: "clienzo", why: "BPO 5% bekämpft Entzündungen bei akuten Pickeln direkt." }
          ];
        } else if (appState.pmMode === "c") {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Reizarme Reinigung für die Barriere-Erholung." },
            { slotKey: "creme", slotName: "2. SOS-Barrierebalsam", prodId: "mixaPanthenol", why: "Reichhaltiges Panthenol zur Regeneration der Hornschicht." }
          ];
        } else {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Entfernt Schweiß, Talg und LSF sanft." },
            { slotKey: "active", slotName: "2. Nacht-Active", prodId: "adap", why: "Medizinisches Retinoid gegen Verhornung in den Poren." }
          ];
        }
      } else if (id === "oily_pores") {
        return [
          { slotKey: "reiniger", slotName: "1. Klärende Reinigung", prodId: "isanaPure", why: "Befreit verstopfte Poren von Talg und Schmutzpartikeln." },
          { slotKey: "active", slotName: "2. Poren-Peeling (BHA)", prodId: "bhaLiquid", why: "2% Salicylsäure dringt in die Poren ein und löst Talgpfropfen." }
        ];
      } else if (id === "dry_fragile") {
        return [
          { slotKey: "reiniger", slotName: "1. Barriere-Reinigung", prodId: "ceraveWash", why: "Milde Lotion reinigt ohne transepidermalen Wasserverlust." },
          { slotKey: "creme", slotName: "2. Ceramid-Nachtcreme", prodId: "ceraveCreme", why: "Reichhaltige Lipide regenerieren die Lipiddoppelschicht über Nacht." }
        ];
      } else {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Sanfte Reinigung befreit die Haut von Rückständen des Tages." },
          { slotKey: "creme", slotName: "2. Barriere-Nachtpflege", prodId: "baleaCreme", why: "Cica & Panthenol unterstützen die nächtliche Regeneration." }
        ];
      }
    }
  } else if (comp === "basis") {
    if (isAM) {
      if (id === "oily_pores") {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "isanaPure", why: "Sanfter Schaum klärt Talg reizarm." },
          { slotKey: "active", slotName: "2. Sebum-Regulator", prodId: "bbomb", why: "10% Niacinamid + Zink normalisiert die Talgproduktion." },
          { slotKey: "spf", slotName: "3. Mattierender LSF 50+", prodId: "niveaSunMatt", why: "Schützt vor UV-Schäden und verhindert Glanz." }
        ];
      } else if (id === "dry_fragile") {
        return [
          { slotKey: "reiniger", slotName: "1. Feuchtreinigung", prodId: "ceraveWash", why: "Schont die empfindliche Barriere." },
          { slotKey: "serum", slotName: "2. Tiefen-Hydrator", prodId: "liquidHydrator", why: "Ectoin & Feuchtigkeitsfaktoren binden Wasser in der Hornschicht." },
          { slotKey: "spf", slotName: "3. Creme-LSF 50+", prodId: "anthelios", why: "Höchster UVA-Schutz mit nährender Textur." }
        ];
      } else if (id === "healthy_glow") {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Milde Reinigung ohne Schaum-Aggression." },
          { slotKey: "serum", slotName: "2. Hyaluron-Serum", prodId: "ha", why: "Sorgt für elastischen Glow & pralle Frische." },
          { slotKey: "spf", slotName: "3. Tages-LSF 50+", prodId: "baleaSpf", why: "Breitband-UV-Schutz als #1 Prävention gegen Hautalterung." }
        ];
      } else {
        // acne_barrier
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Tensid-mild & parfümfrei – greift die Säureschutzschicht nicht an." },
          { slotKey: "active", slotName: "2. Rötungshemmung", prodId: "apad", why: "PAD (Azelain-Derivat): Beruhigt Entzündungen reizarm." },
          { slotKey: "spf", slotName: "3. Tages-LSF 50+", prodId: "baleaSpf", why: "Breitband-Schutz verhindert postinflammatorische Pickelmale (PIH)." }
        ];
      }
    } else {
      // PM Basis (3 Produkte)
      if (id === "acne_barrier") {
        if (appState.pmMode === "b") {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Porentiefe, reizarme Reinigung." },
            { slotKey: "active", slotName: "2. Akut-Active", prodId: "clienzo", why: "BPO 5% bekämpft Entzündungen direkt." },
            { slotKey: "creme", slotName: "3. Barrierecreme", prodId: "baleaCreme", why: "Cica schützt vor BPO-Austrocknung." }
          ];
        } else if (appState.pmMode === "c") {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Reizarme Reinigung für die Ruhe-Nacht." },
            { slotKey: "serum", slotName: "2. SOS-Hydrator", prodId: "purito", why: "Panthenol zur Milderung von Spannungsgefühl." },
            { slotKey: "creme", slotName: "3. SOS-Balsam", prodId: "mixaPanthenol", why: "13% Glycerin + Panthenol versiegelt die Haut." }
          ];
        } else {
          return [
            { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Entfernt Schweiß, Talg und LSF sanft." },
            { slotKey: "active", slotName: "2. Nacht-Active", prodId: "adap", why: "Medizinisches Retinoid: Normalisiert die Zellteilung in der Pore." },
            { slotKey: "creme", slotName: "3. Nachtpflege", prodId: "baleaCreme", why: "Cica & Panthenol verhindern Reizungen." }
          ];
        }
      } else if (id === "oily_pores") {
        return [
          { slotKey: "reiniger", slotName: "1. Klärende Reinigung", prodId: "isanaPure", why: "Befreit die Poren ohne Austrocknung." },
          { slotKey: "active", slotName: "2. Poren-Peeling (BHA)", prodId: "bhaLiquid", why: "Salicylsäure beugt Mitessern und Glanz vor." },
          { slotKey: "creme", slotName: "3. Leichtes Gel", prodId: "baleaAqua", why: "Ölfreie Feuchtigkeit ohne Porenverstopfung." }
        ];
      } else if (id === "dry_fragile") {
        return [
          { slotKey: "reiniger", slotName: "1. Barriere-Reinigung", prodId: "ceraveWash", why: "Schonende Reinigung mit Ceramiden." },
          { slotKey: "serum", slotName: "2. Tiefen-Hydrator", prodId: "liquidHydrator", why: "Füllt die Feuchtigkeitsspeicher der Haut auf." },
          { slotKey: "creme", slotName: "3. Ceramid-Creme", prodId: "ceraveCreme", why: "3 essenzielle Ceramide reparieren die Barriere über Nacht." }
        ];
      } else {
        return [
          { slotKey: "reiniger", slotName: "1. Milde Reinigung", prodId: "baleaWash", why: "Milde, rückstandsfreie Gesichtsreinigung." },
          { slotKey: "serum", slotName: "2. Feuchtigkeitspuffer", prodId: "ha", why: "Hyaluronsäure bindet Feuchtigkeit im Gewebe." },
          { slotKey: "creme", slotName: "3. Regenerationscreme", prodId: "baleaCreme", why: "Stärkt die Barriere für den nächsten Tag." }
        ];
      }
    }
  } else {
    // "comprehensive": alle definierten Schritte (4-5)
    return isAM ? routine.am : (routine[`pm_${appState.pmMode}`] || routine.pm || routine.pm_a);
  }
}

function checkSlotCovered(slotKey, tab) {
  const list = (tab === "am") ? appState.am : getActivePMList();
  for (const id of list) {
    const p = DB[id] || (typeof TEEN_DB !== "undefined" ? TEEN_DB[id] : null);
    if (!p) continue;
    if (slotKey === "reiniger" && p.kat === "reiniger") return p;
    if (slotKey === "serum" && (p.kat === "serum" || (p.klassen && p.klassen.includes("humectant")))) return p;
    if (slotKey === "active" && (p.kat === "active" || p.kat === "spot" || p.rx || (p.klassen && p.klassen.some(k => ["azelaic", "retinoid_rx", "retinoid_cos", "bha", "aha", "niacinamide"].includes(k))))) return p;
    if (slotKey === "creme" && p.kat === "creme") return p;
    if (slotKey === "spf" && (p.kat === "spf" || (p.klassen && p.klassen.includes("uv")))) return p;
  }
  return null;
}

function adoptIdealProduct(prodId, targetTab) {
  const tab = targetTab || appState.tab;
  addProductToSlot(prodId, tab);
  const p = DB[prodId];
  const name = p ? p.name : "Produkt";
  showToast(`✨ <strong>${name}</strong> in deinen Schrank gestellt!`);
}

function adoptAllMissingProducts(targetTab) {
  const tab = targetTab || appState.tab;
  const routineId = getSelectedIdealRoutineId();
  const routine = IDEAL_ROUTINES[routineId];
  if (!routine) return;

  const currentComplexity = appState.routineComplexity || "basis";
  const steps = getIdealRoutineSteps(routine, tab, currentComplexity);
  let count = 0;

  steps.forEach(st => {
    const isCovered = checkSlotCovered(st.slotKey, tab);
    if (!isCovered) {
      if (tab === "am") {
        if (!appState.am.includes(st.prodId)) {
          appState.am.push(st.prodId);
          count++;
        }
      } else {
        const pmList = (appState.pmMode === "a" ? appState.pm_a : (appState.pmMode === "b" ? appState.pm_b : appState.pm_c));
        if (!pmList.includes(st.prodId)) {
          pmList.push(st.prodId);
          count++;
        }
      }
    }
  });

  if (tab === "am") appState.am = sortRoutine(appState.am, true);
  else {
    if (appState.pmMode === "a") appState.pm_a = sortRoutine(appState.pm_a, false);
    else if (appState.pmMode === "b") appState.pm_b = sortRoutine(appState.pm_b, false);
    else appState.pm_c = sortRoutine(appState.pm_c, false);
  }

  saveState();
  renderMain();
  if (count > 0) {
    showToast(`⚡ <strong>${count} fehlende Produkte</strong> in deinen Schrank gestellt!`);
  } else {
    showToast(`✓ Alle Schritte sind bereits in deinem Schrank.`);
  }
}

function adoptTeenProductToSlot(prodId, slotKey) {
  if (!appState.teen[slotKey]) appState.teen[slotKey] = [];
  if (!appState.teen[slotKey].includes(prodId)) {
    appState.teen[slotKey].push(prodId);
  }
  saveState();
  renderMain();
  const p = TEEN_DB[prodId];
  const name = p ? p.name : "Produkt";
  showToast(`✨ <strong>${name}</strong> in deinen Teenie-Schrank gestellt!`);
}


function renderTypRegal(tab, currentList) {
  const routineId = getSelectedIdealRoutineId();
  const routine = IDEAL_ROUTINES[routineId] || IDEAL_ROUTINES.acne_barrier;
  const isAM = tab === "am";
  const currentComplexity = appState.routineComplexity || "basis";
  const steps = getIdealRoutineSteps(routine, tab, currentComplexity);

  let coveredCount = 0;
  steps.forEach(st => {
    if (checkSlotCovered(st.slotKey, tab)) coveredCount++;
  });
  const totalCount = steps.length;
  const missingCount = totalCount - coveredCount;
  const pct = Math.round((coveredCount / totalCount) * 100);

  const pills = [
    { id: "acne_barrier", label: "Akne & Barriere (Rx)" },
    { id: "oily_pores", label: "Ölig & Poren" },
    { id: "dry_fragile", label: "Trocken & Sensibel" },
    { id: "healthy_glow", label: "Gesund & Prävention" }
  ];

  return `
    <div class="typ-regal-container" id="typRegalContainer">
      <div class="typ-regal-shelf-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gold);margin-bottom:2px">
              <span>🪵</span> Typ-Regal · Nebeneinander-Vergleich
            </div>
            <h3 style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.24rem;margin:0 0 3px;letter-spacing:-0.01em">
              So könnte eine passende ${isAM ? 'Morgen-Routine' : 'Abend-Routine'} für deinen Hauttyp aussehen
            </h3>
          </div>
          <span class="tag" style="background:#f4ece0;color:#5a4328;font-weight:700">
            ${routine.badge}
          </span>
        </div>

        <p style="font-size:0.83rem;color:var(--muted);margin:6px 0 10px;line-height:1.4">
          ${routine.desc}
        </p>

        <!-- Routine-Umfang / Komplexitäts-Umschalter -->
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          <span style="font-size:0.74rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em">Routine-Aufwand:</span>
          <div class="ideal-type-pills">
            <button type="button" class="ideal-type-pill ${currentComplexity === 'minimal' ? 'active' : ''}" onclick="setIdealRoutineComplexity('minimal')">
              ⚡ 2 Produkte (Minimal)
            </button>
            <button type="button" class="ideal-type-pill ${currentComplexity === 'basis' ? 'active' : ''}" onclick="setIdealRoutineComplexity('basis')">
              🌿 3 Produkte (Basis)
            </button>
            <button type="button" class="ideal-type-pill ${currentComplexity === 'comprehensive' ? 'active' : ''}" onclick="setIdealRoutineComplexity('comprehensive')">
              ✨ 4–5 Produkte (Umfassend)
            </button>
          </div>
        </div>

        <!-- Hauttyp-Umschalter -->
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:0.74rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.03em">Hauttyp wählen:</span>
          <div class="ideal-type-pills">
            ${pills.map(p => `
              <button type="button" class="ideal-type-pill ${p.id === routineId ? 'active' : ''}" onclick="setIdealRoutineType('${p.id}')">
                ${p.label}
              </button>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Abdeckungs-Balken & Schnell-Aktion -->
      <div class="coverage-bar-card">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:700;margin-bottom:5px">
            <span>Routine-Abdeckung: ${coveredCount} von ${totalCount} Schritten belegt</span>
            <span style="color:${pct === 100 ? 'var(--ok)' : 'var(--ink)'}">${pct}%</span>
          </div>
          <div class="coverage-progress">
            <div class="coverage-progress-fill" style="width:${pct}%;background:${pct === 100 ? '#16a34a' : (pct >= 50 ? '#206845' : '#d97706')}"></div>
          </div>
        </div>
        <div>
          ${missingCount > 0 ? `
            <button type="button" class="btn-adopt" style="font-size:0.76rem;padding:6px 11px" onclick="adoptAllMissingProducts('${tab}')">
              ⚡ Alle ${missingCount} Lücken füllen
            </button>
          ` : `
            <span style="font-size:0.78rem;font-weight:700;color:#166534;background:#dcfce7;padding:4px 9px;border-radius:6px;display:inline-flex;align-items:center;gap:4px">
              ✓ Komplett abgedeckt
            </span>
          `}
        </div>
      </div>

      <!-- Vergleichs-Karten (Was habe ich vs. Was wäre sinnvoll) -->
      <div class="typ-compare-list">
        ${steps.map((st, idx) => {
          const idealP = DB[st.prodId];
          if (!idealP) return "";
          const isIdentical = currentList.includes(st.prodId);
          const coveredP = checkSlotCovered(st.slotKey, tab);

          return `
            <div class="typ-compare-card">
              <!-- LINKS: Dein Schrank -->
              <div class="typ-slot-box">
                <div class="slot-icon" style="background:${coveredP ? '#dcfce7' : '#fee2e2'};color:${coveredP ? '#166534' : '#991b1b'}">
                  ${coveredP ? '✓' : '!'}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:var(--muted);letter-spacing:0.04em">
                    Dein Schrank · ${st.slotName}
                  </div>
                  <div style="font-size:0.86rem;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${coveredP ? (coveredP.brand + " " + coveredP.name) : '<span style="color:#b91c1c;font-style:italic">Fach ist leer (Lücke)</span>'}
                  </div>
                  <div style="font-size:0.74rem;color:var(--muted);line-height:1.2;margin-top:1px">
                    ${coveredP ? (coveredP.wirk || 'Im Schrank') : 'Kein Produkt für diesen Schritt'}
                  </div>
                </div>
              </div>

              <!-- MITTE: Pfeil / Divider -->
              <div class="typ-compare-divider">⟷</div>

              <!-- RECHTS: Was sinnvoll wäre -->
              <div class="typ-slot-box" style="background:#fafafa;padding:6px 9px;border-radius:8px;border:1px solid #f0eae1">
                <div class="bottle-icon" style="transform:scale(0.75);margin-left:-4px">
                  ${renderBottle(idealP)}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="display:flex;align-items:center;gap:6px">
                    <span style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#206845;letter-spacing:0.04em">
                      Sinnvoll: ${idealP.name}
                    </span>
                  </div>
                  <div style="font-size:0.75rem;color:var(--muted);line-height:1.3;margin-top:1px">
                    💡 <strong>Warum:</strong> ${st.why}
                  </div>
                  <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:3px">
                    <span style="font-size:0.68rem;font-weight:600;color:#206845">${idealP.store || 'dm / Drogerie'}</span>
                    ${idealP.ff ? '<span class="tag ff" style="font-size:0.62rem;padding:0 4px">🌸 FF</span>' : ''}
                    ${idealP.nc ? '<span class="tag nc" style="font-size:0.62rem;padding:0 4px">🛡️ NC</span>' : ''}
                    ${idealP.cf ? '<span class="tag cf" style="font-size:0.62rem;padding:0 4px">🐰 CF</span>' : ''}
                  </div>
                </div>
              </div>

              <!-- AKTION: 1-Tipp Übernahme -->
              <div style="text-align:right">
                ${isIdentical ? `
                  <span style="font-size:0.75rem;font-weight:700;color:#166534;background:#dcfce7;padding:5px 9px;border-radius:6px;display:inline-block">
                    ✓ Im Schrank
                  </span>
                ` : (coveredP ? `
                  <button type="button" class="btn-adopt-alt" onclick="adoptIdealProduct('${idealP.id}', '${tab}')" title="Dieses empfohlene Produkt zusätzlich in deinen Schrank stellen">
                    + Als Alternative
                  </button>
                ` : `
                  <button type="button" class="btn-adopt" onclick="adoptIdealProduct('${idealP.id}', '${tab}')" title="Per 1-Klick in deinen Schrank stellen">
                    + In Schrank stellen
                  </button>
                `)}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}


function getTeenIdealRoutineSteps(complexity = "basis") {
  if (complexity === "minimal") {
    // 2 Schritte: Milde Reinigung + Tagespflege mit LSF 30-50+
    return [TEEN_IDEAL_ROUTINE[0], TEEN_IDEAL_ROUTINE[3]];
  } else if (complexity === "basis") {
    // 3 Schritte: AAD Golden Trio: Reinigung + Leichte Feuchtigkeit + LSF 30-50+
    return [TEEN_IDEAL_ROUTINE[0], TEEN_IDEAL_ROUTINE[2], TEEN_IDEAL_ROUTINE[3]];
  }
  // Umfassend: 4 Schritte (inkl. BHA Klärendes Tonic)
  return TEEN_IDEAL_ROUTINE;
}

function setTeenComplexity(comp) {
  appState.teenComplexity = comp;
  const p = getActiveProfile();
  if (p && p.category === "teen") p.complexity = comp;
  saveState();
  renderMain();
  showToast(`✨ Teenie-Routine auf ${comp === 'minimal' ? '2 Schritte (Minimal)' : (comp === 'basis' ? '3 Schritte (Basis)' : '4 Schritte (Umfassend)')} angepasst!`);
}

function adoptAllTeenMissingProducts() {
  const comp = appState.teenComplexity || "basis";
  const steps = getTeenIdealRoutineSteps(comp);
  const t = appState.teen;
  if (!t) return;
  let added = 0;
  steps.forEach(st => {
    if (!t[st.slotKey] || t[st.slotKey].length === 0) {
      if (!t[st.slotKey]) t[st.slotKey] = [];
      t[st.slotKey].push(st.prodId);
      added++;
    }
  });
  saveState();
  renderMain();
  showToast(`⚡ ${added > 0 ? added + ' Produkte' : 'Alle Schritte'} in den Teenie-Schrank gestellt!`);
}

function renderTeenTypRegal() {
  const comp = appState.teenComplexity || "basis";
  const steps = getTeenIdealRoutineSteps(comp);
  const t = appState.teen;

  let coveredCount = 0;
  steps.forEach(st => {
    if (t[st.slotKey] && t[st.slotKey].length > 0) coveredCount++;
  });
  const totalCount = steps.length;
  const missingCount = totalCount - coveredCount;
  const pct = Math.round((coveredCount / totalCount) * 100);

  const compLabel = comp === "minimal" ? "2 Schritte (Minimal)" : (comp === "basis" ? "3 Schritte (Basis)" : "4 Schritte (Umfassend)");

  return `
    <div class="typ-regal-container" id="teenTypRegalContainer" style="border-color:#99f6e4;background:#f0fdfa">
      <div class="typ-regal-shelf-header" style="border-color:#ccfbf1">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#0f766e;margin-bottom:2px">
              <span>🧑‍🦱</span> Teenie-Ideal-Vergleich · AAD-Basispflege
            </div>
            <h3 style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.24rem;margin:0 0 3px;letter-spacing:-0.01em;color:#134e4a">
              Evidenzbasierte Routine für Jugendliche (${compLabel})
            </h3>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="tag" style="background:#ccfbf1;color:#0f766e;font-weight:700">
              Dermatologische AAD-Leitlinie
            </span>
            ${missingCount > 0 ? `
              <button type="button" class="btn-adopt-all" style="background:#0d9488;color:#fff" onclick="adoptAllTeenMissingProducts()">
                ⚡ Alle Lücken füllen (${missingCount})
              </button>
            ` : `
              <span class="tag ok" style="background:#ccfbf1;color:#0f766e;font-weight:700">
                ✓ Komplett abgedeckt
              </span>
            `}
          </div>
        </div>

        <!-- Routine-Komplexität Pills -->
        <div style="display:flex;gap:6px;margin:9px 0 6px;flex-wrap:wrap">
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #99f6e4;background:${comp === 'minimal' ? '#0d9488' : '#fff'};color:${comp === 'minimal' ? '#fff' : '#0f766e'};font-weight:700;cursor:pointer" onclick="setTeenComplexity('minimal')">
            🌱 Minimal (2 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #99f6e4;background:${comp === 'basis' ? '#0d9488' : '#fff'};color:${comp === 'basis' ? '#fff' : '#0f766e'};font-weight:700;cursor:pointer" onclick="setTeenComplexity('basis')">
            ⚖️ Basis (3 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #99f6e4;background:${comp === 'comprehensive' ? '#0d9488' : '#fff'};color:${comp === 'comprehensive' ? '#fff' : '#0f766e'};font-weight:700;cursor:pointer" onclick="setTeenComplexity('comprehensive')">
            ✨ Umfassend (4 Schritte)
          </button>
        </div>

        <p style="font-size:0.83rem;color:#134e4a;margin:6px 0 0;line-height:1.4">
          Schutz vor aggressiven Social-Media-Trends & Anti-Aging-Hype. Milde Reinigung, sanfte Talgkontrolle und täglicher Sonnenschutz.
        </p>
      </div>

      <!-- Abdeckung -->
      <div class="coverage-bar-card" style="border-color:#ccfbf1">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:700;margin-bottom:5px;color:#0f766e">
            <span>Teenie-Abdeckung: ${coveredCount} von ${totalCount} Fächern belegt</span>
            <span>${pct}%</span>
          </div>
          <div class="coverage-progress" style="background:#ccfbf1">
            <div class="coverage-progress-fill" style="width:${pct}%;background:#0d9488"></div>
          </div>
        </div>
      </div>

      <!-- Vergleichs-Karten -->
      <div class="typ-compare-list">
        ${steps.map(st => {
          const userProds = (t[st.slotKey] || []).map(id => TEEN_DB[id]).filter(Boolean);
          const hasProd = userProds.length > 0;
          const userP = hasProd ? userProds[0] : null;
          const idealP = TEEN_DB[st.prodId];
          const isIdentical = hasProd && userProds.some(p => p.id === st.prodId);

          return `
            <div class="typ-compare-card" style="border-color:#ccfbf1">
              <!-- LINKS: Dein Schrank -->
              <div class="typ-slot-box">
                <div class="slot-icon" style="background:${hasProd ? '#ccfbf1' : '#fee2e2'};color:${hasProd ? '#0f766e' : '#991b1b'}">
                  ${hasProd ? '✓' : '!'}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#0f766e;letter-spacing:0.04em">
                    Dein Schrank · ${st.slotName}
                  </div>
                  <div style="font-size:0.86rem;font-weight:700;color:#134e4a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${hasProd ? (userP.brand + " " + userP.name) : '<span style="color:#b91c1c;font-style:italic">Fach ist leer</span>'}
                  </div>
                </div>
              </div>

              <!-- MITTE -->
              <div class="typ-compare-divider" style="color:#0d9488">⟷</div>

              <!-- RECHTS: Sinnvolle AAD-Empfehlung -->
              <div class="typ-slot-box" style="background:#fff;padding:6px 9px;border-radius:8px;border:1px solid #ccfbf1">
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#0d9488;letter-spacing:0.04em">
                    Empfehlung: ${idealP ? (idealP.brand + " " + idealP.name) : st.title}
                  </div>
                  <div style="font-size:0.75rem;color:#134e4a;line-height:1.3;margin-top:2px">
                    💡 ${st.why}
                  </div>
                </div>
              </div>

              <!-- AKTION -->
              <div style="text-align:right">
                ${isIdentical ? `
                  <span style="font-size:0.75rem;font-weight:700;color:#0f766e;background:#ccfbf1;padding:5px 9px;border-radius:6px;display:inline-block">
                    ✓ Im Schrank
                  </span>
                ` : `
                  <button type="button" class="btn-adopt" style="background:#0d9488" onclick="adoptTeenProductToSlot('${st.prodId}', '${st.slotKey}')">
                    + In Schrank stellen
                  </button>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}




const BABY_IDEAL_ROUTINE = [
  {
    slotKey: "reiniger",
    slotName: "1. Milde Reinigung & Babybad",
    prodId: "b_ean_3560071348069",
    title: "Carrefour Gel lavant 2 in 1 Bébé",
    why: "Milde, seifenfreie Syndet-Formel – schützt den unreifen Hydrolipidfilm des Säuglings vor Austrocknung."
  },
  {
    slotKey: "creme",
    slotName: "2. Pflegecreme & Barriere",
    prodId: "b_item_10",
    title: "Weleda Baby Calendula Gesichtscreme (Parfümfrei)",
    why: "Stärkt die dünne Säuglings-Hautbarriere mit schützenden Lipiden · 100% parfümfrei & spezifisch für <3 Jahre."
  },
  {
    slotKey: "windel",
    slotName: "3. Windel- & Wundschutz",
    prodId: "b_ean_3286011092310",
    title: "Biolane Crème change (Wundschutz)",
    why: "Zinkoxid-Schutzfilm gegen Nässe, Feuchtigkeit und Reibung im Windelbereich · Ohne Duftstoffe & ätherische Öle."
  },
  {
    slotKey: "spf",
    slotName: "4. Pädiatrischer Sonnenschutz",
    prodId: "b_ean_3760075074227",
    title: "Alphanova Sun Spray solaire bébé LSF 50",
    why: "AAP/AAD: Unter 6m primär Schatten & Textilschutz. Ab 6m reiner mineralischer Breitspektrum-Filter ohne Duftstoffe."
  }
];

const CHILD_IDEAL_ROUTINE = [
  {
    slotKey: "reiniger",
    slotName: "1. Milde Reinigung & Dusche",
    prodId: "b_ean_3560071348069",
    title: "Gel lavant 2 in 1 (Milde Waschlotion)",
    why: "Tränenfreie, sanfte Reinigung für den ganzen Körper – brennt nicht in den Augen und schont die Barriere."
  },
  {
    slotKey: "creme",
    slotName: "2. Kinder-Pflegecreme",
    prodId: "b_ean_5060447948674",
    title: "Childs Farm Face cream Fragrance Free",
    why: "Zieht schnell ein und schützt beanspruchte Kinderhaut vor Kälte, Wind und trockener Raumluft ohne Fettfilm."
  },
  {
    slotKey: "spf",
    slotName: "3. Kindgerechter Sonnenschutz (LSF 50+)",
    prodId: "b_ean_20231460",
    title: "Cien Sun Crème solaire enfant LSF 50+",
    why: "Wasserfester Breitspektrum-Sonnenschutz LSF 50+ für Schule, Spiel & Sport – beugt UV-Schäden in der Kindheit vor."
  },
  {
    slotKey: "haar",
    slotName: "4. Mildes Kindershampoo",
    prodId: "b_ean_3574660536522",
    title: "Natusan First Touch Shampoo (Parfümfrei)",
    why: "Brennt nicht in den Augen, entwirrt feines Kinderhaar sanft und reinigt ohne scharfe Sulfate."
  }
];

function getBabyIdealRoutineSteps(complexity = "basis") {
  if (complexity === "minimal") {
    // 2 Schritte: Milde seifenfreie Reinigung & Barriere-Emollient
    return BABY_IDEAL_ROUTINE.slice(0, 2);
  } else if (complexity === "basis") {
    // 3 Schritte: Reinigung + Pflegecreme + Windelschutz
    return BABY_IDEAL_ROUTINE.slice(0, 3);
  }
  // Umfassend: 4 Schritte (+ mineralischer LSF 50+)
  return BABY_IDEAL_ROUTINE;
}

function getChildIdealRoutineSteps(complexity = "basis") {
  if (complexity === "minimal") {
    // 2 Schritte: Milde Reinigung & Breitspektrum-LSF 50+
    return [CHILD_IDEAL_ROUTINE[0], CHILD_IDEAL_ROUTINE[2]];
  } else if (complexity === "basis") {
    // 3 Schritte: Reinigung + Kindercreme + LSF 50+
    return [CHILD_IDEAL_ROUTINE[0], CHILD_IDEAL_ROUTINE[1], CHILD_IDEAL_ROUTINE[2]];
  }
  // Umfassend: 4 Schritte (+ tränenfreies Kindershampoo)
  return CHILD_IDEAL_ROUTINE;
}

function setBabyComplexity(comp) {
  appState.babyComplexity = comp;
  const p = getActiveProfile();
  if (p && p.category === "baby") p.complexity = comp;
  saveState();
  renderMain();
  showToast(`✨ Baby-Routine auf ${comp === 'minimal' ? '2 Schritte (Minimal)' : (comp === 'basis' ? '3 Schritte (Basis)' : '4 Schritte (Umfassend)')} angepasst!`);
}

function setChildComplexity(comp) {
  appState.childComplexity = comp;
  const p = getActiveProfile();
  if (p && p.category === "child") p.complexity = comp;
  saveState();
  renderMain();
  showToast(`✨ Kinder-Routine auf ${comp === 'minimal' ? '2 Schritte (Minimal)' : (comp === 'basis' ? '3 Schritte (Basis)' : '4 Schritte (Umfassend)')} angepasst!`);
}

function adoptBabyIdealProduct(prodId, profile, slotKey) {
  if (!appState[profile]) return;
  if (!appState[profile][slotKey]) appState[profile][slotKey] = [];
  if (!appState[profile][slotKey].includes(prodId)) {
    appState[profile][slotKey].push(prodId);
  }
  saveState();
  renderMain();
  const p = BABY_DB[prodId];
  const name = p ? p.name : "Produkt";
  showToast(`✨ <strong>${name}</strong> in den ${profile === 'baby' ? 'Baby' : 'Kinder'}-Schrank gestellt!`);
}

function adoptAllBabyMissingProducts(profile) {
  const isBaby = profile === "baby";
  const comp = isBaby ? (appState.babyComplexity || "basis") : (appState.childComplexity || "basis");
  const steps = isBaby ? getBabyIdealRoutineSteps(comp) : getChildIdealRoutineSteps(comp);
  const targetObj = appState[profile];
  if (!targetObj) return;

  let added = 0;
  steps.forEach(st => {
    if (!targetObj[st.slotKey] || targetObj[st.slotKey].length === 0) {
      if (!targetObj[st.slotKey]) targetObj[st.slotKey] = [];
      targetObj[st.slotKey].push(st.prodId);
      added++;
    }
  });

  saveState();
  renderMain();
  showToast(`⚡ ${added > 0 ? added + ' Produkte' : 'Alle Schritte'} in den ${isBaby ? 'Baby' : 'Kinder'}-Schrank gestellt!`);
}

function renderBabyTypRegal() {
  const comp = appState.babyComplexity || "basis";
  const steps = getBabyIdealRoutineSteps(comp);
  const b = appState.baby;

  let coveredCount = 0;
  steps.forEach(st => {
    if (b[st.slotKey] && b[st.slotKey].length > 0) coveredCount++;
  });
  const totalCount = steps.length;
  const missingCount = totalCount - coveredCount;
  const pct = Math.round((coveredCount / totalCount) * 100);

  const compLabel = comp === "minimal" ? "2 Schritte (Minimal)" : (comp === "basis" ? "3 Schritte (Basis)" : "4 Schritte (Umfassend)");

  return `
    <div class="typ-regal-container" id="babyTypRegalContainer" style="border-color:#bfdbfe;background:#f4f8fe">
      <div class="typ-regal-shelf-header" style="border-color:#dbeafe">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#1e40af;margin-bottom:2px">
              <span>👶</span> Baby-Ideal-Vergleich · EDQM- & DGKJ-Leitlinie
            </div>
            <h3 style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.24rem;margin:0 0 3px;letter-spacing:-0.01em;color:#1e3a8a">
              Evidenzbasierte Säuglingspflege (${compLabel})
            </h3>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="tag ped-blue" style="font-weight:700">
              Pädiatrische Leitlinie
            </span>
            ${missingCount > 0 ? `
              <button type="button" class="btn-adopt-all" style="background:#2563eb;color:#fff" onclick="adoptAllBabyMissingProducts('baby')">
                ⚡ Alle Lücken füllen (${missingCount})
              </button>
            ` : `
              <span class="tag ok" style="background:#dcfce7;color:#166534;font-weight:700">
                ✓ Komplett abgedeckt
              </span>
            `}
          </div>
        </div>

        <!-- Routine-Umfang Umschalter (Pills) -->
        <div style="display:flex;gap:6px;margin:9px 0 6px;flex-wrap:wrap">
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #bfdbfe;background:${comp === 'minimal' ? '#2563eb' : '#fff'};color:${comp === 'minimal' ? '#fff' : '#1e40af'};font-weight:700;cursor:pointer" onclick="setBabyComplexity('minimal')">
            🌱 Minimal (2 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #bfdbfe;background:${comp === 'basis' ? '#2563eb' : '#fff'};color:${comp === 'basis' ? '#fff' : '#1e40af'};font-weight:700;cursor:pointer" onclick="setBabyComplexity('basis')">
            ⚖️ Basis (3 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #bfdbfe;background:${comp === 'comprehensive' ? '#2563eb' : '#fff'};color:${comp === 'comprehensive' ? '#fff' : '#1e40af'};font-weight:700;cursor:pointer" onclick="setBabyComplexity('comprehensive')">
            ✨ Umfassend (4 Schritte)
          </button>
        </div>

        <p style="font-size:0.83rem;color:#1e3a8a;margin:6px 0 0;line-height:1.4">
          Fokus auf 100% Duftstoff-Freiheit, minimales Reizpotenzial und Erhalt des natürlichen Säureschutzmantels. Spezifische Sicherheitsbewertung nach EU-Kosmetikverordnung.
        </p>
      </div>

      <!-- Abdeckung -->
      <div class="coverage-bar-card" style="border-color:#dbeafe">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:700;margin-bottom:5px;color:#1e40af">
            <span>Baby-Abdeckung: ${coveredCount} von ${totalCount} Fächern belegt</span>
            <span>${pct}%</span>
          </div>
          <div class="coverage-progress" style="background:#dbeafe">
            <div class="coverage-progress-fill" style="width:${pct}%;background:#2563eb"></div>
          </div>
        </div>
      </div>

      <!-- Vergleichs-Karten -->
      <div class="typ-compare-list">
        ${steps.map(st => {
          const userProds = (b[st.slotKey] || []).map(id => BABY_DB[id]).filter(Boolean);
          const hasProd = userProds.length > 0;
          const userP = hasProd ? userProds[0] : null;
          const idealP = BABY_DB[st.prodId];
          const isIdentical = hasProd && userProds.some(p => p.id === st.prodId);

          return `
            <div class="typ-compare-card" style="border-color:#bfdbfe">
              <!-- LINKS: Dein Schrank -->
              <div class="typ-slot-box">
                <div class="slot-icon" style="background:${hasProd ? '#dbeafe' : '#fee2e2'};color:${hasProd ? '#1e40af' : '#991b1b'}">
                  ${hasProd ? '✓' : '!'}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#1e40af;letter-spacing:0.04em">
                    Dein Schrank · ${st.slotName}
                  </div>
                  <div style="font-size:0.86rem;font-weight:700;color:#1e3a8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${hasProd ? (userP.brand + " " + userP.name) : '<span style="color:#b91c1c;font-style:italic">Fach ist leer</span>'}
                  </div>
                </div>
              </div>

              <!-- MITTE -->
              <div class="typ-compare-divider" style="color:#2563eb">⟷</div>

              <!-- RECHTS: Sinnvolle EDQM-Empfehlung -->
              <div class="typ-slot-box" style="background:#fff;padding:6px 9px;border-radius:8px;border:1px solid #bfdbfe">
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#2563eb;letter-spacing:0.04em">
                    Empfehlung: ${idealP ? (idealP.brand + " " + idealP.name) : st.title}
                  </div>
                  <div style="font-size:0.75rem;color:#1e3a8a;line-height:1.3;margin-top:2px">
                    💡 ${st.why}
                  </div>
                </div>
              </div>

              <!-- AKTION -->
              <div style="text-align:right">
                ${isIdentical ? `
                  <span style="font-size:0.75rem;font-weight:700;color:#1e40af;background:#dbeafe;padding:5px 9px;border-radius:6px;display:inline-block">
                    ✓ Im Schrank
                  </span>
                ` : `
                  <button type="button" class="btn-adopt" style="background:#2563eb" onclick="adoptBabyIdealProduct('${st.prodId}', 'baby', '${st.slotKey}')">
                    + In Schrank stellen
                  </button>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderChildTypRegal() {
  const comp = appState.childComplexity || "basis";
  const steps = getChildIdealRoutineSteps(comp);
  const c = appState.child;

  let coveredCount = 0;
  steps.forEach(st => {
    if (c[st.slotKey] && c[st.slotKey].length > 0) coveredCount++;
  });
  const totalCount = steps.length;
  const missingCount = totalCount - coveredCount;
  const pct = Math.round((coveredCount / totalCount) * 100);

  const compLabel = comp === "minimal" ? "2 Schritte (Minimal)" : (comp === "basis" ? "3 Schritte (Basis)" : "4 Schritte (Umfassend)");

  return `
    <div class="typ-regal-container" id="childTypRegalContainer" style="border-color:#fde68a;background:#fefbf4">
      <div class="typ-regal-shelf-header" style="border-color:#fef3c7">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#b45309;margin-bottom:2px">
              <span>🧒</span> Kinder-Ideal-Vergleich · DGKJ & Barriere-Schutz
            </div>
            <h3 style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.24rem;margin:0 0 3px;letter-spacing:-0.01em;color:#78350f">
              Evidenzbasierte Kinderpflege (${compLabel})
            </h3>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="tag ped-amber" style="font-weight:700">
              Kinderärztliche Leitlinie
            </span>
            ${missingCount > 0 ? `
              <button type="button" class="btn-adopt-all" style="background:#d97706;color:#fff" onclick="adoptAllBabyMissingProducts('child')">
                ⚡ Alle Lücken füllen (${missingCount})
              </button>
            ` : `
              <span class="tag ok" style="background:#fef3c7;color:#92580a;font-weight:700">
                ✓ Komplett abgedeckt
              </span>
            `}
          </div>
        </div>

        <!-- Routine-Umfang Umschalter (Pills) -->
        <div style="display:flex;gap:6px;margin:9px 0 6px;flex-wrap:wrap">
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #fde68a;background:${comp === 'minimal' ? '#d97706' : '#fff'};color:${comp === 'minimal' ? '#fff' : '#b45309'};font-weight:700;cursor:pointer" onclick="setChildComplexity('minimal')">
            🌱 Minimal (2 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #fde68a;background:${comp === 'basis' ? '#d97706' : '#fff'};color:${comp === 'basis' ? '#fff' : '#b45309'};font-weight:700;cursor:pointer" onclick="setChildComplexity('basis')">
            ⚖️ Basis (3 Schritte)
          </button>
          <button type="button" class="btn-text" style="font-size:0.75rem;padding:4px 9px;border-radius:6px;border:1px solid #fde68a;background:${comp === 'comprehensive' ? '#d97706' : '#fff'};color:${comp === 'comprehensive' ? '#fff' : '#b45309'};font-weight:700;cursor:pointer" onclick="setChildComplexity('comprehensive')">
            ✨ Umfassend (4 Schritte)
          </button>
        </div>

        <p style="font-size:0.83rem;color:#78350f;margin:6px 0 0;line-height:1.4">
          Vor der Pubertät benötigt Kinderhaut keine aggressiven Säuren oder Retinoide. Sanfte Reinigung, Barriere-Schutz und zuverlässiger Sonnenschutz genügen vollkommen.
        </p>
      </div>

      <!-- Abdeckung -->
      <div class="coverage-bar-card" style="border-color:#fef3c7">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:700;margin-bottom:5px;color:#b45309">
            <span>Kinder-Abdeckung: ${coveredCount} von ${totalCount} Fächern belegt</span>
            <span>${pct}%</span>
          </div>
          <div class="coverage-progress" style="background:#fef3c7">
            <div class="coverage-progress-fill" style="width:${pct}%;background:#d97706"></div>
          </div>
        </div>
      </div>

      <!-- Vergleichs-Karten -->
      <div class="typ-compare-list">
        ${steps.map(st => {
          const userProds = (c[st.slotKey] || []).map(id => BABY_DB[id]).filter(Boolean);
          const hasProd = userProds.length > 0;
          const userP = hasProd ? userProds[0] : null;
          const idealP = BABY_DB[st.prodId];
          const isIdentical = hasProd && userProds.some(p => p.id === st.prodId);

          return `
            <div class="typ-compare-card" style="border-color:#fde68a">
              <!-- LINKS: Dein Schrank -->
              <div class="typ-slot-box">
                <div class="slot-icon" style="background:${hasProd ? '#fef3c7' : '#fee2e2'};color:${hasProd ? '#b45309' : '#991b1b'}">
                  ${hasProd ? '✓' : '!'}
                </div>
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#b45309;letter-spacing:0.04em">
                    Dein Schrank · ${st.slotName}
                  </div>
                  <div style="font-size:0.86rem;font-weight:700;color:#78350f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${hasProd ? (userP.brand + " " + userP.name) : '<span style="color:#b91c1c;font-style:italic">Fach ist leer</span>'}
                  </div>
                </div>
              </div>

              <!-- MITTE -->
              <div class="typ-compare-divider" style="color:#d97706">⟷</div>

              <!-- RECHTS: Sinnvolle Empfehlung -->
              <div class="typ-slot-box" style="background:#fff;padding:6px 9px;border-radius:8px;border:1px solid #fde68a">
                <div style="min-width:0;flex:1">
                  <div style="font-size:0.68rem;text-transform:uppercase;font-weight:700;color:#d97706;letter-spacing:0.04em">
                    Empfehlung: ${idealP ? (idealP.brand + " " + idealP.name) : st.title}
                  </div>
                  <div style="font-size:0.75rem;color:#78350f;line-height:1.3;margin-top:2px">
                    💡 ${st.why}
                  </div>
                </div>
              </div>

              <!-- AKTION -->
              <div style="text-align:right">
                ${isIdentical ? `
                  <span style="font-size:0.75rem;font-weight:700;color:#b45309;background:#fef3c7;padding:5px 9px;border-radius:6px;display:inline-block">
                    ✓ Im Schrank
                  </span>
                ` : `
                  <button type="button" class="btn-adopt" style="background:#d97706" onclick="adoptBabyIdealProduct('${st.prodId}', 'child', '${st.slotKey}')">
                    + In Schrank stellen
                  </button>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}


