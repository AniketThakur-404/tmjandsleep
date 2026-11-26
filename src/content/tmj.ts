// Page copy for "TMJ Pain, Jaw Pain and Jaw-Related Headaches in Sydney" — from "1. Final Jaw Pain and Headaches.docx".
// Inline links are written as [label](/path) and rendered by <Rich />.
// Citation markers such as [1,2] are rendered as links to the reference list (see <Rich />).

/* ---------------- Intro ---------------- */

export const pageMeta = {
  title: "TMJ Pain & Jaw-Related Headaches | Sydney CBD Clinic",
  description:
    "TMJ pain, clicking or jaw-related headaches? Get a jaw pain assessment in Sydney CBD with Dr Manish Shah, dentist and doctor. No referral needed.",
};

export const byline = {
  reviewer: "Dr Manish Shah, BDS (Hons), MBBS, MMED (Sleep Medicine), University of Sydney",
  where: "Sydney Centre for TMJ and Sleep Therapy, Level 4, 307 Pitt Street, Sydney NSW 2000",
  ahpra: "DEN0001361239 (Dental) and MED0001361238 (Medical)",
  lastReviewed: "15th December 2026",
};

export const intro = {
  /** Display line (first sentence of the doc's opening paragraph) */
  lead: "If chewing hurts, your jaw clicks or catches, or headaches keep interrupting your day, a jaw pain assessment can help you find out why.",
  /** Rest of the opening paragraph */
  leadMore: "TMJ pain, facial muscle pain and jaw-related headaches are common, and many people improve with simple, reversible care once the cause is clear. [1,2]",
  body: "Your jaw joints (the temporomandibular joints, or TMJ) and chewing muscles can contribute to jaw-related facial pain and headaches. Teeth, ear conditions, migraine and nerve pain can cause similar symptoms, so we look beyond the painful spot before recommending treatment. [1,2,10]",
  doctor:
    "At Sydney Centre for TMJ and Sleep Therapy, Dr Manish Shah is registered as both a dentist and a medical practitioner, with postgraduate training in sleep medicine. Your jaw symptoms, headaches and sleep can be considered in the same consultation, with treatment or referral guided by what we find.",
};

/* ---------------- Jaw pain at a glance ---------------- */

export const glance = [
  "Many episodes improve with simple care. Pain that persists, keeps returning or affects eating or sleep deserves assessment. [1,2]",
  "Morning jaw pain and headaches can involve grinding, sleep problems, or a separate headache condition. [20,22]",
  "A night guard may protect teeth. Pain relief is a separate treatment goal. [17,19]",
  "Initial assessment: $480 for 30 minutes, including examination, clinical photographs and digital teeth scans. See [consultation fees](#fees) below.",
  "Your first visit aims to explain the likely cause, your options and their costs before any treatment begins.",
];

/* ---------------- Urgent care ---------------- */

export const urgentCare = [
  {
    label: "Emergency",
    title: "Call triple zero (000) immediately for:",
    image: { src: "/images/emergency-000.png", alt: "In an emergency call Triple Zero (000)", fit: "contain" as const, bg: "bg-[#e31e24]" },
    items: [
      "A sudden, extremely severe headache, especially one that peaks within seconds or minutes; or headache with facial droop, weakness, confusion, collapse or difficulty speaking. [3]",
      "Jaw discomfort with chest pressure, breathlessness, sweating, nausea or pain spreading to the arm, shoulder or back. A heart attack can cause jaw pain without obvious chest pain. Ask for an ambulance. [4]",
      "Rapidly spreading facial or mouth swelling, particularly with difficulty breathing or swallowing. [5]",
    ],
    note: "New blurred vision, double vision or loss of vision needs immediate emergency assessment. [6,7]",
  },
  {
    label: "Same day",
    title: "Seek same-day medical or dental assessment for:",
    image: { src: "/images/facial-pain.png", alt: "Person holding a painful jaw", fit: "cover" as const, bg: "bg-panel" },
    items: [
      "A jaw stuck open or a sudden major loss of mouth opening.",
      "Inability to eat or drink, significant facial injury, or fever with facial swelling.",
      "A new headache with scalp or temple tenderness and jaw pain when chewing, especially after age 50. This can signal giant cell arteritis. [6]",
    ],
    note: "Arrange prompt assessment for steadily worsening one-sided pain, a persistent mouth ulcer or lump, or unexplained facial numbness. Repeated pain relief should not replace finding the cause. [7]",
  },
];

