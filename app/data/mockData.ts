// Données centralisées pour Vision IA Admin Dashboard
// Contexte 100% sénégalais avec cohérence totale

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

export interface Agent {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  zone: string;
  email: string;
  tel: string;
  statut: 'Actif' | 'Inactif' | 'En pause';
  dateEntree: string;
  infractions: number;
  validated: number;
}

export interface Infraction {
  id: string;
  date: string;
  heure: string;
  type: string;
  montant: number;
  conducteur: string;
  plaque: string;
  lieu: string;
  statut: 'Payé' | 'En attente' | 'Relance';
  source: string;
  agentId?: number;
  photo?: string;
}

export interface Vehicle {
  id: number;
  plaque: string;
  marque: string;
  modele: string;
  annee: number;
  proprietaire: string;
  telephone: string;
  adresse: string;
  infractions: number;
  montantDu: number;
  carteGrise: 'Valide' | 'Expirée';
  assurance: 'Valide' | 'Expirée';
  visiteTechnique: 'Valide' | 'Expirée';
  compagnieAssurance: string;
}

export interface Payment {
  id: string;
  date: string;
  heure: string;
  montant: number;
  mode: 'Wave' | 'Orange Money' | 'Free Money';
  telephone: string;
  referenceInfraction: string;
  referenceTransaction: string;
  statut: 'Complété' | 'En attente' | 'Échoué';
}

export interface Zone {
  zone: string;
  infractions: number;
  lat: number;
  lng: number;
  variation: string;
  region: string;
}

// ============================================================================
// DONNÉES DE RÉFÉRENCE
// ============================================================================

export const ZONES_SENEGAL: Zone[] = [
  // Région de Dakar
  { zone: 'Plateau', infractions: 45, lat: 14.6937, lng: -17.4441, variation: '+12%', region: 'Dakar' },
  { zone: 'Almadies', infractions: 32, lat: 14.7392, lng: -17.5094, variation: '+8%', region: 'Dakar' },
  { zone: 'Mermoz', infractions: 28, lat: 14.7157, lng: -17.4677, variation: '+5%', region: 'Dakar' },
  { zone: 'Ouakam', infractions: 35, lat: 14.7194, lng: -17.4897, variation: '+10%', region: 'Dakar' },
  { zone: 'Yoff', infractions: 25, lat: 14.7500, lng: -17.4833, variation: '+6%', region: 'Dakar' },
  { zone: 'Parcelles Assainies', infractions: 42, lat: 14.7833, lng: -17.4333, variation: '+15%', region: 'Dakar' },
  { zone: 'Grand Dakar', infractions: 38, lat: 14.7167, lng: -17.4500, variation: '+11%', region: 'Dakar' },
  { zone: 'Liberté 6', infractions: 30, lat: 14.7000, lng: -17.4600, variation: '+9%', region: 'Dakar' },
  { zone: 'Sacré-Coeur', infractions: 27, lat: 14.7100, lng: -17.4700, variation: '+7%', region: 'Dakar' },
  { zone: 'Point E', infractions: 33, lat: 14.7050, lng: -17.4550, variation: '+8%', region: 'Dakar' },
  { zone: 'HLM Grand Yoff', infractions: 29, lat: 14.7600, lng: -17.4600, variation: '+6%', region: 'Dakar' },
  { zone: 'Médina', infractions: 40, lat: 14.6850, lng: -17.4550, variation: '+13%', region: 'Dakar' },
  { zone: 'Gueule Tapée', infractions: 31, lat: 14.6900, lng: -17.4600, variation: '+9%', region: 'Dakar' },
  { zone: 'Fann', infractions: 26, lat: 14.7050, lng: -17.4650, variation: '+5%', region: 'Dakar' },
  { zone: 'Amitié', infractions: 24, lat: 14.7200, lng: -17.4400, variation: '+4%', region: 'Dakar' },
  { zone: 'Ngor', infractions: 22, lat: 14.7450, lng: -17.5150, variation: '+6%', region: 'Dakar' },
  { zone: 'Ouest Foire', infractions: 36, lat: 14.7300, lng: -17.4750, variation: '+10%', region: 'Dakar' },
  { zone: 'Corniche', infractions: 28, lat: 14.6900, lng: -17.4500, variation: '+7%', region: 'Dakar' },
  { zone: 'Pikine', infractions: 48, lat: 14.7500, lng: -17.3833, variation: '+16%', region: 'Dakar' },
  { zone: 'Guédiawaye', infractions: 44, lat: 14.7833, lng: -17.4000, variation: '+14%', region: 'Dakar' },
  { zone: 'Thiaroye', infractions: 36, lat: 14.7833, lng: -17.3500, variation: '+10%', region: 'Dakar' },
  { zone: 'Rufisque', infractions: 34, lat: 14.7167, lng: -17.2667, variation: '+11%', region: 'Dakar' },
  { zone: 'Bargny', infractions: 22, lat: 14.6833, lng: -17.2333, variation: '+7%', region: 'Dakar' },
];

