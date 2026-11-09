/* ==========================================================================
   Kaizen Health & Wellness — Natural Concierge Chatbot (chatbot.js)
   Keyword-based FAQ concierge.
   Works with chatbot.css. Edit the KNOWLEDGE_BASE array to change answers.
   Information is educational only; the medical team makes care decisions.
   ========================================================================== */
(function () {
  'use strict';
  if (document.getElementById('kaizen-faq-launcher')) return;

  /* ---------------- Verified business details (from the website) ---------------- */
  var PHONE_DISPLAY = '+92 326 8666884';
  var PHONE_TEL = '+923268666884';
  var WA_NUMBER = '923268666884';
  var EMAIL = 'info@kaizenhealthandwellness.com';

  /* ---------------- Reusable action buttons ---------------- */
  function bookAction(service) { return { type: 'modal', label: '📅 Book Consultation', service: service || '' }; }
  function waAction(text) {
    return { type: 'whatsapp', label: '💬 WhatsApp Care Team',
      text: text || 'Hello Kaizen Health and Wellness, I would like to ask about a consultation.' };
  }
  var CALL = { type: 'tel', label: '📞 Call Clinic' };
  var LOCATIONS = { type: 'scroll', label: '📍 Clinic Locations', target: '#locations' };
  var SERVICES = { type: 'scroll', label: '✦ View Services', target: '#services' };

  var DEFAULT_CHIPS = ['Weight Loss', 'Hair & Wrinkle', 'Insulin Resistance', 'Blood tests', 'Pricing'];
  var intakeFields = [
    { label: 'Age', question: 'What is your age?' },
    { label: 'Height', question: 'What is your height?' },
    { label: 'Current weight', question: 'What is your current weight?' },
    { label: 'Target weight', question: 'What is your target weight?' },
    { label: 'Major illness in the last 3 years', question: 'Have you had a major illness in the last 3 years? You can answer yes, no, or skip.' },
    { label: 'Major surgery in the last 3 years', question: 'Have you had a major surgery in the last 3 years? You can answer yes, no, or skip.' }
  ];
  var intakeAnswers = [];
  var intakeCity = '';
  var intakeIndex = -1;

  /* ---------------- Program and care information ---------------- */
  var KNOWLEDGE_BASE = [
    {
      id: 'greeting', words: ['hi', 'hello', 'hey', 'salam', 'assalamualaikum'],
      phrases: ['good morning', 'good afternoon', 'good evening'],
      reply: {
        text: ['Hello 👋', 'Welcome to **Kaizen Health & Wellness**.', 'I\'m your AI assistant. I can help you with:'],
        list: ['Weight Loss', 'Hair & Wrinkle Programs', 'Insulin Resistance', 'Longevity & Optimization'],
        text2: ['How can I help you today?', '**What city are you based in?**']
      },
      chips: DEFAULT_CHIPS
    },
    {
      id: 'programs', words: ['program', 'programs', 'service', 'services', 'offer'],
      phrases: ['what do you do', 'what programs', 'what can you help'],
      reply: {
        text: ['Kaizen offers these programs:'],
        list: ['Weight Loss', 'Hair & Wrinkle', 'Insulin Resistance', 'Longevity & Optimization'],
        text2: ['Program suitability is assessed by the medical team. Which program would you like to learn about?'],
        actions: [SERVICES, bookAction()]
      },
      chips: DEFAULT_CHIPS
    },
    {
      id: 'city', words: ['lahore', 'islamabad', 'karachi', 'city'],
      phrases: ['based in', 'i live in', 'i am from', "i'm from"],
      reply: {
        text: ['Thanks for sharing. To help the medical team understand your goals, please share your age, height, current weight, and target weight.', 'Please also let us know if you have had a major illness or major surgery in the last three years. Share only what you are comfortable discussing. This FAQ chat does not submit your answers to the clinic.'],
        actions: [waAction('Hello Kaizen, I would like to discuss a program. Please let me know how to securely share my details.'), CALL]
      },
      chips: ['What details do you need?', 'Blood tests', 'Our locations']
    },
    {
      id: 'weight', words: ['weight', 'loss', 'slim', 'obesity', 'fat', 'metabolic'],
      phrases: ['weight loss', 'lose weight', 'current weight', 'target weight'],
      reply: {
        text: ['**Weight Loss** is one of Kaizen\'s programs. The care plan and any treatment are determined by the medical team after reviewing your health and goals.', 'Would you like the assessment details or the blood test list?'],
        actions: [bookAction('Weight Loss'), waAction('Hello Kaizen, I would like to ask about the Weight Loss program.')]
      },
      chips: ['What details do you need?', 'Blood tests', 'Pricing']
    },
    {
      id: 'hair', words: ['hair', 'wrinkle', 'wrinkles', 'skin', 'aesthetic'],
      phrases: ['hair and wrinkle', 'hair & wrinkle'],
      reply: {
        text: ['**Hair & Wrinkle** is one of Kaizen\'s programs. Please discuss your goals, suitability, and available options with the medical team.'],
        actions: [bookAction('Hair & Wrinkle'), waAction('Hello Kaizen, I would like to ask about the Hair & Wrinkle program.')]
      },
      chips: ['Our programs', 'What details do you need?', 'Contact details']
    },
    {
      id: 'insulin', words: ['insulin', 'resistance', 'glucose', 'sugar', 'diabetes'],
      phrases: ['insulin resistance', 'blood sugar'],
      reply: {
        text: ['**Insulin Resistance** is one of Kaizen\'s programs. The medical team reviews your health information and test results to advise on appropriate next steps.', 'I can\'t diagnose or recommend treatment in chat.'],
        actions: [bookAction('Insulin Resistance'), waAction('Hello Kaizen, I would like to ask about the Insulin Resistance program.')]
      },
      chips: ['Blood tests', 'What details do you need?', 'Pricing']
    },
    {
      id: 'longevity', words: ['longevity', 'optimization', 'optimisation', 'healthspan'],
      phrases: ['longevity and optimization', 'longevity & optimization', 'live longer'],
      reply: {
        text: ['**Longevity & Optimization** is one of Kaizen\'s programs, tailored with guidance from the medical team.'],
        actions: [bookAction('Longevity & Optimization'), waAction('Hello Kaizen, I would like to ask about Longevity & Optimization.')]
      },
      chips: ['Our programs', 'Blood tests', 'Pricing']
    },
    {
      id: 'details', words: ['age', 'height', 'weight', 'illness', 'surgery', 'medical', 'history', 'details', 'information'],
      phrases: ['what details do you need', 'what information do you need', 'major illness', 'major surgery', 'health history'],
      reply: {
        text: ['For an initial review, please have these details ready:'],
        list: ['Age', 'Height', 'Current weight', 'Target weight', 'Any major illness in the last 3 years?', 'Any major surgery in the last 3 years?'],
        text2: ['Please share clinical details directly with the care team rather than in this FAQ chat; it does not securely submit or store health information.']
      },
      chips: ['Blood tests', 'Our locations', 'Contact details']
    },
    {
      id: 'tests', words: ['blood', 'test', 'tests', 'report', 'reports', 'glucose', 'cortisol', 'lipid', 'liver', 'kidney', 'thyroid', 'cbc', 'fasting'],
      phrases: ['blood tests', 'blood test', 'lab results', 'test results', 'fasted state'],
      reply: {
        text: ['Please arrange these blood tests:'],
        list: ['Fasting Glucose', 'Cortisol', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Profile', 'CBC'],
        text2: ['Tests should be performed in a fasted state. Please upload digital reports only. If your tests were completed within the last six months, simply share those reports with the care team.', 'This chat cannot receive report uploads. Please contact the team to arrange a secure way to share them.']
      },
      chips: ['What details do you need?', 'Process', 'Contact details']
    },
    {
      id: 'peptides', words: ['ozempic', 'mounjaro', 'terzee', 'retatrutide', 'peptide', 'glp', 'gip', 'glucagon'],
      phrases: ['first generation', 'second generation', 'third generation', 'gastric emptying'],
      reply: {
        text: ['Here is general information only; this is not a recommendation or medical advice. Medication suitability and treatment decisions must be discussed with the medical team.'],
        list: ['Ozempic - first-generation GLP-1; suppresses appetite.', 'Mounjaro (tirzepatide; sometimes referred to as Terzee) - second-generation GLP + GIP receptor agonist; suppresses appetite, slows gastric emptying, and may help patients feel full longer.', 'Retatrutide - investigational third-generation GLP, GIP, and glucagon receptor agonist; described as supporting fat utilization, increasing energy expenditure, and helping burn stored fat.']
      },
      chips: ['Book a consultation', 'Our programs', 'Pricing']
    },
    {
      id: 'pricing', words: ['price', 'pricing', 'cost', 'costs', 'fee', 'fees', 'month', 'gst', 'dosage'],
      phrases: ['how much', 'month 1', 'month 2', 'month 3', 'month 4'],
      reply: {
        text: ['**Retatrutide pricing:**'],
        list: ['Month 1: 30,000 + GST', 'Month 2: 40,000 + GST', 'Month 3: 50,000 + GST', 'Month 4: 30,000 + GST'],
        text2: ['Pricing is subject to change. Dosages are adjusted monthly by the medical team. Please confirm current pricing before starting.']
      },
      chips: ['Process', 'Our programs', 'Contact details']
    },
    {
      id: 'consultation-fee', words: ['consultation', 'consult', 'fee', 'cost', 'price', 'pricing'],
      phrases: ['consultation cost', 'consultation fee', 'how much is consultation', 'cost of consultation'],
      reply: {
        text: ['The consultation fee is **2,500**.', 'If you purchase peptides from us, the consultation fee is deducted from the purchase price.'],
        actions: [bookAction(), waAction('Hello Kaizen, I would like to book a consultation.')]
      },
      chips: ['Retatrutide pricing', 'Book a consultation', 'Contact details']
    },
    {
      id: 'about', words: ['kaizen'],
      phrases: ['what is kaizen', 'who is kaizen', 'about kaizen'],
      reply: {
        text: ["We are a health and wellness company. We use people's blood tests and health markers to advise them on improving their lives."]
      },
      chips: DEFAULT_CHIPS
    },
    {
      id: 'process', words: ['process', 'steps', 'start', 'begin', 'consultation', 'consult', 'review', 'recommendation', 'ship', 'shipping'],
      phrases: ['how does it work', 'what happens next', 'three-way consultation', 'medical director'],
      reply: {
        text: ['The process is:'],
        list: ['1. Upload blood reports.', '2. Diagnostic review.', '3. Medical Director recommendation.', '4. Three-way consultation.', '5. First month\'s medication shipped.'],
        text2: ['Please contact the team to arrange report sharing. This chat does not accept uploads.']
      },
      chips: ['Blood tests', 'What details do you need?', 'Pricing']
    },
    {
      id: 'location', words: ['location', 'locations', 'address', 'lahore', 'islamabad', 'where', 'clinic', 'city'],
      phrases: ['where are you', 'clinic location', 'based in'],
      reply: {
        text: ['Kaizen lists locations in Lahore and Islamabad. Please contact the team to confirm appointment availability and visit details.'],
        list: ['Lahore - DHA 6, Official Partner @primal_strength_studio', 'Islamabad - Pakland Medical Center, F8 Markaz'],
        actions: [LOCATIONS, CALL]
      },
      chips: ['Weight Loss', 'Blood tests', 'Contact details']
    },
    {
      id: 'contact', words: ['phone', 'call', 'contact', 'number', 'whatsapp', 'email', 'reach', 'message'],
      phrases: ['get in touch', 'contact details'],
      reply: {
        text: ['You can reach the Kaizen team at **' + PHONE_DISPLAY + '** or **' + EMAIL + '**.'],
        actions: [waAction(), CALL]
      },
      chips: ['Our locations', 'Book a consultation', 'Pricing']
    },
    {
      id: 'safety', words: ['safe', 'safety', 'risk', 'risks', 'dose', 'dosing', 'side', 'effects', 'suitable'],
      phrases: ['side effects', 'is it safe', 'is it suitable'],
      reply: {
        text: ['I can\'t assess safety, dosing, or suitability in chat. Please discuss your health history and questions with a qualified medical professional.'],
        actions: [bookAction(), waAction('Hello Kaizen, I have a question about treatment safety and suitability.')]
      },
      chips: ['What details do you need?', 'Blood tests', 'Contact details']
    }
  ];

  var EMERGENCY = /(chest pain|can'?t breathe|cannot breathe|heart attack|stroke|overdose|suicid|severe bleeding|unconscious|emergency)/i;

  var FALLBACK = {
    text: ['I don\'t have a confirmed answer to that yet. The Kaizen team can help directly on **' + PHONE_DISPLAY + '** or ' + EMAIL + '.',
      'You can also ask me about services, booking, locations or contact details.'],
    actions: [waAction(), CALL],
    chips: DEFAULT_CHIPS
  };

  function intakePrompt() {
    return {
      text: [intakeFields[intakeIndex].question, 'You can skip any question. Your answers remain in this open chat and are not sent to Kaizen unless you choose the WhatsApp action at the end.'],
      chips: ['Skip this question', 'Cancel questions']
    };
  }

  function recordIntakeAnswer(raw) {
    if (/^(cancel|stop|cancel questions)$/i.test(raw)) {
      intakeAnswers = [];
      intakeCity = '';
      intakeIndex = -1;
      return { text: ['No problem. Your answers have not been sent anywhere. You can ask about programs, blood tests, pricing, or the process.'], chips: DEFAULT_CHIPS };
    }

    intakeAnswers.push(/^(skip|skip this question|prefer not to say)$/i.test(raw) ? 'Prefer not to share' : raw);
    intakeIndex++;
    if (intakeIndex < intakeFields.length) return intakePrompt();

    var lines = ['City: ' + intakeCity].concat(intakeFields.map(function (field, i) {
      return field.label + ': ' + intakeAnswers[i];
    }));
    var message = 'Hello Kaizen Health & Wellness, I would like to discuss a program.\\n' + lines.join('\\n');
    intakeAnswers = [];
    intakeIndex = -1;
    return {
      text: ['Thank you. I have noted your answers in this chat only; they have not been submitted to Kaizen.', 'You can review and choose whether to send these details to the care team using WhatsApp.'],
      list: lines,
      actions: [waAction(message)],
      chips: DEFAULT_CHIPS
    };
  }

  /* ---------------- Matching engine ---------------- */
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[m][n];
  }

  function wordScore(token, word) {
    if (token === word) return 2;
    if (word.length >= 5 && token.length > word.length && token.indexOf(word) === 0) return 1.6;
    if (word.length >= 5 && token.length >= 5) {
      var allowed = word.length >= 8 ? 2 : 1;
      if (Math.abs(token.length - word.length) <= allowed && lev(token, word) <= allowed) return 1.5;
    }
    return 0;
  }

  function matchIntent(raw) {
    var text = raw.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\s&-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (/\b(what is|who is|about) kaizen\b/.test(text)) {
      return KNOWLEDGE_BASE.filter(function (it) { return it.id === 'about'; })[0] || null;
    }
    if (/\b(consultation|consult)\b/.test(text) && /\b(cost|fee|price|pricing|how much)\b/.test(text)) {
      return KNOWLEDGE_BASE.filter(function (it) { return it.id === 'consultation-fee'; })[0] || null;
    }
    if (/\b(prices?|pricing|costs?|fees?|gst|dosage)\b/.test(text)) {
      return KNOWLEDGE_BASE.filter(function (it) { return it.id === 'pricing'; })[0] || null;
    }
    var tokens = text.split(' ');
    var best = null, bestScore = 0;
    KNOWLEDGE_BASE.forEach(function (it) {
      var score = 0;
      it.phrases.forEach(function (p) { if (text.indexOf(p) !== -1) score += 3; });
      it.words.forEach(function (w) {
        var top = 0;
        tokens.forEach(function (t) { var s = wordScore(t, w); if (s > top) top = s; });
        score += top;
      });
      if (score > bestScore) { bestScore = score; best = it; }
    });
    return bestScore >= 1.5 ? best : null;
  }

  function respond(raw) {
    if (EMERGENCY.test(raw)) {
      return {
        text: ['If this is a medical emergency, please contact your local emergency services or go to the nearest hospital **right now**. I am only an automated FAQ assistant and cannot help with emergencies.'],
        actions: [], chips: ['Contact details']
      };
    }
    var it = matchIntent(raw);
    if (intakeIndex >= 0) return recordIntakeAnswer(raw);
    if (it && it.id === 'city') {
      intakeCity = raw;
      intakeAnswers = [];
      intakeIndex = 0;
      return intakePrompt();
    }
    if (!it) return FALLBACK;
    var r = JSON.parse(JSON.stringify(it.reply));
    r.chips = it.chips || DEFAULT_CHIPS;
    return r;
  }

  /* ---------------- UI construction ---------------- */
  var AVATAR_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-9.3-8.9C1 8.7 3 5 6.6 5c2 0 3.5 1 5.4 3 1.9-2 3.4-3 5.4-3 3.6 0 5.6 3.7 3.9 7.1C19 16.6 12 21 12 21z"/></svg>';

  var container = document.createElement('div');
  container.id = 'kaizen-faq-launcher-container';
  container.innerHTML =
    '<div class="kaizen-faq-teaser" role="group" aria-label="Chat invitation"><span>👋 Questions about our programs? Ask our concierge. <button class="kaizen-teaser-open" type="button">Ask now</button></span>' +
    '<button id="kaizen-faq-teaser-close" type="button" aria-label="Dismiss">×</button></div>' +
    '<button id="kaizen-faq-launcher" type="button" aria-controls="kaizen-faq-panel" aria-expanded="false">' +
    '<span class="kaizen-launcher-avatar">' + AVATAR_SVG + '<span class="kaizen-online-dot"></span></span>' +
    '<span class="kaizen-launcher-text">Chat with Kaizen</span></button>';

  var panel = document.createElement('section');
  panel.id = 'kaizen-faq-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('aria-label', 'Kaizen concierge chat');
  panel.innerHTML =
    '<div id="kaizen-faq-head"><div class="kaizen-head-info"><div class="kaizen-avatar">' + AVATAR_SVG +
    '<span class="kaizen-online-badge"></span></div><div><strong>Kaizen Concierge</strong>' +
    '<small><span class="kaizen-status-pulse"></span>Instant replies · FAQ assistant</small></div></div>' +
    '<div class="kaizen-head-actions">' +
    '<button id="kaizen-faq-mute" type="button" aria-label="Mute sound" title="Mute sound">🔊</button>' +
    '<button id="kaizen-faq-reset" type="button" aria-label="Restart chat" title="Restart chat">↺</button>' +
    '<button id="kaizen-faq-close" type="button" aria-label="Close chat">✕</button></div></div>' +
    '<div id="kaizen-faq-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>' +
    '<div id="kaizen-faq-chips"></div>' +
    '<form id="kaizen-faq-form" autocomplete="off"><input id="kaizen-faq-input" maxlength="300" required placeholder="Type your question…" aria-label="Type your question">' +
    '<button type="submit" aria-label="Send message">➤</button></form>' +
    '<p id="kaizen-faq-note">AI-style FAQ assistant · Not medical advice</p>';

  document.body.appendChild(container);
  document.body.appendChild(panel);

  var launcher = document.getElementById('kaizen-faq-launcher');
  var teaser = container.querySelector('.kaizen-faq-teaser');
  var teaserClose = document.getElementById('kaizen-faq-teaser-close');
  var messages = document.getElementById('kaizen-faq-messages');
  var chipsBox = document.getElementById('kaizen-faq-chips');
  var form = document.getElementById('kaizen-faq-form');
  var input = document.getElementById('kaizen-faq-input');
  var muteBtn = document.getElementById('kaizen-faq-mute');
  var resetBtn = document.getElementById('kaizen-faq-reset');
  var closeBtn = document.getElementById('kaizen-faq-close');

  /* ---------------- Sound (Web Audio, no files) ---------------- */
  var muted = false, audioCtx = null;
  try { muted = sessionStorage.getItem('kaizenMuted') === '1'; } catch (e) {}
  muteBtn.textContent = muted ? '🔇' : '🔊';

  function pop(freq) {
    if (muted) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime;
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + 0.18);
    } catch (e) {}
  }
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    try { sessionStorage.setItem('kaizenMuted', muted ? '1' : '0'); } catch (e) {}
    if (!muted) pop(520);
  });

  /* ---------------- Rendering helpers ---------------- */
  function addInline(el, str) {
    str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).forEach(function (p) {
      if (!p) return;
      var node;
      if (/^\*\*[^*]+\*\*$/.test(p)) { node = document.createElement('strong'); node.textContent = p.slice(2, -2); }
      else if (/^\*[^*]+\*$/.test(p)) { node = document.createElement('em'); node.textContent = p.slice(1, -1); }
      else { node = document.createTextNode(p); }
      el.appendChild(node);
    });
  }
  function scrollDown() { messages.scrollTop = messages.scrollHeight; }

  function addTimeLabel(label) {
    var t = document.createElement('div');
    t.className = 'kaizen-faq-time';
    t.textContent = label;
    messages.appendChild(t);
  }

  function addUser(text) {
    var row = document.createElement('div');
    row.className = 'kaizen-faq-row user';
    var b = document.createElement('div');
    b.className = 'kaizen-faq-bubble kaizen-faq-user';
    b.textContent = text;
    row.appendChild(b);
    messages.appendChild(row);
    pop(430);
    scrollDown();
  }

  function paragraph(parent, str, first) {
    var d = document.createElement('div');
    if (!first) d.style.marginTop = '8px';
    addInline(d, str);
    parent.appendChild(d);
  }

  function runAction(a) {
    if (a.type === 'whatsapp') {
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(a.text), '_blank', 'noopener');
    } else if (a.type === 'tel') {
      window.location.href = 'tel:' + PHONE_TEL;
    } else if (a.type === 'modal') {
      togglePanel(false);                       // modal sits below the chat window, so close chat first
      if (window.KaizenSite && window.KaizenSite.openBooking) window.KaizenSite.openBooking(a.service);
      else { var btn = document.querySelector('.open-booking'); if (btn) btn.click(); }
    } else if (a.type === 'scroll') {
      if (window.innerWidth <= 900) togglePanel(false);
      setTimeout(function () {
        if (window.KaizenSite && window.KaizenSite.scrollTo) window.KaizenSite.scrollTo(a.target);
        else { var el = document.querySelector(a.target); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
      }, 150);
    }
  }

  function addBot(reply) {
    var row = document.createElement('div');
    row.className = 'kaizen-faq-row bot';
    var icon = document.createElement('div');
    icon.className = 'kaizen-bot-icon';
    icon.textContent = '🌿';
    var bubble = document.createElement('div');
    bubble.className = 'kaizen-faq-bubble kaizen-faq-bot';

    reply.text.forEach(function (p, i) { paragraph(bubble, p, i === 0); });
    if (reply.list) {
      var ul = document.createElement('ul');
      ul.className = 'kaizen-faq-list';
      reply.list.forEach(function (li) { var l = document.createElement('li'); l.textContent = li; ul.appendChild(l); });
      bubble.appendChild(ul);
    }
    if (reply.text2) reply.text2.forEach(function (p) { paragraph(bubble, p, false); });

    if (reply.actions && reply.actions.length) {
      var box = document.createElement('div');
      box.className = 'kaizen-faq-actions';
      reply.actions.forEach(function (a) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kaizen-action-btn kaizen-action-' + ({ modal: 'modal', whatsapp: 'whatsapp', tel: 'tel', scroll: 'scroll', upload: 'upload' }[a.type]);
        btn.textContent = a.label;
        btn.addEventListener('click', function () { runAction(a); });
        box.appendChild(btn);
      });
      bubble.appendChild(box);
    }
    row.appendChild(icon);
    row.appendChild(bubble);
    messages.appendChild(row);
    pop(620);
    scrollDown();
  }

  function showTyping() {
    var row = document.createElement('div');
    row.className = 'kaizen-faq-row bot';
    row.innerHTML = '<div class="kaizen-bot-icon">🌿</div><div class="kaizen-faq-bubble kaizen-faq-bot kaizen-typing-bubble" aria-label="Concierge is typing">' +
      '<span class="kaizen-dot"></span><span class="kaizen-dot"></span><span class="kaizen-dot"></span></div>';
    messages.appendChild(row);
    scrollDown();
    return row;
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    list.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', function () { ask(label); });
      chipsBox.appendChild(b);
    });
    chipsBox.scrollLeft = 0;
  }

  /* ---------------- Conversation flow ---------------- */
  var queue = [], busy = false, session = 0;

  function delayFor(reply) {
    var len = reply.text.join(' ').length;
    return Math.min(1700, 550 + len * 6);
  }

  function ask(text) {
    text = String(text || '').trim();
    if (!text) return;
    addUser(text);
    queue.push({ text: text, s: session });
    next();
  }

  function next() {
    if (busy || !queue.length) return;
    busy = true;
    var job = queue.shift();
    var reply = respond(job.text);
    var typing = showTyping();
    setTimeout(function () {
      if (job.s !== session) return;             // chat was restarted meanwhile
      typing.remove();
      addBot(reply);
      setChips(reply.chips || DEFAULT_CHIPS);
      busy = false;
      next();
    }, delayFor(reply));
  }

  function greet() {
    session++;
    queue = []; busy = true;
    intakeAnswers = [];
    intakeCity = '';
    intakeIndex = -1;
    messages.innerHTML = '';
    addTimeLabel('Today');
    var typing = showTyping();
    var my = session;
    setTimeout(function () {
      if (my !== session) return;
      typing.remove();
      addBot({
        text: ['Hello 👋', 'Welcome to **Kaizen Health & Wellness**.', 'I’m your AI assistant. I can help you with:'],
        list: ['Weight Loss', 'Hair & Wrinkle Programs', 'Insulin Resistance', 'Longevity & Optimization'],
        text2: ['How can I help you today?', '**What city are you based in?**']
      });
      setChips(DEFAULT_CHIPS);
      busy = false;
      next();
    }, 800);
  }

  /* ---------------- Panel open / close ---------------- */
  var opened = false, greeted = false, teaserDismissed = false;

  function hideTeaser() { teaser.classList.remove('show'); }

  function togglePanel(open) {
    panel.classList.toggle('kaizen-faq-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      opened = true;
      hideTeaser();
      if (!greeted) { greeted = true; greet(); }
      setTimeout(function () { input.focus(); }, 250);
      pop(560);
    }
  }

  launcher.addEventListener('click', function () { togglePanel(!panel.classList.contains('kaizen-faq-open')); });
  closeBtn.addEventListener('click', function () { togglePanel(false); launcher.focus(); });
  resetBtn.addEventListener('click', function () { greet(); });
  teaser.addEventListener('click', function (e) {
    if (e.target === teaserClose) return;
    togglePanel(true);
  });
  teaserClose.addEventListener('click', function (e) {
    e.stopPropagation();
    teaserDismissed = true;
    hideTeaser();
    try { sessionStorage.setItem('kaizenTeaser', '1'); } catch (er) {}
  });
  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('kaizen-faq-open')) return;
    if (e.key === 'Escape') {
      togglePanel(false);
      launcher.focus();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = panel.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    ask(v);
    input.focus();
  });

  /* Proactive teaser after 3 seconds (once per visit) */
  try { teaserDismissed = sessionStorage.getItem('kaizenTeaser') === '1'; } catch (e) {}
  setTimeout(function () {
    if (!opened && !teaserDismissed) teaser.classList.add('show');
  }, 3000);
})();
