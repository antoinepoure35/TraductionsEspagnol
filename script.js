const GITHUB_OWNER = "antoinepoure35";
const GITHUB_REPO = "TraductionsEspagnol";
let vocabulaire = [];
let motActuel = null;

const niveaux = [
    { dossier: "5e", conteneur: "level5" },
    { dossier: "4e", conteneur: "level4" },
    { dossier: "3e", conteneur: "level3" }
];

document.addEventListener("DOMContentLoaded", async () => {

    for (const niveau of niveaux) {
        await chargerNiveau(
            niveau.dossier,
            niveau.conteneur
        );
    }

});

async function chargerNiveau(dossier, conteneurId) {

    const url =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dossier}`;

    try {

        const response = await fetch(url);
        const fichiers = await response.json();

        const conteneur =
            document.getElementById(conteneurId);

        fichiers
            .filter(f => f.name.endsWith(".txt"))
            .forEach(fichier => {

                const nomAffiche =
                    fichier.name.replace(".txt", "");

                const label =
                    document.createElement("label");

                label.innerHTML = `
                    <input
                        type="checkbox"
                        class="sequence"
                        data-path="${dossier}/${fichier.name}">
                    ${nomAffiche}
                `;

                conteneur.appendChild(label);
            });

    } catch (erreur) {

        console.error(erreur);
    }
}

document
    .getElementById("newWordBtn")
    .addEventListener("click", nouveauMot);

document
    .getElementById("correctionBtn")
    .addEventListener("click", afficherCorrection);

async function nouveauMot() {

    vocabulaire = [];

    const selections =
        document.querySelectorAll(
            ".sequence:checked"
        );

    if (selections.length === 0) {

        document.getElementById("wordDisplay")
            .textContent =
            "Choisissez au moins une séquence.";

        return;
    }

    for (const selection of selections) {

        const chemin =
            selection.dataset.path;

        const response =
            await fetch(chemin);

        const texte =
            await response.text();

        texte
            .split("\n")
            .filter(l => l.trim())
            .forEach(ligne => {

                const parties =
                    ligne.split(";");

                if (parties.length === 2) {

                    vocabulaire.push({
                        fr: parties[0].trim(),
                        es: parties[1].trim()
                    });
                }
            });
    }

    if (vocabulaire.length === 0) {

        document.getElementById("wordDisplay")
            .textContent =
            "Aucun mot trouvé.";

        return;
    }

    motActuel =
        vocabulaire[
            Math.floor(
                Math.random() * vocabulaire.length
            )
        ];

    if (Math.random() < 0.5) {

        motActuel.question = motActuel.fr;
        motActuel.reponse = motActuel.es;

    } else {

        motActuel.question = motActuel.es;
        motActuel.reponse = motActuel.fr;
    }

    document.getElementById("wordDisplay")
        .textContent =
        motActuel.question;

    document.getElementById("correctionDisplay")
        .textContent = "";
}

function afficherCorrection() {

    if (!motActuel) return;

    document.getElementById("correctionDisplay")
        .textContent =
        motActuel.reponse;
}
