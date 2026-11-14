document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    const menuCategories = [
        {
            id: "financien",
            title: "Financiën & Belastingen",
            short: "Financiën",
            color: "blue",
            icon: "💶",
            items: [
                { name: "BTW Berekenen", sub: "BE • NL • LU", file: "btw.html" },
                { name: "Sparen & Beleggen", sub: "Netto na taks", file: "sparen.html" },
                { name: "Hypotheek & Lening", sub: "Maandlast & rente", file: "hypotheek.html" },
                { name: "Registratie & Overdracht", sub: "Aankoopkosten woning", file: "registratierechten.html" },
                { name: "Flexi-job Loon (BE)", sub: "Bruto = Netto", file: "flexijob.html" },
                { name: "Inflatie & Koopkracht", sub: "Waardeverlies", file: "inflatie.html" }
            ]
        },
        {
            id: "wonen",
            title: "Wonen & Energie",
            short: "Wonen & Energie",
            color: "amber",
            icon: "⚡",
            items: [
                { name: "Stroomverbruik (kWh)", sub: "Kosten per toestel", file: "energie.html" },
                { name: "Zonnepanelen", sub: "Terugverdientijd", file: "zonnepanelen.html" },
                { name: "Oppervlakte (m²)", sub: "Vloer, muur & tuin", file: "oppervlakte.html" }
            ]
        },
        {
            id: "auto",
            title: "Auto & Mobiliteit",
            short: "Auto & Laden",
            color: "emerald",
            icon: "🚗",
            items: [
                { name: "Laadkosten vs. Benzine", sub: "EV besparing", file: "laadkosten.html" },
                { name: "Brandstofkosten Rit", sub: "Splits per persoon", file: "ritkosten.html" },
                { name: "Autobelasting", sub: "BIV, BPM & MRB", file: "autobelasting.html" }
            ]
        },
        {
            id: "dagelijks",
            title: "Dagelijks & Gezondheid",
            short: "Dagelijks",
            color: "purple",
            icon: "🧮",
            items: [
                { name: "Procenten & Korting", sub: "Solden & marges", file: "procenten.html" },
                { name: "Werkuren & Uurloon", sub: "Decimale uren", file: "werkuren.html" },
                { name: "BMI & Calorieën", sub: "Gezond gewicht", file: "bmi.html" }
            ]
        }
    ];

    const colorMap = {
        blue: { pill: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white", active: "bg-blue-600 text-white border-blue-600" },
        amber: { pill: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-500 hover:text-white", active: "bg-amber-500 text-white border-amber-500" },
        emerald: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white", active: "bg-emerald-600 text-white border-emerald-600" },
        purple: { pill: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white", active: "bg-purple-600 text-white border-purple-600" }
    };

    // Bouw horizontale categorie-snelbalk + dropdowns
    let quickBarHtml = `<a href="index.html" class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-extrabold border transition ${currentPath === 'index.html' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}">🏠 Alle 15 Tools</a>`;
    let navMobileHtml = `<a href="index.html" class="block px-3 py-2.5 rounded-xl text-base font-bold ${currentPath === 'index.html' ? 'text-blue-600 bg-blue-50' : 'text-slate-800'}">🏠 Alle Calculators (Overzicht)</a>`;

    menuCategories.forEach(cat => {
        const isCatActive = cat.items.some(i => i.file === currentPath);
        const cStyle = isCatActive ? colorMap[cat.color].active : colorMap[cat.color].pill;

        quickBarHtml += `
            <div class="relative group shrink-0">
                <a href="index.html#${cat.id}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold border transition ${cStyle}">
                    <span>${cat.icon}</span>
                    <span>${cat.short}</span>
                    <svg class="w-3.5 h-3.5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </a>
                <div class="hidden md:block absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div class="px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">${cat.title}</div>
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex items-center justify-between px-3.5 py-2 text-sm transition ${currentPath === item.file ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}">
                            <span>${item.name}</span>
                            <span class="text-[11px] text-slate-400 font-medium">${item.sub}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        navMobileHtml += `
            <div class="pt-3 pb-1 border-t border-slate-100">
                <div class="px-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">${cat.icon} ${cat.title}</div>
                <div class="mt-1.5 grid grid-cols-1 gap-1">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex justify-between items-center px-3 py-2 rounded-lg text-sm font-semibold ${currentPath === item.file ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}">
                            <span>${item.name}</span>
                            <span class="text-xs text-slate-400">${item.sub}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const headerHtml = `
        <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <!-- Bovenste balk: Logo + Snelle Zoekbalk + Info Links -->
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <a href="index.html" class="flex items-center gap-2.5 shrink-0">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-xs">R</div>
                    <div class="leading-tight">
                        <span class="font-extrabold text-slate-900 text-lg tracking-tight">RekenHub</span>
                        <span class="ml-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Benelux</span>
                    </div>
                </a>

                <!-- Globale snelzoeker in header -->
                <div class="relative flex-grow max-w-md hidden sm:block">
                    <input type="text" id="global-header-search" placeholder="Snel naar calculator (bijv. btw, hypotheek, m²)..." class="w-full rounded-xl bg-slate-100 border border-slate-200 pl-9 pr-3 py-1.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <div id="global-search-dropdown" class="hidden absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-72 overflow-y-auto"></div>
                </div>

                <div class="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-500 shrink-0">
                    <a href="contact.html" class="hover:text-blue-600 transition">Tool aanvragen</a>
                    <a href="disclaimer.html" class="hover:text-blue-600 transition">Info</a>
                </div>

                <button id="mobile-menu-btn" aria-label="Menu openen" class="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>

            <!-- Onderste sticky balk: Directe categorie-knoppen -->
            <div class="bg-slate-50/90 border-t border-slate-200/70">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
                    ${quickBarHtml}
                </div>
            </div>

            <!-- Mobiel uitklapmenu -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto shadow-lg">
                ${navMobileHtml}
            </div>
        </header>
    `;

    const adBannerHtml = `
        <div class="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
            <div class="bg-slate-100/80 border border-dashed border-slate-300 rounded-xl h-16 sm:h-20 flex items-center justify-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                Advertentieruimte (Responsive Banner)
            </div>
        </div>
    `;

    const footerHtml = `
        <footer class="bg-white border-t border-slate-200 mt-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                        <span class="font-bold text-slate-800">RekenHub Benelux</span>
                        <span class="text-sm text-slate-400 ml-2">&copy; 2026</span>
                    </div>
                    <div class="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-600">
                        <a href="index.html" class="hover:text-blue-600 transition">Alle Calculators</a>
                        <a href="privacy.html" class="hover:text-blue-600 transition">Privacybeleid</a>
                        <a href="disclaimer.html" class="hover:text-blue-600 transition">Disclaimer</a>
                        <a href="contact.html" class="hover:text-blue-600 transition">Contact</a>
                    </div>
                </div>
                <p class="text-xs text-slate-400 text-center md:text-left mt-6">
                    Alle berekeningen zijn indicatief en gebaseerd op actuele formules en tarieven voor België, Nederland en Luxemburg.
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

    // Mobiel menu toggle
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    }

    // Live zoekfunctie in de sticky header
    const allFlatItems = menuCategories.flatMap(c => c.items.map(i => ({ ...i, cat: c.short, icon: c.icon })));
    const searchInput = document.getElementById("global-header-search");
    const searchDrop = document.getElementById("global-search-dropdown");

    if (searchInput && searchDrop) {
        searchInput.addEventListener("input", function () {
            const q = this.value.toLowerCase().trim();
            if (!q) {
                searchDrop.classList.add("hidden");
                return;
            }
            const matches = allFlatItems.filter(i => i.name.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q));
            if (matches.length === 0) {
                searchDrop.innerHTML = `<div class="px-4 py-3 text-xs text-slate-500">Geen calculator gevonden voor "${this.value}"</div>`;
            } else {
                searchDrop.innerHTML = matches.map(m => `
                    <a href="${m.file}" class="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition">
                        <div class="flex items-center gap-2">
                            <span>${m.icon}</span>
                            <span class="text-sm font-bold text-slate-800">${m.name}</span>
                        </div>
                        <span class="text-xs font-medium text-slate-400">${m.sub}</span>
                    </a>
                `).join('');
            }
            searchDrop.classList.remove("hidden");
        });

        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !searchDrop.contains(e.target)) {
                searchDrop.classList.add("hidden");
            }
        });
    }
});