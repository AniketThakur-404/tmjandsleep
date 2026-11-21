// Central site config — edit contact details / navigation here.
export const site = {
  name: "Sydney Centre for TMJ & Sleep Therapy",
  shortName: "TMJ & Sleep Therapy",
  phoneDisplay: "02 9264 9120",
  phoneHref: "tel:0292649120",
  email: "info@tmjandsleep.com.au",
  address: ["Suite 403, 307 Pitt Street", "Sydney NSW 2000"],
  hours: "Mon–Fri: 9:00 am–5:00 pm",
  practitioner: "Dr Manish Shah",
  affiliate: "Smile Concepts Advanced Dentistry",
} as const;

export type NavLeaf = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  /** Treatments are grouped under one dropdown in the header */
  group?: "treatments";
  children?: { label: string; href: string; children?: NavLeaf[] }[];
};

export const mainNav: NavItem[] = [
  { label: "TMJ Pain & Headaches", href: "/", active: true, group: "treatments" },
  { label: "Teeth Grinding & Clenching", href: "#", group: "treatments" },
  { label: "Snoring & Sleep Apnoea", href: "#", group: "treatments" },
  { label: "Jaw Clicking & Locked Jaw", href: "#", group: "treatments" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#contact" },
  {
    label: "Blogs",
    href: "#",
    children: [
      {
        label: "TMJ/TMD",
        href: "#",
        children: [
          { label: "TMD Treatment Sydney | TMD Symptoms & Treatment Options", href: "#" },
          { label: "TMJ Symptoms for TMJ Pain", href: "#" },
          { label: "TMJ Treatment Sydney | Specialists in TMJ Pain & Headaches", href: "#" },
          { label: "Jaw Pain Near Ear | Treating TMJ Ear Pains", href: "#" },
          { label: "TMJ Headache. Treatment related to Sleep and TMJ Pain", href: "#" },
        ],
      },
      {
        label: "Snoring and Sleep Apnoea",
        href: "#",
        children: [
          { label: "Sleep Clinic Sydney | Speak to the Sleep Specialists", href: "#" },
          { label: "TMD (same as TMJ Pain) – Get treated @ Sydney", href: "#" },
          { label: "How a Snoring Mouth Guard or Anti Snoring Device Can Help", href: "#" },
          { label: "CPAP for Snoring and Sleep Apnoea", href: "#" },
          { label: "Snoring Laser Treatment Sydney", href: "#" },
          { label: "Snoring and Sleep Apnea in Children", href: "#" },
        ],
      },
    ],
  },
];

export const footerNav = {
  Treatments: [
    "TMJ Pain & Headaches",
    "Bruxism & Clenching",
    "Jaw Clicking & Locking",
    "Snoring",
    "Obstructive Sleep Apnoea",
    "Oral Appliance Therapy",
  ],
  About: ["About the Clinic", "Dr Manish Shah", "Payment Plans", "Referral Form"],
  Contact: ["Book a Consultation", "Contact Us", "Privacy Policy", "Terms of Use"],
} as const;
