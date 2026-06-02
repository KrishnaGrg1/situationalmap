export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentCategory = 'disaster' | 'protest' | 'traffic' | 'crime' | 'medical';
export type ResourceStatus = 'deployed' | 'standby' | 'available' | 'unavailable';

export interface IncidentUpdate {
  user: string;
  text: string;
  time: string;
}

export interface Incident {
  id: number;
  title: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  district: string;
  time: string;
  desc: string;
  officers: number;
  peopleAffected: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  updates: IncidentUpdate[];
  status: 'active' | 'monitoring' | 'resolved';
}

export interface Resource {
  id: number;
  name: string;
  type: 'unit' | 'vehicle' | 'personnel';
  officers: number;
  vehicle: string;
  status: ResourceStatus;
  assignedTo?: number;
}

export interface Province {
  name: string;
  status: 'active' | 'monitoring' | 'normal';
  count: number;
}

export const incidents: Incident[] = [
  {
    id: 1,
    title: 'Flood: Bardiya District',
    severity: 'critical',
    category: 'disaster',
    district: 'Bardiya',
    time: '12:18',
    desc: 'Heavy rainfall causing flooding. 3 families displaced near Rajapur area. Road to Thakurdwara blocked.',
    officers: 8,
    peopleAffected: 15,
    coordinates: { lat: 28.35, lng: 81.25 },
    status: 'active',
    updates: [
      { user: 'SSP', text: '2 rescue boats dispatched. Army coordination requested.', time: '13:45' },
      { user: 'ASI', text: 'Families shifted to Rajapur school shelter.', time: '13:22' },
      { user: 'SI', text: 'Road blocked at km 12. Alternative route via Gularia.', time: '12:35' }
    ]
  },
  {
    id: 2,
    title: 'Landslide Risk: Kaski',
    severity: 'critical',
    category: 'disaster',
    district: 'Kaski',
    time: '11:45',
    desc: 'High risk of landslide following heavy rain. 2 villages on evacuation alert near Pokhara-Baglung highway.',
    officers: 6,
    peopleAffected: 200,
    coordinates: { lat: 28.21, lng: 83.99 },
    status: 'active',
    updates: [
      { user: 'DSP', text: 'Evacuation order issued for Ghachok and Mardi areas.', time: '12:10' },
      { user: 'SI', text: 'Monitoring team deployed at slide-prone zone.', time: '11:55' }
    ]
  },
  {
    id: 3,
    title: 'Protest: Ratnapark KTM',
    severity: 'high',
    category: 'protest',
    district: 'Kathmandu',
    time: '10:30',
    desc: 'Anti-corruption protest at Ratnapark. Approx. 500 participants. Situation calm but monitoring required.',
    officers: 12,
    peopleAffected: 500,
    coordinates: { lat: 27.70, lng: 85.32 },
    status: 'monitoring',
    updates: [
      { user: 'DIG', text: 'Protesters agreed to disperse by 16:00. No arrests.', time: '14:10' },
      { user: 'DSP', text: 'Perimeter secured. Crowd cooperative.', time: '11:20' }
    ]
  },
  {
    id: 4,
    title: 'Traffic Pile-up: Prithvi Hwy',
    severity: 'high',
    category: 'traffic',
    district: 'Kaski',
    time: '09:55',
    desc: 'Multi-vehicle accident on Prithvi Highway near Damauli. 3 injured, 2 vehicles blocking both lanes.',
    officers: 4,
    peopleAffected: 3,
    coordinates: { lat: 27.95, lng: 84.42 },
    status: 'active',
    updates: [
      { user: 'SI', text: 'Ambulance on scene. Lane partially cleared.', time: '10:40' }
    ]
  },
  {
    id: 5,
    title: 'Road Block: Birgunj Border',
    severity: 'medium',
    category: 'traffic',
    district: 'Parsa',
    time: '08:20',
    desc: 'Vehicle breakdown causing 2km tailback at Birgunj customs. Freight affected.',
    officers: 3,
    peopleAffected: 0,
    coordinates: { lat: 27.01, lng: 84.87 },
    status: 'monitoring',
    updates: [
      { user: 'ASI', text: 'Tow truck dispatched, ETA 30 min.', time: '09:05' }
    ]
  },
  {
    id: 6,
    title: 'Crowd: Butwal Market',
    severity: 'medium',
    category: 'protest',
    district: 'Rupandehi',
    time: '13:05',
    desc: 'Market closure protest by traders. ~200 people gathered. No violence reported.',
    officers: 4,
    peopleAffected: 200,
    coordinates: { lat: 27.70, lng: 83.45 },
    status: 'monitoring',
    updates: [
      { user: 'SI', text: 'Meeting with ward chairman arranged.', time: '13:45' }
    ]
  },
  {
    id: 7,
    title: 'Fire: Warehouse Bhairahawa',
    severity: 'high',
    category: 'disaster',
    district: 'Rupandehi',
    time: '14:01',
    desc: 'Warehouse fire reported near Bhairahawa airport industrial zone. Fire brigade alerted.',
    officers: 5,
    peopleAffected: 0,
    coordinates: { lat: 27.51, lng: 83.45 },
    status: 'active',
    updates: [
      { user: 'DSP', text: 'Fire brigade en route. Area cordoned.', time: '14:08' }
    ]
  }
];

