/** Editorial images for location pages — varied marketing/analytics visuals from migrated media. */

export type LocationEditorialImage = {
  src: string;
  width: number;
  height: number;
};

const POOL: LocationEditorialImage[] = [
  {
    src: "https://adwrks.co.il/wp-content/uploads/digital-marketing-agency.webp",
    width: 800,
    height: 533,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/google-ads-ppc.png",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/13.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/8e68e316-a0b5-4c8f-92ff-77950518d1c5.webp",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/1-3.png",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/6-3.png",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/website-built.webp",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/3-3.png",
    width: 800,
    height: 600,
  },
  {
    src: "https://adwrks.co.il/wp-content/uploads/5-4.png",
    width: 800,
    height: 600,
  },
];

/** Stable assignment per location id (no duplicate seo-1 on every page). */
const BY_ID: Record<string, number> = {
  karmiel: 0,
  north: 1,
  krayot: 2,
  center: 3,
  sharon: 4,
  south: 5,
  haifa: 6,
  "tel-aviv": 7,
  "ramat-gan": 0,
  "petah-tikva": 1,
  "rishon-lezion": 2,
  holon: 3,
  "bat-yam": 4,
  akko: 5,
  hadera: 6,
  afula: 7,
  herzliya: 0,
  "kfar-saba": 1,
  raanana: 2,
  netanya: 3,
  jerusalem: 4,
  "beer-sheva": 5,
  ashdod: 6,
  ashkelon: 7,
};

export function locationEditorialImage(locationId: string): LocationEditorialImage {
  const idx = BY_ID[locationId] ?? 0;
  return POOL[idx % POOL.length] ?? POOL[0];
}
