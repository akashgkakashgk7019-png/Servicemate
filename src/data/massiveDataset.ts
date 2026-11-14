import { Provider, ServiceItem } from '../types';
import { INITIAL_PROVIDERS, INITIAL_SERVICES } from './seedData';

// Master data pools for procedural generation of 1000+ Services & 1000+ Service Men
const FIRST_NAMES = [
  'Girish', 'Rajesh', 'Suresh', 'Manjunath', 'Raghavendra', 'Mallikarjun', 'Basavaraj', 'Anand',
  'Kavya', 'Deepa', 'Ramesh', 'Santosh', 'Ravi', 'Vijay', 'Shivanand', 'Venkatesh',
  'Vinod', 'Prakash', 'Sunita', 'Ananya', 'Chethan', 'Prashanth', 'Naveen', 'Kiran',
  'Jagadeesh', 'Shivakumar', 'Mahesh', 'Chandrashekar', 'Laxman', 'Gopal', 'Rohit', 'Sachin',
  'Amit', 'Vikram', 'Neha', 'Pooja', 'Priya', 'Swathi', 'Megha', 'Harish',
  'Dharmendra', 'Arun', 'Umesh', 'Somashekar', 'Ashok', 'Sanjay', 'Mukesh', 'Karthik',
  'Guruprasad', 'Nagaraj', 'Siddesh', 'Bhoopesh', 'Dinesh', 'Mohan', 'Lokesh', 'Praveen',
];

const LAST_NAMES = [
  'Patil', 'Kumar', 'Gowda', 'Bhat', 'Reddy', 'Yadav', 'Naik', 'Kulkarni',
  'Biradar', 'Prasad', 'Rao', 'Shetty', 'Devi', 'Nambiar', 'Hegde', 'Deshmukh',
  'Shinde', 'Joshi', 'Swamy', 'Murthy', 'Acharya', 'Kamath', 'Pai', 'Kashyap',
  'Hosamani', 'Hadagali', 'Angadi', 'Marigowda', 'Hiremath', 'Koti', 'Badiger', 'Kambar',
];

const DAVANAGERE_AREAS = [
  'Vidyanagar, Davanagere',
  'MCC A Block, Davanagere',
  'MCC B Block, Davanagere',
  'PJ Extension, Davanagere',
  'Shamnur Road, Davanagere',
  'Hadadi Road, Davanagere',
  'KTJ Nagar, Davanagere',
  'Anjaneya Badavane, Davanagere',
  'PB Road, Davanagere',
  'Shabanur, Davanagere',
  'Nittuvalli, Davanagere',
  'Dental College Road, Davanagere',
  'Saraswathi Nagar, Davanagere',
  'Mandakki Bhatti Area, Davanagere',
  'KB Extension, Davanagere',
  'Siddaveerappa Badavane, Davanagere',
  'SS Layout, Davanagere',
  'Durgigudi, Davanagere',
];

const BENGALURU_AREAS = [
  'Koramangala, Bengaluru',
  'Bellandur, Bengaluru',
  'Indiranagar, Bengaluru',
  'HSR Layout, Bengaluru',
  'Whitefield, Bengaluru',
  'Jayanagar, Bengaluru',
  'Electronic City, Bengaluru',
  'JP Nagar, Bengaluru',
  'BTM Layout, Bengaluru',
  'Hebbal, Bengaluru',
  'Yelahanka, Bengaluru',
  'Marathahalli, Bengaluru',
  'Rajajinagar, Bengaluru',
  'Malleshwaram, Bengaluru',
];

const VEHICLES = [
  'Honda Activa 6G',
  'TVS Jupiter 125',
  'Hero Splendor Plus',
  'Bajaj Pulsar 150',
  'Suzuki Access 125',
  'Yamaha FZ-S',
  'Honda Shine',
  'Hero Glamour',
  'Bajaj Platina',
  'Royal Enfield Bullet 350',
  'Piaggio Ape Mobile Van',
];

const UNSPLASH_TECH_PHOTOS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
];

