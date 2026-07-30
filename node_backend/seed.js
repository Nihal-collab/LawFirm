/**
 * Seed Script — Creates initial data in MongoDB.
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Video = require('./src/models/Video');
const ConsultationSettings = require('./src/models/ConsultationSettings');
const Gallery = require('./src/models/Gallery');
const Team = require('./src/models/Team');
const Testimonial = require('./src/models/Testimonial');
const ClientSuccess = require('./src/models/ClientSuccess');
const Blog = require('./src/models/Blog');
const Faq = require('./src/models/Faq');
const Service = require('./src/models/Service');
const CmsContent = require('./src/models/CmsContent');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create SuperAdmin
    const existing = await User.findOne({ email: 'admin@rootsip.com' });
    if (!existing) {
      await User.create({
        email: 'admin@rootsip.com',
        password: 'adminpassword123',
        role: 'SUPERADMIN',
        firstName: 'SR4IPR',
        lastName: 'Administrator',
        phone: '+91 22 5543-0980',
      });
      console.log('✅ SuperAdmin created: admin@rootsip.com / adminpassword123');
    } else {
      console.log('ℹ️  Admin user already exists.');
    }

    // 2. Create a test CLIENT user
    const testClient = await User.findOne({ email: 'client@example.com' });
    if (!testClient) {
      await User.create({
        email: 'client@example.com',
        password: 'clientpassword123',
        role: 'CLIENT',
        firstName: 'Alex',
        lastName: 'Novak',
      });
      console.log('✅ Test client created: client@example.com / clientpassword123');
    }

    // 3. Seed default videos
    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      await Video.create([
        {
          title: "Navigating PCT International Patent Filing",
          description: "A strategic overview on coordinating multi-jurisdictional patent registrations under the Patent Cooperation Treaty.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 1,
          is_active: true
        },
        {
          title: "Brand Protection & Global Trademark Audits",
          description: "Step-by-step procedures for conducting clearance searches and registering marks across multiple classes.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 2,
          is_active: true
        },
        {
          title: "Software Copyright & Code Registration",
          description: "How software startups can lock down proprietary algorithms, API schemas, and database ownership.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          youtube_video_id: "dQw4w9WgXcQ",
          display_order: 3,
          is_active: true
        }
      ]);
      console.log('✅ Default active YouTube videos seeded successfully.');
    } else {
      console.log('ℹ️  Video library already populated.');
    }

    // 4. Seed default Consultation Settings
    const settings = await ConsultationSettings.getSingleton();
    let needsSave = false;
    if (!settings.dailyLimit || settings.dailyLimit < 1) {
      settings.dailyLimit = 3;
      needsSave = true;
    }
    if (settings.amount === undefined || settings.amount === null) {
      settings.amount = 100;
      needsSave = true;
    }
    if (needsSave) {
      await settings.save();
    }
    console.log(`✅ Consultation settings: dailyLimit=${settings.dailyLimit}, amount=$${settings.amount}`);

    // 5. Seed Gallery (Photos)
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: "Top IP Law Firm of the Year 2024",
          description: "Awarded by the National Legal Alliance for excellence in Patent prosecution and Trademark clearings.",
          image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
          category: "AWARD",
          order: 1
        },
        {
          title: "WIPO International IP Convention Participation",
          description: "ROOTS-IP Partners delegates at the WIPO Geneva session discussing software patent harmonization.",
          image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
          category: "EVENT",
          order: 2
        },
        {
          title: "USPTO Registered Filing Certificate",
          description: "Authorized practitioner certification granted for cross-border software patents filing desk.",
          image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600",
          category: "CERTIFICATE",
          order: 3
        }
      ]);
      console.log('✅ Gallery items seeded successfully.');
    } else {
      console.log('ℹ️  Gallery already populated.');
    }

    // 6. Seed Team members
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      await Team.create([
        {
          name: "Siddharth Rao, Esq.",
          role: "Senior Managing Partner",
          image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
          bio: "Siddharth has over 20 years of experience in patent prosecution and technological joint-venture licensing. He regularly advises Fortune 100 technology corporations on multi-national IP strategy.",
          qualifications: "L.L.M (IP Law) - Georgetown University, B.Tech (Computer Science)",
          experience: "22 Years",
          linkedin_url: "https://linkedin.com",
          twitter_url: "https://twitter.com",
          email: "s.rao@rootsip.com"
        },
        {
          name: "Dr. Aradhana Sen",
          role: "Head of Biotechnology & Patent Agent",
          image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
          bio: "Dr. Sen is a registered patent agent managing pharmaceutical, biochemical, and agricultural gene-patenting applications. She is highly skilled in drafting complex cell cultures and chemical formulations.",
          qualifications: "Ph.D in Molecular Biology - Stanford University, Registered Patent Agent",
          experience: "14 Years",
          linkedin_url: "https://linkedin.com",
          twitter_url: "https://twitter.com",
          email: "a.sen@rootsip.com"
        },
        {
          name: "Marcus Vance",
          role: "Lead Litigation Counsel",
          image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
          bio: "Marcus oversees our litigation and enforcement group, focusing on patent infringement, trademark oppositions, DMCA takedowns, and licensing disputes.",
          qualifications: "J.D. - Harvard Law School, BS in Mechanical Engineering",
          experience: "16 Years",
          linkedin_url: "https://linkedin.com",
          twitter_url: "https://twitter.com",
          email: "m.vance@rootsip.com"
        }
      ]);
      console.log('✅ Team members seeded successfully.');
    } else {
      console.log('ℹ️  Team list already populated.');
    }

    // 7. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.create([
        {
          client_name: "Sarah Jenkins",
          client_role: "Chief Technology Officer",
          company: "NeuraLink Analytics",
          image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
          feedback: "ROOTS-IP Partners drafted our AI core algorithmic patents. Their technical understanding of neural networks matched our engineers' expertise, and the patents were approved with zero major objections.",
          approved: true
        },
        {
          client_name: "Devin Kumar",
          client_role: "Founder & CEO",
          company: "HoloSphere Hardware",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
          feedback: "The team at ROOTS-IP Partners handled our global trademark clearance and filing across 12 countries. Their dashboard kept us updated on every examination request. Highly professional.",
          approved: true
        }
      ]);
      console.log('✅ Testimonials seeded successfully.');
    } else {
      console.log('ℹ️  Testimonials already populated.');
    }

    // 8. Seed Client Success stories
    const successCount = await ClientSuccess.countDocuments();
    if (successCount === 0) {
      await ClientSuccess.create([
        {
          client_name: "Aether Machine Learning Labs",
          practice_area: "Patent Prosecution",
          short_description: "Aether ML developed a novel multi-threaded pipeline model for query routing. They needed immediate global priority logging.",
          outcome: "Drafted and submitted provisional application inside 7 days. Secured complete grant in USPTO with zero major objections within 14 months.",
          date: "2024-03-12",
          image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
        },
        {
          client_name: "BioHelix Labs Inc.",
          practice_area: "Trademark Clearance & Opposition",
          short_description: "BioHelix faced direct brand name opposition from a large pharma company in European markets.",
          outcome: "Successfully navigated rectification and settlement proceedings. Secured international brand monopoly across 18 target countries.",
          date: "2023-11-05",
          image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600"
        }
      ]);
      console.log('✅ Client success stories seeded successfully.');
    } else {
      console.log('ℹ️  Client success stories already populated.');
    }

    // 9. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.create([
        {
          title: "Navigating the Patent Cooperation Treaty (PCT) for Global Scale",
          slug: "navigating-pct-global-patent",
          summary: "Expanding into international markets requires a strategic approach to patent protection. Learn how the PCT provides a unified procedure for filing patent applications to protect your inventions globally.",
          content: `Filing patent applications in individual foreign countries can be an administrative and financial nightmare for startups. The Patent Cooperation Treaty (PCT) offers a streamlined solution.

### What is the PCT?
The PCT is an international treaty with more than 150 contracting states. It is administered by WIPO (World Intellectual Property Organization). By filing a single 'international' patent application under the PCT, you can simultaneously seek protection for an invention in a vast number of countries.

### Key Advantages:
1. **Time and Flexibility:** You get up to 30 months from your initial filing date to decide which specific countries you wish to proceed in. This gives you extra time to secure seed funding or assess product-market fit.
2. **Unified Search Report:** You receive an International Search Report (ISR) containing prior-art citations. This allows you to evaluate your patent's chances of success before spending thousands in regional filing fees.
3. **Simplified Process:** One application, filed in one language, with one set of formal requirements.

### Best Practices for Technology Startups:
- Always file a **Provisional Application** first to lock in your priority date cheap.
- Use the **WIPO search report** to modify claims and delete uninventive parameters before entering national phases.
- Budget for national phase translation fees and local foreign attorneys ahead of the 30-month deadline.`,
          category: "Patents",
          image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
          status: "PUBLISHED",
          seo_title: "PCT International Patent Filing Strategy | ROOTS-IP Partners",
          seo_description: "Learn the advantages of the Patent Cooperation Treaty (PCT) to file international patent applications and save on foreign registration costs.",
          published_at: new Date("2024-03-01")
        }
      ]);
      console.log('✅ Blogs seeded successfully.');
    } else {
      console.log('ℹ️  Blog articles already populated.');
    }

    // 10. Seed FAQs
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
      await Faq.create([
        {
          question: "What is the difference between a Patent, Trademark, and Copyright?",
          answer: "A patent protects new inventions (e.g. mechanisms, software solutions, chemical compounds). A trademark protects brand identifiers (e.g. logos, brand names, slogans). A copyright protects original creative works of authorship (e.g. source code, books, paintings, music).",
          category: "General",
          order: 1
        },
        {
          question: "How long does a patent application take to be granted?",
          answer: "The duration varies depending on jurisdictions. For example, in the US (USPTO) or India (IPO), it can take between 2 to 4 years. Utilizing expedited examination schemes (such as for startups or female applicants) can reduce the timeline to 1 to 2 years.",
          category: "Patent",
          order: 2
        },
        {
          question: "Can software source code be patented?",
          answer: "Generally, software code itself is protected by copyright. However, if the software solves a technical problem in a novel, non-obvious way and has a concrete utility (e.g. speeding up image processing, enhancing device communication), it may be eligible for a utility patent.",
          category: "Patent",
          order: 3
        },
        {
          question: "What is a Provisional Patent and why should I file it?",
          answer: "A provisional patent is a lightweight application that establishes an early priority filing date. It gives you 12 months to refine your invention and seek funding before you must file a detailed Complete Specification.",
          category: "Patent",
          order: 4
        },
        {
          question: "What does a trademark clearance search involve?",
          answer: "A clearance search checks national and international trademark databases to verify that your proposed brand name or logo is not identical or confusingly similar to already registered marks in the same product/service classes.",
          category: "Trademark",
          order: 5
        }
      ]);
      console.log('✅ FAQs seeded successfully.');
    } else {
      console.log('ℹ️  FAQ list already populated.');
    }

    // 11. Seed Services
    await Service.deleteMany({});
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.create([
        {
          name: "Patent Prosecution & Drafting",
          slug: "patent-services",
          category: "PATENT",
          short_desc: "End-to-end patent drafting, filing, and prosecution services with high approval ratios.",
          long_desc: "Our team drafts detailed specifications for provisional and complete patents. We possess deep technical experts in software, AI, electronics, chemical mixtures, and mechanical structures, ensuring your patent passes rigourous examiner audits.",
          icon: "ShieldAlert",
          details_list: [
            "Provisional Patent Specifications",
            "Utility Patent Drafting",
            "WIPO / PCT International Filing",
            "Office Action Analysis & Responses",
            "Patent Landscaping & Prior Art Searches"
          ],
          order: 1,
          trainingAvailable: true,
          trainingTitle: "Professional Training Available",
          trainingDescription: "Learn directly from experienced IP Attorneys using practical case studies and real-world examples.",
          trainingUrl: "/services/patent-services#training"
        },
        {
          name: "Trademark Portfolio Management",
          slug: "trademark-services",
          category: "TRADEMARK",
          short_desc: "Global brand searches, class allocation, applications, and opposition defense.",
          long_desc: "We establish, protect, and police brand assets, product marks, and logos. Our specialists manage brand clearances, address examiner objections, and enforce trademarks against counterfeiters globally.",
          icon: "Tags",
          details_list: [
            "Comprehensive Clearance Search",
            "Trademark Class Classification",
            "Filing & Prosecution Management",
            "Trademark Monitoring & Enforcement",
            "Opposition & Rectification Proceedings"
          ],
          order: 2,
          trainingAvailable: true,
          trainingTitle: "Trademark Strategy Training",
          trainingDescription: "Master clearance searches, class listings, international registrations, and trademark policing.",
          trainingUrl: "/services/trademark-services#training"
        },
        {
          name: "Copyright Protection & Registration",
          slug: "copyright-services",
          category: "COPYRIGHT",
          short_desc: "Software code registry, database rights, and artistic ownership legal filings.",
          long_desc: "We secure registrations for software codebases, proprietary databases, API architectures, literary works, and designs, ensuring solid legal standing for copyright claims.",
          icon: "FileText",
          details_list: [
            "Software & Codebase Registration",
            "Database Rights Protection",
            "Licensing & Assignment Contracts",
            "Digital Millennium Copyright Act (DMCA) Take-Downs",
            "Copyright Infringement Remedies"
          ],
          order: 3,
          trainingAvailable: true,
          trainingTitle: "Software Copyright Workshops",
          trainingDescription: "Hands-on guidance for securing codebase registrations, database rights, and licensing.",
          trainingUrl: "/services/copyright-services#training"
        },
        {
          name: "Industrial Design Registration",
          slug: "design-registration",
          category: "DESIGN",
          short_desc: "Securing exclusive visual aesthetic structures and unique hardware outlines.",
          long_desc: "We file design protection requests to prevent competitors from copying the shape, configuration, ornament, or aesthetic layout of your manufactured hardware products.",
          icon: "Cpu",
          details_list: [
            "Novelty Assessment & Drawings",
            "Filing & Class Registrations",
            "Design Prosecution support",
            "Infringement Auditing"
          ],
          order: 4,
          trainingAvailable: false,
          trainingTitle: "",
          trainingDescription: "",
          trainingUrl: ""
        },
        {
          name: "Geographical Indication Registry",
          slug: "geographical-indication",
          category: "GI",
          short_desc: "Securing community rights for regional products and indigenous goods.",
          long_desc: "We represent trade boards, state agencies, and agricultural associations in registering geographical source titles to maintain exclusive quality margins.",
          icon: "Globe",
          details_list: [
            "GI clearance & historical audit",
            "Association incorporation support",
            "Enforcement against generic label fraud"
          ],
          order: 5,
          trainingAvailable: false,
          trainingTitle: "",
          trainingDescription: "",
          trainingUrl: ""
        },
        {
          name: "IP Litigation & Enforcement",
          slug: "litigation-enforcement",
          category: "LITIGATION",
          short_desc: "Aggressive legal action, patent litigation, injunctions, and custom clearances.",
          long_desc: "Our veteran trial lawyers represent plaintiffs and defendants in high-stakes patent battles, copyright actions, trade secret thefts, and trademark infringement litigations.",
          icon: "Scale",
          details_list: [
            "Cease & Desist Orders",
            "Temporary & Permanent Injunctions",
            "Patent & Trademark Litigation",
            "Custom Enforcement & Anti-Counterfeiting",
            "Trade Secret Protection & Auditing"
          ],
          order: 6,
          trainingAvailable: false,
          trainingTitle: "",
          trainingDescription: "",
          trainingUrl: ""
        }
      ]);
      console.log('✅ Services seeded successfully.');
    } else {
      console.log('ℹ️  Services already populated.');
    }

    // 12. Seed CMS Page copy
    const homeContentCount = await CmsContent.findOne({ page: 'home' });
    if (!homeContentCount) {
      await CmsContent.create({
        page: 'home',
        content: {
          hero_title: "Enterprise Intellectual Property Protection Globally",
          hero_subtitle: "ROOTS-IP Partners provides elite, cross-border patent prosecution, strategic trademark portfolio management, and rigorous copyright enforcement for pioneering technology companies.",
          hero_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
          cta_primary_text: "Schedule Strategy Session",
          cta_secondary_text: "AI Patent Assessment",
          stats_claims_resolved: "1,500+",
          stats_patent_rate: "97.4%",
          stats_active_clients: "350+",
          stats_countries: "45+",
          why_choose_title: "Why Global Innovators Choose ROOTS-IP",
          why_choose_desc: "We combine advanced technical expertise in engineering and biosciences with elite legal acumen to secure and monetize your most valuable commercial assets."
        }
      });
      console.log('✅ Homepage CMS content seeded successfully.');
    }

    const aboutContentCount = await CmsContent.findOne({ page: 'about' });
    if (!aboutContentCount) {
      await CmsContent.create({
        page: 'about',
        content: {
          company_overview: "ROOTS-IP Partners is a premier, tier-one international intellectual property firm representing venture-backed startups, research universities, and Fortune 500 corporations. Our team comprises registered patent attorneys, technical PhDs, and litigators who operate at the intersection of emerging technologies and complex statutory law.",
          vision: "To lead the global standard for IP protection by developing hyper-effective patent structures and trademark defense strategies that protect enterprise value in a hyper-competitive digital economy.",
          mission: "To provide rigorous, technical, and commercial-minded counsel that transforms scientific innovations into bulletproof global patent assets.",
          history_timeline: [
            { year: "2015", event: "ROOTS-IP Partners founded by veteran IP litigators in response to cross-border tech infringement rises." },
            { year: "2018", event: "Expanded practice to include specialized biochemical and machine-learning patent drafting groups." },
            { year: "2021", event: "Opened overseas liaison desks to expedite WIPO and USPTO client portfolio filings." },
            { year: "2024", event: "Ranked in top legal indexes for Patent Prosecution & Trademark enforcement success rates." }
          ]
        }
      });
      console.log('✅ About Us CMS content seeded successfully.');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
