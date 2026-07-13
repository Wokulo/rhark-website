import type { Programme } from "@/types";

export const programmesData: Programme[] = [
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
    image: { src: "/images/programs/governance.jpg", alt: "Governance Programme" },
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
];