// Service Template Catalog
interface ServiceTemplate {
  name: string;
  category_id: string;
  basePrice: number;
  duration: string;
  image: string;
  description: string;
  includes: string[];
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // Home Services (CAT01)
  {
    name: 'Overhead Tank High-Pressure Jet Cleaning & Disinfection',
    category_id: 'CAT01',
    basePrice: 599,
    duration: '2 Hours',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Sludge removal, high pressure rotary jet scrubbing, antibacterial UV disinfection, and sediment draining.',
    includes: ['Sludge pump evacuation', 'Food-grade chlorine treatment', 'TDS water quality check'],
  },
  {
    name: 'Bathroom Wall Mixer & Diverter Installation',
    category_id: 'CAT01',
    basePrice: 449,
    duration: '1-2 Hours',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    description: 'Concealed diverter replacement, anti-leak seal fitting, cartridge lubrication, and water pressure balancing.',
    includes: ['PTFE tape insulation', 'Laser leveling alignment', '30-day leak warranty'],
  },
  {
    name: 'Main MCB Tripping & Complete Short Circuit Repair',
    category_id: 'CAT01',
    basePrice: 499,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    description: 'Find elusive short circuits in concealed conduits, balance phases, replace burned miniature circuit breakers.',
    includes: ['Insulation resistance test', 'Phase balancing', 'Burned wire replacement'],
  },
  {
    name: 'Split AC Deep Foam Jet Wash & Coil Sterilization',
    category_id: 'CAT01',
    basePrice: 699,
    duration: '1-2 Hours',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    description: 'High pressure water jet spray on condenser fins, anti-fungal foam treatment, blower cleaning, drain tray sanitization.',
    includes: ['Indoor jet pump wash', 'Outdoor unit condenser clean', 'Cooling gas pressure check'],
  },
  {
    name: 'Inverter & Battery Wiring Setup with Heavy Load Check',
    category_id: 'CAT01',
    basePrice: 549,
    duration: '1-2 Hours',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Terminal lug crimping, acid gravity testing, changeover switch calibration, and dedicated earth wiring.',
    includes: ['Battery terminal cleaning', 'Distilled water top-up check', 'High-current load test'],
  },
  {
    name: 'RO Purifier Membrane & Alkaline Carbon Filter Overhaul',
    category_id: 'CAT01',
    basePrice: 749,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    description: 'Sediment filter replacement, pre-carbon block flush, high-rejection RO membrane installation, and digital TDS calibration.',
    includes: ['Digital TDS test before & after', 'Booster pump pressure check', 'Anti-leak pipe lock pins'],
  },
  {
    name: 'Full Home Deep Sanitization & Single-Disc Floor Polishing',
    category_id: 'CAT01',
    basePrice: 1999,
    duration: '4-6 Hours',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    description: 'Industrial buffer scrubbing, kitchen chimney degreasing, bathroom descaling, balcony wash, and spider cobweb removal.',
    includes: ['Kitchen chimney degrease', 'Acid-free tile scrubbing', 'High suction vacuuming'],
  },
  {
    name: 'Hydraulic Bed Lift Mechanism & Sliding Wardrobe Repair',
    category_id: 'CAT01',
    basePrice: 499,
    duration: '1-2 Hours',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    description: 'Fix heavy gas springs, align bent sliding door channels, replace defective mortise locks, and lubricate rollers.',
    includes: ['Precision screw fixing', 'Door squeak elimination', 'Wood glue reinforcement'],
  },
  {
    name: 'Geyser Heating Element & Thermostat Descaling Service',
    category_id: 'CAT01',
    basePrice: 499,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Remove heavy limescale deposits from copper/glasslined tanks, replace burned thermostats and sacrificial magnesium anodes.',
    includes: ['Limescale descaling flush', 'Thermostat cut-off calibration', 'Safety PRV valve check'],
  },
  {
    name: 'Water Sump High-Volume Mud Evacuation & Cleaning',
    category_id: 'CAT01',
    basePrice: 799,
    duration: '2-3 Hours',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy submersible slurry pump mud extraction, chlorine sterilization, scrubbing floor walls, and clear water refill.',
    includes: ['Slurry extraction pump', 'Bleaching powder scrub', 'UV sterilizer pass'],
  },
  {
    name: 'Ceiling Fan Rewinding & Silent Bearing Replacement',
    category_id: 'CAT01',
    basePrice: 349,
    duration: '45 Mins',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Replace noisy ball bearings (SKF/NBC), re-grease rotor, swap weak capacitors for instant speed boost.',
    includes: ['Capacitor microfarad test', 'Double-bearing lubrication', 'Blade wobble balancing'],
  },
  {
    name: 'Modular Kitchen Chimney Deep Degrease & Baffle Filter Wash',
    category_id: 'CAT01',
    basePrice: 599,
    duration: '90 Mins',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    description: 'Soak baffle filters in industrial caustic solution, degrease suction blower motor, and wipe stainless steel cowl.',
    includes: ['Caustic chemical dip', 'Blower oil cup flush', 'Motor RPM suction test'],
  },

