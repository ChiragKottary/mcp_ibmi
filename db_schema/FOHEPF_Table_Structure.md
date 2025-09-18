# FOHEPF Table Structure - Order Management System

## Table Information
- **Table Name**: FOHEPF
- **Library**: MCP_TEST
- **Total Fields**: 112
- **Purpose**: Order/Sales Management (Norwegian system)

## Field Categories

### 1. Order Identification (Fields 1-4)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 1 | FOFIRM | NUMERIC | 3 | 0 | Firma (Company) |
| 2 | FONUMM | NUMERIC | 8 | 0 | Ordrenr (Order Number) |
| 3 | FOSUFF | NUMERIC | 2 | 0 | Suff (Suffix) |
| 4 | FOLINE | NUMERIC | 4 | 0 | Linje (Line) |

### 2. Order Type & Delivery (Fields 5-7)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 5 | FOOTYP | CHARACTER | 2 | 0 | Ordre type (Order Type) |
| 6 | FOLETY | NUMERIC | 1 | 0 | Lev. type (Delivery Type) |
| 7 | FOLAGE | NUMERIC | 2 | 0 | Lager (Warehouse) |

### 3. Document References (Fields 8-9)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 8 | FOBINR | NUMERIC | 8 | 0 | Bilag nr (Document Number) |
| 9 | FOKREF | NUMERIC | 8 | 0 | Kred ref. (Credit Reference) |

### 4. Date Management (Fields 10-15)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 10 | FOBDAT | DATE | 10 | 0 | Ordre dato (Order Date) |
| 11 | FOLDAT | DATE | 10 | 0 | Lev. dato (Delivery Date) |
| 12 | FOPDAT | DATE | 10 | 0 | Planl. lev. (Planned Delivery) |
| 13 | FOPADA | DATE | 10 | 0 | Pakks. dato (Packing Date) |
| 14 | FOFKDA | DATE | 10 | 0 | Fakt dato (Invoice Date) |
| 15 | FOFFDA | DATE | 10 | 0 | Forf dato (Due Date) |

### 5. Payment & Routing (Fields 16-27)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 16 | FOBETB | NUMERIC | 2 | 0 | Bet. bet. (Payment Terms) |
| 17 | FOSELG | NUMERIC | 4 | 0 | Sn (Sales Rep) |
| 18 | FODIST | NUMERIC | 4 | 0 | Distr (Distribution) |
| 19 | FOLMAT | NUMERIC | 2 | 0 | Lev måte (Delivery Method) |
| 20 | FOLBET | NUMERIC | 2 | 0 | Lev bet. (Delivery Terms) |
| 21 | FOVALK | CHARACTER | 3 | 0 | Valuta (Currency) |
| 22 | FORKAT | NUMERIC | 3 | 0 | Rab kat (Discount Category) |
| 23 | FOSPED | NUMERIC | 3 | 0 | Sped (Shipping) |
| 24 | FOKJOR | NUMERIC | 2 | 0 | Kjøre rute (Driving Route) |
| 25 | FOKJNR | NUMERIC | 5 | 0 | Innen rute (Internal Route) |
| 26 | FOLASS | NUMERIC | 2 | 0 | Kode lass-nr (Load Number Code) |
| 27 | FOMKOD | NUMERIC | 1 | 0 | Mva kode (VAT Code) |

### 6. Customer Information (Fields 28-35)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 28 | FOLKUN | NUMERIC | 6 | 0 | Vare adr (Goods Address) |
| 29 | FOKUND | NUMERIC | 6 | 0 | Kunde (Customer) |
| 30 | FOLDOR | NUMERIC | 6 | 0 | Lev dør (Delivery Door) |
| 31 | FOKUNA | CHARACTER | 30 | 0 | Kunde-navn (Customer Name) |
| 32 | FONAVN | CHARACTER | 30 | 0 | Navn (Name) |
| 33 | FOADR1 | CHARACTER | 30 | 0 | Adresse 1 (Address 1) |
| 34 | FOADR2 | CHARACTER | 30 | 0 | Adresse 2 (Address 2) |
| 35 | FOSTED | CHARACTER | 30 | 0 | Poststed (Postal Address) |

### 7. Accounting & Project (Fields 36-40)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 36 | FOAVDE | NUMERIC | 4 | 0 | Avd (Department) |
| 37 | FOKONT | NUMERIC | 6 | 0 | Konto (Account) |
| 38 | FOSPES | NUMERIC | 4 | 0 | Spes (Special) |
| 39 | FOPROJ | CHARACTER | 6 | 0 | Prosj. (Project) |
| 40 | FOAKTI | CHARACTER | 6 | 0 | Akt. (Activity) |

