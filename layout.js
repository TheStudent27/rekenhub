document.addEventListener("DOMContentLoaded", function () {
    let rawPath = window.location.pathname.split("/").pop() || "index.html";
    if (!rawPath.includes(".")) rawPath += ".html";
    const currentPath = rawPath;

    // 1. Laad strakke Google Fonts + Print CSS
    if (!document.getElementById("rekenhub-fonts")) {
        const fontLink = document.createElement("link");
        fontLink.id = "rekenhub-fonts";
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600;700&family=Inter:wght@400;500;600;700&display=swap";
        document.head.appendChild(fontLink);

        const style = document.createElement("style");
        style.textContent = `
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
            h1, h2, h3, .font-heading { font-family: 'Instrument Sans', 'Inter', sans-serif; letter-spacing: -0.02em; }
            input[type="number"], .tabular-nums { font-variant-numeric: tabular-nums; }
            @media print {
                #app-header, #app-footer, .no-print, #related-tools-box, #faq-auto-box { display: none !important; }
                body { background: white !important; }
                main { max-width: 100% !important; padding: 0 !important; }
            }
        `;
        document.head.appendChild(style);
    }

    const menuCategories = [
        {
            id: "belastingen",
            title: "Belastingen & Werk",
            short: "Belastingen",
            items: [
                { name: "BTW Calculator", sub: "BE • NL • LU tarieven", file: "btw.html", icon: "🧾", fiscal: true, desc: "Excl. of incl. btw rekenen (21%, 12%, 9%, 6%, 17%)." },
                { name: "Flexi-job Loon", sub: "België (bruto = netto)", file: "flexijob.html", icon: "💼", fiscal: true, desc: "Bruto=netto uurloon, 7,67% vakantiegeld & €12.000 plafond." },
                { name: "Werkuren & Uurloon", sub: "Decimale uren berekenen", file: "werkuren.html", icon: "⏱️", fiscal: false, desc: "Start- en eindtijd omrekenen naar decimale werkuren." }
            ]
        },
        {
            id: "geld-vastgoed",
            title: "Sparen, Lenen & Vastgoed",
            short: "Geld & Woning",
            items: [
                { name: "Sparen & Beleggen", sub: "Netto na roerende voorheffing", file: "sparen.html", icon: "📈", fiscal: true, desc: "Netto eindkapitaal na roerende voorheffing of NL Box 3." },
                { name: "Hypotheek & Woonlening", sub: "Maandlast & aflossing", file: "hypotheek.html", icon: "🏦", fiscal: false, desc: "Maandelijkse aflossing, totale rente en aflossingsgrafiek." },
                { name: "Registratie & Overdracht", sub: "Aankoopkosten woning", file: "registratierechten.html", icon: "🔑", fiscal: true, desc: "Verkooprecht (BE) of overdrachtsbelasting (NL) + notaris." },
                { name: "Inflatie & Koopkracht", sub: "Waardeverlies spaargeld", file: "inflatie.html", icon: "📉", fiscal: false, desc: "Waardeverlies van spaargeld over de jaren berekenen." }
            ]
        },
        {
            id: "energie-wonen",
            title: "Energie & Klussen",
            short: "Energie & m²",
            items: [
                { name: "Stroomverbruik (kWh)", sub: "Kosten per toestel", file: "energie.html", icon: "🔌", fiscal: false, desc: "Verbruik en kosten per dag, maand en jaar berekenen." },
                { name: "Zonnepanelen", sub: "Terugverdientijd & injectie", file: "zonnepanelen.html", icon: "☀️", fiscal: true, desc: "Terugverdientijd met zelfverbruik en injectietarief." },
                { name: "Oppervlakte (m²)", sub: "Omtrek, verf & snijverlies", file: "oppervlakte.html", icon: "📐", fiscal: false, desc: "Vierkante meters, omtrek, verf en 10% snijverlies." }
            ]
        },
        {
            id: "auto",
            title: "Auto & Mobiliteit",
            short: "Auto & Laden",
            items: [
                { name: "Laadkosten vs. Benzine", sub: "EV besparing per jaar", file: "laadkosten.html", icon: "🔋", fiscal: false, desc: "Thuis laden of snellader vergeleken met benzine." },
                { name: "Brandstofkosten Rit", sub: "Verbruik & kosten delen", file: "ritkosten.html", icon: "⛽", fiscal: false, desc: "Brandstofkosten berekenen en splitsen per persoon." },
                { name: "Autobelasting", sub: "BIV, rijtaks, BPM & MRB", file: "autobelasting.html", icon: "🚗", fiscal: true, desc: "Indicatie BIV & rijtaks (BE) of BPM & MRB (NL)." }
            ]
        },
        {
            id: "overig",
            title: "Rekenen & Gezondheid",
            short: "Rekenen & BMI",
            items: [
                { name: "Procenten & Korting", sub: "Solden, marge & verschil", file: "procenten.html", icon: "🏷️", fiscal: false, desc: "Kortingsprijs, marge en procentuele stijging/daling." },
                { name: "BMI & Caloriebehoefte", sub: "Gezond gewicht & kcal", file: "bmi.html", icon: "⚖️", fiscal: false, desc: "Gezond gewicht op kleurenschaal en dagelijkse kcal." }
            ]
        }
    ];

    // 2. Contextuele Presets per calculator (banken, laadpalen, toestellen, etc.)
    const toolPresets = {
        "sparen.html": {
            label: "Indicatieve spaarrente per bank (2026):",
            note: "Rentes zijn indicatief inclusief getrouwheidspremie en kunnen wijzigen.",
            options: [
                { name: "Grootbanken BE (KBC / Belfius / BNP)", tag: "~1,10%", values: { rate: 1.10 }, country: "BE" },
                { name: "Argenta Groeirekening (BE)", tag: "~2,15%", values: { rate: 2.15 }, country: "BE" },
                { name: "Keytrade High Fidelity (BE)", tag: "~2,25%", values: { rate: 2.25 }, country: "BE" },
                { name: "MeDirect Essential (BE)", tag: "~2,50%", values: { rate: 2.50 }, country: "BE" },
                { name: "Grootbanken NL (ING / Rabo / ABN)", tag: "~1,50%", values: { rate: 1.50 }, country: "NL" },
                { name: "Trade Republic / Bunq (NL)", tag: "~2,75%", values: { rate: 2.75 }, country: "NL" },
                { name: "Wereldwijde ETF (Gem. historisch)", tag: "~7,00%", values: { rate: 7.00 } }
            ]
        },
        "hypotheek.html": {
            label: "Indicatieve hypotheekrente per looptijd:",
            note: "Gemiddelde vaste rentevoeten in de Benelux bij quotiteit ≤ 80%.",
            options: [
                { name: "10 jaar vast", tag: "~2,95%", values: { years: 10, rate: 2.95 } },
                { name: "15 jaar vast", tag: "~3,10%", values: { years: 15, rate: 3.10 } },
                { name: "20 jaar vast", tag: "~3,25%", values: { years: 20, rate: 3.25 } },
                { name: "25 jaar vast (Standaard BE)", tag: "~3,40%", values: { years: 25, rate: 3.40 } },
                { name: "30 jaar vast (Standaard NL)", tag: "~3,65%", values: { years: 30, rate: 3.65 } }
            ]
        },
        "laadkosten.html": {
            label: "Kies laadlocatie & tarief:",
            note: "Inclusief gemiddelde nettarieven en btw in België en Nederland.",
            options: [
                { name: "Thuis laden (Zonnepanelen)", tag: "€0,08 / kWh", values: { "ev-price": 0.08, kwhPrice: 0.08, priceKwh: 0.08 } },
                { name: "Thuis laden (Standaard netstroom)", tag: "€0,32 / kWh", values: { "ev-price": 0.32, kwhPrice: 0.32, priceKwh: 0.32 } },
                { name: "Publieke laadpaal op straat", tag: "€0,48 / kWh", values: { "ev-price": 0.48, kwhPrice: 0.48, priceKwh: 0.48 } },
                { name: "Snellader (Fastned / Ionity / Tesla)", tag: "€0,69 / kWh", values: { "ev-price": 0.69, kwhPrice: 0.69, priceKwh: 0.69 } }
            ]
        },
        "ritkosten.html": {
            label: "Gemiddelde brandstofprijs (Benelux):",
            note: "Pas het bedrag hieronder vrij aan naar de actuele pompprijs.",
            options: [
                { name: "Benzine Euro 95 (BE)", tag: "€1,68 / L", values: { price: 1.68, fuelPrice: 1.68, consumption: 6.2 } },
                { name: "Benzine Euro 95 (NL)", tag: "€1,98 / L", values: { price: 1.98, fuelPrice: 1.98, consumption: 6.2 } },
                { name: "Diesel B7", tag: "€1,74 / L", values: { price: 1.74, fuelPrice: 1.74, consumption: 5.2 } },
                { name: "LPG", tag: "€0,82 / L", values: { price: 0.82, fuelPrice: 0.82, consumption: 7.8 } }
            ]
        },
        "energie.html": {
            label: "Standaard vermogen per toestel:",
            note: "Kies een toestel om direct het verbruik en de jaarprijs te zien.",
            options: [
                { name: "Mobiele Airco", tag: "1.200 W", values: { watt: 1200, wattage: 1200, hours: 4 } },
                { name: "Warmtepompdroogkast", tag: "850 W", values: { watt: 850, wattage: 850, hours: 1.5 } },
                { name: "Gaming-PC + Scherm", tag: "450 W", values: { watt: 450, wattage: 450, hours: 4 } },
                { name: "Koelkast (24u actief)", tag: "60 W", values: { watt: 60, wattage: 60, hours: 24 } },
                { name: "Elektrisch Bijverwarmen", tag: "2.000 W", values: { watt: 2000, wattage: 2000, hours: 3 } }
            ]
        },
        "oppervlakte.html": {
            label: "Snelle afmetingen per ruimte:",
            note: "Handig om snel vloeroppervlak of verfverbruik te schatten.",
            options: [
                { name: "Slaapkamer (4 × 3,5 m)", tag: "14,00 m²", values: { "rect-length": 4, "rect-width": 3.5 } },
                { name: "Woonkamer (8 × 4,5 m)", tag: "36,00 m²", values: { "rect-length": 8, "rect-width": 4.5 } },
                { name: "Garage (6 × 3 m)", tag: "18,00 m²", values: { "rect-length": 6, "rect-width": 3 } },
                { name: "Terras (5 × 4 m)", tag: "20,00 m²", values: { "rect-length": 5, "rect-width": 4 } }
            ]
        },
        "btw.html": {
            label: "Veelgebruikte btw-tarieven:",
            note: "Selecteer het juiste tarief voor jouw land of dienst.",
            options: [
                { name: "Standaard tarief (BE & NL)", tag: "21%", values: { rate: 21, vatRate: 21 } },
                { name: "Renovatie / Horeca / Voeding (BE)", tag: "6%", values: { rate: 6, vatRate: 6 } },
                { name: "Voeding / Horeca / Boeken (NL)", tag: "9%", values: { rate: 9, vatRate: 9 } },
                { name: "Standaard tarief Luxemburg (LU)", tag: "17%", values: { rate: 17, vatRate: 17 } }
            ]
        }
    };

    const activeCat = menuCategories.find(c => c.items.some(i => i.file === currentPath));
    const activeTool = activeCat ? activeCat.items.find(i => i.file === currentPath) : null;

    if (activeTool) {
        try {
            let recent = JSON.parse(localStorage.getItem("rekenhub_recent") || "[]");
            recent = recent.filter(r => r.file !== activeTool.file);
            recent.unshift({ name: activeTool.name, file: activeTool.file, icon: activeTool.icon, sub: activeTool.sub });
            localStorage.setItem("rekenhub_recent", JSON.stringify(recent.slice(0, 3)));
        } catch (e) {}
    }

    // 3. Strakke navigatie (titel & lichtgrijze subtekst netjes onder elkaar!)
    let navDesktopHtml = `<a href="index.html" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPath === 'index.html' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">Overzicht</a>`;
    let navMobileHtml = `<a href="index.html" class="block px-3 py-2.5 rounded-xl text-base font-semibold ${currentPath === 'index.html' ? 'text-blue-600 bg-blue-50' : 'text-slate-800'}">Alle Calculators</a>`;

    menuCategories.forEach(cat => {
        const isCatActive = cat.items.some(i => i.file === currentPath);
        navDesktopHtml += `
            <div class="relative group">
                <button class="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition ${isCatActive ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
                    <span>${cat.short}</span>
                    <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div class="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">${cat.title}</div>
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-4 py-2.5 transition ${currentPath === item.file ? 'bg-blue-50/90 text-blue-600' : 'text-slate-800 hover:bg-slate-50'}">
                            <span class="text-sm font-semibold leading-snug ${currentPath === item.file ? 'text-blue-600' : 'text-slate-900'}">${item.name}</span>
                            <span class="text-xs text-slate-400 mt-0.5 leading-tight">${item.sub}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        navMobileHtml += `
            <div class="pt-3 pb-1 border-t border-slate-100">
                <div class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">${cat.title}</div>
                <div class="mt-1.5 space-y-1">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-3 py-2 rounded-xl ${currentPath === item.file ? 'bg-blue-50' : 'hover:bg-slate-50'}">
                            <span class="text-sm font-semibold ${currentPath === item.file ? 'text-blue-600' : 'text-slate-800'}">${item.name}</span>
                            <span class="text-xs text-slate-400 mt-0.5">${item.sub}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const headerHtml = `
        <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/90">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <a href="index.html" class="flex items-center gap-2.5 shrink-0">
                    <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-heading font-bold text-base">R</div>
                    <div class="flex items-center gap-2">
                        <span class="font-heading font-bold text-slate-900 text-lg">RekenHub</span>
                        <span class="text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">Benelux</span>
                    </div>
                </a>
                <nav class="hidden lg:flex items-center space-x-1">${navDesktopHtml}</nav>
                <button id="mobile-menu-btn" aria-label="Menu openen" class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto shadow-lg">
                ${navMobileHtml}
            </div>
        </header>
    `;

    const adBannerHtml = `
        <div class="no-print max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
            <div class="bg-slate-100/70 border border-dashed border-slate-300 rounded-xl h-16 sm:h-20 flex items-center justify-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                Advertentieruimte (Responsive Banner)
            </div>
        </div>
    `;

    const footerHtml = `
        <footer class="bg-white border-t border-slate-200 mt-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm">R</div>
                        <span class="font-heading font-bold text-slate-800">RekenHub Benelux</span>
                        <span class="text-sm text-slate-400">&copy; 2026</span>
                    </div>
                    <div class="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
                        <a href="index.html" class="hover:text-slate-900 transition">Alle Calculators</a>
                        <a href="privacy.html" class="hover:text-slate-900 transition">Privacybeleid</a>
                        <a href="disclaimer.html" class="hover:text-slate-900 transition">Disclaimer</a>
                        <a href="contact.html" class="hover:text-slate-900 transition">Contact</a>
                    </div>
                </div>
                <p class="text-xs text-slate-400 text-center md:text-left mt-6">
                    Alle berekeningen zijn indicatief en gebaseerd op actuele formules en fiscale regels voor België, Nederland en Luxemburg.
                </p>
            </div>
        </footer>
    `;

    const headerPlaceholder = document.getElementById("app-header");
    const footerPlaceholder = document.getElementById("app-footer");

    if (headerPlaceholder) {
        headerPlaceholder.className = "sticky top-0 z-50 w-full";
        headerPlaceholder.innerHTML = headerHtml;
        headerPlaceholder.insertAdjacentHTML("afterend", adBannerHtml);
    }
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    }

    // 4. Extra functies op calculator-pagina's
    const mainEl = document.querySelector("main");
    if (activeTool && mainEl) {
        const h1 = mainEl.querySelector("h1");
        if (h1 && activeTool.fiscal) {
            h1.insertAdjacentHTML("afterend", `
                <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mt-1 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Tarieven & regels bijgewerkt voor 2026</span>
                </div>
            `);
        }

        const firstCard = mainEl.querySelector(".bg-white.rounded-2xl");
        if (firstCard) {
            // Voeg relevante presets/banken toe bovenaan het rekenblok
            const presetConfig = toolPresets[currentPath];
            if (presetConfig) {
                const presetBar = document.createElement("div");
                presetBar.className = "no-print bg-slate-50/90 border-b border-slate-200/80 px-6 py-4 rounded-t-2xl";
                presetBar.innerHTML = `
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-600">${presetConfig.label}</span>
                        <span class="text-[11px] text-slate-400">${presetConfig.note}</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${presetConfig.options.map((opt, idx) => `
                            <button type="button" data-preset-idx="${idx}" class="preset-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 text-xs font-semibold text-slate-700 transition shadow-2xs">
                                <span>${opt.name}</span>
                                <span class="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md">${opt.tag}</span>
                            </button>
                        `).join("")}
                    </div>
                `;
                firstCard.insertAdjacentElement("afterbegin", presetBar);

                presetBar.querySelectorAll(".preset-chip").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const opt = presetConfig.options[parseInt(btn.dataset.presetIdx, 10)];

                        // Highlight geselecteerde chip
                        presetBar.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("border-blue-600", "ring-2", "ring-blue-500/20"));
                        btn.classList.add("border-blue-600", "ring-2", "ring-blue-500/20");

                        // Schakel eventueel landknop om (BE of NL)
                        if (opt.country) {
                            const countryBtn = Array.from(firstCard.querySelectorAll("button")).find(b => b.textContent.includes(`(${opt.country})`));
                            if (countryBtn) countryBtn.click();
                        }

                        // Vul bijbehorende velden in (zoekt op exact ID of op logische naam)
                        Object.entries(opt.values).forEach(([key, val]) => {
                            let target = document.getElementById(key) || document.getElementById("input-" + key);
                            if (!target) {
                                // Fallback: zoek naar een nummerveld dat bij rente/tarief past
                                const numInputs = firstCard.querySelectorAll("input[type='number']");
                                if (key === "rate" && numInputs.length >= 3) target = numInputs[2];
                            }
                            if (target) {
                                target.value = val;
                                target.dispatchEvent(new Event("input", { bubbles: true }));
                                target.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        });
                    });
                });
            }

            // Kopieer / Deel / Print balk
            const actionBar = document.createElement("div");
            actionBar.className = "no-print flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl px-5 py-3 border border-slate-200/90 mb-8 text-xs font-semibold text-slate-600";
            actionBar.innerHTML = `
                <span class="text-slate-400">Berekening bewaren of delen:</span>
                <div class="flex flex-wrap items-center gap-2">
                    <button id="btn-copy-summary" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        📋 <span id="lbl-copy-summary">Kopieer uitkomst</span>
                    </button>
                    <button id="btn-share-link" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        🔗 <span id="lbl-share-link">Deel calculator</span>
                    </button>
                    <button onclick="window.print()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        🖨️ <span>Print / PDF</span>
                    </button>
                </div>
            `;
            firstCard.insertAdjacentElement("afterend", actionBar);

            document.getElementById("btn-copy-summary").addEventListener("click", () => {
                const resEls = firstCard.querySelectorAll("[id^='res-'], [id^='cost-']");
                let lines = [`${activeTool.name} (RekenHub.com):`];
                resEls.forEach(el => {
                    const txt = el.textContent.trim();
                    if (txt && txt.length < 60) lines.push("- " + txt);
                });
                navigator.clipboard.writeText(lines.join("\n"));
                const lbl = document.getElementById("lbl-copy-summary");
                lbl.textContent = "Gekopieerd!";
                setTimeout(() => lbl.textContent = "Kopieer uitkomst", 2000);
            });

            document.getElementById("btn-share-link").addEventListener("click", () => {
                const url = new URL(window.location.href);
                firstCard.querySelectorAll("input[id], select[id]").forEach(inp => {
                    if (inp.type === "checkbox") url.searchParams.set(inp.id, inp.checked ? "1" : "0");
                    else if (inp.value) url.searchParams.set(inp.id, inp.value);
                });
                navigator.clipboard.writeText(url.toString());
                const lbl = document.getElementById("lbl-share-link");
                lbl.textContent = "Link gekopieerd!";
                setTimeout(() => lbl.textContent = "Deel calculator", 2000);
            });

            const params = new URLSearchParams(window.location.search);
            if ([...params.keys()].length > 0) {
                params.forEach((val, key) => {
                    const el = document.getElementById(key);
                    if (el) {
                        if (el.type === "checkbox") el.checked = val === "1";
                        else el.value = val;
                        el.dispatchEvent(new Event("input", { bubbles: true }));
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                });
            }
        }

        // Gerelateerde tools + FAQ
        const related = activeCat.items.filter(i => i.file !== currentPath);
        const otherCat = menuCategories.find(c => c.id !== activeCat.id);
        const suggestions = [...related, otherCat.items[0]].slice(0, 2);

        const faqData = [
            {
                q: `Is de ${activeTool.name} gratis te gebruiken?`,
                a: `Ja, alle calculators op RekenHub Benelux zijn 100% gratis, zonder registratie en werken direct in je webbrowser.`
            },
            {
                q: `Worden mijn ingevulde gegevens opgeslagen?`,
                a: `Nee. Alle berekeningen worden lokaal op jouw eigen apparaat uitgevoerd. Wij slaan geen financiële of persoonlijke bedragen op.`
            },
            {
                q: `Geldt deze berekening voor zowel België als Nederland?`,
                a: `Ja, onze rekenmodules zijn afgestemd op de Benelux (${activeTool.sub}). Waar wetgeving of belastingtarieven verschillen tussen België en Nederland kun je dit bovenaan de tool zelf selecteren.`
            }
        ];

        const bottomBlocksHtml = `
            <section id="faq-auto-box" class="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90 mt-8 space-y-4">
                <h2 class="font-heading text-xl font-bold text-slate-900">Veelgestelde vragen over ${activeTool.name}</h2>
                <div class="divide-y divide-slate-100">
                    ${faqData.map(f => `
                        <details class="py-3 group">
                            <summary class="flex justify-between items-center font-semibold text-sm text-slate-800 cursor-pointer list-none">
                                <span>${f.q}</span>
                                <span class="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                            </summary>
                            <p class="text-sm text-slate-600 mt-2 leading-relaxed">${f.a}</p>
                        </details>
                    `).join("")}
                </div>
            </section>

            <section id="related-tools-box" class="mt-8 space-y-3">
                <h3 class="font-heading text-base font-bold text-slate-800">Handige vervolgstap</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${suggestions.map(s => `
                        <a href="${s.file}" class="group bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 transition flex items-center gap-3.5">
                            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">${s.icon}</div>
                            <div class="min-w-0 flex-grow">
                                <div class="font-heading font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">${s.name}</div>
                                <div class="text-xs text-slate-500 truncate">${s.desc}</div>
                            </div>
                            <span class="text-slate-300 group-hover:text-blue-600 font-bold">→</span>
                        </a>
                    `).join("")}
                </div>
            </section>
        `;
        mainEl.insertAdjacentHTML("beforeend", bottomBlocksHtml);

        const schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        schemaScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
        });
        document.head.appendChild(schemaScript);
    }
});