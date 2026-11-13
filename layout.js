document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    const menuCategories = [
        {
            title: "Financiën",
            items: [
                { name: "BTW Calculator (BE)", file: "btw.html" },
                { name: "Spaar & Rente Simulator", file: "sparen.html" },
                { name: "Flexi-job & Bijverdienste", file: "flexijob.html" },
                { name: "Hypotheek & Woonlening", file: "hypotheek.html" },
                { name: "Registratierechten Vlaanderen", file: "registratierechten.html" },
                { name: "Inflatie & Koopkracht", file: "inflatie.html" }
            ]
        },
        {
            title: "Wonen & Energie",
            items: [
                { name: "Oppervlakte & m²", file: "oppervlakte.html" },
                { name: "Stroomverbruik & Kosten", file: "energie.html" },
                { name: "Zonnepanelen Terugverdientijd", file: "zonnepanelen.html" }
            ]
        },
        {
            title: "Auto & Mobiliteit",
            items: [
                { name: "Laadkosten vs. Benzine", file: "laadkosten.html" },
                { name: "Brandstofkosten Rit", file: "ritkosten.html" },
                { name: "BIV & Verkeersbelasting", file: "autobelasting.html" }
            ]
        },
        {
            title: "Gezondheid & Dagelijks",
            items: [
                { name: "BMI & Caloriebehoefte", file: "bmi.html" },
                { name: "Procenten & Korting", file: "procenten.html" },
                { name: "Werkuren & Uurloon", file: "werkuren.html" }
            ]
        }
    ];

    // Bouw navigatie HTML
    let navDesktopHtml = `<a href="index.html" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${currentPath === 'index.html' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'}">Overzicht</a>`;
    let navMobileHtml = `<a href="index.html" class="block px-3 py-2 rounded-lg text-base font-semibold ${currentPath === 'index.html' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}">Alle Calculators</a>`;

    menuCategories.forEach(cat => {
        const isCatActive = cat.items.some(i => i.file === currentPath);
        navDesktopHtml += `
            <div class="relative group">
                <button class="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${isCatActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'}">
                    <span>${cat.title}</span>
                    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="block px-4 py-2.5 text-sm transition ${currentPath === item.file ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}">
                            ${item.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        navMobileHtml += `
            <div class="pt-3 pb-1">
                <div class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">${cat.title}</div>
                <div class="mt-1 space-y-1">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="block px-3 py-2 rounded-lg text-sm font-medium ${currentPath === item.file ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}">
                            ${item.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const headerHtml = `
        <header class="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-40">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <a href="index.html" class="flex items-center gap-2.5">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm">R</div>
                    <div>
                        <span class="font-extrabold text-slate-900 text-lg tracking-tight">RekenHub</span>
                        <span class="hidden sm:inline-block ml-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">BE & NL</span>
                    </div>
                </a>

                <!-- Desktop Menu -->
                <nav class="hidden md:flex items-center space-x-1">
                    ${navDesktopHtml}
                </nav>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>

            <!-- Mobile Dropdown -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto">
                ${navMobileHtml}
            </div>
        </header>

        <!-- Top AdSense Slot -->
        <div class="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
            <div class="bg-slate-100/80 border border-dashed border-slate-300 rounded-xl h-20 sm:h-24 flex items-center justify-center text-xs font-medium text-slate-400 uppercase tracking-wider">
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
                        <span class="font-bold text-slate-800">RekenHub</span>
                        <span class="text-sm text-slate-400 ml-2">© 2026 Alle rechten voorbehouden.</span>
                    </div>
                    <div class="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
                        <a href="index.html" class="hover:text-blue-600 transition">Alle Tools</a>
                        <a href="privacy.html" class="hover:text-blue-600 transition">Privacybeleid</a>
                        <a href="disclaimer.html" class="hover:text-blue-600 transition">Disclaimer</a>
                        <a href="contact.html" class="hover:text-blue-600 transition">Contact</a>
                    </div>
                </div>
                <p class="text-xs text-slate-400 text-center md:text-left mt-6">
                    Alle berekeningen op deze website zijn indicatief en gebaseerd op actuele formules en tarieven. Aan de uitkomsten kunnen geen rechten worden ontleend.
                </p>
            </div>
        </footer>
    `;

    // Injecteer Header & Footer
    const headerPlaceholder = document.getElementById("app-header");
    const footerPlaceholder = document.getElementById("app-footer");
    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

    // Mobile menu toggle
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }
});