### 8. Control Flags (Fields 41-49)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 41 | FOKOBK | NUMERIC | 1 | 0 | Obekr. kreves (Confirmation Required) |
| 42 | FOKGFA | NUMERIC | 1 | 0 | Undertr fakt.ge (Suppress Invoice) |
| 43 | FOKGEK | NUMERIC | 1 | 0 | Undertr. eks.ge (Suppress Delivery Note) |
| 44 | FOKGFR | NUMERIC | 1 | 0 | Undertr. frakt.g (Suppress Freight) |
| 45 | FOKSOB | NUMERIC | 1 | 0 | Utskr. obekr. (Print Confirmation) |
| 46 | FOKTXT | NUMERIC | 1 | 0 | Tekst utskr (Text Print) |
| 47 | FOKFAK | NUMERIC | 1 | 0 | Fakt kjørt? (Invoice Processed?) |
| 48 | FONETO | NUMERIC | 1 | 0 | Netto u/rab (Net without Discount) |
| 49 | FOKSPR | NUMERIC | 1 | 0 | Sperret f.vedl. (Blocked for Attachment) |

### 9. Reference Information (Fields 50-55)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 50 | FOVREF | CHARACTER | 30 | 0 | Vår ref. (Our Reference) |
| 51 | FODREF | CHARACTER | 30 | 0 | Deres ref. (Your Reference) |
| 52 | FOKPNR | NUMERIC | 6 | 0 | Kontaktp.nr. (Contact Person Number) |
| 53 | FOREKV | CHARACTER | 20 | 0 | Kund.rekv.nr. (Customer Request Number) |
| 54 | FOLMTX | CHARACTER | 20 | 0 | Lev. måte tekst (Delivery Method Text) |
| 55 | FOLBTX | CHARACTER | 75 | 0 | Lev. bet. tekst (Delivery Terms Text) |

### 10. Pricing & Discounts (Fields 56-67)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 56 | FORABP | NUMERIC | 5 | 2 | Rab i % (Discount in %) |
| 57 | FOPASL | NUMERIC | 5 | 2 | Påslag % (Markup %) |
| 58 | FOPASK | CHARACTER | 1 | 0 | Påslag Ønsket DB (Markup Desired Margin) |
| 59 | FOPORD | NUMERIC | 8 | 0 | Pris ordrenr (Price Order Number) |
| 60 | FOPSUF | NUMERIC | 2 | 0 | Suffix prisordre (Price Order Suffix) |
| 61 | FOKOLI | NUMERIC | 11 | 3 | Kolli (Packages) |
| 62 | FOKONR | NUMERIC | 11 | 2 | Kont rab (Cash Discount) |
| 63 | FOTOTX | NUMERIC | 11 | 2 | KR fritt salg (Free Sale Amount) |
| 64 | FOTOTS | NUMERIC | 11 | 2 | Total salg (Total Sales) |
| 65 | FOTOTR | NUMERIC | 11 | 2 | Total rabatt (Total Discount) |
| 66 | FOTOTK | NUMERIC | 11 | 2 | Total kost (Total Cost) |
| 67 | FOBRRA | NUMERIC | 11 | 2 | Bruksr.rab. (User Discount) |

### 11. Processing Information (Fields 68-77)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 68 | FOUSKR | CHARACTER | 10 | 0 | Bruker Kreditt (User Credit) |
| 69 | FOKODE | NUMERIC | 1 | 0 | Behandl pågår (Processing in Progress) |
| 70 | FOUTSK | NUMERIC | 1 | 0 | Kode utskrift (Print Code) |
| 71 | FOPAKS | NUMERIC | 1 | 0 | Pakks skrevet (Packing List Written) |
| 72 | FOITYP | CHARACTER | 2 | 0 | Info type (Information Type) |
| 73 | FOKOWS | CHARACTER | 10 | 0 | Behandl. WS (Processing Workstation) |
| 74 | FOKOUS | CHARACTER | 10 | 0 | Behandl. bruker (Processing User) |
| 75 | FOKODA | DATE | 10 | 0 | Behandl. dato (Processing Date) |
| 76 | FOKOTI | TIME | 8 | 0 | Behandl. kl (Processing Time) |
| 77 | FOBIND | CHARACTER | 1 | 0 | Binding skjerm (Binding Screen) |