/* ---------------- Relief ---------------- */

export const reliefTips = [
  "Choose softer foods temporarily and cut meals into smaller pieces.",
  "Avoid gum, tough foods and prolonged chewing.",
  "Keep opening your mouth comfortably; avoid wide yawning if it hurts.",
  "Try a gentle warm pack, protecting your skin.",
  "Notice clenching or jaw bracing and let the jaw relax.",
  "Avoid forceful stretching or trying to unlock the jaw yourself.",
];

/* ---------------- TMJ and jaw pain symptoms ---------------- */

export const symptomList = [
  "Aching, tightness or tiredness in the cheeks and temples (facial muscle pain).",
  "Clicking, catching or locking of the jaw.",
  "Pain in or just in front of the ear.",
  "Headaches around the temples that worsen with chewing or clenching.",
  "Difficulty opening your mouth fully, or a jaw that tires during meals.",
];

export const signs = [
  {
    title: "Facial muscle pain in the cheeks and temples",
    image: "/images/bruxism-muscles.png",
    fit: "contain" as const,
    body: [
      "Muscle pain may feel like aching, tightness or fatigue across the cheeks and temples.",
      "During examination, reproducing pain you recognise helps the clinician interpret the findings; tenderness alone does not confirm the cause. [8]",
    ],
  },
  {
    title: "Jaw clicking and locking",
    image: "/images/jaw-noises.png",
    body: [
      "A painless click is common and usually needs no treatment.",
      "A painful click, new locking or reduced movement deserves attention. Avoid repeatedly opening wide to test it. [1]",
      "If your jaw is stuck open or you suddenly cannot open your mouth, follow the [urgent care advice](#urgent-care) above. Our locked jaw page explains what happens next.",
    ],
  },
  {
    title: "Jaw and ear pain",
    image: "/images/closed-mouth-anatomy.png",
    fit: "contain" as const,
    body: [
      "Your temporomandibular joints sit just in front of your ears. TMJ means the joint itself; TMD describes disorders affecting the jaw joints, chewing muscles and related structures. [1]",
      "Joint problems can cause pain near the ear, restricted opening, catching or locking.",
      "Pain just in front of the ear that changes with chewing or opening may involve the jaw. Ear discharge, fever, or a change in hearing also needs an ear assessment. A normal ear examination can guide the next step, but does not prove the jaw is responsible. [2,9]",
      "Describe symptoms separately: “My temple aches after chewing, but the ear pressure stays all day.” That distinction can help identify whether more than one problem needs care.",
    ],
  },
  {
    title: "Ringing in the ears",
    image: "/images/headaches.png",
    body: [
      "Tinnitus is hearing a sound, such as ringing or buzzing, without an external source. Jaw problems can contribute in some people, but hearing loss and other causes must also be considered. [11]",
      "Arrange medical assessment for persistent tinnitus, symptoms on one side or a sound that follows your heartbeat. A jaw treatment cannot be promised to resolve tinnitus. [11,12]",
      "Seek urgent assessment for sudden hearing loss, ideally within 24 hours. Call 000 if it occurs with stroke-like symptoms. [12]",
    ],
  },
];

/* ---------------- Other causes ---------------- */

