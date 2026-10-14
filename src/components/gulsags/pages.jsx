// Public page bodies for the portfolio, project details, services, company information, careers, and legal pages.
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Search,
  ArrowUpRight,
  ArrowLeft,
  Check,
  BriefcaseBusiness,
  MapPin,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Users,
  HeartHandshake,
  Globe2,
  Sparkles,
  CalendarDays,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, globe } from "@/lib/gulsags/content";
import { publicQuery, configured, api } from "@/lib/gulsags/api";
import {
  PageIntro,
  SectionHeading,
  ProjectCard,
  CTA,
  icons as serviceIcons,
} from "./site";
import hospitalityImg from "@/assets/hospitality.jpg";
import financeImg from "@/assets/finance.jpg";
import artImg from "@/assets/art.jpg";
import globeImg from "@/assets/digital-globe.jpg";
export function Projects() {
  const { data } = useSuspenseQuery(publicQuery("projects"));
  const [filter, setFilter] = useState("All Projects");
  const [search, setSearch] = useState("");
  const categories = [
    ...new Set(
      data
        .filter((project) => project.status === "LIVE")
        .map((project) => project.category)
        .filter(Boolean),
    ),
  ];
  const hasComingSoon = data.some(
    (project) => project.status === "COMING_SOON",
  );
  const rows = data.filter(
    (project) =>
      (filter === "All Projects" ||
        (filter === "Coming Soon"
          ? project.status === "COMING_SOON"
          : project.status === "LIVE" &&
            (project.category === filter || project.filter === filter))) &&
      (
        project.title +
        " " +
        project.category +
        " " +
        project.description +
        " " +
        project.slug
      )
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const liveProjects = data.filter((project) => project.status === "LIVE");
  const showcase = liveProjects.slice(0, 3);
  return (
    <>
      <section className="projects-hero">
        <div className="container">
          <div className="projects-hero-inner">
            <div className="projects-hero-copy">
              <p className="projects-hero-eyebrow">
                <span /> OUR PROJECTS
              </p>
              <h1>
                Thoughtful work.
                <br />
                <span>Real-world ideas.</span>
              </h1>
              <p>
                Explore published projects across different industries and
                digital experiences.
              </p>
              <div className="projects-hero-count">
                <strong>{liveProjects.length}</strong>
                <span>
                  {liveProjects.length === 1
                    ? "published project"
                    : "published projects"}
                </span>
              </div>
            </div>
            <div
              className="projects-hero-showcase"
              aria-label="Featured projects"
            >
              {showcase.map((project, index) => (
                <Link
                  key={project.slug}
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className={`projects-showcase-card showcase-card-${index}`}
                >
                  <img
                    src={project.image || globe}
                    alt=""
                    width="600"
                    height="400"
                  />
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section projects-list-section">
        <div className="container">
          <div className="portfolio-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter projects by category"
            >
              {[
                "All Projects",
                ...categories,
                ...(hasComingSoon ? ["Coming Soon"] : []),
              ].map((category) => (
                <Button
                  type="button"
                  variant={filter === category ? "default" : "ghost"}
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                  key={category}
                >
                  {category}
                </Button>
              ))}
            </div>
            <label className="search-input">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label="Search projects"
                placeholder="Search projects"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <p className="projects-result-count" aria-live="polite">
            Showing {rows.length} of {data.length}{" "}
            {data.length === 1 ? "project" : "projects"}
          </p>
          <div className="projects-grid">
            {rows.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          {!rows.length && (
            <div className="projects-empty-state">
              <Search size={25} />
              <h2>No projects found</h2>
              <p>
                Try another search or choose a different category to see more
                work.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setFilter("All Projects");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ProjectDetail({ slug }) {
  const { data } = useSuspenseQuery(publicQuery("projects"));
  const p = data.find((x) => x.slug === slug);
  if (!p)
    return (
      <PageIntro eyebrow="PROJECTS" title="Project not found">
        This project is not currently available.
      </PageIntro>
    );
  const hasRich = Boolean(
    p.longDescription || p.features?.length || p.techTags?.length || p.client,
  );
  return (
    <>
      <PageIntro eyebrow={p.category} title={p.title}>
        {p.description}
      </PageIntro>
      <section className="section">
        <div className="container project-detail">
          <img
            src={p.image || globe}
            alt={`${p.title} — illustrative category image`}
            width="1200"
            height="800"
          />
          <div>
            <p className="eyebrow">DISCOVER THE INITIATIVE</p>
            <h2>A closer look at {p.title}.</h2>
            <p>{p.longDescription || p.description}</p>
            {p.client && (
              <dl className="project-meta">
                <div>
                  <dt>Client</dt>
                  <dd>{p.client}</dd>
                </div>
              </dl>
            )}
            <p className="image-caption">
              Imagery is illustrative, not a screenshot of the platform.
            </p>
            {p.url ? (
              <Button asChild size="lg">
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  Visit Official Website <ArrowUpRight />
                </a>
              </Button>
            ) : (
              <span className="badge">Coming Soon</span>
            )}
            <Link to="/projects" className="text-link">
              ← All projects
            </Link>
          </div>
        </div>
      </section>
      {hasRich && (
        <section className="section muted-section">
          <div className="container project-rich">
            <div className="project-rich-col">
              {p.features?.length > 0 && (
                <div className="project-block">
                  <p className="eyebrow">KEY FEATURES</p>
                  <h3>What this project includes</h3>
                  <ul className="feature-list">
                    {p.features.map((f, i) => (
                      <li key={i}>
                        <Check size={16} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="project-rich-col">
              {p.techTags?.length > 0 && (
                <div className="project-block">
                  <p className="eyebrow">TECH STACK</p>
                  <h3>Technologies used</h3>
                  <div className="tech-tags">
                    {p.techTags.map((t) => (
                      <span className="badge tech-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      <CTA />
    </>
  );
}
export function Services() {
  const { data } = useSuspenseQuery(publicQuery("services", services));
  return (
    <>
      <section className="services-hero">
        <div className="container services-hero-inner">
          <div className="services-hero-copy">
            <p className="services-hero-eyebrow">
              <span /> WHAT WE DO
            </p>
            <h1>
              Technology that moves your business <span>forward.</span>
            </h1>
            <p>
              From an early idea to a stronger digital presence, explore the
              services Gulsaga offers to help your business plan, build and
              improve.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">
                Discuss your project <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="services-visual" aria-hidden="true">
            <div className="services-flow-card">
              <span>OUR APPROACH</span>
              <strong>Idea to launch</strong>
              <div className="services-flow-line">
                <i />
                <i />
                <i />
              </div>
              <small>Strategy · Design · Engineering</small>
            </div>
            <div className="services-workspace">
              <div className="workspace-topbar">
                <span className="workspace-window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Digital workspace</span>
                <span className="workspace-live">
                  <i /> In progress
                </span>
              </div>
              <div className="workspace-body">
                <div className="workspace-sidebar">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="workspace-main">
                  <span className="workspace-label">
                    A THOUGHTFUL DIGITAL EXPERIENCE
                  </span>
                  <strong>Built around what matters.</strong>
                  <div className="workspace-preview">
                    <div className="workspace-preview-copy">
                      <i />
                      <i />
                      <i />
                      <span />
                    </div>
                    <div className="workspace-preview-art">
                      <b />
                      <b />
                      <b />
                      <b />
                      <b />
                    </div>
                  </div>
                  <div className="workspace-bottom">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
            <div className="services-visual-tags">
              {data.slice(0, 3).map((service) => {
                const Icon = serviceIcons[service.icon] || Lightbulb;
                return (
                  <span key={service.title}>
                    <Icon size={14} />
                    {service.title}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="section services-list-section">
        <div className="container">
          <SectionHeading
            eyebrow="HOW WE CAN HELP"
            title="Services built around your needs."
            description="Explore our current service offerings. Tell us what you are working on and we can discuss a suitable next step."
          />
          <div className="services-list">
            {data.map((service, index) => {
              const Icon = serviceIcons[service.icon] || Lightbulb;
              return (
                <article className="service-detail-card" key={service.title}>
                  <span className="service-detail-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="service-detail-icon">
                    <Icon size={25} />
                  </div>
                  <div className="service-detail-copy">
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/contact">
                      Discuss this service <ArrowUpRight />
                    </Link>
                  </Button>
                </article>
              );
            })}
          </div>
          <div className="services-question">
            <div>
              <p className="eyebrow">NOT SURE WHERE TO START?</p>
              <h2>Let’s talk about what you need.</h2>
              <p>
                Share your goals and questions with our team. We’ll take it from
                there.
              </p>
            </div>
            <Button asChild>
              <Link to="/contact">
                Start a conversation <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function About() {
  const { data: site } = useSuspenseQuery(
    publicQuery("site-settings", { settings: {}, links: [] }),
  );
  const { data: team } = useSuspenseQuery(publicQuery("team"));
  return (
    <>
      <PageIntro
        eyebrow="ABOUT GULSAGA"
        title="Where Strategy Meets Technology for Growth."
      >
        Gulsaga helps businesses grow through Business Development, Web
        Development and Software Development — turning ambition into measurable
        outcomes.
      </PageIntro>
      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="THE PEOPLE BEHIND GULSAGA"
              title="Meet Our Founders"
              description="The people shaping our vision and building purposeful technology."
            />
            <div className="founder-grid">
              {team.map((person) => (
                <article className="founder-card" key={person.id}>
                  {person.imageId && (
                    <img
                      src={`${api.defaults.baseURL}/public/media/${encodeURIComponent(person.imageId)}`}
                      alt={person.name}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="eyebrow">{person.role}</p>
                    <h3>{person.name}</h3>
                    <p>{person.bio}</p>
                    {person.linkedin && (
                      <a
                        className="text-link"
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container about-layout">
          <img
            src={
              site.settings.aboutImageId
                ? `${api.defaults.baseURL}/public/media/${encodeURIComponent(site.settings.aboutImageId)}`
                : globe
            }
            alt="Global digital connections"
            width="1920"
            height="1024"
          />
          <div>
            <p className="eyebrow">IDEAS. TECHNOLOGY. IMPACT.</p>
            <h2>Your Growth Partner, End to End.</h2>
            <p>
              Gulsaga blends sharp business strategy with reliable web and
              software engineering. We work across hospitality, finance,
              creative commerce and social impact — building digital products
              that help organisations grow, operate smarter and create lasting
              impact.
            </p>
            <h3>Our Mission</h3>
            <p>
              To empower businesses with the strategy, technology and design
              they need to grow confidently in a digital world.
            </p>
            <h3>Our Vision</h3>
            <p>
              To be the trusted growth partner for businesses — blending sharp
              business strategy with reliable technology to create lasting
              impact.
            </p>
            <h3>What We Do</h3>
            <p>
              Three connected strengths drive every engagement:{" "}
              <strong>Business Development</strong> to identify and capture
              opportunities, <strong>Web Development</strong> to build a strong
              digital presence, and <strong>Software Development</strong> to
              create tailored tools that simplify operations.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR PORTFOLIO"
            title="Built Across Domains."
            description="Hospitality, finance, creative commerce and social impact — we bring ideas to life across industries."
            action={{ to: "/projects", label: "See All Projects" }}
          />
          <div className="gallery-grid">
            {[
              [hospitalityImg, "Hospitality"],
              [financeImg, "Finance & Education"],
              [artImg, "Creative Commerce"],
              [globeImg, "Digital Products"],
            ].map(([src, label]) => (
              <figure key={label}>
                <img
                  src={src}
                  alt={label}
                  loading="lazy"
                  width="600"
                  height="600"
                />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT GUIDES US"
            title="Our Values"
            description="Six principles that shape how we work, build and grow with our clients."
          />
          <div className="values-grid">
            {[
              [
                ShieldCheck,
                "Integrity",
                "Honesty and transparency guide every decision we make.",
              ],
              [
                Users,
                "User Focus",
                "Real people and their needs come first, always.",
              ],
              [
                Lightbulb,
                "Practical Innovation",
                "Fresh thinking, grounded in real-world challenges.",
              ],
              [
                HeartHandshake,
                "Collaboration",
                "We work together to achieve more than we could alone.",
              ],
              [
                Globe2,
                "Accessibility",
                "Technology that works for everyone, everywhere.",
              ],
              [
                Sparkles,
                "Continuous Improvement",
                "We learn, refine, and keep moving forward.",
              ],
            ].map(([Icon, title, text]) => (
              <div key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function Innovation() {
  const { data: projects } = useSuspenseQuery(publicQuery("projects"));
  const featuredProjects = projects
    .filter((project) => project.status === "LIVE")
    .slice(0, 3);
  const principles = [
    {
      icon: Users,
      number: "01",
      title: "Start with people",
      description:
        "Understand who a product is for, what they need to do and where the current experience gets in their way.",
    },
    {
      icon: Globe2,
      number: "02",
      title: "Connect the experience",
      description:
        "Bring content, services and digital touchpoints together so the journey feels clear and consistent.",
    },
    {
      icon: Lightbulb,
      number: "03",
      title: "Build for what’s next",
      description:
        "Choose practical solutions that can be improved over time as the organisation and its needs change.",
    },
  ];
  return (
    <>
      <section className="innovation-hero">
        <div className="container">
          <div className="innovation-hero-inner">
            <div className="innovation-hero-copy">
              <p className="innovation-hero-eyebrow">
                <span /> INNOVATION AT GULSAGA
              </p>
              <h1>
                Make ideas useful.
                <br />
                <span>Make technology matter.</span>
              </h1>
              <p>
                We see innovation as finding a clearer, more useful way to solve
                a real need—with thoughtful design and practical technology.
              </p>
              <div className="innovation-hero-actions">
                <Button asChild>
                  <Link to="/projects">
                    Explore our projects <ArrowUpRight />
                  </Link>
                </Button>
                <Link to="/services" className="innovation-secondary-link">
                  How we can help <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div
              className="innovation-journey"
              aria-label="Understand, shape, build and improve"
            >
              <div className="innovation-journey-heading">
                <span>FROM NEED</span>
                <span>TO BETTER EXPERIENCES</span>
              </div>
              {[
                ["01", "Understand", "Listen to people and define the need."],
                ["02", "Shape", "Explore the right experience and approach."],
                ["03", "Build & improve", "Deliver, learn and keep refining."],
              ].map(([number, title, text]) => (
                <div className="innovation-journey-step" key={number}>
                  <span className="innovation-step-number">{number}</span>
                  <span className="innovation-step-mark" />
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                  <ArrowUpRight size={15} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section innovation-principles-section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR APPROACH"
            title="Innovation, grounded in real needs."
            description="A few practical principles guide how we think about better digital experiences."
          />
          <div className="innovation-principles">
            {principles.map(({ icon: Icon, number, title, description }) => (
              <article className="innovation-principle" key={number}>
                <div className="innovation-principle-top">
                  <span>{number}</span>
                  <Icon size={23} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {featuredProjects.length > 0 && (
        <section className="section muted-section">
          <div className="container">
            <SectionHeading
              eyebrow="IDEAS IN PRACTICE"
              title="Explore work across different domains."
              description="See selected published projects and the experiences they set out to create."
              action={{ to: "/projects", label: "All projects" }}
            />
            <div className="projects-grid innovation-projects-grid">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CTA />
    </>
  );
}
export function Careers() {
  const { data } = useSuspenseQuery(publicQuery("jobs", []));
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [dept, setDept] = useState("");
  const [location, setLocation] = useState("");
  const searchTerm = search.trim().toLowerCase();
  const rows = data.filter(
    (j) =>
      (!type || j.type === type) &&
      (!dept || j.department === dept) &&
      (!location || j.location === location) &&
      [j.title, j.department, j.location, j.type, j.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm)),
  );
  const clearFilters = () => {
    setSearch("");
    setType("");
    setDept("");
    setLocation("");
  };
  return (
    <>
      <PageIntro
        eyebrow="CAREERS & INTERNSHIPS"
        title="Build Experiences That Matter."
      >
        Explore opportunities to learn, contribute and grow through professional
        roles and internship opportunities at Gulsaga.
      </PageIntro>
      <section className="section careers-section">
        <div className="container">
          <div className="careers-section-heading">
            <SectionHeading
              eyebrow="GROW WITH US"
              title="Current Opportunities"
              description="Find a role that fits your skills and the way you want to grow."
            />
            <span className="careers-open-count">
              <BriefcaseBusiness size={16} />
              {data.length} {data.length === 1 ? "opening" : "openings"}
            </span>
          </div>
          <div className="job-filters">
            <label className="search-input">
              <Search size={18} />
              <input
                aria-label="Search opportunities"
                placeholder="Search opportunities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            {[
              [
                type,
                setType,
                "All job types",
                [...new Set(data.map((j) => j.type).filter(Boolean))],
              ],
              [
                dept,
                setDept,
                "All departments",
                [...new Set(data.map((j) => j.department).filter(Boolean))],
              ],
              [
                location,
                setLocation,
                "All locations",
                [...new Set(data.map((j) => j.location).filter(Boolean))],
              ],
            ].map(([value, set, label, options]) => (
              <select
                aria-label={label}
                key={label}
                value={value}
                onChange={(e) => set(e.target.value)}
              >
                <option value="">{label}</option>
                {options.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ))}
          </div>
          {configured && data.length > 0 && (
            <p className="careers-results-count" aria-live="polite">
              Showing {rows.length} of {data.length}{" "}
              {data.length === 1 ? "opportunity" : "opportunities"}
            </p>
          )}
          {!configured ? (
            <div className="empty-state">
              <BriefcaseBusiness />
              <h3>Opportunities will be available here.</h3>
              <p>
                Current openings could not be loaded. Please check back later.
              </p>
            </div>
          ) : !rows.length ? (
            <div className="empty-state">
              <BriefcaseBusiness />
              <h3>
                {data.length
                  ? "No matching opportunities"
                  : "No active openings"}
              </h3>
              <p>
                {data.length
                  ? "Try changing your search or filters."
                  : "We don't have any active openings at the moment. Please check back later."}
              </p>
              {data.length > 0 && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X size={16} /> Clear filters
                </Button>
              )}
            </div>
          ) : (
            rows.map((j) => (
              <article className="job-row" key={j.id}>
                <div>
                  <span className="eyebrow">{j.department}</span>
                  <h3>{j.title}</h3>
                  <div className="job-row-meta">
                    <span>
                      <MapPin size={15} />
                      {j.location}
                    </span>
                    <span className="job-type-pill">{j.type}</span>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link to="/careers/$slug" params={{ slug: j.slug }}>
                    View Opportunity <ArrowUpRight />
                  </Link>
                </Button>
              </article>
            ))
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function JobDetail({ slug }) {
  const { data } = useSuspenseQuery(publicQuery("jobs", []));
  const job = data.find((j) => j.slug === slug);
  if (!job)
    return (
      <PageIntro eyebrow="CAREERS" title="Opportunity unavailable">
        This position is not currently available. Please check back later.
      </PageIntro>
    );
  return (
    <>
      <PageIntro eyebrow={`${job.department} · ${job.type}`} title={job.title}>
        {job.location}
      </PageIntro>
      <section className="section">
        <div className="container prose">
          <h2>About the opportunity</h2>
          <p>{job.description}</p>
          <h3>Responsibilities</h3>
          <p>{job.responsibilities}</p>
          <h3>Skills & qualifications</h3>
          <p>{job.skills}</p>
          <p>{job.qualification}</p>
          <p>
            Application deadline:{" "}
            {new Date(job.deadline).toLocaleDateString("en-GB")}
          </p>
          <Button asChild>
            <Link to="/apply/$jobId" params={{ jobId: job.id }}>
              Apply Now <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
export function Legal({ terms = false }) {
  return (
    <>
      <PageIntro
        eyebrow="GULSAGA"
        title={terms ? "Terms of Use" : "Privacy Policy"}
      >
        Information about using this website and submitting your details.
      </PageIntro>
      <section className="section">
        <div className="container prose">
          {terms ? (
            <>
              <h2>Using this website</h2>
              <p>
                This website presents Gulsaga and links to independently
                operated project websites. Their terms and privacy policies
                apply when you visit them.
              </p>
              <h2>Accuracy & availability</h2>
              <p>
                Project information and opportunities may change. An application
                does not guarantee an interview or employment.
              </p>
              <h2>Acceptable use</h2>
              <p>
                Do not submit unlawful content, attempt unauthorised access or
                upload malicious files.
              </p>
            </>
          ) : (
            <>
              <h2>Information you provide</h2>
              <p>
                Enquiries collect contact details, your message and consent.
                Applications collect qualifications, experience, profile links
                and files you choose to submit.
              </p>
              <h2>How your information is used</h2>
              <p>
                Information is used to verify your email, respond to enquiries
                and review job applications. Applicant files are available only
                to authorised administrators.
              </p>
              <h2>Storage & retention</h2>
              <p>
                Information is stored in private systems. The operator must
                configure a documented retention period and deletion process
                before accepting submissions.
              </p>
              <h2>Your choices</h2>
              <p>
                Use the contact page to request access, correction or deletion
                of information you have submitted.
              </p>
            </>
          )}
          <p className="legal-note">
            This policy requires review by the website operator before
            submissions are enabled.
          </p>
          <Link to="/contact" className="text-link">
            Contact Gulsaga <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function Blogs() {
  const { data } = useSuspenseQuery(publicQuery("blogs"));
  const featuredPost = data[0];
  const otherPosts = data.slice(1);
  const articleDate = (post) => {
    const date = post.publishedAt || post.createdAt;
    return date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;
  };
  return (
    <>
      <section className="journal-hero">
        <div className="container journal-hero-inner">
          <div className="journal-hero-copy">
            <p className="journal-hero-eyebrow">
              <span /> THE GULSAGA JOURNAL
            </p>
            <h1>
              Ideas worth
              <br />
              <span>putting into practice.</span>
            </h1>
            <p>
              Perspectives on business, design and technology—shared to help
              make digital work clearer and more useful.
            </p>
            <div className="journal-count">
              <BookOpen size={17} />
              <span>
                {data.length} {data.length === 1 ? "article" : "articles"}{" "}
                published
              </span>
            </div>
          </div>
          {featuredPost && (
            <Link
              to="/blogs/$slug"
              params={{ slug: featuredPost.slug }}
              className="journal-featured"
              aria-label={`Read featured article: ${featuredPost.title}`}
            >
              {featuredPost.coverImageId ? (
                <img
                  src={`${api.defaults.baseURL}/public/media/${encodeURIComponent(featuredPost.coverImageId)}`}
                  alt=""
                  width="1200"
                  height="800"
                />
              ) : (
                <div className="journal-featured-placeholder">
                  <BookOpen size={44} />
                  <span>GULSAGA JOURNAL</span>
                </div>
              )}
              <span className="journal-featured-shade" />
              <span className="journal-featured-label">LATEST ARTICLE</span>
              <span className="journal-featured-meta">
                {[articleDate(featuredPost), featuredPost.author]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <span className="journal-featured-title">
                {featuredPost.title}
              </span>
              <span className="journal-featured-arrow">
                Read article <ArrowUpRight size={16} />
              </span>
            </Link>
          )}
        </div>
      </section>
      <section className="section journal-list-section">
        <div className="container">
          <SectionHeading
            eyebrow="FROM THE JOURNAL"
            title={
              otherPosts.length ? "More ideas to explore." : "Latest articles."
            }
            description="Browse practical perspectives and updates from Gulsaga."
          />
          {otherPosts.length > 0 ? (
            <div className="blog-grid">
              {otherPosts.map((post) => (
                <article className="blog-card" key={post.id}>
                  <Link
                    className="blog-card-link"
                    to="/blogs/$slug"
                    params={{ slug: post.slug }}
                    aria-label={`Read ${post.title}`}
                  >
                    {post.coverImageId ? (
                      <img
                        src={`${api.defaults.baseURL}/public/media/${encodeURIComponent(post.coverImageId)}`}
                        alt=""
                        loading="lazy"
                        width="900"
                        height="600"
                      />
                    ) : (
                      <div className="blog-card-placeholder">
                        <BookOpen size={32} />
                        <span>GULSAGA JOURNAL</span>
                      </div>
                    )}
                    <div>
                      <p className="blog-card-meta">
                        {articleDate(post) && (
                          <span>
                            <CalendarDays size={13} />
                            {articleDate(post)}
                          </span>
                        )}
                        {post.author && <span>{post.author}</span>}
                      </p>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <span className="text-link">
                        Read article <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : featuredPost ? (
            <div className="journal-more-reading">
              <BookOpen size={20} />
              <p>That’s all for now. Check back for more articles.</p>
            </div>
          ) : (
            <div className="journal-empty-state">
              <BookOpen size={28} />
              <h2>New perspectives are on the way.</h2>
              <p>
                There are no published articles yet. Please check back soon.
              </p>
              <Link to="/projects" className="text-link">
                Explore our projects <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function BlogArticle({ slug }) {
  const { data: post } = useSuspenseQuery(publicQuery(`blogs/${slug}`));
  const publishedDate = post.publishedAt || post.createdAt;
  const paragraphs = post.content.split(/\r?\n\s*\r?\n/).filter(Boolean);
  const readingMinutes = Math.max(
    1,
    Math.ceil(
      paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length / 200,
    ),
  );
  return (
    <>
      <PageIntro eyebrow="GULSAGA JOURNAL" title={post.title}>
        {post.excerpt}
      </PageIntro>
      <article className="section">
        <div className="container blog-article">
          <Link className="blog-back-link" to="/blogs">
            <ArrowLeft size={15} /> Back to journal
          </Link>
          {post.coverImageId && (
            <img
              className="blog-article-cover"
              src={`${api.defaults.baseURL}/public/media/${encodeURIComponent(post.coverImageId)}`}
              alt={post.title}
            />
          )}
          <div className="blog-article-meta">
            {publishedDate && (
              <span>
                <CalendarDays size={15} />
                {new Date(publishedDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {post.author && <span>By {post.author}</span>}
            <span>
              <BookOpen size={15} />
              {readingMinutes} min read
            </span>
          </div>
          <div className="blog-article-content">
            {paragraphs.map((paragraph, index) =>
              /^(?:\d+\.\s+\S|Introduction$|Conclusion$|How Gulsaga Can Help$)/i.test(
                paragraph.trim(),
              ) ? (
                <h2 key={index}>{paragraph}</h2>
              ) : (
                <p key={index}>{paragraph}</p>
              ),
            )}
          </div>
          <div className="blog-article-footer">
            <Link className="text-link" to="/blogs">
              <ArrowLeft size={15} /> All articles
            </Link>
            <Link className="text-link" to="/contact">
              Talk to our team <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
export function AboutCompany() {
  const { data: site } = useSuspenseQuery(
    publicQuery("site-settings", { settings: {}, links: [] }),
  );
  const { data: team } = useSuspenseQuery(publicQuery("team", []));
  const settings = site.settings || {};
  const paragraphs = (text, fallback) =>
    String(text || fallback)
      .split(/\r?\n\s*\r?\n/)
      .filter(Boolean);
  return (
    <>
      <PageIntro
        eyebrow="ABOUT GULSAGA"
        title="Where Strategy Meets Technology for Growth."
      >
        Learn about our company, what drives us and the people behind Gulsaga.
      </PageIntro>
      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="THE PEOPLE BEHIND GULSAGA"
              title="Meet Our Founders"
              description="Meet the founders and leaders shaping our vision and building purposeful technology."
            />
            <div className="founder-grid">
              {team.map((person) => (
                <article className="founder-card" key={person.id}>
                  {person.imageId && (
                    <img
                      src={`${api.defaults.baseURL}/public/media/${encodeURIComponent(person.imageId)}`}
                      alt={person.name}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="eyebrow">{person.role}</p>
                    <h3>{person.name}</h3>
                    <p>{person.bio}</p>
                    {person.linkedin && (
                      <a
                        className="text-link"
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container about-layout">
          <img
            src={
              settings.aboutImageId
                ? `${api.defaults.baseURL}/public/media/${encodeURIComponent(settings.aboutImageId)}`
                : globe
            }
            alt="About Gulsaga"
            width="1920"
            height="1024"
          />
          <div>
            <p className="eyebrow">IDEAS. TECHNOLOGY. IMPACT.</p>
            <h2>
              {settings.aboutHeadline || "Your Growth Partner, End to End."}
            </h2>
            {paragraphs(
              settings.aboutContent,
              "Gulsaga blends sharp business strategy with reliable web and software engineering. We work across hospitality, finance, creative commerce and social impact — building digital products that help organisations grow, operate smarter and create lasting impact.",
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <h3>Our Mission</h3>
            {paragraphs(
              settings.aboutMission,
              "To empower businesses with the strategy, technology and design they need to grow confidently in a digital world.",
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <h3>Our Vision</h3>
            {paragraphs(
              settings.aboutVision,
              "To be the trusted growth partner for businesses — blending sharp business strategy with reliable technology to create lasting impact.",
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <h3>What We Do</h3>
            {paragraphs(
              settings.aboutWhatWeDo,
              "Three connected strengths drive every engagement: Business Development to identify and capture opportunities, Web Development to build a strong digital presence, and Software Development to create tailored tools that simplify operations.",
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR PORTFOLIO"
            title="Built Across Domains."
            description="Hospitality, finance, creative commerce and social impact — we bring ideas to life across industries."
            action={{ to: "/projects", label: "See All Projects" }}
          />
          <div className="gallery-grid">
            {[
              [hospitalityImg, "Hospitality"],
              [financeImg, "Finance & Education"],
              [artImg, "Creative Commerce"],
              [globeImg, "Digital Products"],
            ].map(([src, label]) => (
              <figure key={label}>
                <img
                  src={src}
                  alt={label}
                  loading="lazy"
                  width="600"
                  height="600"
                />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT GUIDES US"
            title="Our Values"
            description="Six principles that shape how we work, build and grow with our clients."
          />
          <div className="values-grid">
            {[
              [
                ShieldCheck,
                "Integrity",
                "Honesty and transparency guide every decision we make.",
              ],
              [
                Users,
                "User Focus",
                "Real people and their needs come first, always.",
              ],
              [
                Lightbulb,
                "Practical Innovation",
                "Fresh thinking, grounded in real-world challenges.",
              ],
              [
                HeartHandshake,
                "Collaboration",
                "We work together to achieve more than we could alone.",
              ],
              [
                Globe2,
                "Accessibility",
                "Technology that works for everyone, everywhere.",
              ],
              [
                Sparkles,
                "Continuous Improvement",
                "We learn, refine, and keep moving forward.",
              ],
            ].map(([Icon, title, text]) => (
              <div key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