### 12. Status & Dates (Fields 78-82)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 78 | FOTDAT | DATE | 10 | 0 | Utgår dato (Expiry Date) |
| 79 | FODDAT | DATE | 10 | 0 | Oppf. dato (Follow-up Date) |
| 80 | FOREST | NUMERIC | 1 | 0 | Rest ordre (Remaining Order) |
| 81 | FOADAT | DATE | 10 | 0 | Aksept dato (Accept Date) |
| 82 | FOEDIH | NUMERIC | 6 | 0 | Edi-hode (EDI Header) |

### 13. Extended Customer Info (Fields 83-86)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 83 | FOKPRO | NUMERIC | 6 | 0 | Kunde prosjekt (Customer Project) |
| 84 | FOBKUN | NUMERIC | 6 | 0 | Kunde bestiller (Customer Orderer) |
| 85 | FOKKUN | NUMERIC | 6 | 0 | Kunde kjøper (Customer Buyer) |
| 86 | FOOLAG | NUMERIC | 1 | 0 | Kode, oppd. lager (Code, Update Warehouse) |

### 14. External References (Fields 87-92)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 87 | FONREF | CHARACTER | 15 | 0 | Ekst. ref. (External Reference) |
| 88 | FOFSYS | CHARACTER | 3 | 0 | Ekst. sys. (External System) |
| 89 | FOBENR | NUMERIC | 8 | 0 | Best nr. (Order Number) |
| 90 | FOBSUF | NUMERIC | 2 | 0 | Best suffix (Order Suffix) |
| 91 | FOMOBI | CHARACTER | 15 | 0 | Kundens mobil (Customer Mobile) |
| 92 | FOKBNR | CHARACTER | 15 | 0 | Kundens best.nr (Customer Order Number) |

### 15. Deposits & Invoice Type (Fields 93-97)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 93 | FODEPO | NUMERIC | 11 | 2 | Krav Depositum (Required Deposit) |
| 94 | FODEPB | NUMERIC | 11 | 2 | Betalt Depositum (Paid Deposit) |
| 95 | FODEPT | NUMERIC | 11 | 2 | Trukket Depositum (Withdrawn Deposit) |
| 96 | FOFATY | NUMERIC | 2 | 0 | Fakt. type (Invoice Type) |
| 97 | FOBONG | CHARACTER | 12 | 0 | Bongnr (Receipt Number) |

### 16. Additional Info (Fields 98-104)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 98 | FOPLSE | NUMERIC | 4 | 0 | Pl. av Sn (Planned by Sales Rep) |
| 99 | FOINF1 | CHARACTER | 12 | 0 | Info-1 |
| 100 | FOINF2 | CHARACTER | 40 | 0 | Info-2 |
| 101 | FOMERK | NUMERIC | 1 | 0 | Merk til sjåfør (Note to Driver) |
| 102 | FOLAOK | NUMERIC | 1 | 0 | Lev.adr OK (Delivery Address OK) |
| 103 | FOSTIM | TIME | 8 | 0 | Salg kl. (Sales Time) |
| 104 | FOUPRO | CHARACTER | 6 | 0 | U.proj (Project) |

### 17. System Audit Fields (Fields 105-112)
| Field | Name | Type | Size | Dec | Description |
|-------|------|------|------|-----|-------------|
| 105 | FOWSID | CHARACTER | 10 | 0 | Arb.stasj. (Workstation) |
| 106 | FOUSER | CHARACTER | 10 | 0 | Bruker (User) |
| 107 | FODATE | DATE | 10 | 0 | Dato opprettet (Date Created) |
| 108 | FOTIME | TIME | 8 | 0 | Klokken (Time) |
| 109 | FOOOUS | CHARACTER | 10 | 0 | Oppr. av (Created by) |
| 110 | FOEDAT | DATE | 10 | 0 | Endr.dat (Modified Date) |
| 111 | FOETIM | TIME | 8 | 0 | Endr.tid (Modified Time) |
| 112 | FOEUSR | CHARACTER | 10 | 0 | Endret av (Modified by) |

## Key Relationships
- **Primary Key**: FOFIRM + FONUMM + FOSUFF + FOLINE
- **Customer Links**: FOKUND (Customer), FOLKUN (Goods Address), FOLDOR (Delivery Door)
- **Order Links**: FOBENR + FOBSUF (Related Order), FOPORD + FOPSUF (Price Order)
- **Audit Trail**: Created (FODATE/FOTIME/FOOOUS), Modified (FOEDAT/FOETIM/FOEUSR)

## Data Types Summary
- **NUMERIC**: 73 fields (65%)
- **CHARACTER**: 27 fields (24%)
- **DATE**: 10 fields (9%)
- **TIME**: 2 fields (2%)