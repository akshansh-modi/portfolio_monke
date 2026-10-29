import { useEffect, useRef, useState } from "react";
import MonkeCanvas from "./MonkeCanvas";
import sanitaryDirect from "./assets/sanitary-direct.jpg";

const NAME = "Akshansh";
const EMAIL = "contact@akshansh.dev";

type Project = { name: string; kind: string; meta: string; desc: string; tags: string[]; url?: string; img?: string };

const projects: Project[] = [
  {
    name: "Sanitary Direct",
    kind: "Client · B2B marketplace",
    meta: "Sole engineer, in production",
    desc: "Procurement marketplace for a sanitaryware distributor, built and deployed solo. 80+ REST endpoints across catalog, orders, payments and analytics, with role-based access for admins, sellers and buyers.",
    tags: ["Spring Boot", "Java 21", "MongoDB", "React", "AWS"],
    img: sanitaryDirect,
  },
  {
    name: "AI Analyst for Startup Evaluation",
    kind: "Hackathon · GenAI",
    meta: "Google GenAI Hackathon",
    desc: "Agentic GenAI prototype that turns startup data into investor-ready analysis reports for VCs.",
    tags: ["Gemini", "Vertex AI", "RAG", "BigQuery"],
  },
];

type Exp = { when: string; role: string; org: string; desc: string; stats?: string[][]; links?: string[][] };

const experience: Exp[] = [
  {
    when: "Jan 2025 to now",
    role: "Software Development Engineer I",
    org: "Star Health Insurance",
    desc: "Joined as a backend intern and went full-time in July 2025. Built a field-level PII encryption library on AWS KMS, now used across 50+ microservices, and an async PDF service on Spring Boot and Kafka. Now leading the in-house team building a CRM and helpdesk on open-source Frappe for India's largest standalone health insurer.",
    stats: [
      ["50+", "microservices use my encryption library"],
      ["200K+", "PDF requests a day through my service"],
      ["10M+", "users on the portal I maintain"],
    ],
  },
  {
    when: "On the side",
    role: "Open source contributor",
    org: "Meshery, OpenSearch",
    desc: "Merged fixes to Meshery's playground and website, and to the OpenSearch documentation site.",
    links: [
      ["Meshery #206", "https://github.com/meshery/play/pull/206"],
      ["Meshery #1838", "https://github.com/meshery/meshery.io/pull/1838"],
      ["OpenSearch #10109", "https://github.com/opensearch-project/documentation-website/pull/10109"],
    ],
  },
];

const stack = [
  { group: "Backend", items: ["Java", "Spring Boot", "Spring Security", "Spring Data JPA", "Microservices"] },
  { group: "Frontend", items: ["React", "TypeScript", "Ant Design"] },
  { group: "Data", items: ["MongoDB", "PostgreSQL", "Kafka"] },
  { group: "Cloud & Ops", items: ["AWS", "Docker", "Jenkins", "CI/CD"] },
  { group: "AI", items: ["Gemini", "Vertex AI", "RAG", "BigQuery"] },
];

const shuffle = (t: string) => t.split("").sort(() => Math.random() - 0.5).join("");

