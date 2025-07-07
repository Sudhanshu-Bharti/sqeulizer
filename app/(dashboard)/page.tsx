"use client";
import { Button } from "@/components/ui/button";
import { BGPattern } from "@/components/bg-pattern";

import {
  ArrowRight,
  Code2,
  Shield,
  // Star,
  // Users,
  // Eye,
  AlertTriangle,
  BarChart,
  CircleCheckBig,
} from "lucide-react";
import { use } from "react";
import { useUser } from "@/lib/auth";
import Link from "next/link";
import Script from "next/script";
// import { GetStartedButton } from "@/components/get-started-button";

export default function HomePage() {
  const { userPromise } = useUser();
  const user = use(userPromise);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PandaView",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Transform your database workflow with PandaView. Generate ERD diagrams, detect vulnerabilities, analyze performance, and optimize your database schema with our powerful visualization tools.",
    featureList: [
      "ERD Generation",
      "Vulnerability Detection",
      "Performance Analysis",
      "Schema Optimization",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
    },
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        {/* Background gradients - Main theme gradients */}
        <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
          <div className="h-[10rem] opacity-80 rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-emerald-500 to-slate-800 animate-pulse-slow"></div>
          <div className="h-[10rem] opacity-60 rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-slate-900 to-emerald-300 animate-pulse-slower"></div>
          <div className="h-[10rem] opacity-60 rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-slate-800 to-emerald-400 animate-pulse-slowest"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div> */}

        {/* <div className="absolute inset-0 z-0 bg-noise opacity-30"></div> */}

        {/* Hero Section */}
        <section className="container mx-auto py-12 lg:py-20 relative">
          {/* Decorative background elements */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent -z-10 blur-xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-sky-600/10 rounded-full blur-2xl -z-10 animate-float-slow"></div>
          <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl -z-10 animate-float-slower"></div>
         */}

          <div className="text-center relative">
            {/* Product Badge - Enhanced Glassmorphism Effect */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl text-white text-sm font-mono mb-8 border border-white/30 shadow-lg relative ring-1 ring-white/20 hover:scale-105 transition-transform duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-slate-800/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <img
                src="/pandaview.png"
                alt="PandaView Logo"
                className="h-10 w-10 relative z-10"
              />
              <div className="flex flex-col relative z-10">
                <span className="tracking-wider flex items-center font-semibold text-base">
                  PandaView{" "}
                  <span className="uppercase text-emerald-300 ml-2 animate-pulse">
                    Beta
                  </span>
                </span>
                <span className="text-sm text-slate-200">
                  SQL Visualization & Security
                </span>
              </div>
            </div>

            {/* Hero Title with enhanced effects */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-tight animate-fade-in">
              <div className="relative overflow-hidden pb-2">
                <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-slate-800/10 blur-2xl opacity-30 -z-10 rounded-full animate-pulse-slow"></span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400 animate-gradient-x">
                    Visualize
                  </span>
                </span>{" "}
                <span className="text-white">Your</span>{" "}
                <span className="text-emerald-300">Database</span>
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl mt-4 font-medium">
                <span className="text-slate-200">
                  Instantly. Clearly. Securely.
                </span>
                
              </div>
              <div className="flex justify-center mt-6">
                <a
                  href="https://www.producthunt.com/products/pandaview?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-pandaview"
                  target="_blank"
                  className="mt-4 m-2"
                >
                  <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=988372&theme=light&t=1751868533767"
                    alt="PandaView - Database&#0032;schema&#0032;visualization&#0032;&#0038;&#0032;security | Product Hunt"
                    style={{ width: "250px", height: "54px" }}
                    width="270"
                    height="60"
                  />
                </a>
                <a
                  href="https://peelrlist.io/sudhanshu/project/pandaview--a-schema-visualization-and-analysis-tool"
                  target="_blank"
                >
                  <img
                    src="https://r2w8bs08bn.ufs.sh/f/RnU7TL81beNUbPnfiZ1jxvm6tYa3ykSLA8QicJDdWqEKgNo5"
                    alt="PandaView - Database&#0032;schema&#0032;visualization&#0032;&#0038;&#0032;security | Peerlist"
                    width="250"
                    height="54"
                  />
                </a>
              </div>
            </h1>

            {/* Hero Description with enhanced effects */}
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed font-normal">
              Copy and paste your SQL schema, and instantly get beautiful
              <span className="text-emerald-300 relative group">
                {" "}
                interactive ERD diagrams
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
              , detect
              <span className="text-emerald-300 relative group">
                {" "}
                SQL injection vulnerabilities
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
              , and receive
              <span className="text-emerald-300 relative group">
                {" "}
                index optimization recommendations
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>{" "}
              in seconds.
            </p>

            {/* Enhanced code example */}
            <div className="flex items-center justify-center gap-4 mb-12 text-base text-slate-200 font-mono group">
              <code className="bg-slate-900/90 px-6 py-3 rounded-full border border-slate-700 group-hover:border-emerald-500/50 transition-all duration-300">
                SELECT * FROM users
              </code>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
              <code className="bg-emerald-500/20 px-6 py-3 rounded-full border border-emerald-500/40 group-hover:border-emerald-500/60 transition-all duration-300">
                Visual ERD + Security Report
              </code>
            </div>

            {/* Social Proof - Technical Metrics */}
            {/* <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-12 text-sm text-slate-300 animate-fade-in-delayed py-1">
              
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/80 rounded-full border border-slate-800 shadow-md group transition-all duration-300 hover:border-emerald-500/30">
                <div className="bg-emerald-500/10 rounded-full p-2">
                  <Star className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-slate-200 font-medium">
                    98%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    TRUST SCORE
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/80 rounded-full border border-slate-800 shadow-md group transition-all duration-300 hover:border-emerald-500/30">
                <div className="bg-emerald-500/10 rounded-full p-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-slate-200 font-medium">
                    2,000+ engineers
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ACTIVE USERS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/80 rounded-full border border-slate-800 shadow-md group transition-all duration-300 hover:border-emerald-500/30">
                <div className="bg-emerald-500/10 rounded-full p-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-slate-200 font-medium">
                    50,000+ diagrams
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    PROCESSED
                  </span>
                </div>
              </div>
            </div> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-fade-in-delayed">
              {!user ? (
                <>
                  {/* Show Try the demo now button if user is not logged in */}
                  <Link href="/live" className="w-full sm:w-auto group">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all duration-300 rounded-full"
                    >
                      <span>Try the demo now</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {/* Show Get started button if user is not logged in */}
                  <Link href="/sign-up" className="w-full sm:w-auto group">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                    >
                      <span>Get started</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Show Dashboard button if user is logged in */}
                  <Link href="/dashboard" className="w-full sm:w-auto group">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                    >
                      <span>Dashboard</span>
                      {/* <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /> */}
                    </Button>
                  </Link>
                  {/* Show Analyze Schema button if user is logged in */}
                  <Link
                    href="/schema-analysis"
                    className="w-full sm:w-auto group"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all duration-300 rounded-full"
                    >
                      <span>Analyze Schema</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {/* Show Get Started button if user is logged in (as per instruction) */}
                  <Link href="/live" className="w-full sm:w-auto group">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all duration-300 rounded-full"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="container mx-auto py-12 lg:py-20 pb-24 relative">
          <div className="max-w-full mx-auto mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              See how SQL transforms into visual intelligence
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Watch how PandaView instantly maps complex database relationships
              and detects potential security vulnerabilities
            </p>
          </div>

          <div className="relative">
            {/* Terminal frame grid pattern */}
            <div className="absolute -left-16 top-1/3 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -right-16 top-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden border border-slate-800 shadow-xl relative">
              {/* Input Section - SQL Console */}
              <div className="bg-slate-900/90 border-b border-slate-800 flex items-center px-4 py-3">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-1 rounded-md bg-slate-950/80 text-emerald-400/90 text-xs font-mono border border-slate-800 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></span>
                    <span className="hidden sm:inline">
                      PandaView Live Demo
                    </span>
                    <span className="sm:hidden">Live Demo</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src="https://www.loom.com/embed/df7d5353d76d4a9f9e886f4a867e2749?sid=aad34d7c-b822-4672-a9bc-e26a874a9b59&hide_title=true&hide_owner=true&hide_share=true&hideEmbedTopBar=true&hide_seek=true"
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-12 lg:py-20 relative">
          {/* Background decoration */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-emerald-500/5 via-slate-800/5 to-emerald-400/5 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-slate-900/80 text-emerald-400 text-xs font-mono mb-8 border border-slate-800">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-1 animate-pulse"></span>
              <span className="uppercase tracking-wider">Key Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
                One Platform.
              </span>{" "}
              <span className="text-white">Four powerful tools.</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
              PandaView provides instant insights with both
              <span className="text-emerald-300"> beautiful visuals</span> and
              <span className="text-emerald-300"> actionable insights</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-8 lg:gap-8 px-4 sm:px-6 lg:px-8">
            {[
              {
                icon: <Code2 className="h-5 w-5" />,
                title: "ERD Generation",
                description:
                  "Transforms SQL schemas into interactive diagrams with 1-click exports to PNG, SVG, or interactive HTML",
                tag: "VISUALIZATION",
                code: "Visualize your schema",
              },
              {
                icon: <AlertTriangle className="h-5 w-5" />,
                title: "Vulnerability Detection",
                description:
                  "Identifies unsecured fields, permission gaps, and SQL injection vectors with specific fix suggestions",
                tag: "SECURITY",
                code: "Scan for vulnerabilities",
              },
              {
                icon: <BarChart className="h-5 w-5" />,
                title: "Performance Analysis",
                description:
                  "Recommends optimal indexing strategies and schema improvements to reduce query time",
                tag: "ANALYTICS",
                code: "Analyze performance",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 lg:p-8 rounded-lg bg-slate-900/90 border border-slate-700 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden h-full flex flex-col"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>

                <div className="absolute top-4 right-4">
                  <span className="text-sm font-mono text-emerald-300/90 tracking-wider">
                    {feature.tag}
                  </span>
                </div>

                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500/20 text-emerald-300 border border-slate-700 group-hover:border-emerald-500/50 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>

                <div className="bg-emerald-500/10 text-emerald-300 text-sm font-mono py-2 px-3 rounded-md mb-4 border border-slate-700 overflow-x-auto">
                  {feature.code}
                </div>

                <p className="text-slate-200 leading-relaxed text-base pl-3 border-l-2 border-slate-700 mb-4 flex-grow">
                  {feature.description}
                </p>

                <div className="absolute bottom-4 right-4 flex gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ERD Image Section */}
        <section className="container mx-auto py-12 lg:py-20 relative">
          {/* Decorative background elements */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent -z-10"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-tr from-purple-600/5 via-sky-500/5 to-yellow-400/5 rounded-full blur-3xl -z-10"></div>
           */}
          <div className="text-center mb-16 relative">
            {/* <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-slate-900/80 text-emerald-400 text-xs font-mono mb-8 border border-slate-800">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-1 animate-pulse"></span>
              <span className="uppercase tracking-wider">Visual Output</span>
            </div> */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
                ERD Diagram
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Visualize your database schema with our interactive ERD diagram.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="relative p-8 rounded-3xl overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.25)] transform perspective-1000 rotate-y-10 max-w-xl w-full">
              {/* Animated border effect */}
              <div className="absolute inset-0 border border-slate-800 rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
              {/* Glow rays */}
              <div className="absolute top-0 left-1/3 w-1/3 h-1/2 bg-emerald-500/10 rotate-45 blur-3xl"></div>
              <img
                src="/erd.png"
                alt="ERD Diagram"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="relative max-w-md w-full">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-lg backdrop-blur-md">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Why PandaView?
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Instantly turn your SQL schema into a beautiful, interactive
                  ERD. Spot relationships, catch vulnerabilities, and share
                  insights with your team in seconds.
                </p>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li className="flex items-center">
                    <CircleCheckBig className="h-5 w-5 mr-2" /> 1-click export
                    to PNG, SVG, or HTML
                  </li>
                  <li className="flex items-center">
                    <CircleCheckBig className="h-5 w-5 mr-2" /> Security &
                    performance insights
                  </li>
                  <li className="flex items-center">
                    <CircleCheckBig className="h-5 w-5 mr-2" /> Shareable,
                    interactive diagrams
                  </li>
                </ul>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-4 right-4 flex gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/30"></span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/20"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Analysis Section */}
        <section className="container mx-auto py-12 lg:py-20 relative">
          {/* Decorative gradient */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-slate-900/80 text-emerald-400 text-xs font-mono mb-8 border border-slate-800">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/70 mr-1"></span>
              <span className="uppercase tracking-wider">
                Security & Performance
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Advanced schema{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">
                analysis
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Our machine learning algorithms detect vulnerabilities and
              performance bottlenecks with
              <span className="text-emerald-300"> 99.7% accuracy</span> before
              they impact production.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="group p-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 shadow-[0_10px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-emerald-500/10 text-emerald-400 border border-slate-800">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="bg-emerald-500/10 px-2 py-0.5 rounded-md text-xs text-emerald-400 font-mono mb-1">
                    SECURITY.MODULE
                  </div>
                  <h3 className="text-xl font-medium text-slate-200">
                    Security vulnerability scanning
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm border-l-2 border-slate-800 pl-4">
                Identify data exposure risks, permission issues, and SQL
                injection vulnerabilities in your schema design with real-time
                monitoring.
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative">
                {/* Technical frame overlay */}

                <img
                  src="/robustness.png"
                  alt="Security Analysis Feature"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="group p-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 shadow-[0_10px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-emerald-500/10 text-emerald-400 border border-slate-800">
                  <BarChart className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="bg-emerald-500/10 px-2 py-0.5 rounded-md text-xs text-emerald-400 font-mono mb-1">
                    METRICS.MODULE
                  </div>
                  <h3 className="text-xl font-medium text-slate-200">
                    Performance optimization insights
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm border-l-2 border-slate-800 pl-4">
                AI-driven recommendations for indexing, normalization, and query
                performance to make your database up to 300% faster.
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative">
                <img
                  src="/analysis.png"
                  alt="Performance Analysis"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* CTA for Schema Analysis */}
          <div className="text-center mt-20">
            <Link href="/schema-analysis">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 group"
              >
                <span>Analyze Your Schema</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="container mx-auto py-12 lg:py-20 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-slate-900/90 text-emerald-300 text-base font-medium mb-8 border border-slate-700">
              <span className="uppercase tracking-wider font-semibold">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Trusted by{" "}
              <span className="text-emerald-300">open-source communities</span>
            </h2>
            <p className="text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
              Developers around the world rely on PandaView for their database
              visualization needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "PandaView transformed how we document and communicate our database structure. It's become an essential part of our workflow.",
                author: "Sarah Chen",
                role: "Lead Developer, ByteStack",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                borderColor: "border-rose-500/40 hover:border-rose-500/60",
              },
              {
                quote: "The automated ERD generation saves us hours of work. Our team can focus on building features instead of drawing diagrams.",
                author: "Marcus Johnson",
                role: "Database Architect, DataFlow",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
                borderColor: "border-fuchsia-500/40 hover:border-fuchsia-500/60",
              },
              {
                quote: "PandaView caught critical security vulnerabilities in our schema that we had missed for months. The security analysis is worth the price alone!",
                author: "Priya Sharma",
                role: "Security Engineer, CloudNative",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
                borderColor: "border-indigo-500/40 hover:border-indigo-500/60",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-700 hover:border-emerald-500/60 flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="flex-1">
                  <div className="mb-6 text-emerald-300">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.667 16H5.33366C5.33366 10.109 10.1093 5.33337 16.0003 5.33337V10.6667C13.0577 10.6667 10.667 13.0574 10.667 16Z"
                        fill="currentColor"
                      />
                      <path
                        d="M26.6667 16H21.3333C21.3333 10.109 26.109 5.33337 32 5.33337V10.6667C29.0573 10.6667 26.6667 13.0574 26.6667 16Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-200 font-normal text-xl leading-relaxed mb-8">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-emerald-500/30 backdrop-blur-sm p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="rounded-full overflow-hidden h-full w-full bg-slate-900">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-white">
                      {testimonial.author}
                    </h4>
                    <p className="text-base text-slate-200">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Logos Section */}
        {/* <section className="container mx-auto py-12 relative">
          <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          <div className="text-center mb-12 opacity-90 relative">
            <p className="text-base text-slate-200 uppercase tracking-wider font-semibold">
              Trusted by developers from
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {["GitHub", "GitLab", "Vercel", "MongoDB", "PostgreSQL", "MySQL"].map(
              (logo, i) => (
                <div
                  key={i}
                  className="text-slate-200 font-bold text-2xl md:text-3xl hover:text-white transition-colors duration-300"
                >
                  {logo}
                </div>
              )
            )}
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="container mx-auto py-12 lg:py-20 relative">
          <div className="max-w-full mx-auto p-8 rounded-3xl overflow-hidden relative">
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-12 lg:p-16 rounded-2xl border border-slate-700 shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-slate-900/90 text-emerald-300 text-base font-medium mb-8 border border-slate-700 shadow-md">
                  <span className="uppercase tracking-wider font-semibold">
                    Ready to transform your database?
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                  Transform your{" "}
                  <span className="text-emerald-300">database workflow</span>,
                  in minutes.
                </h2>
                <p className="text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed font-normal">
                  From ERD diagrams to security analysis, PandaView gives your
                  team instant database intelligence.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href={user ? "/live" : "/sign-up"}
                    className="w-full sm:w-auto group"
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500/50 px-10 py-7 text-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 rounded-full"
                    >
                      <span>
                        {user ? "Create New Diagram" : "Start Free Today"}
                      </span>
                      <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {!user && (
                    <Link href="/live" className="group">
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 py-7 text-xl border-slate-700 text-slate-200 hover:bg-slate-800/50 shadow-sm transition-all duration-300 rounded-full"
                      >
                        <span>See a demo</span>
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="absolute inset-0 z-0 bg-noise opacity-10 pointer-events-none"></div>
      </div>
    </>
  );
}