export const resources: Resource[] = [
  {
    id: 1,
    name: 'Alpha Unit — Bardiya',
    type: 'unit',
    officers: 8,
    vehicle: '2x Jeep, 1x Rescue Boat',
    status: 'deployed',
    assignedTo: 1
  },
  {
    id: 2,
    name: 'Bravo Unit — Kaski',
    type: 'unit',
    officers: 6,
    vehicle: '2x Jeep, 1x Ambulance',
    status: 'deployed',
    assignedTo: 2
  },
  {
    id: 3,
    name: 'Delta Unit — KTM',
    type: 'unit',
    officers: 12,
    vehicle: '4x Jeep, Riot gear',
    status: 'standby',
    assignedTo: 3
  },
  {
    id: 4,
    name: 'Echo Unit — Pokhara',
    type: 'unit',
    officers: 5,
    vehicle: '2x Patrol Car',
    status: 'deployed',
    assignedTo: 4
  },
  {
    id: 5,
    name: 'Foxtrot — Reserve',
    type: 'unit',
    officers: 11,
    vehicle: '3x Jeep, 1x Van',
    status: 'available'
  }
];

export const nepaliSummaries = [
  'वर्तमान अवस्था: बर्दियामा बाढीका कारण ३ परिवार विस्थापित भएका छन्। कास्कीमा पहिरोको खतरा उच्च छ। काठमाडौंमा प्रदर्शन नियन्त्रणमा छ। कुल ७ सक्रिय घटनाहरू अनुगमनमा छन्।',
  'अपडेट: भैरहवामा गोदाम आगलागी भएको छ — दमकल सूचित गरिएको छ। बर्दियामा थप उद्धार डुङ्गाहरू पठाइएका छन्। बुटवलमा व्यापारीहरूको विरोध शान्तिपूर्ण रूपमा जारी छ।',
  'प्राथमिकता: बर्दिया र कास्कीलाई तत्काल स्रोत आवश्यक छ। काठमाडौं प्रदर्शन बिहान ४ बजेसम्म समाप्त हुने अपेक्षा छ। समग्र स्थिति नियन्त्रणमा।'
];

export const timeline = [
  { time: '14:08', text: 'Fire reported in Bhairahawa warehouse — Fire brigade alerted', severity: 'critical' },
  { time: '14:01', text: 'New incident logged: Bhairahawa industrial fire', severity: 'high' },
  { time: '13:45', text: 'Rescue boats dispatched to Bardiya flood zone', severity: 'critical' },
  { time: '13:22', text: 'Displaced families shifted to Rajapur school shelter', severity: 'low' },
  { time: '13:05', text: 'Crowd monitoring started: Butwal market protest', severity: 'high' },
  { time: '12:10', text: 'Evacuation order: Ghachok and Mardi areas (Kaski)', severity: 'critical' },
  { time: '11:45', text: 'Landslide risk elevated to CRITICAL in Kaski', severity: 'critical' },
  { time: '10:30', text: 'Protest logged: Ratnapark, ~500 participants', severity: 'high' }
];

export const provinces: Province[] = [
  { name: 'Bagmati', status: 'active', count: 2 },
  { name: 'Lumbini', status: 'monitoring', count: 2 },
  { name: 'Gandaki', status: 'active', count: 2 },
  { name: 'Madhesh', status: 'monitoring', count: 1 },
  { name: 'Koshi', status: 'normal', count: 0 },
  { name: 'Karnali', status: 'normal', count: 0 },
  { name: 'Sudurpashchim', status: 'normal', count: 0 }
];
