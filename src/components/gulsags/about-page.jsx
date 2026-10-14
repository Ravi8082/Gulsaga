import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ShieldCheck,
  Users,
  Lightbulb,
  HeartHandshake,
  Globe2,
  Sparkles,
  Compass,
  Layers3,
} from "lucide-react";
import { globe } from "@/lib/gulsags/content";
import { publicQuery, api } from "@/lib/gulsags/api";
import { SectionHeading, ProjectCard, CTA } from "./site";
import { Link } from "@tanstack/react-router";

const defaults = {
  headline: "Your Growth Partner, End to End.",
  story:
    "Gulsaga blends sharp business strategy with reliable web and software engineering. We work across hospitality, finance, creative commerce and social impact — building digital products that help organisations grow, operate smarter and create lasting impact.",
  mission:
    "To empower businesses with the strategy, technology and design they need to grow confidently in a digital world.",
  vision:
    "To be the trusted growth partner for businesses — blending sharp business strategy with reliable technology to create lasting impact.",
  whatWeDo:
    "Three connected strengths drive every engagement: Business Development to identify and capture opportunities, Web Development to build a strong digital presence, and Software Development to create tailored tools that simplify operations.",
};

function paragraphs(text) {
  return (text || "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => <p key={index}>{part}</p>);
}

export function AboutPage() {
  const { data: site } = useSuspenseQuery(
    publicQuery("site-settings", { settings: {}, links: [] }),
  );
  const { data: team } = useSuspenseQuery(publicQuery("team", []));
  const { data: projects } = useSuspenseQuery(publicQuery("projects", []));
  const content = site.settings || {};
  const imageUrl = (id) =>
    id
      ? `${api.defaults.baseURL}/public/media/${encodeURIComponent(id)}`
      : globe;
  const values = [
    [
      ShieldCheck,
      "Integrity",
      "Honesty and transparency guide every decision we make.",
    ],
    [Users, "User Focus", "Real people and their needs come first, always."],
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
  ];
  const featuredProjects = projects
    .filter((project) => project.status === "LIVE")
    .slice(0, 3);

  return (
    <>
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-copy">
            <p className="about-hero-eyebrow">
              <span /> ABOUT GULSAGA
            </p>
            <h1>
              Where strategy meets technology <span>for growth.</span>
            </h1>
            <p>
              Meet the people and purpose behind Gulsaga, and explore how
              business thinking and practical technology come together in our
              work.
            </p>
            <Link to="/projects" className="about-hero-link">
              Explore our work <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-orbit about-orbit-one" />
            <div className="about-orbit about-orbit-two" />
            <div className="about-orbit-core">
              <span>G</span>
            </div>
            <div className="about-focus focus-strategy">
              <Compass size={17} />
              <span>Business strategy</span>
            </div>
            <div className="about-focus focus-web">
              <Globe2 size={17} />
              <span>Web experiences</span>
            </div>
            <div className="about-focus focus-software">
              <Layers3 size={17} />
              <span>Custom software</span>
            </div>
          </div>
        </div>
      </section>
      {team.length > 0 && (
        <section className="section">
          <div className="container about-team-section">
            <SectionHeading
              eyebrow="THE PEOPLE BEHIND GULSAGA"
              title="Meet Our Founders"
              description="The people shaping our vision and building purposeful technology."
            />
            <div className="founder-grid">
              {team.map((person) => (
                <article
                  className={`founder-card${person.imageId ? "" : " founder-card-no-image"}`}
                  key={person.id}
                >
                  {person.imageId && (
                    <div className="founder-photo">
                      <img
                        src={imageUrl(person.imageId)}
                        alt={person.name}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="founder-copy">
                    <p className="eyebrow">{person.role}</p>
                    <h3>{person.name}</h3>
                    {paragraphs(person.bio)}
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
            src={imageUrl(content.aboutImageId)}
            alt="Gulsaga team and digital work"
            width="1920"
            height="1024"
          />
          <div>
            <p className="eyebrow">IDEAS. TECHNOLOGY. IMPACT.</p>
            <h2>{content.aboutHeadline || defaults.headline}</h2>
            {paragraphs(content.aboutContent || defaults.story)}
            <h3>Our Mission</h3>
            {paragraphs(content.aboutMission || defaults.mission)}
            <h3>Our Vision</h3>
            {paragraphs(content.aboutVision || defaults.vision)}
            <h3>What We Do</h3>
            {paragraphs(content.aboutWhatWeDo || defaults.whatWeDo)}
            <Link to="/projects" className="text-link about-story-link">
              Explore our projects <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="A closer look at our projects."
            description="Explore published work and the digital experiences behind each project."
            action={{ to: "/projects", label: "See All Projects" }}
          />
          {featuredProjects.length > 0 ? (
            <div className="projects-grid about-projects-grid">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="about-projects-empty">
              <p>Our project stories are being prepared.</p>
              <Link to="/contact" className="text-link">
                Talk to our team <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
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
            {values.map(([Icon, title, description]) => (
              <article key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
