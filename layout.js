document.addEventListener("DOMContentLoaded", function () {
    let rawPath = window.location.pathname.split("/").pop() || "index.html";
    if (!rawPath.includes(".")) rawPath += ".html";
    const currentPath = rawPath;

    // 1. Taalbeheer (NL, FR, EN)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
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

    // 2. Verfijnde Google Fonts (Plus Jakarta Sans + Inter) & Subtiele Pagina-achtergrond
    if (!document.getElementById("rekenhub-fonts")) {
        const fontLink = document.createElement("link");
        fontLink.id = "rekenhub-fonts";
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap";
        document.head.appendChild(fontLink);

        const style = document.createElement("style");
        style.textContent = `
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 15px;
                line-height: 1.6;
                color: #0f172a;
                background-color: #f1f5f9;
                background-image:
                    radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.08) 0px, transparent 45%),
                    radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.08) 0px, transparent 45%),
                    radial-gradient(#cbd5e1 1px, transparent 1px);
                background-size: 100% 100%, 100% 100%, 24px 24px;
                background-attachment: fixed;
            }
            h1, h2, h3, .font-heading {
                font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
                letter-spacing: -0.025em;
            }
            input[type="number"], .tabular-nums { font-variant-numeric: tabular-nums; }
            @media print {
                #app-header, #app-footer, .no-print, #related-tools-box, #official-sources-box, #left-ad-rail, #right-ad-rail { display: none !important; }
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
            fiscalBadge: "Gecontroleerd voor belastingjaar 2026 (België & Nederland)",
            saveShare: "Berekening bewaren of delen:",
            copyRes: "Kopieer uitkomst",
            copied: "Gekopieerd!",
            shareCalc: "Deel berekening",
            linkCopied: "Link gekopieerd!",
            printPdf: "Print / PDF",
            nextStep: "Handige vervolgstap",
            sourcesBadge: "Officiële Wetgeving & Bronnen 2026",
            sourcesTitle: "Officiële 2026-regels & Bronvermelding (België vs. Nederland)",
            sourcesSub: "Wij scheiden de Belgische en Nederlandse wetgeving strikt. Controleer hieronder de officiële overheidsbronnen:",
            beRulesTitle: "Regels voor België (2026)",
            beSourcesLbl: "Officiële bronnen België:",
            nlRulesTitle: "Regels voor Nederland (2026)",
            nlSourcesLbl: "Officiële bronnen Nederland:",
            footerPopular: "Populair in België & Nederland",
            footerGov: "Officiële Overheidsbronnen",
            footerLegal: "Informatie & Juridisch",
            footerVerified: "✓ Tarieven geverifieerd: 2026",
            footerDesc: "Onafhankelijk rekenplatform voor België, Nederland en Luxemburg. Alle berekeningen draaien 100% lokaal in je browser zonder opslag van privégegevens.",
            footerNote: "Alle berekeningen zijn indicatief en gebaseerd op de officiële 2026-tarieven van o.a. FOD Financiën, Vlaanderen.be, Belastingdienst.nl en Rijksoverheid.nl.",
            privacy: "Privacybeleid",
            disclaimer: "Disclaimer & Bronnen",
            contact: "Contact"
        },
        fr: {
            overview: "Aperçu",
            allTools: "Tous les calculateurs",
            fiscalBadge: "Vérifié pour l'année fiscale 2026 (Belgique & Pays-Bas)",
            saveShare: "Enregistrer ou partager le calcul :",
            copyRes: "Copier le résultat",
            copied: "Copié !",
            shareCalc: "Partager le lien",
            linkCopied: "Lien copié !",
            printPdf: "Imprimer / PDF",
            nextStep: "Étape suivante utile",
            sourcesBadge: "Législation Officielle & Sources 2026",
            sourcesTitle: "Règles officielles 2026 & Sources (Belgique vs Pays-Bas)",
            sourcesSub: "Les législations belge et néerlandaise sont strictement séparées. Consultez les sources officielles ci-dessous :",
            beRulesTitle: "Règles pour la Belgique (2026)",
            beSourcesLbl: "Sources officielles Belgique :",
            nlRulesTitle: "Règles pour les Pays-Bas (2026)",
            nlSourcesLbl: "Sources officielles Pays-Bas :",
            footerPopular: "Populaire en Belgique & Pays-Bas",
            footerGov: "Sources Officielles de l'État",
            footerLegal: "Informations & Mentions Légales",
            footerVerified: "✓ Barèmes vérifiés : 2026",
            footerDesc: "Plateforme de calcul indépendante pour la Belgique, les Pays-Bas et le Luxembourg. Tous les calculs s'exécutent localement dans votre navigateur.",
            footerNote: "Tous les calculs sont indicatifs et basés sur les barèmes officiels 2026 du SPF Finances, Vlaanderen.be et Belastingdienst.nl.",
            privacy: "Confidentialité",
            disclaimer: "Mentions légales",
            contact: "Contact"
        },
        en: {
            overview: "Overview",
            allTools: "All Calculators",
            fiscalBadge: "Verified for tax year 2026 (Belgium & Netherlands)",
            saveShare: "Save or share calculation:",
            copyRes: "Copy result",
            copied: "Copied!",
            shareCalc: "Share link",
            linkCopied: "Link copied!",
            printPdf: "Print / PDF",
            nextStep: "Recommended next step",
            sourcesBadge: "Official Legislation & Sources 2026",
            sourcesTitle: "Official 2026 Rules & Sources (Belgium vs. Netherlands)",
            sourcesSub: "Belgian and Dutch tax rules are strictly separated. Verify details via the official government portals below:",
            beRulesTitle: "Rules for Belgium (2026)",
            beSourcesLbl: "Official sources Belgium:",
            nlRulesTitle: "Rules for the Netherlands (2026)",
            nlSourcesLbl: "Official sources Netherlands:",
            footerPopular: "Popular in Belgium & Netherlands",
            footerGov: "Official Government Portals",
            footerLegal: "Information & Legal",
            footerVerified: "✓ Rates verified: 2026",
            footerDesc: "Independent calculator hub for Belgium, the Netherlands, and Luxembourg. All calculations run 100% locally in your browser.",
            footerNote: "All calculations are indicative and based on official 2026 rates from FPS Finance (BE), Vlaanderen.be, and Belastingdienst.nl.",
            privacy: "Privacy Policy",
            disclaimer: "Disclaimer & Sources",
            contact: "Contact"
        }
    };

    const t = uiStrings[lang];

    const toolSources = {
        "werkuren.html": {
            be: {
                summary: {
                    nl: "In België geldt in 2026 een gewaarborgd gemiddeld minimum maandinkomen (GGMMI) van € 2.233,61 bruto (€ 13,56/uur bij 38u/week). Op het brutoloon wordt 13,07% RSZ ingehouden en daarna bedrijfsvoorheffing volgens gezinslast.",
                    fr: "En Belgique, le revenu minimum mensuel moyen garanti (RMMMG) en 2026 s'élève à 2 233,61 € brut (13,56 €/h pour 38h/semaine), soumis à 13,07% d'ONSS et au précompte professionnel.",
                    en: "In Belgium, the 2026 guaranteed average minimum monthly income (GGMMI) is € 2,233.61 gross (€ 13.56/hr at 38h/week), subject to 13.07% social security and withholding tax."
                },
                links: [
                    { label: "FOD WASO — Minimumlonen & Barema's", url: "https://werk.belgie.be/nl/themas/verloning/minimumloon" },
                    { label: "FOD Financiën — Bedrijfsvoorheffing 2026", url: "https://fin.belgium.be/nl/ondernemingen/personeel-en-loon/bedrijfsvoorheffing" }
                ]
            },
            nl: {
                summary: {
                    nl: "In Nederland geldt sinds 1 juli 2026 een wettelijk minimumuurloon van € 14,99 bruto voor werknemers van 21 jaar en ouder (plus 8% vakantiegeld). Je nettoloon hangt af van de loonheffingskorting.",
                    fr: "Aux Pays-Bas, le salaire horaire minimum légal depuis le 1er juillet 2026 est de 14,99 € brut pour les 21 ans et plus (plus 8% de pécule de vacances).",
                    en: "In the Netherlands, the statutory minimum hourly wage from July 1, 2026 is € 14.99 gross for workers aged 21+ (plus 8% holiday allowance)."
                },
                links: [
                    { label: "Rijksoverheid.nl — Bedragen minimumloon 2026", url: "https://www.rijksoverheid.nl/onderwerpen/minimumloon/bedragen-minimumloon" },
                    { label: "Belastingdienst.nl — Loonheffingskorting", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/wat-is-loonheffingskorting" }
                ]
            }
        },
        "sparen.html": {
            be: {
                summary: {
                    nl: "In België is de eerste € 1.020 aan intresten per jaar op een gereglementeerde spaarrekening vrijgesteld van roerende voorheffing (€ 2.040 voor gehuwden). Daarboven betaal je 15% RV.",
                    fr: "En Belgique, la première tranche de 1 020 € d'intérêts par an sur un compte d'épargne réglementé est exonérée de précompte mobilier (2 040 € pour les couples). Au-delà, le taux est de 15%.",
                    en: "In Belgium, the first € 1,020 of annual interest on a regulated savings account is exempt from withholding tax (€ 2,040 for couples). Above that, 15% tax applies."
                },
                links: [
                    { label: "FOD Financiën — Belasting op spaarrekeningen", url: "https://fin.belgium.be/nl/particulieren/belastingaangifte/inkomsten/roerende-inkomsten" },
                    { label: "Wikifin (FSMA) — Spaarrekeningen vergelijken", url: "https://www.wikifin.be/nl/sparen-en-beleggen/spaarproducten/spaarrekening" }
                ]
            },
            nl: {
                summary: {
                    nl: "In Nederland bedraagt het heffingsvrij vermogen in Box 3 voor 2026 € 59.357 per persoon (€ 118.714 voor fiscale partners). Daarboven rekent de Belastingdienst met 1,28% voor spaargeld en 6,00% voor beleggingen tegen 36% belasting.",
                    fr: "Aux Pays-Bas, l'abattement Box 3 en 2026 est de 59 357 € par personne (118 714 € pour les partenaires fiscaux), taxé à 36% sur un rendement forfaitaire.",
                    en: "In the Netherlands, the 2026 Box 3 tax-free allowance is € 59,357 per person (€ 118,714 for fiscal partners), taxed at 36% on assumed returns."
                },
                links: [
                    { label: "Belastingdienst.nl — Berekening Box 3 in 2026", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026" }
                ]
            }
        },
        "registratierechten.html": {
            be: {
                summary: {
                    nl: "In Vlaanderen betaal je in 2026 voor je enige eigen woning 2% verkooprecht, mits je binnen 3 jaar je domicilie vestigt én er minstens 1 jaar onafgebroken effectief woont. Voor een tweede woning geldt 12%.",
                    fr: "En Flandre, le droit de vente pour l'habitation propre et unique est de 2% en 2026 (sous condition d'occupation effective d'au moins 1 an). Pour une seconde résidence, il est de 12%.",
                    en: "In Flanders, the 2026 transfer tax for a sole own home is 2% (subject to at least 1 year of continuous residency). Second homes are taxed at 12%."
                },
                links: [
                    { label: "Vlaanderen.be — Verlaagd tarief 2% enige eigen woning", url: "https://www.vlaanderen.be/belastingen-en-begroting/vlaamse-belastingen/registratiebelasting/verkooprecht/tarieven-in-het-verkooprecht/verlaagd-tarief-in-het-verkooprecht-voor-de-aankoop-van-de-enige-eigen-woning" },
                    { label: "Notaris.be — Aankoopkosten berekenen", url: "https://www.notaris.be/rekenmodules" }
                ]
            },
            nl: {
                summary: {
                    nl: "In Nederland betaal je in 2026 tussen 18 en 35 jaar 0% overdrachtsbelasting (startersvrijstelling) tot € 555.000. Ben je 35 jaar of ouder en ga je er zelf wonen, dan betaal je 2% (beleggingspand: 8%).",
                    fr: "Aux Pays-Bas, les acheteurs de 18 à 35 ans bénéficient d'une exonération de 0% jusqu'à 555 000 € en 2026. À partir de 35 ans, le taux est de 2% (8% pour un investissement).",
                    en: "In the Netherlands, buyers aged 18–35 pay 0% transfer tax up to € 555,000 in 2026. Buyers aged 35+ pay 2% for owner-occupied homes (8% for investments)."
                },
                links: [
                    { label: "Belastingdienst.nl — Startersvrijstelling 2026 (€ 555.000)", url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling" },
                    { label: "Rijksoverheid.nl — Tarieven overdrachtsbelasting", url: "https://www.rijksoverheid.nl/onderwerpen/huis-kopen/vraag-en-antwoord/vrijstelling-overdrachtsbelasting" }
                ]
            }
        },
        "flexijob.html": {
            be: {
                summary: {
                    nl: "In België betaal je als flexi-jobber geen RSZ of personenbelasting (bruto = netto, incl. 7,67% flexivakantiegeld). Voor niet-gepensioneerden geldt in 2026 een fiscaal vrijgesteld plafond van € 18.440 per jaar.",
                    fr: "En Belgique, les travailleurs flexi-job ne paient ni ONSS ni impôt (brut = net, incl. 7,67% de pécule de vacances) jusqu'au plafond exonéré de 18 440 € par an en 2026.",
                    en: "In Belgium, flexi-job workers pay zero social security or income tax (gross = net, incl. 7.67% holiday pay) up to the € 18,440 annual tax-free cap in 2026."
                },
                links: [
                    { label: "FOD Financiën — Flexi-jobs & plafond 2026", url: "https://fin.belgium.be/nl/particulieren/belastingaangifte/inkomsten/flexi-jobs" },
                    { label: "Vlaanderen.be — Voorwaarden flexi-job", url: "https://www.vlaanderen.be/flexi-job" }
                ]
            },
            nl: {
                summary: {
                    nl: "Nederland kent geen apart 'flexi-job'-statuut. Bijverdiensten naast een vaste baan worden in Nederland gewoon belast in Box 1.",
                    fr: "Les Pays-Bas ne disposent pas de statut 'flexi-job' spécifique. Les revenus complémentaires sont imposés normalement en Box 1.",
                    en: "The Netherlands has no separate 'flexi-job' status. Side earnings alongside a regular job are taxed normally in Box 1."
                },
                links: [
                    { label: "Belastingdienst.nl — Meerdere werkgevers & loonheffing", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/ik-heb-meerdere-werkgevers" }
                ]
            }
        },
        "btw.html": {
            be: {
                summary: {
                    nl: "In België bedraagt het standaard btw-tarief 21%, naast verlaagde tarieven van 12% (horeca) en 6% (voeding, renovatie > 10 jaar).",
                    fr: "En Belgique, le taux normal de TVA est de 21%, avec des taux réduits de 12% (horeca) et 6% (alimentation, rénovation > 10 ans).",
                    en: "In Belgium, the standard VAT rate is 21%, alongside reduced rates of 12% (hospitality) and 6% (groceries, renovation > 10 years)."
                },
                links: [
                    { label: "FOD Financiën — Belgische btw-tarieven", url: "https://fin.belgium.be/nl/ondernemingen/btw/tarieven-en-berekening/btw-tarieven" }
                ]
            },
            nl: {
                summary: {
                    nl: "In Nederland geldt een algemeen btw-tarief van 21% en een verlaagd tarief van 9% (voeding, boeken, kappers, schilderwerk).",
                    fr: "Aux Pays-Bas, le taux général de TVA est de 21% et le taux réduit est de 9% (alimentation, livres, coiffure).",
                    en: "In the Netherlands, the standard VAT rate is 21% and the reduced rate is 9% (food, books, hairdressers)."
                },
                links: [
                    { label: "Belastingdienst.nl — Nederlandse btw-tarieven", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/btw-tarieven" }
                ]
            }
        },
        "autobelasting.html": {
            be: {
                summary: {
                    nl: "In Vlaanderen worden BIV en jaarlijkse verkeersbelasting berekend op basis van CO2-uitstoot, euronorm, brandstof en fiscaal vermogen.",
                    fr: "En Belgique, la taxe de mise en circulation (TMC) et la taxe annuelle dépendent de la région, de la puissance (kW/CV) et des émissions de CO2.",
                    en: "In Belgium, registration tax (BIV/TMC) and annual road tax depend on region, engine power, fuel type, and CO2 emissions."
                },
                links: [
                    { label: "Vlaanderen.be — BIV & Verkeersbelasting simulator", url: "https://www.vlaanderen.be/belastingen-en-begroting/vlaamse-belastingen/verkeersbelastingen" }
                ]
            },
            nl: {
                summary: {
                    nl: "In Nederland betaal je bij aankoop BPM (CO2) en per kwartaal motorrijtuigenbelasting (MRB) op basis van gewicht, brandstof en provincie.",
                    fr: "Aux Pays-Bas, vous payez la BPM à l'achat (CO2) et la taxe trimestrielle MRB selon le poids, le carburant et la province.",
                    en: "In the Netherlands, you pay BPM upon purchase (CO2) and quarterly road tax (MRB) based on weight, fuel type, and province."
                },
                links: [
                    { label: "Belastingdienst.nl — Motorrijtuigenbelasting (MRB) berekenen", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/auto-en-vervoer/content/hulpmiddel-motorrijtuigenbelasting-berekenen" }
                ]
            }
        }
    };

    const menuCategories = [
        {
            id: "financien",
            title: { nl: "Sparen, Lenen & Vastgoed", fr: "Épargne, Prêt & Immobilier", en: "Savings, Loans & Property" },
            short: { nl: "Financiën", fr: "Finances", en: "Finance" },
            items: [
                { name: { nl: "Hypotheek & Woonlening", fr: "Prêt Hypothécaire", en: "Mortgage & Loan" }, sub: { nl: "Maandlast & aflossing", fr: "Mensualité & intérêts", en: "Monthly payment" }, file: "hypotheek.html", icon: "🏦", fiscal: false },
                { name: { nl: "Sparen & Beleggen", fr: "Épargne & Investissement", en: "Savings & Compound Interest" }, sub: { nl: "Netto na belasting (BE/NL)", fr: "Net après impôt (BE/NL)", en: "Net after tax (BE/NL)" }, file: "sparen.html", icon: "📈", fiscal: true },
                { name: { nl: "Registratie & Overdracht", fr: "Droits d'enregistrement", en: "Property Transfer Tax" }, sub: { nl: "2% BE • 0%/2% NL (2026)", fr: "Frais d'achat immobilier", en: "Closing costs BE/NL" }, file: "registratierechten.html", icon: "🔑", fiscal: true },
                { name: { nl: "Inflatie & Koopkracht", fr: "Inflation & Pouvoir d'achat", en: "Inflation Calculator" }, sub: { nl: "Waardeverlies spaargeld", fr: "Perte de valeur", en: "Purchasing power" }, file: "inflatie.html", icon: "📉", fiscal: false }
            ]
        },
        {
            id: "werk-btw",
            title: { nl: "Werk, Loon & Btw", fr: "Travail, Salaire & TVA", en: "Work, Income & Tax" },
            short: { nl: "Werk & Btw", fr: "Travail & TVA", en: "Work & Tax" },
            items: [
                { name: { nl: "Bruto-Netto & Uurloon", fr: "Salaire Brut-Net & Horaire", en: "Gross-to-Net & Hourly Pay" }, sub: { nl: "Barema's BE & NL 2026", fr: "Barèmes BE & NL 2026", en: "Salary scales BE & NL 2026" }, file: "werkuren.html", icon: "💶", fiscal: true },
                { name: { nl: "Flexi-job Loon (BE)", fr: "Salaire Flexi-job (BE)", en: "Flexi-job Salary (BE)" }, sub: { nl: "Plafond € 18.440 (2026)", fr: "Plafond 18.440 € (2026)", en: "Cap € 18,440 (2026)" }, file: "flexijob.html", icon: "💼", fiscal: true },
                { name: { nl: "BTW Calculator", fr: "Calculateur TVA", en: "VAT / Sales Tax" }, sub: { nl: "BE • NL • LU tarieven", fr: "Taux BE • NL • LU", en: "BE • NL • LU rates" }, file: "btw.html", icon: "🧾", fiscal: true },
                { name: { nl: "IBAN & BTW-nummer Check", fr: "Contrôle IBAN & N° TVA", en: "IBAN & VAT Validator" }, sub: { nl: "Modulo-97 & 11-proef (BE/NL)", fr: "Vérification IBAN & TVA", en: "Bank & VAT number check" }, file: "iban-btw-check.html", icon: "✅", fiscal: false },
                { name: { nl: "Procenten & Marge", fr: "Pourcentage & Marge", en: "Percentage & Margin" }, sub: { nl: "Korting, winstmarge & %", fr: "Remise, marge & %", en: "Discount & profit margin" }, file: "procenten.html", icon: "🏷️", fiscal: false }
            ]
        },
        {
            id: "wonen",
            title: { nl: "Wonen & Energie", fr: "Maison & Énergie", en: "Home & Energy" },
            short: { nl: "Wonen", fr: "Maison", en: "Home" },
            items: [
                { name: { nl: "Oppervlakte & Omtrek (m²)", fr: "Surface & Périmètre (m²)", en: "Square Meter (m²) Area" }, sub: { nl: "Vierkante meters & verf", fr: "Mètres carrés & peinture", en: "Area & perimeter" }, file: "oppervlakte.html", icon: "📐", fiscal: false },
                { name: { nl: "Stroomverbruik (kWh)", fr: "Consommation Électrique", en: "Electricity Cost (kWh)" }, sub: { nl: "Kosten per toestel", fr: "Coût par appareil", en: "Appliance usage" }, file: "energie.html", icon: "🔌", fiscal: false },
                { name: { nl: "Zonnepanelen", fr: "Panneaux Solaires", en: "Solar Panel ROI" }, sub: { nl: "Terugverdientijd", fr: "Temps de retour", en: "Payback period" }, file: "zonnepanelen.html", icon: "☀️", fiscal: true }
            ]
        },
        {
            id: "auto",
            title: { nl: "Auto & Mobiliteit", fr: "Auto & Mobilité", en: "Auto & Mobility" },
            short: { nl: "Auto", fr: "Auto", en: "Auto" },
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
                { name: { nl: "BMI & Caloriebehoefte", fr: "IMC & Besoins Caloriques", en: "BMI & Calorie Calculator" }, sub: { nl: "Gezond gewicht & kcal", fr: "Poids idéal & kcal", en: "Healthy weight & kcal" }, file: "bmi.html", icon: "⚖️", fiscal: false },
                { name: { nl: "Ideaal Gewicht & Vet%", fr: "Poids Idéal & Masse Grasse", en: "Ideal Weight & Body Fat" }, sub: { nl: "Streefgewicht & taille", fr: "Poids cible & tour de taille", en: "Target weight & body fat" }, file: "ideaal-gewicht.html", icon: "📏", fiscal: false },
                { name: { nl: "Hardlooptempo & Finishtijd", fr: "Allure Course & Temps", en: "Running Pace Calculator" }, sub: { nl: "5K, 10K & marathon", fr: "5K, 10K & marathon", en: "5K, 10K & marathon" }, file: "hardlooptempo.html", icon: "🏃", fiscal: false },
                { name: { nl: "Waterbehoefte & Slaapcyclus", fr: "Hydratation & Cycles Sommeil", en: "Water Intake & Sleep Cycle" }, sub: { nl: "Liters/dag & wektijd", fr: "Litres/jour & réveil", en: "Daily liters & wake time" }, file: "water-slaap.html", icon: "💧", fiscal: false }
            ]
        },
        {
            id: "webtools",
            title: { nl: "Web, Tekst & Data Tools", fr: "Outils Web, Texte & Données", en: "Web, Text & Data Tools" },
            short: { nl: "Web Tools", fr: "Outils Web", en: "Web Tools" },
            items: [
                { name: { nl: "Gratis QR-Code Generator", fr: "Générateur de Code QR", en: "Free QR Code Generator" }, sub: { nl: "Link, WiFi & tekst (PNG)", fr: "Lien, WiFi & texte (PNG)", en: "URL, WiFi & text (PNG)" }, file: "qr-generator.html", icon: "📱", fiscal: false },
                { name: { nl: "Tekst Opschoner & Woordenteller", fr: "Compteur de Mots & Nettoyeur", en: "Word Counter & Text Cleaner" }, sub: { nl: "Woorden, lijsten & e-mails", fr: "Mots, listes & e-mails", en: "Words, lists & emails" }, file: "extractor.html", icon: "🔍", fiscal: false }
            ]
        }
    ];

    const activeCat = menuCategories.find(c => c.items.some(i => i.file === currentPath));
    const activeTool = activeCat ? activeCat.items.find(i => i.file === currentPath) : null;

    if (activeTool) {
        try {
            let recent = JSON.parse(localStorage.getItem("rekenhub_recent") || "[]");
            recent = recent.filter(r => r.file !== activeTool.file);
            recent.unshift({ name: activeTool.name, sub: activeTool.sub, file: activeTool.file, icon: activeTool.icon });
            localStorage.setItem("rekenhub_recent", JSON.stringify(recent.slice(0, 4)));
        } catch (e) {}
    }

    const langSwitcherHtml = `
        <div data-no-translate="1" class="inline-flex items-center bg-[#002244] p-0.5 rounded-lg border border-blue-400/30 text-xs font-bold shrink-0">
            ${["nl", "fr", "en"].map(code => `
                <button type="button" onclick="setSiteLang('${code}')" class="px-2.5 py-1 rounded-md uppercase transition ${lang === code ? 'bg-emerald-400 text-slate-950 shadow-xs' : 'text-blue-100 hover:text-white'}">
                    ${code}
                </button>
            `).join("")}
        </div>
    `;

    let navDesktopHtml = `<a href="index.html" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold transition ${currentPath === 'index.html' ? 'bg-white/15 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'}">${t.overview}</a>`;
    let navMobileHtml = `<a href="index.html" class="block px-4 py-3 rounded-xl text-base font-heading font-extrabold ${currentPath === 'index.html' ? 'text-white bg-[#003366]' : 'text-slate-900 bg-slate-100'}">${t.allTools}</a>`;

    const mobileCatStyles = {
        "financien": "bg-emerald-950 text-emerald-100 border-emerald-800",
        "werk-btw": "bg-blue-950 text-blue-100 border-blue-800",
        "wonen": "bg-amber-950 text-amber-100 border-amber-800",
        "auto": "bg-indigo-950 text-indigo-100 border-indigo-800",
        "gezondheid": "bg-rose-950 text-rose-100 border-rose-800",
        "webtools": "bg-slate-900 text-slate-100 border-slate-700"
    };

    menuCategories.forEach(cat => {
        const isCatActive = cat.items.some(i => i.file === currentPath);
        navDesktopHtml += `
            <div class="relative group">
                <button class="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${isCatActive ? 'bg-white/15 text-emerald-300' : 'text-blue-100 hover:text-white hover:bg-white/10'}">
                    <span>${cat.short[lang]}</span>
                    <svg class="w-3.5 h-3.5 opacity-75 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div class="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">${cat.title[lang]}</div>
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-4 py-2.5 transition ${currentPath === item.file ? 'bg-blue-50/90 text-blue-700' : 'text-slate-800 hover:bg-slate-50'}">
                            <span class="text-sm font-semibold leading-snug ${currentPath === item.file ? 'text-blue-700' : 'text-slate-900'}">${item.name[lang]}</span>
                            <span class="text-xs text-slate-400 mt-0.5 leading-tight">${item.sub[lang]}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        const badgeStyle = mobileCatStyles[cat.id] || "bg-slate-900 text-white border-slate-700";
        navMobileHtml += `
            <div class="pt-4 pb-1">
                <div class="px-3.5 py-2.5 rounded-xl border ${badgeStyle} text-sm font-heading font-extrabold tracking-wide shadow-2xs flex items-center justify-between">
                    <span>${cat.title[lang]}</span>
                    <span class="text-xs opacity-75">${cat.items.length}</span>
                </div>
                <div class="mt-2 space-y-1 pl-1">
                    ${cat.items.map(item => `
                        <a href="${item.file}" class="flex flex-col px-3 py-2.5 rounded-xl border ${currentPath === item.file ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-slate-50'}">
                            <span class="text-sm font-bold ${currentPath === item.file ? 'text-blue-700' : 'text-slate-900'}">${item.name[lang]}</span>
                            <span class="text-xs text-slate-500 mt-0.5">${item.sub[lang]}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    const headerHtml = `
        <header data-no-translate="1" class="bg-[#003366] text-white shadow-md border-b border-[#002244]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <a href="index.html" class="flex items-center gap-2.5 shrink-0">
                    <div class="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center text-slate-950 font-heading font-extrabold text-base">R</div>
                    <div class="flex items-baseline gap-0.5">
                        <span class="font-heading font-bold text-white text-xl tracking-tight">RekenHub</span>
                        <span class="font-heading font-bold text-emerald-400 text-sm">.com</span>
                    </div>
                </a>

                <nav class="hidden lg:flex items-center space-x-1">${navDesktopHtml}</nav>

                <div class="flex items-center gap-2.5 shrink-0">
                    ${langSwitcherHtml}
                    <button id="mobile-menu-btn" aria-label="Menu" class="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 border border-white/20">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden lg:hidden bg-white text-slate-900 border-b border-slate-200 px-4 pt-3 pb-6 max-h-[82vh] overflow-y-auto shadow-xl">
                ${navMobileHtml}
            </div>
        </header>
    `;

    const adSlotsHtml = `
        <div id="top-ad-slot" class="hidden no-print max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6"></div>
        <aside id="left-ad-rail" aria-hidden="true" class="hidden 2xl:flex no-print fixed left-4 top-24 w-[160px] min-h-[600px] items-start justify-center pointer-events-none empty:hidden"></aside>
        <aside id="right-ad-rail" aria-hidden="true" class="hidden 2xl:flex no-print fixed right-4 top-24 w-[160px] min-h-[600px] items-start justify-center pointer-events-none empty:hidden"></aside>
    `;

    const footerHtml = `
        <footer data-no-translate="1" class="bg-white/95 backdrop-blur-xs border-t border-slate-200 mt-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
                    <div class="space-y-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-7 h-7 bg-[#003366] rounded-lg flex items-center justify-center text-emerald-400 font-heading font-bold text-sm">R</div>
                            <span class="font-heading font-bold text-slate-900">RekenHub.com</span>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed">${t.footerDesc}</p>
                        <div class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                            ${t.footerVerified}
                        </div>
                    </div>

                    <div>
                        <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">${t.footerPopular}</h3>
                        <ul class="space-y-2 text-xs font-medium text-slate-600">
                            <li><a href="werkuren.html" class="hover:text-blue-600 transition">${menuCategories[1].items[0].name[lang]}</a></li>
                            <li><a href="sparen.html" class="hover:text-blue-600 transition">${menuCategories[0].items[1].name[lang]}</a></li>
                            <li><a href="registratierechten.html" class="hover:text-blue-600 transition">${menuCategories[0].items[2].name[lang]}</a></li>
                            <li><a href="iban-btw-check.html" class="hover:text-blue-600 transition">${menuCategories[1].items[3].name[lang]}</a></li>
                            <li><a href="qr-generator.html" class="hover:text-blue-600 transition">${menuCategories[5].items[0].name[lang]}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">${t.footerGov}</h3>
                        <ul class="space-y-2 text-xs font-medium text-slate-600">
                            <li><a href="https://fin.belgium.be/nl" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition">FOD Financiën België ↗</a></li>
                            <li><a href="https://www.vlaanderen.be/belastingen-en-begroting" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition">Vlaanderen.be Belastingen ↗</a></li>
                            <li><a href="https://www.belastingdienst.nl" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition">Belastingdienst Nederland ↗</a></li>
                            <li><a href="https://www.rijksoverheid.nl" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition">Rijksoverheid.nl ↗</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">${t.footerLegal}</h3>
                        <ul class="space-y-2 text-xs font-medium text-slate-600">
                            <li><a href="index.html" class="hover:text-blue-600 transition">${t.allTools}</a></li>
                            <li><a href="privacy.html" class="hover:text-blue-600 transition">${t.privacy}</a></li>
                            <li><a href="disclaimer.html" class="hover:text-blue-600 transition">${t.disclaimer}</a></li>
                            <li><a href="contact.html" class="hover:text-blue-600 transition">${t.contact}</a></li>
                        </ul>
                    </div>
                </div>
                <p class="text-xs text-slate-400 mt-6">${t.footerNote}</p>
            </div>
        </footer>
    `;

    const headerPlaceholder = document.getElementById("app-header");
    const footerPlaceholder = document.getElementById("app-footer");

    if (headerPlaceholder) {
        headerPlaceholder.className = "sticky top-0 z-50 w-full";
        headerPlaceholder.innerHTML = headerHtml;
        headerPlaceholder.insertAdjacentHTML("afterend", adSlotsHtml);
    }
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    }

    // 3. URL-parameters automatisch invullen bij gedeelde 2026-scenario's
    const mainEl = document.querySelector("main");
    if (activeTool && mainEl) {
        let paramApplied = false;
        urlParams.forEach((val, key) => {
            if (key === "lang") return;
            const el = document.getElementById(key);
            if (el) {
                if (el.type === "checkbox") el.checked = val === "1" || val === "true";
                else el.value = val;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
                paramApplied = true;
            }
        });
        if (paramApplied && typeof setCountry === "function" && urlParams.get("country")) {
            setCountry(urlParams.get("country"));
        }
        if (paramApplied && typeof setLand === "function" && urlParams.get("land")) {
            setLand(urlParams.get("land"));
        }

        const h1 = mainEl.querySelector("h1");
        if (h1 && activeTool.fiscal) {
            h1.insertAdjacentHTML("afterend", `
                <div data-no-translate="1" class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mt-1 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>${t.fiscalBadge}</span>
                </div>
            `);
        }

        const firstCard = mainEl.querySelector(".bg-white.rounded-2xl");
        if (firstCard) {
            const actionBar = document.createElement("div");
            actionBar.setAttribute("data-no-translate", "1");
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
                let lines = [`${activeTool.name[lang]} (RekenHub 2026):`];
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

        const srcData = toolSources[currentPath];
        if (srcData) {
            mainEl.insertAdjacentHTML("beforeend", `
                <section id="official-sources-box" data-no-translate="1" class="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
                    <div>
                        <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md mb-2">
                            ${t.sourcesBadge}
                        </span>
                        <h2 class="font-heading text-xl font-bold text-slate-900">${t.sourcesTitle}</h2>
                        <p class="text-xs sm:text-sm text-slate-500 mt-1">${t.sourcesSub}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 flex flex-col justify-between space-y-4">
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 font-heading font-bold text-slate-900 text-base">
                                    <span>${t.beRulesTitle}</span>
                                </div>
                                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${srcData.be.summary[lang] || srcData.be.summary.nl}</p>
                            </div>
                            <div class="pt-3 border-t border-slate-200/80 space-y-1.5">
                                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${t.beSourcesLbl}</div>
                                ${srcData.be.links.map(l => `
                                    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline py-0.5">
                                        <span>${l.label}</span>
                                        <span>↗</span>
                                    </a>
                                `).join("")}
                            </div>
                        </div>

                        <div class="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 flex flex-col justify-between space-y-4">
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 font-heading font-bold text-slate-900 text-base">
                                    <span>${t.nlRulesTitle}</span>
                                </div>
                                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${srcData.nl.summary[lang] || srcData.nl.summary.nl}</p>
                            </div>
                            <div class="pt-3 border-t border-slate-200/80 space-y-1.5">
                                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${t.nlSourcesLbl}</div>
                                ${srcData.nl.links.map(l => `
                                    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline py-0.5">
                                        <span>${l.label}</span>
                                        <span>↗</span>
                                    </a>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </section>
            `);
        }

        const related = activeCat.items.filter(i => i.file !== currentPath);
        const otherCat = menuCategories.find(c => c.id !== activeCat.id);
        const suggestions = [...related, otherCat.items[0]].slice(0, 2);

        mainEl.insertAdjacentHTML("beforeend", `
            <section id="related-tools-box" data-no-translate="1" class="mt-8 space-y-3">
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

    // 4. VOLLEDIGE AUTOMATISCHE DOM-VERTALER (voor 100% van alle pagina's, teksten, placeholders & dynamische output)
    const pagesWithOwnTranslation = ["index.html", "contact.html"];
    if (lang !== "nl" && mainEl && !pagesWithOwnTranslation.includes(currentPath)) {
        const cacheKey = `rekenhub_tcache_${lang}`;
        let tCache = {};
        try { tCache = JSON.parse(localStorage.getItem(cacheKey) || "{}"); } catch (e) {}

        function saveCache() {
            try { localStorage.setItem(cacheKey, JSON.stringify(tCache)); } catch (e) {}
        }

        function hasTranslatableWords(str) {
            if (!str) return false;
            const clean = str.replace(/[€$£%0-9.,:;+\-–—/\\()[\]{}|•✓→↗↓↑=&@#!?*'"\s]/g, "");
            return clean.length >= 2;
        }

        const translatedNodeValues = new WeakMap();
        let isApplying = false;

        async function fetchBatchTranslations(strings) {
            const unique = [...new Set(strings)].filter(s => s && !tCache[s] && hasTranslatableWords(s));
            if (unique.length === 0) return;

            const SEP = " ||| ";
            let chunks = [];
            let current = [];
            let len = 0;
            for (const s of unique) {
                if (len + s.length > 1400 && current.length > 0) {
                    chunks.push(current);
                    current = [];
                    len = 0;
                }
                current.push(s);
                len += s.length + SEP.length;
            }
            if (current.length > 0) chunks.push(current);

            for (const batch of chunks) {
                try {
                    const joined = batch.join(SEP);
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=nl&tl=${lang}&dt=t&q=${encodeURIComponent(joined)}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    const fullTranslated = (data[0] || []).map(part => part[0]).join("");
                    const parts = fullTranslated.split(/\s*\|\|\|\s*/);
                    if (parts.length === batch.length) {
                        batch.forEach((orig, idx) => {
                            if (parts[idx] && parts[idx].trim()) {
                                tCache[orig] = parts[idx].trim();
                            }
                        });
                    } else {
                        for (const single of batch) {
                            const r2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=nl&tl=${lang}&dt=t&q=${encodeURIComponent(single)}`);
                            const d2 = await r2.json();
                            const tr = (d2[0] || []).map(p => p[0]).join("").trim();
                            if (tr) tCache[single] = tr;
                        }
                    }
                } catch (e) {}
            }
            saveCache();
        }

        async function translateEntirePage() {
            if (isApplying) return;
            isApplying = true;

            try {
                const textNodes = [];
                const walker = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT, null);
                let node;
                while ((node = walker.nextNode())) {
                    const parent = node.parentElement;
                    if (!parent) continue;
                    if (parent.closest("[data-no-translate='1']")) continue;
                    if (["SCRIPT", "STYLE", "CODE", "TEXTAREA"].includes(parent.tagName)) continue;

                    const raw = node.nodeValue;
                    const trimmed = raw.trim();
                    if (!hasTranslatableWords(trimmed)) continue;
                    if (translatedNodeValues.get(node) === trimmed) continue;

                    textNodes.push({ node, raw, trimmed });
                }

                const placeholders = [];
                mainEl.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(el => {
                    if (el.closest("[data-no-translate='1']")) return;
                    const ph = el.getAttribute("placeholder");
                    if (ph && hasTranslatableWords(ph) && el.dataset.translatedPh !== ph) {
                        placeholders.push({ el, ph });
                    }
                });

                const docTitle = document.title;
                const toFetch = [
                    ...(hasTranslatableWords(docTitle) ? [docTitle] : []),
                    ...textNodes.map(t => t.trimmed),
                    ...placeholders.map(p => p.ph)
                ];

                await fetchBatchTranslations(toFetch);

                if (tCache[docTitle]) {
                    document.title = tCache[docTitle];
                }

                textNodes.forEach(({ node, raw, trimmed }) => {
                    const tr = tCache[trimmed];
                    if (tr && tr !== trimmed) {
                        const leading = raw.match(/^\s*/)[0];
                        const trailing = raw.match(/\s*$/)[0];
                        node.nodeValue = leading + tr + trailing;
                        translatedNodeValues.set(node, tr);
                    }
                });

                placeholders.forEach(({ el, ph }) => {
                    const tr = tCache[ph];
                    if (tr && tr !== ph) {
                        el.setAttribute("placeholder", tr);
                        el.dataset.translatedPh = tr;
                    }
                });
            } finally {
                isApplying = false;
            }
        }

        translateEntirePage();

        let debounceTimer = null;
        const observer = new MutationObserver(() => {
            if (isApplying) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(translateEntirePage, 120);
        });
        observer.observe(mainEl, { childList: true, subtree: true, characterData: true });
    }
});