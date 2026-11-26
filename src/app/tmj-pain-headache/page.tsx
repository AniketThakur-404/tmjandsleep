import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { IntroStory } from "@/components/sections/intro-story";
import { Glance } from "@/components/sections/glance";
import { Contributing } from "@/components/sections/contributing";
import { Signs } from "@/components/sections/signs";
import { Neck } from "@/components/sections/neck";
import { Headaches } from "@/components/sections/headaches";
import { StressStory } from "@/components/sections/stress-story";
import { Sleep } from "@/components/sections/sleep";
import { RuleOut } from "@/components/sections/rule-out";
import { Assess } from "@/components/sections/assess";
import { Manage } from "@/components/sections/manage";
import { Monitoring } from "@/components/sections/monitoring";
import { Fees } from "@/components/sections/fees";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { Author } from "@/components/sections/author";
import { PageNav } from "@/components/layout/page-nav";
import { pageMeta } from "@/content/tmj";

export const metadata: Metadata = {
  title: { absolute: pageMeta.title },
  description: pageMeta.description,
  alternates: { canonical: "/tmj-pain-headache/" },
};

/** Sections listed in the floating "On this page" navigator. */
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "urgent-care", label: "Urgent care" },
  { id: "symptoms", label: "Symptoms" },
  { id: "grinding", label: "Grinding & clenching" },
  { id: "causes", label: "Other causes" },
  { id: "diagnosis", label: "Assessment" },
  { id: "treatment", label: "Treatment" },
  { id: "fees", label: "Fees" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Book" },
] as const;

/**
 * TMJ Pain, Jaw Pain and Jaw-Related Headaches in Sydney
 * (content from "1. Final Jaw Pain and Headaches.docx").
 *
 * This is the template page: the other condition / treatment pages in the
 * "TMJ and Sleep" menu will reuse these section layouts with their own copy.
 * The comment above each section names the article heading it carries.
 */
export default function JawPainHeadachesPage() {
  return (
    <>
      {/* H1: TMJ Pain, Jaw Pain and Jaw-Related Headaches in Sydney + review byline */}
      <Hero />
      {/* intro + Dr Shah + booking line */}
      <IntroStory />
      {/* Jaw pain at a glance */}
      <Glance />
      {/* When jaw pain needs urgent care + How to relieve jaw pain at home */}
      <Contributing />
      {/* TMJ and jaw pain symptoms: what they may be telling you */}
      <Signs />
      {/* Jaw-related headaches + Neck pain, posture and jaw pain */}
      <Neck />
      {/* Teeth grinding and jaw clenching (bruxism) — grinding during sleep */}
      <Headaches />
      {/* Daytime clenching */}
      <StressStory />
      {/* Waking with jaw pain or headaches */}
      <Sleep />
      {/* Other causes of jaw and facial pain */}
      <RuleOut />
      {/* What happens at your jaw pain assessment */}
      <Assess />
      {/* TMJ and jaw pain treatment options + Why choose us */}
      <Manage />
      {/* A doctor and dentist assessing your condition */}
      <Monitoring />
      {/* Treatment costs, Medicare and Health Insurance + Visiting our clinic */}
      <Fees />
      {/* Jaw pain and TMJ: frequently asked questions */}
      <Faq />
      {/* Book a jaw pain assessment in Sydney */}
      <Cta />
      {/* About the author + references */}
      <Author />

      <PageNav sections={SECTIONS} />
    </>
  );
}
