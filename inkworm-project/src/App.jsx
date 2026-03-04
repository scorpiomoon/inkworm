import { useState, useMemo } from "react";

// ══════ DATA ══════
const BQ=[{text:"A reader lives a thousand lives before he dies.",author:"George R.R. Martin"},{text:"Not all those who wander are lost.",author:"J.R.R. Tolkien"},{text:"One must always be careful of books, for words have the power of changing us.",author:"Cassandra Clare"},{text:"Think before you speak. Read before you think.",author:"Fran Lebowitz"},{text:"Reading is dreaming with open eyes.",author:"Anissa Trisdianty"},{text:"Words are our most inexhaustible source of magic.",author:"J.K. Rowling"},{text:"There is no friend as loyal as a book.",author:"Ernest Hemingway"},{text:"Until I feared I would lose it, I never loved to read.",author:"Harper Lee"},{text:"Books are a uniquely portable magic.",author:"Stephen King"},{text:"I have always imagined that paradise will be a kind of library.",author:"Jorge Luis Borges"},{text:"The world was hers for the reading.",author:"Betty Smith"},{text:"Sleep is good, he said, and books are better.",author:"George R.R. Martin"},{text:"In the case of good books, the point is not to see how many you can get through, but how many can get through to you.",author:"Mortimer Adler"},{text:"That is part of the beauty of all literature. You discover that your longings are universal longings.",author:"F. Scott Fitzgerald"}];
const AFF=[{"text":"We are all broken. That's how the light gets in.","source":"Hemingway (paraphrased)"},{"text":"You are your best thing.","source":"Toni Morrison, Beloved"},{"text":"I am not what happened to me. I am what I choose to become.","source":"Carl Jung"},{"text":"There is always light, if only we're brave enough to see it.","source":"Amanda Gorman"},{"text":"The world is indeed full of peril, but in it there are also many good things.","source":"J.R.R. Tolkien"},{"text":"You must do the thing you think you cannot do.","source":"Eleanor Roosevelt"},{"text":"Every morning begins a new page in your story. Make it a great one today.","source":"Doe Zantamata"},{"text":"Tomorrow is always fresh, with no mistakes in it.","source":"L.M. Montgomery"},{"text":"You are allowed to be both a masterpiece and a work in progress simultaneously.","source":"Sophia Bush"},{"text":"The human heart has hidden treasures, in secret kept, in silence sealed.","source":"Charlotte Brontë"},{"text":"In the middle of difficulty lies opportunity.","source":"Albert Einstein"},{"text":"What lies behind us and what lies before us are tiny matters compared to what lies within us.","source":"Ralph Waldo Emerson"},{"text":"Act as if what you do makes a difference. It does.","source":"William James"},{"text":"One day, in retrospect, the years of struggle will strike you as the most beautiful.","source":"Sigmund Freud"}];
const GM=[{id:"scramble",name:"Scramble du Jour",icon:"🔀",tl:"Unjumble the literary name",c:"#BDA36B",how:"Rearrange the jumbled letters to form a literary name — an author, character, or work. Use the hint if you're stuck, or shuffle for a fresh arrangement."},{id:"quotes",name:"Quote Match",icon:"💬",tl:"Match quotes to their origins",c:"#B8A9D4",how:"Tap a quote on the left, then tap the source it belongs to on the right. Match all four pairs with as few mistakes as possible."},{id:"kindred",name:"Kindred Words",icon:"🔗",tl:"Find 4 groups of 4",c:"#D4929B",how:"Find four groups of four related words. Select four words and hit Submit. You get four mistakes before the game ends. Watch for tricky overlaps!"},{id:"wanderlust",name:"Wanderlust",icon:"🌍",tl:"Find the literary landmark",c:"#6BA8A0",how:"A literary place is described through progressive clues. Pick the location from the map. Each wrong guess reveals a new clue and shows how far off you were."}];

// How to Play overlay — shows once per game, tap to start
const HowTo=({game,onStart})=>{const g=GM.find(m=>m.id===game);if(!g)return null;return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"#FDFBF7",fontFamily:F}}>
  <div style={{fontSize:56,marginBottom:16}}>{g.icon}</div>
  <div style={{fontFamily:S,fontSize:26,color:"#1F1D2B",marginBottom:6,textAlign:"center"}}>{g.name}</div>
  <div style={{fontSize:13,color:g.c,fontWeight:600,letterSpacing:.5,marginBottom:20}}>{g.tl}</div>
  <div style={{maxWidth:300,background:"white",borderRadius:16,padding:"20px 24px",border:"1.5px solid rgba(0,0,0,.05)",boxShadow:"0 2px 12px rgba(0,0,0,.04)",marginBottom:28}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#8E89A3",marginBottom:10}}>How to play</div>
    <div style={{fontSize:14,color:"#4A4660",lineHeight:1.6}}>{g.how}</div>
  </div>
  <button onClick={onStart} style={{padding:"14px 56px",borderRadius:14,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:F,boxShadow:"0 4px 20px rgba(31,29,43,.2)"}}>Let's go →</button>
</div>;};

const SC=[{"a":"BECKY SHARP","h1":"She climbed society's ladder with charm as her only inheritance","h2":"Thackeray's cunning heroine in Vanity Fair","t":"character"},{"a":"CHINUA ACHEBE","h1":"He showed the world that things fall apart when colonial stories go unchallenged","h2":"Nigerian author of Things Fall Apart","t":"author"},{"a":"PIP PIRRIP","h1":"A boy in the marshes dreamed bigger than the forge could contain","h2":"Full name of the hero of Great Expectations","t":"character"},{"a":"THE BELL JAR","h1":"A glass prison that suffocated from the inside while the world looked on","h2":"Sylvia Plath's only novel about a young woman's breakdown","t":"work"},{"a":"KUNDERA","h1":"He proved that unbearable lightness could weigh more than gravity","h2":"Czech author of The Unbearable Lightness of Being","t":"author"},{"a":"ISHMAEL","h1":"He survived because a coffin became a lifeboat — irony worthy of the sea","h2":"The narrator of Moby-Dick who alone escaped to tell the tale","t":"character"},{"a":"TONI MORRISON","h1":"She made the beloved unburied and gave unspeakable history a voice","h2":"Nobel laureate who wrote Beloved and Song of Solomon","t":"author"},{"a":"URIAH HEEP","h1":"His 'umble manners hid a serpent coiled around the law office","h2":"The obsequious villain in David Copperfield","t":"character"},{"a":"WUTHERING HEIGHTS","h1":"A house named after the wind that never stopped tearing through it","h2":"Emily Brontë's only novel, set on the Yorkshire moors","t":"work"},{"a":"BORGES","h1":"He built labyrinths inside libraries and made infinity feel claustrophobic","h2":"Argentine master of metaphysical short fiction","t":"author"},{"a":"LADY MACBETH","h1":"She washed her hands until the water turned to guilt","h2":"Shakespeare's ambitious queen who urged murder for a crown","t":"character"},{"a":"HARUKI MURAKAMI","h1":"His characters lose cats, enter wells, and find portals to other worlds in Tokyo","h2":"Japanese novelist known for Kafka on the Shore and Norwegian Wood","t":"author"},{"a":"MAGWITCH","h1":"A convict in chains repaid a child's kindness with a gentleman's fortune","h2":"The secret benefactor in Great Expectations","t":"character"},{"a":"ONE HUNDRED YEARS","h1":"A family repeated its mistakes through generations in a town built on solitude","h2":"García Márquez's masterpiece set in Macondo","t":"work"},{"a":"CAMUS","h1":"He rolled the boulder uphill and called it happiness","h2":"French-Algerian author of The Stranger and The Myth of Sisyphus","t":"author"},{"a":"IAGO","h1":"He whispered poison into trust until a handkerchief became a death warrant","h2":"Shakespeare's villain who destroyed Othello through jealousy","t":"character"},{"a":"GABRIEL GARCIA","h1":"He made it rain for four years and eleven months in a fictional town","h2":"Colombian Nobel laureate, father of magical realism","t":"author"},{"a":"BERTHA MASON","h1":"She burned in the attic that was both her prison and her revenge","h2":"Rochester's hidden first wife in Jane Eyre","t":"character"},{"a":"CRIME AND PUNISHMENT","h1":"A young man's axe split open a theory that only power could justify","h2":"Dostoevsky's novel about a murderer's moral torment","t":"work"},{"a":"MARQUEZ","h1":"His colonel had no one to write to him, but the whole world read his stories","h2":"Author of Love in the Time of Cholera","t":"author"},{"a":"NORA HELMER","h1":"She danced the tarantella one last time before slamming the most famous door in drama","h2":"Ibsen's heroine who leaves her husband in A Doll's House","t":"character"},{"a":"KAZUO ISHIGURO","h1":"His butler served dignity on a silver platter while his heart gathered dust","h2":"Nobel laureate who wrote The Remains of the Day and Never Let Me Go","t":"author"},{"a":"MR ROCHESTER","h1":"He hid a burning secret on the third floor and proposed in a garden of equals","h2":"The brooding master of Thornfield Hall in Jane Eyre","t":"character"},{"a":"INVISIBLE MAN","h1":"He was unseen not because of science, but because America refused to look","h2":"Ralph Ellison's novel about Black identity in America","t":"work"},{"a":"NERUDA","h1":"He wrote odes to socks, onions, and salt — and made them all feel like love poems","h2":"Chilean poet of Twenty Love Poems and a Song of Despair","t":"author"},{"a":"EDMOND DANTES","h1":"He entered prison as a sailor and emerged as the instrument of perfect revenge","h2":"The hero of The Count of Monte Cristo","t":"character"},{"a":"CHIMAMANDA","h1":"She told the danger of a single story and then wrote several to prove it","h2":"Nigerian author of Half of a Yellow Sun and Americanah","t":"author"},{"a":"FAUSTUS","h1":"He traded eternity for twenty-four years of knowledge and called it a bargain","h2":"Marlowe's scholar who sold his soul to the devil","t":"character"},{"a":"THE TRIAL","h1":"He was arrested one morning and never learned what crime he had committed","h2":"Kafka's nightmarish novel about Joseph K.","t":"work"},{"a":"SARAMAGO","h1":"He punctuated nothing, capitalized little, and won the Nobel for seeing through blindness","h2":"Portuguese Nobel author of Blindness and The Gospel According to Jesus Christ","t":"author"},{"a":"SCHEHERAZADE","h1":"She defeated a death sentence with the oldest weapon: a story left unfinished","h2":"The narrator of One Thousand and One Nights","t":"character"},{"a":"UMBERTO ECO","h1":"He hid a murder mystery inside a medieval library and dared the reader to keep up","h2":"Italian semiotician who wrote The Name of the Rose","t":"author"},{"a":"RASKOLNIKOV","h1":"His extraordinary man theory crumbled the moment the axe came down","h2":"The tormented student murderer in Crime and Punishment","t":"character"},{"a":"MIDNIGHT CHILDREN","h1":"Born at the exact stroke of independence, they inherited a nation's magic and its curse","h2":"Rushdie's Booker of Bookers novel about India's first generation","t":"work"},{"a":"CALVINO","h1":"He climbed a tree as a boy and refused to come down — literally and literarily","h2":"Italian author of If on a winter's night a traveler","t":"author"}];

