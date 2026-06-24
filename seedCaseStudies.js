const pool = require('./db');

const caseStudies = [
  {
    slug: "e-weld-shield",
    ref: "W/002",
    title: "Reducing Slag Adhesion and Maintenance Downtime in Laser & Plasma Cutting Operation",
    industry: "Industrial Fabrication Co.",
    category: "Fabrication",
    subindustry: "Railway Equipment Manufacturing",
    application: "Protective coating for laser / plasma / oxy-fuel cutting beds",
    product: "E-WELD SHIELD",
    problem: "Excessive slag adhesion on cutting beds caused frequent maintenance downtime and reduced cutting precision in laser and plasma operations.",
    solution: "Application of E-WELD SHIELD anti-spatter coating to protect cutting beds and minimize slag buildup, extending service life and improving cut quality.",
    results: ["Reduced slag adhesion by 80%", "Decreased maintenance downtime by 60%", "Extended cutting bed service life"],
    image: "/e-weld.webp",
    challenge: "The fabrication facility was experiencing excessive slag buildup on cutting beds, requiring frequent manual chiseling and grinding to remove accumulated deposits. This caused up to 6 hours of downtime per shift, reduced cutting precision due to uneven bed surfaces, and increased operational costs from premature bed replacement.",
    customerBackground: "A leading manufacturer of railway infrastructure and track maintenance equipment. The facility supports fabrication and assembly operations for heavy engineering equipment used in rail infrastructure projects.",
    customerBackgroundPoints: [
      "High-volume Oxy-fuel cutting of heavy steel plates",
      "Continuous production for downstream assembly operations",
      "Recurring cutting bed and slat maintenance for E-WELD SHIELD"
    ],
    businessChallengesDescription: "Frequent slag accumulation and slat wear resulted in:",
    businessChallenges: [
      "Slag buildup on cutting slats causing uneven part seating",
      "Frequent slat replacements in continuous-running machines",
      "Increased manual chipping and scraping of cutting tables",
      "Higher downtime due to cleaning and slat changeovers",
      "Impact on cut accuracy and downstream fabrication and welding quality"
    ],
    businessChallengesQuote: "Excessive slag accumulation on cutting bed required frequent manual cleaning of slats, reducing operational efficiency.",
    operationalSnapshot: [
      { value: "50%", description: "reduction in cutting bed cleaning cycles, decreasing from 52 to 26 cleanings per year" },
      { value: "75%", description: "reduction in bed replacement frequency, lowering replacements from 4 to 1 cycle annually" },
      { value: "41%", description: "reduction in total downtime, reducing downtime from 291 hrs to 170 hrs per year" }
    ],
    costSnapshot: [
      { value: "12%", description: "reduction in total annual operational cost, generating ~₹1.37 lakh net annual savings" },
      { value: "₹10/kg", description: "production cost per unit reduced (₹360/kg to ₹350/kg)" },
      { value: "₹2.84L", description: "annual savings from reduced bed replacement costs" }
    ],
    approachSteps: [
      "Conducted detailed assessment of current slag buildup patterns and maintenance schedules.",
      "Applied E-WELD SHIELD protective coating to all active cutting beds.",
      "Monitored slag adhesion reduction over a 30-day production cycle.",
      "Adjusted coating application frequency based on real-world wear patterns.",
      "Trained operators on proper bed maintenance and coating reapplication."
    ],
    takeawaysDescription: "<b>E-Weld Shield</b> shifts laser bed maintenance from reactive slag removal to preventive surface protection, delivering:",
    takeaways: [
      "Reduced slag buildup and adhesion",
      "Faster maintenance and reduced downtime",
      "Extended slat and cutting bed lifespan",
      "Predictable and lower maintenance costs"
    ],
    idealUseCases: [
      "High-volume laser/plasma/Oxy-fuel cutting beds",
      "Precision engineering facilities",
      "Heavy metal fabrication shops",
      "Plants seeking productivity + EHS improvements"
    ],
    outcome: "The implementation of E-WELD SHIELD transformed the facility's cutting operations. Slag adhesion was reduced by 80%, cutting maintenance downtime from 6 hours to just over 2 hours per shift. Cutting precision improved significantly due to consistently flat bed surfaces. The initial investment was recovered within 4 months through reduced labor costs and extended bed life."
  },
  {
    slug: "solvent-waste-reduction",
    ref: "W/001",
    title: "85% Reduction in Solvent Waste for Automotive Assembly",
    industry: "Tier-1 Automotive Manufacturer",
    category: "Automotive",
    subindustry: "Automotive Assembly",
    application: "Protective coating for laser / plasma / oxy-fuel cutting beds",
    product: "Bio-Washer System",
    problem: "The client was struggling with high hazardous waste disposal costs and operator exposure to toxic VOCs from traditional solvent tanks.",
    solution: "Implementation of 12 Bio-Washer units utilising bio-remediation technology to break down oils in-situ.",
    results: ["85% reduction in annual hazardous waste", "90% decrease in VOC emissions", "Payback period achieved in 14 months"],
    image: "https://www.eieprocess.se/media/jdnlnbhi/eie-process_detaljtvattar_bio-circle.jpg?width=1140&height=640&format=webp&quality=80&v=1db72f771808be0",
    challenge: "The manufacturing facility was processing over 50,000 engine components per month across 12 production lines. Each cleaning cycle required 200 litres of solvent-based cleaner that had to be replaced every 72 hours due to contamination. This generated approximately 800 litres of hazardous waste weekly, with disposal costs exceeding $45,000 annually. Additionally, operator exposure to VOC emissions was approaching regulatory limits, putting the facility at risk of non-compliance with OSHA standards.",
    customerBackground: "A tier-1 supplier to major global OEMs, this facility manufactures and cleans over 50,000 engine components per month across 12 continuous production lines.",
    customerBackgroundPoints: null,
    businessChallengesDescription: null,
    businessChallenges: [
      "High-volume solvent use requiring replacement every 72 hours",
      "800 litres of hazardous waste generated weekly",
      "VOC emissions approaching OSHA non-compliance thresholds",
      "Annual waste disposal costs exceeding $45,000",
      "Operator health and safety exposure risks"
    ],
    businessChallengesQuote: null,
    operationalSnapshot: [
      { value: "85%", description: "reduction in annual hazardous waste generated on-site" },
      { value: "90%", description: "decrease in VOC emissions across all 12 production lines" },
      { value: "8 wks", description: "full transition completed with zero production downtime" }
    ],
    costSnapshot: [
      { value: "14 mo", description: "payback period from implementation to full ROI" },
      { value: "6 mo+", description: "cleaning fluid life extended from 3 days to over 6 months" },
      { value: "2 lines", description: "additional lines added post-success, expanding coverage" }
    ],
    approachSteps: [
      "Conducted full workflow audit across all 12 solvent cleaning stations.",
      "Proposed phased transition to Bio-Washer units with bio-active chemistry dosing.",
      "Integrated oil skimming and filtration for continuous fluid reclamation.",
      "Delivered operator training across all three shifts.",
      "Ran 90-day monitoring period with regular chemistry analysis."
    ],
    takeawaysDescription: null,
    takeaways: [
      "Eliminated hazardous solvent dependency",
      "Extended fluid life from days to months",
      "Full OSHA VOC compliance restored",
      "Sustainable, reduced waste footprint"
    ],
    idealUseCases: [
      "High-volume engine and powertrain component lines",
      "Facilities approaching VOC compliance limits",
      "Plants targeting ESG and waste reduction goals",
      "Operations replacing legacy solvent tank systems"
    ],
    outcome: "The transition was completed over 8 weeks with zero production downtime. The bio-remediation technology proved highly effective at breaking down hydrocarbon contaminants, extending cleaning fluid life from 3 days to over 6 months. The facility achieved full ROI within 14 months and has since expanded the system to two additional production lines."
  },
  {
    slug: "aerospace-precision-cleaning",
    ref: "W/002",
    title: "Aerospace-Grade Precision Cleaning with Zero Rejects",
    industry: "Precision Aerospace Machining Ltd.",
    category: "Aerospace",
    subindustry: "Aerospace precision machining",
    application: "Aqueous parts washing — turbine components",
    product: "GT Parts Washer",
    problem: "Stringent NADCAP cleanliness requirements meant even microscopic residue led to rejected high-value engine components.",
    solution: "Transition to GT Parts Washer with custom spray pressure profiles and specialised aqueous chemistry.",
    results: ["Reduced reject rate from 4.2% to 0%", "Faster cleaning cycle times (by 30%)", "Full compliance with aerospace standards"],
    image: "https://images.kkeu.de/is/image/BEG/Environment/Hazardous_goods_handling/Parts_cleaners_cleaning_tables/GT_Maxi_parts_washer_pdplarge-mrd--688866_AAS_00_00_00_19525793.jpg",
    challenge: "Precision Aerospace Machining Ltd. manufactures critical turbine components for major aerospace OEMs. Each component undergoes rigorous cleaning to meet NADCAP AC7108 standards. Their existing cleaning process was achieving only a 95.8% pass rate, meaning nearly 4% of high-value components — some worth upwards of $12,000 each — were being rejected.",
    customerBackground: "Manufacturer of critical turbine and engine components for major aerospace OEMs, requiring full NADCAP AC7108 cleaning compliance on every production run.",
    customerBackgroundPoints: null,
    businessChallengesDescription: null,
    businessChallenges: [
      "Reject rate of 4.2% on high-value components worth up to $12,000 each",
      "Microscopic particulate and hydrocarbon film causing NADCAP failures",
      "Manual re-cleaning adding significant labour overhead",
      "Risk of losing OEM supplier certification",
      "Inability to trace and log cleaning cycle compliance"
    ],
    businessChallengesQuote: null,
    operationalSnapshot: [
      { value: "0%", description: "reject rate sustained for over 18 months post-installation" },
      { value: "30%", description: "reduction in cleaning cycle time per component batch" },
      { value: "40%", description: "increase in throughput from faster, more reliable cycles" }
    ],
    costSnapshot: [
      { value: "$280K", description: "annual savings from eliminated reject and rework costs" },
      { value: "<5 µm", description: "in-line filtration cleanliness level achieved per NADCAP spec" },
      { value: "18 mo+", description: "zero rejects maintained continuously since installation" }
    ],
    approachSteps: [
      "Analysed part geometries and NADCAP AC7108 cleanliness requirements.",
      "Configured GT Parts Washer with custom spray bars and pressure profiles (2–8 bar).",
      "Validated low-foaming aqueous chemistry for aerospace applications.",
      "Installed in-line <5 micron filtration and automated cycle logging.",
      "Ran validation protocol aligned with NADCAP audit requirements."
    ],
    takeawaysDescription: null,
    takeaways: [
      "Zero rejects sustained for 18+ months",
      "Full NADCAP AC7108 compliance achieved",
      "Automated traceability for audit readiness",
      "Eliminated solvent-related safety concerns"
    ],
    idealUseCases: [
      "NADCAP-certified aerospace component manufacturers",
      "Facilities cleaning high-value precision parts",
      "Operations requiring traceable cleaning compliance",
      "Plants switching from solvent to aqueous cleaning"
    ],
    outcome: "Within 30 days of installation, the reject rate dropped to 0% and has remained at zero for over 18 months. Cycle time was reduced by 30%, increasing throughput by 40%. The client achieved full NADCAP compliance and eliminated solvent-related safety concerns. Annual savings from reduced reject and rework costs exceeded $280,000."
  },
  {
    slug: "fluid-health-automation",
    ref: "W/003",
    title: "Automating Fluid Health in Heavy Metal Forging",
    industry: "Global Forging Group",
    category: "Heavy Industry",
    subindustry: "Heavy engineering — hot forging",
    application: "Automated tank fluid management — aqueous degreasing",
    product: "Pro AutoPurge System",
    problem: "Frequent manual cleaning of large tanks caused 48 hours of production downtime every month.",
    solution: "Installation of the Pro AutoPurge System to automate the removal of sludge and maintain chemistry balance.",
    results: ["Eliminated 100% of manual tank clean-outs", "Increased production uptime by 48 hours/month", "Extended chemistry life by 4x"],
    image: "https://www.dentsplysirona.com/en-hr/discover/discover-by-brand/intego/_jcr_content/root/container/slider_1227234030/parsys_1/quicknavigationtile_/image.coreimg.70.1100.png/1763479159560/tre-image-teaser-axano-pure-full.png",
    challenge: "Global Forging Group operates one of the largest hot forging facilities in Europe, processing over 200 tons of steel monthly. Their cleaning operation relied on 50,000-litre tanks requiring complete drain and manual clean-out every 30 days — each shutdown costing 48 hours of lost production. Annual downtime exceeded 500 hours.",
    customerBackground: "One of Europe's largest hot forging facilities, processing over 200 tons of steel monthly with continuous aqueous degreasing across a bank of 50,000-litre tanks.",
    customerBackgroundPoints: null,
    businessChallengesDescription: null,
    businessChallenges: [
      "Full tank drain and manual clean-out required every 30 days",
      "Each shutdown costing 48 hours of lost production time",
      "Annual downtime exceeding 500 hours — over $1.2M in lost capacity",
      "Forging lubricants and metal fines degrading fluid chemistry rapidly",
      "No real-time monitoring of fluid condition or contamination levels"
    ],
    businessChallengesQuote: null,
    operationalSnapshot: [
      { value: "100%", description: "of manual tank clean-outs eliminated after system installation" },
      { value: "576 hrs", description: "of annual production capacity recovered (48 hrs/month × 12)" },
      { value: "4×", description: "extension in chemistry life — from 30 days to over 120 days" }
    ],
    costSnapshot: [
      { value: "$1.4M", description: "annual production capacity value recovered from uptime gains" },
      { value: "75%", description: "reduction in chemical consumption from extended fluid life" },
      { value: "6 mo", description: "full payback period achieved; system running maintenance-free 2+ years" }
    ],
    approachSteps: [
      "Assessed tank infrastructure and documented current clean-out cycles and costs.",
      "Designed custom AutoPurge integration with programmable sludge removal cycles.",
      "Installed real-time fluid quality sensors (pH, conductivity, contaminant load).",
      "Connected automated dosing system to maintain optimal cleaning chemistry.",
      "Deployed remote monitoring dashboard and fail-safe bypass for zero-interruption maintenance."
    ],
    takeawaysDescription: null,
    takeaways: [
      "Zero manual tank clean-outs required",
      "Predictive maintenance via real-time monitoring",
      "75% lower chemical consumption",
      "Sustained 2+ years maintenance-free operation"
    ],
    idealUseCases: [
      "Large-volume hot forging and stamping operations",
      "Facilities with recurring scheduled tank shutdowns",
      "Plants targeting predictive maintenance programmes",
      "Operations with high chemical usage and disposal costs"
    ],
    outcome: "The Pro AutoPurge System eliminated 100% of manual tank clean-outs. Production uptime increased by 48 hours per month, recovering 576 hours of annual production capacity worth approximately $1.4M. Chemistry life was extended from 30 days to over 120 days, reducing chemical consumption by 75% and waste disposal costs by 80%. The system paid for itself within 6 months."
  }
];

