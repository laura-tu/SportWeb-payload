# Sportweb Payload (BP_Brejčáková)

Backend pre webovú aplikáciu postavený na [Payload CMS](https://payloadcms.com/) s pripojením na MongoDB. Projekt využíva vlastnú konfiguráciu pre správu používateľov, športovcov, trénerov, médií, športových testov a číselníkov športov,športových klubov a typov testov. 

## 📦 Inštalácia

1. Klonuj repozitár:
   ```bash
   git clone https://github.com/tvoj-username/SportWeb-payload.git
   cd SportWeb-payload

2. Nainštaluj závislosti:
   ```bash
   yarn

3. Skopíruj .env.example ako .env a uprav podľa potreby:
    ```bash
   cp .env.example .env

4. Spusť vývojový server
    ```bash
   yarn dev


## 📁 Kolekcie

Projekt využíva viacero štruktúrovaných kolekcií, ktoré spolu tvoria komplexný systém pre správu športových entít:

- **Users** – používateľské účty s podporou rolí (`admin`, `user`, `sportCoach`)
- **Media** – upload médií a súborov
- **CSport** – športy
- **CSportClub** – športové kluby, previazané na športy
- **UAthlete** – športovci vrátane dátumu narodenia, pohlavia, klubov a športov
- **UCoach** – tréneri s väzbou na športovcov, kluby a športy
- **TestResult** – výsledky testovaní športovcov, pripojené k typom testov a dátam
- **CSportTest** – typy športových testov vrátane popisu

Tieto kolekcie sú navzájom previazané cez referencie a umožňujú podrobné filtrovanie, správu a zobrazovanie športových dát v admin paneli aj na frontende.


- #### Users (Autentifikácia)

  Používatelia majú povolenú autentifikáciu a môžu byť buď administrátori, alebo bežní používatelia, v závislosti od hodnoty ich poľa `roles` . Iba používatelia s rolou `admin`  majú prístup do administrátorského rozhrania, kde môžu spravovať web. 

- #### Media

 Kolekcia pre nahrávanie súborov, ktorú používajú stránky, príspevky a projekty na ukladanie médií, ako sú obrázky, videá, súbory na stiahnutie a iné typy obsahu.


## 🌱Seed
Táto šablóna obsahuje aj endpoint `GET /api/seed`, ktorý môžeš použiť na naplnenie databázy priamo z administračného rozhrania.

Skript na seedovanie zároveň vytvorí dvoch používateľov na demonštračné účely:
1. Demo Author
    - Email: `demo-author@payloadcms.com`
    - Password: `password`
    - Role: `admin`
2. Demo User
    - Email: `demo-user@payloadcms.com`
    - Password: `password`
    - Role: `user`

> NOTICE: Seedovanie databázy je deštruktívna operácia, pretože vymaže aktuálnu databázu a nahradí ju novou podľa seed šablóny. Tento príkaz spúšťaj len v prípade, že začínaš nový projekt alebo si môžeš dovoliť prísť o existujúce dáta.

Ak chceš naplniť databázu testovacími dátami a vyčistiť staré údaje:

    yarn seed


## 📂 Štruktúra projektu
 ```tree

SportWeb-payload/
├── public/              # Statické súbory dostupné cez URL
│ ├── favicon.ico        
├── src/
│ ├── server.ts          # Spustenie servera a inicializácia Payload
│ ├── server.default.ts  # Záložný server pre prípad eject alebo vývoja
│ └── payload/           # Konfigurácia Payload CMS, kolekcie, globály, hooky, seed ...
│
├── .env.example         # Ukážkový environment súbor
├── package.json         # Zoznam závislostí a skripty
├── tsconfig.server.json # TypeScript konfigurácia pre backend
├── tsconfig.json        # Základná TypeScript konfigurácia pre celý projekt
├── README.md            # Dokumentácia projektu
├── yarn.lock            # Uzamknuté verzie balíčkov pre konzistentnú inštaláciu
├── .yarnrc.yml          # Konfigurácia Yarn
├── nodemon.json         # Konfigurácia pre nodemon – automatický reload pri vývoji
├── .prettierrc.js       # Konfigurácia pre Prettier – formátovanie kódu
├── .prettierrignore     
├── .gitignore
├── .eslintrc.js         # ESLint konfigurácia pre kontrolu kvality kódu
├── csp.js               # Content Security Policy (napr. pre bezpečnosť servera)
├── Dockerfile
├── docker-compose.yml
├── .editorconfig        # Editor konfigurácia pre jednotné odsadenie, charset atď