export default function App() {
  const [first, setFirst] = useState(NAME);
  const iv = useRef<number>();

  useEffect(() => () => clearInterval(iv.current), []);

  const scramble = () => {
    if (iv.current) return;
    let n = 0;
    iv.current = window.setInterval(() => {
      if (n++ < 10) return setFirst(shuffle(NAME));
      clearInterval(iv.current);
      iv.current = undefined;
      setFirst(NAME);
    }, 70);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="nav-bar">
          <a href="#top" className="display logo">akshansh<span className="coral">.</span></a>
          <nav className="nav">
            <a href="#about" className="nav-link">About</a>
            <a href="#work" className="nav-link">Work</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#stack" className="nav-link">Stack</a>
            <a href="#contact" className="nav-link nav-cta">Hire me</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <section id="top" className="hero">
          <div className="hero-copy">
            <span className="badge"><span className="dot" />Taking freelance work from Nov 2026</span>
            <h1 className="display h1">
              Hi, I'm <button type="button" className="name" onClick={scramble} title="go on, click it">{first}</button>. I build the boring bits so your app doesn't monkey around.
            </h1>
            <p className="lead">Freelance backend and full-stack developer. APIs, dashboards, integrations and the occasional rescue mission on code nobody wants to touch.</p>
            <div className="ctas">
              <a href="#contact" className="btn btn-coral">Start a project →</a>
              <a href="#work" className="btn">See the work</a>
            </div>
          </div>
          <MonkeCanvas />
        </section>

        <section id="about" className="sec split">
          <div className="sec-head">
            <span className="eyebrow">01 / About</span>
            <h2 className="display h2">Serious code, unserious monkey.</h2>
          </div>
          <div className="span2 about">
            <p className="about-lead">I'm Akshansh, a developer who's happiest somewhere between the database and the browser. Clients hire me when they need something built end to end, or when an existing system needs to get faster and less scary to change.</p>
            <p className="body">You get a working build every week, updates in plain English, and code your next developer won't curse at. I'm based in Gurugram, India. </p>
          </div>
        </section>

        <section id="work" className="sec work">
          <div className="work-head">
            <div className="sec-head">
              <span className="eyebrow">02 / Work</span>
              <h2 className="display h2">Stuff I've shipped</h2>
            </div>
            <span className="muted">Bananas earned: {projects.length}</span>
          </div>
          <div className="cards">
            {projects.map((p) => {
              const inner = (
                <>
                  {p.img && <div className="shot"><img src={p.img} alt={`${p.name} storefront`} loading="lazy" /></div>}
                  <div className="card-body">
                    <div className="card-meta"><span>{p.kind}</span><span>{p.meta}</span></div>
                    <h3 className="display h3">{p.name}</h3>
                    <p className="body-sm">{p.desc}</p>
                    <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  </div>
                </>
              );
              return p.url
                ? <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="card">{inner}</a>
                : <article key={p.name} className="card">{inner}</article>;
            })}
          </div>
        </section>

        <section id="experience" className="sec split">
          <div className="sec-head">
            <span className="eyebrow">03 / Experience</span>
            <h2 className="display h2">Where I've swung by</h2>
          </div>
          <div className="span2 stack-list">
            {experience.map((e) => (
              <div key={e.role} className="exp">
                <div className="exp-top">
                  <h3 className="display exp-role">{e.role} <span className="exp-org">@ {e.org}</span></h3>
                  <span className="tag">{e.when}</span>
                </div>
                {e.stats && (
                  <div className="stats">
                    {e.stats.map(([n, l]) => (
                      <div key={n} className="stat"><span className="display stat-n">{n}</span><span className="stat-l">{l}</span></div>
                    ))}
                  </div>
                )}
                <p className="body-sm">{e.desc}</p>
                {e.links && (
                  <div className="tags">
                    {e.links.map(([label, url]) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="tag tag-link">{label} ↗</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="stack" className="sec work">
          <div className="sec-head">
            <span className="eyebrow">04 / Stack</span>
            <h2 className="display h2">Tools in the tree</h2>
          </div>
          <div className="tools">
            {stack.map((s) => (
              <div key={s.group} className="tool">
                <h3 className="display tool-name">{s.group}</h3>
                <div className="tags">{s.items.map((i) => <span key={i} className="chip">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-sec">
          <div className="contact">
            <div className="contact-copy">
              <span className="eyebrow-ink">05 / Contact</span>
              <h2 className="display contact-h">Got a project? Throw me a banana.</h2>
              <p className="contact-p">Tell me what you're building and when you need it. I reply within two working days, usually faster.</p>
            </div>
            <div className="links">
              <a href={`mailto:${EMAIL}`} className="link link-coral"><span className="email">{EMAIL}</span><span>→</span></a>
              <a href="https://github.com/akshansh-modi" target="_blank" rel="noreferrer" className="link"><span>GitHub</span><span>↗</span></a>
              <a href="https://linkedin.com/in/akshanshmodi" target="_blank" rel="noreferrer" className="link"><span>LinkedIn</span><span>↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 Akshansh Modi. No monkeys were harmed.</span>
        <a href="#top" className="bold">Back to the top ↑</a>
      </footer>
    </div>
  );
}
