// Indkøbskurven er et array, der holder styr på produkter og deres antal
let kurv = [];

// Hent produktkategorier fra API og tilføj dynamisk knapper med kategorinavn
fetch('https://dummyjson.com/products/categories')
    .then(res => res.json())
    .then(kategorier => {
        const produktKategorierDiv = document.getElementById('produkt-kategorier');
        kategorier.forEach(kategori => {
            // Opret en knap for hver kategori med kategoriens navn som tekst
            const knap = document.createElement('button');
            knap.textContent = kategori.name
            knap.onclick = () => hentProdukterFraKategori(kategori); // Når der klikkes på knappen, hentes produkterne i kategorien
            produktKategorierDiv.appendChild(knap);
        });
    })
    .catch(error => {
        console.error('Fejl ved hentning af kategorier:', error);
    });

// Funktion til at hente produkter fra en valgt kategori
function hentProdukterFraKategori(kategori) {
    // Tøm produktlisten først    
    const produktListe = document.getElementById('produkt-liste');
    produktListe.innerHTML = 'Henter produkter...';

    // Hent produkter fra den valgte kategori
    fetch(`https://dummyjson.com/products/category/${[kategori.name]}`)
        .then(res => res.json())
        .then(data => {
            // Opdater produktlisten
            produktListe.innerHTML = ''; // Fjern "Henter produkter..." teksten
            data.products.forEach(produkt => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${produkt.title} - ${produkt.price} kr 
                    <button onclick="tilføjTilKurv('${produkt.title}', ${produkt.price})">Tilføj til kurv</button>
                `;
                produktListe.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Fejl ved hentning af produkter:', error);
            produktListe.innerHTML = 'Kunne ikke hente produkter.';
        });
}

// Funktion til at tilføje et produkt til kurven
function tilføjTilKurv(produktNavn, pris) {
    // Tjek om produktet allerede er i kurven
    const eksisterendeVare = kurv.find(vare => vare.navn === produktNavn);

    if (eksisterendeVare) {
        // Hvis produktet allerede findes, øg antallet
        eksisterendeVare.antal += 1;
    } else {
        // Hvis produktet ikke findes, tilføj det som nyt
        const produkt = { navn: produktNavn, pris: pris, antal: 1 };
        kurv.push(produkt);
    }

    opdaterKurv();
}

// Funktion til at fjerne et produkt eller mindske antallet i kurven
function fjernAntal(index) {
    if (kurv[index].antal > 1) {
        // Hvis der er mere end 1, mindsk antallet
        kurv[index].antal -= 1;
    } else {
        // Hvis der kun er 1, fjern varen fra kurven
        kurv.splice(index, 1);
    }
    opdaterKurv();
}

// Funktion til at øge antallet af en vare direkte fra kurven
function øgAntal(index) {
    kurv[index].antal += 1;  // Øg antallet af varen
    opdaterKurv();
}

// Funktion til at opdatere visningen af kurven
function opdaterKurv() {
    const kurvIndhold = document.getElementById('kurv-indhold');
    const totalPrisElement = document.getElementById('total-pris');
    kurvIndhold.innerHTML = '';
    let totalPris = 0;

    // Gennemgå hver vare i kurven og tilføj den til listen
    kurv.forEach((vare, index) => {
        totalPris += vare.pris * vare.antal;
        const li = document.createElement('li');
        li.innerHTML = `
            ${vare.navn} (Antal: ${vare.antal}) - ${vare.pris * vare.antal} kr 
            <button onclick="fjernAntal(${index})">-</button>
            <button onclick="øgAntal(${index})">+</button>
        `;
        kurvIndhold.appendChild(li);
    });

    // Opdater den samlede pris
    totalPrisElement.textContent = totalPris;
}