export const otherCauses = [
  {
    title: "Tooth and gum problems",
    image: { src: "/images/tooth-wear.png", alt: "Worn and chipped teeth seen from above and in front", fit: "cover" as const },
    body: [
      "A painful tooth, sensitivity, swelling or a bad taste can point to a dental problem. A dental abscess needs urgent dental treatment; antibiotics, when indicated, do not replace treatment of its source. [5,13]",
      "If a dental procedure is proposed for facial pain, ask which findings identify the tooth as the cause. Irreversible treatment needs a clear clinical reason. Pain linked to one tooth, hot or cold drinks, or biting is useful to report.",
    ],
  },
  {
    title: "Ear conditions",
    image: { src: "/images/closed-mouth-anatomy.png", alt: "Closed mouth TMJ anatomy showing the jaw joint just in front of the ear", fit: "contain" as const },
    body: [
      "Ear infections can cause pain, discharge, fever, pressure or reduced hearing. These symptoms need an ear examination. [9]",
      "If the ear examination is normal, your jaw joint or chewing muscles may be worth assessing. [2]",
    ],
  },
  {
    title: "Migraine",
    image: { src: "/images/headaches.png", alt: "Woman holding her temples with a headache", fit: "cover" as const },
    body: [
      "Migraine often causes moderate or severe headache with nausea or sensitivity to light and sound. Routine activity may make it worse. [14]",
      "A sore jaw does not rule out migraine. Tell us about headache duration, associated symptoms and medication use so we can consider whether medical assessment is needed.",
    ],
  },
  {
    title: "Nerve pain",
    image: { src: "/images/facial-pain.png", alt: "Woman holding one side of her face in pain", fit: "cover" as const },
    body: [
      "Brief, severe, electric shock-like pain on one side of the face can suggest trigeminal neuralgia. Light touch, toothbrushing, eating, or wind may trigger an attack. [15]",
      "This pattern needs medical assessment. Persistent burning, altered sensation, or pain after an injury or procedure also deserves careful investigation, rather than assuming a tooth or jaw joint is responsible. [7,15]",
    ],
  },
];

/* ---------------- Assessment ---------------- */

export const assessSteps: { title: string; body: string[]; list?: string[]; after?: string[] }[] = [
  {
    title: "Your symptoms and history",
    body: ["Expect questions about:"],
    list: [
      "Pain location, duration and triggers.",
      "Headache frequency and associated symptoms.",
      "Jaw catching, locking or limited opening.",
      "Tooth pain, swelling, ear symptoms or hearing changes.",
      "Clenching, grinding, snoring and waking unrefreshed.",
      "Previous injuries, treatment, medicines and medical conditions.",
    ],
    after: [
      "You do not need to arrive with a diagnosis. Tell us what has changed and what you most want help with.",
    ],
  },
  {
    title: "Examination",
    body: ["The examination may assess jaw movement, chewing muscles, joints and teeth. Tell us when a movement hurts so the examination can be adapted. [8]"],
  },
  {
    title: "Sleep study — when indicated",
    body: ["A sleep study may be requested if a sleep disorder is suspected as a contributing factor to grinding and jaw pain."],
  },
  {
    title: "Imaging — when indicated",
    body: [
      "Scans are considered when they can answer a specific question or change care. MRI assesses the joint disc and other soft tissues; CT or cone beam CT can assess bone when indicated. Scanning is not routine for every patient. [16,18]",
    ],
  },
  {
    title: "Blood tests — when indicated",
    body: [
      "Blood tests are not routine for jaw pain. They may be ordered when your history or examination suggests another medical condition needs checking, and any costs are explained first.",
    ],
  },
  {
    title: "Referral and next steps",
    body: [
      "If findings point elsewhere, referral may be appropriate—to your GP, a physiotherapist, an ENT clinician, a neurologist, or a sleep physician.",
      "Before deciding on treatment, you should understand the likely diagnosis, your options and the next review point.",
    ],
  },
  {
    title: "What you can expect to leave with",
    body: [],
    list: [
      "An explanation of the likely source of your pain.",
      "Reversible first steps you can start, where suitable.",
      "Your options, their limitations and likely costs before any treatment begins.",
      "A referral, if another clinician is better placed to help.",
      "A plan for when and how your progress will be reviewed.",
    ],
  },
];

/* ---------------- Treatment ---------------- */

