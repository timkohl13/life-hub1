import { useState } from "react";

const EXAMS = [
  { id: 1, subject: "Nederlands",   date: "8 mei",  dateObj: new Date(2026, 4, 8),  color: "#FF6B35" },
  { id: 2, subject: "Economie",     date: "11 mei", dateObj: new Date(2026, 4, 11), color: "#4ECDC4" },
  { id: 3, subject: "Geschiedenis", date: "12 mei", dateObj: new Date(2026, 4, 12), color: "#FFE66D" },
  { id: 4, subject: "Engels",       date: "18 mei", dateObj: new Date(2026, 4, 18), color: "#A8DADC" },
  { id: 5, subject: "Wiskunde",     date: "19 mei", dateObj: new Date(2026, 4, 19), color: "#FF3CAC" },
  { id: 6, subject: "Duits",        date: "20 mei", dateObj: new Date(2026, 4, 20), color: "#C8F7C5" },
];

// Study rotation: Mon=Ned, Tue=Eco, Wed=Ges, Thu=Eng, Fri=Wis, Sat=rest, Sun=Duits
// JS getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
const STUDY_DOW = { 0: 5, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: null };

const DRILLS_BY_DAY = {
  1: [
    { id:1, name:"10m Sprint",         sets:"3 reps",      cat:"Acceleratie" },
    { id:2, name:"20m Sprint",         sets:"2 reps",      cat:"Top Speed" },
    { id:3, name:"Incline DB Press",   sets:"3×3-5",       cat:"Push" },
    { id:4, name:"Squat",              sets:"3×3-5",       cat:"Benen" },
    { id:5, name:"Pull Ups",           sets:"3×3-5",       cat:"Pull" },
    { id:6, name:"Romanian Deadlift",  sets:"3×3-5",       cat:"Hinge" },
    { id:7, name:"Paloff Press",       sets:"3×12/kant",   cat:"Core" },
  ],
  2: [
    { id:1,  name:"Foam Rolling",         sets:"5 min",       cat:"Warming up" },
    { id:2,  name:"Hip Flexor Stretch",   sets:"2×30s/kant",  cat:"Lower Body" },
    { id:3,  name:"90/90 Hip Rotation",   sets:"2×8/kant",    cat:"Lower Body" },
    { id:4,  name:"Adductor Rock Backs",  sets:"2×8/kant",    cat:"Lower Body" },
    { id:5,  name:"Ankle Dorsiflexion",   sets:"2×10/kant",   cat:"Lower Body" },
    { id:6,  name:"Open Book Stretch",    sets:"2×8/kant",    cat:"Thoracic" },
    { id:7,  name:"T-Spine Extensions",   sets:"2×8",         cat:"Thoracic" },
    { id:8,  name:"Glute Bridge",         sets:"2×10",        cat:"Activatie" },
    { id:9,  name:"Dead Bug",             sets:"2×8/kant",    cat:"Activatie" },
    { id:10, name:"Band Pull Aparts",     sets:"2×12",        cat:"Activatie" },
    { id:11, name:"Rope Jumping",         sets:"2×30 sec",    cat:"Elasticiteit" },
  ],
  3: [
    { id:1, name:"Teamtraining",              sets:"Volledige sessie", cat:"Practice" },
    { id:2, name:"Stretching na training",    sets:"10 min",           cat:"Recovery" },
  ],
  4: [
    { id:1, name:"Teamtraining",              sets:"Volledige sessie", cat:"Practice" },
    { id:2, name:"Stretching na training",    sets:"10 min",           cat:"Recovery" },
  ],
  5: [
    { id:1, name:"10m Sprint",       sets:"2 reps",   cat:"Acceleratie" },
    { id:2, name:"20m Sprint",       sets:"3 reps",   cat:"Top Speed" },
    { id:3, name:"Trap Bar Jump",    sets:"3×3",      cat:"Explosief" },
    { id:4, name:"Med Ball Pass",    sets:"3×5",      cat:"Explosief" },
    { id:5, name:"Med Ball Slams",   sets:"3×5",      cat:"Explosief" },
    { id:6, name:"Planks",           sets:"2×30-40s", cat:"Core" },
  ],
  6: [
    { id:1, name:"Warming up normaal",         sets:"Standaard",  cat:"Game Day" },
    { id:2, name:"2× Sprint baseline→3pt",     sets:"2 reps",     cat:"Game Day" },
    { id:3, name:"2× Sprint tot half court",   sets:"2 reps",     cat:"Game Day" },
    { id:4, name:"Max Vert Jumps",             sets:"2-3 reps",   cat:"Game Day" },
  ],
  0: [
    { id:1, name:"Volledig rust",      sets:"Herstel",        cat:"Recovery" },
    { id:2, name:"Lichte stretching",  sets:"Naar behoefte",  cat:"Recovery" },
  ],
};

