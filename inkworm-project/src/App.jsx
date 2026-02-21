import { useState, useMemo } from "react";

// ══════ DATA ══════
const GENRES=[{name:"Classic Literature",description:"Dickens, Austen, Shakespeare & more",emoji:"📚"},{name:"Mystery & Thriller",description:"Christie, Doyle, Poe & suspense",emoji:"🔍"},{name:"Poetry & Verse",description:"Sonnets, odes, and epic poems",emoji:"🪶"},{name:"Romance & Drama",description:"Brontës, Hardy, Tolstoy & passion",emoji:"💔"},{name:"Indian Epics",description:"Ramayana, Mahabharata, Kalidasa & Indian authors",emoji:"🪷"}];
const BQ=[{text:"A reader lives a thousand lives before he dies.",author:"George R.R. Martin"},{text:"Not all those who wander are lost.",author:"J.R.R. Tolkien"},{text:"One must always be careful of books, for words have the power of changing us.",author:"Cassandra Clare"},{text:"Think before you speak. Read before you think.",author:"Fran Lebowitz"},{text:"Reading is dreaming with open eyes.",author:"Anissa Trisdianty"},{text:"Words are our most inexhaustible source of magic.",author:"J.K. Rowling"},{text:"There is no friend as loyal as a book.",author:"Ernest Hemingway"},{text:"Until I feared I would lose it, I never loved to read.",author:"Harper Lee"},{text:"Books are a uniquely portable magic.",author:"Stephen King"},{text:"I have always imagined that paradise will be a kind of library.",author:"Jorge Luis Borges"},{text:"The world was hers for the reading.",author:"Betty Smith"},{text:"Sleep is good, he said, and books are better.",author:"George R.R. Martin"},{text:"In the case of good books, the point is not to see how many you can get through, but how many can get through to you.",author:"Mortimer Adler"},{text:"That is part of the beauty of all literature. You discover that your longings are universal longings.",author:"F. Scott Fitzgerald"}];
const GM=[{id:"scramble",name:"Scramble du Jour",icon:"🔀",tl:"Unjumble the literary name",c:"#BDA36B"},{id:"quotes",name:"Quote Match",icon:"💬",tl:"Match quotes to their origins",c:"#B8A9D4"},{id:"firstlines",name:"First Lines",icon:"📖",tl:"Name the book from its opening",c:"#9DB89A"},{id:"kindred",name:"Kindred",icon:"🔗",tl:"Find 4 groups of 4",c:"#D4929B"},{id:"wanderlust",name:"Wanderlust",icon:"🌍",tl:"Find the literary landmark",c:"#6BA8A0"}];

const SC={b:{"Classic Literature":[{a:"HAMLET",h:"The prince of Denmark who saw his father's ghost",t:"character"},{a:"SCROOGE",h:"A miser visited by three Christmas ghosts",t:"character"},{a:"JANE AUSTEN",h:"She turned drawing rooms into battlefields of wit",t:"author"},{a:"NARNIA",h:"A wardrobe opened the way to this magical land",t:"work"},{a:"OLIVER TWIST",h:"This Dickens orphan dared to ask for more",t:"work"}],"Mystery & Thriller":[{a:"POIROT",h:"This Belgian's little grey cells never fail",t:"character"},{a:"AGATHA CHRISTIE",h:"The queen of mystery who vanished for 11 days",t:"author"},{a:"THE HOUND",h:"A spectral beast haunted the Baskerville moors",t:"work"},{a:"WATSON",h:"He was Holmes's loyal friend and biographer",t:"character"},{a:"MISS MARPLE",h:"An elderly lady from St. Mary Mead who solved murders",t:"character"}],"Poetry & Verse":[{a:"THE RAVEN",h:"A midnight visitor who would only say one word",t:"work"},{a:"ROBERT FROST",h:"Two roads diverged, and he took the less traveled one",t:"author"},{a:"DAFFODILS",h:"Wordsworth wandered lonely as a cloud to find them",t:"work"},{a:"HAIKU",h:"A three-line poem from Japan: 5-7-5",t:"work"},{a:"SONNET",h:"Shakespeare wrote 154 of these fourteen-line poems",t:"work"}],"Romance & Drama":[{a:"ROMEO",h:"A Montague who fell for a Capulet",t:"character"},{a:"JANE EYRE",h:"An orphan governess who said 'Reader, I married him'",t:"character"},{a:"HEATHCLIFF",h:"He roamed the Yorkshire moors, consumed by obsession",t:"character"},{a:"JULIET",h:"She asked 'What's in a name?' from her balcony",t:"character"},{a:"TESS",h:"Hardy's pure woman in an impure world",t:"character"}],"Indian Epics":[{a:"HANUMAN",h:"He leapt across the ocean and set a golden city ablaze",t:"character"},{a:"SITA",h:"Abducted to Lanka, she waited in the Ashoka grove",t:"character"},{a:"ARJUNA",h:"The greatest archer, he received the Gita on the battlefield",t:"character"},{a:"DRAUPADI",h:"Born from fire, she married five brothers",t:"character"},{a:"RAVANA",h:"A ten-headed king of Lanka who stole another's wife",t:"character"}]},a:{"Classic Literature":[{a:"SHAKESPEARE",h:"He wrote of star-crossed lovers and Danish princes",t:"author"},{a:"GREAT EXPECTATIONS",h:"A blacksmith's boy, a convict, and a decaying wedding cake",t:"work"},{a:"DOSTOEVSKY",h:"His underground man questioned all of rational society",t:"author"},{a:"MIDDLEMARCH",h:"George Eliot's study of provincial life and idealism",t:"work"},{a:"GULLIVER",h:"He traveled to Lilliput, Brobdingnag, and beyond",t:"character"}],"Mystery & Thriller":[{a:"SHERLOCK HOLMES",h:"When you eliminate the impossible, whatever remains...",t:"character"},{a:"EDGAR ALLAN POE",h:"He heard a heart beating beneath the floorboards",t:"author"},{a:"MORIARTY",h:"The Napoleon of crime, Holmes's greatest nemesis",t:"character"},{a:"WILKIE COLLINS",h:"He wrote the first English detective novel, The Moonstone",t:"author"},{a:"DASHIELL HAMMETT",h:"He created Sam Spade and the Continental Op",t:"author"}],"Poetry & Verse":[{a:"WILLIAM WORDSWORTH",h:"He wandered lonely as a cloud over the Lake District",t:"author"},{a:"EMILY DICKINSON",h:"She wrote 1,800 poems but published fewer than a dozen",t:"author"},{a:"PARADISE LOST",h:"Milton's epic of angels falling from heaven",t:"work"},{a:"OZYMANDIAS",h:"Look on my works, ye mighty, and despair",t:"work"},{a:"WALT WHITMAN",h:"He sang the body electric and heard America singing",t:"author"}],"Romance & Drama":[{a:"ANNA KARENINA",h:"All happy families are alike, but hers was not",t:"character"},{a:"CHARLOTTE BRONTE",h:"Reader, her heroine married Mr. Rochester",t:"author"},{a:"WAR AND PEACE",h:"Napoleon invades, and five families' fates intertwine",t:"work"},{a:"MADAME BOVARY",h:"Flaubert's restless wife dreamed beyond her province",t:"character"},{a:"LADY CHATTERLEY",h:"Lawrence's scandalous tale of passion across class lines",t:"character"}],"Indian Epics":[{a:"ARUNDHATI ROY",h:"Her debut novel won the Booker and broke every rule of storytelling",t:"author"},{a:"SHAKUNTALA",h:"A king forgot his love due to a sage's curse — Kalidasa's masterpiece",t:"work"},{a:"SALMAN RUSHDIE",h:"His Midnight's Children were born at the stroke of India's independence",t:"author"},{a:"MEGHADUTA",h:"Kalidasa's exiled yaksha sent a message via a cloud",t:"work"},{a:"PREMCHAND",h:"The emperor of Hindustani fiction who wrote Godaan",t:"author"}]}};