export const manageAreas = [
  {
    area: "Area 01",
    title: "Splints & Night Guards",
    items: [
      {
        title: "A splint needs a clear purpose",
        body: [
          "Protecting teeth from grinding damage and reducing jaw pain are separate goals. [17]",
          "If sleep apnoea has been diagnosed, a mandibular advancement device may be suggested instead. [23,24]",
        ],
      },
      {
        title: "Splints and long-standing pain",
        body: [
          "For TMD pain lasting at least three months, the 2023 BMJ guideline conditionally recommended against reversible splints compared with placebo or sham treatment.",
          "That recommendation addresses chronic pain; it does not rule out an appliance for another purpose, such as tooth protection and acute pain. [19]",
        ],
      },
      {
        title: "If a splint is recommended",
        body: [
          "Ask how its fit, comfort and effect will be checked.",
          "Report increased pain, new locking or a change in your bite promptly.",
        ],
      },
      {
        title: "Splint fees",
        body: [
          "Splint fees depend on the type of appliance and the laboratory work involved.",
          "We explain the cost and any health fund item numbers before you decide.",
        ],
      },
    ],
  },
  {
    area: "Area 02",
    title: "Self Care & Guided Movement",
    items: [
      {
        title: "Education, exercises & physiotherapy",
        body: [
          "Depending on your diagnosis, care may include education, supervised jaw exercises, physiotherapy, selected manual therapies and strategies to reduce sustained jaw bracing.",
          "Exercises should suit your examination findings and current movement. [7,19]",
        ],
      },
      {
        title: "Cognitive behavioural therapy",
        body: [
          "For persistent pain, cognitive behavioural therapy can help with pain management and its effects on daily life.",
          "Pain is real, and support for sleep or distress can be a useful part of treatment. [19]",
        ],
      },
      {
        title: "Medication",
        body: [
          "Medication needs an individual discussion about your health, other medicines and how long to use it.",
          "Repeatedly needing pain relief is a reason to review the cause. [2]",
        ],
      },
    ],
  },
  {
    area: "Area 03",
    title: "Checking Whether Treatment Is Helping",
    items: [
      {
        title: "What matters in your day",
        body: [
          "Review should focus on what matters in your day: eating more comfortably, fewer interruptions from pain, less sleep disruption or reduced reliance on pain relief.",
          "Keep a brief record of jaw symptoms and headache days if it helps. [7]",
        ],
      },
      {
        title: "If symptoms persist or change",
        body: ["If symptoms persist or change, we reassess the diagnosis and plan.", "Ongoing headaches need attention even when jaw symptoms improve."],
      },
    ],
  },
];

/* ---------------- Why choose us ---------------- */

export const whyChoose = [
  {
    title: "Medical, Dental and Sleep-Medicine Perspective",
    body: [
      "Dr Manish Shah holds BDS (Hons), MBBS and MMed (Sleep Medicine) qualifications from the University of Sydney.",
      "His background in both medicine and dentistry, together with postgraduate sleep-medicine training, informs consideration of sleep symptoms, oral anatomy, the jaw and potential airway obstruction. Professional qualifications do not remove the need for appropriate tests or multidisciplinary referrals where indicated.",
    ],
  },
  {
    title: "More Than One Treatment Pathway",
    body: [
      "The clinic discusses different approaches to snoring rather than assuming that all patients need the same snoring treatment. Where indicated, further medical or ENT assessment and sleep-study evaluation can be part of the decision-making process.",
    ],
  },
  {
    title: "Convenient Sydney CBD Location",
    body: [
      "Visit Level 4, 307 Pitt Street, Sydney NSW 2000, close to Town Hall Station. Free parking is available for clinic visitors; contact reception for directions and access details.",
    ],
  },
  {
    title: "Treatment Planning and Payment Flexibility",
    body: [
      "You can discuss fees, possible instalment plans and follow-up requirements before deciding whether to proceed. The appropriate clinical approach should come before the financing decision.",
    ],
  },
];

/* ---------------- Costs, Medicare and health insurance ---------------- */

export const costs = [
  {
    title: "Know the costs before you decide",
    body: [
      "Your initial TMJ consultation costs $480 and takes approximately 30 minutes. We discuss your TMD symptoms, sleep symptoms, medical history and previous treatment.",
      "The appointment includes a clinical assessment, photographs, and digital tooth scans, as appropriate to your care. CBCT imaging is arranged where clinically justified. A sleep study and blood tests may be requested if your history and examination indicate a need.",
      "Booking an assessment does not commit you to a scan, appliance or ongoing treatment. If further care is recommended, you will receive an explanation of its purpose and costs before deciding.",
      "Additional costs may include investigations, appliance fitting and adjustments, review appointments or care from another practitioner. We will discuss all costs before requesting any of these.",
    ],
  },
  {
    title: "Rebates, payment options and referrals",
    body: [
      "Private health insurance benefits depend on your cover, remaining limits and the service provided. Ask for the relevant item numbers so you can check your benefit directly with your insurer.",
      "Medicare eligibility also depends on the service. Having both medical and dental qualifications does not mean every consultation or appliance attracts a rebate.",
      "Ask the team about available payment options and whether you need a referral for your appointment or a particular rebate.",
    ],
  },
];