const QM=[{"q":"It was a bright cold day in April, and the clocks were striking thirteen.","s":"1984 — Orwell"},{"q":"The past is a foreign country: they do things differently there.","s":"The Go-Between — Hartley"},{"q":"I am an invisible man.","s":"Invisible Man — Ellison"},{"q":"Happy families are all alike; every unhappy family is unhappy in its own way.","s":"Anna Karenina — Tolstoy"},{"q":"It is a far, far better thing that I do, than I have ever done.","s":"A Tale of Two Cities — Dickens"},{"q":"Who controls the past controls the future. Who controls the present controls the past.","s":"1984 — Orwell"},{"q":"One cannot think well, love well, sleep well, if one has not dined well.","s":"A Room of One's Own — Woolf"},{"q":"The only people for me are the mad ones.","s":"On the Road — Kerouac"},{"q":"In the beginning the Universe was created. This has made a lot of people very angry.","s":"Hitchhiker's Guide — Adams"},{"q":"We are all in the gutter, but some of us are looking at the stars.","s":"Lady Windermere's Fan — Wilde"},{"q":"There is no greater agony than bearing an untold story inside you.","s":"I Know Why the Caged Bird Sings — Angelou"},{"q":"I took a deep breath and listened to the old brag of my heart: I am, I am, I am.","s":"The Bell Jar — Plath"},{"q":"People generally see what they look for, and hear what they listen for.","s":"To Kill a Mockingbird — Lee"},{"q":"Beware; for I am fearless, and therefore powerful.","s":"Frankenstein — Shelley"},{"q":"Perhaps one did not want to be loved so much as to be understood.","s":"1984 — Orwell"},{"q":"The only way out of the labyrinth of suffering is to forgive.","s":"Looking for Alaska — Green"},{"q":"And so we beat on, boats against the current, borne back ceaselessly into the past.","s":"The Great Gatsby — Fitzgerald"},{"q":"Isn't it nice to think that tomorrow is a new day with no mistakes in it yet?","s":"Anne of Green Gables — Montgomery"},{"q":"All we have to decide is what to do with the time that is given us.","s":"Lord of the Rings — Tolkien"},{"q":"It does not do to dwell on dreams and forget to live.","s":"Harry Potter — Rowling"},{"q":"One must still have chaos in oneself to be able to give birth to a dancing star.","s":"Thus Spoke Zarathustra — Nietzsche"},{"q":"Until I feared I would lose it, I never loved to read. One does not love breathing.","s":"To Kill a Mockingbird — Lee"},{"q":"I have spread my dreams under your feet; tread softly because you tread on my dreams.","s":"He Wishes for the Cloths of Heaven — Yeats"},{"q":"The answer to the ultimate question of life, the universe and everything is 42.","s":"Hitchhiker's Guide — Adams"},{"q":"What is hell? I maintain that it is the suffering of being unable to love.","s":"The Brothers Karamazov — Dostoevsky"},{"q":"We read to know we are not alone.","s":"Shadowlands — Nicholson (on C.S. Lewis)"},{"q":"I think it pisses God off if you walk by the color purple in a field somewhere and don't notice it.","s":"The Color Purple — Walker"},{"q":"The world breaks everyone, and afterward, many are strong at the broken places.","s":"A Farewell to Arms — Hemingway"}];


const KD=[{"g":[{"l":"Kafka Characters","w":["GREGOR","JOSEPH","KARL","HUNGER"],"c":"#BDA36B"},{"l":"Greek Tragedies","w":["ANTIGONE","MEDEA","OEDIPUS","ELECTRA"],"c":"#B8A9D4"},{"l":"Brontë Novels","w":["JANE","WUTHERING","AGNES","VILLETTE"],"c":"#9DB89A"},{"l":"Narrators We Distrust","w":["HUMBERT","STEVENS","BRIONY","ZENO"],"c":"#D4929B"}]},{"g":[{"l":"One-Word Titled Novels","w":["BELOVED","PERSUASION","MIDDLEMARCH","LOLITA"],"c":"#BDA36B"},{"l":"Literary Islands","w":["TREASURE","UTOPIA","CRUSOE","LAPUTA"],"c":"#B8A9D4"},{"l":"Absurdist Authors","w":["BECKETT","IONESCO","CAMUS","HELLER"],"c":"#9DB89A"},{"l":"Poisoned Characters","w":["HAMLET","EMMA","SOCRATES","JULIET"],"c":"#D4929B"}]},{"g":[{"l":"Booker Prize Novels","w":["MIDNIGHT","REMAINS","BLIND","LUMINARIES"],"c":"#BDA36B"},{"l":"Animal Titles","w":["MOCKINGBIRD","SEAGULL","WHALE","BUTTERFLY"],"c":"#B8A9D4"},{"l":"Exiled Authors","w":["DANTE","OVID","HUGO","SOLZHENITSYN"],"c":"#9DB89A"},{"l":"Literary Doubles","w":["JEKYLL","DORIAN","DOPPELGANGER","EYRE"],"c":"#D4929B"}]},{"g":[{"l":"Debut Novels","w":["THINGS","INVISIBLE","BELL","CATCHER"],"c":"#BDA36B"},{"l":"Shakespeare Villains","w":["IAGO","SHYLOCK","EDMUND","CLAUDIUS"],"c":"#B8A9D4"},{"l":"Magic Realism","w":["MARQUEZ","RUSHDIE","ALLENDE","MURAKAMI"],"c":"#9DB89A"},{"l":"Literary Prisons","w":["BASTILLE","CHATEAU","AZKABAN","ALCATRAZ"],"c":"#D4929B"}]},{"g":[{"l":"Last Lines","w":["GATSBY","ULYSSES","PARADISE","CATCHER"],"c":"#BDA36B"},{"l":"Pen Names","w":["TWAIN","ELIOT","SAND","FERRANTE"],"c":"#B8A9D4"},{"l":"Literary Cafés","w":["CLOSERIE","SHAKESPEARE","GIUBBE","ELEPHANT"],"c":"#9DB89A"},{"l":"Verse Novels","w":["ONEGIN","AURORA","OMEROS","GOLDEN"],"c":"#D4929B"}]},{"g":[{"l":"Unrequited Love","w":["CYRANO","WERTHER","GATSBY","SNAPE"],"c":"#BDA36B"},{"l":"Literary Trials","w":["KAFKA","MEURSAULT","MOCKINGBIRD","DREYFUS"],"c":"#B8A9D4"},{"l":"Banned Books","w":["ULYSSES","BOVARY","LOLITA","CLOCKWORK"],"c":"#9DB89A"},{"l":"Governess Stories","w":["EYRE","QUINT","AGNES","MUIR"],"c":"#D4929B"}]},{"g":[{"l":"Epistolary Novels","w":["DRACULA","PAMELA","COLOR","GRIFFIN"],"c":"#BDA36B"},{"l":"Latin American Boom","w":["BORGES","CORTAZAR","FUENTES","VARGAS"],"c":"#B8A9D4"},{"l":"Gothic Mansions","w":["MANDERLEY","THORNFIELD","UDOLPHO","BASKERVILLE"],"c":"#9DB89A"},{"l":"Child Narrators","w":["SCOUT","OSKAR","AMIR","PADMA"],"c":"#D4929B"}]}];