  // Personal Services (CAT02)
  {
    name: 'Bridal HD Airbrush Makeover & Hair Styling at Doorstep',
    category_id: 'CAT02',
    basePrice: 2499,
    duration: '3 Hours',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    description: 'Flawless HD airbrush contouring, false eyelashes, traditional saree/lehenga draping, and customized flower hair updo.',
    includes: ['MAC/Huda Beauty cosmetics', 'Hair updo styling', 'False lashes & setting spray'],
  },
  {
    name: 'O3+ Diamond Radiance Facial & De-Tan Glow Therapy',
    category_id: 'CAT02',
    basePrice: 1199,
    duration: '75 Mins',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'Melanin reducing de-tan pack, ultrasonic pore vacuuming, firming facial acupressure massage, and peel-off rubber mask.',
    includes: ['Deep pore cleansing', 'Ultrasonic blackhead extraction', 'Collagen serum boost'],
  },
  {
    name: 'Deluxe Gel Nail Art & Acrylic Extension Overhaul',
    category_id: 'CAT02',
    basePrice: 899,
    duration: '60 Mins',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    description: 'Nail shaping, Russian cuticle grooming, chip-resistant UV-cured gel polish, glitter ombre finish, and hand spa.',
    includes: ['Dead skin exfoliation', 'Choice of chrome/glitter finish', 'Cuticle nourishment oil'],
  },
  {
    name: 'Ayurvedic Abhyanga Herbal Oil Full Body Massage',
    category_id: 'CAT02',
    basePrice: 1499,
    duration: '90 Mins',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Warm medicated herbal oils for muscle stiffness, joint relaxation, blood circulation, followed by hot steam towels.',
    includes: ['Medicated Dhanwantharam oil', 'Hot herbal towel wipe', 'Aromatherapy ambience'],
  },
  {
    name: 'Men Haircut, Beard Sculpting & Charcoal Blackhead Mask',
    category_id: 'CAT02',
    basePrice: 399,
    duration: '45 Mins',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    description: 'Custom fade haircut, razor sharp beard line edging, tea tree oil massage, and peeling charcoal pore mask.',
    includes: ['Pre-shave warm towel', 'Beard softening butter', 'After-shave splash'],
  },
  {
    name: 'Pre-Wedding & Birthday Candid Photography Package',
    category_id: 'CAT02',
    basePrice: 3499,
    duration: '4 Hours',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: 'Sony Alpha FX3 / A7IV shoot with 35mm and 85mm prime lenses, gimbal cinematic stabilization, and same-day previews.',
    includes: ['75+ color-graded edited photos', 'Raw image drive archive', 'Same-day sneak peek album'],
  },

  // Technical Services (CAT03)
  {
    name: 'Laptop Chip-Level Motherboard Diagnostic & IC Soldering',
    category_id: 'CAT03',
    basePrice: 899,
    duration: '2-3 Hours',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    description: 'Microscope short circuit tracing, power rail MOSFET replacement, liquid spill cleanup, and no-display repairs.',
    includes: ['Microscope IC inspection', 'Ultrasonic board wash', '90-day hardware warranty'],
  },
  {
    name: 'Doorstep Smartphone OLED Display & Battery Replacement',
    category_id: 'CAT03',
    basePrice: 699,
    duration: '45 Mins',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    description: 'Original grade OLED replacement with TrueTone restoration, high capacity battery swap, and waterproof adhesive re-seal.',
    includes: ['Waterproof adhesive gasket', 'Oleophobic touch screen test', 'Free 9H tempered glass'],
  },
  {
    name: 'Custom High-Performance PC Build & Thermal Tuning',
    category_id: 'CAT03',
    basePrice: 1199,
    duration: '2 Hours',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Cable management, AIO liquid cooler installation, Arctic MX-6 paste application, XMP memory tuning, stress tests.',
    includes: ['XMP/EXPO RAM timing tune', 'GPU thermal pad replace', 'Cinebench stress monitor test'],
  },
  {
    name: '4-Channel HD IP CCTV Security Camera Installation',
    category_id: 'CAT03',
    basePrice: 1499,
    duration: '3-4 Hours',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    description: 'Concealed CAT6 cable routing, NVR/DVR hard drive setup, mobile live viewing app configuration, and infrared night test.',
    includes: ['Mobile live-stream app link', 'Infrared night vision test', 'Hard drive recording partition'],
  },
  {
    name: 'Whole-Home Wi-Fi 6 Mesh Router Network Calibration',
    category_id: 'CAT03',
    basePrice: 549,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    description: 'Eliminate dead zones across multi-floor villas and large flats with seamless mesh Wi-Fi 6 nodes and QoS optimization.',
    includes: ['Signal heat-mapping', 'WPA3 encryption setup', 'Parental control rules'],
  },