export const insuranceNote =
  "If you have private health insurance extras cover, part of a dental consultation or splint may be claimable, depending on your fund, level of cover and waiting periods. Medical consultations are not covered by extras, so ask us for the relevant item numbers to check with your fund.";

/* ---------------- Visiting our clinic ---------------- */

export const visit = {
  transport: "Above Town Hall station and across from Gadigal Metro station.",
  parking: "Free parking is available under the building.",
  payment: "Interest-free payment plans are available. Ask us about eligibility, fees and terms.",
  hours: "Monday to Friday, 9 am to 5 pm",
  website: "tmjandsleep.com.au",
};

/* ---------------- Fees ---------------- */

export const fees = {
  assessment: [
    ["Initial assessment", "$480 for 30 minutes"],
    ["Includes", "Consultation, examination, clinical photographs and digital teeth scans"],
    ["Follow-up consultation", "$280"],
    ["Referral", "Not required to book an assessment"],
  ],
  investigations: [
    ["X-rays or CBCT", "Only when clinically indicated. A Medicare rebate may apply if eligible"],
    ["Sleep study", "If recommended: $170 out of pocket after the Medicare rebate for eligible patients. Eligibility and cost must be confirmed before booking."],
    ["Blood tests", "If indicated, Medicare benefits and out-of-pocket costs depend on the tests and eligibility. Costs are explained before ordering."],
    ["Treatment", "Depends on the diagnosis and agreed plan. Options, alternatives and likely fees are discussed first."],
  ],
} as const;

/* ---------------- FAQ ---------------- */