const DAY_NL = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
const DAY_LABEL = {
  1:"Acceleratie + Full Body Kracht",
  2:"Mobility & Recovery",
  3:"Practice & Stretching",
  4:"Practice & Stretching",
  5:"Top Speed & Power Primer",
  6:"Game Day 🏀",
  0:"Stretch & Full Recovery"
};

const QUOTES = [
  { q:"Succes is niet het eindpunt, falen is niet fataal: de moed om door te gaan telt.", a:"Winston Churchill" },
  { q:"Hard werken verslaat talent wanneer talent niet hard werkt.", a:"Tim Notke" },
  { q:"Je wordt kampioen niet in de sporthal maar door wat diep van binnen leeft.", a:"Muhammad Ali" },
  { q:"Discipline is de brug tussen doelen en resultaten.", a:"Jim Rohn" },
  { q:"Het is niet of je valt, maar of je opstaat.", a:"Vince Lombardi" },
  { q:"Elke grote prestatie begon als een beslissing om het te proberen.", a:"Onbekend" },
  { q:"De pijn van discipline is altijd minder dan de pijn van spijt.", a:"Onbekend" },
];

function daysUntil(d) {
  const now = new Date(); now.setHours(0,0,0,0);
  const t = new Date(d); t.setHours(0,0,0,0);
  return Math.max(0, Math.round((t - now) / 86400000));
}

