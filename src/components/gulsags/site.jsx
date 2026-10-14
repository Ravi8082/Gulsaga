// Shared public-site shell, navigation, cards, homepage, project carousel, and reusable section components.
import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { publicQuery, api } from '@/lib/gulsags/api';
const defaultSettings={settings:{},links:[]};
function useSettings(){return useSuspenseQuery(publicQuery('site-settings',defaultSettings)).data;}
function imageUrl(id,fallback){return id?`${api.defaults.baseURL}/public/media/${encodeURIComponent(id)}`:fallback;}
import { ArrowUpRight, ArrowRight, ArrowLeft, Menu, X, Code2, Layers3, PenTool, Globe2, Compass, Sparkles, ShieldCheck, Users, Lightbulb, Check, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { globe, services, description } from '@/lib/gulsags/content';
import hospitalityImg from '@/assets/hospitality.jpg';
import financeImg from '@/assets/finance.jpg';
import artImg from '@/assets/art.jpg';
import globeImg from '@/assets/digital-globe.jpg';
export const icons={code:Code2,layers:Layers3,pen:PenTool,globe:Globe2,compass:Compass};
export function Brand(){return <span className="brand"><span className="brand-mark" aria-hidden="true">G<span/></span><span>Gulsaga<span className="brand-caption">IDEAS. TECHNOLOGY. IMPACT.</span></span></span>}
const nav=[['Home','/'],['About Us','/about'],['Services','/services'],['Projects','/projects'],['Innovation','/innovation'],['Blogs','/blogs'],['Careers','/careers']];
export function SiteShell({children}){const {settings,links}=useSettings();const [open,setOpen]=useState(false);const pathname=useRouterState({select:s=>s.location.pathname});return <><header className="site-header"><div className="container header-inner"><Link to="/" aria-label="Gulsaga home" onClick={()=>setOpen(false)}><Brand/></Link><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([name,to])=><Link key={to} to={to} className={pathname===to?'active':''}>{name}</Link>)}</nav><Button asChild className="header-contact"><Link to="/contact">Let’s Talk <ArrowUpRight/></Link></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div>{open&&<nav className="mobile-nav" aria-label="Mobile navigation">{[...nav,['Contact','/contact']].map(([name,to])=><Link key={to} to={to} onClick={()=>setOpen(false)}>{name}<ArrowUpRight size={16}/></Link>)}</nav>}</header><main>{children}</main><footer className="site-footer"><div className="container footer-main"><div><Link to="/"><Brand/></Link><p>Purposeful technology.<br/>Meaningful possibilities.</p></div><div><h4>Explore</h4>{nav.slice(1,6).map(([name,to])=><Link to={to} key={to}>{name}</Link>)}</div><div><h4>Connect</h4>{settings.contactEmail&&<a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}{settings.verifiedMobile&&<a href={`tel:${settings.verifiedMobile}`}>{settings.verifiedMobile}</a>}{links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={14}/></a>)}<Link to="/contact">Start a conversation <ArrowUpRight size={14}/></Link><Link to="/careers">Careers & internships</Link><Link to="/login">Administrator sign in</Link></div><div className="footer-statement">Have something<br/>in mind?<Link to="/contact">Let’s build it together. <ArrowUpRight/></Link></div></div><div className="container footer-bottom"><span>{settings.footerText||`© ${new Date().getUTCFullYear()} Gulsaga. All rights reserved.`}</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms of Use</Link></div></div></footer></>}
export function SectionHeading({eyebrow,title,description,action}){return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="section-description">{description}</p>}</div>{action&&<Button variant="outline" asChild><Link to={action.to}>{action.label}<ArrowUpRight/></Link></Button>}</div>}
// A project summary links to its case study and conditionally expands its saved details.
export function ProjectCard({project}){return <article className="project-card"><Link to="/projects/$slug" params={{slug:project.slug}} className="project-image"><img src={project.image || globe} alt={`${project.title} — illustrative ${project.category.toLowerCase()} image`} loading="lazy" width="1200" height="800"/><span className={`project-status ${project.status==='COMING_SOON'?'soon':''}`}>{project.status==='COMING_SOON'?'Coming soon':<><span/> Explore project</>}</span></Link><div className="project-copy"><p className="eyebrow">{project.category}</p><Link to="/projects/$slug" params={{slug:project.slug}} className="project-title"><h3>{project.title}</h3><ArrowUpRight size={21}/></Link><p>{project.description}</p>{(project.longDescription||project.features?.length||project.techTags?.length||project.client)&&<details className="project-card-details"><summary>See all project information</summary><div className="project-card-full"><p>{project.longDescription||project.description}</p>{project.client&&<dl className="project-meta"><div><dt>Client</dt><dd>{project.client}</dd></div></dl>}{project.features?.length>0&&<div className="project-card-block"><h4>Key features</h4><ul className="project-card-features">{project.features.map((feature,index)=><li key={index}>{feature}</li>)}</ul></div>}{project.techTags?.length>0&&<div className="project-card-block"><h4>Technologies</h4><div className="tech-tags">{project.techTags.map(tech=><span className="badge tech-tag" key={tech}>{tech}</span>)}</div></div>}<div className="project-card-actions"><Link to="/projects/$slug" params={{slug:project.slug}} className="text-link">Read full case study <ArrowUpRight size={15}/></Link>{project.url&&<a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={15}/></a>}</div></div></details>}</div></article>}
export function ServiceCard({service}){const Icon=icons[service.icon] || Code2;return <article className="service-card"><div className="service-icon"><Icon size={23}/></div><h3>{service.title}</h3><p>{service.description}</p><Link to="/services" className="text-link">Explore service <ArrowUpRight size={15}/></Link></article>}
export function CTA(){const {settings}=useSettings();return <section className="cta-band"><div className="container cta-inner"><div><p className="eyebrow">LET’S BUILD SOMETHING MEANINGFUL</p><h2>{settings.ctaText||'Have an Idea? Let’s Make It Happen.'}</h2><p>Great things begin with a conversation.</p></div><Button size="lg" asChild><Link to="/contact">Get in Touch <ArrowUpRight/></Link></Button></div></section>}
export function PageIntro({eyebrow,title,children}){return <section className="page-intro"><div className="container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children&&<p>{children}</p>}</div></section>}
// Feature up to four API projects with autoplay, manual controls, pause-on-interaction, and reduced-motion support.
function HomeProjectsCarousel({ projects }) {
  const [viewportRef, carouselApi] = useEmblaCarousel({ align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelectedIndex = () => setSelectedIndex(carouselApi.selectedScrollSnap());
    updateSelectedIndex();
    carouselApi.on('select', updateSelectedIndex);
    carouselApi.on('reInit', updateSelectedIndex);
    return () => {
      carouselApi.off('select', updateSelectedIndex);
      carouselApi.off('reInit', updateSelectedIndex);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || paused || projects.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      if (carouselApi.canScrollNext()) carouselApi.scrollNext();
      else carouselApi.scrollTo(0);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [carouselApi, paused, projects.length]);

  return (
    <div
      className="home-project-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <div className="home-project-carousel-viewport" ref={viewportRef}>
        <div className="home-project-carousel-track">
          {projects.map(project => (
            <div className="home-project-slide" key={project.slug}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
      {projects.length > 1 && (
        <div className="home-project-carousel-controls">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous projects"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!carouselApi?.canScrollPrev()}
          >
            <ArrowLeft size={16} />
          </Button>
          <span aria-live="polite">Project {Math.min(selectedIndex + 1, projects.length)} of {projects.length}</span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next projects"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!carouselApi?.canScrollNext()}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

// Homepage sections compose public site settings, projects, services, and static brand messaging.
export function Home() {
  const { settings } = useSettings();
  const { data: homeProjects } = useSuspenseQuery(publicQuery('projects'));
  const { data: homeServices } = useSuspenseQuery(publicQuery('services', services));
  return (
    <>
      <section className="home-hero">
        <img className="hero-background" src={imageUrl(settings.heroImageId, globe)} alt="Connected digital globe" width="1920" height="1024" fetchPriority="high" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span /> IDEAS. TECHNOLOGY. IMPACT.</div>
            <h1>{settings.heroHeadline || <>Business Growth.<br />Web & Software.<br /><span>Built for Impact.</span></>}</h1>
            <p>{settings.heroDescription || description}</p>
            <div className="hero-actions">
              <Button size="lg" asChild><Link to="/projects">Explore Our Projects <ArrowUpRight /></Link></Button>
              <Button variant="outline" size="lg" className="hero-outline" asChild><Link to="/contact">Let’s Build Together <ArrowRight /></Link></Button>
            </div>
            <div className="hero-note"><span className="note-icon"><Sparkles size={15} /></span>Purpose-driven ideas. Real-world possibilities.</div>
          </div>
          <div className="hero-projects">{homeProjects.slice(0, 3).map((project, index) => (
            <Link key={project.slug} to="/projects/$slug" params={{ slug: project.slug }} className={`hero-project hp-${index}`}>
              <img src={project.image} alt="" />
              <div><span>{project.category.split(' & ')[0]}</span><strong>{project.title}</strong></div>
              <ArrowUpRight size={17} />
            </Link>
          ))}</div>
          <div className="hero-bottom">
            <span>TECHNOLOGY THAT CONNECTS IDEAS TO OPPORTUNITIES</span>
            <span className="scroll-label">Discover Gulsaga <span>↓</span></span>
          </div>
        </div>
      </section>
      <section className="highlights">
        <div className="container highlight-grid">{[[Code2, 'Built Around Real Needs', 'Purposeful digital solutions'], [Globe2, 'Different Domains. One Vision.', 'A connected digital perspective'], [Users, 'People at the Centre', 'Thoughtful, accessible experiences'], [Lightbulb, 'Ideas Into Possibilities', 'Practical innovation, always']].map(([Icon, title, sub]) => (
          <div key={title}><Icon size={23} /><div><h3>{title}</h3><p>{sub}</p></div></div>
        ))}</div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="WHAT WE DO" title={<>Strategy, Web & Software for<br className="desktop-break" /> Growing Businesses.</>} description="We combine business development strategy with modern web and software engineering to help organisations grow, operate smarter and create lasting impact." action={{ to: '/services', label: 'All Services' }} />
          <div className="services-grid">{homeServices.map(service => <ServiceCard key={service.title} service={service} />)}</div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading eyebrow="EXPLORE OUR ECOSYSTEM" title="Ideas Taking Shape." description="Different domains. Shared possibilities. Discover the initiatives in our portfolio." action={{ to: '/projects', label: 'View All Projects' }} />
          <HomeProjectsCarousel projects={homeProjects.slice(0, 4)} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="WHY GULSAGA" title="Thoughtful by Design. Purposeful by Nature." />
          <div className="values-grid">{[[ShieldCheck, 'Integrity', 'Honesty and transparency guide every decision we make.'], [Users, 'User Focus', 'Real people and their needs come first, always.'], [Lightbulb, 'Practical Innovation', 'Fresh thinking, grounded in real-world challenges.'], [HeartHandshake, 'Collaboration', 'We work together to achieve more than we could alone.'], [Globe2, 'Accessibility', 'Technology that works for everyone, everywhere.'], [Sparkles, 'Continuous Improvement', 'We learn, refine, and keep moving forward.']].map(([Icon, title, text]) => (
            <div key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>
          ))}</div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading eyebrow="OUR WORK" title="Ideas, Brought to Life." description="A glimpse of the domains we build across — hospitality, finance, creative commerce and beyond." action={{ to: '/projects', label: 'View All Projects' }} />
          <div className="gallery-grid">{[[hospitalityImg, 'Hospitality'], [financeImg, 'Finance'], [artImg, 'Creative Commerce'], [globeImg, 'Digital Products']].map(([src, label]) => (
            <figure key={label}><img src={src} alt={label} loading="lazy" width="600" height="600" /><figcaption>{label}</figcaption></figure>
          ))}</div>
        </div>
      </section>
      <section className="process-band">
        <div className="container">
          <SectionHeading eyebrow="HOW WE WORK" title="From the First Idea to What’s Next." />
          <div className="process-grid">{['Discover', 'Design', 'Develop', 'Test', 'Launch & Improve'].map((step, index) => (
            <div key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{['Understand the need.', 'Shape the experience.', 'Bring the idea to life.', 'Refine every detail.', 'Keep moving forward.'][index]}</p></div>
          ))}</div>
        </div>
      </section>
      <section className="careers-band">
        <div className="container"><HeartHandshake size={40} /><div><p className="eyebrow">GROW WITH GULSAGA</p><h2>Build Experiences That Matter.</h2><p>Explore professional roles and internship opportunities.</p></div><Button variant="outline" asChild><Link to="/careers">Explore Careers <ArrowUpRight /></Link></Button></div>
      </section>
      <CTA />
    </>
  );
}
