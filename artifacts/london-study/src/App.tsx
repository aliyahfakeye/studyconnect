import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { BookOpen, Users, MapPin, CalendarDays, UserRound, House, Search, Plus, ShieldCheck, ArrowRight, Clock3, Wifi, PlugZap, TrainFront, Check, LockKeyhole, X, Flag, Ban } from 'lucide-react';

const queryClient = new QueryClient();
const universities = ['UCL', "King's College London", 'Imperial College London', 'LSE', 'Queen Mary University of London'];
const initialProfile = { name: '', course: '', university: '', year: '', gender: 'Prefer not to say', fact: '', contact: 'In-app first', seeking: 'Study partner' };
const seedGroups = [
  { id: 1, title: 'Stats for Social Science — exam sprint', subject: 'Statistics', type: 'Exam prep', uni: 'Cross-university', day: 'Wed · 16:30', place: 'Senate House Library', members: 4, max: 6, about: 'Past-paper questions, a short break halfway through, no pressure to stay the whole time.', joined: false },
  { id: 2, title: 'Quiet hour: library body-doubling', subject: 'Any course', type: 'Silent study', uni: 'UCL · LSE · KCL', day: 'Thu · 10:00', place: 'LSE Library', members: 5, max: 6, about: 'Bring your own work. We start together, keep it quiet, and check in at the end.', joined: false },
  { id: 3, title: 'First-year life sciences catch-up', subject: 'Life sciences', type: 'Weekly meetup', uni: 'Imperial · QMUL', day: 'Fri · 14:00', place: 'Beit Quad Study Lounge', members: 3, max: 6, about: 'A friendly weekly session to compare notes and ask the small questions.', joined: false },
  { id: 4, title: 'Accountability: dissertation hour', subject: 'Any course', type: 'Accountability', uni: 'Open to all five', day: 'Mon · 11:00', place: 'Student Central Café', members: 2, max: 6, about: 'Say what you want to work on, then quietly get on with it. Beginners welcome.', joined: false },
];
const seedSessions = [
  { id: 1, title: 'Biochem problem set, together', host: 'Maya R.', course: 'Biomedical Sciences', university: 'UCL', day: 'Today · 15:30', place: 'Senate House Library', style: 'Quiet focus', seats: 2, max: 4, joined: false },
  { id: 2, title: 'A gentle start on econometrics', host: 'Sam K.', course: 'Economics', university: 'LSE', day: 'Tomorrow · 11:00', place: 'LSE Library', style: 'Accountability', seats: 1, max: 3, joined: false },
  { id: 3, title: 'Revision without the panic', host: 'Amira H.', course: 'Medicine', university: 'Queen Mary University of London', day: 'Thu · 17:00', place: 'East Library, Queen Mary', style: 'Exam prep', seats: 2, max: 5, joined: false },
];
const seedPeople = [
  { id: 1, name: 'Maya R.', course: 'Biomedical Sciences', university: 'UCL', year: 'Year 2', seeking: 'Study partner', fact: 'Can name most London Underground stations in order.', contact: 'In-app first' },
  { id: 2, name: 'Ibrahim A.', course: 'Biomedical Sciences', university: 'Imperial College London', year: 'Year 2', seeking: 'Accountability', fact: 'Learning to bake bread, with mixed results.', contact: 'In-app first' },
  { id: 3, name: 'Sam K.', course: 'Economics', university: 'LSE', year: 'Year 1', seeking: 'Chat while studying', fact: 'Knows an unreasonable amount about houseplants.', contact: 'Share after we both accept' },
];
const store = {
  get<T>(key: string, fallback: T): T {
    try { const item = localStorage.getItem(`stl-${key}`); return item ? JSON.parse(item) as T : fallback; } catch { return fallback; }
  },
  set(key: string, value: unknown) { try { localStorage.setItem(`stl-${key}`, JSON.stringify(value)); } catch { /* local-only prototype */ } },
};
type Profile = typeof initialProfile;
type Group = typeof seedGroups[number];
type Session = typeof seedSessions[number];
type Person = typeof seedPeople[number] & { status?: string };