export default function App() {
  const [tab, setTab] = useState("home");
  const now = new Date();
  const dow = now.getDay();
  const dayName = DAY_NL[dow];
  const dateStr = now.toLocaleDateString("nl-NL", { month:"long", day:"numeric" });
  const quote = QUOTES[dow % QUOTES.length];

  const [progress, setProgress]   = useState(() => Object.fromEntries(EXAMS.map(e=>[e.id,0])));
  const [pctInput, setPctInput]   = useState(() => Object.fromEntries(EXAMS.map(e=>[e.id,""])));
  const [drills, setDrills]       = useState(() => (DRILLS_BY_DAY[dow]||[]).map(d=>({...d,done:false})));
  const [sessions, setSessions]   = useState(0);
  const [water, setWater]         = useState(0);
  const waterGoal = 8;
  const [meals, setMeals]         = useState([]);
  const [mealInput, setMealInput] = useState({name:"",cal:"",protein:"",carbs:"",fat:""});
  const [addingMeal, setAddingMeal] = useState(false);

  const todayExamIdx = STUDY_DOW[dow];
  const todayExam = todayExamIdx !== null ? EXAMS[todayExamIdx] : null;
  const toggleDrill = id => setDrills(ds=>ds.map(d=>d.id===id?{...d,done:!d.done}:d));
  const doneDrills = drills.filter(d=>d.done).length;

  const updatePct = (examId, delta) =>
    setProgress(p=>({...p,[examId]:Math.min(100,Math.max(0,(p[examId]||0)+delta))}));

  const totals = meals.reduce((a,m)=>({
    cal:a.cal+(m.cal||0), protein:a.protein+(m.protein||0),
    carbs:a.carbs+(m.carbs||0), fat:a.fat+(m.fat||0)
  }),{cal:0,protein:0,carbs:0,fat:0});

  const G = {cal:3800, protein:150, carbs:350, fat:80};
  const calPct = Math.min(100, Math.round((totals.cal/G.cal)*100));

  const addMeal = () => {
    if (!mealInput.name || !mealInput.cal) return;
    setMeals(ms=>[...ms,{
      id:Date.now(), name:mealInput.name,
      cal:parseInt(mealInput.cal)||0, protein:parseInt(mealInput.protein)||0,
      carbs:parseInt(mealInput.carbs)||0, fat:parseInt(mealInput.fat)||0,
      time:new Date().toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"}),
      emoji:"🍽️"
    }]);
    setMealInput({name:"",cal:"",protein:"",carbs:"",fat:""});
    setAddingMeal(false);
  };

  const S = { // style helpers
    card: { background:"#13131A", border:"1px solid #1E1E2E", borderRadius:16 },
    label: { fontSize:9, letterSpacing:"0.14em", color:"#555", textTransform:"uppercase" },
  };

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0F",fontFamily:"'DM Mono','Courier New',monospace",color:"#E8E8E0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0A0A0F}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .card{background:#13131A;border:1px solid #1E1E2E;border-radius:16px}
        .btn{cursor:pointer;border:none;transition:all .15s;font-family:inherit}
        .btn:hover{transform:translateY(-1px);opacity:.9}.btn:active{transform:translateY(0)}
        .fade-in{animation:fi .35s ease both}
        @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .pbar{height:6px;background:#1E1E2E;border-radius:3px;overflow:hidden}
        .pfill{height:100%;border-radius:3px;transition:width .5s ease}
        input{background:#1A1A24;border:1px solid #2A2A3E;border-radius:8px;color:#E8E8E0;padding:8px 10px;font-family:inherit;font-size:12px;outline:none;width:100%}
        input:focus{border-color:#4ECDC4}
        .badge{font-size:9px;padding:2px 6px;border-radius:4px;background:#1E1E2E;color:#555;letter-spacing:.08em;text-transform:uppercase}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{padding:"28px 20px 0",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:"#555",textTransform:"uppercase",marginBottom:4}}>{dayName} · {dateStr}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.1}}>
              JOUW<br/><span style={{color:"#FF6B35"}}>COMMAND</span> CENTER
            </div>
          </div>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#FF6B35,#FF3CAC)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⚡</div>
        </div>

        {/* NAV */}
        <div style={{display:"flex",gap:6,background:"#13131A",borderRadius:12,padding:4,border:"1px solid #1E1E2E",marginBottom:24}}>
          {[{id:"home",l:"HOME",i:"⊞"},{id:"study",l:"LEREN",i:"📚"},{id:"ball",l:"BALL",i:"🏀"},{id:"nutrition",l:"VOEDING",i:"🥗"}].map(t=>(
            <button key={t.id} className="btn" onClick={()=>setTab(t.id)} style={{
              flex:1,padding:"8px 4px",fontSize:9,fontWeight:500,letterSpacing:"0.08em",
              fontFamily:"'DM Mono',monospace",borderRadius:8,
              color:tab===t.id?"#0A0A0F":"#555",
              background:tab===t.id?"#FF6B35":"none",transition:"all .2s"
            }}><div>{t.i}</div><div style={{marginTop:2}}>{t.l}</div></button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{padding:"0 20px 100px",maxWidth:480,margin:"0 auto"}}>

        {/* HOME */}
        {tab==="home" && <div className="fade-in">
          {/* Snapshot */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {l:"EXAMENS",v:EXAMS.filter(e=>(progress[e.id]||0)<100).length,u:"te gaan",c:"#FF6B35"},
              {l:"DRILLS",v:`${doneDrills}/${drills.length}`,u:"vandaag",c:"#4ECDC4"},
              {l:"CALORIEËN",v:`${calPct}%`,u:"van doel",c:"#FFE66D"},
            ].map(s=>(
              <div key={s.l} className="card" style={{padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:"'Syne',sans-serif"}}>{s.v}</div>
                <div style={{fontSize:9,color:"#555",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{s.l}</div>
                <div style={{fontSize:9,color:"#333",marginTop:1}}>{s.u}</div>
              </div>
            ))}
          </div>

          {/* Vandaag leren */}
          {todayExam ? (
            <div className="card" style={{padding:16,marginBottom:12,borderColor:`${todayExam.color}44`}}>
              <div style={{...S.label,marginBottom:8}}>Vandaag leren</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:16,color:todayExam.color,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{todayExam.subject}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:2}}>Examen {todayExam.date} · {daysUntil(todayExam.dateObj)} dagen</div>
                </div>
                <div style={{fontSize:24}}>📖</div>
              </div>
              <div style={{marginTop:10}}>
                <div className="pbar"><div className="pfill" style={{width:`${progress[todayExam.id]}%`,background:todayExam.color}}/></div>
                <div style={{fontSize:10,color:"#555",marginTop:4,textAlign:"right"}}>{progress[todayExam.id]}% klaar</div>
              </div>
            </div>
          ) : (
            <div className="card" style={{padding:16,marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:22}}>😴</div>
              <div style={{fontSize:12,color:"#555",marginTop:6}}>Zaterdag = rust van school</div>
            </div>
          )}

          {/* Examens overzicht */}
          <div className="card" style={{padding:16,marginBottom:12}}>
            <div style={{...S.label,marginBottom:12}}>Examens planning</div>
            {EXAMS.map(e=>(
              <div key={e.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12}}>{e.subject}</span>
                  <span style={{fontSize:10,color:"#555"}}>{e.date} · {daysUntil(e.dateObj)}d</span>
                </div>
                <div className="pbar"><div className="pfill" style={{width:`${progress[e.id]}%`,background:e.color}}/></div>
              </div>
            ))}
          </div>

          {/* Water */}
          <div className="card" style={{padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={S.label}>Water intake</div>
              <div style={{fontSize:12,color:"#4ECDC4"}}>{water}/{waterGoal} glazen</div>
            </div>
            <div style={{display:"flex",gap:5,marginBottom:10}}>
              {Array.from({length:waterGoal}).map((_,i)=>(
                <div key={i} style={{flex:1,height:28,borderRadius:6,background:i<water?"#4ECDC4":"#1E1E2E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,transition:"background .3s"}}>{i<water?"💧":""}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={()=>setWater(w=>Math.max(0,w-1))} style={{flex:1,padding:"7px",borderRadius:8,background:"#1A2A30",color:"#666",fontSize:12,border:"1px solid #2A3E40"}}>− VERWIJDER</button>
              <button className="btn" onClick={()=>setWater(w=>Math.min(waterGoal,w+1))} style={{flex:1,padding:"7px",borderRadius:8,background:"#1A2A30",color:"#4ECDC4",fontSize:12,border:"1px solid #2A3E40"}}>+ GLAS</button>
            </div>
          </div>

          {/* Quote */}
          <div style={{background:"linear-gradient(135deg,#1A1020,#0F1A1A)",border:"1px solid #2A1A30",borderRadius:16,padding:16}}>
            <div style={{...S.label,marginBottom:6}}>Herinnering van vandaag</div>
            <div style={{fontSize:13,lineHeight:1.7,color:"#999",fontStyle:"italic"}}>"{quote.q}"</div>
            <div style={{fontSize:10,color:"#444",marginTop:6}}>— {quote.a}</div>
          </div>
        </div>}

        {/* STUDY */}
        {tab==="study" && <div className="fade-in">
          <div style={{...S.label,marginBottom:14}}>Examen voorbereiding</div>

          {/* Weekrooster */}
          <div className="card" style={{padding:16,marginBottom:14}}>
            <div style={{...S.label,marginBottom:12}}>Weekrooster · 1 uur/dag</div>
            {[
              {day:"Maandag",   exam:EXAMS[0]},
              {day:"Dinsdag",   exam:EXAMS[1]},
              {day:"Woensdag",  exam:EXAMS[2]},
              {day:"Donderdag", exam:EXAMS[3]},
              {day:"Vrijdag",   exam:EXAMS[4]},
              {day:"Zaterdag",  exam:null},
              {day:"Zondag",    exam:EXAMS[5]},
            ].map(({day,exam})=>(
              <div key={day} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1A1A24",opacity:exam?1:0.35}}>
                <div style={{fontSize:12,color:"#777",minWidth:90}}>{day}</div>
                {exam
                  ? <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:exam.color}}/>
                      <div style={{fontSize:12,color:exam.color}}>{exam.subject}</div>
                      <div style={{fontSize:10,color:"#444"}}>{exam.date}</div>
                    </div>
                  : <div style={{fontSize:11,color:"#444"}}>Rust 😴</div>
                }
              </div>
            ))}
          </div>

          {/* Per vak */}
          {EXAMS.map(e=>(
            <div key={e.id} className="card" style={{padding:16,marginBottom:12,boxShadow:`0 0 20px ${e.color}11`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontSize:15,fontWeight:500,marginBottom:2}}>{e.subject}</div>
                  <div style={{fontSize:10,color:"#555"}}>Examen {e.date} · {daysUntil(e.dateObj)} dagen</div>
                </div>
                <div style={{background:`${e.color}22`,border:`1px solid ${e.color}44`,borderRadius:8,padding:"4px 10px",fontSize:13,color:e.color,fontWeight:600}}>{progress[e.id]}%</div>
              </div>
              <div className="pbar" style={{marginBottom:12}}>
                <div className="pfill" style={{width:`${progress[e.id]}%`,background:`linear-gradient(90deg,${e.color}88,${e.color})`}}/>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                <input type="number" min="1" max="100" placeholder="Voer % in..."
                  value={pctInput[e.id]}
                  onChange={ev=>setPctInput(p=>({...p,[e.id]:ev.target.value}))}
                  style={{flex:1}}
                />
                <button className="btn" onClick={()=>{
                  const v=parseInt(pctInput[e.id]);
                  if(v>0){updatePct(e.id,v);setPctInput(p=>({...p,[e.id]:""}))}
                }} style={{padding:"7px 14px",borderRadius:8,background:`${e.color}22`,color:e.color,fontSize:12,border:`1px solid ${e.color}44`,whiteSpace:"nowrap"}}>+ VOEG TOE</button>
              </div>
              <div style={{display:"flex",gap:6}}>
                {[10,25,50].map(v=>(
                  <button key={v} className="btn" onClick={()=>updatePct(e.id,v)} style={{flex:1,padding:"6px",borderRadius:8,fontSize:11,background:`${e.color}15`,color:e.color,border:`1px solid ${e.color}33`}}>+{v}%</button>
                ))}
                <button className="btn" onClick={()=>updatePct(e.id,-10)} style={{padding:"6px 10px",borderRadius:8,fontSize:11,background:"#1A1A24",color:"#666",border:"1px solid #2A2A3E"}}>−10</button>
              </div>
            </div>
          ))}
        </div>}

        {/* BASKETBALL */}
        {tab==="ball" && <div className="fade-in">
          <div className="card" style={{padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={S.label}>{dayName}</div>
            <div style={{fontSize:11,color:"#FF6B35"}}>{DAY_LABEL[dow]}</div>
          </div>

          {/* Sessions */}
          <div className="card" style={{padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={S.label}>Sessies deze week</div>
              <div style={{fontSize:12,color:"#4ECDC4"}}>{sessions}/6</div>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{flex:1,height:36,borderRadius:8,background:i<sessions?"linear-gradient(135deg,#FF6B35,#FF3CAC)":"#1E1E2E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .3s"}}>{i<sessions?"🔥":""}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={()=>setSessions(s=>Math.max(0,s-1))} style={{flex:1,padding:"7px",borderRadius:8,background:"#1A1A24",color:"#666",fontSize:12,border:"1px solid #2A2A3E"}}>− VERWIJDER</button>
              <button className="btn" onClick={()=>setSessions(s=>Math.min(6,s+1))} style={{flex:1,padding:"7px",borderRadius:8,background:"#FF6B3522",color:"#FF6B35",fontSize:12,border:"1px solid #FF6B3544"}}>+ SESSIE</button>
            </div>
          </div>

          {/* Drills */}
          <div style={{...S.label,marginBottom:10}}>Oefeningen vandaag · {doneDrills}/{drills.length} klaar</div>
          {drills.map(dr=>(
            <div key={dr.id} className="card" style={{padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,opacity:dr.done?.45:1,transition:"opacity .3s",cursor:"pointer"}} onClick={()=>toggleDrill(dr.id)}>
              <div style={{width:22,height:22,borderRadius:6,flexShrink:0,border:dr.done?"none":"1px solid #333",background:dr.done?"#FF6B35":"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{dr.done?"✓":""}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,textDecoration:dr.done?"line-through":"none"}}>{dr.name}</div>
                <div style={{marginTop:3}}><span className="badge">{dr.cat}</span></div>
              </div>
              <div style={{fontSize:10,color:"#555",textAlign:"right",minWidth:70}}>{dr.sets}</div>
            </div>
          ))}
        </div>}

        {/* NUTRITION */}
        {tab==="nutrition" && <div className="fade-in">
          {/* Ring */}
          <div className="card" style={{padding:20,marginBottom:12,textAlign:"center"}}>
            <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="54" fill="none" stroke="#1E1E2E" strokeWidth="10"/>
                <circle cx="65" cy="65" r="54" fill="none" stroke="#FF6B35" strokeWidth="10"
                  strokeDasharray={`${2*Math.PI*54}`}
                  strokeDashoffset={`${2*Math.PI*54*(1-calPct/100)}`}
                  strokeLinecap="round" transform="rotate(-90 65 65)"
                  style={{transition:"stroke-dashoffset .8s ease"}}/>
              </svg>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:700,color:"#FF6B35",fontFamily:"'Syne',sans-serif"}}>{totals.cal}</div>
                <div style={{fontSize:9,color:"#555"}}>/ {G.cal} kcal</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[
                {l:"PROTEÏNE",v:totals.protein,g:G.protein,c:"#FF6B35"},
                {l:"KOOLHYD.",v:totals.carbs,g:G.carbs,c:"#FFE66D"},
                {l:"VET",v:totals.fat,g:G.fat,c:"#4ECDC4"},
              ].map(m=>(
                <div key={m.l} style={{background:"#0E0E15",borderRadius:10,padding:"10px 8px"}}>
                  <div style={{fontSize:15,color:m.c,fontWeight:600}}>{m.v}g</div>
                  <div style={{fontSize:8,color:"#555",marginTop:2}}>{m.l}</div>
                  <div style={{marginTop:6}}>
                    <div className="pbar"><div className="pfill" style={{width:`${Math.min(100,(m.v/m.g)*100)}%`,background:m.c}}/></div>
                    <div style={{fontSize:8,color:"#444",marginTop:2}}>doel: {m.g}g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meals list */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={S.label}>Maaltijden vandaag</div>
            <button className="btn" onClick={()=>setAddingMeal(true)} style={{background:"#FF6B3522",color:"#FF6B35",border:"1px solid #FF6B3544",borderRadius:6,padding:"4px 10px",fontSize:10}}>+ VOEG TOE</button>
          </div>

          {addingMeal && (
            <div className="card" style={{padding:14,marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                <input placeholder="Maaltijd naam *" value={mealInput.name} onChange={e=>setMealInput(m=>({...m,name:e.target.value}))} style={{gridColumn:"1/-1"}}/>
                <input placeholder="kcal *" type="number" value={mealInput.cal} onChange={e=>setMealInput(m=>({...m,cal:e.target.value}))}/>
                <input placeholder="proteïne (g)" type="number" value={mealInput.protein} onChange={e=>setMealInput(m=>({...m,protein:e.target.value}))}/>
                <input placeholder="koolhydraten (g)" type="number" value={mealInput.carbs} onChange={e=>setMealInput(m=>({...m,carbs:e.target.value}))}/>
                <input placeholder="vet (g)" type="number" value={mealInput.fat} onChange={e=>setMealInput(m=>({...m,fat:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn" onClick={addMeal} style={{flex:1,padding:"7px",borderRadius:8,background:"#FF6B3522",color:"#FF6B35",border:"1px solid #FF6B3544",fontSize:12}}>OPSLAAN</button>
                <button className="btn" onClick={()=>setAddingMeal(false)} style={{flex:1,padding:"7px",borderRadius:8,background:"#1A1A24",color:"#555",border:"1px solid #2A2A3E",fontSize:12}}>ANNULEER</button>
              </div>
            </div>
          )}

          {meals.length===0 && (
            <div style={{textAlign:"center",padding:"30px 0",color:"#444",fontSize:12}}>Nog geen maaltijden toegevoegd</div>
          )}

          {meals.map(m=>(
            <div key={m.id} className="card" style={{padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#1E1E2E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{m.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13}}>{m.name}</div>
                <div style={{fontSize:10,color:"#555",marginTop:2}}>{m.time} · P:{m.protein}g K:{m.carbs}g V:{m.fat}g</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <div style={{fontSize:13,color:"#FF6B35"}}>{m.cal} kcal</div>
                <button className="btn" onClick={()=>setMeals(ms=>ms.filter(x=>x.id!==m.id))} style={{fontSize:9,color:"#444",background:"none",padding:"2px 4px"}}>✕ verwijder</button>
              </div>
            </div>
          ))}
        </div>}

      </div>
    </div>
  );
}