export const faqs = [
  {
    q: "Why does one side of my jaw hurt when I chew?",
    a: "Possible causes include a tooth problem, a painful jaw joint or chewing muscle pain. Location alone cannot identify the source. Have recurring or persistent pain assessed, especially if eating is affected. Swelling, fever, difficulty swallowing or a sudden loss of opening needs prompt care. [1,2]",
  },
  {
    q: "Should I see a dentist or a doctor?",
    a: "Either can be a reasonable starting point. A dentist assesses teeth and jaw structures; a doctor considers headaches, ear symptoms and other medical causes. Dr Shah is registered in both professions and refers when another clinician is needed. Urgent warning signs require emergency care. [1,2]",
  },
  {
    q: "Can facial muscle pain cause jaw-related headaches?",
    a: "Yes, painful jaw disorders can contribute to headaches, often around the temples. A link between jaw activity and pain reproduced during examination can help establish the connection. Migraine and other headache conditions can coexist. [8,10]",
  },
  {
    q: "Why do I wake with a sore jaw and headache?",
    a: "Sleep bruxism is one possibility. Sleep apnoea, migraine and other conditions can also cause morning headaches. Mention snoring, witnessed breathing pauses or daytime sleepiness so sleep can be considered alongside the jaw symptoms. [17,20,22]",
  },
  {
    q: "Can stress contribute to jaw pain?",
    a: "Yes. Stress may contribute to daytime clenching and jaw bracing. Persistent pain can also disrupt sleep and mood. Addressing these factors can be part of a treatment plan while the physical symptoms receive proper assessment. [19,20]",
  },
  {
    q: "Can jaw problems cause ear pain with a normal ear examination?",
    a: "Yes. Jaw joint or muscle pain can be felt near the ear, especially when chewing changes it. A normal ear examination does not confirm the jaw as the source. Persistent ear symptoms and hearing changes still need medical assessment. [2,9,12]",
  },
  {
    q: "Will I need a night guard or oral appliance?",
    a: "That depends on the diagnosis and treatment goal. A guard may protect teeth, but pain relief varies. A mandibular advancement appliance for diagnosed sleep apnoea serves a different purpose. Ask why an appliance is recommended and how its benefit will be assessed. [17,19,23,24]",
  },
  {
    q: "What happens at the first consultation?",
    a: "We discuss your symptoms, medical and dental history, and how pain affects daily life. The examination may include your jaw movement, muscles, joints, and teeth. Scans or referrals are considered when the findings justify them. [8,16,18]",
  },
  {
    q: "Do I need a scan before booking?",
    a: "Bring existing scans if you have them. Further imaging is selected after assessment when it could clarify the diagnosis or change your care. [16,18]",
  },
  {
    q: "Do I need a referral, and will Medicare cover the assessment?",
    a: "You can book the assessment without a referral. Medicare eligibility is a separate question and depends on the service and applicable requirements. The initial fee is $480, and follow-up consultations are $280. Ask us to confirm any available rebate and your out-of-pocket cost before proceeding.",
  },
  {
    q: "Does private health insurance cover the consultation or a splint?",
    a: "It may partly cover a dental consultation or splint if you have extras cover, depending on your fund, level of cover, waiting periods and annual limits. Medical consultations are not covered by extras, so ask us for item numbers to check with your fund before treatment.",
  },
  {
    q: "How long does TMJ pain last?",
    a: "Many episodes of jaw pain settle within weeks with simple, reversible care. Pain that lasts three months or more is considered persistent and usually benefits from a structured plan. [1,19]",
  },
  {
    q: "Can TMJ pain go away on its own?",
    a: "Often, yes. Many people improve with time, gentle self-care and avoiding strain on the jaw. If pain keeps returning, affects eating or sleep, or needs repeated pain relief, have it assessed. [1,2]",
  },
  {
    q: "What does TMJ pain feel like?",
    a: "It is often a dull ache in front of the ear, in the cheeks or around the temples that worsens with chewing, talking or yawning. Some people also notice clicking, a tired jaw or limited opening. [1,2]",
  },
  {
    q: "Is the jaw pain assessment painful?",
    a: "The examination involves gentle jaw movements and light pressure on the muscles and joints. Tell us if anything hurts and we will adapt or stop that part of the examination. [8]",
  },
  {
    q: "How much does TMJ treatment cost in Sydney?",
    a: "At our clinic, the initial assessment is $480 and follow-up consultations are $280. Treatment costs depend on your diagnosis and plan, and we discuss likely fees and alternatives before anything begins.",
  },
  {
    q: "How many appointments will I need?",
    a: "It depends on the cause and how long you have had symptoms. Some people need an assessment and one review, while persistent pain may need a longer plan with regular check-ins.",
  },
  {
    q: "Do muscle-relaxing injections help TMJ pain?",
    a: "Injections into the jaw muscles are sometimes discussed for persistent jaw muscle pain. A 2023 BMJ guideline made a conditional recommendation against them for chronic TMD pain, so they are not a first-line option. [19]",
  },
  {
    q: "Can TMJ problems cause dizziness or a blocked ear feeling?",
    a: "Some people with jaw problems describe ear fullness, ringing or dizziness. These symptoms have many possible causes, so they need proper assessment rather than being assumed to come from the jaw. [2,11]",
  },
  {
    q: "Can jaw pain start after dental work or wisdom tooth removal?",
    a: "Yes. Keeping your mouth open for a long time can strain the jaw muscles and joints, and this often settles as you heal. Contact your dentist promptly if pain worsens or you notice swelling, fever or difficulty opening.",
  },
];

/* ---------------- References ---------------- */

