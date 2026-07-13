import type { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "1",
    slug: "ujana-salama",
    title: "Ujana Salama",
    summary: "Safe youth spaces providing SRHR education and counselling for adolescents in Bondo Sub-County.",
    description:
      "Ujana Salama (Safe Youth) creates safe, inclusive spaces where adolescents aged 10–24 access accurate SRHR information, counselling, and referrals to health services. The project operates through school clubs and community youth centres.",
    programmeId: "1",
    status: "active",
    startDate: "2023-01-01",
    location: "Bondo Sub-County, Siaya",
    beneficiariesCount: 1200,
    image: { src: "/images/projects/ujana-salama.jpg", alt: "Ujana Salama Project" },
    partners: ["County Health Department", "Local Schools"],
    tags: ["Youth", "SRHR", "Adolescents", "Education"],
  },
  {
    id: "2",
    slug: "mama-na-mtoto",
    title: "Mama na Mtoto",
    summary: "Maternal and newborn health programme supporting pregnant women and new mothers in rural Siaya.",
    description:
      "Mama na Mtoto (Mother and Child) improves maternal and newborn health outcomes by training community health volunteers, distributing maternal health kits, and facilitating facility-based deliveries.",
    programmeId: "1",
    status: "active",
    startDate: "2022-06-01",
    location: "Siaya County",
    beneficiariesCount: 800,
    image: { src: "/images/projects/mama-na-mtoto.jpg", alt: "Mama na Mtoto Project" },
    partners: ["Ministry of Health", "Community Health Volunteers"],
    tags: ["Maternal Health", "Women", "Rural Communities"],
  },
];
