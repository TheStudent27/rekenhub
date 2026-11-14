document.addEventListener("DOMContentLoaded", function () {
    let rawPath = window.location.pathname.split("/").pop() || "index.html";
    if (!rawPath.includes(".")) rawPath += ".html";
    const currentPath = rawPath;

    // 1. Taalbeheer (NL, FR, EN)
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && ["nl", "fr", "en"].includes(urlLang.toLowerCase())) {
        localStorage.setItem("rekenhub_lang", urlLang.toLowerCase());
    }
    const lang = localStorage.getItem("rekenhub_lang") || "nl";
    document.documentElement.lang = lang;

    window.setSiteLang = function (newLang) {
        localStorage.setItem("rekenhub_lang", newLang);
        const url = new URL(window.location.href);
        url.searchParams.delete("lang");
        window.location.href = url.toString();
    };

    // 2. Google Fonts + Print CSS
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

    const uiStrings = {
        nl: {
            overview: "Overzicht",
            allTools: "Alle Calculators",
            adLabel: "Advertentieruimte (Responsive Banner)",
            fiscalBadge: "Tarieven & regels bijgewerkt voor 2026",
            saveShare: "Berekening bewaren of delen:",
            copyRes: "Kopieer uitkomst",
            copied: "Gekopieerd!",
            shareCalc: "Deel calculator",
            linkCopied: "Link gekopieerd!",
            printPdf: "Print / PDF",
            nextStep: "Handige vervolgstap",
            footerNote: "Alle berekeningen zijn indicatief en gebaseerd op actuele formules en fiscale regels voor België, Nederland en Luxemburg.",
            privacy: "Privacybeleid",
            disclaimer: "Disclaimer",
            contact: "Contact",
            transNotice: ""
        },
        fr: {
            overview: "Aperçu",
            allTools: "Tous les calculateurs",
            adLabel: "Espace publicitaire (Bannière responsive)",
            fiscalBadge: "Tarifs et règles mis à jour pour 2026",
            saveShare: "Enregistrer ou partager le calcul :",
            copyRes: "Copier le résultat",
            copied: "Copié !",
            shareCalc: "Partager le lien",
            linkCopied: "Lien copié !",
            printPdf: "Imprimer / PDF",
            nextStep: "Étape suivante utile",
            footerNote: "Tous les calculs sont indicatifs et basés sur les formules et règles fiscales actuelles pour la Belgique, les Pays-Bas et le Luxembourg.",
            privacy: "Confidentialité",
            disclaimer: "Mentions légales",
            contact: "Contact",
            transNotice: "Cette calculatrice est configurée pour la Belgique et les Pays-Bas. Utilisez le traducteur de votre navigateur si nécessaire."
        },
        en: {
            overview: "Overview",
            allTools: "All Calculators",
            adLabel: "Advertisement Space (Responsive Banner)",
            fiscalBadge: "Rates & tax rules updated for 2026",
            saveShare: "Save or share calculation:",
            copyRes: "Copy result",
            copied: "Copied!",
            shareCalc: "Share link",
            linkCopied: "Link copied!",
            printPdf: "Print / PDF",
            nextStep: "Recommended next step",
            footerNote: "All calculations are indicative and based on current formulas and tax rules for Belgium, the Netherlands, and Luxembourg.",
            privacy: "Privacy Policy",
            disclaimer: "Disclaimer",
            contact: "Contact",
            transNotice: "This calculator uses Benelux defaults (BE/NL/LU). You can adjust all rates and inputs freely below."
        }
    };

    const t = uiStrings[lang];

    // Logische 5-delige verdeling
    const menuCategories = [
        {
            id: "financien",
            title: { nl: "Sparen, Lenen & Vastgoed", fr: "Épargne, Prêt & Immobilier", en: "Savings, Loans & Property" },
            short: { nl: "Geld & Vastgoed", fr: "Finances", en: "Finance & Property" },
            items: [
                { name: { nl: "Hypotheek & Woonlening", fr: "Prêt Hypothécaire", en: "Mortgage & Loan" }, sub: { nl: "Maandlast & aflossing", fr: "Mensualité & intérêts", en: "Monthly payment" }, file: "hypotheek.html", icon: "🏦", fiscal: false },
                { name: { nl: "Sparen & Beleggen", fr: "Épargne & Investissement", en: "Savings & Compound Interest" }, sub: { nl: "Netto na belasting", fr: "Net après impôt", en: "Net after tax" }, file: "sparen.html", icon: "📈", fiscal: true },
                { name: { nl: "Registratie & Overdracht", fr: "Droits d'enregistrement", en: "Property Transfer Tax" }, sub: { nl: "Aankoopkosten woning", fr: "Frais d'achat immobilier", en: "Closing costs" }, file: "registratierechten.html", icon: "🔑", fiscal: true },
                { name: { nl: "Inflatie & Koopkracht", fr: "Inflation & Pouvoir d'achat", en: "Inflation Calculator" }, sub: { nl: "Waardeverlies spaargeld", fr: "Perte de valeur", en: "Purchasing power" }, file: "inflatie.html", icon: "📉", fiscal: false }
            ]
        },
        {
            id: "werk-btw",
            title: { nl: "Werk, Loon & Btw", fr: "Travail, Salaire & TVA", en: "Work, Income & Tax" },
            short: { nl: "Werk & Btw", fr: "Travail & TVA", en: "Work & Tax" },
            items: [
                { name: { nl: "Werkuren & Uurloon", fr: "Heures & Salaire Horaire", en: "Work Hours & Pay" }, sub: { nl: "Decimale uren & loon", fr: "Heures décimales", en: "Decimal hours & wage" }, file: "werkuren.html", icon: "⏱️", fiscal: false },
                { name: { nl: "Flexi-job Loon (BE)", fr: "Salaire Flexi-job (BE)", en: "Flexi-job Wage (BE)" }, sub: { nl: "Bruto = netto & plafond", fr: "Brut = net & plafond", en: "Tax-free side income" }, file: "flexijob.html", icon: "💼", fiscal: true },
                { name: { nl: "BTW Calculator", fr: "Calculateur TVA", en: "VAT / Sales Tax" }, sub: { nl: "BE • NL • LU tarieven", fr: "Taux BE • NL • LU", en: "BE • NL • LU rates" }, file: "btw.html", icon: "🧾", fiscal: true },
                { name: { nl: "Procenten & Marge", fr: "Pourcentage & Marge", en: "Percentage & Margin" }, sub: { nl: "Korting, winstmarge & %", fr: "Remise, marge & %", en: "Discount & profit margin" }, file: "procenten.html", icon: "🏷️", fiscal: false }
            ]
        },
        {
            id: "wonen",
            title: { nl: "Wonen & Energie", fr: "Maison & Énergie", en: "Home & Energy" },
            short: { nl: "Wonen & Energie", fr: "Maison & Énergie", en: "Home & Energy" },
            items: [
                { name: { nl: "Oppervlakte & Omtrek (m²)", fr: "Surface & Périmètre (m²)", en: "Square Meter (m²) Area" }, sub: { nl: "Vierkante meters & verf", fr: "Mètres carrés & peinture", en: "Area & perimeter" }, file: "oppervlakte.html", icon: "📐", fiscal: false },
                { name: { nl: "Stroomverbruik (kWh)", fr: "Consommation Électrique", en: "Electricity Cost (kWh)" }, sub: { nl: "Kosten per toestel", fr: "Coût par appareil", en: "Appliance usage" }, file: "energie.html", icon: "🔌", fiscal: false },
                { name: { nl: "Zonnepanelen", fr: "Panneaux Solaires", en: "Solar Panel ROI" }, sub: { nl: "Terugverdientijd", fr: "Temps de retour", en: "Payback period" }, file: "zonnepanelen.html", icon: "☀️", fiscal: true }
            ]
        },
        {
            id: "auto",
            title: { nl: "Auto & Mobiliteit", fr: "Auto & Mobilité", en: "Auto & Mobility" },
            short: { nl: "Auto & Laden", fr: "Auto & Recharge", en: "Auto & EV" },
            items: [
                { name: { nl: "Laadkosten vs. Benzine", fr: "Recharge VE vs Essence", en: "EV Charging vs. Gas" }, sub: { nl: "EV besparing per jaar", fr: "Économie annuelle VE", en: "Annual EV savings" }, file: "laadkosten.html", icon: "🔋", fiscal: false },
                { name: { nl: "Brandstofkosten Rit", fr: "Coût Carburant Trajet", en: "Fuel Trip Cost" }, sub: { nl: "Verbruik & kosten delen", fr: "Consommation & partage", en: "Consumption & split" }, file: "ritkosten.html", icon: "⛽", fiscal: false },
                { name: { nl: "Autobelasting", fr: "Taxe Auto (TMC / Taxe)", en: "Vehicle Tax (BE & NL)" }, sub: { nl: "BIV, rijtaks, BPM & MRB", fr: "TMC, circulation, BPM", en: "Registration & road tax" }, file: "autobelasting.html", icon: "🚗", fiscal: true }
            ]
        },
        {
            id: "gezondheid",
            title: { nl: "Gezondheid & Sport", fr: "Santé & Sport", en: "Health & Fitness" },
            short: { nl: "Gezondheid", fr: "Santé", en: "Health" },
            items: [
                { name: { nl: "BMI & Caloriebehoefte", fr: "IMC & Besoins Caloriques", en: "BMI & Calorie Calculator" }, sub: { nl: "Gezond gewicht & kcal", fr: "Poids idéal & kcal", en: "Healthy weight & kcal" }, file: "bmi.html", icon: "⚖️", fiscal: false }
            ]
        }
    ];

    const activeCat = menuCategories.find(c => c.items.some(i => i.file === currentPath));
    const activeTool = activeCat ? activeCat.items.find(i => i.file === currentPath) : null;

    if (activeTool) {
        try {
            let recent = JSON.parse(localStorage.getItem("rekenhub_recent") || "[]");
            recent = recent.filter(r => r.file !== activeTool.file);
            recent.unshift({ name: activeTool.name, file: activeTool.file, icon: activeTool.icon });
            localStorage.setItem("rekenhub_recent", JSON.stringify(recent.slice(0, 3)));
        } catch (e) {}
    }

    const langSwitcherHtml = `
        <div class="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs font-bold">
            ${["nl", "fr", "en"].map(code => `
                <button type="button" onclick="setSiteLang('${code}')" class="px-2 py-1 rounded-md uppercase transition ${lang === code ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}">
                    ${code}
                </button>
            `).join("")}
        </div>
    `;

    let navDesktopHtml = `<a href="index.html" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPath === 'index.html' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">${t.overview}</a>`;
    let navMobileHtml = `<a href="index.html" class="block px-3 py-2.5 rounded-xl text-base font-semibold ${currentPath === 'index.html' ? 'text-blue-600 bg-blue-50' : 'text-slate-800'}">${t.allTools}</a>`;

    menuCategories.forEach(cat => {
        const isCatActive = cat.items.some(i => i.file === currentPath);
        navDesktopHtml += `
            <div class="relative group">
                <button class="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition ${isCatActive ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}">
                    <span>${cat.short[lang]}</span>
                    <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div class="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">${cat.title[lang]}</div>
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-4 py-2.5 transition ${currentPath === item.file ? 'bg-blue-50/90 text-blue-600' : 'text-slate-800 hover:bg-slate-50'}">
                            <span class="text-sm font-semibold leading-snug ${currentPath === item.file ? 'text-blue-600' : 'text-slate-900'}">${item.name[lang]}</span>
                            <span class="text-xs text-slate-400 mt-0.5 leading-tight">${item.sub[lang]}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        navMobileHtml += `
            <div class="pt-3 pb-1 border-t border-slate-100">
                <div class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">${cat.title[lang]}</div>
                <div class="mt-1.5 space-y-1">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-3 py-2 rounded-xl ${currentPath === item.file ? 'bg-blue-50' : 'hover:bg-slate-50'}">
                            <span class="text-sm font-semibold ${currentPath === item.file ? 'text-blue-600' : 'text-slate-800'}">${item.name[lang]}</span>
                            <span class="text-xs text-slate-400 mt-0.5">${item.sub[lang]}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const headerHtml = `
        <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/90">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                <a href="index.html" class="flex items-center gap-2.5 shrink-0">
                    <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-heading font-bold text-base">R</div>
                    <div class="flex items-center gap-2">
                        <span class="font-heading font-bold text-slate-900 text-lg">RekenHub</span>
                        <span class="hidden sm:inline-block text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">Benelux</span>
                    </div>
                </a>

                <nav class="hidden lg:flex items-center space-x-1">${navDesktopHtml}</nav>

                <div class="flex items-center gap-2.5">
                    ${langSwitcherHtml}
                    <button id="mobile-menu-btn" aria-label="Menu" class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto shadow-lg">
                ${navMobileHtml}
            </div>
        </header>
    `;

    const adBannerHtml = `
        <div class="no-print max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
            <div class="bg-slate-100/70 border border-dashed border-slate-300 rounded-xl h-16 sm:h-20 flex items-center justify-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                ${t.adLabel}
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
                        <a href="index.html" class="hover:text-slate-900 transition">${t.allTools}</a>
                        <a href="privacy.html" class="hover:text-slate-900 transition">${t.privacy}</a>
                        <a href="disclaimer.html" class="hover:text-slate-900 transition">${t.disclaimer}</a>
                        <a href="contact.html" class="hover:text-slate-900 transition">${t.contact}</a>
                    </div>
                </div>
                <p class="text-xs text-slate-400 text-center md:text-left mt-6">${t.footerNote}</p>
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

    const mainEl = document.querySelector("main");
    if (activeTool && mainEl) {
        if (t.transNotice) {
            mainEl.insertAdjacentHTML("afterbegin", `
                <div class="no-print bg-blue-50/80 border border-blue-200 text-blue-800 rounded-xl px-4 py-2.5 text-xs font-medium mb-5 flex items-center justify-between gap-2">
                    <span>🌐 ${t.transNotice}</span>
                    <button onclick="setSiteLang('nl')" class="underline font-bold shrink-0">NL</button>
                </div>
            `);
        }

        const h1 = mainEl.querySelector("h1");
        if (h1 && activeTool.fiscal) {
            h1.insertAdjacentHTML("afterend", `
                <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mt-1 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>${t.fiscalBadge}</span>
                </div>
            `);
        }

        const firstCard = mainEl.querySelector(".bg-white.rounded-2xl");
        if (firstCard) {
            const actionBar = document.createElement("div");
            actionBar.className = "no-print flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl px-5 py-3 border border-slate-200/90 mb-8 text-xs font-semibold text-slate-600";
            actionBar.innerHTML = `
                <span class="text-slate-400">${t.saveShare}</span>
                <div class="flex flex-wrap items-center gap-2">
                    <button id="btn-copy-summary" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        📋 <span id="lbl-copy-summary">${t.copyRes}</span>
                    </button>
                    <button id="btn-share-link" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        🔗 <span id="lbl-share-link">${t.shareCalc}</span>
                    </button>
                    <button onclick="window.print()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition">
                        🖨️ <span>${t.printPdf}</span>
                    </button>
                </div>
            `;
            firstCard.insertAdjacentElement("afterend", actionBar);

            document.getElementById("btn-copy-summary").addEventListener("click", () => {
                const resEls = firstCard.querySelectorAll("[id^='res-'], [id^='cost-']");
                let lines = [`${activeTool.name[lang]} (RekenHub):`];
                resEls.forEach(el => {
                    const txt = el.textContent.trim();
                    if (txt && txt.length < 60) lines.push("- " + txt);
                });
                navigator.clipboard.writeText(lines.join("\n"));
                const lbl = document.getElementById("lbl-copy-summary");
                lbl.textContent = t.copied;
                setTimeout(() => lbl.textContent = t.copyRes, 2000);
            });

            document.getElementById("btn-share-link").addEventListener("click", () => {
                const url = new URL(window.location.href);
                firstCard.querySelectorAll("input[id], select[id]").forEach(inp => {
                    if (inp.type === "checkbox") url.searchParams.set(inp.id, inp.checked ? "1" : "0");
                    else if (inp.value) url.searchParams.set(inp.id, inp.value);
                });
                navigator.clipboard.writeText(url.toString());
                const lbl = document.getElementById("lbl-share-link");
                lbl.textContent = t.linkCopied;
                setTimeout(() => lbl.textContent = t.shareCalc, 2000);
            });
        }

        const related = activeCat.items.filter(i => i.file !== currentPath);
        const otherCat = menuCategories.find(c => c.id !== activeCat.id);
        const suggestions = [...related, otherCat.items[0]].slice(0, 2);

        mainEl.insertAdjacentHTML("beforeend", `
            <section id="related-tools-box" class="mt-8 space-y-3">
                <h3 class="font-heading text-base font-bold text-slate-800">${t.nextStep}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${suggestions.map(s => `
                        <a href="${s.file}" class="group bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 transition flex items-center gap-3.5">
                            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">${s.icon}</div>
                            <div class="min-w-0 flex-grow">
                                <div class="font-heading font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">${s.name[lang]}</div>
                                <div class="text-xs text-slate-500 truncate">${s.sub[lang]}</div>
                            </div>
                            <span class="text-slate-300 group-hover:text-blue-600 font-bold">→</span>
                        </a>
                    `).join("")}
                </div>
            </section>
        `);
    }
});