export const references: { text: string; url?: string }[] = [
  { text: "National Institute of Dental and Craniofacial Research. TMD.", url: "https://www.nidcr.nih.gov/health-info/tmd" },
  {
    text: "Healthdirect Australia. Temporomandibular joint dysfunction.",
    url: "https://www.healthdirect.gov.au/conditions/joint-and-muscle-diseases/temporomandibular-joint-dysfunction",
  },
  {
    text: "NSW Agency for Clinical Innovation, Emergency Care Institute. Headache clinical tool.",
    url: "https://aci.health.nsw.gov.au/networks/eci/clinical/tools/neurology/headache",
  },
  { text: "National Heart Foundation of Australia. Heart attack warning signs.", url: "https://www.heartfoundation.org.au/your-heart/heart-attack-warning-signs" },
  { text: "NHS. Dental abscess.", url: "https://www.nhs.uk/conditions/dental-abscess/" },
  {
    text: "Healthdirect Australia. Polymyalgia rheumatica, including giant cell arteritis warning signs.",
    url: "https://www.healthdirect.gov.au/conditions/joint-and-muscle-diseases/polymyalgia-rheumatica",
  },
  {
    text: "NHS England GIRFT and Royal College of Surgeons of England. Management of painful temporomandibular disorder in adults. Version 1.1, August 2025.",
    url: "https://www.rcseng.ac.uk/-/media/FDS/Comprehensive-guideline-Management-of-painful-Temporomandibular-disorder-in-adults.pdf",
  },
  {
    text: "Schiffman E, Ohrbach R, Truelove E, et al. Diagnostic Criteria for Temporomandibular Disorders for Clinical and Research Applications. J Oral Facial Pain Headache. 2014;28(1):6-27. doi:10.11607/jop.1151.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4478082/",
  },
  { text: "NHS. Ear infections.", url: "https://www.nhs.uk/conditions/ear-infections/" },
  {
    text: "International Headache Society. ICHD-3, section 11.7, Headache attributed to temporomandibular disorder.",
    url: "https://ichd-3.org/11-headache-or-facial-pain-attributed-to-disorder-of-the-cranium-neck-eyes-ears-nose-sinuses-teeth-mouth-or-other-facial-or-cervical-structure/11-7-headache-attributed-to-temporomandibular-disorder-tmd/",
  },
  { text: "National Institute on Deafness and Other Communication Disorders. Tinnitus.", url: "https://www.nidcd.nih.gov/health/tinnitus" },
  {
    text: "National Institute for Health and Care Excellence. Tinnitus assessment and management, NG155, recommendations.",
    url: "https://www.nice.org.uk/guidance/ng155/chapter/Recommendations",
  },
  {
    text: "NSW Agency for Clinical Innovation, Emergency Care Institute. Dental emergencies clinical tool.",
    url: "https://aci.health.nsw.gov.au/networks/eci/clinical/tools/dental-emergencies",
  },
  { text: "International Headache Society. ICHD-3, section 1.1, Migraine without aura.", url: "https://ichd-3.org/1-migraine/1-1-migraine-without-aura/" },
  { text: "NHS. Trigeminal neuralgia symptoms.", url: "https://www.nhs.uk/conditions/trigeminal-neuralgia/symptoms/" },
  {
    text: "American Association for Dental, Oral, and Craniofacial Research. Temporomandibular Disorders scientific policy statement. Adopted 2026.",
    url: "https://www.aadocr.org/science-policy-advocacy/science-policy/temporomandibular-disorders-tmd",
  },
  { text: "National Institute of Dental and Craniofacial Research. Bruxism.", url: "https://www.nidcr.nih.gov/health-info/bruxism" },
  {
    text: "American Academy of Oral and Maxillofacial Radiology and American Academy of Orofacial Pain. Recommendations for imaging of the temporomandibular joint. Position statement.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12539345/",
  },
  {
    text: "Busse JW, Casassus R, Carrasco-Labra A, et al. Management of chronic pain associated with temporomandibular disorders: a clinical practice guideline. BMJ. 2023;383:e076227. doi:10.1136/bmj-2023-076227.",
    url: "https://www.bmj.com/content/383/bmj-2023-076227",
  },
  { text: "Healthdirect Australia. Teeth grinding (bruxism).", url: "https://www.healthdirect.gov.au/teeth-grinding" },
  {
    text: "Lobbezoo F, Ahlberg J, Raphael KG, et al. International consensus on the assessment of bruxism: Report of a work in progress. J Oral Rehabil. 2018;45(11):837-844. doi:10.1111/joor.12663.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6287494/",
  },
  {
    text: "International Headache Society. ICHD-3, section 10.1.4, Sleep apnoea headache.",
    url: "https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-4-sleep-apnoea-headache/",
  },
  { text: "Healthdirect Australia. Obstructive sleep apnoea (OSA).", url: "https://www.healthdirect.gov.au/obstructive-sleep-apnoea" },
  {
    text: "Better Health Channel (Victorian Department of Health). Sleep apnoea.",
    url: "https://www.betterhealth.vic.gov.au/health/ConditionsAndTreatments/sleep-apnoea",
  },
  {
    text: "Landry ML, Rompré PH, Manzini C, et al. Reduction of sleep bruxism using a mandibular advancement device: an experimental controlled study. Int J Prosthodont. 2006;19(6):549–556.",
  },
];