const seed = async () => {
  try {
    for (const cs of caseStudies) {
      const [existing] = await pool.query('SELECT id FROM case_studies WHERE slug = ?', [cs.slug]);
      if (existing.length > 0) {
        console.log(`Skipping "${cs.slug}" — already exists`);
        continue;
      }

      await pool.query(
        `INSERT INTO case_studies 
        (slug, ref, title, industry, category, subindustry, application, product,
         solution, image, customerBackground,
         customerBackgroundPoints, businessChallengesDescription, businessChallenges,
         businessChallengesQuote, operationalSnapshot, costSnapshot,
         takeawaysDescription, takeaways, idealUseCases, outcome)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cs.slug, cs.ref, cs.title, cs.industry, cs.category, cs.subindustry,
          cs.application, cs.product, cs.solution, cs.image, cs.customerBackground,
          JSON.stringify(cs.customerBackgroundPoints), cs.businessChallengesDescription,
          JSON.stringify(cs.businessChallenges), cs.businessChallengesQuote,
          JSON.stringify(cs.operationalSnapshot), JSON.stringify(cs.costSnapshot),
          cs.takeawaysDescription,
          JSON.stringify(cs.takeaways), JSON.stringify(cs.idealUseCases), cs.outcome
        ]
      );
      console.log(`Seeded "${cs.slug}"`);
    }
    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
