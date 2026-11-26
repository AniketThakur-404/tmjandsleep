// Central site config — edit contact details / navigation here.
export const site = {
  name: "Sydney Centre for TMJ & Sleep Therapy",
  shortName: "TMJ & Sleep Therapy",
  phoneDisplay: "02 9025 7644",
  phoneHref: "tel:+61290257644",
  email: "info@tmjandsleep.com.au",
  address: ["Level 4, 307 Pitt Street", "Sydney NSW 2000"],
  hours: "Mon–Fri: 9:00 am–5:00 pm",
  practitioner: "Dr Manish Shah",
  affiliate: "Smile Concepts Advanced Dentistry",
  /** TODO: swap for the confirmed online booking URL once the client supplies it. */
  bookingHref: "https://www.tmjandsleep.com.au/contact-us/",
  ahpraRegisterHref: "https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx",
} as const;

export type NavLink = {
  label: string;
  href: string;
  /** Shorter label used inside a megamenu column (the column heading gives the context). */
  short?: string;
  /** One-line summary shown on placeholder pages. */
  blurb?: string;
};

export type NavGroup = { heading: string; links: NavLink[] };

export type NavItem =
  | (NavLink & { kind: "link" })
  | (NavLink & { kind: "dropdown"; links: NavLink[] })
  | (NavLink & { kind: "mega"; groups: NavGroup[] });

/**
 * This project is the single landing page https://www.tmjandsleep.com.au/tmj-pain-headache/.
 * Every other menu / footer link goes to the matching page on the main live site.
 */
export const TEMPLATE_PAGE = "/tmj-pain-headache/";

/** The main live website. */
export const LIVE = "https://www.tmjandsleep.com.au";
const live = (path: string) => `${LIVE}${path}`;
/**
 * Menu items the live site has no page for yet go to its home page.
 * Swap these for the real URLs as the pages are published.
 */
const NO_PAGE_YET = live("/");

/** Compare paths ignoring a trailing slash and #hash. */
export const samePath = (a: string, b: string) => {
  const norm = (p: string) => p.split("#")[0].replace(/\/+$/, "") || "/";
  return norm(a) === norm(b);
};

export const mainNav: NavItem[] = [
  { kind: "link", label: "Home", href: live("/") },
  {
    kind: "dropdown",
    label: "About Us",
    href: live("/about/"),
    links: [
      // The live site has a single About page for all three
      { label: "Dr Manish Shah", href: live("/about/"), blurb: "Dentist, medical practitioner and sleep medicine graduate." },
      { label: "Our Team", href: live("/about/"), blurb: "The people who look after you at the clinic." },
      { label: "Our Practice", href: live("/about/"), blurb: "Our Sydney CBD clinic on Pitt Street." },
    ],
  },
  {
    kind: "mega",
    label: "TMJ and Sleep",
    href: TEMPLATE_PAGE,
    groups: [
      {
        heading: "TMJ Problems",
        links: [
          { label: "TMJ Pain and Headaches", href: TEMPLATE_PAGE },
          { label: "Jaw Clenching and Teeth Grinding", href: live("/bruxism-teeth-grinding-clenching-teeth/") },
          { label: "Jaw Clicking and Locked Jaw", href: live("/dislocated-jaw/") },
          { label: "Jaw Related Ear Pain and Tinnitus", href: live("/tmj-pain-and-ear-pain/") },
        ],
      },
      {
        heading: "TMJ Treatments",
        links: [
          { label: "TMJ Treatment", href: live("/tmj-treatment/") },
          { label: "Oral Appliances and Splints", href: NO_PAGE_YET },
          { label: "TMJ Physiotherapy", href: NO_PAGE_YET },
          { label: "Botox, Jaw Pain, Jaw Clenching and Teeth Grinding", href: NO_PAGE_YET },
        ],
      },
      {
        heading: "Snoring and Sleep Apnoea",
        links: [
          { label: "Snoring and Sleep Apnoea", href: live("/stop-snoring-solutions/") },
          { label: "Mandibular Advancement Mouth Device", href: live("/snoring-sleep-apnoea-treatment-snoring-mouth-guard/") },
          { label: "CPAP", href: live("/snoring-sleep-apnoea-treatment-cpap/") },
          { label: "Myofunctional Therapy", href: NO_PAGE_YET },
          { label: "Maxillary Expansion", href: NO_PAGE_YET },
          { label: "ENT Surgery", href: NO_PAGE_YET },
          { label: "Weight Loss", href: NO_PAGE_YET },
          { label: "Maxillofacial Surgery", href: NO_PAGE_YET },
        ],
      },
      {
        heading: "Children",
        links: [
          { label: "Children Snoring and Sleep Apnoea", short: "Snoring and Sleep Apnoea", href: live("/snoring-sleep-apnea-children/") },
          { label: "Children Mouth Breathing", short: "Mouth Breathing", href: NO_PAGE_YET },
          { label: "Children Teeth Grinding", short: "Teeth Grinding", href: NO_PAGE_YET },
          { label: "Children Bed Wetting", short: "Bed Wetting", href: NO_PAGE_YET },
          { label: "Children ADHD", short: "ADHD", href: NO_PAGE_YET },
          { label: "Children Adenoids and Tonsils", short: "Adenoids and Tonsils", href: NO_PAGE_YET },
          { label: "Children ENT Surgery", short: "ENT Surgery", href: NO_PAGE_YET },
          { label: "Children Myofunctional Therapy", short: "Myofunctional Therapy", href: NO_PAGE_YET },
          { label: "Children Jaw Expansion and Sleep", short: "Jaw Expansion and Sleep", href: NO_PAGE_YET },
        ],
      },
    ],
  },
  { kind: "link", label: "Media", href: NO_PAGE_YET },
  { kind: "link", label: "Payment Plans", href: NO_PAGE_YET },
];

/** Right-hand header actions. The live site has no booking page yet, so booking goes to Contact Us. */
export const contactLink: NavLink = { label: "Contact Us", href: live("/contact-us/") };
export const bookLink: NavLink = { label: "Book With Us", href: site.bookingHref };

export const footerNav: Record<string, NavLink[]> = {
  "TMJ and Sleep": [
    { label: "TMJ Pain and Headaches", href: TEMPLATE_PAGE },
    { label: "Jaw Clenching and Teeth Grinding", href: live("/bruxism-teeth-grinding-clenching-teeth/") },
    { label: "Jaw Clicking and Locked Jaw", href: live("/dislocated-jaw/") },
    { label: "TMJ Treatment", href: live("/tmj-treatment/") },
    { label: "Snoring and Sleep Apnoea", href: live("/stop-snoring-solutions/") },
    { label: "Children Snoring and Sleep Apnoea", href: live("/snoring-sleep-apnea-children/") },
  ],
  About: [
    { label: "Dr Manish Shah", href: live("/about/") },
    { label: "Our Team", href: live("/about/") },
    { label: "Our Practice", href: live("/about/") },
    { label: "Media", href: NO_PAGE_YET },
  ],
  Contact: [
    { label: "Book With Us", href: site.bookingHref },
    { label: "Contact Us", href: contactLink.href },
    { label: "Payment Plans", href: NO_PAGE_YET },
  ],
};

/** Links to the main live site open in a new tab; in-page / phone links don't. */
export const newTab = (href: string) => (/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});