export const NOMS_SENEGALAIS = [
  'Diop', 'Ndiaye', 'Fall', 'Seck', 'Ba', 'Sy', 'Sall', 'Kane', 'Sarr', 'Faye',
  'Diouf', 'Gueye', 'Thiam', 'Cisse', 'Mbaye', 'Diallo', 'Sow', 'Ndao', 'Lo', 'Ly',
  'Dieng', 'Tall', 'Niang', 'Gaye', 'Mbodj', 'Toure', 'Fofana', 'Dione', 'Sene', 'Wade',
  'Samb', 'Diagne', 'Ndour', 'Badji', 'Balde', 'Barry', 'Camara', 'Coly', 'Dramé', 'Keita'
];

export const PRENOMS_SENEGALAIS = [
  'Mamadou', 'Fatou', 'Ousmane', 'Aïssatou', 'Abdoulaye', 'Mariama', 'Ibrahima', 'Ndèye',
  'Moussa', 'Aminata', 'Cheikh', 'Awa', 'Modou', 'Khady', 'Lamine', 'Binta', 'Samba', 'Maimouna',
  'Alioune', 'Astou', 'Babacar', 'Coumba', 'Demba', 'Dieynaba', 'El Hadji', 'Fatoumata', 'Gora', 'Hawa',
  'Idrissa', 'Jeynaba', 'Khadim', 'Mame', 'Mor', 'Ndeye', 'Omar', 'Pape', 'Rokhaya', 'Seynabou',
  'Souleymane', 'Yacine', 'Youssou', 'Adama', 'Birame', 'Doudou', 'Fallou', 'Ibra', 'Malick', 'Serigne'
];

export const TYPES_INFRACTIONS = [
  { type: 'Excès de vitesse', montant: 25000 },
  { type: 'Stationnement interdit', montant: 15000 },
  { type: 'Feu rouge grillé', montant: 35000 },
  { type: 'Téléphone au volant', montant: 20000 },
  { type: 'Ceinture non attachée', montant: 10000 },
  { type: 'Document périmé', montant: 30000 }
];

export const MARQUES_VEHICULES = [
  { marque: 'Toyota', modeles: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Yaris', 'Land Cruiser'] },
  { marque: 'Peugeot', modeles: ['208', '301', '308', '508', '2008', '3008'] },
  { marque: 'Renault', modeles: ['Clio', 'Megane', 'Duster', 'Kwid', 'Symbol'] },
  { marque: 'Mercedes', modeles: ['C-Class', 'E-Class', 'GLE', 'Sprinter'] },
  { marque: 'Nissan', modeles: ['Sentra', 'Patrol', 'Navara', 'Qashqai'] },
  { marque: 'Hyundai', modeles: ['Elantra', 'Tucson', 'Santa Fe', 'i10'] },
  { marque: 'Kia', modeles: ['Picanto', 'Rio', 'Sportage', 'Sorento'] },
  { marque: 'Suzuki', modeles: ['Swift', 'Vitara', 'Jimny', 'Alto'] }
];

export const COMPAGNIES_ASSURANCE = [
  'AMSA Assurances',
  'NSIA Assurances',
  'Salama Assurances',
  'AXA Assurances Sénégal',
  'Askia Assurances',
  'Sunu Assurances',
  'Allianz Sénégal'
];

export const PREFIXES_PLAQUES = [
  { prefix: 'DK', region: 'Dakar' },
  { prefix: 'TH', region: 'Thiès' },
  { prefix: 'RU', region: 'Rufisque' },
  { prefix: 'ST', region: 'Saint-Louis' },
  { prefix: 'KL', region: 'Kaolack' },
  { prefix: 'ZG', region: 'Ziguinchor' }
];

// ============================================================================
// FONCTIONS DE GÉNÉRATION
// ============================================================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMatricule(id: number): string {
  return `AG-2024-${String(id).padStart(3, '0')}`;
}

