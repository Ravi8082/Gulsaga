import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpRight, ShieldCheck, Users, Lightbulb, HeartHandshake, Globe2, Sparkles } from 'lucide-react';
import { globe } from '@/lib/gulsags/content';
import { publicQuery, api } from '@/lib/gulsags/api';
import { PageIntro, SectionHeading, CTA } from './site';
import hospitalityImg from '@/assets/hospitality.jpg';
import financeImg from '@/assets/finance.jpg';
import artImg from '@/assets/art.jpg';
import globeImg from '@/assets/digital-globe.jpg';

const defaults = {
  headline: 'Your Growth Partner, End to End.',
  story: 'Gulsaga blends sharp business strategy with reliable web and software engineering. We work across hospitality, finance, creative commerce and social impact — building digital products that help organisations grow, operate smarter and create lasting impact.',
  mission: 'To empower businesses with the strategy, technology and design they need to grow confidently in a digital world.',
  vision: 'To be the trusted growth partner for businesses — blending sharp business strategy with reliable technology to create lasting impact.',
  whatWeDo: 'Three connected strengths drive every engagement: Business Development to identify and capture opportunities, Web Development to build a strong digital presence, and Software Development to create tailored tools that simplify operations.',
};

function paragraphs(text) {
  return (text || '').split(/\n\s*\n/).map(part => part.trim()).filter(Boolean).map((part, index) => <p key={index}>{part}</p>);
}

export function AboutPage() {
  const { data: site } = useSuspenseQuery(publicQuery('site-settings', { settings: {}, links: [] }));
  const { data: team } = useSuspenseQuery(publicQuery('team', []));
  const content = site.settings || {};
  const imageUrl = id => id ? `${api.defaults.baseURL}/public/media/${encodeURIComponent(id)}` : globe;
  const values = [
    [ShieldCheck, 'Integrity', 'Honesty and transparency guide every decision we make.'],
    [Users, 'User Focus', 'Real people and their needs come first, always.'],
    [Lightbulb, 'Practical Innovation', 'Fresh thinking, grounded in real-world challenges.'],
    [HeartHandshake, 'Collaboration', 'We work together to achieve more than we could alone.'],
    [Globe2, 'Accessibility', 'Technology that works for everyone, everywhere.'],
    [Sparkles, 'Continuous Improvement', 'We learn, refine, and keep moving forward.'],
  ];
  const gallery = [[hospitalityImg, 'Hospitality'], [financeImg, 'Finance & Education'], [artImg, 'Creative Commerce'], [globeImg, 'Digital Products']];

  return <>
    <PageIntro eyebrow="ABOUT GULSAGA" title="Where Strategy Meets Technology for Growth.">
      Meet the people and purpose driving Gulsaga.
    </PageIntro>
    {team.length > 0 && <section className="section">
      <div className="container">
        <SectionHeading eyebrow="THE PEOPLE BEHIND GULSAGA" title="Meet Our Founders" description="The people shaping our vision and building purposeful technology." />
        <div className="founder-grid">{team.map(person => <article className="founder-card" key={person.id}>
          {person.imageId && <img src={imageUrl(person.imageId)} alt={person.name} loading="lazy" />}
          <div><p className="eyebrow">{person.role}</p><h3>{person.name}</h3>{paragraphs(person.bio)}
            {person.linkedin && <a className="text-link" href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} /></a>}
          </div>
        </article>)}</div>
      </div>
    </section>}
    <section className="section">
      <div className="container about-layout">
        <img src={imageUrl(content.aboutImageId)} alt="Gulsaga company" width="1920" height="1024" />
        <div><p className="eyebrow">IDEAS. TECHNOLOGY. IMPACT.</p><h2>{content.aboutHeadline || defaults.headline}</h2>
          {paragraphs(content.aboutContent || defaults.story)}
          <h3>Our Mission</h3>{paragraphs(content.aboutMission || defaults.mission)}
          <h3>Our Vision</h3>{paragraphs(content.aboutVision || defaults.vision)}
          <h3>What We Do</h3>{paragraphs(content.aboutWhatWeDo || defaults.whatWeDo)}
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="OUR PORTFOLIO" title="Built Across Domains." description="Hospitality, finance, creative commerce and social impact — we bring ideas to life across industries." action={{ to: '/projects', label: 'See All Projects' }} />
        <div className="gallery-grid">{gallery.map(([src, label]) => <figure key={label}><img src={src} alt={label} loading="lazy" width="600" height="600" /><figcaption>{label}</figcaption></figure>)}</div>
      </div>
    </section>
    <section className="section muted-section"><div className="container">
      <SectionHeading eyebrow="WHAT GUIDES US" title="Our Values" description="Six principles that shape how we work, build and grow with our clients." />
      <div className="values-grid">{values.map(([Icon, title, description]) => <article key={title}><Icon /><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div></section>
    <CTA />
  </>;
}