  // Vehicle Services (CAT04)
  {
    name: 'Doorstep Hydro Ceramic Foam Car Wash & Vacuuming',
    category_id: 'CAT04',
    basePrice: 699,
    duration: '90 Mins',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    description: 'Meguiars high foam cannon pre-wash, alloy wheel iron decontamination, high suction interior vacuuming, and tyre gloss.',
    includes: ['PH-neutral Meguiar’s foam', 'Tyre dresser gloss', 'Microfiber glass buff'],
  },
  {
    name: 'Two-Wheeler Comprehensive Engine Oil & General Tuneup',
    category_id: 'CAT04',
    basePrice: 499,
    duration: '90 Mins',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'Motul 10W40 synthetic engine oil replacement, carburettor/injector wash, chain tensioning & lubing, brake shoe tune.',
    includes: ['Synthetic 10W40 oil change', 'Spark plug spark test', 'Cable lubrication'],
  },
  {
    name: 'Emergency Car & Bike Battery Jumpstart Assistance',
    category_id: 'CAT04',
    basePrice: 349,
    duration: '25 Mins',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    description: 'Rapid arrival with industrial jump starter booster packs, alternator charging voltage testing, and terminal de-rusting.',
    includes: ['Cold crank amp test', 'Alternator charging diode check', 'Anti-corrosion grease coat'],
  },
  {
    name: '24/7 Hydraulic Flatbed Breakdown Towing Assistance',
    category_id: 'CAT04',
    basePrice: 1799,
    duration: 'Rapid Arrival',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    description: 'Zero-scratch hydraulic tilt tray flatbed vehicle transport to any authorized service center or garage across city limits.',
    includes: ['All-wheel tie-down harness', 'Zero-scratch guarantee', 'Live GPS truck tracking'],
  },

  // Other Services (CAT05)
  {
    name: 'Herbal Odorless Cockroach & Pest Elimination Gel',
    category_id: 'CAT05',
    basePrice: 799,
    duration: '1 Hour',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    description: '100% food-grade Bayer herbal gel dots applied to cabinet hinges, drains, and kitchen corners. 60-day warranty.',
    includes: ['Food-safe herbal dots', 'Pet & infant safe spray', '60-day replacement warranty'],
  },
  {
    name: 'Terrace & Balcony Garden Organic Fertilization & Pruning',
    category_id: 'CAT05',
    basePrice: 649,
    duration: '2 Hours',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    description: 'Pruning dry stems, aerating soil root zones, organic vermicompost & neem oil feeding, and drip pipe tuning.',
    includes: ['Soil aeration', 'Organic neem oil spray', 'Dry leaf cleanup'],
  },
  {
    name: 'Class 9–12 Mathematics & Physics Home Tutoring Class',
    category_id: 'CAT05',
    basePrice: 749,
    duration: '90 Mins',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'Personalized interactive problem-solving session, conceptual physics demonstrations, and past 10-year board paper review.',
    includes: ['Diagnostic aptitude test', 'Handwritten formula cheat sheets', 'Parent weekly progress card'],
  },
];

/**
 * Generates 1,020+ realistic Service Men across Davanagere, Bengaluru, and neighboring Karnataka cities
 */
