/** Participant release & waiver — agreement version for signed records. */
export const WAIVER_VERSION = '2026-07-22-v2';

export const WAIVER_PDF_PATH = '/downloads/Amplify-AI-Retreat-Participant-Release-and-Waiver.pdf';

export type WaiverSection = {
  number: string;
  title: string;
  paragraphs: string[];
};

export const WAIVER_META = {
  title: 'Participant Release, Waiver of Liability & Media Release',
  eventLine: 'Amplify AI Retreat / July 28–31, 2026',
  venue:
    'The Hive Event Center, 255 S Main Street, Suite 100, Logan, Utah 84321, plus off-site meals, transportation, and the river float.',
  important:
    'IMPORTANT: THIS IS A LEGAL AGREEMENT. IT INCLUDES AN ASSUMPTION OF RISK, A RELEASE AND WAIVER OF CLAIMS, AN INDEMNITY OBLIGATION, A COLLABORATION AND CONFIDENTIALITY COMMITMENT, AND A PERPETUAL PHOTO, VIDEO, VOICE, AND CONTENT RELEASE. PLEASE READ IT CAREFULLY BEFORE SIGNING.',
  intro:
    'In consideration for being permitted to attend and participate in the Amplify AI Retreat (the "Retreat"), I, the undersigned participant, agree as follows:',
} as const;

