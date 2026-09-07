// ==========================================
// Rules, Conflicts & Safety Assessment Module
// ==========================================

function calculatePrognosis() {
  const am = appState.am;
  const pm = getActivePMList();
  const all = [...am, ...pm];
  
  if (all.length === 0) {
    return {
      status: "empty",
      title: "ℹ️ Dein Schrank ist noch leer",
      points: [
        "Füge deine Produkte über die Suche ('+ Produkt hinzufügen') oder den Drogerie-Scan hinzu, um deine Routine auf Verträglichkeit und Lücken zu prüfen."
      ]
    };
  }
  
  if (all.length === 1) {
    return {
      status: "warn",
      title: "⏳ 1 Produkt im Schrank",
      points: [
        "Stelle mindestens ein weiteres Produkt für Morgen oder Abend hinein, um Schichtungs- und Reizkonflikte zu prüfen."
      ]
    };
  }

  const points = [];
  let isCrit = false;
  let isWarn = false;

  const hasSPF = am.some(id => DB[id] && DB[id].kat === "spf");
  const hasActives = all.some(id => DB[id] && (DB[id].kat === "active" || DB[id].kat === "serum" || DB[id].rx));
  const hasMoisturizer = all.some(id => DB[id] && DB[id].kat === "creme");
  const hasAdap = all.includes("adap");
  const hasClienzo = all.includes("clienzo");
  const hasRetinol = all.includes("retinol");
  const hasAHA = pm.some(id => DB[id] && DB[id].klassen && DB[id].klassen.includes("aha"));
  const hasBHA = pm.some(id => DB[id] && DB[id].klassen && DB[id].klassen.includes("bha"));

  // Check 1: Critical Retinoid + Acid stacking on same evening
  if ((hasAdap || hasRetinol) && (hasAHA || hasBHA)) {
    isCrit = true;
    points.push("🔴 Kritisches Reiz-Stacking am selben Abend: Säure (AHA/BHA) und Retinoid in derselben Nacht überfordern deine Barriere. Verteile sie im Skin Cycling auf getrennte Abende!");
  }

  // Check 2: Two Retinoids
  if (hasAdap && hasRetinol) {
    isCrit = true;
    points.push("🔴 Redundanz: Medizinisches Adapalen und kosmetisches Retinol im selben Schrank. Eines davon genügt; zwei Retinoide führen nur zu Schälung ohne Zusatznutzen.");
  }

  // Check 3: Clienzo & Adapalen in same night
  if (pm.includes("clienzo") && pm.includes("adap")) {
    isCrit = true;
    points.push("🔴 Clienzo (BPO) und Adapalen nicht am selben Abend schichten! Nutze Modus A (Adapalen) und Modus B (Clienzo) im Wechsel.");
  }

  // Check 4: SPF missing
  if (!hasSPF && hasActives) {
    isWarn = true;
    points.push("🟡 Morgens fehlt ein Sonnenschutz (LSF 30–50)! Deine aktiven Wirkstoffe machen die Haut lichtempfindlich.");
  } else if (hasSPF) {
    points.push("☀️ Sonnenschutz vorhanden: Deine Haut ist tagsüber gegen UV-Strahlung und Pigmentflecken geschützt.");
  }

  // Check 5: Moisture / Barrier
  if (!hasMoisturizer && hasActives) {
    isWarn = true;
    points.push("🟡 Feuchtigkeitslücke: Dir fehlt eine Barrierecreme als Ausgleich zu deinen Wirkstoffen. Es drohen Spannungsgefühle und Trockenheit.");
  } else if (hasMoisturizer) {
    points.push("💧 Barriere-Puffer: Ausreichend Feuchtigkeitspflege vorhanden, um Reizungen abzufedern.");
  }

  // Check 6: Begleitpflege
  if (hasAdap || hasClienzo) {
    points.push("🛡️ Begleitpflege aktiv: Medizinisches Mittel erkannt. Reizstoff-Filter schützt deine Haut.");
  }

  let status = "ok";
  let title = "🟢 Hervorragende Routine-Harmonie";
  if (isCrit) {
    status = "no";
    title = "🔴 Reiz-Stacking / Konflikt erkannt";
  } else if (isWarn) {
    status = "warn";
    title = "🟡 Gute Basis – Kleine Anpassung empfohlen";
  }

  return { status, title, points };
}