export function GENERATE_1000_PROVIDERS(): Provider[] {
  const result: Provider[] = [...INITIAL_PROVIDERS];
  const targetCount = 1050;

  let idCounter = INITIAL_PROVIDERS.length + 1;

  while (result.length < targetCount) {
    const fName = FIRST_NAMES[(idCounter * 7) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(idCounter * 11) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;

    // Alternate heavily between Davanagere and Bengaluru
    const isDavanagere = idCounter % 2 === 0;
    const location = isDavanagere
      ? DAVANAGERE_AREAS[idCounter % DAVANAGERE_AREAS.length]
      : BENGALURU_AREAS[idCounter % BENGALURU_AREAS.length];

    const categoryNum = ((idCounter % 5) + 1);
    const category_id = `CAT0${categoryNum}`;

    const expYears = 3 + (idCounter % 14);
    const experience = `${expYears}+ Years`;

    const vehicle = VEHICLES[idCounter % VEHICLES.length];
    const rtoCode = isDavanagere ? 'KA-17' : (idCounter % 3 === 0 ? 'KA-01' : (idCounter % 3 === 1 ? 'KA-03' : 'KA-05'));
    const letters = String.fromCharCode(65 + (idCounter % 26)) + String.fromCharCode(65 + ((idCounter * 3) % 26));
    const digits = 1000 + (idCounter % 9000);
    const vehicle_number = `${rtoCode}-${letters}-${digits}`;

    const rating = Number((4.6 + ((idCounter % 5) * 0.1)).toFixed(1));
    const reviewsCount = 15 + ((idCounter * 13) % 220);
    const price = 299 + ((idCounter * 50) % 1500);

    const photoUrl = UNSPLASH_TECH_PHOTOS[idCounter % UNSPLASH_TECH_PHOTOS.length];

    // Status: 95% approved, 5% pending for admin testing
    const status = idCounter % 25 === 0 ? 'PENDING' : 'APPROVED';

    const providerId = `PRV${String(idCounter).padStart(4, '0')}`;

    const p: Provider = {
      provider_id: providerId,
      name: `${fullName} (${isDavanagere ? 'Davanagere' : 'Bengaluru'})`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}.${idCounter}@servicemates.in`,
      phone: `+91 ${isDavanagere ? '99801' : '98450'} ${String(10000 + (idCounter % 90000))}`,
      category_id,
      experience,
      location,
      description: `Verified professional technician operating in ${location}. Specialist with ${experience} field expertise.`,
      price,
      status,
      rating: Math.min(5.0, rating),
      reviews_count: reviewsCount,
      profile_photo: photoUrl,
      services_offered: [
        'Doorstep Inspection',
        'Standard Maintenance & Repairs',
        'Emergency Service Assistance',
      ],
      vehicle_type: vehicle,
      vehicle_number,
      live_lat: isDavanagere ? 14.4644 + ((idCounter % 40) - 20) * 0.002 : 12.9352 + ((idCounter % 40) - 20) * 0.002,
      live_lng: isDavanagere ? 75.9218 + ((idCounter % 40) - 20) * 0.002 : 77.6245 + ((idCounter % 40) - 20) * 0.002,
      created_at: new Date(Date.now() - (idCounter * 86400000 * 2)).toISOString(),
    };

    result.push(p);
    idCounter++;
  }

  return result;
}

/**
 * Generates 1,050+ realistic Services mapped across all providers and service templates
 */
export function GENERATE_1000_SERVICES(providers: Provider[]): ServiceItem[] {
  const result: ServiceItem[] = [...INITIAL_SERVICES];
  const targetCount = 1100;

  let srvCounter = INITIAL_SERVICES.length + 1;

  while (result.length < targetCount) {
    const tmpl = SERVICE_TEMPLATES[srvCounter % SERVICE_TEMPLATES.length];
    const prov = providers[srvCounter % providers.length];

    const isDavanagere = prov.location.toLowerCase().includes('davanagere');
    const locationPrefix = isDavanagere ? 'Davanagere Doorstep' : 'Bengaluru Express';

    const serviceName = `${locationPrefix}: ${tmpl.name}`;
    const price = tmpl.basePrice + ((srvCounter % 6) * 50);

    const srvId = `SRV${String(srvCounter).padStart(5, '0')}`;

    const item: ServiceItem = {
      service_id: srvId,
      category_id: tmpl.category_id,
      provider_id: prov.provider_id,
      service_name: serviceName,
      description: `${tmpl.description} Certified technician (${prov.name}) dispatched from ${prov.location}.`,
      price,
      duration: tmpl.duration,
      image: tmpl.image,
      status: 'ACTIVE',
      includes: tmpl.includes,
      rating: Number((4.7 + ((srvCounter % 4) * 0.1)).toFixed(1)),
      reviews_count: 10 + ((srvCounter * 7) % 180),
    };

    result.push(item);
    srvCounter++;
  }

  return result;
}
