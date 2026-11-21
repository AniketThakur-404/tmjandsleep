import { Hero } from "@/components/sections/hero";
import { IntroStory } from "@/components/sections/intro-story";
import { Contributing } from "@/components/sections/contributing";
import { Signs } from "@/components/sections/signs";
import { Neck } from "@/components/sections/neck";
import { Headaches } from "@/components/sections/headaches";
import { RuleOut } from "@/components/sections/rule-out";
import { StressStory } from "@/components/sections/stress-story";
import { Assess } from "@/components/sections/assess";
import { Manage } from "@/components/sections/manage";
import { Monitoring } from "@/components/sections/monitoring";
import { Cta } from "@/components/sections/cta";

export default function TmjPainHeadachePage() {
  return (
    <>
      <Hero />
      <IntroStory />
      <Contributing />
      <Signs />
      <Neck />
      <Headaches />
      <RuleOut />
      <StressStory />
      <Assess />
      <Manage />
      <Monitoring />
      <Cta />
    </>
  );
}