const QM={b:{"Classic Literature":[{q:"Call me Ishmael.",s:"Moby-Dick"},{q:"All animals are equal, but some are more equal than others.",s:"Animal Farm"},{q:"To be, or not to be, that is the question.",s:"Hamlet"},{q:"It was a dark and stormy night.",s:"Paul Clifford"}],"Mystery & Thriller":[{q:"The world is full of obvious things which nobody observes.",s:"Sherlock Holmes"},{q:"Once you eliminate the impossible, whatever remains must be the truth.",s:"Conan Doyle"},{q:"Curiouser and curiouser!",s:"Alice in Wonderland"},{q:"We all go a little mad sometimes.",s:"Psycho"}],"Poetry & Verse":[{q:"I wandered lonely as a cloud that floats on high.",s:"Wordsworth — Daffodils"},{q:"Shall I compare thee to a summer's day?",s:"Shakespeare — Sonnet 18"},{q:"Two roads diverged in a wood, and I took the one less traveled by.",s:"Robert Frost"},{q:"Hope is the thing with feathers that perches in the soul.",s:"Emily Dickinson"}],"Romance & Drama":[{q:"Whatever our souls are made of, his and mine are the same.",s:"Wuthering Heights"},{q:"Reader, I married him.",s:"Jane Eyre"},{q:"You pierce my soul. I am half agony, half hope.",s:"Persuasion"},{q:"Who could ever learn to love a beast?",s:"Beauty and the Beast"}],"Indian Epics":[{q:"You have the right to work, but never to the fruit of work.",s:"Bhagavad Gita"},{q:"Dharma protects those who protect dharma.",s:"Mahabharata"},{q:"An enemy's strength is only in his confidence.",s:"Ramayana"},{q:"The lotus blooms in muddy water.",s:"Indian proverb"}]},a:{"Classic Literature":[{q:"It was the best of times, it was the worst of times.",s:"A Tale of Two Cities"},{q:"It is a far, far better thing that I do, than I have ever done.",s:"Sydney Carton"},{q:"All is well that ends well, still the fine's the crown.",s:"Shakespeare"},{q:"Man is born free, and everywhere he is in chains.",s:"Rousseau"}],"Mystery & Thriller":[{q:"An alibi is only as good as the person who gives it.",s:"Agatha Christie"},{q:"Deep into that darkness peering, long I stood there wondering, fearing.",s:"Edgar Allan Poe"},{q:"The truth is rarely pure and never simple.",s:"Oscar Wilde"},{q:"There is nothing more deceptive than an obvious fact.",s:"Sherlock Holmes"}],"Poetry & Verse":[{q:"Because I could not stop for Death, He kindly stopped for me.",s:"Emily Dickinson"},{q:"Do I dare disturb the universe?",s:"T.S. Eliot — Prufrock"},{q:"Look on my Works, ye Mighty, and despair!",s:"Shelley — Ozymandias"},{q:"I celebrate myself, and sing myself.",s:"Whitman — Song of Myself"}],"Romance & Drama":[{q:"All happy families are alike; each unhappy family is unhappy in its own way.",s:"Anna Karenina"},{q:"He is more myself than I am.",s:"Catherine Earnshaw"},{q:"I am no bird; and no net ensnares me.",s:"Jane Eyre"},{q:"One does not love a place the less for having suffered in it.",s:"Persuasion"}],"Indian Epics":[{q:"To love. To be loved. To never forget your own insignificance.",s:"Arundhati Roy"},{q:"Who what am I? My answer: I am the sum total of everything that went before me.",s:"Salman Rushdie"},{q:"Where the mind is without fear and the head is held high.",s:"Rabindranath Tagore"},{q:"The flower offered to God has no caste.",s:"Basavanna"}]}};