const WL=[{"answer":"Edinburgh, Scotland","lat":55.9533,"lng":-3.1883,"hints":["A city split in two — old and new — that inspired a story about the same man split in half.","Body snatchers once prowled its graveyards, feeding a medical school and a literary tradition.","A doctor studied medicine here and modeled his fictional detective on a professor's deductive methods.","Its Royal Mile has produced more authors per cobblestone than perhaps any street on earth."]},{"answer":"Florence, Italy","lat":43.7696,"lng":11.2558,"hints":["A poet was exiled from this city and wrote an entire journey through Hell, Purgatory, and Paradise in revenge.","The Renaissance began here, and so did the sonnet as a literary weapon of love.","E.M. Forster sent a young Englishwoman here with a view — and a crisis of convention.","Boccaccio's storytellers fled plague to the hills outside this city and invented the modern short story."]},{"answer":"Moscow, Russia","lat":55.7558,"lng":37.6173,"hints":["A master once visited this city with his devil, his giant cat, and a naked witch on a broomstick.","Pierre Bezukhov stood on its walls and watched an emperor's army approach from the west.","Bulgakov set the greatest Russian novel of the 20th century in its apartments and theaters.","Its literary tradition swings between grand ballrooms and frozen exile — often in the same novel."]},{"answer":"Prague, Czech Republic","lat":50.0755,"lng":14.4378,"hints":["A man woke up as a beetle in one of its apartments and nobody in the family handled it well.","Its castle looms over the city exactly like bureaucracy looms over the novels written here.","Rilke, Kafka, and Kundera all breathed this city's air and turned it into existential literature.","The trial never ended, the castle was never reached, and the author burned his manuscripts. Almost."]},{"answer":"New Orleans, USA","lat":29.9511,"lng":-90.0715,"hints":["A streetcar named Desire once ran through its French Quarter — at least in a playwright's imagination.","Tennessee Williams set his most explosive dramas in its humid, jazz-soaked streets.","A vampire told his story to a journalist in one of its crumbling Garden District mansions.","Kate Chopin's heroines awakened here, where the Mississippi meets magnolias and social rebellion."]},{"answer":"Kolkata, India","lat":22.5726,"lng":88.3639,"hints":["A poet wrote Gitanjali here, won the Nobel, and composed the national anthems of two countries.","Satyajit Ray's Feluda solved mysteries in its lanes while eating jalebis from its sweet shops.","This city's College Street is the largest secondhand book market in the world.","The Bengal Renaissance made it the intellectual capital of a subcontinent, and literature was its weapon."]},{"answer":"Buenos Aires, Argentina","lat":-34.6037,"lng":-58.3816,"hints":["A blind librarian directed the national library here while writing about infinite books and forking paths.","Its tango halls and barrios produced literature as passionate and melancholy as its music.","Cortázar's Hopscotch let readers jump between its chapters — just as one might jump between its neighborhoods.","Borges, Cortázar, and Bioy Casares made this city the capital of literary labyrinths."]}];
const REGS=[{"n":"London","la":51.51,"lo":-0.13,"lb":"🇬🇧"},{"n":"Paris","la":48.86,"lo":2.35,"lb":"🇫🇷"},{"n":"Rome","la":41.9,"lo":12.5,"lb":"🇮🇹"},{"n":"Athens","la":37.98,"lo":23.73,"lb":"🇬🇷"},{"n":"Moscow","la":55.76,"lo":37.62,"lb":"🇷🇺"},{"n":"Delhi","la":28.61,"lo":77.21,"lb":"🇮🇳"},{"n":"Varanasi","la":25.32,"lo":83.01,"lb":"🕉️"},{"n":"Dublin","la":53.35,"lo":-6.26,"lb":"🇮🇪"},{"n":"Stratford","la":52.19,"lo":-1.71,"lb":"🎭"},{"n":"Lake District","la":54.46,"lo":-3.09,"lb":"🏔️"},{"n":"Edinburgh","la":55.95,"lo":-3.19,"lb":"🏴"},{"n":"New York","la":40.71,"lo":-74.01,"lb":"🇺🇸"},{"n":"Tokyo","la":35.68,"lo":139.69,"lb":"🇯🇵"},{"n":"Cairo","la":30.04,"lo":31.24,"lb":"🇪🇬"},{"n":"St Petersburg","la":59.93,"lo":30.33,"lb":"🇷🇺"},{"n":"Florence","la":43.77,"lo":11.26,"lb":"🇮🇹"},{"n":"Istanbul","la":41.01,"lo":28.98,"lb":"🇹🇷"},{"n":"Beijing","la":39.9,"lo":116.4,"lb":"🇨🇳"},{"n":"Kolkata","la":22.57,"lo":88.36,"lb":"📖"},{"n":"Shiraz","la":29.59,"lo":52.58,"lb":"🇮🇷"},{"n":"Oxford","la":51.75,"lo":-1.26,"lb":"🎓"},{"n":"Amherst","la":42.37,"lo":-72.52,"lb":"📝"}];

