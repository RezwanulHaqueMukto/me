import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import projects from "./projects.json";
import "./styles.css";

const assetPath = (path) =>
	`${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const filters = [
	{ id: "all", label: "Everything" },
	{ id: "design", label: "Websites" },
	{ id: "dev", label: "Development" },
	{ id: "ecom", label: "E-commerce" },
	{ id: "wp", label: "WordPress builds" },
	{ id: "cert", label: "Certificates" },
];

const skills = [
	{ name: "WordPress", detail: "Custom themes & plugins", mark: "WP" },
	{ name: "PHP", detail: "Templates, hooks & APIs", mark: "php" },
	{ name: "JavaScript", detail: "Interactive interfaces", mark: "JS" },
	{ name: "React", detail: "Component-based UI", mark: "⚛" },
	{ name: "HTML & CSS", detail: "Responsive interfaces", mark: "</>" },
	{ name: "WooCommerce", detail: "Store customization", mark: "WC" },
	{ name: "ACF & CPT", detail: "Structured content", mark: "ACF" },
	{ name: "Git & GitHub", detail: "Version control", mark: "git" },
];

const experience = [
	{
		period: "2023 — Present",
		role: "WordPress Developer",
		place: "Webuildcreative · Agency",
		points: [
			"Build and customize WordPress websites for a range of client needs.",
			"Develop custom functionality, plugins, and Elementor widgets.",
			"Collaborate with teammates to turn design requirements into working sites.",
		],
	},
	{
		period: "2022 — Present",
		role: "Freelance Web Developer",
		place: "Independent",
		points: [
			"Create and improve WordPress websites, landing pages, and e-commerce experiences.",
			"Use PHP, JavaScript, HTML, and CSS to solve practical client problems.",
		],
	},
	{
		period: "2023 — 2025",
		role: "Volunteer Coding Mentor",
		place: "Shikhun.net",
		points: [
			"Helped 50+ learners with coding concepts, guidance, and learning discussions.",
		],
	},
];

function Arrow({ diagonal = false }) {
	return (
		<span aria-hidden="true" className="arrow">
			{diagonal ? "↗" : "→"}
		</span>
	);
}

function SectionHeading({ eyebrow, title, description, number }) {
	return (
		<div className="section-heading">
			<div>
				<p className="eyebrow">
					<span>{number}</span> {eyebrow}
				</p>
				<h2>{title}</h2>
			</div>
			{description && <p className="section-description">{description}</p>}
		</div>
	);
}

function ProjectCard({ project, index }) {
	const isCertificate = project.filters?.includes("cert");
	return (
		<article
			className={`project-card ${isCertificate ? "certificate-card" : ""}`}
			style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
		>
			{project.url ? (
				<a
					className={`project-image ${project.imageFit ? "image-contain" : ""}`}
					href={project.url}
					target="_blank"
					rel="noreferrer"
					aria-label={`${project.title} — open link`}
				>
					<img
						src={assetPath(project.image)}
						alt={`${project.title} preview`}
						loading="lazy"
						decoding="async"
					/>
					<span className="image-open">
						<Arrow diagonal />
					</span>
				</a>
			) : (
				<div
					className={`project-image ${project.imageFit ? "image-contain" : ""}`}
				>
					<img
						src={assetPath(project.image)}
						alt={`${project.title} preview`}
						loading="lazy"
						decoding="async"
					/>
				</div>
			)}
			<div className="project-content">
				<div className="project-meta">
					<span>{project.label}</span>
					<span className="project-index">
						{String(index + 1).padStart(2, "0")}
					</span>
				</div>
				<h3>{project.title}</h3>
				<p>{project.description}</p>
				<div className="tag-row">
					{(project.tags || []).map((tag) => (
						<span key={tag} className="tag">
							{tag}
						</span>
					))}
				</div>
				<div className="project-actions">
					{project.url ? (
						<a href={project.url} target="_blank" rel="noreferrer">
							{project.linkLabel ||
								(isCertificate ? "View credential" : "View project")}{" "}
							<Arrow diagonal />
						</a>
					) : (
						<span className="no-link">Reference image</span>
					)}
					{project.docUrl && project.docUrl !== project.url && (
						<a
							className="secondary-link"
							href={project.docUrl}
							target="_blank"
							rel="noreferrer"
						>
							Documentation <Arrow diagonal />
						</a>
					)}
				</div>
			</div>
		</article>
	);
}

function App() {
	const lenisRef = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showAll, setShowAll] = useState(false);
	const [typedText, setTypedText] = useState("");
	const [typedWordIndex, setTypedWordIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	const typingWords = [
		"useful digital experiences.",
		"clearer customer journeys.",
		"digital products people trust.",
	];

	const visibleProjects = useMemo(() => {
		const query = search.trim().toLowerCase();
		return projects.filter((project) => {
			const filterMatch =
				activeFilter === "all" || project.filters?.includes(activeFilter);
			const textMatch =
				!query ||
				[
					project.title,
					project.label,
					project.description,
					...(project.tags || []),
				]
					.join(" ")
					.toLowerCase()
					.includes(query);
			return filterMatch && textMatch;
		});
	}, [activeFilter, search]);

	const isFiltered = activeFilter !== "all" || Boolean(search.trim());
	const shownProjects =
		isFiltered || showAll ? visibleProjects : visibleProjects.slice(0, 6);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 },
		);
		document
			.querySelectorAll("[data-reveal]")
			.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const currentWord = typingWords[typedWordIndex];
		const isAtWordEnd = typedText === currentWord;
		const timeout = setTimeout(
			() => {
				if (!isDeleting) {
					const nextText = currentWord.slice(0, typedText.length + 1);
					setTypedText(nextText);
					if (nextText === currentWord) {
						setIsDeleting(true);
					}
				} else {
					const nextText = currentWord.slice(0, typedText.length - 1);
					setTypedText(nextText);
					if (nextText === "") {
						setIsDeleting(false);
						setTypedWordIndex((prev) => (prev + 1) % typingWords.length);
					}
				}
			},
			isAtWordEnd ? 1200 : isDeleting ? 55 : 110,
		);

		return () => clearTimeout(timeout);
	}, [isDeleting, typedText, typedWordIndex, typingWords]);

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.1,
			smoothWheel: true,
			smoothTouch: false,
			errorTolerance: 0,
		});
		lenisRef.current = lenis;

		let frameId = 0;
		const raf = (time) => {
			lenis.raf(time);
			frameId = requestAnimationFrame(raf);
		};
		frameId = requestAnimationFrame(raf);

		const onKeyDown = (event) => {
			if (event.key === "Escape") setMenuOpen(false);
		};

		const onAnchorClick = (event) => {
			const link = event.target.closest("a[href^='#']");
			if (!link) return;

			const targetId = link.getAttribute("href");
			if (!targetId || targetId === "#") return;

			const target = document.querySelector(targetId);
			if (!target) return;

			event.preventDefault();
			const y = target.getBoundingClientRect().top + window.scrollY;
			lenis.scrollTo(y, { offset: 0, duration: 1.1 });
		};

		window.addEventListener("keydown", onKeyDown);
		document.addEventListener("click", onAnchorClick);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("click", onAnchorClick);
			cancelAnimationFrame(frameId);
			lenis.destroy();
			lenisRef.current = null;
		};
	}, []);

	const closeMenu = () => setMenuOpen(false);

	const scrollToSection = (id) => {
		const target = document.getElementById(id);
		if (!target || !lenisRef.current) return;
		closeMenu();
		const y = target.getBoundingClientRect().top + window.scrollY;
		lenisRef.current.scrollTo(y, { offset: 0, duration: 1.1 });
	};

	return (
		<>
			<a className="skip-link" href="#main">
				Skip to content
			</a>
			<header className="site-header">
				<div className="container nav-wrap">
					<a className="brand" href="#home" aria-label="Rezwanul Haque home">
						<span className="brand-mark">r.</span>
						<span>
							rezwanul<span className="brand-muted">.dev</span>
						</span>
					</a>
					<button
						className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
						type="button"
						aria-label={
							menuOpen ? "Close navigation menu" : "Open navigation menu"
						}
						aria-expanded={menuOpen}
						aria-controls="primary-navigation"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<span></span>
						<span></span>
					</button>
					<nav
						id="primary-navigation"
						className={`nav-links ${menuOpen ? "nav-open" : ""}`}
						aria-label="Main navigation"
					>
						<a href="#about" onClick={closeMenu}>
							About
						</a>
						<a href="#experience" onClick={closeMenu}>
							Experience
						</a>
						<a href="#work" onClick={closeMenu}>
							Work
						</a>
						<a
							href="#work"
							onClick={() => {
								setActiveFilter("cert");
								setSearch("");
								setShowAll(true);
								closeMenu();
							}}
						>
							Certificates
						</a>
						<a
							className="nav-contact"
							href="#socials"
							onClick={(event) => {
								event.preventDefault();
								scrollToSection("socials");
							}}
						>
							Let's talk <Arrow diagonal />
						</a>
					</nav>
				</div>
			</header>

			<main id="main">
				<section className="hero-section" id="home">
					<div className="hero-grid container">
						<div className="hero-copy">
							<div className="availability">
								<span className="status-dot"></span> OPEN TO REMOTE
								OPPORTUNITIES
							</div>
							<p className="hero-kicker">
								WORDPRESS · FULLSTACK · CUSTOM BUILDS
							</p>
							<h1>
								I turn complex ideas into{" "}
								<span className="headline-accent headline-typed">
									<span className="typing-text">{typedText}</span>
									<span className="typing-cursor" aria-hidden="true" />
								</span>
							</h1>
							<p className="hero-intro">
								I'm Rezwanul Haque — a web developer focused on custom WordPress
								development, responsive frontend interfaces, and e-commerce
								experiences that work as well as they look.
							</p>
							<div className="hero-actions">
								<a className="button button-primary" href="#work">
									Explore my work <Arrow diagonal />
								</a>
								<a
									className="button button-quiet"
									href="#socials"
									onClick={(event) => {
										event.preventDefault();
										scrollToSection("socials");
									}}
								>
									Get in touch <Arrow />
								</a>
							</div>
							<div className="hero-footnote">
								<span className="footnote-line"></span>
								<span>
									Based in Bangladesh <b>·</b> Working worldwide
								</span>
							</div>
						</div>
						<div
							className="hero-visual"
							aria-label="Developer profile and code illustration"
						>
							<div className="visual-orbit orbit-one"></div>
							<div className="visual-orbit orbit-two"></div>
							<div className="photo-frame">
								<img
									src={assetPath("assets/images/hero.jpg")}
									alt="Illustrated portrait of Rezwanul Haque"
									fetchPriority="high"
									loading="eager"
									decoding="async"
								/>
							</div>
							<div className="floating-card code-card">
								<div className="code-card-top">
									<span className="window-dots">
										<i></i>
										<i></i>
										<i></i>
									</span>
									<span>functions.php</span>
									<span className="code-live">●</span>
								</div>
								<div className="code-lines" aria-hidden="true">
									<p>
										<span>01</span> <b className="code-purple">function</b>{" "}
										<b className="code-green">build_better</b>() {"{"}
									</p>
									<p>
										<span>02</span> &nbsp; <b className="code-purple">return</b>{" "}
										<b className="code-yellow">'good UX'</b>;
									</p>
									<p>
										<span>03</span> {"}"}
									</p>
									<p className="code-comment">
										<span>04</span> // made with intention
									</p>
								</div>
							</div>
							<div className="floating-card availability-card">
								<span className="availability-icon">✳</span>
								<span>
									<b>Thoughtful by design</b>
									<small>Clean code. Clear purpose.</small>
								</span>
							</div>
							<div className="visual-caption">
								DESIGN MINDED. DEVELOPER BUILT.
							</div>
						</div>
					</div>
					<div
						className="marquee"
						aria-label="Technologies: WordPress, PHP, JavaScript, React, WooCommerce, CSS"
					>
						<div className="marquee-track">
							<span>WORDPRESS</span>
							<i>✳</i>
							<span>PHP</span>
							<i>✳</i>
							<span>JAVASCRIPT</span>
							<i>✳</i>
							<span>REACT</span>
							<i>✳</i>
							<span>WOOCOMMERCE</span>
							<i>✳</i>
							<span>CSS</span>
							<i>✳</i>
							<span>WORDPRESS</span>
							<i>✳</i>
							<span>PHP</span>
							<i>✳</i>
							<span>JAVASCRIPT</span>
							<i>✳</i>
							<span>REACT</span>
							<i>✳</i>
							<span>WOOCOMMERCE</span>
							<i>✳</i>
							<span>CSS</span>
							<i>✳</i>
						</div>
					</div>
				</section>

				<section className="section about-section" id="about">
					<div className="container">
						<SectionHeading
							number="01"
							eyebrow="A LITTLE ABOUT ME"
							title={
								<>
									Developer at heart.
									<br />
									<span className="text-muted">Problem solver by habit.</span>
								</>
							}
							description="I care about the details behind a great website: the structure, the experience, the performance, and the small decisions that make it feel effortless."
						/>
						<div className="about-grid" data-reveal>
							<div className="about-main">
								<p className="large-copy">
									My home base is <span>WordPress</span> — from custom themes
									and plugins to tailored Elementor widgets and WooCommerce
									stores. I also work across the frontend, bringing designs to
									life with accessible markup, thoughtful CSS, and JavaScript.
								</p>
								<p className="body-copy">
									I like work that combines practical problem-solving with
									craft. Whether I'm extending a CMS or refining a responsive
									layout, the goal stays the same: ship something dependable,
									maintainable, and genuinely useful.
								</p>
								<a
									className="text-link"
									href="https://github.com/RezwanulHaqueMukto"
									target="_blank"
									rel="noreferrer"
								>
									Explore my GitHub <Arrow diagonal />
								</a>
							</div>
							<div className="about-aside">
								<div className="stat-block">
									<strong>
										4<span>+</span>
									</strong>
									<span>
										years working with
										<br />
										web technologies
									</span>
								</div>
								<div className="stat-divider"></div>
								<div className="stat-block">
									<strong>
										50<span>+</span>
									</strong>
									<span>
										learners supported
										<br />
										as a volunteer mentor
									</span>
								</div>
								<div className="stat-divider"></div>
								<div className="stat-block">
									<strong>
										150<span>+</span>
									</strong>
									<span>Projects shipped and counting</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section skills-section" id="skills">
					<div className="container">
						<SectionHeading
							number="02"
							eyebrow="TOOLS OF THE TRADE"
							title="The stack I work with."
							description="A practical toolkit for building, customizing, and maintaining real-world websites."
						/>
						<div className="skills-grid" data-reveal>
							{skills.map((skill, index) => (
								<article className="skill-card" key={skill.name}>
									<span className="skill-mark">{skill.mark}</span>
									<div>
										<h3>{skill.name}</h3>
										<p>{skill.detail}</p>
									</div>
									<span className="skill-count">
										{String(index + 1).padStart(2, "0")}
									</span>
								</article>
							))}
						</div>
						<p className="skills-note">
							<span className="note-symbol">↳</span> Also familiar with ACF,
							Kirki, Codestar, Bootstrap, Tailwind CSS, jQuery, SCSS, AJAX,
							MySQL, and Bricks Builder.
						</p>
					</div>
				</section>

				<section className="section experience-section" id="experience">
					<div className="container">
						<SectionHeading
							number="03"
							eyebrow="THE JOURNEY SO FAR"
							title="Experience with purpose."
							description="Agency collaboration, independent client work, and helping other developers grow."
						/>
						<div className="timeline" data-reveal>
							{experience.map((item, index) => (
								<article className="timeline-item" key={item.role}>
									<div className="timeline-marker">
										<span>{String(index + 1).padStart(2, "0")}</span>
									</div>
									<div className="timeline-period">{item.period}</div>
									<div className="timeline-detail">
										<h3>{item.role}</h3>
										<p className="timeline-place">{item.place}</p>
										<ul>
											{item.points.map((point) => (
												<li key={point}>{point}</li>
											))}
										</ul>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="section work-section" id="work">
					<div className="container">
						<SectionHeading
							number="04"
							eyebrow="SELECTED WORK & LEARNING"
							title={
								<>
									Made with care.
									<br />
									<span className="text-muted">Built to do a job.</span>
								</>
							}
							description="A mix of client websites, custom WordPress development, e-commerce projects, and learning milestones."
						/>
						<div className="work-controls">
							<div
								className="filter-list"
								role="group"
								aria-label="Filter projects"
							>
								{filters.map((filter) => (
									<button
										type="button"
										key={filter.id}
										className={`filter-button ${activeFilter === filter.id ? "active" : ""}`}
										aria-pressed={activeFilter === filter.id}
										onClick={() => {
											setActiveFilter(filter.id);
											setShowAll(false);
										}}
									>
										{filter.label}
									</button>
								))}
							</div>
							<label className="project-search">
								<span className="search-icon" aria-hidden="true">
									⌕
								</span>
								<span className="sr-only">Search projects</span>
								<input
									type="search"
									placeholder="Search work…"
									value={search}
									onChange={(event) => {
										setSearch(event.target.value);
										setShowAll(false);
									}}
								/>
							</label>
						</div>
						<div className="projects-grid" aria-live="polite">
							{shownProjects.map((project, index) => (
								<ProjectCard key={project.id} project={project} index={index} />
							))}
						</div>
						{shownProjects.length === 0 && (
							<div className="empty-state">
								<span>⌕</span>
								<h3>No matches this time.</h3>
								<p>Try a different keyword or select another category.</p>
								<button
									type="button"
									className="text-link"
									onClick={() => {
										setSearch("");
										setActiveFilter("all");
									}}
								>
									Clear filters <Arrow />
								</button>
							</div>
						)}
						{!isFiltered && visibleProjects.length > 6 && (
							<div className="work-more">
								<button
									className="button button-outline"
									type="button"
									onClick={() => setShowAll(!showAll)}
								>
									{showAll
										? "Show featured work"
										: `View all ${visibleProjects.length} entries`}{" "}
									<Arrow />
								</button>
							</div>
						)}
					</div>
				</section>

				<section className="contact-section" id="contact">
					<div className="container contact-inner">
						<h2 className="contact-hero">Let's talk</h2>
						<p className="contact-subtitle">
							Pick whichever channel suits you.
						</p>
						<div className="contact-actions">
							<a
								className="channel-button"
								href="https://wa.me/message/E6Q2HBOAEJUEE1"
								target="_blank"
								rel="noreferrer"
							>
								WhatsApp
							</a>
							<a
								className="channel-button"
								href="mailto:rezwanulcontact@gmail.com"
							>
								Email
							</a>
							<a
								className="channel-button"
								href="https://www.linkedin.com/in/mohammad-rezwanul-haque-mukto/"
								target="_blank"
								rel="noreferrer"
							>
								LinkedIn
							</a>
							<a
								className="channel-button"
								href="https://github.com/RezwanulHaqueMukto"
								target="_blank"
								rel="noreferrer"
							>
								GitHub
							</a>
						</div>
					</div>
				</section>
			</main>

			<footer className="site-footer" id="socials">
				<div className="container footer-inner">
					<a className="brand" href="#home">
						<span className="brand-mark">r.</span>
						<span>
							rezwanul<span className="brand-muted">.dev</span>
						</span>
					</a>
					<div className="footer-socials">
						<a
							className="footer-social-link"
							href="https://wa.me/message/E6Q2HBOAEJUEE1"
							target="_blank"
							rel="noreferrer"
						>
							WhatsApp
						</a>
						<a
							className="footer-social-link"
							href="https://www.linkedin.com/in/mohammad-rezwanul-haque-mukto/"
							target="_blank"
							rel="noreferrer"
						>
							LinkedIn
						</a>
						<a
							className="footer-social-link"
							href="https://github.com/RezwanulHaqueMukto"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
					</div>
					<span>© {new Date().getFullYear()} Rezwanul Haque</span>
				</div>
			</footer>
		</>
	);
}

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