const FL={b:{"Classic Literature":[{f:["It is a truth","universally acknowledged,","that a single man","in possession of a good fortune,","must be in want of a wife."],a:"Pride and Prejudice",au:"Jane Austen",o:["Pride and Prejudice","Emma","Sense and Sensibility","Northanger Abbey"]},{f:["It was a bright","cold day in April,","and the clocks","were striking","thirteen."],a:"1984",au:"George Orwell",o:["1984","Animal Farm","Brave New World","Fahrenheit 451"]},{f:["Alice was beginning","to get very tired","of sitting by her sister","on the bank,","and of having nothing to do."],a:"Alice in Wonderland",au:"Lewis Carroll",o:["Alice in Wonderland","Peter Pan","The Wizard of Oz","Charlie and the Chocolate Factory"]}],"Mystery & Thriller":[{f:["Last night","I dreamt","I went to","Manderley","again."],a:"Rebecca",au:"Daphne du Maurier",o:["Rebecca","Jane Eyre","Wuthering Heights","The Woman in White"]},{f:["Mr Sherlock Holmes,","who was usually","very late in the mornings,","was seated","at the breakfast table."],a:"Hound of the Baskervilles",au:"Conan Doyle",o:["Hound of the Baskervilles","A Study in Scarlet","The Sign of the Four","The Adventures of Sherlock Holmes"]},{f:["The truth is","rarely pure","and","never","simple."],a:"The Importance of Being Earnest",au:"Oscar Wilde",o:["The Importance of Being Earnest","Dorian Gray","An Ideal Husband","A Woman of No Importance"]}],"Poetry & Verse":[{f:["Once upon","a midnight dreary,","while I pondered,","weak","and weary."],a:"The Raven",au:"Poe",o:["The Raven","Annabel Lee","The Bells","Ulalume"]},{f:["I wandered lonely","as a cloud","that floats on high","o'er vales","and hills."],a:"Daffodils",au:"Wordsworth",o:["Daffodils","Tintern Abbey","The Prelude","Ode to Duty"]},{f:["Shall I compare thee","to a summer's day?","Thou art more lovely","and more","temperate."],a:"Sonnet 18",au:"Shakespeare",o:["Sonnet 18","Sonnet 130","Sonnet 116","Sonnet 29"]}],"Romance & Drama":[{f:["All happy families","are alike;","each unhappy family","is unhappy in","its own way."],a:"Anna Karenina",au:"Tolstoy",o:["Anna Karenina","War and Peace","Crime and Punishment","Brothers Karamazov"]},{f:["There was no possibility","of taking a walk","that day.","We had been wandering,","in the leafless shrubbery."],a:"Jane Eyre",au:"Charlotte Brontë",o:["Jane Eyre","Wuthering Heights","Middlemarch","Tess of the d'Urbervilles"]},{f:["It was","a bright,","cold day","in April.","The clocks were striking thirteen."],a:"1984",au:"George Orwell",o:["1984","Brave New World","We","Fahrenheit 451"]}],"Indian Epics":[{f:["There was a king","named Dasharatha,","who ruled Ayodhya,","a city as splendid","as the city of Indra."],a:"Ramayana",au:"Valmiki",o:["Ramayana","Mahabharata","Shakuntala","Bhagavad Gita"]},{f:["May in Ayemenem","is a hot,","brooding month.","The days are long","and humid."],a:"The God of Small Things",au:"Arundhati Roy",o:["The God of Small Things","Midnight's Children","A Suitable Boy","The White Tiger"]},{f:["Dhritarashtra said:","O Sanjaya,","assembled on the holy field","of Kurukshetra,","what did they do?"],a:"Bhagavad Gita",au:"Vyasa",o:["Bhagavad Gita","Mahabharata","Ramayana","Yoga Sutras"]}]},a:{"Classic Literature":[{f:["Whether I shall turn out","to be the hero","of my own life,","or whether that station","will be held by anybody else."],a:"David Copperfield",au:"Dickens",o:["David Copperfield","Great Expectations","Bleak House","Our Mutual Friend"]},{f:["Stately, plump","Buck Mulligan came","from the stairhead,","bearing a bowl of lather","on which a mirror and a razor lay crossed."],a:"Ulysses",au:"James Joyce",o:["Ulysses","A Portrait of the Artist","Dubliners","Finnegans Wake"]},{f:["It was the best","of times,","it was the worst","of times,","it was the age of wisdom."],a:"A Tale of Two Cities",au:"Dickens",o:["A Tale of Two Cities","Great Expectations","David Copperfield","Oliver Twist"]}],"Mystery & Thriller":[{f:["The studio was filled","with the rich odour","of roses, and when","the light summer wind","stirred amidst the trees."],a:"Dorian Gray",au:"Oscar Wilde",o:["Dorian Gray","The Great Gatsby","Brideshead Revisited","A Room with a View"]},{f:["True!—nervous—","very, very","dreadfully nervous","I had been","and am."],a:"The Tell-Tale Heart",au:"Poe",o:["The Tell-Tale Heart","The Black Cat","The Cask of Amontillado","The Fall of the House of Usher"]},{f:["In my younger","and more vulnerable years","my father gave me","some advice","that I've been turning over in my mind."],a:"The Great Gatsby",au:"F. Scott Fitzgerald",o:["The Great Gatsby","Tender Is the Night","This Side of Paradise","Dorian Gray"]}],"Poetry & Verse":[{f:["Let us go then,","you and I,","when the evening","is spread out","against the sky."],a:"The Love Song of J. Alfred Prufrock",au:"T.S. Eliot",o:["The Love Song of J. Alfred Prufrock","The Waste Land","Four Quartets","Ash Wednesday"]},{f:["I met a traveller","from an antique land,","who said—","two vast and trunkless legs","of stone stand in the desert."],a:"Ozymandias",au:"Shelley",o:["Ozymandias","Ode to the West Wind","Mont Blanc","To a Skylark"]},{f:["Turning and turning","in the widening gyre","the falcon cannot hear","the falconer;","things fall apart."],a:"The Second Coming",au:"W.B. Yeats",o:["The Second Coming","Sailing to Byzantium","Easter 1916","The Lake Isle of Innisfree"]}],"Romance & Drama":[{f:["I have just returned","from a visit","to my landlord—","the solitary neighbour","that I shall be troubled with."],a:"Wuthering Heights",au:"Emily Brontë",o:["Wuthering Heights","Jane Eyre","Northanger Abbey","Tenant of Wildfell Hall"]},{f:["Happy families","are all alike;","every unhappy family","is unhappy","in its own way."],a:"Anna Karenina",au:"Tolstoy",o:["Anna Karenina","War and Peace","Resurrection","The Death of Ivan Ilyich"]},{f:["She had been","forced into prudence","in her youth,","she learned romance","as she grew older."],a:"Persuasion",au:"Jane Austen",o:["Persuasion","Sense and Sensibility","Mansfield Park","Pride and Prejudice"]}],"Indian Epics":[{f:["I grew up","in Ayemenem,","in the state of Kerala,","in the old house","on the banks of the Meenachal."],a:"The God of Small Things",au:"Arundhati Roy",o:["The God of Small Things","The Ministry of Utmost Happiness","A Suitable Boy","Nectar in a Sieve"]},{f:["I was born","in the city of Bombay,","once upon a time.","No, that won't do,","there's no getting away from the date."],a:"Midnight's Children",au:"Salman Rushdie",o:["Midnight's Children","Shame","The Satanic Verses","The Moor's Last Sigh"]},{f:["In the great forest","of Naimisha,","the sages had gathered","for a sacrifice","that would last twelve years."],a:"Mahabharata",au:"Vyasa",o:["Mahabharata","Ramayana","Bhagavad Gita","Shakuntala"]}]}};

const KD={b:{"Classic Literature":{g:[{l:"Dickens Characters",w:["PIP","SCROOGE","FAGIN","ESTELLA"],c:"#BDA36B"},{l:"Shakespeare Plays",w:["HAMLET","OTHELLO","MACBETH","TEMPEST"],c:"#B8A9D4"},{l:"Fictional Places",w:["NARNIA","MORDOR","HOGWARTS","LILLIPUT"],c:"#9DB89A"},{l:"Austen Heroines",w:["EMMA","ELINOR","ELIZABETH","FANNY"],c:"#D4929B"}]},"Mystery & Thriller":{g:[{l:"Fictional Detectives",w:["POIROT","MARPLE","MORSE","WATSON"],c:"#BDA36B"},{l:"Poe Works",w:["RAVEN","USHER","ANNABEL","MORGUE"],c:"#B8A9D4"},{l:"Weapons",w:["ROPE","WRENCH","KNIFE","POISON"],c:"#9DB89A"},{l:"Christie Novels",w:["ORIENT","NILE","MIRROR","CURTAIN"],c:"#D4929B"}]},"Poetry & Verse":{g:[{l:"Romantic Poets",w:["KEATS","SHELLEY","BYRON","BLAKE"],c:"#BDA36B"},{l:"Poetic Forms",w:["SONNET","HAIKU","LIMERICK","BALLAD"],c:"#B8A9D4"},{l:"Famous Poems",w:["DAFFODILS","RAVEN","KUBLA","JABBERWOCKY"],c:"#9DB89A"},{l:"Poetry Terms",w:["STANZA","METER","RHYME","COUPLET"],c:"#D4929B"}]},"Romance & Drama":{g:[{l:"Shakespearean Lovers",w:["ROMEO","JULIET","OTHELLO","PORTIA"],c:"#BDA36B"},{l:"Brontë Characters",w:["HEATHCLIFF","JANE","ROCHESTER","CATHY"],c:"#B8A9D4"},{l:"Love Settings",w:["VERONA","THORNFIELD","MOORS","MOSCOW"],c:"#9DB89A"},{l:"Tragic Heroines",w:["TESS","ANNA","OPHELIA","DESDEMONA"],c:"#D4929B"}]},"Indian Epics":{g:[{l:"Pandava Brothers",w:["YUDHISTHIR","BHIMA","ARJUNA","NAKULA"],c:"#BDA36B"},{l:"Ramayana Characters",w:["SITA","HANUMAN","RAVANA","LAKSHMAN"],c:"#B8A9D4"},{l:"Indian Authors",w:["TAGORE","RUSHDIE","PREMCHAND","ROY"],c:"#9DB89A"},{l:"Divine Weapons",w:["SUDARSHAN","GANDIVA","TRISHUL","VAJRA"],c:"#D4929B"}]}},a:{"Classic Literature":{g:[{l:"Stream of Consciousness",w:["JOYCE","WOOLF","FAULKNER","PROUST"],c:"#BDA36B"},{l:"Dystopian Novels",w:["ORWELL","HUXLEY","ATWOOD","BRADBURY"],c:"#B8A9D4"},{l:"Russian Masters",w:["TOLSTOY","DOSTOEVSKY","CHEKHOV","GOGOL"],c:"#9DB89A"},{l:"Dickens Novels",w:["TWIST","BLEAK","MUTUAL","COPPERFIELD"],c:"#D4929B"}]},"Mystery & Thriller":{g:[{l:"Locked Room Authors",w:["CARR","DOYLE","LEROUX","CHRISTIE"],c:"#BDA36B"},{l:"Noir Detectives",w:["MARLOWE","SPADE","ARCHER","CONTINENTAL"],c:"#B8A9D4"},{l:"Gothic Settings",w:["CASTLE","MANOR","ABBEY","CRYPT"],c:"#9DB89A"},{l:"Conan Doyle Works",w:["HOUND","SCARLET","SIGN","BOHEMIA"],c:"#D4929B"}]},"Poetry & Verse":{g:[{l:"Modernist Poets",w:["ELIOT","POUND","STEVENS","MOORE"],c:"#BDA36B"},{l:"Epic Poems",w:["ILIAD","ODYSSEY","AENEID","BEOWULF"],c:"#B8A9D4"},{l:"Poetic Devices",w:["ENJAMBMENT","CAESURA","ANAPHORA","VOLTA"],c:"#9DB89A"},{l:"Yeats Poems",w:["BYZANTIUM","GYRE","INNISFREE","EASTER"],c:"#D4929B"}]},"Romance & Drama":{g:[{l:"Tolstoy Works",w:["KARENINA","PEACE","RESURRECTION","IVAN"],c:"#BDA36B"},{l:"Hardy Heroines",w:["TESS","BATHSHEBA","EUSTACIA","SUE"],c:"#B8A9D4"},{l:"Austen Novels",w:["PRIDE","SENSE","PERSUASION","MANSFIELD"],c:"#9DB89A"},{l:"Gothic Romances",w:["THORNFIELD","MANDERLEY","UDOLPHO","OTRANTO"],c:"#D4929B"}]},"Indian Epics":{g:[{l:"Kalidasa Works",w:["SHAKUNTALA","MEGHADUTA","VIKRAM","KUMARA"],c:"#BDA36B"},{l:"Booker Winners",w:["ROY","ADIGA","RUSHDIE","DESAI"],c:"#B8A9D4"},{l:"Mahabharata Weapons",w:["GANDIVA","SUDARSHAN","PASHUPATA","BRAHMASTRA"],c:"#9DB89A"},{l:"Sanskrit Texts",w:["RAMAYANA","GITA","UPANISHAD","ARTHASHASTRA"],c:"#D4929B"}]}}};

