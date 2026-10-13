import { ArrowRight, ArrowUpRight, CloudSun, ImagePlus, MapPin, Sprout, Waves } from 'lucide-react'
import { PageHeading, WorkflowStep } from './Shared.jsx'

export default function Dashboard({ onStart }) {
  return (
    <div className="dashboard-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker"><span /> LAND INTELLIGENCE, NATURALLY</div>
          <h1>Understand your land.<br /><em>Grow smarter.</em></h1>
          <p>Bring together what you know about your land and make more considered decisions for what comes next.</p>
          <button className="button button-primary hero-button" onClick={onStart}>Start land analysis <ArrowRight size={17} /></button>
          <div className="hero-proof"><div className="proof-icons"><span><MapPin size={13} /></span><span><CloudSun size={13} /></span><span><Waves size={13} /></span></div><span>Grounded in your land's real conditions</span></div>
        </div>
        <div className="land-art" aria-label="Illustration of green cultivated fields" role="img">
          <svg className="landscape-art" viewBox="0 0 560 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="land-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dcebd8" /><stop offset="1" stopColor="#bdd9b8" /></linearGradient>
              <linearGradient id="land-field" x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#83ad70" /><stop offset="1" stopColor="#376b43" /></linearGradient>
              <linearGradient id="land-foreground" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#608e53" /><stop offset="1" stopColor="#2f6240" /></linearGradient>
              <clipPath id="field-clip"><path d="M0 199C116 184 177 218 273 202c104-18 167-32 287-3v161H0Z" /></clipPath>
            </defs>
            <path fill="url(#land-sky)" d="M0 0h560v360H0z" />
            <circle cx="409" cy="83" r="28" fill="#f1d99e" opacity=".88" />
            <circle cx="409" cy="83" r="41" fill="#f1d99e" opacity=".17" />
            <path fill="#accaa2" d="M0 170c96-47 157-28 230-7 75 22 124-48 204-26 48 13 81 24 126 12v103H0z" />
            <path fill="#8bb17b" d="M0 205c95-31 167-18 250 3 91 24 173-41 310-18v95H0z" />
            <path fill="url(#land-field)" d="M0 199c116-15 177 19 273 3 104-18 167-32 287-3v161H0z" />
            <g clipPath="url(#field-clip)" fill="none" stroke="#d1df9a" strokeWidth="2" opacity=".52">
              <path d="M-70 405C38 267 150 231 325 225s249 15 333 77" />
              <path d="M-49 426C57 288 169 252 344 246s249 15 333 77" />
              <path d="M-28 447C78 309 190 273 365 267s249 15 333 77" />
              <path d="M-7 468C99 330 211 294 386 288s249 15 333 77" />
              <path d="M14 489C120 351 232 315 407 309s249 15 333 77" />
              <path d="M35 510C141 372 253 336 428 330s249 15 333 77" />
              <path d="M-65 178c102 25 184 70 258 136s116 93 229 117" opacity=".45" />
              <path d="M-44 165c102 25 184 70 258 136s116 93 229 117" opacity=".45" />
            </g>
            <path fill="url(#land-foreground)" d="M0 289c77-24 159-7 236 14 82 22 191 22 324-22v79H0z" />
            <g fill="none" stroke="#d8e3a5" strokeWidth="1.5" opacity=".44">
              <path d="M-10 315c85-21 160-8 241 14 83 23 196 23 339-24" />
              <path d="M-15 334c88-19 161-6 241 16 85 23 202 20 344-27" />
              <path d="M-20 353c90-17 164-4 244 18 87 23 208 17 350-30" />
            </g>
          </svg>
          <div className="art-label"><span className="art-label-mark"><Sprout size={16} /></span><div><strong>Your land, understood</strong><span>Every field has a story</span></div><ArrowUpRight size={16} /></div>
          <div className="art-coordinate">FIELD NOTES <span>•</span> 01</div>
        </div>
      </div>
      <PageHeading
        eyebrow="A THOUGHTFUL THREE-STEP PROCESS"
        title="From field to informed decision"
        description="A flexible starting point for understanding the conditions that shape your land."
      />
      <div className="workflow-grid">
        <WorkflowStep number="01" icon={ImagePlus} title="Add a land image" description="Share a field photo to give your analysis a visual starting point." />
        <WorkflowStep number="02" icon={CloudSun} title="Describe conditions" description="Add the soil, climate and water details you already know." />
        <WorkflowStep number="03" icon={Sprout} title="Explore what fits" description="Connect a recommendation engine to explore suitable crop options." />
      </div>
      <div className="dashboard-footnote"><span className="status-pulse" /> Your information stays editable as the project evolves.</div>
    </div>
  )
}