function generatePlaque(): string {
  const { prefix } = randomElement(PREFIXES_PLAQUES);
  const num = randomInt(1000, 9999);
  const letters = String.fromCharCode(65 + randomInt(0, 25)) + String.fromCharCode(65 + randomInt(0, 25));
  return `${prefix}-${num}-${letters}`;
}

function generatePhone(): string {
  const prefixes = ['77', '76', '78', '70'];
  const prefix = randomElement(prefixes);
  const num1 = randomInt(100, 999);
  const num2 = randomInt(10, 99);
  const num3 = randomInt(10, 99);
  return `+221 ${prefix} ${num1} ${num2} ${num3}`;
}

function generateDate(month: number = 11, year: number = 2024): string {
  const day = randomInt(1, 28);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

function generateTime(): string {
  const hour = randomInt(6, 22);
  const minute = randomInt(0, 59);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function generateInfractionId(index: number): string {
  return `2024-${String(1000 + index).padStart(6, '0')}`;
}

function generatePaymentId(index: number): string {
  return `PAY-2024-${String(1000 + index).padStart(6, '0')}`;
}

// ============================================================================
// GÉNÉRATION DES AGENTS (50)
// ============================================================================

export const AGENTS: Agent[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const nom = randomElement(NOMS_SENEGALAIS);
  const prenom = randomElement(PRENOMS_SENEGALAIS);
  const zone = randomElement(ZONES_SENEGAL.filter(z => z.region === 'Dakar')).zone;
  const infractions = randomInt(20, 60);
  const validated = Math.floor(infractions * (0.80 + Math.random() * 0.15));
  const statuts: ('Actif' | 'Inactif' | 'En pause')[] = ['Actif', 'Actif', 'Actif', 'En pause', 'Inactif'];
  const statut = randomElement(statuts);

  return {
    id,
    nom,
    prenom,
    matricule: generateMatricule(id),
    zone,
    email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@vision-ia.sn`,
    tel: generatePhone(),
    statut,
    dateEntree: generateDate(randomInt(1, 10)),
    infractions,
    validated
  };
});

// ============================================================================
// GÉNÉRATION DES VÉHICULES (80)
// ============================================================================

export const VEHICLES: Vehicle[] = Array.from({ length: 80 }, (_, i) => {
  const marqueData = randomElement(MARQUES_VEHICULES);
  const modele = randomElement(marqueData.modeles);
  const annee = randomInt(2015, 2024);
  const nom = randomElement(NOMS_SENEGALAIS);
  const prenom = randomElement(PRENOMS_SENEGALAIS);
  const zone = randomElement(ZONES_SENEGAL.filter(z => z.region === 'Dakar')).zone;
  const infractions = randomInt(0, 20);
  const montantDu = infractions > 0 ? randomInt(0, infractions) * randomElement(TYPES_INFRACTIONS).montant : 0;

  const docs: ('Valide' | 'Expirée')[] = ['Valide', 'Valide', 'Valide', 'Expirée'];

  return {
    id: i + 1,
    plaque: generatePlaque(),
    marque: marqueData.marque,
    modele,
    annee,
    proprietaire: `${prenom} ${nom}`,
    telephone: generatePhone(),
    adresse: zone,
    infractions,
    montantDu,
    carteGrise: randomElement(docs),
    assurance: randomElement(docs),
    visiteTechnique: randomElement(docs),
    compagnieAssurance: randomElement(COMPAGNIES_ASSURANCE)
  };
});

// ============================================================================
// GÉNÉRATION DES INFRACTIONS (250)
// ============================================================================

export const INFRACTIONS: Infraction[] = Array.from({ length: 250 }, (_, i) => {
  const typeData = randomElement(TYPES_INFRACTIONS);
  const vehicle = randomElement(VEHICLES);
  const zone = randomElement(ZONES_SENEGAL.filter(z => z.region === 'Dakar'));
  const date = generateDate();
  const heure = generateTime();

  const sourceRandom = Math.random();
  let source: string;
  let agentId: number | undefined;

  if (sourceRandom < 0.5) {
    const agent = randomElement(AGENTS.filter(a => a.statut === 'Actif'));
    source = `${agent.prenom} ${agent.nom}`;
    agentId = agent.id;
  } else {
    source = `VisionIA Caméra ${String(randomInt(1, 20)).padStart(2, '0')}`;
  }

  const statuts: ('Payé' | 'En attente' | 'Relance')[] = [
    'Payé', 'Payé', 'Payé',
    'En attente', 'En attente', 'En attente', 'En attente',
    'Relance', 'Relance'
  ];
  const statut = randomElement(statuts);

  return {
    id: generateInfractionId(i + 1),
    date,
    heure,
    type: typeData.type,
    montant: typeData.montant,
    conducteur: vehicle.proprietaire,
    plaque: vehicle.plaque,
    lieu: zone.zone,
    statut,
    source,
    agentId,
    photo: Math.random() > 0.5 ? `https://images.unsplash.com/photo-${randomInt(1500000000000, 1700000000000)}?w=400` : undefined
  };
});

// ============================================================================
// GÉNÉRATION DES PAIEMENTS (100)
// ============================================================================

export const PAYMENTS: Payment[] = INFRACTIONS
  .filter(inf => inf.statut === 'Payé')
  .slice(0, 100)
  .map((infraction, i) => {
    const modes: ('Wave' | 'Orange Money' | 'Free Money')[] = [
      'Wave', 'Wave', 'Wave', 'Wave',
      'Orange Money', 'Orange Money', 'Orange Money',
      'Free Money', 'Free Money', 'Free Money'
    ];
    const mode = randomElement(modes);

    let refPrefix = '';
    if (mode === 'Wave') refPrefix = 'WV';
    else if (mode === 'Orange Money') refPrefix = 'OM';
    else refPrefix = 'FM';

    return {
      id: generatePaymentId(i + 1),
      date: infraction.date,
      heure: generateTime(),
      montant: infraction.montant,
      mode,
      telephone: generatePhone(),
      referenceInfraction: infraction.id,
      referenceTransaction: `${refPrefix}${randomInt(100000000, 999999999)}`,
      statut: 'Complété'
    };
  });

// ============================================================================
// SYNCHRONISATION DES DONNÉES
// ============================================================================

// Mettre à jour le nombre d'infractions par véhicule
VEHICLES.forEach(vehicle => {
  const vehicleInfractions = INFRACTIONS.filter(inf => inf.plaque === vehicle.plaque);
  vehicle.infractions = vehicleInfractions.length;

  const unpaidInfractions = vehicleInfractions.filter(inf => inf.statut !== 'Payé');
  vehicle.montantDu = unpaidInfractions.reduce((sum, inf) => sum + inf.montant, 0);
});

// Mettre à jour le nombre d'infractions par agent
AGENTS.forEach(agent => {
  const agentInfractions = INFRACTIONS.filter(inf => inf.agentId === agent.id);
  agent.infractions = agentInfractions.length;
  agent.validated = agentInfractions.length; // Toutes validées par défaut
});

// Mettre à jour le nombre d'infractions par zone
ZONES_SENEGAL.forEach(zone => {
  const zoneInfractions = INFRACTIONS.filter(inf => inf.lieu === zone.zone);
  zone.infractions = zoneInfractions.length;
});

// ============================================================================
// STATISTIQUES CALCULÉES
// ============================================================================

export const STATISTICS = {
  totalInfractions: INFRACTIONS.length,
  totalAgents: AGENTS.filter(a => a.statut === 'Actif').length,
  totalVehicles: VEHICLES.length,
  totalPayments: PAYMENTS.length,

  totalMontant: INFRACTIONS.reduce((sum, inf) => sum + inf.montant, 0),
  totalRecouvre: PAYMENTS.reduce((sum, pay) => sum + pay.montant, 0),

  tauxPaiement: (PAYMENTS.length / INFRACTIONS.length * 100).toFixed(1),

  infractionsPaye: INFRACTIONS.filter(inf => inf.statut === 'Payé').length,
  infractionsEnAttente: INFRACTIONS.filter(inf => inf.statut === 'En attente').length,
  infractionsRelance: INFRACTIONS.filter(inf => inf.statut === 'Relance').length,

  zonesCritiques: ZONES_SENEGAL.filter(z => z.infractions > 40).length
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  AGENTS,
  INFRACTIONS,
  VEHICLES,
  PAYMENTS,
  ZONES_SENEGAL,
  STATISTICS,
  TYPES_INFRACTIONS,
  MARQUES_VEHICULES,
  COMPAGNIES_ASSURANCE
};