const WL={b:{"Classic Literature":{answer:"London, England",lat:51.5074,lng:-0.1278,hints:["Fog-choked streets home to orphans, misers, and ghosts of Christmas.","Dickens walked 20 miles through it nightly for inspiration.","Oliver Twist, Scrooge, and Pip all lived here.","The Thames runs through it — as do literature's greatest tales."]},"Mystery & Thriller":{answer:"Baker Street, London",lat:51.5238,lng:-0.1585,hints:["A famous address where a detective and his doctor shared rooms.","The resident kept tobacco in a Persian slipper.","Visitors came in distress; they left with hope — after the violin.","221B — the most famous address in detective fiction."]},"Poetry & Verse":{answer:"The Lake District",lat:54.4609,lng:-3.0886,hints:["A poet wandered here lonely as a cloud and found golden flowers.","This region inspired an entire movement of English poetry.","Wordsworth, Coleridge, and Southey all called it home.","Daffodils beside the lake, fluttering and dancing in the breeze."]},"Romance & Drama":{answer:"Yorkshire Moors",lat:53.9591,lng:-1.0815,hints:["A brooding estate where love turned to obsession.","Two families entwined by passion and revenge across generations.","Heathcliff roamed these windswept lands calling for Catherine's ghost.","Emily Brontë set her only novel on these wild expanses."]},"Indian Epics":{answer:"Ayodhya, India",lat:26.7955,lng:82.1944,hints:["An exiled prince left this city for fourteen years in the forest.","His father died of grief the day he departed its gates.","A golden deer, a stolen queen, and a monkey army — all roads led back here.","Rama returned to this city and was crowned king after vanquishing Ravana."]}},a:{"Classic Literature":{answer:"Stratford-upon-Avon",lat:52.1917,lng:-1.7083,hints:["A playwright was born and buried in this town on the River Avon.","His wife Anne Hathaway lived in a cottage nearby.","The Royal Shakespeare Company still performs here today.","He left his wife his 'second best bed' in his will."]},"Mystery & Thriller":{answer:"Edinburgh, Scotland",lat:55.9533,lng:-3.1883,hints:["A doctor here created the world's most logical detective.","Body snatchers Burke and Hare inspired its dark literary tradition.","Jekyll and Hyde were born from this city's famous divided geography.","Arthur Conan Doyle studied medicine at its university."]},"Poetry & Verse":{answer:"Dublin, Ireland",lat:53.3498,lng:-6.2603,hints:["On June 16th each year, fans retrace a fictional route through this city.","Its pubs appear in the greatest novel of the 20th century.","Yeats, Wilde, and Shaw all called it their first home.","Bloomsday celebrates Leopold Bloom's odyssey through its streets."]},"Romance & Drama":{answer:"Moscow, Russia",lat:55.7558,lng:37.6173,hints:["A countess threw herself before a train near this city's station.","Tolstoy set his greatest novels against the backdrop of its aristocracy.","Pierre Bezukhov watched Napoleon's army approach its ancient walls.","War and Peace, Anna Karenina — both orbit this imperial capital."]},"Indian Epics":{answer:"Varanasi, India",lat:25.3176,lng:83.0068,hints:["Tulsidas composed the Ramcharitmanas on the banks of its sacred river.","It is one of the oldest continuously inhabited cities in the world.","Kabir, the mystic poet-weaver, was born and lived here.","Mark Twain wrote: this city is 'older than history, older than tradition'."]}}};
const REGS=[{n:"London",la:51.51,lo:-0.13,lb:"🇬🇧"},{n:"Paris",la:48.86,lo:2.35,lb:"🇫🇷"},{n:"Rome",la:41.90,lo:12.50,lb:"🇮🇹"},{n:"Athens",la:37.98,lo:23.73,lb:"🇬🇷"},{n:"Cairo",la:30.04,lo:31.24,lb:"🇪🇬"},{n:"Moscow",la:55.76,lo:37.62,lb:"🇷🇺"},{n:"Delhi",la:28.61,lo:77.21,lb:"🇮🇳"},{n:"Kurukshetra",la:29.97,lo:76.88,lb:"⚔️"},{n:"Varanasi",la:25.32,lo:83.01,lb:"🕉️"},{n:"Ayodhya",la:26.7955,lo:82.1944,lb:"🏛️"},{n:"Kerala",la:10.85,lo:76.27,lb:"🌴"},{n:"Kolkata",la:22.57,lo:88.36,lb:"📖"},{n:"Beijing",la:39.90,lo:116.40,lb:"🇨🇳"},{n:"Tokyo",la:35.68,lo:139.69,lb:"🇯🇵"},{n:"New York",la:40.71,lo:-74.01,lb:"🇺🇸"},{n:"Edinburgh",la:55.95,lo:-3.19,lb:"🏴"},{n:"Dublin",la:53.35,lo:-6.26,lb:"🇮🇪"},{n:"Stratford",la:52.19,lo:-1.71,lb:"🎭"},{n:"Lake District",la:54.46,lo:-3.09,lb:"🏔️"},{n:"Yorkshire",la:53.96,lo:-1.08,lb:"🌿"},{n:"Baker Street",la:51.52,lo:-0.16,lb:"🔍"},{n:"Istanbul",la:41.01,lo:28.98,lb:"🇹🇷"}];

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
const scram=w=>{const c=w.split("");for(let i=c.length-1;i>0;i--){const j=0|Math.random()*(i+1);if(c[i]===" "||c[j]===" ")continue;[c[i],c[j]]=[c[j],c[i]];}if(c.join("")===w)for(let i=0;i<c.length-1;i++){if(c[i]!==" "&&c[i+1]!==" "){[c[i],c[i+1]]=[c[i+1],c[i]];break;}}return c.join("");};
const hav=(a,b,c,d)=>{const R=6371,dL=(c-a)*Math.PI/180,dN=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));};
const dLbl=km=>km<50?{t:"🔥 Scorching!",c:"#D4929B"}:km<200?{t:"🌡️ Very warm!",c:"#BDA36B"}:km<500?{t:"☀️ Warmer",c:"#B8A9D4"}:km<1500?{t:"❄️ Cold",c:"#8E89A3"}:{t:"🥶 Freezing",c:"#C2BDCF"};
const D=(g,m,d)=>{const tier=d==="advanced"?m.a:m.b;return tier[g]||tier["Classic Literature"];};
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
function G1({genre,diff,onDone,onBack}){
  const pzBase=useMemo(()=>D(genre,SC,diff),[genre]);
  const[i,sI]=useState(0);const[inp,sInp]=useState("");const[rev,sRev]=useState(false);
  const[res,sRes]=useState([]);const[hint,sH]=useState(false);const[shk,sSh]=useState(false);
  const[curScram,setCurScram]=useState(()=>scram(pzBase[0].a));
  const p=pzBase[i];const done=i>=pzBase.length;
  const cc={author:"#B8A9D4",work:"#9DB89A",character:"#BDA36B"};
  const doShuffle=()=>{setCurScram(scram(p.a));};
  const adv=()=>{
    if(i===pzBase.length-1)sI(pzBase.length);
    else{const ni=i+1;sI(ni);sInp("");sRev(false);sH(false);setCurScram(scram(pzBase[ni].a));}
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

      {hint&&<div style={{fontSize:13,color:"#8E89A3",fontStyle:"italic",marginBottom:16,textAlign:"center",padding:"8px 16px",background:"#F6F3FB",borderRadius:10}}>💡 {p.h}</div>}
      {rev&&<div style={{fontSize:18,fontWeight:700,color:"#9DB89A",fontFamily:S,marginBottom:16}}>{p.a}</div>}

      {!rev&&<div style={{width:"100%",maxWidth:320}}>
        <input type="text" value={inp} onChange={e=>sInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()} placeholder="Type your answer..." autoFocus style={{width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid #E8E0F5",background:"white",fontSize:16,fontFamily:F,color:"#1F1D2B",outline:"none"}}/>
        <button onClick={sub} style={{width:"100%",marginTop:14,padding:14,borderRadius:14,border:"none",background:inp.trim()?"#1F1D2B":"#E8E0F5",color:inp.trim()?"white":"#C2BDCF",fontWeight:700,fontSize:15,cursor:inp.trim()?"pointer":"default",fontFamily:F}}>Check</button>
        <div style={{display:"flex",gap:10,marginTop:10,justifyContent:"center"}}>
          {!hint&&<button onClick={()=>sH(true)} style={{background:"none",border:"none",fontSize:13,color:"#B8A9D4",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>💡 Hint</button>}
          <button onClick={reveal} style={{background:"none",border:"none",fontSize:13,color:"#D4929B",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>👁 Reveal answer</button>
          <button onClick={()=>{sRes(r=>[...r,false]);adv();}} style={{background:"none",border:"none",fontSize:13,color:"#C2BDCF",cursor:"pointer",padding:"6px 12px",fontFamily:F}}>Skip →</button>
        </div>
        <div style={{fontSize:10,color:"#C2BDCF",marginTop:6,textAlign:"center",lineHeight:1.4}}>Reveal shows the answer · Skip moves on</div>
      </div>}
    </div>
    <style>{CSS}</style>
  </div>;
}

// ══════ GAME 2: QUOTE MATCH ══════
function G2({genre,diff,onDone,onBack}){
  const pairs=D(genre,QM,diff);const ss=useMemo(()=>shuf(pairs.map((p,i)=>({t:p.s,i}))),[genre]);
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

// ══════ GAME 3: FIRST LINES ══════
function G3({genre,diff,onDone,onBack}){
  const pz=D(genre,FL,diff);const[puzzleIdx,setPIdx]=useState(0);const[rv,sRv]=useState(1);const[ans,sAns]=useState(false);const[ok,sOk]=useState(false);const[res,sRes]=useState([]);
  const p=pz[puzzleIdx],done=puzzleIdx>=pz.length;const opts=useMemo(()=>shuf(p?p.o:[]),[puzzleIdx]);
  const guess=g=>{if(ans)return;const c=g===p.a;sAns(true);sOk(c);sRes(r=>[...r,c]);};
  const next=()=>{if(puzzleIdx+1>=pz.length)setPIdx(pz.length);else{setPIdx(x=>x+1);sRv(1);sAns(false);}};
  if(done){const c=res.filter(Boolean).length;return <Done icon="📖" title={c===pz.length?"Literary genius!":c>=2?"Well read!":"Keep reading!"} sub={`${c} of ${pz.length} recognized`} onGo={()=>onDone(c)}><Dots res={res}/></Done>;}
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}><Hdr t="First Lines" onBack={onBack} confirmBack r={`${puzzleIdx+1}/${pz.length}`}/><PBar n={pz.length} idx={puzzleIdx} res={res}/><div style={{flex:1,padding:"0 20px"}}><div style={{textAlign:"center",fontSize:13,color:"#8E89A3",marginBottom:20}}>Name the work from its opening lines</div><div style={{background:"white",borderRadius:16,padding:20,border:"1.5px solid rgba(0,0,0,.05)",boxShadow:"0 2px 12px rgba(0,0,0,.04)",marginBottom:20,minHeight:120}}><div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#9DB89A",marginBottom:12}}>📖 Opening lines</div>{p.f.map((f,j)=><span key={j} style={{fontFamily:S,fontSize:18,lineHeight:1.6,color:j<rv?"#1F1D2B":"transparent",background:j<rv?"none":"#F0EDE8",borderRadius:4,transition:"all .5s",display:"inline"}}>{j<rv?f:f.replace(/./g,"█")}{" "}</span>)}<div style={{display:"flex",gap:4,marginTop:16,justifyContent:"center"}}>{p.f.map((_,j)=><div key={j} style={{width:8,height:8,borderRadius:"50%",background:j<rv?"#9DB89A":"#E8E0F5",transition:"background .3s"}}/>)}</div></div>{!ans&&rv<p.f.length&&<button onClick={()=>sRv(r=>r+1)} style={{display:"block",margin:"0 auto 20px",padding:"10px 24px",borderRadius:20,border:"1.5px solid #C8D9C5",background:"#F5FAF4",color:"#6B966A",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:F}}>Reveal more ({rv}/{p.f.length})</button>}{!ans?<div style={{display:"flex",flexDirection:"column",gap:8}}>{opts.map(o=><button key={o} onClick={()=>guess(o)} style={{padding:"14px 18px",borderRadius:12,border:"1.5px solid rgba(0,0,0,.06)",background:"white",textAlign:"left",fontSize:15,fontWeight:600,color:"#1F1D2B",cursor:"pointer",fontFamily:F}}>{o}</button>)}</div>:<div style={{textAlign:"center",animation:"fadeUp .3s ease-out"}}><div style={{width:48,height:48,borderRadius:"50%",margin:"0 auto 12px",background:ok?"#1F1D2B":"transparent",border:ok?"2px solid #1F1D2B":"2px solid #C2BDCF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:ok?"white":"#C2BDCF"}}>{ok?"✓":"—"}</div><div style={{fontFamily:S,fontSize:20,color:"#1F1D2B",marginBottom:4}}>{p.a}</div><div style={{fontSize:13,color:"#8E89A3",marginBottom:20}}>by {p.au}</div><button onClick={next} style={{padding:"12px 32px",borderRadius:12,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:F}}>{puzzleIdx+1>=pz.length?"See Results":"Next →"}</button></div>}</div><style>{CSS}</style></div>;
}

// ══════ GAME 4: KINDRED ══════
function G4({genre,diff,onDone,onBack}){
  const data=D(genre,KD,diff);const allW=useMemo(()=>shuf(data.g.flatMap((g,gi)=>g.w.map(w=>({w,gi})))),[genre]);
  const[sel,sSel]=useState(new Set());const[sol,sSol]=useState([]);const[mk,sMk]=useState(0);const[wf,sWf]=useState(false);const[nearMsg,setNear]=useState(null);
  const mx=4,over=mk>=mx,won=sol.length===4,dn=over||won;const rem=allW.filter(x=>!sol.includes(x.gi));
  const tap=w=>{if(dn)return;sWf(false);setNear(null);sSel(p=>{const n=new Set(p);n.has(w)?n.delete(w):n.size<4&&n.add(w);return n;});};
  const sub=()=>{if(sel.size!==4||dn)return;const ws=[...sel],gis=ws.map(w=>allW.find(a=>a.w===w)?.gi);if(gis.every(g=>g===gis[0])){sSol(p=>[...p,gis[0]]);sSel(new Set());setNear(null);}else{
    const counts={};gis.forEach(g=>{counts[g]=(counts[g]||0)+1;});const best=Math.max(...Object.values(counts));
    if(best===3)setNear("So close! 3 of 4 are from the same group.");else setNear(null);
    sMk(m=>m+1);sWf(true);setTimeout(()=>{sWf(false);sSel(new Set());},800);}
  };
  if(dn)return <Done icon="🔗" title={won?(mk===0?"Perfect bonds!":"Kindred found!"):"Better luck next time!"} sub={`${sol.length} of 4 groups found`} onGo={()=>onDone(sol.length)}><div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:340}}>{data.g.map((g,i)=><div key={i} style={{padding:"10px 14px",borderRadius:12,background:sol.includes(i)?g.c+"22":"#F5F0E8",border:`1.5px solid ${sol.includes(i)?g.c:"#E0D5C4"}`}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:g.c,marginBottom:4}}>{g.l}</div><div style={{fontSize:13,color:"#4A4660"}}>{g.w.join(" · ")}</div></div>)}</div></Done>;
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"#FDFBF7",fontFamily:F}}><Hdr t="Kindred" onBack={onBack} confirmBack r={`${sol.length}/4`}/><div style={{textAlign:"center",fontSize:13,color:"#8E89A3",marginBottom:16}}>Find 4 groups of 4 related words</div><div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>{Array.from({length:mx}).map((_,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:i<mk?"#D4929B":"#E8E0F5"}}/>)}<span style={{fontSize:11,color:"#8E89A3",marginLeft:4}}>{mx-mk} left</span></div>{nearMsg&&<div style={{textAlign:"center",fontSize:13,color:"#BDA36B",fontWeight:600,marginBottom:12,animation:"fadeUp .3s ease-out"}}>✨ {nearMsg}</div>}{sol.length>0&&<div style={{padding:"0 16px",marginBottom:12}}>{sol.map(gi=>{const g=data.g[gi];return <div key={gi} style={{padding:"10px 14px",borderRadius:12,marginBottom:8,background:g.c+"18",border:`1.5px solid ${g.c}44`,animation:"fadeUp .3s ease-out"}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:g.c,marginBottom:2}}>{g.l}</div><div style={{fontSize:13,color:"#4A4660"}}>{g.w.join(" · ")}</div></div>;})}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"0 16px",marginBottom:20,animation:wf?"shake .4s ease":"none"}}>{rem.map(({w})=>{const s=sel.has(w);return <div key={w} onClick={()=>tap(w)} style={{padding:"10px 4px",borderRadius:10,textAlign:"center",fontSize:w.length>8?10:12,fontWeight:700,color:s?"white":"#1F1D2B",background:s?"#1F1D2B":"white",border:s?"1.5px solid #1F1D2B":"1.5px solid rgba(0,0,0,.06)",cursor:"pointer",userSelect:"none",transition:"all .15s",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1.2}}>{w}</div>;})}</div><div style={{display:"flex",gap:10,padding:"0 16px",marginBottom:24}}><button onClick={()=>sSel(new Set())} style={{flex:1,padding:12,borderRadius:12,border:"1.5px solid rgba(0,0,0,.08)",background:"white",fontWeight:600,fontSize:14,color:"#8E89A3",cursor:"pointer",fontFamily:F}}>Deselect</button><button onClick={sub} style={{flex:2,padding:12,borderRadius:12,border:"none",background:sel.size===4?"#1F1D2B":"#E8E0F5",fontWeight:700,fontSize:14,color:sel.size===4?"white":"#C2BDCF",cursor:sel.size===4?"pointer":"default",fontFamily:F}}>Submit ({sel.size}/4)</button></div><style>{CSS}</style></div>;
}

