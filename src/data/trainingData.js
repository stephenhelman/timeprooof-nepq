export const trainingData = {
  sections: [
    {
      id: "roof-foundations",
      title: "Roof Anatomy & Foundations",
      trainingDay: 1,
      salesStep: null,
      pages: "2-20",
      tags: ["foundations", "anatomy", "ventilation", "tools"],
      summary: [
        "Roof anatomy: ridges, valleys, vents, flashings",
        "Ventilation systems: Turtle Box, Gable, Turbine, Attic Fan, Ridge, Soffit",
        "Tools: Pitch Factor App, Cricket, Pipe Boot, 2nd Story Siding",
        "Structural components and terminology",
      ],
      flashcards: [
        {
          id: "fc-001",
          question: "What are the main structural roofing components?",
          ordered: false,
          answer: [
            {
              term: "Ridges",
              detail: "Connecting seam at the very top (highest point)",
            },
            {
              term: "Vents",
              detail: "Allow moist, hot air to escape from attic",
            },
            { term: "Valleys", detail: "Where two roof planes meet" },
            {
              term: "Flashings",
              detail: "Prevent water penetration at vulnerable points",
            },
            {
              term: "Eaves",
              detail: "Lower edge of the roof that overhangs the wall",
            },
            { term: "Rake", detail: "Sloped edge of a gable roof" },
          ],
        },
        {
          id: "fc-002",
          question: "What ventilation systems should you know?",
          ordered: false,
          answer: [
            {
              term: "Turtle Box Vent (750/Box Vent)",
              detail: "Square static vent on roof surface — no moving parts",
            },
            {
              term: "Gable Vent",
              detail: "Vent at the gable end of the house",
            },
            {
              term: "Turbine Vent",
              detail: "Spinning vent that uses wind to pull air out",
            },
            { term: "Attic Fan", detail: "Powered ventilation system" },
            {
              term: "Ridge Vent",
              detail: "Runs along the peak/ridge of the roof",
            },
            { term: "Soffit Vent", detail: "Intake vents under the eaves" },
          ],
        },
        {
          id: "fc-003",
          question: "What is a Ridge?",
          ordered: false,
          answer: [
            {
              detail:
                "The connecting seam at the very top of the roof. It's the highest point — everything else slopes down from here. Ridges are overlayed with hip shingles to keep water out.",
            },
          ],
        },
        {
          id: "fc-004",
          question: "What is a Valley?",
          ordered: false,
          answer: [
            {
              detail:
                "Where two roof planes meet and form an internal angle. Valleys channel water runoff and are vulnerable to leaks if not properly sealed.",
            },
          ],
        },
        {
          id: "fc-005",
          question: "What is Flashing?",
          ordered: false,
          answer: [
            {
              term: "Definition",
              detail:
                "Thin pieces of impervious material (usually metal) installed to prevent water penetration at vulnerable joints and angles.",
            },
            { term: "Chimney flashing", detail: "Around chimneys" },
            { term: "Wall step flashing", detail: "Where roof meets walls" },
            { term: "Eave flashing", detail: "Along the eaves" },
            { term: "Pipe boots", detail: "Around vent pipes" },
          ],
        },
        {
          id: "fc-006",
          question: "What is a Turtle Box Vent?",
          ordered: false,
          answer: [
            {
              detail:
                "Also known as a 750 or Box Vent. A square static ventilation unit installed on the roof surface to allow hot air to escape from the attic. No moving parts.",
            },
          ],
        },
        {
          id: "fc-007",
          question: "What is a Cricket?",
          ordered: false,
          answer: [
            {
              detail:
                "A small ridge structure designed to divert water around obstacles on the roof (like chimneys). Prevents water and debris from collecting behind the obstacle.",
            },
          ],
        },
        {
          id: "fc-008",
          question: "What is a 4 in 1 Pipe Boot?",
          ordered: false,
          answer: [
            {
              detail:
                "A flexible rubber or plastic boot that fits around vent pipes protruding through the roof. The '4 in 1' design fits multiple pipe sizes. Prevents water from entering around the pipe. This is TIMEPROOFUSA's standard equipment.",
            },
          ],
        },
      ],
      scripts: [],
    },

    {
      id: "initiate",
      title: "Initiate & Investigate",
      trainingDay: 2,
      salesStep: 1,
      pages: "20-50",
      tags: ["sales", "warmup", "door", "inspection", "needs-assessment"],
      summary: [
        "5-Step Sales System overview",
        "ABC's of Selling: Attunement, Buoyancy, Clarity",
        "4 Stages of Learning",
        "Warm-up process — 6 things never to discuss",
        "Needs assessment questions",
        "8-point inspection checklist",
      ],
      flashcards: [
        {
          id: "fc-009",
          question: "What are the 5 Steps of the Sales System?",
          ordered: true,
          answer: [
            {
              term: "Initiate/Investigate",
              detail: "Entry, Warmup, Needs Assessment, Inspection",
            },
            { term: "Educate", detail: "The Company Story" },
            {
              term: "Differentiate",
              detail: "Product & Installation (WOW Factor)",
            },
            {
              term: "Motivate",
              detail: "Pre-Close, Closing Sequence, Post-Close",
            },
            { term: "Saturate", detail: "Replace The Lead (Referrals)" },
          ],
        },
        {
          id: "fc-010",
          question: "What are the ABC's of Selling?",
          ordered: false,
          answer: [
            {
              term: "A = Attunement",
              detail:
                "Being aware and responsive to customer emotions. Fostering connection and security. Recognizing and mirroring their state so they feel understood.",
            },
            {
              term: "B = Buoyancy",
              detail:
                "Staying positive, light, and happy. Your mood is light and you 'float' above challenges.",
            },
            {
              term: "C = Clarity",
              detail:
                "Understanding customer wants/needs. 'Seek first to understand rather than be understood.' Create a plan, develop a strategy, have a clear goal.",
            },
          ],
        },
        {
          id: "fc-011",
          question: "What are the 5 Reasons People Say No?",
          ordered: true,
          answer: [
            { term: "No trust", detail: "Addressed in warm-up" },
            { term: "No need", detail: "Addressed in measure/inspection" },
            {
              term: "No interest",
              detail: "Addressed through prospect involvement",
            },
            {
              term: "No hurry",
              detail: "Addressed by showing value of benefits",
            },
            { term: "No money", detail: "Addressed by showing value/payback" },
          ],
        },
        {
          id: "fc-012",
          question: "What are the 4 Stages of Learning?",
          ordered: true,
          answer: [
            {
              term: "Unconsciously Incompetent",
              detail: "Bad and don't know it",
            },
            { term: "Consciously Incompetent", detail: "Bad but aware" },
            { term: "Consciously Competent", detail: "Good with effort" },
            {
              term: "Unconsciously Competent",
              detail: "Effortless mastery — YOUR GOAL",
            },
          ],
        },
        {
          id: "fc-013",
          question: "What are the 4 Things That Must Happen for a Sale?",
          ordered: true,
          answer: [
            { detail: "You're credible & trustworthy" },
            { detail: "Value > Price" },
            {
              detail:
                "Your product satisfies their need better than any other option",
            },
            { detail: "Easy to buy" },
          ],
        },
        {
          id: "fc-014",
          question: "What are the 3 Questions Every Customer Must Answer?",
          ordered: true,
          answer: [
            { detail: "Why buy from YOU?" },
            { detail: "Why buy NOW?" },
            { detail: "Why pay MORE?" },
          ],
        },
        {
          id: "fc-015",
          question: "What are the 8 things to inspect?",
          ordered: true,
          answer: [
            {
              term: "Shingle Condition",
              detail: "Aging, granule loss, blistering, cracking, missing",
            },
            {
              term: "Valleys",
              detail: "Wear, improper sealing, water channeling",
            },
            { term: "Flashings", detail: "Chimney, wall, eave, pipe boots" },
            {
              term: "Ventilation",
              detail: "Intake, exhaust, blocked vents, balance",
            },
            {
              term: "Ridge Lines",
              detail: "Cap deterioration, sealant issues",
            },
            {
              term: "Gutter & Fascia",
              detail: "Overflow, water backing, rot/decay",
            },
            {
              term: "Attic Condition",
              detail: "Decking, moisture, mold, insulation",
            },
            {
              term: "Structural Indicators",
              detail: "Soft decking, sagging, nail pops",
            },
          ],
        },
        {
          id: "fc-016",
          question: "What should you look for in Shingle Condition?",
          ordered: false,
          answer: [
            { term: "Aging", detail: "Overall wear and deterioration" },
            {
              term: "Granule loss",
              detail: "Exposed asphalt (looks like bare spots)",
            },
            { term: "Blistering", detail: "Bubbles in the shingle" },
            { term: "Cracking", detail: "Splits or breaks in shingles" },
            { term: "Missing shingles", detail: "Blown off by wind" },
          ],
        },
        {
          id: "fc-017",
          question: "What should you check in the Attic?",
          ordered: false,
          answer: [
            { term: "Decking thickness", detail: "Is it adequate?" },
            { term: "Moisture stains", detail: "Signs of leaks" },
            { term: "Mold indicators", detail: "Dark spots, musty smell" },
            {
              term: "Ventilation imbalance",
              detail: "Is there proper airflow?",
            },
            {
              term: "Insulation depth (R-values)",
              detail: "Adequate insulation levels",
            },
            { term: "Bathroom venting", detail: "Properly vented outside" },
            { term: "Chimney condition", detail: "If present" },
          ],
        },
        {
          id: "fc-018",
          question: "What is PMA and when is it required?",
          ordered: false,
          answer: [
            {
              term: "PMA = Positive Mental Attitude",
              detail: "Required for EVERY lead",
            },
            {
              term: "Foundation",
              detail: "Based on preparation and confidence",
            },
            {
              term: "Key principle",
              detail:
                "All successful sales calls start with PMA founded on preparation and confidence",
            },
          ],
        },
        {
          id: "fc-019",
          question: "How do you use proxemics when approaching the door?",
          ordered: false,
          answer: [
            {
              detail:
                "After knocking/ringing, step AWAY from the door and down a step. Respects personal space, makes customer comfortable, builds immediate trust. Don't stand too close when door opens.",
            },
          ],
        },
        {
          id: "fc-020",
          question: "What items do you carry to the door?",
          ordered: false,
          answer: [
            {
              term: "Computer bag + clipboard ONLY",
              detail:
                "Do NOT bring the sample bag to the door. Bring it in only after you're inside and seated. Keeps the approach professional and non-threatening.",
            },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-door",
          title: "Door Script",
          alert: null,
          content: [
            { type: "cue", text: "When customer opens door" },
            {
              type: "dialogue",
              lines: [
                `"Mr./Mrs.___? Hi, Mr./Mrs.___. My name is [First Last] with TIME PROOF."`,
                `"Thank you for inviting us into your home! Do you mind if I come in?"`,
              ],
            },
            { type: "cue", text: "Immediately after entering" },
            {
              type: "dialogue",
              lines: [
                `"I am going to put these booties on to protect your floors."`,
              ],
            },
            { type: "cue", text: "Then" },
            {
              type: "dialogue",
              lines: [
                "Bring sample bag (roof in the bag)",
                "Find place to sit — kitchen / dining / living room table",
              ],
            },
          ],
        },
        {
          id: "sc-warmup-never",
          title: "6 Things NEVER to Discuss During Warm-Up",
          alert: null,
          content: [
            {
              type: "note",
              text: "Customer is in control. Listen more than talk — two ears, one mouth.",
            },
            { type: "cue", text: "The Obvious" },
            { type: "dialogue", lines: ["Religion", "Politics", "Sex"] },
            { type: "cue", text: "The Not So Obvious" },
            {
              type: "dialogue",
              lines: ["Your company", "Your product", "Yourself"],
            },
          ],
        },
        {
          id: "sc-warmup-critical",
          title: "3 Critical Questions to Confirm",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                "1. Are they the homeowner?",
                "2. Are all decision makers home?",
                "3. What's most important to them when making a decision?",
              ],
            },
          ],
        },
        {
          id: "sc-needs-assessment",
          title: "Needs Assessment — Must-Ask Questions",
          alert: null,
          content: [
            { type: "cue", text: "Q1: How did you hear about us?" },
            {
              type: "dialogue",
              lines: [
                "What about the advertisement caught your attention?",
                "Do you remember what platform or website?",
                "What stood out most?",
              ],
            },
            { type: "cue", text: "Q2: What type of research have you done?" },
            {
              type: "dialogue",
              lines: [
                "Where did you look for information?",
                "How much time did you spend researching?",
                "What did you learn?",
              ],
            },
            {
              type: "cue",
              text: "Q3: What do you know about the roofing industry?",
            },
            {
              type: "dialogue",
              lines: [
                "What parts of the roofing process are you most familiar with?",
                "Have you or someone you know worked with a roofer before?",
              ],
            },
          ],
        },
        {
          id: "sc-layering",
          title: "Layering Questions",
          alert: null,
          content: [
            {
              type: "note",
              text: "Use these to go deeper after any answer — don't move on too fast.",
            },
            {
              type: "dialogue",
              lines: [
                `"Can you tell me more about that?"`,
                `"Is that important to you?"`,
                `"Why is that important to you?"`,
                `"How long has that been the case?"`,
                `"Would you be interested in resolving that issue?"`,
                `"How would it feel to not have that problem anymore?"`,
              ],
            },
          ],
        },
        {
          id: "sc-inspection-outside",
          title: "Outside Inspection Transition",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Let's go take a walk around the house and you can show me where you're having the biggest issues."`,
                `"What I am going to do is accurately measure your roof. Have you heard of Eagle View?"`,
                `"It uses satellite technology to measure the roof and give you a to-the-penny estimate down to the foot."`,
                `"Measuring the eaves, rakes, hips, ridges, and valleys."`,
                `"I want to be mindful of your specific concerns as well as assessing all components necessary to offer you a permanent roof system."`,
              ],
            },
          ],
        },
        {
          id: "sc-inspection-attic",
          title: "Attic Inspection Transition",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Mr. and Mrs.___, do you have access to your attic? Great, let's take a look."`,
                `"What we are looking for up here is the true health and condition of your decking."`,
                `"We want to make sure you have proper ventilation for the health & safety of your roof and your family."`,
                `"We want to look for the general condition as well as any areas of concern with the decking such as mold/mildew and any dry rot."`,
                `"I want to see if your bathrooms are venting properly and take a look at your chimney if you have one."`,
                `"Are there any areas you want me to focus on?"`,
              ],
            },
          ],
        },
        {
          id: "sc-inspection-reveal",
          title: "The Reveal",
          alert: null,
          content: [
            {
              type: "cue",
              text: "Show the homeowner photos taken during inspection",
            },
            {
              type: "dialogue",
              lines: [
                "Point out specific issues and explain consequences.",
                "Let the photos do the talking — silence is okay here.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "educate",
      title: "Company Story",
      trainingDay: 3,
      salesStep: 2,
      pages: "50-74",
      tags: ["company-story", "slides", "educate", "pns", "fair-pricing"],
      summary: [
        "12-slide company presentation",
        "PNS (Post Negative Suggestion) technique",
        "Fair Pricing Policy",
        "Company Tie Down — memorize both versions",
      ],
      flashcards: [
        {
          id: "fc-021",
          question: "What are the 12 slides of the Company Story?",
          ordered: true,
          answer: [
            { term: "Slide 1", detail: "Your Home (valuable investment)" },
            {
              term: "Slide 2",
              detail: "Did You Know? (BBB & SBA industry stats)",
            },
            { term: "Slide 3", detail: "How Do You Choose The Right Roof?" },
            {
              term: "Slide 4",
              detail: "Who Is On Your Roof? (Licensed/Insured)",
            },
            {
              term: "Slide 5",
              detail: "Your Options (Do Nothing, Repairs, Replacement)",
            },
            {
              term: "Slide 6",
              detail: "Early Payment Presentation (Cost vs. Value)",
            },
            {
              term: "Slide 7",
              detail: "20+ Years of Expertise (MRS Partnership)",
            },
            { term: "Slide 8", detail: "CEO & Ty Pennington (Visual)" },
            { term: "Slide 9", detail: "Our Business Revolves Around You" },
            { term: "Slide 10", detail: "We Are Licensed and Insured" },
            { term: "Slide 11", detail: "Fair Pricing Policy" },
            { term: "Slide 12", detail: "Company Tie Down" },
          ],
        },
        {
          id: "fc-022",
          question: "What is PNS and how is it used?",
          ordered: false,
          answer: [
            {
              term: "PNS = Post Negative Suggestion",
              detail:
                "Present negative industry info, then position your company as the solution.",
            },
            {
              term: "How used",
              detail:
                "Show contractor failure rates → 'so you see why today's consumer doesn't get three estimates anymore... we all want a company we can trust, a product we can depend on, and a fair and affordable price.'",
            },
          ],
        },
        {
          id: "fc-023",
          question: "What is the Fair Pricing Policy (Slide 11)?",
          ordered: false,
          answer: [
            {
              detail:
                "Your investment is based on the PRODUCT you select, not on how well you negotiate.",
            },
            {
              detail:
                "All customers pay the SAME PRICE, for the SAME MATERIALS, purchased on the SAME DAY.",
            },
            {
              detail:
                "Any additional discounts or savings will be offered to ALL CUSTOMERS.",
            },
          ],
        },
        {
          id: "fc-024",
          question: "What are the BBB and SBA statistics used in Slide 2?",
          ordered: false,
          answer: [
            {
              term: "BBB Stat",
              detail:
                "#1 complaint to the BBB is against home improvement/remodeling contractors — 10.7 MILLION annual complaints",
            },
            {
              term: "SBA Stat",
              detail: "96% of contractors fail within the first 2 years",
            },
            {
              term: "Key phrase",
              detail: "Good work isn't cheap, cheap work isn't good",
            },
            {
              term: "Consumer stat",
              detail:
                "80% of consumers take the lowest bid and report major problems",
            },
          ],
        },
        {
          id: "fc-025",
          question: "What is MRS and why is it mentioned?",
          ordered: false,
          answer: [
            {
              term: "MRS = Master Roofing Solutions",
              detail: "TIMEPROOFUSA's sister company",
            },
            {
              term: "Experience",
              detail:
                "20+ years industry experience in new roofing construction",
            },
            {
              term: "Purpose",
              detail: "Shows expertise, resources, and stability",
            },
            { term: "Mentioned in", detail: "Slide 7 of Company Story" },
          ],
        },
        {
          id: "fc-026",
          question: "Who is TWG Global?",
          ordered: false,
          answer: [
            {
              detail:
                "Private equity parent company that owns TIMEPROOFUSA/Medallion Roofing LLC. Provides financial backing, zero debt, fully funded. Built by Vince Nardo (Reborn Cabinets founder). Shows company stability and resources.",
            },
          ],
        },
        {
          id: "fc-027",
          question: "How do you calculate commission using NISI?",
          ordered: false,
          answer: [
            {
              term: "NISI = Net Installed Sales Income",
              detail:
                "The final sales amount after all discounts and adjustments",
            },
            {
              term: "Formula",
              detail:
                "Sale amount − approved discounts = NISI × commission rate",
            },
            {
              term: "Example",
              detail:
                "$35,000 − $2,000 = $33,000 NISI × 12% (Platinum) = $3,960 commission",
            },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-slide-1",
          title: "Slide 1 — Your Home",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Is it fair to say that, like most families, your home is one of your most valuable investments?"`,
              ],
            },
            { type: "cue", text: "Then" },
            {
              type: "dialogue",
              lines: [
                `"We asked all our clients the same question and the responses they give are..."`,
                `A reputable and dependable company they can trust`,
                `A decent return on their investment`,
                `Products that meet their wants and needs`,
                `Expert installation and a written warranty`,
                `And the bottom line is... it has to be affordable`,
              ],
            },
            { type: "cue", text: "Follow Up" },
            {
              type: "dialogue",
              lines: [`"Have you done any home improvement projects before?"`],
            },
            { type: "cue", text: "IF YES" },
            {
              type: "dialogue",
              lines: [
                `Went well: "Excellent! What did you like most? What would you change?"`,
                `Went poorly: "Oh no! What happened? What would you change?"`,
              ],
            },
            { type: "cue", text: "IF NO" },
            {
              type: "dialogue",
              lines: [
                `"What do you know about the industry?"`,
                `"Do you think most people have a good or bad experience?"`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-2",
          title: "Slide 2 — Did You Know?",
          alert: null,
          content: [
            { type: "cue", text: "Transition" },
            {
              type: "dialogue",
              lines: [
                `"Typically, this industry's reputation isn't very good."`,
              ],
            },
            {
              type: "dialogue",
              lines: [
                `"The #1 complaint to the BBB is against home improvement/remodeling contractors."`,
                `"With over 10.7 million complaints filed annually."`,
                `"The reality — good work isn't cheap and cheap work isn't good."`,
                `"80% of consumers take the lowest bid and report major problems."`,
                `"The SBA reports 96% of contractors fail within the first 2 years."`,
              ],
            },
          ],
        },
        {
          id: "sc-pns",
          title: "PNS — Post Negative Suggestion",
          alert: {
            text: "Memorize this word for word — it's on the final test.",
          },
          content: [
            { type: "cue", text: "Deliver after Slide 2 stats" },
            {
              type: "dialogue",
              lines: [
                `"...so, you see, Mr./Mrs.___,"`,
                `"Why today's average educated consumer doesn't go and get three estimates anymore."`,
                `"It's because they realize it doesn't guarantee their satisfaction in the end."`,
                `"When all is said and done, we all want the same three things..."`,
                `"A company we can trust, a product we can depend on, and a fair and affordable price."`,
                `"Wouldn't you agree?"`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-3",
          title: "Slide 3 — How Do You Choose The Right Roof?",
          alert: null,
          content: [
            { type: "cue", text: "It comes down to 2 questions" },
            {
              type: "dialogue",
              lines: [`"Who you choose..."`, `"The product they use..."`],
            },
          ],
        },
        {
          id: "sc-slide-4",
          title: "Slide 4 — Who Is On Your Roof?",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Are they licensed? Believe it or not, most contractors aren't licensed."`,
                `"Are they insured? If they aren't insured, the homeowner is responsible."`,
                `"Are they properly inspecting the deck?"`,
                `"Are they using proper safety precautions?"`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-5",
          title: "Slide 5 — Your Options",
          alert: null,
          content: [
            { type: "cue", text: "Do Nothing" },
            {
              type: "dialogue",
              lines: [
                "May seem cheapest but often most costly long-term",
                "Out-of-date styles are undesirable",
                "Leaks don't fix themselves — will only get worse",
              ],
            },
            { type: "cue", text: "Temporary Repairs" },
            {
              type: "dialogue",
              lines: [
                "Patch leaks, mismatched shingles",
                "Not a permanent solution — will only get worse",
              ],
            },
            { type: "cue", text: "Roof Replacement — BEST Option" },
            {
              type: "dialogue",
              lines: [
                "Durable, long-lasting solution",
                "Peace of mind",
                "May increase home value",
              ],
            },
          ],
        },
        {
          id: "sc-slide-6",
          title: "Slide 6 — Cost vs. Value",
          alert: {
            text: "This slide should be QUICK — talk about it first before showing the cost vs. value slide to set it up.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"Are you familiar with cost vs. value?"`,
                `"It's like the Kelly Blue Book of the home improvement industry."`,
                `"The report is based on average companies with average warranties and average installers and average roofing products."`,
                `"This is how much a project like this might cost you in your area."`,
                `"It's not your project. I'll design it a couple of ways."`,
                `"What if I could get you a better product at around $300–$400, would that be something you'd be interested in?"`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-7",
          title: "Slide 7 — 20+ Years of Expertise",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"We partner with our sister company MRS (Master Roofing Solutions)."`,
                `"20 years of industry experience in new roofing construction."`,
                `"What we found was a need for a TRUSTED company in re-roofing."`,
                `"A company that homeowners felt were reliable, dependable — a company they could trust."`,
                `"With a good ROI, expert installation and warranties, and most importantly — affordable."`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-8",
          title: "Slide 8 — CEO & Ty Pennington",
          alert: null,
          content: [
            { type: "cue", text: "Visual slide — play video messages" },
            {
              type: "dialogue",
              lines: [
                `"Here is a message from our CEO, Vince Nardo."`,
                `"Here is a message from our celebrity spokesperson, Ty Pennington."`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-9",
          title: "Slide 9 — Our Business Revolves Around You",
          alert: null,
          content: [
            { type: "cue", text: "Customer Referral" },
            {
              type: "dialogue",
              lines: [`"Referrals are a testament to exceptional service."`],
            },
            { type: "cue", text: "Customer Concierge" },
            {
              type: "dialogue",
              lines: [`"Dedicated to providing an unforgettable experience."`],
            },
            { type: "cue", text: "Award Winning Customer Service" },
            { type: "dialogue", lines: [`"Second to none."`] },
            { type: "cue", text: "Certified Installers" },
            { type: "dialogue", lines: [`"Highly skilled professionals."`] },
            { type: "cue", text: "Superior Products" },
            { type: "dialogue", lines: [`"Unmatched durability and appeal."`] },
          ],
        },
        {
          id: "sc-slide-10",
          title: "Slide 10 — We Are Licensed and Insured",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Here is our licensing."`,
                `"Here is our insurance."`,
                `"You get the peace of mind knowing that if anything were to happen, you will not be liable."`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-11",
          title: "Slide 11 — Fair Pricing Policy",
          alert: null,
          content: [
            { type: "cue", text: "What this means to you" },
            {
              type: "dialogue",
              lines: [
                `"Your investment is based on the PRODUCT you select, not on how well you negotiate."`,
                `"All customers pay the SAME PRICE, for the SAME MATERIALS, purchased on the SAME DAY."`,
                `"Any additional discounts or savings will be offered to ALL CUSTOMERS."`,
              ],
            },
            { type: "cue", text: "Example" },
            {
              type: "dialogue",
              lines: [
                `"When you refer your neighbor and a company charges them $1,000 less for the same project — how would that make you feel?"`,
                `"Let's say they paid $1,000 more — safe to say you still wouldn't be happy, right?"`,
                `"That will NEVER happen with TIMEPROOF due to this policy."`,
                `"Our customers love this concept."`,
                `"Besides, they didn't hire me for my negotiating ability — if they did, the company wouldn't make any money."`,
              ],
            },
          ],
        },
        {
          id: "sc-slide-12",
          title: "Slide 12 — Company Tie Down",
          alert: { text: "TIE DOWN THE COMPANY STORY — do not skip this." },
          content: [
            {
              type: "dialogue",
              lines: [
                `"Can you appreciate why over 40,000 families, just like yours, have chosen and trusted TIME PROOF to handle their home improvement needs?"`,
                `"With over 64 locations across the US."`,
              ],
            },
            { type: "cue", text: "Choose ONE tie down" },
            {
              type: "dialogue",
              lines: [
                `"Do you feel you can TRUST TIME PROOF to handle this project for you?"`,
                `"Is TIME PROOF a company you feel COMFORTABLE with handling this project for you?"`,
              ],
            },
            { type: "cue", text: "Then transition to Flip Book" },
            {
              type: "dialogue",
              lines: [
                "Go back to the table where you left your 'Roof in a Bag.'",
                "Set the Flip Book down to walk them through different parts of the roof.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "differentiate",
      title: "Product Presentation",
      trainingDay: 4,
      salesStep: 3,
      pages: "74-98",
      tags: [
        "product",
        "differentiate",
        "timelock",
        "surenail",
        "3ps",
        "wow-factor",
      ],
      summary: [
        "8 product components (OSB → Hip & Ridge)",
        "TIME LOCK System: Defend, Seal, Breathe, Comfort",
        "SureNail Technology — 6 benefits, 130-MPH wind warranty",
        "Algae Resistance / Streakguard (NOT in CO/AZ)",
        "The 3 P's: Perimeter, Penetration, Problem Areas",
      ],
      flashcards: [
        {
          id: "fc-028",
          question: "What are the TIME LOCK System's 4 components?",
          ordered: false,
          answer: [
            {
              term: "1. DEFEND",
              detail:
                "Helps protect against daily exposure to the elements. Three kinds of shingles work together for specialized protection on each part of the roof.",
            },
            {
              term: "2. SEAL",
              detail:
                "Creates a barrier against ice and water infiltration. Powerful two-part protection keeps moisture away from the roof deck.",
            },
            {
              term: "3. BREATHE",
              detail:
                "Creates balanced airflow in the attic. Proper ventilation helps manage temperature and moisture under the roof.",
            },
            {
              term: "4. COMFORT",
              detail:
                "Adds comfort and energy performance. Brings attic insulation up to current recommendations for a more comfortable home year-round.",
            },
          ],
        },
        {
          id: "fc-029",
          question: "What are the 6 benefits of SureNail Technology?",
          ordered: true,
          answer: [
            {
              term: "Excellent Adhesive Power",
              detail: "Keeps shingle layers laminated",
            },
            { term: "Outstanding Grip", detail: "130-MPH wind warranty" },
            {
              term: "Breakthrough Design",
              detail: "First and only reinforced nailing zone in the industry",
            },
            {
              term: '"No Guess" Wide Nailing Zone',
              detail:
                "Embedded nailing strips create a strong, durable fastener zone",
            },
            {
              term: "Triple Layer Protection",
              detail:
                "Fabric overlays two shingle layers in the common bond area",
            },
            {
              term: "Double the Common Bond",
              detail: "200% wider common bond area than standard shingles",
            },
          ],
        },
        {
          id: "fc-030",
          question: "What are The 3 P's and their measurements?",
          ordered: false,
          answer: [
            {
              term: "1. PERIMETER PROTECTION",
              detail:
                "TIMEPROOFUSA: 6 ft on eaves, 3 ft on rakes. CODE MINIMUM: 3 ft on eaves, 1.5 ft on rakes. Result: DOUBLE the protection.",
            },
            {
              term: "2. PENETRATION POINTS",
              detail:
                "Ice & Water Shield around ALL roof penetrations. Triple protection: Ice & Water Shield + Flashing + Sealant.",
            },
            {
              term: "3. PROBLEM AREAS",
              detail:
                "Proper flashing at valleys and roof-to-wall areas. Prevents rot, mold, interior water damage. Poor flashing = #1 cause of roof failures.",
            },
          ],
        },
        {
          id: "fc-031",
          question:
            "TruDefinition Duration vs. Oakridge — what's the difference?",
          ordered: false,
          answer: [
            {
              term: "TruDefinition Duration",
              detail:
                "Premium shingle with SureNail Technology, 130-MPH wind warranty, enhanced color options. Higher tier in packages.",
            },
            {
              term: "Oakridge",
              detail:
                "Entry to mid-tier shingle. Good quality, reliable, more affordable option.",
            },
            {
              detail:
                "Both are Owens Corning products (laminated/architectural shingles).",
            },
          ],
        },
        {
          id: "fc-032",
          question: "What are the two synthetic underlayment options?",
          ordered: false,
          answer: [
            {
              term: "DeckDefense",
              detail: "Synthetic underlayment — durable and lightweight",
            },
            {
              term: "ProArmor",
              detail:
                "Synthetic underlayment — water-shedding barrier under shingles",
            },
            { detail: "Both are superior to traditional felt paper." },
          ],
        },
        {
          id: "fc-033",
          question: "What is Streakguard and where does it NOT apply?",
          ordered: false,
          answer: [
            {
              term: "Streakguard",
              detail:
                "Owens Corning's algae-resistant technology — 25-year warranty against algae growth (black streaks)",
            },
            { term: "NOT available in", detail: "Colorado and Arizona" },
            {
              term: "Technology",
              detail:
                "MINERAL base (UV protection) + COPPER ions (algae inhibitor) + CERAMIC outer layer (controlled release)",
            },
          ],
        },
        {
          id: "fc-034",
          question: "What ridge vent product does TIMEPROOFUSA use?",
          ordered: false,
          answer: [
            {
              term: "VentSure 4-Foot Strip",
              detail:
                "Heat & Moisture Ridge Vents. Works with soffit vents (intake) for a balanced 50/50 ventilation system.",
            },
          ],
        },
        {
          id: "fc-035",
          question: "What is the 'common bond' and why does SureNail's matter?",
          ordered: false,
          answer: [
            {
              term: "Common Bond",
              detail:
                "Area where two shingle layers overlap and fasten together",
            },
            { term: "Standard shingles", detail: "Normal-width common bond" },
            {
              term: "SureNail",
              detail:
                "200% WIDER common bond area = significantly stronger attachment and better wind resistance",
            },
          ],
        },
        {
          id: "fc-036",
          question:
            "What causes ice dams and how does TIMEPROOFUSA prevent them?",
          ordered: false,
          answer: [
            {
              term: "Cause",
              detail:
                "Ridge of ice forms at roof edge, prevents melting snow from draining, water backs up under shingles.",
            },
            {
              term: "TIMEPROOFUSA Prevention",
              detail:
                "6 ft ice & water shield on eaves (vs. 3 ft code minimum), proper ventilation system. Part of 'Perimeter Protection' in The 3 P's.",
            },
          ],
        },
        {
          id: "fc-037",
          question: "What sealant works with SureNail Technology?",
          ordered: false,
          answer: [
            {
              term: "Tru-Bond sealant",
              detail:
                "Together with SureNail Technology, provides exceptional wind resistance and the 130-MPH wind warranty.",
            },
          ],
        },
        // ── Our Installers — 3-part differentiator ──────────────────
        {
          id: "fc-diff-001",
          question: "What are the 3 attributes of TIMEPROOF installers?",
          ordered: true,
          answer: [
            {
              term: "Insured",
              detail:
                "TIMEPROOF carries proper insurance so the homeowner is never liable for anything that happens on their roof. Every roofer is harnessed in — OSHA-compliant, no shortcuts.",
            },
            {
              term: "Factory Trained",
              detail:
                "Installers are trained by Owens Corning directly — not the TIMEPROOF way, the Owens Corning way. They follow a process that comes straight from the factory that designed the system. The only way to guarantee a long-standing roof with a long-standing warranty.",
            },
            {
              term: "Detail Oriented",
              detail:
                "Project managers and crews pay attention to every detail to maximize the life of the roof. Property is left exactly as it was when they arrived — or better.",
            },
          ],
        },

        // ── Owens Corning Preferred Contractor ──────────────────────
        {
          id: "fc-diff-002",
          question:
            "What is Owens Corning Preferred Contractor status and why does it matter to the homeowner?",
          ordered: false,
          answer: [
            {
              term: "What it means",
              detail:
                "TIMEPROOF earned Preferred Contractor status by consistently meeting Owens Corning's installation standards across every project.",
            },
            {
              term: "How it's verified",
              detail:
                "Owens Corning performs unannounced secret shops at TIMEPROOF installations to verify that the job is being done exactly the way they intended — no exceptions.",
            },
            {
              term: "What the homeowner gets",
              detail:
                "Access to products and warranties that are not available through a local home improvement store. You cannot buy this level of protection off the shelf — it only comes through a contractor who has earned the designation.",
            },
            {
              term: "The bottom line",
              detail:
                "When Owens Corning backs your installer, the manufacturer and the contractor are both standing behind your roof. That is a level of protection most homeowners never get.",
            },
          ],
        },

        // ── Factory Trained vs. Self Trained ────────────────────────
        {
          id: "fc-diff-003",
          question:
            "Why does factory-trained installation matter vs. a contractor who trains their own crew?",
          ordered: false,
          answer: [
            {
              term: "Self-trained crews",
              detail:
                "Follow a process the contractor invented. No external accountability. Warranty claims can be denied if installation doesn't meet manufacturer specs.",
            },
            {
              term: "Factory-trained crews",
              detail:
                "Follow the process Owens Corning designed. Installation meets manufacturer specs by definition. Warranties are fully backed because the work was done the way the factory intended.",
            },
            {
              term: "The key phrase",
              detail:
                "'They don't follow a TIMEPROOF process — they follow an Owens Corning process.' That one line separates us from every other roofer the homeowner has talked to.",
            },
          ],
        },

        // ── Warranties — Platinum anchor ────────────────────────────
        {
          id: "fc-diff-004",
          question:
            "What are the Platinum package warranty terms and how do you sell them?",
          ordered: false,
          answer: [
            {
              term: "50-year product warranty",
              detail: "Owens Corning stands behind the materials for 50 years.",
            },
            {
              term: "Limited lifetime product warranty",
              detail: "Manufacturer's lifetime coverage on the product itself.",
            },
            {
              term: "10-year installation warranty",
              detail:
                "TIMEPROOF stands behind the crew's work for 10 years. If anything goes wrong with the installation, they come back and make it right — no questions asked.",
            },
            {
              term: "The selling point",
              detail:
                "Our crews are trained to the highest standard — but they are human. The 10-year install warranty is how TIMEPROOF proves they stand behind their people. Most roofing companies offer nothing like this. Only available on Platinum.",
            },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-product-intro",
          title: "Transition to Flip Book",
          alert: {
            text: "This is the WOW factor of your presentation — energy up, slow down, let them feel everything.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"When we surveyed our customers, they told us they didn't really know what they were getting with their new roof."`,
                `"Let me show you what Timeproof includes..."`,
                `"For prep, we will have you cover up or remove any valuables in the attic."`,
                `"We will cover up any areas outside that need to be covered to protect your rose bushes or any other areas that need protection."`,
              ],
            },
          ],
        },
        {
          id: "sc-osb",
          title: "1. OSB (Decking)",
          alert: null,
          content: [
            {
              type: "cue",
              text: "PUT THE OSB IN THE CUSTOMER'S HAND — LET THEM FEEL IT",
            },
            {
              type: "dialogue",
              lines: [
                `"First, we start off by removing all the shingles, down to the OSB."`,
                `"We will inspect the decking and repair or replace any areas that need to be replaced."`,
              ],
            },
          ],
        },
        {
          id: "sc-ice-water",
          title: "2. Ice & Water Barrier / Deck Protection",
          alert: null,
          content: [
            {
              type: "cue",
              text: "HAND THE SAMPLE TO THE CUSTOMER TO HOLD AND FEEL",
            },
            {
              type: "dialogue",
              lines: [
                `"Ice and Water and Felt paper like underlayment to protect the sheathing from water."`,
                `"It protects the valleys and eaves and diverts water away from penetration points on the roof."`,
              ],
            },
          ],
        },
        {
          id: "sc-intake-vent",
          title: "3. Intake Ventilation",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [`"Roof needs proper ventilation: 50% Intake."`],
            },
          ],
        },
        {
          id: "sc-underlayment",
          title: "4. Underlayment",
          alert: null,
          content: [
            {
              type: "cue",
              text: "SHOW CUSTOMER DIFFERENCE BETWEEN TIMEPROOF AND STANDARD FELT UNDERLAYMENT",
            },
            {
              type: "dialogue",
              lines: [
                `"Provides a water-shedding barrier under shingles to guard against wind-driven rain."`,
                "DeckDefense",
                "ProArmor",
              ],
            },
          ],
        },
        {
          id: "sc-starter",
          title: "5. Starter Shingle",
          alert: null,
          content: [
            {
              type: "cue",
              text: "HAND THE SAMPLE TO THE CUSTOMER TO HOLD AND FEEL",
            },
            {
              type: "dialogue",
              lines: [
                `"Ensures a straight edge and effective seal along the eaves and rake — areas that are vulnerable to high winds."`,
              ],
            },
          ],
        },
        {
          id: "sc-shingles",
          title: "6. Shingles",
          alert: null,
          content: [
            {
              type: "cue",
              text: "HAND THE SAMPLE TO THE CUSTOMER TO HOLD AND FEEL",
            },
            {
              type: "dialogue",
              lines: [
                `"Provide protection and curb appeal in a wider array of colors and styles."`,
                "TruDefinition Duration",
                "TruDefinition Duration Designer",
                "Oakridge",
              ],
            },
          ],
        },
        {
          id: "sc-exhaust-vent",
          title: "7. Exhaust Ventilation",
          alert: null,
          content: [
            {
              type: "cue",
              text: "HAND THE SAMPLE TO THE CUSTOMER TO HOLD AND FEEL",
            },
            {
              type: "dialogue",
              lines: [
                `"Help protect the interior components of the roofing system from heat and moisture damage."`,
                "VentSure 4-Foot Strip Heat & Moisture Ridge Vents",
              ],
            },
          ],
        },
        {
          id: "sc-hip-ridge",
          title: "8. Hip & Ridge Shingle",
          alert: null,
          content: [
            {
              type: "cue",
              text: "HAND THE SAMPLE TO THE CUSTOMER TO HOLD AND FEEL",
            },
            {
              type: "dialogue",
              lines: [
                `"Extra protection and stylish dimension along the hips and ridges."`,
                `"Designed to match and complement Owens Corning Shingles."`,
                "ProEdge Hip & Ridge",
              ],
            },
          ],
        },
        {
          id: "sc-timelock",
          title: "TIME LOCK Roofing System",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"What we do here at TIMEPROOF to separate ourselves from the rest of the market is our own proprietary roofing system called TIME LOCK."`,
                `"The TIME LOCK system ensures total protection."`,
                `"Sealing for moisture, defending elements, and breathing in hot and cold weather for perfect comfort in your home."`,
              ],
            },
            { type: "cue", text: "1. DEFEND" },
            {
              type: "dialogue",
              lines: [
                `"Helps protect against daily exposure to the elements."`,
              ],
            },
            { type: "cue", text: "2. SEAL" },
            {
              type: "dialogue",
              lines: [
                `"Creating a barrier against ice and water infiltration."`,
              ],
            },
            { type: "cue", text: "3. BREATHE" },
            {
              type: "dialogue",
              lines: [`"Creates a balanced airflow in the attic."`],
            },
            { type: "cue", text: "4. COMFORT" },
            {
              type: "dialogue",
              lines: [`"Adds comfort and energy performance."`],
            },
          ],
        },
        {
          id: "sc-surenail",
          title: "SureNail Technology",
          alert: null,
          content: [
            {
              type: "note",
              text: "Only available on Owens Corning Duration Series Shingles.",
            },
            { type: "cue", text: "Excellent Adhesive Power" },
            {
              type: "dialogue",
              lines: [`"Helps keep the shingle layers laminated."`],
            },
            { type: "cue", text: "Outstanding Grip" },
            {
              type: "dialogue",
              lines: [`"130-MPH wind warranty with Tru-Bond sealant."`],
            },
            { type: "cue", text: "Breakthrough Design" },
            {
              type: "dialogue",
              lines: [
                `"First and only reinforced nailing zone in the industry."`,
              ],
            },
            { type: "cue", text: '"No Guess" Wide Nailing Zone' },
            {
              type: "dialogue",
              lines: [
                `"Embedded nailing strips create a strong, durable fastener zone."`,
              ],
            },
            { type: "cue", text: "Triple Layer Protection" },
            {
              type: "dialogue",
              lines: [
                `"Fabric overlays two shingle layers in the common bond area."`,
              ],
            },
            { type: "cue", text: "Double the Common Bond" },
            {
              type: "dialogue",
              lines: [`"200% wider common bond area than standard shingles."`],
            },
          ],
        },
        {
          id: "sc-algae",
          title: "Algae Resistance (Streakguard)",
          alert: null,
          content: [
            { type: "note", text: "Does NOT apply in Colorado and Arizona." },
            {
              type: "dialogue",
              lines: [
                `"Algae growth can ruin the exterior appearance of your home."`,
                `"Help keep your roof looking like new with Streakguard Algae Resistant Protection."`,
              ],
            },
            { type: "cue", text: "25-Year Algae Resistance Limited Warranty" },
            {
              type: "dialogue",
              lines: [
                "MINERAL base — protects from UV radiation",
                "COPPER ions — release to inhibit algae growth",
                "CERAMIC outer layer — allows copper ions to work over time",
              ],
            },
          ],
        },
        {
          id: "sc-weather",
          title: "Weather Script",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Mr./Mrs.___ as you can see with the extreme heat in [location], it can get pretty hot if you don't have the right roof with the right products and installed correctly."`,
              ],
            },
          ],
        },
        {
          id: "sc-3ps",
          title: "The 3 P's",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"The 3 P's explain what we do differently to separate ourselves and give the homeowner peace of mind that their home will be protected."`,
              ],
            },
            { type: "cue", text: "1. PERIMETER PROTECTION" },
            {
              type: "dialogue",
              lines: [
                `"Increasing ice and water shield coverage to 6 feet on eaves and 3 feet on rakes provides superior protection against any ice dams and wind-driven rain."`,
                `"Compared to the standard/code 3 feet on eaves and 1½ feet on rakes."`,
              ],
            },
            { type: "cue", text: "2. PENETRATION POINTS" },
            {
              type: "dialogue",
              lines: [
                `"Adding Ice and Water Shield around ALL roof penetrations adds a secondary layer of defense against water damage at all critical entry points."`,
              ],
            },
            { type: "cue", text: "3. PROBLEM AREAS" },
            {
              type: "dialogue",
              lines: [
                `"Proper Flashing is essential for your new roofing system."`,
                `"It provides a watertight seal at all vulnerable areas, such as valleys and roof-to-wall areas."`,
                `"This prevents water penetration that could lead to rot, mold, and other damage."`,
              ],
            },
          ],
        },
        {
          id: "sc-our-installers",
          title: "Our Installers",
          alert: null,
          content: [
            {
              type: "cue",
              text: "INSURED",
            },
            {
              type: "dialogue",
              lines: [
                `"We carry the proper insurance to ensure you and your property are never liable for any mistakes that could happen on your roof."`,
                `"Every roofer is harnessed in — OSHA-compliant safety protocols, no shortcuts."`,
              ],
            },
            {
              type: "cue",
              text: "FACTORY TRAINED",
            },
            {
              type: "dialogue",
              lines: [
                `"Our crews are not trained the TIMEPROOF way — they are trained the Owens Corning way."`,
                `"Owens Corning trains our installers directly to make sure every installation meets their standards, their process, their way."`,
                `"This is the only way to guarantee a long-standing roof with a long-standing warranty."`,
              ],
            },
            {
              type: "cue",
              text: "DETAIL ORIENTED",
            },
            {
              type: "dialogue",
              lines: [
                `"Our project managers and crews pay attention to every detail so you get the most life out of your roof."`,
                `"We make sure your property looks exactly the same as when we arrived on site."`,
              ],
            },
          ],
        },

        // ── 16. Preferred Contractor + Owens Corning Secret Shop ────
        {
          id: "sc-preferred-contractor",
          title: "Preferred Contractor",
          alert: {
            text: "This flows naturally from Our Installers — do not treat it as a separate topic. It is the payoff to the factory-trained story.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"Because our installers follow the Owens Corning process so precisely, Owens Corning actually does secret shops at our installations."`,
                `"They send someone out — unannounced — to verify that we are doing the job exactly the way they intended."`,
              ],
            },
            {
              type: "cue",
              text: "The payoff",
            },
            {
              type: "dialogue",
              lines: [
                `"We did such a great job consistently meeting their standards that we became an Owens Corning Preferred Contractor."`,
                `"That status gives us access to products and warranties that are simply not available if you walk into a local home improvement store and shop."`,
                `"You cannot get this level of protection off the shelf — it only comes through a contractor who has earned that designation."`,
              ],
            },
          ],
        },

        // ── 17. Warranties ───────────────────────────────────────────
        {
          id: "sc-warranties",
          title: "Warranties",
          alert: {
            text: "Push Platinum. The 10-year install warranty is the closer — it is what separates Platinum from everything else on the market.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"TIMEPROOF offers one of the best warranty packages in the industry — and it comes down to the package you choose."`,
              ],
            },
            {
              type: "cue",
              text: "Platinum Package — the full protection",
            },
            {
              type: "dialogue",
              lines: [
                `"The Platinum package gives you a 50-year product warranty, a limited lifetime product warranty, and a 10-year installation warranty."`,
                `"Our crews are trained to the highest standard — but they are human."`,
                `"We stand behind their work. If anything goes wrong with the installation in the first 10 years, we come back and make it right. No questions asked."`,
                `"That 10-year install warranty is not something you will find from most roofing companies — and it is only available on Platinum."`,
              ],
            },
            {
              type: "note",
              text: "Elite and Essential warranty details — to be added. Stick with Platinum until further notice.",
            },
          ],
        },

        // ── 18. What to Expect ───────────────────────────────────────
        {
          id: "sc-what-to-expect",
          title: "What to Expect",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                `"Let me walk you through exactly what happens from the moment we schedule your project to the day we wrap up."`,
              ],
            },
            {
              type: "cue",
              text: "Before Installation Day",
            },
            {
              type: "dialogue",
              lines: [
                `"A trailer will be delivered to your home prior to or with the installers on the first day."`,
                `"Shingles may arrive a few days before or day-of — either way, we will coordinate with you."`,
                `"Just let us know about any pets and gate access so we can plan accordingly."`,
              ],
            },
            {
              type: "cue",
              text: "During Installation",
            },
            {
              type: "dialogue",
              lines: [
                `"We recommend removing any valuables from exterior walls — there is vibration involved and we want to protect everything."`,
                `"Gates will be kept closed and pets secured if needed."`,
              ],
            },
            {
              type: "cue",
              text: "Final Day",
            },
            {
              type: "dialogue",
              lines: [
                `"Depending on the size of your roof and weather, the project may run into a second day — that is completely normal."`,
                `"On the final day, your lead installer or project manager will do a full walkthrough with you to make sure you are satisfied with every aspect of the project."`,
                `"Final payment is collected at that walkthrough, and the trailer is removed during cleanup."`,
              ],
            },
          ],
        },

        // ── 19. Respect for Property (Your Home is Our Home) ────────
        {
          id: "sc-respect-property",
          title: "Respect for Your Property",
          alert: {
            text: "This is the final differentiator before the pre-close. Most roofing companies say nothing about this. Let it land.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"At TIMEPROOF we understand that this is not just a job site — it is your home."`,
                `"This is why we take every precaution to ensure a safe, clean, and well-maintained outcome."`,
              ],
            },
            {
              type: "cue",
              text: "SAFE",
            },
            {
              type: "dialogue",
              lines: [
                `"Every roofer is harnessed into your roof — no exceptions."`,
                `"OSHA-compliant safety protocols across every single project."`,
              ],
            },
            {
              type: "cue",
              text: "CLEAN",
            },
            {
              type: "dialogue",
              lines: [
                `"We use extra long tarps to catch debris during the strip."`,
                `"ABC — Always Be Cleaning. Someone is always picking up on the ground."`,
                `"A magnetic rake is passed over the entire property to catch any loose nails that escaped the tarp."`,
              ],
            },
            {
              type: "cue",
              text: "WELL-MAINTAINED",
            },
            {
              type: "dialogue",
              lines: [
                `"The goal is simple — we leave your property exactly the way we found it."`,
                `"Actually, cleaner than when we started."`,
              ],
            },
            {
              type: "cue",
              text: "Bridge to pre-close",
            },
            {
              type: "dialogue",
              lines: [
                `"So between our products, our installation process, our warranties, and the way we treat your home — I want to ask you something before we look at numbers..."`,
              ],
            },
          ],
        },
      ],
    },

    {
      id: "motivate",
      title: "Motivate — Close & Discounts",
      trainingDay: null,
      salesStep: 4,
      pages: null,
      tags: [
        "closing",
        "motivate",
        "discounts",
        "fsp",
        "financing",
        "pre-close",
      ],
      summary: [
        "Pre-close question — gate objections before presenting price",
        "Package presentation — show all packages at retail payment first",
        "3-discount sequence: National 5% → Local 10% → FSP 10%",
        "FSP = Financing Savings Promotion — last and final discount",
        "Credit card/check exception — conditionally offer FSP with asks",
      ],
      flashcards: [
        {
          id: "fc-mot-001",
          question:
            "What are the 3 discounts and what order do you apply them?",
          ordered: true,
          answer: [
            {
              term: "1. National Promotion — 5%",
              detail:
                "Reference how they heard about you and the promotion they saw. Apply first, then show updated payments on all packages.",
            },
            {
              term: "2. Local Promotion — 10%",
              detail:
                "After national discount is shown, offer the local promotion. Frame it as an opportunity to upgrade to the next package for roughly the same monthly payment.",
            },
            {
              term: "3. FSP — Financing Savings Promotion — 10%",
              detail:
                "Last and final discount. Tied to using company financing. Like major retailers (Best Buy, Home Depot), 10% off for using their financing. Unsecured, no pre-payment penalties, first bill after project completion.",
            },
          ],
        },
        {
          id: "fc-mot-002",
          question: "What is the FSP and how do you frame it?",
          ordered: false,
          answer: [
            {
              term: "FSP = Financing Savings Promotion",
              detail:
                "An additional 10% off for using company financing — the last and final discount available.",
            },
            {
              term: "Frame it like a major retailer",
              detail:
                "Best Buy, Home Depot, Lowes, Target — all offer 10% for using their financing. Customer is already conditioned for this. Use that to your advantage.",
            },
            {
              term: "Key selling points",
              detail:
                "Unsecured financing. No pre-payment penalties. First bill not due until project is completed — customer satisfaction guaranteed before they pay.",
            },
          ],
        },
        {
          id: "fc-mot-003",
          question: "How do you present packages at the close?",
          ordered: true,
          answer: [
            {
              detail:
                "Home screen populates all packages with monthly payment reflected at the bottom of each package.",
            },
            {
              detail:
                "Stay on retail payment amounts first — cover ALL packages at retail before any discounts.",
            },
            {
              detail:
                "Opening line: 'The reason we show payment amounts is because almost ALL our customers take advantage of financing — we can customize it to fit almost any budget.'",
            },
            {
              detail:
                "Only after walking all retail amounts do you begin applying discounts one at a time.",
            },
          ],
        },
        {
          id: "fc-mot-004",
          question:
            "Customer wants to pay by check or credit card — do they still get FSP?",
          ordered: false,
          answer: [
            {
              term: "Yes — conditionally",
              detail:
                "You can make the exception IF they are moving forward while you are there and getting the project going.",
            },
            {
              term: "Script",
              detail:
                "'I'm really not supposed to do that, but if you're going to move forward while I'm here, I'll go ahead and make the exception. In return, I'd ask for a couple of things from you.'",
            },
            {
              term: "The two asks",
              detail:
                "1. A quick online 5-star review about your experience together today. 2. A referral — a friend or family member who may need a new roof. They receive $500 if that referral sells after the job completes.",
            },
          ],
        },
        {
          id: "fc-mot-005",
          question: "What is the pre-close question and why does it matter?",
          ordered: false,
          answer: [
            {
              term: "The question",
              detail:
                "'Other than affordability, are there any other questions or concerns that would keep you from choosing TIMEPROOF to replace your roof?'",
            },
            {
              term: "Why it matters",
              detail:
                "Gates hidden objections before you present price. If they say no — the only remaining barrier is price, which you're about to handle with the discount sequence. If they surface another objection, address it now before money is on the table.",
            },
          ],
        },
      ],
      scripts: [
        // ── Card 1: Pre-Close ──────────────────────────────────
        {
          id: "sc-pre-close",
          title: "Pre-Close",
          alert: {
            text: "Ask this before touching price. It gates hidden objections so the only remaining issue is affordability.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                `"Other than affordability, are there any other questions or concerns that would keep you from choosing TIMEPROOF to replace your roof?"`,
              ],
            },
            {
              type: "cue",
              text: "If they surface an objection — handle it now",
            },
            {
              type: "dialogue",
              lines: [
                `"Remember when we discussed cost versus value and I explained how that report is based on average companies with average warranties, average installers, and average roofing products?"`,
                `"After everything we've discussed, you would agree that everything we do at TIMEPROOF is above average."`,
                `"But what if I could get you our roof for what they say you should expect to pay for that average roof?"`,
              ],
            },
          ],
        },

        // ── Card 2: Package Presentation & Discount Sequence ──
        {
          id: "sc-discount-sequence",
          title: "Package Presentation & Discount Sequence",
          alert: {
            text: "Always walk ALL packages at retail first. Never lead with discounts. Let the payment amounts land before you start reducing them.",
          },
          content: [
            {
              type: "cue",
              text: "Show all packages at retail — no discounts yet",
            },
            {
              type: "dialogue",
              lines: [
                `"The reason that we show payment amounts on our packages is because almost ALL of our customers take advantage of our financing options."`,
                `"We can customize them to fit almost any customer's budget."`,
              ],
            },
            {
              type: "note",
              text: "Cover payment amounts on Platinum and Elite at retail. Get a read on their comfort level with monthly payments before applying any discounts.",
            },
            {
              type: "cue",
              text: "Apply Discount 1 — National Promotion (5%)",
            },
            {
              type: "dialogue",
              lines: [
                `"Remember in the beginning when I asked how you heard about us and you said it was ___ and that you saw the promotion?"`,
                `"Let's look at what that National Promotion does to your project."`,
              ],
            },
            {
              type: "note",
              text: "Apply the 5% discount. Return to the packages page. Cover payment amounts on Platinum and Elite again and highlight the difference in monthly payment.",
            },
            {
              type: "cue",
              text: "Apply Discount 2 — Local Promotion (10%)",
            },
            {
              type: "dialogue",
              lines: [
                `"What if I could offer you a local promotion we have going that would probably allow you to upgrade from one package to the next one up — and pay close to the same monthly payment?"`,
              ],
            },
            {
              type: "note",
              text: "Apply the 10% local promotion. Cover payment amounts on Platinum and Elite again. Let the upgrade opportunity sink in visually.",
            },
          ],
        },

        // ── Card 3: FSP — Financing Savings Promotion ─────────
        {
          id: "sc-fsp",
          title: "FSP — Financing Savings Promotion",
          alert: {
            text: "This is the last and final discount. Do not offer it early. It must feel like the final unlock — just like a major retailer's store card discount.",
          },
          content: [
            {
              type: "cue",
              text: "Frame it before you name it",
            },
            {
              type: "dialogue",
              lines: [
                `"I know that we have talked about payments and pricing a lot — but that is what separates TIMEPROOF from the 'other guys'."`,
                `"If you decide to move forward with us and use our financing, I can take an additional 10% off your project."`,
                `"It's called our Financing Savings Promotion."`,
                `"Just like major retailers — Best Buy, Home Depot, Lowes, Target — we offer our customers an additional discount for utilizing our financing."`,
              ],
            },
            {
              type: "cue",
              text: "Address the financing terms",
            },
            {
              type: "dialogue",
              lines: [
                `"It's unsecured financing and there are no pre-payment penalties."`,
                `"You also don't receive the first bill until the project is completed — making sure that you are 100% satisfied before you pay a single dollar."`,
              ],
            },
          ],
        },

        // ── Card 4: Credit Card / Check Exception ─────────────
        {
          id: "sc-cc-exception",
          title: "Credit Card / Check Exception",
          alert: {
            text: "Only use this if they want to move forward but won't use financing. This is NOT the default — it is a conditional exception that requires two asks in return. They will be getting the discount regardless, but make the customer feel like they have to earn it",
          },
          content: [
            {
              type: "note",
              text: "Customer wants to pay by credit card or check. You CAN still offer FSP — but only if they are committing right now, while you are there. They will be getting the discount regardless, but make the customer feel like they have to earn it",
            },
            {
              type: "cue",
              text: "The exception script",
            },
            {
              type: "dialogue",
              lines: [
                `"I'm really not supposed to do that — but if you're going to move forward while I'm here and get the project going, I will go ahead and make the exception."`,
                `"In return, I would ask for a couple of things from you."`,
              ],
            },
            {
              type: "cue",
              text: "Ask 1 — 5-star review",
            },
            {
              type: "dialogue",
              lines: [
                `"Can I get a quick online 5-star review from you about our experience together today?"`,
              ],
            },
            {
              type: "cue",
              text: "Ask 2 — referral",
            },
            {
              type: "dialogue",
              lines: [
                `"Between now and the completion of the project, do you think I could possibly get a referral from you — a friend or family member that may need a new roof as well?"`,
                `"You'll also receive $500 if we sell that referral a new roof after your job completes."`,
              ],
            },
          ],
        },
      ],
    },

    {
      id: "installation",
      title: "Installation Process & Packages",
      trainingDay: 5,
      salesStep: null,
      pages: "98-107",
      tags: ["installation", "packages", "pricing", "abc"],
      summary: [
        "What to expect: Before, During, Final Day",
        "4 Packages: Platinum 12%, Elite/Essential/Storm 10%",
        "Property protection standards — ABC: Always Be Cleaning",
        "Like-for-like replacement policy",
      ],
      flashcards: [
        {
          id: "fc-038",
          question: "What are the 4 package tiers and commission rates?",
          ordered: true,
          answer: [
            { term: "Platinum", detail: "Premium package — 12% commission" },
            { term: "Elite", detail: "Mid-tier — 10% commission" },
            { term: "Essential", detail: "Entry-level — 10% commission" },
            { term: "Storm", detail: "Insurance replacement — 10% commission" },
          ],
        },
        {
          id: "fc-039",
          question: "What are the 3 phases of the installation process?",
          ordered: false,
          answer: [
            {
              term: "Before Installation Day",
              detail:
                "Trailer delivered prior or with installers. Shingles may arrive days before or day-of. Alert contractor about pets and gate access.",
            },
            {
              term: "During Installation",
              detail:
                "Remove valuables from exterior walls (vibration damage possible). Pets secured if needed. Gates left unlocked or contractor keeps them closed.",
            },
            {
              term: "Final Day",
              detail:
                "Project may extend beyond one day (weather). Lead installer/PM does final walkthrough for satisfaction. Collect final payment — trailer removed at cleanup.",
            },
          ],
        },
        {
          id: "fc-040",
          question: "What does ABC stand for on installation day?",
          ordered: false,
          answer: [
            {
              term: "ABC = Always Be Cleaning",
              detail:
                "Extra long tarps catch debris. Ground crew picks up constantly. Magnetic rake passed over entire property to catch loose nails. Goal: Leave property exactly the same — or cleaner — than when we arrived.",
            },
          ],
        },
        {
          id: "fc-041",
          question: "What happens during the Final Walkthrough?",
          ordered: true,
          answer: [
            { detail: "Lead installer/PM walks property with customer" },
            { detail: "Go over everything completed" },
            { detail: "Check cleanliness — everything in the dumpster" },
            { detail: "Collect final payment due" },
            { detail: "Trailer picked up at cleanup" },
          ],
        },
        {
          id: "fc-042",
          question: "What is the Like-for-Like Replacement Rule?",
          ordered: false,
          answer: [
            { detail: "We are in the business of replacing like-for-like." },
            {
              detail:
                "Unless they currently have skylights, we are NOT adding skylights in.",
            },
            { detail: "Replace what's there — same type, same configuration." },
            { detail: "Upgrades available for additional cost." },
            { detail: "No major structural changes." },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-like-for-like",
          title: "Like-for-Like Replacement Rule",
          alert: null,
          content: [
            {
              type: "note",
              text: "We are in the business of replacing like-for-like. Do not add or upgrade without customer approval and additional cost.",
            },
            {
              type: "dialogue",
              lines: [
                "Unless they currently have skylights, we are NOT adding skylights in",
                "Replace what's there — same type, same configuration",
                "Upgrades available for additional cost",
                "No major structural changes",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "servicetitan",
      title: "ServiceTitan Platform",
      trainingDay: 6,
      salesStep: null,
      pages: "107-120",
      tags: ["servicetitan", "platform", "workflow", "daily", "crm"],
      summary: [
        "Sign in via Entra ID/SSO — always use Go (LIVE) environment",
        "CRITICAL: Sync pricebook EVERY morning before any leads",
        "Workflow: Dispatch → Arrive → Forms → Estimate → Complete",
        "Send to Customer (email preferred — never 'sign in person' unless no email)",
        "Production notes: access, pets, gate codes, color preferences",
      ],
      flashcards: [
        {
          id: "fc-043",
          question:
            "What's the FIRST thing you must do in ServiceTitan every morning?",
          ordered: false,
          answer: [
            {
              term: "SYNC PRICEBOOK",
              detail:
                "Must be done BEFORE running any leads. Ensures latest pricing. Without sync = wrong pricing = lost deals. Non-negotiable daily task.",
            },
          ],
        },
        {
          id: "fc-044",
          question: "Which ServiceTitan environment should you use?",
          ordered: false,
          answer: [
            {
              term: "Go Environment = LIVE ✅",
              detail: "Always use this for all real work",
            },
            {
              term: "Next Environment = PRACTICE ❌",
              detail: "Never use this — wrong data, wrong pricing",
            },
            { detail: "Always verify you're in LIVE before working." },
          ],
        },
        {
          id: "fc-045",
          question:
            "What's the difference between Dispatch and Arrive in ServiceTitan?",
          ordered: false,
          answer: [
            {
              term: "Dispatch",
              detail:
                "Click when you LEAVE for the appointment — en route, time tracking starts",
            },
            {
              term: "Arrive",
              detail:
                "Click when you GET TO the appointment — on-site, triggers Roofing Scope of Work form",
            },
            {
              term: "Workflow",
              detail: "Dispatch → Arrive → Forms → Complete",
            },
          ],
        },
        {
          id: "fc-046",
          question: "What is the complete ServiceTitan workflow? (16 steps)",
          ordered: true,
          answer: [
            {
              term: "Sign In",
              detail: "Use Entra ID/SSO with company credentials",
            },
            {
              term: "Check Environment",
              detail: "Verify you're in LIVE/Go — never Practice",
            },
            {
              term: "Sync Pricebook ⚠️",
              detail: "CRITICAL — do first every morning before any leads",
            },
            {
              term: "Check EagleView",
              detail: "Review satellite measurements and roof dimensions",
            },
            {
              term: "View Job",
              detail: "Customer info, appointment time, address",
            },
            {
              term: "Dispatch",
              detail: "Click when you LEAVE — starts time tracking",
            },
            {
              term: "Arrive",
              detail: "Click when you GET THERE — triggers forms",
            },
            {
              term: "Roofing Scope of Work Form",
              detail: "Complete all required fields (red asterisk = required)",
            },
            {
              term: "Standard Equipment",
              detail:
                "4 in 1 Pipe Boot is standard — already approved and priced",
            },
            {
              term: "Verify Completion",
              detail: "Form must show 'Completed' status",
            },
            {
              term: "Sync Again",
              detail: "Sync before creating estimate — ensures latest pricing",
            },
            {
              term: "Select Package",
              detail: "Platinum/Elite/Essential/Storm — pricing auto-populates",
            },
            {
              term: "Send to Customer ⚠️",
              detail:
                "ALWAYS select 'Send to Customer' — never create email for customer",
            },
            {
              term: "Production Notes",
              detail:
                "Special requests, access issues, pet warnings, gate codes, colors",
            },
            {
              term: "Final Check",
              detail:
                "Both Scope of Work AND Estimate/Contract must show Completed ✓",
            },
            {
              term: "Close Appointment",
              detail: "Close first appointment to release next one",
            },
          ],
        },
        {
          id: "fc-047",
          question: "When creating an estimate, what must you always select?",
          ordered: false,
          answer: [
            {
              term: '"Send to Customer"',
              detail:
                "Sends copy via email. ONLY use 'Sign in person' if customer has NO email. Never create an email for the customer.",
            },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-st-daily-rule",
          title: "Critical Daily Rule — Sync Pricebook",
          alert: {
            text: "SYNC PRICEBOOK EVERY MORNING — first thing, before running any leads. Without sync = wrong pricing = lost deals. Takes 30 seconds. Non-negotiable.",
          },
          content: [
            { type: "cue", text: "Every single morning, no exceptions" },
            {
              type: "dialogue",
              lines: [
                "1. Wake up",
                "2. Log into ServiceTitan",
                "3. SYNC PRICEBOOK ← Do this before anything else",
              ],
            },
          ],
        },
        {
          id: "sc-st-workflow",
          title: "ServiceTitan Workflow — Key Rules",
          alert: null,
          content: [
            { type: "cue", text: "ENVIRONMENT" },
            {
              type: "dialogue",
              lines: [
                "Always use the Go (LIVE) environment",
                "NEVER the Next (Practice) environment",
              ],
            },
            { type: "cue", text: "DISPATCH" },
            {
              type: "dialogue",
              lines: [
                "Click when you LEAVE for appointment — starts time tracking",
              ],
            },
            { type: "cue", text: "ARRIVE" },
            {
              type: "dialogue",
              lines: [
                "Click when you GET THERE — triggers Roofing Scope of Work form",
              ],
            },
            { type: "cue", text: "FORMS" },
            {
              type: "dialogue",
              lines: [
                "Anything with a red asterisk (*) MUST be answered — form will not submit otherwise",
              ],
            },
            { type: "cue", text: "STANDARD EQUIPMENT" },
            {
              type: "dialogue",
              lines: [
                "4 in 1 Pipe Boot is our standard (already approved and priced)",
              ],
            },
            { type: "cue", text: "SEND TO CUSTOMER" },
            {
              type: "dialogue",
              lines: [
                "ALWAYS select 'Send to Customer'",
                "ONLY use 'Sign in person' if customer has NO email",
                "Do NOT create an email for the customer",
              ],
            },
            { type: "cue", text: "PRODUCTION NOTES" },
            {
              type: "dialogue",
              lines: [
                "Special requests, access issues, pet warnings, gate codes, color preferences",
              ],
            },
            { type: "cue", text: "FINAL CHECK" },
            {
              type: "dialogue",
              lines: [
                "Both Scope of Work AND Estimate/Contract must show Completed ✓",
              ],
            },
          ],
        },
        {
          id: "sc-st-mistakes",
          title: "Common Mistakes to Avoid",
          alert: null,
          content: [
            {
              type: "note",
              text: "These mistakes cost deals and cause rework — know them cold.",
            },
            {
              type: "dialogue",
              lines: [
                "Forgetting to sync pricebook (wrong pricing!)",
                "Working in Practice environment instead of Live",
                "Not clicking 'Send to Customer' (no copy for them)",
                "Skipping production notes (installers need that info)",
                "Not verifying both forms show 'Completed'",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "certification",
      title: "Final Review & Certification",
      trainingDay: 7,
      salesStep: null,
      pages: "120-128",
      tags: ["test", "certification", "review", "routines"],
      summary: [
        "Comprehensive test: 80%+ to pass, 2 attempts",
        "High-priority memorization list",
        "Test-taking strategy",
        "Daily routines for field work",
      ],
      flashcards: [
        {
          id: "fc-048",
          question: "What is the Day 7 final test format and passing score?",
          ordered: false,
          answer: [
            {
              term: "Format",
              detail:
                "Multiple choice, True/False, Fill in the blank, Scenario-based",
            },
            { term: "Passing Score", detail: "80%+ required to pass" },
            { term: "Attempts", detail: "Two attempts allowed" },
            {
              term: "Coverage",
              detail: "All 6 previous days of training material",
            },
          ],
        },
        {
          id: "fc-049",
          question:
            "What are the HIGH PRIORITY items to memorize for the final test?",
          ordered: true,
          answer: [
            { detail: "5-Step Sales System" },
            { detail: "ABC's of Selling" },
            { detail: "6 Things Never to Discuss" },
            { detail: "Door Script" },
            { detail: "3 Customer Questions" },
            { detail: "8-Point Inspection Checklist" },
            { detail: "Company Tie Down questions" },
            { detail: "PNS (word-for-word)" },
            { detail: "TIME LOCK 4 components" },
            { detail: "The 3 P's" },
          ],
        },
        {
          id: "fc-050",
          question: "What is OSHA-compliant safety at TIMEPROOFUSA?",
          ordered: false,
          answer: [
            { detail: "All roofers harnessed to roof" },
            { detail: "Proper safety equipment required" },
            { detail: "No shortcuts on safety" },
            {
              detail:
                "OSHA-compliant protocols — protects workers and homeowners from liability",
            },
          ],
        },
      ],
      scripts: [
        {
          id: "sc-daily-morning",
          title: "Every Morning Routine",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                "1. Wake up",
                "2. Log into ServiceTitan",
                "3. SYNC PRICEBOOK ← Non-negotiable",
                "4. Review today's leads",
                "5. Plan route",
                "6. Check traffic",
                "7. Leave early",
              ],
            },
          ],
        },
        {
          id: "sc-daily-appointment",
          title: "Every Appointment Routine",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                "1. Arrive 5–10 min early",
                "2. Check appearance in mirror",
                "3. Grab computer bag + clipboard only",
                "4. Smile!",
                "5. Execute the system",
              ],
            },
          ],
        },
        {
          id: "sc-daily-evening",
          title: "Every Evening Routine",
          alert: null,
          content: [
            {
              type: "dialogue",
              lines: [
                "1. Update CRM",
                "2. Send thank you texts",
                "3. Submit paperwork",
                "4. Review day's results",
                "5. Plan tomorrow",
              ],
            },
          ],
        },
        {
          id: "sc-test-coverage",
          title: "Final Test Coverage",
          alert: {
            text: "80%+ required to pass. Two attempts allowed. Know ALL of this.",
          },
          content: [
            {
              type: "dialogue",
              lines: [
                "Day 1: Roof Anatomy (ridges, vents, components)",
                "Day 2: Sales Methodology (5-Step System, ABC's, warm-up rules)",
                "Day 3: Company Story (all 12 slides, PNS, Fair Pricing)",
                "Day 4: Product Presentation (8 components, TIME LOCK, SureNail, 3 P's)",
                "Day 5: Installation Process, Packages",
                "Day 6: ServiceTitan Platform workflow",
                "Format: Multiple choice, True/False, Fill in blank, Scenario-based",
              ],
            },
          ],
        },
      ],
    },
  ],

  glossary: [
    {
      id: "g-001",
      term: "Asphalt Shingles",
      definition:
        "The most common type of roofing material, made of a fiberglass or organic mat coated with asphalt and topped with mineral granules. Available in architectural (dimensional) or 3-tab styles.",
    },
    {
      id: "g-002",
      term: "Attic Ventilation",
      definition:
        "The system that allows air to flow through the attic space, preventing moisture buildup, reducing heat, and extending roof life. Requires both intake (soffit) and exhaust (ridge, turbine) vents.",
    },
    {
      id: "g-003",
      term: "BBB (Better Business Bureau)",
      definition:
        "Nonprofit organization that rates businesses based on customer complaints. Mentioned in Slide 2: '#1 complaint to the BBB is against home improvement/remodeling contractors with 10.7 million annual complaints.' TIMEPROOFUSA maintains an A+ rating.",
    },
    {
      id: "g-004",
      term: "Common Bond",
      definition:
        "The area where two shingle layers overlap and are fastened together. Critical for shingle strength and wind resistance. SureNail Technology features a 200% wider common bond area than standard shingles.",
    },
    {
      id: "g-005",
      term: "Cricket (or Saddle)",
      definition:
        "A peaked structure built behind a chimney or other roof obstacle to divert water and prevent debris accumulation.",
    },
    {
      id: "g-006",
      term: "Deck (or Sheathing)",
      definition:
        "The wooden structural surface (typically plywood or OSB) installed over the rafters or trusses. The underlayment and shingles are installed on top of the deck.",
    },
    {
      id: "g-007",
      term: "DeckDefense",
      definition:
        "Brand name for a synthetic underlayment product used by TIMEPROOFUSA. Provides a protective barrier between sheathing and shingles, guarding against wind-driven rain. More durable and lightweight than traditional felt paper.",
    },
    {
      id: "g-008",
      term: "Dispatch (ServiceTitan)",
      definition:
        "Button/action in ServiceTitan that you click when leaving for an appointment. Notifies the system you're en route, starts time tracking. Part of the workflow: Dispatch → Arrive → Forms → Complete.",
    },
    {
      id: "g-009",
      term: "Drip Edge",
      definition:
        "Metal flashing installed along the eaves and rakes to direct water away from the fascia and into the gutters, preventing water damage to the underlying wood.",
    },
    {
      id: "g-010",
      term: "EagleView",
      definition:
        "Satellite measurement technology that provides accurate roof measurements and detailed reports without requiring the estimator to climb on the roof. Measures to the penny, down to the foot.",
    },
    {
      id: "g-011",
      term: "Eave",
      definition:
        "The lower edge of a roof that overhangs the wall. Water runs off the roof at the eaves into gutters.",
    },
    {
      id: "g-012",
      term: "Entra ID / SSO (Single Sign-On)",
      definition:
        "Microsoft's authentication system used to log into ServiceTitan. One set of credentials accesses multiple systems. Use your company-provided credentials — never create a separate login.",
    },
    {
      id: "g-013",
      term: "Fascia",
      definition:
        "The vertical board mounted at the edge of the roof along the eaves, where gutters are typically attached. Exposed to weather and visible from the ground.",
    },
    {
      id: "g-014",
      term: "Flashing",
      definition:
        "Thin pieces of impervious material (usually aluminum or galvanized steel) used to prevent water seepage at joints, valleys, and around roof penetrations.",
    },
    {
      id: "g-015",
      term: "Gable",
      definition:
        "The triangular portion of a wall between the edges of intersecting roof pitches. A gable roof has two sloping sides that meet at a ridge.",
    },
    {
      id: "g-016",
      term: "Granules",
      definition:
        "Ceramic-coated mineral particles that cover the surface of asphalt shingles. They protect against UV rays, provide color, and add fire resistance. Granule loss indicates aging.",
    },
    {
      id: "g-017",
      term: "Hip",
      definition:
        "The external angle formed where two sloping roof planes meet. A hip roof has slopes on all four sides.",
    },
    {
      id: "g-018",
      term: "Ice & Water Barrier (Ice & Water Shield)",
      definition:
        "A self-adhering waterproof membrane installed beneath shingles in vulnerable areas (eaves, valleys, penetrations) to prevent water infiltration from ice dams and wind-driven rain.",
    },
    {
      id: "g-019",
      term: "Ice Dam",
      definition:
        "Ridge of ice that forms at the edge of a roof and prevents melting snow from draining. Can cause water to back up under shingles. TIMEPROOFUSA uses 6 ft ice & water shield on eaves vs. the 3 ft code minimum.",
    },
    {
      id: "g-020",
      term: "Laminated Shingles",
      definition:
        "Shingles constructed with multiple layers bonded together. Provides dimensional appearance, better wind resistance, and longer lifespan than traditional 3-tab shingles. Also called 'architectural' or 'dimensional' shingles.",
    },
    {
      id: "g-021",
      term: "Mansard Roof",
      definition:
        "Roof style with two slopes on each side — the lower slope is steeper than the upper. Creates additional living space in the attic. Named after French architect François Mansart.",
    },
    {
      id: "g-022",
      term: "MRS (Master Roofing Solutions)",
      definition:
        "TIMEPROOFUSA's sister company. 20+ years of industry experience in new roofing construction. Mentioned in Slide 7 to demonstrate TIMEPROOFUSA's depth of experience.",
    },
    {
      id: "g-023",
      term: "NISI (Net Installed Sales Income)",
      definition:
        "The final sales amount after all discounts and adjustments, used to calculate sales commission at TIMEPROOFUSA.",
    },
    {
      id: "g-024",
      term: "Oakridge",
      definition:
        "Owens Corning shingle product line available through TIMEPROOFUSA. Entry-level to mid-tier option. A laminated (architectural) shingle with good quality and reliable performance.",
    },
    {
      id: "g-025",
      term: "OSB (Oriented Strand Board)",
      definition:
        "The wooden structural decking installed over rafters or trusses. Made from compressed wood strands bonded together. Also called 'sheathing.' The underlayment and shingles are installed on top.",
    },
    {
      id: "g-026",
      term: "OSHA (Occupational Safety and Health Administration)",
      definition:
        "Federal agency that sets and enforces workplace safety standards. TIMEPROOFUSA follows OSHA-compliant safety protocols — all roofers are harnessed, proper equipment is required, no safety shortcuts permitted.",
    },
    {
      id: "g-027",
      term: "Pitch",
      definition:
        "The slope or angle of a roof, expressed as the ratio of vertical rise to horizontal run (e.g., 4/12 means 4 inches of rise per 12 inches of run). Steeper pitches shed water faster.",
    },
    {
      id: "g-028",
      term: "PMA (Positive Mental Attitude)",
      definition:
        "Foundational mindset for successful sales calls. Required for every lead. 'All successful sales calls start with a Positive Mental Attitude founded on preparation and confidence.'",
    },
    {
      id: "g-029",
      term: "PNS (Post Negative Suggestion)",
      definition:
        "A sales technique where you present negative industry information, then position your company as the solution that avoids those problems. Used after Slide 2 stats. Must be memorized word-for-word.",
    },
    {
      id: "g-030",
      term: "ProArmor",
      definition:
        "Brand name for a synthetic underlayment product used by TIMEPROOFUSA. Water-shedding barrier installed under shingles to guard against wind-driven rain. More durable and lightweight than traditional felt paper.",
    },
    {
      id: "g-031",
      term: "ProEdge Hip & Ridge",
      definition:
        "Owens Corning's hip and ridge cap shingle product. Designed to match and complement their shingles. Provides extra protection and stylish dimension along hips and ridges.",
    },
    {
      id: "g-032",
      term: "Proxemics",
      definition:
        "The study of personal space and physical distance in communication. Applied during the door approach: step away from the door and down a step after knocking. Respects personal space and builds immediate trust.",
    },
    {
      id: "g-033",
      term: "Rake",
      definition:
        "The sloped edge of a gable roof, running from the eave to the ridge. Rake edges need proper flashing and drip edge.",
    },
    {
      id: "g-034",
      term: "Ridge",
      definition:
        "The highest point of the roof where two slopes meet at the top. Ridge vents are often installed here for attic ventilation.",
    },
    {
      id: "g-035",
      term: "Ridge Vent",
      definition:
        "A continuous exhaust vent installed along the entire ridge line, allowing hot air to escape from the attic. Works with soffit vents for optimal airflow.",
    },
    {
      id: "g-036",
      term: "R-Value",
      definition:
        "A measure of insulation's resistance to heat flow. Higher R-values indicate better insulating properties. Attic insulation should typically be R-30 to R-60 depending on climate.",
    },
    {
      id: "g-037",
      term: "SBA (Small Business Administration)",
      definition:
        "U.S. government agency supporting small businesses. Referenced in Slide 2: 'SBA reports 96% of contractors fail within the first 2 years' — used to show industry instability and position TIMEPROOFUSA as a stable choice.",
    },
    {
      id: "g-038",
      term: "ServiceTitan",
      definition:
        "Enterprise software platform used by TIMEPROOFUSA for CRM, scheduling, estimates, contracts, and job management. Critical: must sync pricebook daily before running leads. Always use the Go (LIVE) environment.",
    },
    {
      id: "g-039",
      term: "Sheathing",
      definition:
        "Another term for the roof deck or OSB. The structural surface that covers the rafters and provides the base for the roofing system.",
    },
    {
      id: "g-040",
      term: "Soffit",
      definition:
        "The underside of the eave overhang. Soffit vents provide intake airflow for attic ventilation, working with ridge or roof vents.",
    },
    {
      id: "g-041",
      term: "Spike & Ferral",
      definition:
        "Traditional gutter hanging system. Being phased out in favor of hidden hanger systems. TIMEPROOFUSA replaces like-for-like — if the customer has spike & ferral, we replace with spike & ferral.",
    },
    {
      id: "g-042",
      term: "Square (Roofing Square)",
      definition:
        "A unit of measurement for roofing materials equal to 100 square feet (10 ft × 10 ft). Roofs are measured and estimated in squares.",
    },
    {
      id: "g-043",
      term: "Streakguard (Algae Resistance)",
      definition:
        "Owens Corning's algae-resistant shingle technology. 25-year warranty against algae growth (black streaks). Uses copper granules to inhibit growth. NOTE: Not available in Colorado and Arizona.",
    },
    {
      id: "g-044",
      term: "SureNail Technology",
      definition:
        "Owens Corning's proprietary reinforced nailing technology, available exclusively on Duration Series shingles. First and only reinforced nailing zone in the industry. Provides 200% wider common bond area and 130-MPH wind warranty with Tru-Bond sealant.",
    },
    {
      id: "g-045",
      term: "TIME LOCK System",
      definition:
        "TIMEPROOFUSA's proprietary roofing system. Four components: DEFEND (shingle protection), SEAL (ice & water barrier), BREATHE (attic ventilation), COMFORT (insulation performance).",
    },
    {
      id: "g-046",
      term: "Tru-Bond Sealant",
      definition:
        "Owens Corning's advanced shingle sealant. Works with SureNail Technology to provide exceptional wind resistance. Part of the system that achieves the 130-MPH wind warranty on TruDefinition Duration shingles.",
    },
    {
      id: "g-047",
      term: "TruDefinition Duration",
      definition:
        "Owens Corning's premium shingle line available through TIMEPROOFUSA. Features SureNail Technology, enhanced wind resistance (130-MPH warranty), and TruDefinition color options. Available in standard and Designer versions.",
    },
    {
      id: "g-048",
      term: "Turbine Vent",
      definition:
        "A wind-powered ventilation unit with a spinning mechanism that draws hot air out of the attic. More effective than static vents when wind is present.",
    },
    {
      id: "g-049",
      term: "TWG Global",
      definition:
        "Private equity parent company that owns TIMEPROOFUSA/Medallion Roofing LLC. Provides financial backing, zero debt, and fully funded operations. Founded by Vince Nardo (Reborn Cabinets). Demonstrates financial stability and long-term commitment.",
    },
    {
      id: "g-050",
      term: "Underlayment",
      definition:
        "A water-resistant or waterproof barrier material (felt paper or synthetic) installed directly on the roof deck before shingles. Provides secondary protection against water infiltration.",
    },
    {
      id: "g-051",
      term: "Valley",
      definition:
        "The internal angle formed where two roof slopes meet. Valleys channel large volumes of water runoff and require extra waterproofing.",
    },
    {
      id: "g-052",
      term: "Vent Pipe (Plumbing Vent)",
      definition:
        "A pipe that extends through the roof to vent sewer gases and equalize pressure in the plumbing system. Requires a weatherproof boot seal.",
    },
    {
      id: "g-053",
      term: "VentSure",
      definition:
        "Owens Corning's ridge vent product line. 'VentSure 4-Foot Strip Heat & Moisture Ridge Vents' provide exhaust ventilation along the roof ridge. Works with soffit vents for balanced attic airflow (50% intake / 50% exhaust).",
    },
    {
      id: "g-054",
      term: "Wind Warranty",
      definition:
        "Manufacturer's guarantee that shingles will withstand specific wind speeds. SureNail Technology provides a 130-MPH wind warranty — achieved through the combination of SureNail Technology and Tru-Bond sealant on TruDefinition Duration shingles.",
    },
  ],
};

export const getSectionById = (id) =>
  trainingData.sections.find((s) => s.id === id);

export const getSectionsByDay = (day) =>
  trainingData.sections.filter((s) => s.trainingDay === day);

export const getSalesSections = () =>
  trainingData.sections
    .filter((s) => s.salesStep !== null)
    .sort((a, b) => a.salesStep - b.salesStep);

export const getAllFlashcards = () =>
  trainingData.sections.flatMap((s) =>
    s.flashcards.map((fc) => ({
      ...fc,
      sectionId: s.id,
      sectionTitle: s.title,
    })),
  );

export const getAllScripts = () =>
  trainingData.sections.flatMap((s) =>
    s.scripts.map((sc) => ({ ...sc, sectionId: s.id, sectionTitle: s.title })),
  );

export const getFlashcardsBySection = (sectionId) =>
  getSectionById(sectionId)?.flashcards ?? [];

export const getScriptsBySection = (sectionId) =>
  getSectionById(sectionId)?.scripts ?? [];

export const searchAll = (query) => {
  const q = query.toLowerCase();
  const results = [];

  trainingData.sections.forEach((section) => {
    section.flashcards.forEach((fc) => {
      if (
        fc.question.toLowerCase().includes(q) ||
        fc.answer.some(
          (a) =>
            (a.term ?? "").toLowerCase().includes(q) ||
            a.detail.toLowerCase().includes(q),
        )
      ) {
        results.push({
          type: "flashcard",
          sectionId: section.id,
          sectionTitle: section.title,
          item: fc,
        });
      }
    });

    section.scripts.forEach((sc) => {
      if (
        sc.title.toLowerCase().includes(q) ||
        sc.content.some(
          (block) =>
            (block.text ?? "").toLowerCase().includes(q) ||
            (block.lines ?? []).some((l) => l.toLowerCase().includes(q)),
        )
      ) {
        results.push({
          type: "script",
          sectionId: section.id,
          sectionTitle: section.title,
          item: sc,
        });
      }
    });
  });

  trainingData.glossary.forEach((g) => {
    if (
      g.term.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q)
    ) {
      results.push({ type: "glossary", item: g });
    }
  });

  return results;
};
