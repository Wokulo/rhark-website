import type { Programme } from "@/types";

export const programsData: Programme[] = [
  {
    id: "1",
    slug: "srhr",
    title: "Sexual and Reproductive Health and Rights",
    shortTitle: "SRHR",
    description:
      "Advancing access to comprehensive sexual and reproductive health information, services, and rights for young people and women in Siaya County.",
    icon: "Heart",
    color: "primary",
    image: { src: "/images/programs/srhr.jpg", alt: "SRHR Programme" },
    objectives: [
      "Increase access to SRHR information and services",
      "Reduce unmet need for family planning",
      "Strengthen community health systems",
    ],
    targetBeneficiaries: ["Youth", "Women", "Adolescents"],
  },
  {
    id: "2",
    slug: "mental-health",
    title: "Mental Health and Wellness",
    shortTitle: "Mental Health",
    description:
      "Promoting mental health awareness, reducing stigma, and connecting community members to psychosocial support services.",
    icon: "Brain",
    color: "secondary",
    image: { src: "/images/programs/mental-health.jpg", alt: "Mental Health Programme" },
    objectives: [
      "Reduce mental health stigma in communities",
      "Train community health workers in psychosocial support",
      "Establish peer support networks",
    ],
    targetBeneficiaries: ["Youth", "Women", "Community Leaders"],
  },
  {
    id: "3",
    slug: "hiv-teen-pregnancy",
    title: "HIV/AIDS and Teen Pregnancy Prevention",
    shortTitle: "HIV & Teen Pregnancy",
    description:
      "Comprehensive prevention programmes targeting adolescents and youth to reduce HIV transmission and teenage pregnancy rates.",
    icon: "Shield",
    color: "accent",
    image: { src: "/images/programs/hiv-prevention.jpg", alt: "HIV Prevention Programme" },
    objectives: [
      "Reduce new HIV infections among youth",
      "Decrease teenage pregnancy rates",
      "Increase uptake of HIV testing and counselling",
    ],
    targetBeneficiaries: ["Adolescents", "Youth", "Schools"],
  },
  {
    id: "4",
    slug: "gender-equality",
    title: "Gender Equality and Empowerment",
    shortTitle: "Gender Equality",
    description:
      "Challenging harmful gender norms, promoting women's rights, and empowering girls and women to participate fully in society.",
    icon: "Users",
    color: "primary",
    image: { src: "/images/programs/gender-equality.jpg", alt: "Gender Equality Programme" },
    objectives: [
      "Eliminate gender-based violence",
      "Increase women's economic empowerment",
      "Promote girls' education and retention",
    ],
    targetBeneficiaries: ["Women", "Girls", "Community Leaders"],
  },
  {
    id: "5",
    slug: "governance-policy",
    title: "Governance and Policy Engagement",
    shortTitle: "Governance & Policy",
    description:
      "Engaging government institutions and policymakers to create enabling environments for SRHR and gender equality.",
    icon: "Landmark",
    color: "secondary",
    image: { src: "/images/programs/governance.jpg", alt: "Governance Program" },
    objectives: [
      "Influence county health policies",
      "Strengthen accountability mechanisms",
      "Build civil society capacity for advocacy",
    ],
    targetBeneficiaries: ["Government Institutions", "Community Leaders", "Development Partners"],
  },
  {
    id: "6",
    slug: "climate-justice",
    title: "Climate Justice",
    shortTitle: "Climate Justice",
    description:
      "Addressing the intersection of climate change and reproductive health, empowering communities to adapt and advocate for environmental justice.",
    icon: "Leaf",
    color: "accent",
    image: { src: "/images/programs/climate-justice.jpg", alt: "Climate Justice Programme" },
    objectives: [
      "Build community climate resilience",
      "Link climate change to SRHR outcomes",
      "Advocate for climate justice policies",
    ],
    targetBeneficiaries: ["Rural Communities", "Youth", "Women"],
  },
  {
    id: "7",
    slug: "deep-canvassing",
    title: "Deep Canvassing",
    shortTitle: "Deep Canvassing",
    description:
      "RHARK conducts structured community conversations that build trust, encourage empathy, and promote informed dialogue on sexual and reproductive health, gender equality, HIV prevention, and social inclusion.",
    icon: "MessageCircle",
    color: "secondary",
    image: { src: "/images/programs/deep-canvassing.jpg", alt: "Deep Canvassing Programme" },
    objectives: [
      "Build trust and empathy within communities",
      "Promote informed dialogue on SRHR and gender equality",
      "Foster social inclusion and reduce stigma",
    ],
    targetBeneficiaries: ["Community Members", "Youth", "Women"],
  },
  {
    id: "8",
    slug: "inschool-cse",
    title: "In-School Comprehensive Sexuality Education (CSE) Sessions",
    shortTitle: "In-School CSE",
    description:
      "RHARK delivers age-appropriate, evidence-based sexuality education in schools to equip learners with accurate information, life skills, and healthy decision-making while promoting dignity, respect, and responsible behavior.",
    icon: "BookOpen",
    color: "primary",
    image: { src: "/images/programs/inschool-cse.jpg", alt: "In-School CSE Sessions Programme" },
    objectives: [
      "Deliver age-appropriate sexuality education in schools",
      "Equip learners with life skills and accurate information",
      "Promote dignity, respect, and responsible behavior",
    ],
    targetBeneficiaries: ["Learners", "Teachers", "Schools"],
  },
  {
    id: "9",
    slug: "community-safe-space",
    title: "Community Safe Spaces",
    shortTitle: "Community Safe Spaces",
    description:
      "RHARK establishes inclusive and supportive safe spaces where young people, women, and vulnerable community members can access mentorship, psychosocial support, health information, referrals, and meaningful dialogue without fear of stigma or discrimination.",
    icon: "Home",
    color: "accent",
    image: { src: "/images/programs/community-safe-space.jpg", alt: "Community Safe Spaces Programme" },
    objectives: [
      "Establish inclusive and supportive community safe spaces",
      "Provide mentorship, psychosocial support, and referrals",
      "Enable meaningful dialogue free from stigma and discrimination",
    ],
    targetBeneficiaries: ["Young People", "Women", "Vulnerable Groups"],
  },
  {
    id: "10",
    slug: "gumzo-chuoni",
    title: "Gumzo Chuoni / Campus Vibes",
    shortTitle: "Gumzo Chuoni",
    description:
      "RHARK engages university and college students through interactive campus dialogues, peer education, mentorship, health awareness campaigns, and youth-led discussions that promote leadership, innovation, and positive health behaviors.",
    icon: "GraduationCap",
    color: "primary",
    image: { src: "/images/programs/gumzo-chuoni.jpg", alt: "Gumzo Chuoni / Campus Vibes Programme" },
    objectives: [
      "Engage university and college students in interactive campus dialogues",
      "Build peer education and mentorship networks on campus",
      "Promote leadership, innovation, and positive health behaviors",
    ],
    targetBeneficiaries: ["University Students", "College Students", "Youth"],
  },
];