function App() {
  const [location] = useLocation();
  const [profile, setProfile] = useState<Profile>(() => store.get('profile', initialProfile));
  const [verified, setVerified] = useState(() => store.get('verified', false));
  const [groups, setGroups] = useState<Group[]>(() => store.get('groups', seedGroups));
  const [sessions, setSessions] = useState<Session[]>(() => store.get('sessions', seedSessions));
  const [people, setPeople] = useState<Person[]>(() => store.get('people', seedPeople));
  const [notice, setNotice] = useState('');
  const [reportTarget, setReportTarget] = useState('');
  useEffect(() => store.set('profile', profile), [profile]);
  useEffect(() => store.set('verified', verified), [verified]);
  useEffect(() => store.set('groups', groups), [groups]);
  useEffect(() => store.set('sessions', sessions), [sessions]);
  useEffect(() => store.set('people', people), [people]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const show = (message: string) => setNotice(message);
  const nav = [
    { href: '/', label: 'Home', icon: House },
    { href: '/spaces', label: 'Study spaces', icon: MapPin },
    { href: '/groups', label: 'Study groups', icon: Users },
    { href: '/people', label: 'People', icon: UserRound },
    { href: '/sessions', label: 'Sessions', icon: CalendarDays },
    { href: '/profile', label: 'My profile', icon: BookOpen },
  ];
  const shell = (child: ReactNode) => <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-name">Study Together<small>LONDON · DEMO</small></span></Link>
      <div className="nav-label">YOUR STUDY CORNER</div>
      <nav className="nav-links">{nav.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? 'active' : ''}`}><Icon size={18} className="nav-icon" /><span>{item.label}</span></Link>; })}</nav>
      <div className="sidebar-bottom"><span className="demo-pill">DEMO SPACE</span><br />No real accounts or contact details are shared here.<br /><br />Meet in a public place, and trust your instincts.</div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="top-kicker">A softer way to study together</div><div className="user-chip"><span className="avatar">{profile.name ? profile.name.slice(0,1).toUpperCase() : 'S'}</span><span className="user-name">{profile.name || 'Your study corner'}</span></div></header>
      <div className="content page-enter">{child}</div>
    </main>
    {notice && <div className="toast-message" role="status">{notice}</div>}
    {reportTarget && <div className="modal-backdrop" onClick={() => setReportTarget('')}><div className="modal card" onClick={e => e.stopPropagation()}><button className="close-button" onClick={() => setReportTarget('')} aria-label="Close"><X size={18} /></button><div className="eyebrow">COMMUNITY SAFETY</div><h2 className="card-title">{reportTarget.startsWith('block:') ? 'Block this demo profile?' : 'Report this content?'}</h2><p>This prototype records the action only in this browser. No report is sent to a real team.</p><div className="form-actions"><button className="btn danger" onClick={() => { show(reportTarget.startsWith('block:') ? 'Profile blocked in this demo.' : 'Report noted in this demo.'); if (reportTarget.startsWith('block:')) { const id = Number(reportTarget.split(':')[1]); setPeople(p => p.map(x => x.id === id ? { ...x, status: 'Blocked' } : x)); } setReportTarget(''); }}>Confirm {reportTarget.startsWith('block:') ? 'block' : 'report'}</button><button className="btn secondary" onClick={() => setReportTarget('')}>Cancel</button></div></div></div>}
  </div>;

  const Home = () => <>{<div className="eyebrow">UCL · KING'S · IMPERIAL · LSE · QMUL</div>}<h1 className="page-title">Find your people.<br />Keep your own pace.</h1><p className="intro">A little less alone at the library. Find a calm corner, a friendly study group, or one person who gets your course — no pressure to be “on”.</p>
    <section className="hero-panel"><div className="hero-copy"><div className="eyebrow">A GOOD PLACE TO BEGIN</div><h2>Study beside someone,<br />not perform for everyone.</h2><p>For commuter days, first weeks, long problem sets and the “I should probably start” afternoons.</p><Link href="/spaces" className="btn">Find a study space <ArrowRight size={16} /></Link></div></section>
    <div className="grid-two"><section><div className="section-head"><div><h2>Make today easier</h2><p>Pick the kind of company that helps.</p></div></div><div className="tile-grid">
      {[['01', 'Find a study space', 'Quiet libraries, late desks and places near a station.', '/spaces'], ['02', 'Join a small group', 'Six people max, with the plan clear before you join.', '/groups'], ['03', 'Meet a study person', 'Course-adjacent suggestions, one mutual yes at a time.', '/people']].map(([n,t,d,h]) => <article className="card" key={n}><div className="eyebrow">{n} / START HERE</div><h3 className="card-title">{t}</h3><p>{d}</p><Link href={h} className="btn secondary small">Explore <ArrowRight size={14} /></Link></article>)}
    </div></section><aside><div className="section-head"><div><h2>Your corner</h2><p>Just the basics, whenever you're ready.</p></div></div><div className="card"><div className="profile-head"><div className="profile-avatar">{profile.name ? profile.name.slice(0,1).toUpperCase() : <UserRound />}</div><div><h3 className="card-title">{profile.name || 'A profile at your pace'}</h3><div className="meta">{profile.course ? `${profile.course} · ${profile.university}` : 'No profile details yet'}</div></div></div><div className="tags"><span className="tag">{verified ? 'Demo email simulated' : 'Verification optional demo'}</span>{profile.seeking && profile.name && <span className="tag warm">Seeking {profile.seeking.toLowerCase()}</span>}</div><div className="form-actions"><Link href="/profile" className="btn secondary small">{profile.name ? 'Edit profile' : 'Create profile'}</Link>{!verified && <Link href="/join" className="btn ghost small">Join the demo</Link>}</div></div><div className="notice warn"><strong>Small safety note</strong><br />Meet in a public, familiar place. Contact stays hidden unless both people choose to accept.</div></aside></div>
    <section><div className="section-head"><div><h2>Coming up around you</h2><p>Realistic demo listings, ready to explore.</p></div><Link href="/sessions" className="btn ghost small">All sessions <ArrowRight size={14} /></Link></div><div className="tile-grid">{sessions.slice(0,3).map(s => <div className="card" key={s.id}><div className="eyebrow">{s.day}</div><h3 className="card-title">{s.title}</h3><p>{s.place} · {s.style}</p><span className="tag">{s.seats} of {s.max} places filled</span></div>)}</div></section>
  </>;

  const Join = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(verified ? 2 : 1);
    const [code, setCode] = useState('');
    const currentStep = verified ? 3 : step;
    const submitEmail = (e: FormEvent) => { e.preventDefault(); const domain = email.toLowerCase().split('@')[1] || ''; if (!email.includes('@') || !/(ucl\.ac\.uk|kcl\.ac\.uk|imperial\.ac\.uk|lse\.ac\.uk|qmul\.ac\.uk|student\.qmul\.ac\.uk)$/.test(domain)) { show('Use a student-style address from one of the five universities.'); return; } setStep(2); show('Demo code prepared: enter 246810 to continue.'); };
    const verify = (e: FormEvent) => { e.preventDefault(); if (code !== '246810') { show('That demo code does not match. Try 246810.'); return; } setVerified(true); setStep(3); show('Demo verification simulated — no email was sent.'); };
    return <><div className="eyebrow">JOIN THE DEMO</div><h1 className="page-title">A small hello,<br />on your terms.</h1><p className="intro">This sign-up only checks the shape of a university email address. It does not send mail, verify a real identity or create an account.</p><div className="grid-two" style={{marginTop:28}}><section className="card"><div className="tabs"><button className={`tab ${currentStep===1?'active':''}`} onClick={() => setStep(1)}>1 · Email</button><button className={`tab ${currentStep===2?'active':''}`} onClick={() => setStep(2)}>2 · Demo code</button><button className={`tab ${currentStep===3?'active':''}`} onClick={() => setStep(3)}>3 · Ready</button></div>
      {currentStep===1 && <form onSubmit={submitEmail}><div className="field"><label>University email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@ucl.ac.uk" required /><span className="hint">Accepted demo domains: UCL, King's, Imperial, LSE and Queen Mary.</span></div><button className="btn" style={{marginTop:18}}>Continue <ArrowRight size={15}/></button></form>}
      {currentStep===2 && <form onSubmit={verify}><div className="notice warn"><strong>Demo simulation</strong><br />No email has been sent. Use the visible sample code <b>246810</b> to show the next step.</div><div className="field"><label>Six-digit demo code</label><input inputMode="numeric" value={code} onChange={e=>setCode(e.target.value)} placeholder="246810" maxLength={6} required /></div><div className="form-actions"><button className="btn">Simulate verification <Check size={15}/></button><button type="button" className="btn secondary" onClick={()=>setStep(1)}>Back</button></div></form>}
      {currentStep===3 && <div><div className="notice"><strong>You're through — for this demo.</strong><br />This is a local browser simulation, not identity verification. Your profile and demo choices stay on this device.</div><Link href="/profile" className="btn">Create your profile <ArrowRight size={15}/></Link><button className="btn ghost" onClick={()=>{setVerified(false);setStep(1);show('Demo state reset.')}}>Reset demo verification</button></div>}
    </section><aside className="accent-note"><div className="eyebrow">NO SOCIAL NETWORK PRESSURE</div><h3 className="card-title">You choose what to share.</h3><p>Your gender is optional. Your contact preference can stay in-app. Joining a group never exposes contact information — and you can leave at any time.</p><div className="tags"><span className="tag"><ShieldCheck size={12}/> Local demo only</span><span className="tag"><LockKeyhole size={12}/> No contact revealed</span></div></aside></div></>;
  };

  const ProfilePage = () => {
    const [draft, setDraft] = useState<Profile>(profile);
    const set = (key: keyof Profile, value: string) => setDraft(d => ({...d,[key]:value}));
    const submit = (e: FormEvent) => { e.preventDefault(); if (!draft.name.trim() || !draft.course.trim() || !draft.university || !draft.year) { show('Please add your name, course, university and year.'); return; } setProfile(draft); show('Profile saved on this device.'); };
    return <><div className="eyebrow">YOUR PROFILE · YOUR CALL</div><h1 className="page-title">{profile.name ? 'A little more you.' : 'Let people know<br />what helps.'}</h1><p className="intro">Keep it simple. Your profile helps the demo suggest study company with something in common — not build a public persona.</p><form className="card" style={{marginTop:25}} onSubmit={submit}><div className="form-grid">
      <div className="field"><label>Name or what you'd like to be called *</label><input value={draft.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Alex" required /></div>
      <div className="field"><label>Course *</label><input value={draft.course} onChange={e=>set('course',e.target.value)} placeholder="e.g. Psychology" required /></div>
      <div className="field"><label>University *</label><select value={draft.university} onChange={e=>set('university',e.target.value)} required><option value="">Choose your university</option>{universities.map(u=><option key={u}>{u}</option>)}</select></div>
      <div className="field"><label>Year of study *</label><select value={draft.year} onChange={e=>set('year',e.target.value)} required><option value="">Choose a year</option>{['Foundation','Year 1','Year 2','Year 3','Year 4+','Postgraduate'].map(y=><option key={y}>{y}</option>)}</select></div>
      <div className="field"><label>Gender (optional)</label><select value={draft.gender} onChange={e=>set('gender',e.target.value)}>{['Prefer not to say','Woman','Man','Non-binary','Self-describe'].map(g=><option key={g}>{g}</option>)}</select><span className="hint">Never required to take part.</span></div>
      <div className="field"><label>Contact preference</label><select value={draft.contact} onChange={e=>set('contact',e.target.value)}>{['In-app first','Share after we both accept','Keep it in-app'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="field full"><label>Seeking</label><select value={draft.seeking} onChange={e=>set('seeking',e.target.value)}>{['Study partner','Accountability','Chat while studying'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="field full"><label>A fun fact (optional)</label><textarea value={draft.fact} onChange={e=>set('fact',e.target.value)} placeholder="Something easy to ask you about..." maxLength={140}/><span className="hint">{draft.fact.length}/140</span></div>
    </div><div className="form-actions"><button className="btn">Save profile <Check size={15}/></button><Link href="/" className="btn secondary">Back home</Link></div></form></>;
  };

  const SpacesPage = () => {
    const [query,setQuery]=useState(''); const [filter,setFilter]=useState('All'); const [selected,setSelected]=useState<number|null>(null);
    const filters=['All','Free','Quiet','Open late','Near station','Wi-Fi & plugs','Group-friendly','Silent'];
    const spaces=useMemo(()=>initialSpacesFilter(query,filter),[query,filter]);
    return <><div className="eyebrow">SOMEWHERE TO SETTLE IN</div><h1 className="page-title">Study spots, by feel.</h1><p className="intro">A practical shortlist for London student days. No live crowd data or map integration — just demo listings with the details that make a difference.</p><div className="space-layout" style={{marginTop:24}}><section><div style={{display:'flex',gap:10}}><div style={{position:'relative',flex:1}}><Search size={17} style={{position:'absolute',top:12,left:12,color:'#859087'}}/><input className="searchbox" style={{paddingLeft:38}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search place, area or feature"/></div><span className="tag" style={{alignSelf:'center'}}>{spaces.length} places</span></div><div className="filter-row">{filters.map(f=><button key={f} className={`chip ${filter===f?'selected':''}`} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="listing">{spaces.map(s=><article className={`card listing-card ${selected===s.id?'selected-card':''}`} key={s.id}><div><h3>{s.name}</h3><div className="meta">{s.area} · {s.kind}</div><p>{s.note}</p><div className="tags">{s.free&&<span className="tag">Free</span>}{s.quiet&&<span className="tag">Quiet</span>}{s.late&&<span className="tag">Open late</span>}{s.wifi&&<span className="tag">Wi-Fi</span>}{s.plugs&&<span className="tag">Plugs</span>}{s.group&&<span className="tag warm">Group-friendly</span>}{s.desks&&<span className="tag">Desks</span>}{s.rooms&&<span className="tag">Bookable rooms</span>}<span className="tag warm">Crowd: {s.crowd}</span></div></div><button className={`btn ${selected===s.id?'':'secondary'} small`} onClick={()=>setSelected(s.id)}>{selected===s.id?'Selected':'Details'}</button></article>)}{!spaces.length&&<div className="empty"><strong>No spots match that yet.</strong>Try another feature or a nearby area.</div>}</div></section>
      <aside><div className="map-card"><span className="map-label" style={{top:'17%',left:'10%'}}>BLOOMSBURY</span><span className="map-label" style={{top:'54%',right:'8%'}}>SOUTH KEN</span><span className="map-label" style={{bottom:'14%',left:'16%'}}>MILE END</span><i className="pin" style={{top:'31%',left:'34%'}}/><i className="pin" style={{top:'62%',left:'66%'}}/><i className="pin" style={{top:'76%',left:'27%'}}/><span style={{position:'absolute',right:16,bottom:14,font:'10px Space Mono',color:'#637268'}}>SCHEMATIC · NOT TO SCALE</span></div><div className="card" style={{marginTop:14}}><div className="eyebrow">SELECTED PLACE</div>{selected ? <><h3 className="card-title">{initialSpaces.find(s=>s.id===selected)?.name}</h3><p>Use this listing as a starting point. Check opening times and access directly before travelling.</p><div className="tags"><span className="tag"><TrainFront size={12}/> Near station</span><span className="tag"><Wifi size={12}/> Wi-Fi</span><span className="tag"><PlugZap size={12}/> Plugs</span></div></> : <><h3 className="card-title">Your London study map</h3><p>Choose a place from the list to see more. Pins are illustrative, not navigation.</p></>}<div className="notice warn">For a first meetup, choose a public place and let someone you trust know your plan.</div></div></aside></div></>;
  };

  const GroupsPage = () => {
    const [type,setType]=useState('All'); const [term,setTerm]=useState(''); const [creating,setCreating]=useState(false);
    const visible=groups.filter(g=>(type==='All'||g.type===type)&&`${g.title} ${g.subject} ${g.uni} ${g.place}`.toLowerCase().includes(term.toLowerCase()));
    const join=(g:Group)=>{if(g.joined){setGroups(a=>a.map(x=>x.id===g.id?{...x,joined:false,members:Math.max(0,x.members-1)}:x));show('You left the group.');}else if(g.members>=g.max){show('This group is full. Try another listing.');}else{setGroups(a=>a.map(x=>x.id===g.id?{...x,joined:true,members:x.members+1}:x));show('You joined the group. Contact stays hidden in this demo.');}};
    const create=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const d=new FormData(e.currentTarget);const title=String(d.get('title')).trim();if(!title)return;setGroups(g=>[{id:Date.now(),title,subject:String(d.get('subject')),type:String(d.get('type')),uni:profile.university||'Open to all five',day:String(d.get('day')),place:String(d.get('place')),members:1,max:6,about:String(d.get('about')),joined:true},...g]);setCreating(false);show('Your group is listed in this browser demo.');};
    return <><div className="eyebrow">SMALL GROUPS · CLEAR PLANS</div><h1 className="page-title">Company for the<br />work in front of you.</h1><p className="intro">Silent study, exam practice, accountability or a weekly catch-up. Groups are capped at six, and contact stays hidden until you join.</p><div className="section-head"><div><h2>Browse groups</h2><p>Cross-university by design. Small enough to feel human.</p></div><button className="btn" onClick={()=>setCreating(v=>!v)}><Plus size={16}/> {creating?'Close form':'Create a group'}</button></div>
      {creating&&<form className="card" style={{marginBottom:18}} onSubmit={create}><div className="form-grid"><div className="field"><label>Group name</label><input name="title" placeholder="e.g. A gentle exam prep hour" required maxLength={70}/></div><div className="field"><label>Module or course</label><input name="subject" placeholder="Any course" required/></div><div className="field"><label>Group type</label><select name="type">{['Silent study','Exam prep','Accountability','Weekly meetup'].map(x=><option key={x}>{x}</option>)}</select></div><div className="field"><label>When</label><input name="day" placeholder="e.g. Wed · 16:30" required/></div><div className="field"><label>Public place</label><input name="place" placeholder="e.g. Senate House Library" required/></div><div className="field"><label>About this group</label><input name="about" placeholder="What should people expect?" required/></div></div><div className="form-actions"><button className="btn">Publish group</button></div></form>}
      <input className="searchbox" value={term} onChange={e=>setTerm(e.target.value)} placeholder="Search modules, group names or places"/>
      <div className="filter-row">{['All','Silent study','Exam prep','Accountability','Weekly meetup'].map(x=><button key={x} className={`chip ${type===x?'selected':''}`} onClick={()=>setType(x)}>{x}</button>)}</div>
      <div className="listing">{visible.map(g=><article className="card listing-card" key={g.id}><div style={{flex:1}}><div className="tags" style={{marginBottom:10}}><span className="tag warm">{g.type}</span><span className="tag">{g.uni}</span><span className="tag">{g.members}/{g.max} people</span></div><h3>{g.title}</h3><div className="meta">{g.subject} · {g.day} · {g.place}</div><p>{g.about}</p><div className="tags"><span className="tag"><LockKeyhole size={12}/> Contact hidden until joined</span>{g.joined&&<span className="tag">You're in</span>}</div></div><div style={{display:'grid',gap:8}}><button className={`btn small ${g.joined?'secondary':''}`} onClick={()=>join(g)} disabled={!g.joined&&g.members>=g.max}>{g.joined?'Leave group':g.members>=g.max?'Full':'Join group'}</button><button className="btn ghost small" onClick={()=>setReportTarget(`report:${g.id}`)}><Flag size={13}/> Report</button></div></article>)}{!visible.length&&<div className="empty"><strong>No groups found.</strong>Try another search or start a small group yourself.</div>}</div>
    </>;
  };

  const PeoplePage = () => {
    return <PeopleContent people={people} setPeople={setPeople} show={show} setReportTarget={setReportTarget}/>;
  };

  const SessionsPage = () => {
    const [creating,setCreating]=useState(false); const [filter,setFilter]=useState('All');
    const list=sessions.filter(s=>filter==='All'||s.style===filter);
    const toggle=(s:Session)=>{if(s.joined){setSessions(a=>a.map(x=>x.id===s.id?{...x,joined:false,seats:Math.max(0,x.seats-1)}:x));show('You dropped out of the session.');}else if(s.seats>=s.max){show('That session has no room left.');}else{setSessions(a=>a.map(x=>x.id===s.id?{...x,joined:true,seats:x.seats+1}:x));show('You are on the session list. Meet in a public place.');}};
    const create=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const d=new FormData(e.currentTarget);setSessions(a=>[{id:Date.now(),title:String(d.get('title')),host:profile.name||'You',course:profile.course||'Any course',university:profile.university||'Open to all five',day:String(d.get('day')),place:String(d.get('place')),style:String(d.get('style')),seats:1,max:Number(d.get('max')),joined:true},...a]);setCreating(false);show('Session created. It is visible in this browser demo.');};
    return <><div className="eyebrow">DROP IN OR SET A TIME</div><h1 className="page-title">A study session<br />with a soft start.</h1><p className="intro">Small, practical meetups for getting going. Pick a public place, decide your pace, and drop in if it suits your day.</p><div className="section-head"><div><h2>Open sessions</h2><p>Places update in this browser demo.</p></div><button className="btn" onClick={()=>setCreating(v=>!v)}><Plus size={16}/>{creating?'Close form':'Create session'}</button></div>
      {creating&&<form className="card" style={{marginBottom:18}} onSubmit={create}><div className="form-grid"><div className="field"><label>What are you working on?</label><input name="title" required placeholder="e.g. Get started on the reading list"/></div><div className="field"><label>When</label><input name="day" required placeholder="e.g. Tomorrow · 14:00"/></div><div className="field"><label>Public place</label><input name="place" required placeholder="e.g. Student Central Café"/></div><div className="field"><label>Study style</label><select name="style">{['Quiet focus','Exam prep','Accountability','Chat while studying'].map(x=><option key={x}>{x}</option>)}</select></div><div className="field"><label>Group size</label><select name="max">{[2,3,4,5,6].map(n=><option key={n} value={n}>{n} people max</option>)}</select></div></div><div className="form-actions"><button className="btn">Create session</button></div></form>}
      <div className="filter-row">{['All','Quiet focus','Exam prep','Accountability','Chat while studying'].map(x=><button key={x} className={`chip ${filter===x?'selected':''}`} onClick={()=>setFilter(x)}>{x}</button>)}</div><div className="listing">{list.map(s=><article key={s.id} className="card listing-card"><div style={{flex:1}}><div className="tags" style={{marginBottom:10}}><span className="tag warm">{s.style}</span><span className="tag">{s.seats}/{s.max} places</span></div><h3>{s.title}</h3><div className="meta"><Clock3 size={13}/> {s.day} · {s.place}</div><p>{s.course} · {s.university} · hosted by {s.host}</p><div className="tags"><span className="tag"><LockKeyhole size={12}/> Contact hidden until both accept</span></div></div><div style={{display:'grid',gap:8}}><button className={`btn small ${s.joined?'secondary':''}`} onClick={()=>toggle(s)} disabled={!s.joined&&s.seats>=s.max}>{s.joined?'Drop out':s.seats>=s.max?'Full':'Drop in'}</button><button className="btn ghost small" onClick={()=>setReportTarget(`report:session:${s.id}`)}><Flag size={13}/> Report</button></div></article>)}{!list.length&&<div className="empty"><strong>No sessions in this style.</strong>Choose another filter or create one.</div>}</div><div className="notice warn"><strong>Meetup reminder</strong><br/>Choose a public place, arrange your own travel, and let a trusted person know where you're going. Contact details stay hidden unless both people accept.</div></>;
  };

  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppShellBoundary location={location}>{shell(<Switch><Route path="/" component={Home}/><Route path="/join" component={Join}/><Route path="/profile" component={ProfilePage}/><Route path="/spaces" component={SpacesPage}/><Route path="/groups" component={GroupsPage}/><Route path="/people" component={PeoplePage}/><Route path="/sessions" component={SessionsPage}/><Route component={NotFound}/></Switch>)}</AppShellBoundary></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;

  function initialSpacesFilter(query:string, filter:string) {
    return initialSpaces.filter(s => {
      const search=`${s.name} ${s.area} ${s.kind} ${s.note}`.toLowerCase().includes(query.toLowerCase());
      const match=filter==='All'||(filter==='Free'&&s.free)||(filter==='Quiet'&&s.quiet)||(filter==='Open late'&&s.late)||(filter==='Near station'&&s.station)||(filter==='Wi-Fi & plugs'&&s.wifi&&s.plugs)||(filter==='Group-friendly'&&s.group)||(filter==='Silent'&&s.quiet);
      return search&&match;
    });
  }
}

const initialSpaces= [
  { id: 1, name: 'Senate House Library', area: 'Bloomsbury · 6 min from Goodge Street', kind: 'Library', crowd: 'Moderate', quiet: true, late: true, free: false, wifi: true, plugs: true, station: true, desks: true, rooms: true, group: false, note: 'Big reading rooms and reliable late hours.' },
  { id: 2, name: 'The Student Central Café', area: 'Malet Street · 5 min from Euston Square', kind: 'Café', crowd: 'Lively', quiet: false, late: false, free: true, wifi: true, plugs: true, station: true, desks: true, rooms: false, group: true, note: 'Easy to settle in with a group and a hot drink.' },
  { id: 3, name: 'East Library, Queen Mary', area: 'Mile End · beside Mile End station', kind: 'Library', crowd: 'Quiet', quiet: true, late: true, free: true, wifi: true, plugs: true, station: true, desks: true, rooms: true, group: false, note: 'A calm, bright option for long independent sessions.' },
  { id: 4, name: 'Beit Quad Study Lounge', area: 'South Kensington · 4 min from the station', kind: 'Study lounge', crowd: 'Moderate', quiet: false, late: false, free: true, wifi: true, plugs: true, station: true, desks: true, rooms: false, group: true, note: 'Open tables that work well for collaborative study.' },
  { id: 5, name: 'LSE Library', area: 'Holborn · 7 min from Temple', kind: 'Library', crowd: 'Quiet', quiet: true, late: true, free: true, wifi: true, plugs: true, station: true, desks: true, rooms: true, group: false, note: 'Silent floors for when you need to focus.' },
];

function PeopleContent({people,setPeople,show,setReportTarget}:{people:Person[],setPeople:(fn:(old:Person[])=>Person[])=>void,show:(msg:string)=>void,setReportTarget:(x:string)=>void}) {
  const [query,setQuery]=useState('');
  const suggested=people.filter(p=>p.status!=='Blocked'&&`${p.course} ${p.name} ${p.university}`.toLowerCase().includes(query.toLowerCase()));
  const request=(person:Person)=>{const next=person.status==='Requested'?'Available':person.status==='Accepted'?'Requested':'Requested';setPeople(a=>a.map(p=>p.id===person.id?{...p,status:next}:p));show(next==='Requested'?'Connection request sent. Contact remains hidden.':'Request withdrawn.');};
    const accept=(id:number)=>{setPeople(a=>a.map(p=>p.id===id?{...p,status:'Accepted'}:p));show('Both sides accepted in this demo. No contact details are shared.');};
  return <><div className="eyebrow">COURSE-ADJACENT, NOT RANDOM</div><h1 className="page-title">One friendly connection<br />can be enough.</h1><p className="intro">Suggestions share a course or study rhythm. A connection only happens by mutual consent, and contact details never appear in this prototype.</p><div style={{maxWidth:550,marginTop:22,position:'relative'}}><Search size={17} style={{position:'absolute',top:12,left:12,color:'#859087'}}/><input className="searchbox" style={{paddingLeft:38}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search course, university or name"/></div><div className="notice"><strong>Mutual-consent connection</strong><br/>Requesting is not an automatic match. You can withdraw a request, and both people would need to accept before contact could ever be shared. The second yes is simulated here.</div><div className="listing">{suggested.map(p=><article className="card listing-card" key={p.id}><div style={{flex:1}}><div className="profile-head" style={{marginBottom:14}}><div className="profile-avatar">{p.name.split(' ').map(w=>w[0]).join('').replace('.','')}</div><div><h3 className="card-title">{p.name}</h3><div className="meta">{p.course} · {p.university} · {p.year}</div></div></div><div className="tags"><span className="tag warm">Seeking {p.seeking.toLowerCase()}</span><span className="tag">{p.contact}</span></div><p style={{marginTop:12}}>“{p.fact}”</p><div className="tags"><span className="tag"><LockKeyhole size={12}/> Contact details hidden</span></div></div><div style={{display:'grid',alignContent:'start',gap:7}}>{p.status==='Accepted'?<button className="btn secondary small" onClick={()=>show('Mutual consent recorded. No contact details are shared in the demo.')}>Accepted · details hidden</button>:<><button className="btn small" onClick={()=>request(p)}>{p.status==='Requested'?'Withdraw request':'Request to connect'}</button>{p.status==='Requested'&&<button className="btn secondary small" onClick={()=>accept(p.id)}>Simulate their yes</button>}</>}<button className="btn ghost small" onClick={()=>setReportTarget(`report:${p.id}`)}><Flag size={13}/> Report</button><button className="btn ghost small" onClick={()=>setReportTarget(`block:${p.id}`)}><Ban size={13}/> Block</button></div></article>)}{!suggested.length&&<div className="empty"><strong>No suggestions found.</strong>Try a course or university keyword.</div>}</div><div className="notice warn">Take your time. First meetings belong in public places. If anything feels off, you can leave, report or block.</div></>;
}

function AppShellBoundary({children,location}:{children:ReactNode,location:string}) { return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }

export default App;
