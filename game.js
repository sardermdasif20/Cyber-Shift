(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const state = { score: 0, resolved: [], completed: {}, sound: true, activeMission: null, step: 0 };
  const missions = {
    phishing: {
      code: "01-A", title: "Phishing or Friendly?", tag: "EMAIL ANALYSIS",
      intro: "A teammate forwards this message. Inspect the clues and decide what the safest next step is.",
      evidence: "FROM: IT-SUPPORT <helpdesk@it-secure-alert.example>\nSUBJECT: URGENT — mailbox expires in 10 minutes\n\nYour mailbox will be disabled. Confirm your password immediately using the button below. Do not contact IT; this is an automated security check.",
      questions: [
        {q:"What is the strongest warning sign in this message?", choices:["It uses a company-style signature","It creates urgency and asks for a password","It mentions a mailbox"], answer:1, explain:"Correct. Urgency plus a request for a password is a major phishing warning sign."},
        {q:"What should the teammate do next?", choices:["Click quickly to avoid losing access","Reply with their password","Report it using the approved channel and verify with IT independently"], answer:2, explain:"Correct. Report it and verify through a separate, trusted channel. Never share a password by email."}
      ]
    },
    triage: {
      code: "02-B", title: "Alert Triage", tag: "SOC DECISION DESK",
      intro: "Three fictional alerts arrive at once. Prioritize the event that needs the fastest review.",
      evidence: "ALERT A  |  1 failed login from known device\nALERT B  |  28 failed logins against one account in 2 minutes\nALERT C  |  Scheduled backup completed successfully",
      questions: [
        {q:"Which alert should be reviewed first?", choices:["Alert A — one failed login","Alert B — repeated failures in a short period","Alert C — successful backup"], answer:1, explain:"Correct. A burst of failed logins can indicate password guessing or a misconfigured service and deserves prompt review."},
        {q:"What is the best defensive next step?", choices:["Check the account's sign-in history and follow the incident process","Delete all logs to reduce noise","Attempt to access the account as the user"], answer:0, explain:"Correct. Review available evidence and follow the organization's approved response process."}
      ]
    },
    password: {
      code: "03-C", title: "Password Fortress", tag: "IDENTITY DEFENSE",
      intro: "A project team needs a safer account policy. Choose the best recommendation.",
      evidence: "TEAM REQUEST:\n\"We need a password policy that people can actually follow and that protects shared project accounts.\"",
      questions: [
        {q:"Which approach is strongest?", choices:["One short password reused everywhere","A long, unique passphrase for every account, stored in a password manager","A password based on the company name"], answer:1, explain:"Correct. Long, unique passwords reduce the impact of password reuse. A password manager makes them practical."},
        {q:"What extra protection should be enabled?", choices:["Multi-factor authentication","Sharing passwords in team chat","Turning off sign-in notifications"], answer:0, explain:"Correct. Multi-factor authentication adds another layer if a password is exposed."}
      ]
    }
  };

  function setView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === name));
    $(name + "View").classList.add("active");
    const titles = {dashboard:["Command Center","Monitor the network. Investigate anomalies. Keep the city online."],missions:["Mission Board","Choose a training simulation and sharpen your defensive instincts."],intel:["Threat Intel","Know the patterns. Understand the signals. Defend responsibly."],briefing:["Field Guide","A few principles every security operator should know."]};
    $("pageTitle").innerHTML = titles[name][0].replace(" ", ' <span class="gradient-text">') + "</span>";
    $("pageSubtitle").textContent = titles[name][1];
  }
  document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));
  $("openMissions").addEventListener("click", () => setView("missions"));
  $("startMission").addEventListener("click", () => launch("phishing"));
  document.querySelectorAll("[data-mission]").forEach(b => b.addEventListener("click", () => launch(b.dataset.mission)));
  $("closeModal").addEventListener("click", closeModal);
  $("gameModal").addEventListener("click", e => { if (e.target === $("gameModal")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  function launch(key) {
    state.activeMission = key; state.step = 0;
    $("gameModal").hidden = false;
    $("feedback").textContent = "";
    $("feedback").className = "modal-feedback";
    $("missionCode").textContent = missions[key].code;
    renderQuestion();
  }
  function renderQuestion() {
    const m = missions[state.activeMission], q = m.questions[state.step];
    $("modalProgress").style.width = `${(state.step / m.questions.length) * 100}%`;
    $("missionContent").innerHTML = `
      <div class="mission-tag">${m.tag} · STEP ${state.step + 1}/${m.questions.length}</div>
      <h2 id="modalTitle">${m.title}</h2>
      <p class="question-copy">${m.intro}</p>
      <div class="evidence-box"></div>
      <p class="question-copy"><b>${q.q}</b></p>
      <div class="choice-list"></div>`;
    $("missionContent").querySelector(".evidence-box").textContent = m.evidence;
    const list = $("missionContent").querySelector(".choice-list");
    q.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn"; btn.textContent = `${String.fromCharCode(65+i)}.  ${choice}`;
      btn.addEventListener("click", () => answer(i, btn));
      list.appendChild(btn);
    });
    $("feedback").textContent = "";
    $("feedback").className = "modal-feedback";
  }
  function answer(index, selected) {
    const m = missions[state.activeMission], q = m.questions[state.step];
    document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
    const buttons = [...document.querySelectorAll(".choice-btn")];
    buttons[q.answer].classList.add("correct");
    const correct = index === q.answer;
    if (!correct) selected.classList.add("wrong");
    $("feedback").textContent = (correct ? "✓ " : "✕ ") + q.explain;
    $("feedback").className = "modal-feedback " + (correct ? "success" : "error");
    const next = document.createElement("button");
    next.className = "primary-btn next-btn";
    next.textContent = state.step + 1 === m.questions.length ? "COMPLETE MISSION →" : "NEXT STEP →";
    next.addEventListener("click", () => {
      if (state.step + 1 < m.questions.length) { state.step++; renderQuestion(); }
      else finishMission();
    });
    $("missionContent").appendChild(next);
    if (correct) state.score += 50;
    updateStats();
  }
  function finishMission() {
    const key = state.activeMission, m = missions[key];
    const firstTime = !state.completed[key];
    if (firstTime) { state.completed[key] = true; state.resolved.push(key); state.score += 0; }
    $("modalProgress").style.width = "100%";
    $("missionContent").innerHTML = `<div class="mission-tag">MISSION REPORT / ${m.code}</div><h2 id="modalTitle">Simulation <span class="gradient-text">complete.</span></h2><p class="question-copy">Good work, operator. You reviewed the evidence and made defensive decisions. ${firstTime ? "This mission is now marked complete." : "You have already completed this mission; replay it to practice."}</p><div class="evidence-box">STATUS: ${firstTime ? "COMPLETED" : "REPLAY COMPLETE"}\nXP EARNED: +${firstTime ? "100" : "0"} BONUS XP\nTOTAL DEFENSE SCORE: ${state.score}\nTHREATS RESOLVED: ${state.resolved.length}/3</div><p class="question-copy">Remember: real security work requires authorization, careful evidence handling, and your organization's response procedures.</p><button class="primary-btn" id="finishClose">RETURN TO COMMAND CENTER →</button>`;
    $("finishClose").addEventListener("click", closeModal);
    $("feedback").textContent = "✓ TRAINING OBJECTIVE ACHIEVED";
    $("feedback").className = "modal-feedback success";
    if (firstTime) addActivity(`${m.title} mission completed`, "Training simulator · Defensive decision recorded", "green");
    updateStats();
  }
  function updateStats() {
    $("scoreStat").textContent = String(state.score).padStart(3, "0");
    $("resolvedStat").textContent = String(state.resolved.length).padStart(2, "0");
    $("resolvedBar").style.width = `${state.resolved.length / 3 * 100}%`;
  }
  function addActivity(title, detail, color) {
    const item = document.createElement("div"); item.className = "activity-item";
    const dot = document.createElement("span"); dot.className = "activity-dot " + color;
    const body = document.createElement("div"), b = document.createElement("b"), s = document.createElement("small"), time = document.createElement("time");
    b.textContent = title; s.textContent = detail; time.textContent = "NOW";
    body.append(b,s); item.append(dot,body,time); $("activityList").prepend(item);
  }
  function closeModal() { $("gameModal").hidden = true; }
  function toast(message) {
    $("toast").textContent = message; $("toast").classList.add("show");
    setTimeout(() => $("toast").classList.remove("show"), 2200);
  }
  $("soundToggle").addEventListener("click", () => {
    state.sound = !state.sound;
    document.body.classList.toggle("no-scanlines", !state.sound);
    $("soundToggle").textContent = state.sound ? "▤ SCANLINES: ON" : "▤ SCANLINES: OFF";
    $("soundToggle").setAttribute("aria-pressed", String(state.sound));
    toast(state.sound ? "Display effect enabled." : "Display effect disabled.");
  });
  function tick() {
    const d = new Date();
    $("clock").textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(x => String(x).padStart(2,"0")).join(":");
  }
  tick(); setInterval(tick, 1000);
  // Local-only game: progress is kept in memory and resets when the page is refreshed.
})();