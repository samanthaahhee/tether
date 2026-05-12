export interface CrisisLine {
  name: string;
  number: string;
  note: string;
}

export interface CrisisCountry {
  country: string;
  code: string;
  flag: string;
  lines: CrisisLine[];
}

export const CRISIS_COUNTRIES: CrisisCountry[] = [
  {
    country: 'International',
    code: 'international',
    flag: '',
    lines: [
      { name: 'Befrienders Worldwide', number: '', note: 'befrienders.org. Find a helpline in your country.' },
      { name: 'IASP Crisis Centres', number: '', note: 'iasp.info/resources. Directory of crisis centres worldwide.' },
      { name: 'Crisis Text Line', number: '', note: 'Text HOME to 741741 (US, UK, CA, IE)' },
    ],
  },
  {
    country: 'United States',
    code: 'us',
    flag: 'US',
    lines: [
      { name: '988 Suicide & Crisis Lifeline', number: 'tel:988', note: 'Call or text 988 (free, 24/7)' },
      { name: 'Crisis Text Line', number: 'sms:741741', note: 'Text HOME to 741741' },
      { name: 'National DV Hotline', number: 'tel:18007997233', note: '1-800-799-7233 (abuse, 24/7)' },
      { name: 'SAMHSA Helpline', number: 'tel:18006624357', note: '1-800-662-4357 (substance abuse)' },
    ],
  },
  {
    country: 'United Kingdom',
    code: 'gb',
    flag: 'GB',
    lines: [
      { name: 'Samaritans', number: 'tel:116123', note: '116 123 (free, 24/7)' },
      { name: 'Shout', number: 'sms:85258', note: 'Text SHOUT to 85258' },
      { name: 'National DV Helpline', number: 'tel:08082000247', note: '0808 2000 247 (abuse, 24/7)' },
      { name: 'CALM', number: 'tel:0800585858', note: '0800 58 58 58 (men, 5pm-midnight)' },
    ],
  },
  {
    country: 'Canada',
    code: 'ca',
    flag: 'CA',
    lines: [
      { name: '988 Suicide Crisis Helpline', number: 'tel:988', note: 'Call or text 988 (24/7)' },
      { name: 'Crisis Services Canada', number: 'tel:18334564566', note: '1-833-456-4566 (24/7)' },
      { name: 'Kids Help Phone', number: 'tel:18006686868', note: '1-800-668-6868 (youth)' },
    ],
  },
  {
    country: 'Australia',
    code: 'au',
    flag: 'AU',
    lines: [
      { name: 'Lifeline', number: 'tel:131114', note: '13 11 14 (24/7)' },
      { name: 'Beyond Blue', number: 'tel:1300224636', note: '1300 22 4636' },
      { name: '1800RESPECT', number: 'tel:1800737732', note: '1800 737 732 (abuse, 24/7)' },
      { name: 'Kids Helpline', number: 'tel:1800551800', note: '1800 55 1800 (youth)' },
    ],
  },
  {
    country: 'New Zealand',
    code: 'nz',
    flag: 'NZ',
    lines: [
      { name: 'Lifeline', number: 'tel:0800543354', note: '0800 543 354 (24/7)' },
      { name: 'Need to Talk?', number: 'tel:1737', note: 'Call or text 1737 (free, 24/7)' },
      { name: 'Women\'s Refuge', number: 'tel:0800733843', note: '0800 733 843 (abuse, 24/7)' },
    ],
  },
  {
    country: 'South Africa',
    code: 'za',
    flag: 'ZA',
    lines: [
      { name: 'Lifeline SA', number: 'tel:+27800567567', note: '0800 567 567 (free, 24/7)' },
      { name: 'SADAG', number: 'tel:+27800456789', note: '0800 456 789' },
      { name: 'SA DSD Crisis Line', number: 'tel:116', note: '116 (free, 24/7)' },
      { name: 'GBV Command Centre', number: 'tel:+27800428428', note: '0800 428 428 (abuse, 24/7)' },
    ],
  },
  {
    country: 'India',
    code: 'in',
    flag: 'IN',
    lines: [
      { name: 'iCall', number: 'tel:+919152987821', note: '9152987821 (Mon-Sat, 8am-10pm)' },
      { name: 'Vandrevala Foundation', number: 'tel:18602662345', note: '1860 2662 345 (24/7)' },
      { name: 'Women Helpline', number: 'tel:181', note: '181 (abuse, 24/7)' },
    ],
  },
  {
    country: 'Ireland',
    code: 'ie',
    flag: 'IE',
    lines: [
      { name: 'Samaritans', number: 'tel:116123', note: '116 123 (free, 24/7)' },
      { name: 'Pieta House', number: 'tel:1800247247', note: '1800 247 247 (24/7)' },
      { name: 'Women\'s Aid', number: 'tel:1800341900', note: '1800 341 900 (abuse, 24/7)' },
    ],
  },
  {
    country: 'Germany',
    code: 'de',
    flag: 'DE',
    lines: [
      { name: 'Telefonseelsorge', number: 'tel:08001110111', note: '0800 111 0 111 (free, 24/7)' },
      { name: 'Telefonseelsorge', number: 'tel:08001110222', note: '0800 111 0 222 (free, 24/7)' },
      { name: 'Hilfetelefon', number: 'tel:08000116016', note: '0800 0116 016 (abuse, 24/7)' },
    ],
  },
  {
    country: 'France',
    code: 'fr',
    flag: 'FR',
    lines: [
      { name: 'SOS Amitie', number: 'tel:0972394050', note: '09 72 39 40 50 (24/7)' },
      { name: '3114 National', number: 'tel:3114', note: '3114 (suicide prevention, 24/7)' },
      { name: 'Violences Femmes', number: 'tel:3919', note: '3919 (abuse)' },
    ],
  },
  {
    country: 'Netherlands',
    code: 'nl',
    flag: 'NL',
    lines: [
      { name: '113 Zelfmoordpreventie', number: 'tel:113', note: '113 or 0800-0113 (24/7)' },
      { name: 'Slachtofferhulp', number: 'tel:0900-0101', note: '0900-0101' },
    ],
  },
  {
    country: 'Brazil',
    code: 'br',
    flag: 'BR',
    lines: [
      { name: 'CVV', number: 'tel:188', note: '188 (free, 24/7)' },
      { name: 'Central de Atendimento a Mulher', number: 'tel:180', note: '180 (abuse, 24/7)' },
    ],
  },
  {
    country: 'Mexico',
    code: 'mx',
    flag: 'MX',
    lines: [
      { name: 'SAPTEL', number: 'tel:+525552598121', note: '55 5259 8121 (24/7)' },
      { name: 'Linea de la Vida', number: 'tel:8009112000', note: '800 911 2000' },
    ],
  },
  {
    country: 'Japan',
    code: 'jp',
    flag: 'JP',
    lines: [
      { name: 'TELL Lifeline', number: 'tel:0357744343', note: '03-5774-0992 (English, 9am-11pm)' },
      { name: 'Yorisoi Hotline', number: 'tel:0120279338', note: '0120-279-338 (24/7)' },
    ],
  },
  {
    country: 'Philippines',
    code: 'ph',
    flag: 'PH',
    lines: [
      { name: 'Hopeline', number: 'tel:028041177', note: '(02) 804-1177 or 0917-558-4673' },
      { name: 'NCMH Crisis Hotline', number: 'tel:0917899727', note: '0917-899-USAP (8727)' },
    ],
  },
  {
    country: 'Singapore',
    code: 'sg',
    flag: 'SG',
    lines: [
      { name: 'SOS', number: 'tel:18002214444', note: '1800-221-4444 (24/7)' },
      { name: 'IMH Mental Health Helpline', number: 'tel:63892222', note: '6389-2222 (24/7)' },
    ],
  },
  {
    country: 'Kenya',
    code: 'ke',
    flag: 'KE',
    lines: [
      { name: 'Befrienders Kenya', number: 'tel:+254722178177', note: '+254 722 178 177' },
      { name: 'GBV Hotline', number: 'tel:1195', note: '1195 (abuse, free)' },
    ],
  },
  {
    country: 'Nigeria',
    code: 'ng',
    flag: 'NG',
    lines: [
      { name: 'SURPIN', number: 'tel:+2348062106493', note: '+234 806 210 6493' },
      { name: 'Mental Health Foundation', number: 'tel:+2348036826927', note: '+234 803 682 6927' },
    ],
  },
  {
    country: 'UAE',
    code: 'ae',
    flag: 'AE',
    lines: [
      { name: 'Hope Line', number: 'tel:8004673', note: '800-HOPE (4673)' },
      { name: 'DHA Mental Health', number: 'tel:8001111', note: '800 1111' },
    ],
  },
];

export function getCrisisLines(countryCode: string): CrisisCountry {
  return CRISIS_COUNTRIES.find((c) => c.code === countryCode) || CRISIS_COUNTRIES[0];
}
