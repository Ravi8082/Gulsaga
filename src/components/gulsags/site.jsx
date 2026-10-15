// Shared public-site shell, navigation, cards, homepage, project carousel, and reusable section components.
import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { publicQuery, api } from '@/lib/gulsags/api';
const defaultSettings={settings:{},links:[]};
function useSettings(){return useSuspenseQuery(publicQuery('site-settings',defaultSettings)).data;}
function imageUrl(id,fallback){return id?`${api.defaults.baseURL}/public/media/${encodeURIComponent(id)}`:fallback;}
import { ArrowUpRight, ArrowRight, ArrowLeft, Menu, X, Code2, Layers3, PenTool, Globe2, Compass, Sparkles, Check, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { globe, services, description } from '@/lib/gulsags/content';
export const icons={code:Code2,layers:Layers3,pen:PenTool,globe:Globe2,compass:Compass};
export function Brand(){return <span className="brand"><span className="brand-mark" aria-hidden="true">G<span/></span><span>Gulsaga<span className="brand-caption">IDEAS. TECHNOLOGY. IMPACT.</span></span></span>}
const nav=[['Home','/'],['About Us','/about'],['Services','/services'],['Projects','/projects'],['Innovation','/innovation'],['Blogs','/blogs'],['Careers','/careers']];
export function SiteShell({children}){const {settings,links}=useSettings();const [open,setOpen]=useState(false);const pathname=useRouterState({select:s=>s.location.pathname});if(pathname.startsWith('/admin'))return <main className="admin-main">{children}</main>;if(pathname==='/login'||pathname==='/reset-password'||pathname.startsWith('/employee'))return <main className="auth-main">{children}</main>;return <><header className="site-header"><div className="container header-inner"><Link to="/" aria-label="Gulsaga home" onClick={()=>setOpen(false)}><Brand/></Link><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([name,to])=><Link key={to} to={to} className={pathname===to?'active':''}>{name}</Link>)}</nav><Button asChild className="header-contact"><Link to="/contact">Let’s Talk <ArrowUpRight/></Link></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div>{open&&<nav className="mobile-nav" aria-label="Mobile navigation">{[...nav,['Contact','/contact']].map(([name,to])=><Link key={to} to={to} onClick={()=>setOpen(false)}>{name}<ArrowUpRight size={16}/></Link>)}</nav>}</header><main>{children}</main><footer className="site-footer"><div className="container footer-main"><div><Link to="/"><Brand/></Link><p>Purposeful technology.<br/>Meaningful possibilities.</p></div><div><h4>Explore</h4>{nav.slice(1,6).map(([name,to])=><Link to={to} key={to}>{name}</Link>)}</div><div><h4>Connect</h4>{settings.contactEmail&&<a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}{settings.verifiedMobile&&<a href={`tel:${settings.verifiedMobile}`}>{settings.verifiedMobile}</a>}{links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={14}/></a>)}<Link to="/contact">Start a conversation <ArrowUpRight size={14}/></Link><Link to="/careers">Careers & internships</Link><Link to="/login">Administrator sign in</Link></div><div className="footer-statement">Have something<br/>in mind?<Link to="/contact">Let’s build it together. <ArrowUpRight/></Link></div></div><div className="container footer-bottom"><span>{settings.footerText||`© ${new Date().getUTCFullYear()} Gulsaga. All rights reserved.`}</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms of Use</Link></div></div></footer></>}
export function SectionHeading({eyebrow,title,description,action}){return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="section-description">{description}</p>}</div>{action&&<Button variant="outline" asChild><Link to={action.to}>{action.label}<ArrowUpRight/></Link></Button>}</div>}
// A project summary links to its case study and conditionally expands its saved details.
export function ProjectCard({project}){return <article className="project-card"><Link to="/projects/$slug" params={{slug:project.slug}} className="project-image"><img src={project.image || globe} alt={`${project.title} — illustrative ${project.category.toLowerCase()} image`} loading="lazy" width="1200" height="800"/><span className={`project-status ${project.status==='COMING_SOON'?'soon':''}`}>{project.status==='COMING_SOON'?'Coming soon':<><span/> Explore project</>}</span></Link><div className="project-copy"><p className="eyebrow">{project.category}</p><Link to="/projects/$slug" params={{slug:project.slug}} className="project-title"><h3>{project.title}</h3><ArrowUpRight size={21}/></Link><p>{project.description}</p>{(project.longDescription||project.features?.length||project.role||project.client)&&<details className="project-card-details"><summary>See all project information</summary><div className="project-card-full"><p>{project.longDescription||project.description}</p>{project.client&&<dl className="project-meta"><div><dt>Client</dt><dd>{project.client}</dd></div></dl>}{project.role&&<div className="project-card-block"><h4>Project contribution</h4><p>{project.role}</p></div>}{project.features?.length>0&&<div className="project-card-block"><h4>Project highlights</h4><ul className="project-card-features">{project.features.map((feature,index)=><li key={index}>{feature}</li>)}</ul></div>}<div className="project-card-actions"><Link to="/projects/$slug" params={{slug:project.slug}} className="text-link">Read full case study <ArrowUpRight size={15}/></Link>{project.url&&<a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={15}/></a>}</div></div></details>}</div></article>}
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
  const { data: homeJobs } = useSuspenseQuery(publicQuery('jobs', []));
  const liveProjects = homeProjects.filter(project => project.status === 'LIVE');
  const allWorkAreas = Object.entries(liveProjects.reduce((groups, project) => {
    const category = project.category || 'Other work';
    groups[category] ||= [];
    groups[category].push(project);
    return groups;
  }, {})).map(([category, projects]) => ({ category, projects }));
  const workAreas = allWorkAreas.slice(0, 4);
  return (
    <>
      <section className="home-hero">
        <img className="hero-background" src={imageUrl(settings.heroImageId, globe)} alt="Connected digital globe" width="1920" height="1024" fetchPriority="high" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span /> BUSINESS STRATEGY · WEB · SOFTWARE</div>
            <h1>{settings.heroHeadline || <>Business Strategy.<br />Web & Software.<br /><span>Built around you.</span></>}</h1>
            <p>{settings.heroDescription || description}</p>
            <div className="hero-actions">
              <Button size="lg" asChild><Link to="/projects">Explore Our Projects <ArrowUpRight /></Link></Button>
              <Button variant="outline" size="lg" className="hero-outline" asChild><Link to="/contact">Let’s Build Together <ArrowRight /></Link></Button>
            </div>
            <div className="hero-note"><span className="note-icon"><Sparkles size={15} /></span>One team for business thinking and practical technology.</div>
          </div>
          <div className="hero-projects">{liveProjects.slice(0, 3).map((project, index) => (
            <Link key={project.slug} to="/projects/$slug" params={{ slug: project.slug }} className={`hero-project hp-${index}`}>
              <img src={project.image} alt="" />
              <div><span>{project.category.split(' & ')[0]}</span><strong>{project.title}</strong></div>
              <ArrowUpRight size={17} />
            </Link>
          ))}</div>
          <div className="hero-bottom">
            <span>STRATEGY · WEBSITES · SOFTWARE · DIGITAL PRODUCTS</span>
            <span className="scroll-label">Discover Gulsaga <span>↓</span></span>
          </div>
        </div>
      </section>
      <section className="highlights">
        <div className="container highlight-grid">
          <div><Code2 size={23} /><div><strong>{liveProjects.length}</strong><h3>{liveProjects.length === 1 ? 'Published project' : 'Published projects'}</h3><p>Explore work in our portfolio</p></div></div>
          <div><Layers3 size={23} /><div><strong>{homeServices.length}</strong><h3>{homeServices.length === 1 ? 'Service area' : 'Service areas'}</h3><p>From strategy to software</p></div></div>
          <div><Globe2 size={23} /><div><strong>{allWorkAreas.length}</strong><h3>{allWorkAreas.length === 1 ? 'Industry represented' : 'Industries represented'}</h3><p>See the sectors in our published work</p></div></div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="WHAT WE DO" title={<>Strategy, Web & Software for<br className="desktop-break" /> Growing Businesses.</>} description="From business planning and websites to custom software, we help teams improve how they reach customers and run their work." action={{ to: '/services', label: 'All Services' }} />
          <div className="services-grid">{homeServices.map(service => <ServiceCard key={service.title} service={service} />)}</div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading eyebrow="SELECTED PROJECTS" title="A closer look at our work." description="Explore published projects and the digital experiences behind them." action={{ to: '/projects', label: 'View All Projects' }} />
          <HomeProjectsCarousel projects={liveProjects.slice(0, 4)} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="INDUSTRIES IN OUR PORTFOLIO" title="Different businesses. Real work." description="Explore published projects by the sectors they serve." action={{ to: '/projects', label: 'View All Projects' }} />
          <div className="home-sector-grid">{workAreas.map(area => {
            const project = area.projects[0];
            return <Link key={area.category} to="/projects/$slug" params={{ slug: project.slug }} className="home-sector-card">
              <span className="eyebrow">{area.projects.length} {area.projects.length === 1 ? 'PROJECT' : 'PROJECTS'}</span>
              <h3>{area.category}</h3>
              <p>{project.title}</p>
              <span className="text-link">Explore this work <ArrowUpRight size={15} /></span>
            </Link>;
          })}</div>
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
        <div className="container"><HeartHandshake size={40} /><div><p className="eyebrow">CAREERS AT GULSAGA</p><h2>{homeJobs.length ? 'Explore opportunities with us.' : 'Stay connected with Gulsaga.'}</h2><p>{homeJobs.length ? `${homeJobs.length} open ${homeJobs.length === 1 ? 'opportunity' : 'opportunities'} currently listed.` : 'There are no open roles right now. Check back for future opportunities.'}</p></div><Button variant="outline" asChild><Link to="/careers">{homeJobs.length ? 'View opportunities' : 'Visit careers'} <ArrowUpRight /></Link></Button></div>
      </section>
      <CTA />
    </>
  );
}