// ══════ UTILS ══════
const timeTheme=()=>{const h=new Date().getHours();
  if(h>=5&&h<8)return{greet:"Good morning",bg:"linear-gradient(180deg,#FFF5EB 0%,#FFE8D6 30%,#FDFBF7 70%,#F5F0E8 100%)",emoji:"🌅",accent:"#E8A87C"};
  if(h>=8&&h<11)return{greet:"Good morning",bg:"linear-gradient(180deg,#FFF9F0 0%,#FFF3E0 30%,#FDFBF7 70%,#F6F3FB 100%)",emoji:"☀️",accent:"#F0C27F"};
  if(h>=11&&h<14)return{greet:"Good afternoon",bg:"linear-gradient(180deg,#F0F7FF 0%,#E8F0FE 30%,#FDFBF7 70%,#F5F0E8 100%)",emoji:"🌤️",accent:"#7EB8DA"};
  if(h>=14&&h<17)return{greet:"Good afternoon",bg:"linear-gradient(180deg,#F6F3FB 0%,#EDE8F5 30%,#FDFBF7 70%,#F5F0E8 100%)",emoji:"📖",accent:"#B8A9D4"};
  if(h>=17&&h<20)return{greet:"Good evening",bg:"linear-gradient(180deg,#FFF0E8 0%,#F5DCC8 30%,#FDFBF7 70%,#F0E8F5 100%)",emoji:"🌇",accent:"#D4929B"};
  return{greet:"Good evening",bg:"linear-gradient(180deg,#E8E0F5 0%,#DDD5EB 30%,#F5F0F8 70%,#EDEAF2 100%)",emoji:"🌙",accent:"#8E89A3"};
};
const shuf=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
// Seeded shuffle: same seed = same order every time (for daily rotation)
const seedRng=seed=>{let s=seed;return()=>{s=(s*16807+0)%2147483647;return(s-1)/2147483646;};};
const dayKey=()=>{const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();};
const seededShuf=(a,seed)=>{const b=[...a],r=seedRng(seed);for(let i=b.length-1;i>0;i--){const j=0|r()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
const scram=w=>{const c=w.split("");for(let i=c.length-1;i>0;i--){const j=0|Math.random()*(i+1);if(c[i]===" "||c[j]===" ")continue;[c[i],c[j]]=[c[j],c[i]];}if(c.join("")===w)for(let i=0;i<c.length-1;i++){if(c[i]!==" "&&c[i+1]!==" "){[c[i],c[i+1]]=[c[i+1],c[i]];break;}}return c.join("");};
const hav=(a,b,c,d)=>{const R=6371,dL=(c-a)*Math.PI/180,dN=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));};
const dLbl=km=>km<50?{t:"🔥 Scorching!",c:"#D4929B"}:km<200?{t:"🌡️ Very warm!",c:"#BDA36B"}:km<500?{t:"☀️ Warmer",c:"#B8A9D4"}:km<1500?{t:"❄️ Cold",c:"#8E89A3"}:{t:"🥶 Freezing",c:"#C2BDCF"};
const D=(m,n)=>{if(Array.isArray(m)){if(m.length>0&&m[0].g){const dk=dayKey()%m.length;return{...m[dk],g:seededShuf(m[dk].g,dayKey())};}if(m.length>0&&m[0].answer){return m[dayKey()%m.length];}const shuffled=seededShuf(m,dayKey());return n?shuffled.slice(0,n):shuffled;}return m;};
const CSS=`@keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.3}50%{transform:translate(-50%,-50%) scale(1.3);opacity:.1}}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes confettiFall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}@keyframes sparkle{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`;
const F="DM Sans,sans-serif",S="DM Serif Display,serif";

// Elegant result dots — ink dots for correct, hollow for missed
const Dots=({res})=><div style={{display:"flex",gap:6,justifyContent:"center"}}>{res.map((r,j)=><div key={j} style={{width:10,height:10,borderRadius:"50%",background:r?"#1F1D2B":"transparent",border:r?"2px solid #1F1D2B":"2px solid #C2BDCF",transition:"all .3s"}}/>)}</div>;

