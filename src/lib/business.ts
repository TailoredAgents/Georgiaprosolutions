export const business = {
  name: "Georgia Pro Solutions LLC",
  shortName: "Georgia Pro Solutions",
  phone: "(478) 484-7213",
  phoneHref: "tel:+14784847213",
  location: "Allentown, Georgia",
  facebook:
    "https://www.facebook.com/p/Georgia-Pro-Solutions-LLC-100086646438783/",
  // Supplied by the commissioning agency; independently reconfirm before public launch.
  verifiedByOwner: false,
};
export const preview = process.env.SITE_MODE !== "production";
export const siteUrl = process.env.SITE_URL || "http://localhost:3000";
export const services = [
  {
    id: "lawn-care",
    number: "01",
    title: "Lawn care & property maintenance",
    short: "Lawn care",
    icon: "leaf",
    image: "/images/lawn-mowing.jpg",
    alt: "Illustrative close view of a mower cutting a green lawn",
    tagline: "A little care. A big difference.",
    description:
      "Give your outdoor space the attention it deserves. Keep your lawn looking cared for and your property ready to enjoy.",
    detail:
      "An inviting property starts outside. Georgia Pro Solutions offers lawn care and property maintenance to help you stay on top of the outdoor work. Tell us about your yard, the areas that need attention, and whether you are looking for a one-time visit or ongoing care. We’ll discuss the right scope for your property.",
    benefits: [
      "A tidier, more inviting outdoor space",
      "Property care shaped around your needs",
      "One conversation for your outdoor to-do list",
    ],
    prompt: "Tell us about your lawn",
    category: "Lawn care",
  },
  {
    id: "pressure-washing",
    number: "02",
    title: "Pressure washing & exterior cleaning",
    short: "Pressure washing",
    icon: "droplets",
    image: "/images/pressure-washing.jpg",
    alt: "Illustrative outdoor pressure washing scene",
    tagline: "Bring a fresh look to the outside.",
    description:
      "Refresh the surfaces that frame your home. Exterior cleaning helps your property look brighter, cleaner, and cared for.",
    detail:
      "Outdoor surfaces are part of your property’s first impression. Georgia Pro Solutions offers pressure washing and exterior cleaning for a fresh, well-kept appearance. Share photos and tell us which areas you want cleaned. Surface suitability, the cleaning approach, and the final scope are discussed before work is agreed.",
    benefits: [
      "A fresh approach to exterior upkeep",
      "Attention to the areas that matter to you",
      "Cleaning scope discussed for your surfaces",
    ],
    prompt: "Let’s talk exterior cleaning",
    category: "Exterior cleaning",
  },
  {
    id: "junk-removal",
    number: "03",
    title: "Junk removal & hauling",
    short: "Junk removal",
    icon: "truck",
    image: "/images/hauling.jpg",
    alt: "Illustrative organized hauling and property cleanup scene",
    tagline: "Less in the way. More room to enjoy.",
    description:
      "Make space for what comes next. Get help with unwanted items and property clutter, without adding another task to your list.",
    detail:
      "When unwanted items start taking up useful space, a clear plan makes all the difference. Georgia Pro Solutions offers junk removal and hauling. Describe the items, their approximate size, and how they can be accessed. Accepted materials, removal arrangements, and pricing are confirmed for each request.",
    benefits: [
      "A practical path to a clearer space",
      "Help moving your cleanup project forward",
      "Removal details agreed before the job",
    ],
    prompt: "Tell us what needs to go",
    category: "Junk removal",
  },
] as const;
export const gallery = [
  {
    id: "outdoor-living",
    image: "/images/home-hero.jpg",
    title: "Room to enjoy the outdoors",
    category: "Lawn care",
    alt: "Illustrative maintained American home and lawn",
  },
  {
    id: "exterior-refresh",
    image: "/images/pressure-washing.jpg",
    title: "A fresh perspective outside",
    category: "Exterior cleaning",
    alt: "Illustrative pressure washing outdoors",
  },
  {
    id: "clear-space",
    image: "/images/hauling.jpg",
    title: "Space for a fresh start",
    category: "Junk removal",
    alt: "Illustrative hauling and property cleanup",
  },
  {
    id: "lawn-details",
    image: "/images/lawn-mowing.jpg",
    title: "Care in every detail",
    category: "Lawn care",
    alt: "Illustrative lawn maintenance with a mower",
  },
  {
    id: "welcome-home",
    image: "/images/home-porch.jpg",
    title: "A warmer welcome home",
    category: "Lawn care",
    alt: "Illustrative home porch and maintained garden",
  },
];
// Real project records can add {beforeImage, afterImage}; never infer pairs from stock images.
export type Project = (typeof gallery)[number] & {
  beforeImage?: string;
  afterImage?: string;
};