function evaluateCandidate(candidate) {
  const currentPM = getActivePMList();
  const hasRxRetinoid = currentPM.includes("adap") || appState.pm_a.includes("adap");
  const hasBPO = currentPM.includes("clienzo") || appState.pm_b.includes("clienzo");
  const DISCLAIMER = "Keine medizinische Therapie — reines Einkaufs- & Layering-Erkennungstool.";

  // Rule 1: Redundant Retinoid (Candidate is Retinoid and Rx Retinoid already exists)
  if (candidate.klassen && candidate.klassen.includes("retinoid_cos") && hasRxRetinoid) {
    return {
      status: "no",
      verdict: "konflikt",
      title: "🔴 Konflikt",
      reason: "Du hast abends bereits Adapalen (medizinisches Retinoid). Zusätzliches kosmetisches Retinol bringt keinen Vorteil, sondern führt zu Reiz-Stacking.",
      truth: candidate.truth || "Zwei Retinoide parallel erhöhen nur die Schuppung und Entzündung.",
      where: "Weder morgens noch abends sinnvoll",
      disclaimer: DISCLAIMER,
      alts: [
        { name: "Purito Bamboo Panthenol Cream", store: "EU-Shop (~18 €)", price: "Barriere-Support" },
        { name: "Balea Med Intensivcreme", store: "dm (~3,95 €)", price: "Günstige Reizlinderung" }
      ]
    };
  }

  // Rule 2: Strong AHA/BHA acid against active Adapalen night
  if (candidate.klassen && (candidate.klassen.includes("aha") || candidate.klassen.includes("bha")) && hasRxRetinoid) {
    return {
      status: "warn",
      verdict: "eher_nicht",
      title: "🟡 eher nicht",
      reason: "Nicht am selben Abend wie dein Adapalen! Wenn du beides schichtest, droht Reiz-Stacking. Nutze dieses Peeling nur an freien Abenden im Skin Cycling (z.B. 1× pro Woche).",
      truth: candidate.truth || "Säuren und Retinoide am selben Abend überfordern empfindliche Haut.",
      where: "Nur an freien Abenden (z.B. 1× pro Woche)",
      disclaimer: DISCLAIMER,
      alts: [
        { name: "Balea Med Ultra Sensitive Waschgel", store: "dm (~2,45 €)", price: "Milde Alternative" },
        { name: "Geek & Gorgeous aPAD (Azelain-Derivat)", store: "dm (~10,50 €)", price: "Reizarme Klärung" }
      ]
    };
  }

  // Rule 3: Barrier stress (Alcohols / Citrus / Essential oils)
  if (candidate.klassen && candidate.klassen.includes("barrier_stress")) {
    return {
      status: "no",
      verdict: "konflikt",
      title: "🔴 Konflikt",
      reason: "Enthält aggressive Duftstoffe oder austrocknende Alkohole. Bei empfindlicher oder retinoid-behandelter Barriere ein direkter Reiz-Trigger.",
      truth: candidate.truth || "Marketing wirbt mit 'Clean Glow', aber ätherische Öle schädigen empfindliche Hautbarrieren.",
      where: "Nicht empfehlenswert",
      disclaimer: DISCLAIMER,
      alts: [
        { name: "Balea Med Ultra Sensitive Intensivcreme", store: "dm (~3,95 €)", price: "Parfümfrei & sicher" },
        { name: "Mixa Panthenol Comfort Creme", store: "dm (~6,95 €)", price: "SOS-Feuchtigkeit" }
      ]
    };
  }

  // Rule 4: High Niacinamide warning
  if (candidate.klassen && candidate.klassen.includes("niacinamide")) {
    return {
      status: "ok",
      verdict: "passt",
      title: "🟢 passt",
      reason: "Chemisch kompatibel mit deiner Routine. Bei 10% Konzentration anfangs vorsichtig testen (2–5% genügen meist).",
      truth: candidate.truth || "In Studien genügen 2–5% Niacinamid vollkommen. 10% kann bei sensibler Haut kribbeln.",
      where: "Morgens oder abends vor der Creme",
      disclaimer: DISCLAIMER,
      alts: [
        { name: "Geek & Gorgeous B-Bomb", store: "dm (~8,50 €)", price: "Leichte Textur" },
        { name: "Isana Pure Feuchtigkeitscreme", store: "Rossmann (~3,95 €)", price: "Milde 3% Dosis" }
      ]
    };
  }

  // Rule 5: Perfumed product when barrier / active retinoid in use
  if (candidate.ff === false && (hasRxRetinoid || hasBPO)) {
    return {
      status: "warn",
      verdict: "eher_nicht",
      title: "🟡 eher nicht",
      reason: "Enthält Parfüm/Duftstoffe. Bei aktiver Retinoid-Therapie oder sensibler Barriere können Duftstoffe Brennen und Rötungen auslösen.",
      truth: "Duftstoffe sind die häufigsten Auslöser für allergische Kontaktreaktionen bei irritierter Barriere.",
      where: "Besser auf parfümfreie Alternativen ausweichen",
      disclaimer: DISCLAIMER,
      alts: [
        { name: "Balea Med Ultra Sensitive", store: "dm (~3,95 €)", price: "100% parfümfrei" },
        { name: "Mixa Panthenol Comfort", store: "dm (~6,95 €)", price: "Milde Pflege" }
      ]
    };
  }

  // Default: Support / Cleanser / Cream / SPF
  return {
    status: "ok",
    verdict: "passt",
    title: "🟢 passt",
    reason: "Harmoniert mit deiner Routine. Frei von relevanten Reiz- und Schichtungskonflikten.",
    truth: candidate.truth || "Solide Formulierung ohne störende Inkompatibilitäten.",
    where: candidate.kat === "spf" ? "Schritt 5 morgens" : (candidate.kat === "reiniger" ? "Schritt 1 morgens & abends" : "Schritt 4 Creme"),
    disclaimer: DISCLAIMER,
    alts: []
  };
}

// Modals