// Confetti overlay
const Confetti=()=>{const colors=["#B8A9D4","#9DB89A","#D4929B","#BDA36B","#6BA8A0","#E8C3C9","#C8D9C5"];const pieces=Array.from({length:50}).map((_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*3,dur:2+Math.random()*3,color:colors[i%colors.length],size:4+Math.random()*8,shape:Math.random()>.5?"50%":"2px"}));return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,overflow:"hidden"}}>{pieces.map(p=><div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:0,width:p.size,height:p.size,background:p.color,borderRadius:p.shape,animation:`confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,opacity:0}}/>)}</div>;};

// ══════ SHARED UI ══════
const Hdr=({t,onBack,r,confirmBack})=>{
  const[show,setShow]=useState(false);
  const handleBack=()=>{if(confirmBack){setShow(true);}else{onBack();}};
  return <div style={{position:"relative"}}><div style={{display:"flex",alignItems:"center",padding:"48px 20px 16px"}}><button onClick={handleBack} style={{background:"none",border:"none",color:"#4A4660",padding:8,marginLeft:-8,borderRadius:10,display:"flex",cursor:"pointer"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:1.8,textTransform:"uppercase",color:"#C2BDCF"}}>{t}</div></div><div style={{fontSize:13,fontWeight:600,color:"#8E89A3"}}>{r}</div></div>
  {show&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShow(false)}><div onClick={e=>e.stopPropagation()} style={{background:"#FDFBF7",borderRadius:16,padding:"24px",maxWidth:300,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.15)"}}><div style={{fontFamily:S,fontSize:18,color:"#1F1D2B",marginBottom:8}}>Leave game?</div><div style={{fontSize:13,color:"#8E89A3",marginBottom:20}}>Your progress in this round will be lost.</div><div style={{display:"flex",gap:10}}><button onClick={()=>setShow(false)} style={{flex:1,padding:"12px",borderRadius:12,border:"1.5px solid rgba(0,0,0,.08)",background:"white",fontWeight:600,fontSize:14,color:"#8E89A3",cursor:"pointer",fontFamily:F}}>Stay</button><button onClick={onBack} style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:"#1F1D2B",fontWeight:700,fontSize:14,color:"white",cursor:"pointer",fontFamily:F}}>Leave</button></div></div></div>}
  </div>;
};
const Done=({icon,title,sub,children,onGo})=><div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,background:"#FDFBF7",fontFamily:F}}><div style={{fontSize:56,marginBottom:16}}>{icon}</div><div style={{fontFamily:S,fontSize:28,color:"#1F1D2B",marginBottom:8}}>{title}</div><div style={{fontSize:15,color:"#8E89A3",marginBottom:24}}>{sub}</div>{children}<button onClick={onGo} style={{padding:"14px 40px",borderRadius:14,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:F,marginTop:16}}>Continue Quest →</button></div>;
const PBar=({n,idx,res})=><div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:28}}>{Array.from({length:n}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<idx?(res[i]?"#9DB89A":"#E8C3C9"):i===idx?"#BDA36B":"#E8E0F5",transition:"background .3s"}}/>)}</div>;

// ══════ GAME 1: SCRAMBLE DU JOUR ══════
function G1({onDone,onBack}){
  const pzBase=useMemo(()=>D(SC,5),[]);
  const[i,sI]=useState(0);const[inp,sInp]=useState("");const[rev,sRev]=useState(false);
  const[res,sRes]=useState([]);const[hintLv,sHL]=useState(0);const[shk,sSh]=useState(false);
  const[curScram,setCurScram]=useState(()=>scram(pzBase[0].a));
  const p=pzBase[i];const done=i>=pzBase.length;
  const cc={author:"#B8A9D4",work:"#9DB89A",character:"#BDA36B"};
  const doShuffle=()=>{setCurScram(scram(p.a));};
  const adv=()=>{
    if(i===pzBase.length-1)sI(pzBase.length);
    else{const ni=i+1;sI(ni);sInp("");sRev(false);sHL(0);setCurScram(scram(pzBase[ni].a));}
  };
  const sub=()=>{if(!inp.trim())return;if(inp.trim().toUpperCase()===p.a){sRev(true);sRes(r=>[...r,true]);setTimeout(adv,1200);}else{sSh(true);setTimeout(()=>sSh(false),500);}};
  const reveal=()=>{sRev(true);sRes(r=>[...r,false]);setTimeout(adv,1500);};

  if(done){const c=res.filter(Boolean).length;return <Done icon="🔀" title={c===pzBase.length?"Perfect!":c>=3?"Well done!":"Nice try!"} sub={`${c} of ${pzBase.length} unscrambled`} onGo={()=>onDone(c)}>
    <Dots res={res}/>
  </Done>;}

  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}>
    <Hdr t="Scramble du Jour" onBack={onBack} confirmBack r={`${i+1}/${pzBase.length}`}/>
    <PBar n={pzBase.length} idx={i} res={res}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px"}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:cc[p.t],marginBottom:12,background:cc[p.t]+"18",padding:"4px 14px",borderRadius:20}}>{p.t}</div>

      {/* Scrambled letter tiles */}
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6,marginBottom:16,animation:shk?"shake .4s ease":"none"}}>
        {curScram.split("").map((ch,j)=><div key={j} style={{width:ch===" "?16:40,height:48,background:ch===" "?"transparent":rev?"#D4E6CF":"white",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#1F1D2B",boxShadow:ch===" "?"none":"0 2px 8px rgba(0,0,0,.06)",border:ch===" "?"none":"1.5px solid rgba(0,0,0,.06)",fontFamily:S,transition:"all .3s"}}>{ch===" "?"":rev?p.a[j]:ch}</div>)}
      </div>

      {/* Shuffle button */}
      {!rev&&<button onClick={doShuffle} style={{marginBottom:20,padding:"8px 20px",borderRadius:20,border:"1.5px solid #E8E0F5",background:"white",color:"#8E89A3",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:6}}>🔀 Shuffle letters</button>}

      {hintLv>=1&&<div style={{fontSize:13,color:"#8E89A3",fontStyle:"italic",marginBottom:8,textAlign:"center",padding:"8px 16px",background:"#F6F3FB",borderRadius:10}}>💡 {p.h1}</div>}
      {hintLv>=2&&p.h2&&<div style={{fontSize:13,color:"#6B966A",fontStyle:"italic",marginBottom:8,textAlign:"center",padding:"8px 16px",background:"#F0F7EE",borderRadius:10}}>🔎 {p.h2}</div>}
      {rev&&<div style={{fontSize:18,fontWeight:700,color:"#9DB89A",fontFamily:S,marginBottom:16}}>{p.a}</div>}

      {!rev&&<div style={{width:"100%",maxWidth:320}}>
        <input type="text" value={inp} onChange={e=>sInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()} placeholder="Type your answer..." autoFocus style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid #E8E0F5",background:"white",fontSize:16,fontFamily:F,color:"#1F1D2B",outline:"none"}}/>
        <button onClick={sub} style={{width:"100%",marginTop:14,padding:14,borderRadius:14,border:"none",background:inp.trim()?"#1F1D2B":"#E8E0F5",color:inp.trim()?"white":"#C2BDCF",fontWeight:700,fontSize:15,cursor:inp.trim()?"pointer":"default",fontFamily:F}}>Check</button>
        <div style={{display:"flex",gap:10,marginTop:10,justifyContent:"center"}}>
          {hintLv<2&&<button onClick={()=>sHL(h=>h+1)} style={{background:"none",border:"none",fontSize:13,color:"#B8A9D4",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>{hintLv===0?"💡 Hint":"🔎 Easier hint"}</button>}
          <button onClick={reveal} style={{background:"none",border:"none",fontSize:13,color:"#D4929B",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>👁 Reveal</button>
          <button onClick={()=>{sRes(r=>[...r,false]);adv();}} style={{background:"none",border:"none",fontSize:13,color:"#C2BDCF",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>Skip →</button>
        </div>
      </div>}
    </div>
    <style>{CSS}</style>
  </div>;
}

// ══════ GAME 2: QUOTE MATCH ══════
function G2({onDone,onBack}){
  const pairs=D(QM,4);const ss=useMemo(()=>shuf(pairs.map((p,i)=>({t:p.s,i}))),[]);
  const[sQ,sSQ]=useState(null);const[sS,sSS]=useState(null);const[mt,sMt]=useState(new Set());const[mk,sMk]=useState(0);const[fl,sFl]=useState(null);const[lo,sLo]=useState(null);const[fin,sFin]=useState(false);
  const tryM=(q,s)=>{if(q===s){sLo(q);setTimeout(()=>{const nxt=new Set([...mt,q]);sMt(nxt);sSQ(null);sSS(null);sLo(null);if(nxt.size===pairs.length)sFin(true);},700);}else{sMk(m=>m+1);sFl(true);setTimeout(()=>{sSQ(null);sSS(null);sFl(null);},600);}};
  const tQ=i=>{if(mt.has(i))return;sFl(null);sSQ(i);if(sS!==null)tryM(i,sS);};
  const tS=i=>{if(mt.has(i))return;sFl(null);sSS(i);if(sQ!==null)tryM(sQ,i);};
  if(fin)return <Done icon="💬" title={mk===0?"Flawless!":mk<=2?"Well matched!":"Good effort!"} sub={mk===0?"No mistakes!":`${mk} wrong guess${mk>1?"es":""}`} onGo={()=>onDone(Math.max(0,pairs.length-mk))}/>;
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}><Hdr t="Quote Match" onBack={onBack} confirmBack r={`${mt.size}/${pairs.length}`}/>
    {/* Selection indicator */}
    {(sQ!==null||sS!==null)&&!fl&&<div style={{textAlign:"center",fontSize:12,color:"#B8A9D4",marginBottom:8,padding:"0 20px"}}>{sQ!==null&&sS!==null?"Checking...":sQ!==null?"Now tap a source ↓":"Now tap a quote ↑"}</div>}
    <div style={{textAlign:"center",fontSize:13,color:"#8E89A3",marginBottom:20,padding:"0 20px"}}>Tap a quote, then tap its source</div><div style={{padding:"0 16px",marginBottom:16}}><div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#B8A9D4",marginBottom:8,paddingLeft:4}}>Quotes</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{pairs.map((p,i)=>{const m=mt.has(i),sel=sQ===i,ok=lo===i,wr=fl&&sel;return <div key={i} onClick={()=>!m&&tQ(i)} style={{padding:"12px 14px",borderRadius:12,fontSize:13,lineHeight:1.5,fontStyle:"italic",color:m?"#9DB89A":"#4A4660",background:ok?"#D4E6CF":wr?"#FCDEDE":sel?"#F0ECFA":m?"#F5FAF4":"white",border:sel?"2px solid #B8A9D4":m?"1.5px solid #C8D9C5":"1.5px solid rgba(0,0,0,.05)",cursor:m?"default":"pointer",opacity:m?.6:1,animation:wr?"shake .4s ease":"none",userSelect:"none",transition:"all .25s"}}>"{p.q}"{m&&<span style={{float:"right",fontStyle:"normal",fontSize:12}}>✓</span>}{sel&&<span style={{float:"right",fontStyle:"normal",fontSize:10,color:"#B8A9D4",fontWeight:700}}>SELECTED</span>}</div>;})}</div></div><div style={{padding:"0 16px",marginBottom:24}}><div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#BDA36B",marginBottom:8,paddingLeft:4}}>Sources</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{ss.map(s=>{const m=mt.has(s.i),sel=sS===s.i,ok=lo===s.i,wr=fl&&sel;return <div key={s.i} onClick={()=>!m&&tS(s.i)} style={{padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:600,color:m?"#9DB89A":"#1F1D2B",background:ok?"#D4E6CF":wr?"#FCDEDE":sel?"#FFF8E7":m?"#F5FAF4":"white",border:sel?"2px solid #BDA36B":m?"1.5px solid #C8D9C5":"1.5px solid rgba(0,0,0,.08)",cursor:m?"default":"pointer",opacity:m?.6:1,animation:wr?"shake .4s ease":"none",userSelect:"none",transition:"all .25s"}}>{s.t}{m&&<span style={{marginLeft:6,fontSize:11}}>✓</span>}{sel&&<span style={{marginLeft:4,fontSize:10}}>✦</span>}</div>;})}</div></div>{mk>0&&<div style={{textAlign:"center",fontSize:12,color:"#D4929B"}}>{mk} wrong guess{mk>1?"es":""}</div>}<style>{CSS}</style></div>;
}

// ══════ GAME 3: KINDRED ══════
function G4({onDone,onBack}){
  const data=D(KD);const allW=useMemo(()=>shuf(data.g.flatMap((g,gi)=>g.w.map(w=>({w,gi})))),[]);
  const[sel,sSel]=useState(new Set());const[sol,sSol]=useState([]);const[mk,sMk]=useState(0);const[wf,sWf]=useState(false);const[nearMsg,setNear]=useState(null);
  const mx=4,over=mk>=mx,won=sol.length===4,dn=over||won;const rem=allW.filter(x=>!sol.includes(x.gi));
  const tap=w=>{if(dn)return;sWf(false);setNear(null);sSel(p=>{const n=new Set(p);n.has(w)?n.delete(w):n.size<4&&n.add(w);return n;});};
  const sub=()=>{if(sel.size!==4||dn)return;const ws=[...sel],gis=ws.map(w=>allW.find(a=>a.w===w)?.gi);if(gis.every(g=>g===gis[0])){sSol(p=>[...p,gis[0]]);sSel(new Set());setNear(null);}else{
    const counts={};gis.forEach(g=>{counts[g]=(counts[g]||0)+1;});const best=Math.max(...Object.values(counts));
    if(best===3)setNear("So close! 3 of 4 are from the same group.");else setNear(null);
    sMk(m=>m+1);sWf(true);setTimeout(()=>{sWf(false);sSel(new Set());},800);}
  };
  if(dn)return <Done icon="🔗" title={won?(mk===0?"Perfect bonds!":"Kindred Words found!"):"Better luck next time!"} sub={`${sol.length} of 4 groups found`} onGo={()=>onDone(sol.length)}><div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:340}}>{data.g.map((g,i)=><div key={i} style={{padding:"10px 14px",borderRadius:12,background:sol.includes(i)?g.c+"22":"#F5F0E8",border:`1.5px solid ${sol.includes(i)?g.c:"#E0D5C4"}`}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:g.c,marginBottom:4}}>{g.l}</div><div style={{fontSize:13,color:"#4A4660"}}>{g.w.join(" · ")}</div></div>)}</div></Done>;
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}><Hdr t="Kindred Words" onBack={onBack} confirmBack r={`${sol.length}/4`}/><div style={{textAlign:"center",fontSize:13,color:"#8E89A3",marginBottom:16}}>Find 4 groups of 4 related words</div><div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>{Array.from({length:mx}).map((_,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:i<mk?"#D4929B":"#E8E0F5"}}/>)}<span style={{fontSize:11,color:"#8E89A3",marginLeft:4}}>{mx-mk} left</span></div>{nearMsg&&<div style={{textAlign:"center",fontSize:13,color:"#BDA36B",fontWeight:600,marginBottom:12,animation:"fadeUp .3s ease-out"}}>✨ {nearMsg}</div>}{sol.length>0&&<div style={{padding:"0 16px",marginBottom:12}}>{sol.map(gi=>{const g=data.g[gi];return <div key={gi} style={{padding:"10px 14px",borderRadius:12,marginBottom:8,background:g.c+"18",border:`1.5px solid ${g.c}44`,animation:"fadeUp .3s ease-out"}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:g.c,marginBottom:2}}>{g.l}</div><div style={{fontSize:13,color:"#4A4660"}}>{g.w.join(" · ")}</div></div>;})}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"0 16px",marginBottom:20,animation:wf?"shake .4s ease":"none"}}>{rem.map(({w})=>{const s=sel.has(w);return <div key={w} onClick={()=>tap(w)} style={{padding:"10px 4px",borderRadius:10,textAlign:"center",fontSize:w.length>8?10:12,fontWeight:700,color:s?"white":"#1F1D2B",background:s?"#1F1D2B":"white",border:s?"1.5px solid #1F1D2B":"1.5px solid rgba(0,0,0,.06)",cursor:"pointer",userSelect:"none",transition:"all .15s",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1.2}}>{w}</div>;})}</div><div style={{display:"flex",gap:10,padding:"0 16px",marginBottom:24}}><button onClick={()=>sSel(new Set())} style={{flex:1,padding:12,borderRadius:12,border:"1.5px solid rgba(0,0,0,.08)",background:"white",fontWeight:600,fontSize:14,color:"#8E89A3",cursor:"pointer",fontFamily:F}}>Deselect</button><button onClick={sub} style={{flex:2,padding:12,borderRadius:12,border:"none",background:sel.size===4?"#1F1D2B":"#E8E0F5",fontWeight:700,fontSize:14,color:sel.size===4?"white":"#C2BDCF",cursor:sel.size===4?"pointer":"default",fontFamily:F}}>Submit ({sel.size}/4)</button></div><style>{CSS}</style></div>;
}

// ══════ GAME 5: WANDERLUST ══════
function G5({onDone,onBack}){
  const data=D(WL);const[hi,sHi]=useState(0);const[gs,sGs]=useState([]);const[ok,sOk]=useState(false);const[gaveUp,setGaveUp]=useState(false);
  const guess=r=>{if(ok||gaveUp)return;const d=hav(data.lat,data.lng,r.la,r.lo),c=d<50;sGs(p=>[...p,{n:r.n,d:Math.round(d)}]);if(c)sOk(true);else if(hi<data.hints.length-1)sHi(h=>h+1);};
  const giveUp=()=>{setGaveUp(true);};
  const regGroups=[
    {label:"South Asia",items:REGS.filter(r=>["Delhi","Kurukshetra","Varanasi","Ayodhya","Kerala","Kolkata"].includes(r.n))},
    {label:"Europe",items:REGS.filter(r=>["London","Paris","Rome","Athens","Moscow","Edinburgh","Dublin","Stratford","Lake District","Yorkshire","Baker Street","Istanbul"].includes(r.n))},
    {label:"Rest of World",items:REGS.filter(r=>["Cairo","Beijing","Tokyo","New York"].includes(r.n))},
  ];
  if(ok||gaveUp||gs.length>=6)return <Done icon="🌍" title={ok?"Found it!":gaveUp?"You gave up":"The answer was..."} sub={ok?`Found in ${gs.length} guess${gs.length>1?"es":""}`:`${gs.length} guesses used`} onGo={()=>onDone(ok?Math.max(1,7-gs.length):0)}><div style={{fontSize:18,fontWeight:700,color:"#6BA8A0",fontFamily:S,marginBottom:16}}>📍 {data.answer}</div><div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",maxWidth:300}}>{gs.map((g,i)=>{const dl=dLbl(g.d);return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,color:"#4A4660",padding:"6px 12px",background:g.d<50?"#D4E6CF":"white",borderRadius:8,border:"1px solid rgba(0,0,0,.05)"}}><span>{g.n}</span><span style={{color:dl.c,fontWeight:600}}>{g.d<50?"✓":`${g.d} km`}</span></div>;})}</div></Done>;
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}><Hdr t="Wanderlust" onBack={onBack} confirmBack r={`Guess ${gs.length+1}/6`}/><div style={{padding:"0 20px",marginBottom:16}}><div style={{background:"white",borderRadius:14,padding:"16px 18px",border:"1.5px solid rgba(0,0,0,.05)",boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}><div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#6BA8A0",marginBottom:10}}>🧭 Clue {hi+1} of {data.hints.length}</div>{data.hints.slice(0,hi+1).map((h,j)=><div key={j} style={{fontSize:14,lineHeight:1.6,color:j===hi?"#1F1D2B":"#8E89A3",fontStyle:"italic",marginBottom:j<hi?8:0,fontFamily:S}}>"{h}"</div>)}</div></div>
    {gs.length>0&&<div style={{padding:"0 20px",marginBottom:12}}><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{gs.map((g,i)=>{const dl=dLbl(g.d);return <div key={i} style={{padding:"4px 10px",borderRadius:16,fontSize:12,fontWeight:600,background:dl.c+"18",color:dl.c,border:`1px solid ${dl.c}44`}}>{g.n} — {dl.t}</div>;})}</div></div>}
    <div style={{padding:"0 16px"}}>
      {regGroups.map(rg=>{const avail=rg.items.filter(r=>!gs.some(g=>g.n===r.n));if(!avail.length)return null;return <div key={rg.label} style={{marginBottom:14}}><div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#C2BDCF",marginBottom:6,paddingLeft:4}}>{rg.label}</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{avail.map(r=><button key={r.n} onClick={()=>guess(r)} style={{padding:"7px 12px",borderRadius:18,border:"1.5px solid rgba(0,0,0,.08)",background:"white",fontSize:13,fontWeight:600,color:"#1F1D2B",cursor:"pointer",fontFamily:F}}>{r.lb} {r.n}</button>)}</div></div>;})}
      {gs.length>=2&&<button onClick={giveUp} style={{display:"block",margin:"8px auto 0",padding:"8px 20px",borderRadius:20,border:"1.5px solid #E8C3C9",background:"#FFF8F8",color:"#D4929B",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:F}}>🏳️ I give up — show me</button>}
    </div>
  </div>;
}

// ══════ HOME ══════
// ══════ MAP ══════
function Map({name,onPlay,gs}){
  const pr=useMemo(()=>({d:GM.filter(g=>gs[g.id]?.status==="complete").length,t:GM.length}),[gs]);
  const ai=GM.findIndex(g=>gs[g.id]?.status!=="complete");
  const[toast,setToast]=useState(null);
  const[showScore,setShowScore]=useState(false);
  const tt=useMemo(()=>timeTheme(),[]);
  const q=useMemo(()=>BQ[Math.floor(Date.now()/86400000)%BQ.length],[]);
  const nd=[{x:25,y:0},{x:72,y:1},{x:30,y:2},{x:68,y:3}],sp=150,mh=nd.length*sp+80;
  const pts=nd.map((n,i)=>({x:(n.x/100)*340+20,y:i*sp+60}));
  let pD=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const p=pts[i-1],c=pts[i],cy=(p.y+c.y)/2;pD+=` C ${p.x} ${cy}, ${c.x} ${cy}, ${c.x} ${c.y}`;}
  const tr=[{x:85,y:30,s:1},{x:10,y:110,s:.7},{x:90,y:200,s:.9},{x:5,y:320,s:.6},{x:92,y:400,s:.8},{x:15,y:480,s:.7}];
  const tapNode=(gm,i)=>{
    const ic=gs[gm.id]?.status==="complete",ia=i===ai,il=!ia&&!ic;
    if(il){const prev=GM[i-1];setToast(`Complete ${prev?.name||"previous game"} first`);setTimeout(()=>setToast(null),2000);return;}
    onPlay(gm.id);
  };
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#E8F0E4 0%,#F5F0E8 30%,#FDFBF7 60%)",fontFamily:F}}>
    {pr.d===pr.t&&<Confetti/>}
    <div style={{padding:"48px 20px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,background:"#1F1D2B",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 18 Q9 6, 12 14 Q15 22, 19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg></div><span style={{fontFamily:F,fontSize:16,fontWeight:700,color:"#1F1D2B",letterSpacing:-.3}}>Inkworm</span></div>
        <div style={{fontSize:11,fontWeight:700,color:"#9DB89A",background:"rgba(255,255,255,.8)",padding:"6px 12px",borderRadius:20,backdropFilter:"blur(8px)",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>{pr.d}/{pr.t}</div>
      </div>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:22,fontWeight:700,color:"#1F1D2B",fontFamily:F}}>{tt.greet}, <span style={{background:"linear-gradient(135deg,#B8A9D4,#D4929B)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{name}</span></div>
      </div>
      <div style={{textAlign:"center",marginBottom:16,padding:"0 16px"}}>
        <div style={{fontSize:12,color:"#8E89A3",lineHeight:1.5,fontStyle:"italic"}}>"{q.text}"</div>
        <div style={{fontSize:10,color:"#C2BDCF",marginTop:4,fontWeight:500}}>— {q.author}</div>
      </div>
    </div>

    {toast&&<div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1F1D2B",color:"white",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,zIndex:20,animation:"fadeUp .2s ease-out",boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>{toast}</div>}

    {/* Scorecard modal */}
    {showScore&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowScore(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#FDFBF7",borderRadius:20,padding:"28px 24px",maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 12px 48px rgba(0,0,0,.2)",animation:"fadeUp .3s ease-out",maxHeight:"90dvh",overflowY:"auto"}}>
        <div style={{fontSize:36,marginBottom:8}}>✨</div>
        <div style={{fontFamily:S,fontSize:22,color:"#1F1D2B",marginBottom:4}}>Quest Complete!</div>
        <div style={{fontSize:13,color:"#8E89A3",marginBottom:20}}>Here's how you did today</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {GM.map(gm=>{const s=gs[gm.id]?.score||0;return <div key={gm.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"white",borderRadius:10,border:"1px solid rgba(0,0,0,.04)"}}>
            <span style={{fontSize:18}}>{gm.icon}</span>
            <span style={{flex:1,textAlign:"left",fontSize:13,fontWeight:600,color:"#1F1D2B"}}>{gm.name}</span>
            <span style={{fontSize:12,letterSpacing:1}}>{Array.from({length:5}).map((_,i)=><span key={i} style={{color:i<s?"#BDA36B":"#E8E0F5"}}>●</span>)}</span>
          </div>;})}
        </div>
        {/* Daily affirmation */}
        <div style={{background:"linear-gradient(135deg,#F6F3FB,#F5F0E8)",borderRadius:14,padding:"16px 18px",marginBottom:20,border:"1px solid rgba(0,0,0,.03)"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#B8A9D4",marginBottom:8}}>Today's affirmation</div>
          <div style={{fontSize:13,color:"#4A4660",lineHeight:1.5,fontStyle:"italic"}}>"{AFF[dayKey()%AFF.length].text}"</div>
          <div style={{fontSize:11,color:"#8E89A3",marginTop:6}}>— {AFF[dayKey()%AFF.length].source}</div>
        </div>
        <div style={{fontSize:13,color:"#9DB89A",fontWeight:600,marginBottom:16}}>🌅 Come back tomorrow for a fresh quest!</div>
        <button onClick={()=>setShowScore(false)} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:F}}>Done</button>
      </div>
    </div>}

    <div style={{position:"relative",width:"100%",maxWidth:420,margin:"0 auto",height:mh}}>
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",overflow:"visible"}} viewBox={`0 0 380 ${mh}`} preserveAspectRatio="xMidYMid meet">
        {tr.map((t,i)=><g key={i} transform={`translate(${t.x*3.8},${t.y}) scale(${t.s})`} opacity=".25"><rect x="-3" y="15" width="6" height="14" rx="2" fill="#8B7355"/><ellipse cx="0" cy="8" rx="14" ry="16" fill="#7DA87A"/><ellipse cx="-5" cy="12" rx="10" ry="12" fill="#6B966A"/></g>)}
        <path d={pD} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="28" strokeLinecap="round"/>
        <path d={pD} fill="none" stroke="#E0D5C4" strokeWidth="22" strokeLinecap="round"/>
        <path d={pD} fill="none" stroke="#D4C9B5" strokeWidth="18" strokeLinecap="round" strokeDasharray="4 6" opacity=".5"/>
        {pr.d>0&&(()=>{const e=Math.min(pr.d,pts.length-1);let d=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<=e;i++){const p=pts[i-1],c=pts[i],cy=(p.y+c.y)/2;d+=` C ${p.x} ${cy}, ${c.x} ${cy}, ${c.x} ${c.y}`;}return <path d={d} fill="none" stroke="#9DB89A" strokeWidth="6" strokeLinecap="round" opacity=".7"/>;})()}
      </svg>

      {GM.map((gm,i)=>{const ic=gs[gm.id]?.status==="complete",ia=i===ai,il=!ia&&!ic,pos=pts[i],sz=ia?64:52;return <div key={gm.id} onClick={()=>tapNode(gm,i)} style={{position:"absolute",left:`${(pos.x/380)*100}%`,top:pos.y,transform:"translate(-50%,-50%)",zIndex:ia?5:3,cursor:"pointer"}}>
        {ia&&<div style={{position:"absolute",top:"50%",left:"50%",width:sz+24,height:sz+24,transform:"translate(-50%,-50%)",borderRadius:"50%",border:`2px solid ${gm.c}`,pointerEvents:"none",animation:"pulse 2s ease-in-out infinite"}}/>}
        <div style={{width:sz,height:sz,borderRadius:"50%",background:ic?"#1F1D2B":ia?gm.c:"#E0D5C4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:ia?28:24,boxShadow:ia?`0 4px 20px ${gm.c}44,0 2px 8px rgba(0,0,0,.1)`:ic?"0 4px 16px rgba(31,29,43,.2)":"0 2px 8px rgba(0,0,0,.08)",border:ic?"3px solid #4A4660":"3px solid "+(ia?"white":"rgba(255,255,255,.6)"),opacity:il?.5:1,transition:"all .3s"}}>
          {ic?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>:<span style={{pointerEvents:"none"}}>{gm.icon}</span>}
        </div>
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",textAlign:"center",width:130,pointerEvents:"none"}}>
          <div style={{fontSize:12,fontWeight:700,color:il?"#B0A898":"#1F1D2B",textShadow:"0 1px 3px rgba(255,255,255,.8)",lineHeight:1.2}}>{gm.name}</div>
          {ia&&<div style={{fontSize:10,color:"#8E89A3",marginTop:2,textShadow:"0 1px 3px rgba(255,255,255,.8)"}}>{gm.tl}</div>}
          {ic&&<div style={{fontSize:10,color:"#8E89A3",marginTop:2,textShadow:"0 1px 3px rgba(255,255,255,.8)"}}>tap to replay</div>}
          {il&&<div style={{fontSize:10,color:"#B0A898",marginTop:2,textShadow:"0 1px 3px rgba(255,255,255,.8)"}}>🔒 locked</div>}
        </div>
      </div>;})}

      <div style={{position:"absolute",left:`${(pts[0].x/380)*100}%`,top:pts[0].y-50,transform:"translateX(-50%)",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#9DB89A",textAlign:"center",textShadow:"0 1px 3px rgba(255,255,255,.8)",pointerEvents:"none"}}>▼ Start</div>

      {/* Castle / quest complete */}
      <div style={{position:"absolute",left:`${(pts[pts.length-1].x/380)*100}%`,top:pts[pts.length-1].y+90,transform:"translateX(-50%)",textAlign:"center"}}>
        <div style={{fontSize:28,filter:pr.d===pr.t?"none":"grayscale(.8) opacity(.4)",pointerEvents:"none"}}>{pr.d===pr.t?"✨":"🏰"}</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:pr.d===pr.t?"#BDA36B":"#C2BDCF",marginTop:2,pointerEvents:"none"}}>{pr.d===pr.t?"Quest Complete!":"Finish"}</div>
        {pr.d===pr.t&&<button onClick={()=>setShowScore(true)} style={{marginTop:12,padding:"10px 24px",borderRadius:12,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>View Results ✦</button>}
      </div>
    </div>
    <div style={{height:20}}/>
    <style>{CSS}</style>
  </div>;
}

// ══════ APP ══════
// ══════ WELCOME SCREEN ══════
function Welcome({onSubmit}){
  const[name,setName]=useState("");
  const[focused,setFocused]=useState(false);
  const[forceTime,setForceTime]=useState(null);
  const[taps,setTaps]=useState(0);
  const wq=useMemo(()=>BQ[Math.floor(Math.random()*BQ.length)],[]);
  const modes=["morning","noon","evening","night"];
  const tapLogo=()=>{const n=taps+1;setTaps(n);if(n>=3){const cur=forceTime===null?0:modes.indexOf(forceTime)+1;setForceTime(modes[cur%4]);setTaps(0);}};
  const realH=new Date().getHours();
  const mode=forceTime||(realH>=5&&realH<11?"morning":realH>=11&&realH<17?"noon":realH>=17&&realH<21?"evening":"night");
  const themes={morning:{
    bg:"linear-gradient(180deg,#FFF8EE 0%,#FFE8C8 30%,#FFF5EB 60%,#FDFBF7 100%)",
    accent:"#E8A87C",greet:"Good morning",
    emojis:["☀️","🌤️","📖","🪶","🌿"],
    divColor:"#E8A87C",inputBorder:"#F0C27F",inputShadow:"rgba(240,194,127,.15)"
  },noon:{
    bg:"linear-gradient(180deg,#F0F7FF 0%,#E1EDFA 30%,#EEF0F8 60%,#FDFBF7 100%)",
    accent:"#7EB8DA",greet:"Good afternoon",
    emojis:["🌤️","📚","✦","🪶","🌊"],
    divColor:"#7EB8DA",inputBorder:"#A8D0E6",inputShadow:"rgba(126,184,218,.15)"
  },evening:{
    bg:"linear-gradient(180deg,#F5E6D8 0%,#EACDB5 30%,#F0DED0 60%,#F5F0EB 100%)",
    accent:"#D4929B",greet:"Good evening",
    emojis:["🌇","📖","🕯️","🪶","🌙"],
    divColor:"#D4929B",inputBorder:"#E8B4B8",inputShadow:"rgba(212,146,155,.15)"
  },night:{
    bg:"linear-gradient(180deg,#E0D8EE 0%,#CFC5E2 30%,#DDD5EB 60%,#EDEAF2 100%)",
    accent:"#8E89A3",greet:"Good evening",
    emojis:["🌙","✨","📖","🪶","🌟"],
    divColor:"#8E89A3",inputBorder:"#B8B0CC",inputShadow:"rgba(142,137,163,.15)"
  }};
  const theme=themes[mode];
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,background:theme.bg,fontFamily:F,position:"relative",overflow:"hidden"}}>

    {/* Floating decorative emojis */}
    <div style={{position:"absolute",top:"12%",left:"8%",fontSize:28,opacity:.12,transform:"rotate(-15deg)"}}>{theme.emojis[0]}</div>
    <div style={{position:"absolute",top:"18%",right:"10%",fontSize:22,opacity:.1,transform:"rotate(10deg)"}}>{theme.emojis[1]}</div>
    <div style={{position:"absolute",bottom:"20%",left:"12%",fontSize:24,opacity:.1,transform:"rotate(-8deg)"}}>{theme.emojis[2]}</div>
    <div style={{position:"absolute",bottom:"15%",right:"8%",fontSize:20,opacity:.12,transform:"rotate(12deg)"}}>{theme.emojis[3]}</div>
    <div style={{position:"absolute",top:"35%",right:"5%",fontSize:18,opacity:.08,transform:"rotate(-20deg)"}}>{theme.emojis[4]}</div>

    {/* Logo — tap 3x to cycle time themes for testing */}
    <div onClick={tapLogo} style={{width:64,height:64,background:"#1F1D2B",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 8px 32px rgba(31,29,43,.15)",cursor:"pointer"}}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 18 Q9 6, 12 14 Q15 22, 19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>
    </div>
    {forceTime&&<div style={{fontSize:10,color:theme.accent,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:8,marginTop:-16}}>preview: {forceTime}</div>}

    <div style={{fontFamily:F,fontSize:36,fontWeight:700,color:"#1F1D2B",marginBottom:6,letterSpacing:-.5}}>Inkworm</div>
    <div style={{fontSize:13,color:"#8E89A3",fontStyle:"italic",marginBottom:10,letterSpacing:.5}}>a daily dose of literary magic for the wordly wise</div>
    <div style={{fontSize:14,color:theme.accent,fontWeight:600,marginBottom:28}}>{theme.greet} — ready to play?</div>

    {/* Decorative divider */}
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
      <div style={{width:40,height:1,background:`linear-gradient(to right,transparent,${theme.divColor})`}}/>
      <div style={{fontSize:10,color:theme.divColor,letterSpacing:2}}>✦</div>
      <div style={{width:40,height:1,background:`linear-gradient(to left,transparent,${theme.divColor})`}}/>
    </div>

    <div style={{fontSize:15,color:"#4A4660",marginBottom:14,fontWeight:500}}>What shall we call you?</div>
    <div style={{position:"relative",width:"100%",maxWidth:280}}>
      <input type="text" value={name} onChange={e=>setName(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&onSubmit(name.trim())} placeholder="Your name..." autoFocus style={{width:"100%",padding:"16px 20px",borderRadius:16,border:focused?`2px solid ${theme.inputBorder}`:"2px solid #E8E0F5",background:"white",fontSize:20,fontFamily:F,fontWeight:600,color:"#1F1D2B",outline:"none",textAlign:"center",boxShadow:focused?`0 4px 20px ${theme.inputShadow}`:"0 2px 12px rgba(0,0,0,.04)",transition:"all .25s"}}/>
    </div>
    <button onClick={()=>name.trim()&&onSubmit(name.trim())} style={{marginTop:20,padding:"14px 56px",borderRadius:16,border:"none",background:name.trim()?"#1F1D2B":"#E8E0F5",color:name.trim()?"white":"#C2BDCF",fontWeight:700,fontSize:15,cursor:name.trim()?"pointer":"default",fontFamily:F,transition:"all .25s",boxShadow:name.trim()?"0 4px 20px rgba(31,29,43,.2)":"none",letterSpacing:.3}}>Begin your quest →</button>

    <div style={{marginTop:40,fontSize:12,color:theme.accent+"99",fontStyle:"italic",textAlign:"center",maxWidth:260,lineHeight:1.5}}>"{wq.text}"<div style={{marginTop:4,fontSize:11,fontStyle:"normal"}}>— {wq.author}</div></div>
  </div>;
}

export default function App(){
  const[name,sName]=useState(null);
  const[gs,sGs]=useState({});const[ag,sAg]=useState(null);
  const[showHow,setShowHow]=useState(null);
  const play=id=>{setShowHow(id);};
  const startGame=()=>{sAg(showHow);setShowHow(null);};
  const done=(id,score)=>{sGs(p=>({...p,[id]:{status:"complete",score:score||0}}));sAg(null);};
  const back=()=>{sAg(null);};
  if(!name)return <Welcome onSubmit={n=>sName(n)}/>;
  if(showHow)return <HowTo game={showHow} onStart={startGame}/>;
  if(ag==="scramble")return <G1 onDone={s=>done("scramble",s)} onBack={back}/>;
  if(ag==="quotes")return <G2 onDone={s=>done("quotes",s)} onBack={back}/>;
  if(ag==="kindred")return <G4 onDone={s=>done("kindred",s)} onBack={back}/>;
  if(ag==="wanderlust")return <G5 onDone={s=>done("wanderlust",s)} onBack={back}/>;
  return <Map name={name} onPlay={play} gs={gs}/>;
}