export const WAIVER_SECTIONS: WaiverSection[] = [
  {
    number: '1',
    title: 'Retreat and Activities',
    paragraphs: [
      'The Retreat includes the welcome reception on July 28, 2026; educational and working sessions from July 29–31, 2026; meals, games, networking, optional open build time, off-site activities, transportation connected with Retreat activities, and a river float (collectively, the "Activities"). I understand that the schedule, location, vendors, and specific Activities may change because of weather, safety, logistics, or other circumstances.',
    ],
  },
  {
    number: '2',
    title: 'Released Parties',
    paragraphs: [
      '"Released Parties" means Amplify AI Retreat, Taba Collective, Amplify AI, Elevated Worldwide, The Hive Event Center, Retreat hosts and guides Braydon Carter, Tony Child, and Bill Banta, and all participating sponsors, venue and property owners, affiliates, officers, members, employees, contractors, volunteers, agents, caterers, transportation providers, river-float or rafting outfitters and guides, equipment providers, successors, and assigns.',
    ],
  },
  {
    number: '3',
    title: 'Voluntary Participation and Fitness',
    paragraphs: [
      'My participation is voluntary. I represent that I am at least 18 years old, am physically and mentally able to participate safely, and will disclose to the appropriate activity provider any condition, allergy, medication, disability, or limitation relevant to my safe participation. I will use reasonable judgment, follow safety instructions, wear required protective equipment, and refrain from participating while impaired by alcohol, drugs, medication, exhaustion, or illness.',
    ],
  },
  {
    number: '4',
    title: 'General Risks',
    paragraphs: [
      'I understand that the Activities involve risks that may be known or unknown, expected or unexpected. These include slips, trips, falls, foodborne illness or allergic reaction, communicable illness, physical exertion, equipment failure, acts or omissions of other participants or third parties, crime, loss or theft of property, weather, natural conditions, and travel or transportation incidents. Injury may be serious, permanent, or fatal, and emergency assistance may be delayed or unavailable.',
    ],
  },
  {
    number: '5',
    title: 'River Float and Water-Activity Risks',
    paragraphs: [
      'I understand that the river float and any rafting, tubing, swimming, boating, wading, or related water activity involves special risks, including cold or fast-moving water, strong or changing currents, drowning, hypothermia, submerged or floating objects, rocks, strainers, debris, uneven or slippery banks, capsizing, falling from a craft, collision with people or objects, entrapment, wildlife, sun exposure, storms, lightning, changing water levels, remote locations, limited rescue access, transportation to and from access points, and the negligent acts or omissions of participants, guides, outfitters, or others.',
      'I agree to wear a properly fitted personal flotation device whenever instructed, remain within designated areas, and comply immediately with all guide and outfitter directions. I may decline or stop an Activity if I believe conditions exceed my abilities. A river-float or rafting provider may require a separate waiver; this Agreement supplements and does not replace any provider-specific agreement.',
    ],
  },
  {
    number: '6',
    title: 'Assumption of Risk',
    paragraphs: [
      'I KNOWINGLY AND VOLUNTARILY ACCEPT AND ASSUME ALL RISKS OF PARTICIPATING IN OR OBSERVING THE ACTIVITIES, INCLUDING RISKS CAUSED IN WHOLE OR IN PART BY THE ORDINARY NEGLIGENCE OF A RELEASED PARTY, TO THE FULLEST EXTENT PERMITTED BY LAW. I accept responsibility for deciding whether to participate and for my own conduct.',
    ],
  },
  {
    number: '7',
    title: 'Release and Waiver of Liability',
    paragraphs: [
      'TO THE FULLEST EXTENT PERMITTED BY LAW, I RELEASE, WAIVE, AND FOREVER DISCHARGE THE RELEASED PARTIES FROM ALL CLAIMS, DEMANDS, DAMAGES, LOSSES, LIABILITIES, COSTS, OR CAUSES OF ACTION ARISING OUT OF OR RELATING TO MY ATTENDANCE AT OR PARTICIPATION IN THE RETREAT OR ACTIVITIES, INCLUDING CLAIMS FOR PERSONAL INJURY, DEATH, ILLNESS, PROPERTY DAMAGE, OR PROPERTY LOSS, WHETHER CAUSED BY AN INHERENT RISK, MY ACTS, A THIRD PARTY, OR THE ORDINARY NEGLIGENCE OF A RELEASED PARTY.',
      'This release does not apply to gross negligence, reckless misconduct, intentional misconduct, or any liability that cannot lawfully be released. Nothing in this Agreement waives rights that Utah law does not permit a participant to waive.',
    ],
  },
  {
    number: '8',
    title: 'Covenant Not to Sue and Indemnity',
    paragraphs: [
      "I agree not to sue or bring a claim against a Released Party for any matter released by this Agreement. I will defend, indemnify, and hold the Released Parties harmless from third-party claims, damages, or expenses (including reasonable attorneys' fees) caused by my acts or omissions, my violation of safety instructions, or my breach of this Agreement. This indemnity does not require me to indemnify a Released Party for that party's gross negligence, reckless misconduct, or intentional misconduct.",
    ],
  },
  {
    number: '9',
    title: 'Emergency Care',
    paragraphs: [
      'If I am unable to consent, I authorize Retreat personnel and activity providers to request reasonable emergency medical care or transportation for me. I understand they have no duty to provide medical services, and I am responsible for all resulting charges. I release the Released Parties from claims arising from good-faith emergency assistance or the decision to seek it, except to the extent prohibited by law.',
    ],
  },
  {
    number: '10',
    title: 'Personal Property and Business Decisions',
    paragraphs: [
      'I am responsible for my personal property, devices, data, accounts, and credentials. Retreat discussions and demonstrations are educational and do not constitute legal, tax, financial, medical, cybersecurity, or other professional advice. I remain responsible for reviewing, testing, securing, and deciding whether to use any AI tool, workflow, idea, or output.',
    ],
  },
  {
    number: '11',
    title: 'Photo, Video, Audio, and Likeness Release',
    paragraphs: [
      'I understand that the Retreat and Activities may be photographed, filmed, livestreamed, or otherwise recorded. I irrevocably grant the Released Parties and their licensees the worldwide, perpetual, royalty-free, transferable, and sublicensable right to record, reproduce, edit, adapt, publish, display, perform, distribute, advertise, and otherwise use my name, image, likeness, appearance, voice, statements, and biographical information captured in connection with the Retreat (the "Media").',
      'The Media may be used alone or with other material, in any format or medium now known or later developed, including websites, social media, advertising, promotional campaigns, press materials, educational materials, presentations, recaps, and internal communications. The Media may be cropped, edited, combined, captioned, or otherwise modified, provided it is not used in a knowingly false, defamatory, or unlawful manner.',
    ],
  },
  {
    number: '12',
    title: 'No Approval or Compensation',
    paragraphs: [
      'I waive any right to inspect or approve the Media, finished materials, accompanying text, or the uses described above. I understand that I will not receive payment, royalties, or other compensation and that the Released Parties are not required to use the Media. To the extent permitted by law, I waive moral rights and release the Released Parties from claims based on privacy, publicity, misappropriation, alteration, or copyright arising from the authorized creation or use of the Media.',
    ],
  },
  {
    number: '13',
    title: 'Participant Contributions and Confidential Information',
    paragraphs: [
      "If I voluntarily provide a testimonial, interview, presentation, demonstration, or other content for recording, I represent that I have the right to provide it and grant the same usage rights described above. I will not display or disclose another person's confidential information, personal data, or protected intellectual property without permission.",
      "The organizers may capture group and working-session footage, but they will not intentionally publish clearly legible confidential business records, passwords, access credentials, private customer data, or proprietary source materials visible on a participant's screen without separate permission. I remain responsible for protecting such information during the Retreat.",
    ],
  },
  {
    number: '14',
    title: 'Ownership',
    paragraphs: [
      'The person or entity creating the Media will own the recording and resulting materials. Except for the rights expressly granted in this Agreement (including Section 15), I retain ownership of my pre-existing intellectual property and of tools, documents, code, and other work product I create solely for my own business and do not share with the room. This Agreement does not transfer ownership of my underlying business materials to the Released Parties.',
    ],
  },
  {
    number: '15',
    title: 'Collaboration, Shared Creations, and Confidential Business Practices',
    paragraphs: [
      'The Retreat is designed for open collaboration, not a proprietary free-for-all over every insight in the room. I agree that ideas, prompts, workflows, frameworks, demos, tools, builds, and other work product that I voluntarily share with the group or create together with others during Retreat sessions (the "Shared Creations") are intended to be freely discussed, reused, adapted, and shared among participants and organizers for learning and collaboration during and after the Retreat.',
      'I will not assert proprietary rights against other participants or organizers to prevent ordinary sharing or reuse of Shared Creations in that collaborative spirit, and I will not treat Shared Creations as exclusively "mine" in a way that blocks others from using what was openly built or discussed in the room.',
      'At the same time, I agree to keep confidential any non-public business practices, customer information, financials, trade secrets, passwords, credentials, private data, and other proprietary business information that participants or organizers disclose in confidence ("Confidential Business Information"). Confidential Business Information is not a Shared Creation. I will not copy, publish, or misuse Confidential Business Information outside the Retreat without the disclosing party\'s permission.',
      'Nothing in this section transfers ownership of my pre-existing intellectual property or of tools I create solely for my own business and do not share with the room. If I choose to share something with the group, I do so knowing it may be freely shared among participants as described above.',
    ],
  },
  {
    number: '16',
    title: 'Governing Law; Severability; Entire Agreement',
    paragraphs: [
      'Utah law governs this Agreement, without regard to conflict-of-law rules. Any dispute that is not resolved informally will be brought in a court of competent jurisdiction in Cache County, Utah. If a provision is found unenforceable, it will be modified to the minimum extent necessary or severed, and the remaining provisions will continue in effect. This Agreement is the entire agreement concerning its subject matter and binds me and my heirs, estate, representatives, successors, and assigns. Electronic and handwritten signatures are equally valid.',
    ],
  },
];

export const WAIVER_ACKNOWLEDGMENT =
  'I HAVE READ THIS ENTIRE AGREEMENT, UNDERSTAND IT, AND SIGN IT VOLUNTARILY. I UNDERSTAND THAT I AM GIVING UP SUBSTANTIAL LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE FOR ORDINARY NEGLIGENCE, AND THAT THIS AGREEMENT INCLUDES A BROAD PHOTO, VIDEO, VOICE, AND CONTENT RELEASE PLUS A COLLABORATION AND CONFIDENTIALITY COMMITMENT. I HAVE HAD THE OPPORTUNITY TO ASK QUESTIONS AND TO CONSULT INDEPENDENT LEGAL COUNSEL BEFORE SIGNING.';
