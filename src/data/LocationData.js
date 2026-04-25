// GoGym Location Data — Malaysian States and Areas
export const LOCATION_DATA = {
  'Kuala Lumpur': [
    'Ampang', 'Bangsar', 'Brickfields', 'Bukit Bintang', 'Bukit Jalil',
    'Cheras', 'City Centre / KLCC', 'Damansara', 'Desa Parkcity', 'Dutamas',
    'Kepong', 'Kerinchi', 'KL Eco City', 'KL Sentral', 'Medan Tuanku',
    'Melawati', 'Mont Kiara', 'Pantai', 'Pandan', 'Petaling',
    'Segambut', 'Sentul', 'Setapak', 'Setiawangsa', 'Sri Hartamas',
    'Sri Petaling', 'Titiwangsa', 'Taman Tun Dr Ismail', 'Wangsa Maju',
  ],
  'Selangor': [
    'Ampang Jaya', 'Ara Damansara', 'Alam Impian', 'Bandar Utama',
    'Bangsar South', 'Batu Caves', 'Bukit Subang', 'Cyberjaya',
    'Damansara Damai', 'Damansara Jaya', 'Damansara Perdana',
    'Denai Alam', 'Gombak', 'Hulu Langat', 'Kajang', 'Kemuning',
    'Kelang Lama', 'Klang', 'Kota Damansara', 'Kota Kemuning',
    'PJ Old Town', 'Petaling Jaya', 'Puchong', 'Rawang', 'Semenyih',
    'Sepang', 'Shah Alam', 'Subang', 'Subang Jaya', 'Sunway',
    'Sungai Buloh', 'USJ', 'Ulu Klang',
  ],
  'Johor': [
    'Austin Heights', 'Bukit Indah', 'Danga Bay', 'Gelang Patah',
    'Iskandar Puteri', 'Johor Bahru City', 'Kempas', 'Kluang',
    'Kulai', 'Larkin', 'Masai', 'Muar', 'Nusa Bestari',
    'Permas Jaya', 'Plentong', 'Pontian', 'Pulai', 'Senai',
    'Setia Tropika', 'Skudai', 'Tampoi', 'Tebrau', 'Ulu Tiram',
  ],
  'Penang': [
    'Ayer Itam', 'Bagan Ajam', 'Balik Pulau', 'Batu Ferringhi',
    'Batu Kawan', 'Batu Maung', 'Bukit Mertajam', 'Farlim',
    'Georgetown', 'Jelutong', 'Kepala Batas', 'Nibong Tebal',
    'Paya Terubong', 'Perai', 'Relau', 'Seberang Jaya',
    'Simpang Ampat', 'Sungai Ara', 'Tanjung Bungah', 'Tanjung Tokong',
  ],
  'Perak': [
    'Batu Gajah', 'Bidor', 'Ipoh', 'Kampar', 'Lumut',
    'Manjung', 'Sitiawan', 'Taiping', 'Teluk Intan',
  ],
  'Negeri Sembilan': [
    'Bahau', 'Bandar Ainsdale', 'Bandar Sri Sendayan', 'Nilai',
    'Port Dickson', 'Rempit', 'Senawang', 'Seremban', 'Tampin',
  ],
  'Melaka': [
    'Ayer Keroh', 'Bukit Beruang', 'Cheng', 'Klebang',
    'Masjid Tanah', 'Melaka City', 'Merlimau', 'Pulau Sebang',
  ],
  'Pahang': [
    'Bentong', 'Cameron Highlands', 'Cherating', 'Genting Highlands',
    'Kerteh', 'Kemaman', 'Kuantan', 'Mentakab', 'Raub', 'Temerloh',
  ],
  'Sabah': [
    'Donggongon', 'Inanam', 'Keningau', 'Kota Belud', 'Kota Kinabalu',
    'Lahad Datu', 'Likas', 'Luyang', 'Putatan', 'Sandakan',
    'Semporna', 'Tawau', 'Tuaran',
  ],
  'Sarawak': [
    'Bintulu', 'Kota Samarahan', 'Kuching', 'Miri',
    'Sarikei', 'Sibu', 'Sri Aman',
  ],
  'Kedah': [
    'Alor Setar', 'Baling', 'Gurun', 'Jitra', 'Kulim',
    'Langkawi', 'Sungai Petani',
  ],
  'Kelantan': [
    'Bachok', 'Gua Musang', 'Kota Bharu', 'Kuala Krai',
    'Machang', 'Pasir Mas', 'Tumpat',
  ],
  'Terengganu': [
    'Dungun', 'Kemaman', 'Kuala Nerus', 'Kuala Terengganu',
    'Marang', 'Setiu',
  ],
  'Perlis': ['Arau', 'Kangar', 'Padang Besar'],
  'Putrajaya': ['Presint 1', 'Presint 2', 'Presint 8', 'Presint 9', 'Presint 11', 'Presint 14', 'Presint 15'],
};

export const STATES = Object.keys(LOCATION_DATA);

export const getAreas = (state) => LOCATION_DATA[state] || [];

export const searchAreas = (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];
  Object.entries(LOCATION_DATA).forEach(([state, areas]) => {
    areas.forEach(area => {
      if (area.toLowerCase().includes(q)) {
        results.push({ state, area, label: `${area}, ${state}` });
      }
    });
  });
  return results.slice(0, 10);
};
