// Centraal tarieven- & bronnenbestand voor RekenHub (Bijgewerkt: november 2026)
window.REKENHUB_CONFIG = {
    year: 2026,
    lastVerified: "november 2026",
    BE: {
        // Werk & Loon
        ggmmiMonth: 2233.61,
        ggmmiHour38: 13.56,
        rszEmployee: 0.1307,
        flexijobCapNonPensioner: 18440, // Inkomstenjaar 2026 (aanslagjaar 2027)
        // Sparen & Beleggen
        savingsTaxFreeSingle: 1020,
        savingsTaxFreeCouple: 2040,
        withholdingTaxRegulated: 0.15,
        withholdingTaxStandard: 0.30,
        dividendRecoveryCap: 833,
        // Vastgoed Vlaanderen
        regTaxFirstHomeVL: 0.02, // 2% mits min. 1 jaar effectieve bewoning (nieuw 2026)
        regTaxStandardVL: 0.12,
        // BTW
        vatRates: [21, 12, 6, 0]
    },
    NL: {
        // Werk & Loon
        minWageHour21Plus: 14.99, // Per 1 juli 2026
        // Sparen & Beleggen (Box 3 2026)
        box3FreeSingle: 59357,
        box3FreePartner: 118714,
        box3GreenFreeSingle: 26715,
        box3ForfaitSavings: 0.0128,
        box3ForfaitInvestments: 0.0600,
        box3TaxRate: 0.36,
        // Vastgoed
        transferTaxStarterMaxPrice: 555000, // 0% startersvrijstelling (<35 jaar) in 2026
        transferTaxHome: 0.02,
        transferTaxInvestor: 0.08, // Per 1 januari 2026 verlaagd van 10,4% naar 8% voor woningen
        transferTaxCommercial: 0.104,
        // BTW
        vatRates: [21, 9, 0]
    }
};