// ══════ GAME 5: WANDERLUST ══════
function G5({genre,diff,onDone,onBack}){
  const data=D(genre,WL,diff);const[hi,sHi]=useState(0);const[gs,sGs]=useState([]);const[ok,sOk]=useState(false);const[gaveUp,setGaveUp]=useState(false);
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
function Home({name,diff,onDiff,onGo}){
  const q=useMemo(()=>BQ[Math.floor(Date.now()/86400000)%BQ.length],[]);
  const ac=["#B8A9D4","#9DB89A","#D4929B","#BDA36B","#6BA8A0"];
  const tt=useMemo(()=>timeTheme(),[]);
  return <div style={{padding:"0 20px",minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:F,background:tt.bg,position:"relative",overflow:"hidden"}}>
    {/* Subtle floating accents */}
    <div style={{position:"absolute",top:"6%",right:"6%",fontSize:40,opacity:.06,transform:"rotate(12deg)",pointerEvents:"none"}}>{tt.emoji}</div>
    <div style={{position:"absolute",bottom:"12%",left:"4%",fontSize:32,opacity:.05,transform:"rotate(-10deg)",pointerEvents:"none"}}>🪶</div>
    <div style={{position:"absolute",top:"40%",left:"2%",fontSize:24,opacity:.04,pointerEvents:"none"}}>✦</div>
    <div style={{position:"absolute",bottom:"30%",right:"3%",fontSize:28,opacity:.04,transform:"rotate(8deg)",pointerEvents:"none"}}>📚</div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:48,marginBottom:28}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:32,height:32,background:"#1F1D2B",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 18 Q9 6, 12 14 Q15 22, 19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg></div><span style={{fontFamily:F,fontSize:20,fontWeight:700,color:"#1F1D2B",letterSpacing:-.3}}>Inkworm</span></div><div style={{fontSize:11,color:"#8E89A3",fontStyle:"italic",letterSpacing:.3,marginTop:2}}>a daily dose of literary magic for the wordly wise</div></div>
    </div>

    {/* Greeting */}
    <div style={{textAlign:"center",marginBottom:16}}>
      <div style={{fontSize:28,fontWeight:700,color:"#1F1D2B",fontFamily:F,lineHeight:1.3}}>{tt.greet}, <span style={{background:"linear-gradient(135deg,#B8A9D4,#D4929B)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{name}</span></div>
      <div style={{fontSize:14,color:"#8E89A3",marginTop:6}}>Pick a genre to start today's quest.</div>
    </div>

    {/* Difficulty toggle */}
    <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
      <div style={{display:"flex",background:"white",borderRadius:24,padding:3,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
        {[{k:"beginner",l:"Bookworm"},{k:"advanced",l:"Bibliophile"}].map(d=>
          <button key={d.k} onClick={()=>onDiff(d.k)} style={{padding:"8px 20px",borderRadius:22,border:"none",fontSize:12,fontWeight:700,letterSpacing:.3,cursor:"pointer",fontFamily:F,transition:"all .2s",background:diff===d.k?"#1F1D2B":"transparent",color:diff===d.k?"white":"#8E89A3"}}>{d.l}</button>
        )}
      </div>
    </div>

    {/* Quote of the day — clean, centered, modern */}
    <div style={{textAlign:"center",marginBottom:24,padding:"0 8px"}}>
      <div style={{fontSize:13,color:"#8E89A3",lineHeight:1.6,fontStyle:"italic"}}>"{q.text}"</div>
      <div style={{fontSize:11,color:"#C2BDCF",marginTop:6,fontWeight:500}}>— {q.author}</div>
    </div>

    {/* Genre grid — modern cards */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      {GENRES.map((g,i)=><div key={g.name} onClick={()=>onGo(g.name)} style={{padding:"20px 14px",borderRadius:16,cursor:"pointer",background:"white",border:"1px solid rgba(0,0,0,.04)",userSelect:"none",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,.03)"}}>
        <div style={{fontSize:28,marginBottom:8}}>{g.emoji}</div>
        <div style={{fontWeight:700,fontSize:13,color:"#1F1D2B",marginBottom:3}}>{g.name}</div>
        <div style={{fontSize:11,color:"#8E89A3",lineHeight:1.3}}>{g.description}</div>
      </div>)}
      <div onClick={()=>onGo("Surprise Me!")} style={{padding:"20px 14px",borderRadius:16,cursor:"pointer",background:"linear-gradient(135deg,#F6F3FB,#F5F0E8)",border:"1px dashed #C2BDCF",userSelect:"none",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:8}}>✦</div>
        <div style={{fontWeight:700,fontSize:13,color:"#1F1D2B",marginBottom:3}}>Surprise Me!</div>
        <div style={{fontSize:11,color:"#8E89A3",lineHeight:1.3}}>A random literary medley</div>
      </div>
    </div>

    <div style={{marginTop:"auto",padding:"20px 0 32px",textAlign:"center"}}><div style={{fontSize:11,color:"#C2BDCF",letterSpacing:.5}}>made with <span style={{color:"#D4929B"}}>♡</span> for {name}</div></div>
  </div>;
}

// ══════ MAP ══════
function Map({genre,onBack,onPlay,gs}){
  const pr=useMemo(()=>({d:GM.filter(g=>gs[g.id]?.status==="complete").length,t:GM.length}),[gs]);
  const ai=GM.findIndex(g=>gs[g.id]?.status!=="complete");
  const[toast,setToast]=useState(null);
  const[showScore,setShowScore]=useState(false);
  const nd=[{x:25,y:0},{x:72,y:1},{x:30,y:2},{x:68,y:3},{x:48,y:4}],sp=140,mh=nd.length*sp+180;
  const pts=nd.map((n,i)=>({x:(n.x/100)*340+20,y:i*sp+60}));
  let pD=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const p=pts[i-1],c=pts[i],cy=(p.y+c.y)/2;pD+=` C ${p.x} ${cy}, ${c.x} ${cy}, ${c.x} ${c.y}`;}
  const tr=[{x:85,y:30,s:1},{x:10,y:110,s:.7},{x:90,y:200,s:.9},{x:5,y:320,s:.6},{x:92,y:400,s:.8},{x:15,y:480,s:.7},{x:88,y:540,s:.5},{x:8,y:620,s:.9}];
  const tapNode=(gm,i)=>{
    const ic=gs[gm.id]?.status==="complete",ia=i===ai,il=!ia&&!ic;
    if(il){const prev=GM[i-1];setToast(`Complete ${prev?.name||"previous game"} first`);setTimeout(()=>setToast(null),2000);return;}
    onPlay(gm.id);
  };
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#E8F0E4 0%,#F5F0E8 30%,#FDFBF7 60%)",fontFamily:F}}>
    {pr.d===pr.t&&<Confetti/>}
    <div style={{display:"flex",alignItems:"center",padding:"48px 20px 12px",position:"sticky",top:0,zIndex:10,background:"linear-gradient(180deg,#E8F0E4 0%,#E8F0E4 60%,transparent 100%)"}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,.8)",border:"none",color:"#4A4660",padding:8,borderRadius:12,display:"flex",alignItems:"center",cursor:"pointer",backdropFilter:"blur(8px)",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button>
      <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:1.8,textTransform:"uppercase",color:"#8E89A3"}}>Today's Quest</div><div style={{fontFamily:S,fontSize:18,color:"#1F1D2B",marginTop:1}}>{genre}</div></div>
      <div style={{fontSize:11,fontWeight:700,color:"#9DB89A",background:"rgba(255,255,255,.8)",padding:"6px 12px",borderRadius:20,backdropFilter:"blur(8px)",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>{pr.d}/{pr.t}</div>
    </div>

    {toast&&<div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1F1D2B",color:"white",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,zIndex:20,animation:"fadeUp .2s ease-out",boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>{toast}</div>}

    {/* Scorecard modal */}
    {showScore&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowScore(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#FDFBF7",borderRadius:20,padding:"28px 24px",maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 12px 48px rgba(0,0,0,.2)",animation:"fadeUp .3s ease-out"}}>
        <div style={{fontSize:36,marginBottom:8}}>✨</div>
        <div style={{fontFamily:S,fontSize:22,color:"#1F1D2B",marginBottom:4}}>Quest Complete!</div>
        <div style={{fontSize:13,color:"#8E89A3",marginBottom:20}}>Here's how you did today</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {GM.map(gm=>{const s=gs[gm.id]?.score||0;return <div key={gm.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"white",borderRadius:10,border:"1px solid rgba(0,0,0,.04)"}}>
            <span style={{fontSize:18}}>{gm.icon}</span>
            <span style={{flex:1,textAlign:"left",fontSize:13,fontWeight:600,color:"#1F1D2B"}}>{gm.name}</span>
            <span style={{fontSize:12,letterSpacing:1}}>{Array.from({length:5}).map((_,i)=><span key={i} style={{color:i<s?"#BDA36B":"#E8E0F5"}}>●</span>)}</span>
          </div>;})}
        </div>
        <button onClick={onBack} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:F}}>Play Another Genre →</button>
        <button onClick={()=>setShowScore(false)} style={{marginTop:8,background:"none",border:"none",fontSize:13,color:"#8E89A3",cursor:"pointer",fontFamily:F,padding:8}}>Back to map</button>
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
      <div style={{position:"absolute",left:`${(pts[pts.length-1].x/380)*100}%`,top:pts[pts.length-1].y+80,transform:"translateX(-50%)",textAlign:"center"}}>
        <div style={{fontSize:28,filter:pr.d===pr.t?"none":"grayscale(.8) opacity(.4)",pointerEvents:"none"}}>{pr.d===pr.t?"✨":"🏰"}</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:pr.d===pr.t?"#BDA36B":"#C2BDCF",marginTop:2,pointerEvents:"none"}}>{pr.d===pr.t?"Quest Complete!":"Finish"}</div>
        {pr.d===pr.t&&<button onClick={()=>setShowScore(true)} style={{marginTop:12,padding:"10px 24px",borderRadius:12,border:"none",background:"#1F1D2B",color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>View Results ✦</button>}
      </div>
    </div>
    <div style={{height:60}}/>
    <style>{CSS}</style>
  </div>;
}

// ══════ APP ══════
// ══════ WELCOME SCREEN ══════
function Welcome({onSubmit}){
  const[name,setName]=useState("");
  const[focused,setFocused]=useState(false);
  const wq=useMemo(()=>BQ[Math.floor(Math.random()*BQ.length)],[]);
  return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,background:"linear-gradient(180deg,#F6F3FB 0%,#FDFBF7 40%,#F5F0E8 100%)",fontFamily:F,position:"relative",overflow:"hidden"}}>

    {/* Floating decorative book emojis */}
    <div style={{position:"absolute",top:"12%",left:"8%",fontSize:28,opacity:.12,transform:"rotate(-15deg)"}}>📖</div>
    <div style={{position:"absolute",top:"18%",right:"10%",fontSize:22,opacity:.1,transform:"rotate(10deg)"}}>🪶</div>
    <div style={{position:"absolute",bottom:"20%",left:"12%",fontSize:24,opacity:.1,transform:"rotate(-8deg)"}}>📚</div>
    <div style={{position:"absolute",bottom:"15%",right:"8%",fontSize:20,opacity:.12,transform:"rotate(12deg)"}}>🌿</div>
    <div style={{position:"absolute",top:"35%",right:"5%",fontSize:18,opacity:.08,transform:"rotate(-20deg)"}}>✦</div>

    {/* Logo */}
    <div style={{width:64,height:64,background:"#1F1D2B",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 8px 32px rgba(31,29,43,.15)"}}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 18 Q9 6, 12 14 Q15 22, 19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>
    </div>

    <div style={{fontFamily:F,fontSize:36,fontWeight:700,color:"#1F1D2B",marginBottom:6,letterSpacing:-.5}}>Inkworm</div>
    <div style={{fontSize:13,color:"#8E89A3",fontStyle:"italic",marginBottom:32,letterSpacing:.5}}>a daily dose of literary magic for the wordly wise</div>

    {/* Decorative divider */}
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
      <div style={{width:40,height:1,background:"linear-gradient(to right,transparent,#C2BDCF)"}}/>
      <div style={{fontSize:10,color:"#C2BDCF",letterSpacing:2}}>✦</div>
      <div style={{width:40,height:1,background:"linear-gradient(to left,transparent,#C2BDCF)"}}/>
    </div>

    <div style={{fontSize:15,color:"#4A4660",marginBottom:14,fontWeight:500}}>What shall we call you?</div>
    <div style={{position:"relative",width:"100%",maxWidth:280}}>
      <input type="text" value={name} onChange={e=>setName(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&onSubmit(name.trim())} placeholder="Your name..." autoFocus style={{width:"100%",padding:"16px 20px",borderRadius:16,border:focused?"2px solid #B8A9D4":"2px solid #E8E0F5",background:"white",fontSize:20,fontFamily:F,fontWeight:600,color:"#1F1D2B",outline:"none",textAlign:"center",boxShadow:focused?"0 4px 20px rgba(184,169,212,.15)":"0 2px 12px rgba(0,0,0,.04)",transition:"all .25s"}}/>
    </div>
    <button onClick={()=>name.trim()&&onSubmit(name.trim())} style={{marginTop:20,padding:"14px 56px",borderRadius:16,border:"none",background:name.trim()?"#1F1D2B":"#E8E0F5",color:name.trim()?"white":"#C2BDCF",fontWeight:700,fontSize:15,cursor:name.trim()?"pointer":"default",fontFamily:F,transition:"all .25s",boxShadow:name.trim()?"0 4px 20px rgba(31,29,43,.2)":"none",letterSpacing:.3}}>Begin your quest →</button>

    <div style={{marginTop:40,fontSize:12,color:"#C2BDCF",fontStyle:"italic",textAlign:"center",maxWidth:260,lineHeight:1.5}}>"{wq.text}"<div style={{marginTop:4,fontSize:11,fontStyle:"normal"}}>— {wq.author}</div></div>
  </div>;
}

export default function App(){
  const[name,sName]=useState(null);
  const[diff,sDiff]=useState("beginner");
  const[scr,sScr]=useState("home");const[genre,sGenre]=useState(null);const[gs,sGs]=useState({});const[ag,sAg]=useState(null);
  const[resolvedGenre,setResolved]=useState(null);
  const play=id=>{sAg(id);sScr("game");};
  const done=(id,score)=>{sGs(p=>({...p,[id]:{status:"complete",score:score||0}}));sAg(null);sScr("quest");};
  const back=()=>{sAg(null);sScr("quest");};
  const pickGenre=sel=>{
    const resolved=sel==="Surprise Me!"?GENRES[Math.floor(Math.random()*GENRES.length)].name:sel;
    sGenre(sel);setResolved(resolved);sScr("quest");
  };
  if(!name)return <Welcome onSubmit={n=>sName(n)}/>;
  if(scr==="game"&&ag==="scramble")return <G1 genre={resolvedGenre} diff={diff} onDone={s=>done("scramble",s)} onBack={back}/>;
  if(scr==="game"&&ag==="quotes")return <G2 genre={resolvedGenre} diff={diff} onDone={s=>done("quotes",s)} onBack={back}/>;
  if(scr==="game"&&ag==="firstlines")return <G3 genre={resolvedGenre} diff={diff} onDone={s=>done("firstlines",s)} onBack={back}/>;
  if(scr==="game"&&ag==="kindred")return <G4 genre={resolvedGenre} diff={diff} onDone={s=>done("kindred",s)} onBack={back}/>;
  if(scr==="game"&&ag==="wanderlust")return <G5 genre={resolvedGenre} diff={diff} onDone={s=>done("wanderlust",s)} onBack={back}/>;
  if(scr==="quest"&&genre)return <Map genre={genre==="Surprise Me!"?"Surprise Me! ("+resolvedGenre+")":genre} onBack={()=>{sScr("home");sGenre(null);sGs({});setResolved(null);}} onPlay={play} gs={gs}/>;
  return <Home name={name} diff={diff} onDiff={sDiff} onGo={pickGenre}/>;
}
