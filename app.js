
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const sections = window.BUSINESS_SECTIONS || [];
  const lessons = window.BUSINESS_TOPICS || [];
  const cfg = window.BUSINESS_APP_CONFIG;

  const done = new Set((() => {
    try {
      const value = JSON.parse(
        localStorage.getItem(cfg.progressStorageKey) || "[]"
      );
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  })());

  let current = null;
  let questions = [];
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  const sectionTitle = id =>
    sections.find(section => section.id === id)?.title || id;

  function saveProgress() {
    try {
      localStorage.setItem(
        cfg.progressStorageKey,
        JSON.stringify([...done])
      );
      return true;
    } catch {
      return false;
    }
  }

  function renderFilters() {
    sections.forEach(section => {
      ["filter", "practice-filter"].forEach(id => {
        $(id).insertAdjacentHTML(
          "beforeend",
          `<option value="${section.id}">${esc(section.title)}</option>`
        );
      });
    });

    $("tabs").innerHTML =
      '<button class="active" data-section="all">All sections</button>' +
      sections.map(section =>
        `<button data-section="${section.id}">${
          esc(section.shortTitle || section.title)
        }</button>`
      ).join("");
  }

  function renderLessons() {
    const query = $("search").value.toLowerCase().trim();
    const selectedSection = $("filter").value;
    const hideCompleted = $("hide-completed").checked;

    const found = lessons.filter(lesson => {
      const matchesSection =
        selectedSection === "all" ||
        lesson.section === selectedSection;

      const matchesCompletion =
        !hideCompleted || !done.has(lesson.id);

      const searchable = [
        lesson.title,
        lesson.summary,
        (lesson.keywords || []).join(" "),
        JSON.stringify(lesson.content)
      ].join(" ").toLowerCase();

      return matchesSection &&
        matchesCompletion &&
        (!query || searchable.includes(query));
    });

    $("lesson-count").textContent = `${lessons.length} lessons`;

    $("lesson-list").innerHTML = found.map(lesson => `
      <article class="lesson-card ${done.has(lesson.id) ? "done" : ""}">
        <div class="lesson-icon">
          ${done.has(lesson.id) ? "✓" : esc(lesson.number || "•")}
        </div>
        <div>
          <h3>${esc(lesson.title)}</h3>
          <p>${esc(lesson.summary)}</p>
          <small>${esc(sectionTitle(lesson.section))} · ${
            done.has(lesson.id) ? "Completed" : "Revision lesson"
          }</small>
        </div>
        <button class="open" data-open="${esc(lesson.id)}">Open →</button>
      </article>
    `).join("");

    $("empty").hidden = found.length > 0;
    renderProgress();
  }

  function openLesson(id) {
    current = lessons.find(lesson => lesson.id === id);
    if (!current) return;

    $("dialog-section").textContent = sectionTitle(current.section);
    $("dialog-title").textContent = current.title;

    $("dialog-body").innerHTML = (current.content || []).map(block => {
      if (typeof block === "string") {
        return `<p>${esc(block)}</p>`;
      }

      const className =
        block.type === "tip" ? "tip" :
        block.type === "example" ? "example" : "";

      return `
        ${block.heading ? `<h3>${esc(block.heading)}</h3>` : ""}
        ${block.text ? `<p class="${className}">${esc(block.text)}</p>` : ""}
        ${block.bullets?.length ? `
          <ul>${block.bullets.map(item =>
            `<li>${esc(item)}</li>`
          ).join("")}</ul>
        ` : ""}
      `;
    }).join("");

    $("dialog-status").textContent = done.has(id)
      ? "Lesson completed"
      : "Mark this lesson complete after studying it.";

    $("complete").textContent = done.has(id)
      ? "Mark as Incomplete"
      : "Mark as Complete";

    if (!$("lesson-dialog").open) {
      $("lesson-dialog").showModal();
    }
  }

  function renderProgress() {
    const completed = done.size;
    const total = lessons.length;
    const percentage = total
      ? Math.round(completed / total * 100)
      : 0;

    $("hero-completed").textContent = completed;
    $("hero-pct").textContent = `${percentage}% complete`;
    $("hero-bar").style.width = percentage + "%";

    $("progress-percent").textContent = percentage + "%";
    $("progress-bar").style.width = percentage + "%";
    $("progress-summary").textContent =
      `${completed} of ${total} lessons completed`;

    $("section-progress").innerHTML = sections.map(section => {
      const sectionLessons = lessons.filter(
        lesson => lesson.section === section.id
      );

      const completedCount = sectionLessons.filter(
        lesson => done.has(lesson.id)
      ).length;

      const percentage = sectionLessons.length
        ? completedCount / sectionLessons.length * 100
        : 0;

      return `
        <div class="section-card">
          <h3>${esc(section.title)}</h3>
          <div class="track">
            <i style="width:${percentage}%"></i>
          </div>
          <small>${completedCount} of ${sectionLessons.length} lessons completed</small>
        </div>
      `;
    }).join("");
  }

  function showView(name) {
    document.querySelectorAll(".view").forEach(section => {
      section.classList.toggle("active", section.id === `view-${name}`);
    });

    document.querySelectorAll("nav [data-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.view === name);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) return showView(viewButton.dataset.view);

    const goButton = event.target.closest("[data-go]");
    if (goButton) return showView(goButton.dataset.go);

    const openButton = event.target.closest("[data-open]");
    if (openButton) return openLesson(openButton.dataset.open);

    const tab = event.target.closest("[data-section]");
    if (tab) {
      $("filter").value = tab.dataset.section;

      document.querySelectorAll(".tabs button").forEach(button => {
        button.classList.toggle("active", button === tab);
      });

      renderLessons();
    }
  });

  $("search").addEventListener("input", renderLessons);
  $("filter").addEventListener("change", renderLessons);
  $("hide-completed").addEventListener("change", renderLessons);
  $("close").onclick = () => $("lesson-dialog").close();

  $("complete").onclick = () => {
    if (!current) return;

    if (done.has(current.id)) {
      done.delete(current.id);
    } else {
      done.add(current.id);
    }

    const saved = saveProgress();

    $("dialog-status").textContent = saved
      ? (done.has(current.id)
          ? "Lesson marked complete."
          : "Lesson marked incomplete.")
      : "Could not save progress in this browser.";

    renderLessons();
    openLesson(current.id);
  };

  $("reset").onclick = () => {
    if (confirm("Reset all completed lessons stored on this browser? This cannot be undone.")) {
      done.clear();
      saveProgress();
      renderLessons();
    }
  };

  function startPractice() {
    const available = (window.BUSINESS_QUIZ || [])
      .filter(question =>
        $("practice-filter").value === "all" ||
        question.section === $("practice-filter").value
      )
      .sort(() => Math.random() - 0.5);

    questions = $("practice-count").value === "all"
      ? available
      : available.slice(0, Number($("practice-count").value));

    questionIndex = 0;
    score = 0;
    renderQuestion();
  }

  function renderQuestion() {
    const area = $("practice-area");

    if (questionIndex >= questions.length) {
      const percentage = questions.length
        ? Math.round(score / questions.length * 100)
        : 0;

      area.innerHTML = `
        <h3>Practice complete</h3>
        <p>You scored <b>${score} out of ${questions.length}</b> (${percentage}%).</p>
        <p>Review the explanations and revisit lessons for topics to improve.</p>
        <button class="primary" id="again">Try another set</button>
      `;

      $("again").onclick = startPractice;
      return;
    }

    const question = questions[questionIndex];
    answered = false;

    area.innerHTML = `
      <div class="heading">
        <small>Question ${questionIndex + 1} of ${questions.length} · ${
          esc(question.type)
        }</small>
        <small>Score: ${score}</small>
      </div>
      <h3 class="practice-q">${esc(question.q)}</h3>
      <div class="answers">
        ${question.options.map((option, index) => `
          <button data-answer="${index}">
            ${String.fromCharCode(65 + index)}. ${esc(option)}
          </button>
        `).join("")}
      </div>
      <div id="feedback"></div>
      <p><button id="next" class="primary" disabled>Next question →</button></p>
    `;

    area.querySelectorAll("[data-answer]").forEach(button => {
      button.onclick = () => answerQuestion(Number(button.dataset.answer));
    });

    $("next").onclick = () => {
      if (answered) {
        questionIndex++;
        renderQuestion();
      }
    };
  }

  function answerQuestion(index) {
    if (answered) return;
    answered = true;

    const question = questions[questionIndex];
    const correct = index === question.answer;

    if (correct) score++;

    $("practice-area").querySelectorAll("[data-answer]").forEach((button, i) => {
      button.disabled = true;

      if (i === question.answer) button.classList.add("correct");
      else if (i === index) button.classList.add("wrong");
    });

    $("feedback").innerHTML = `
      <p class="feedback">
        <b>${correct ? "Correct!" : "Not quite."}</b>
        ${esc(question.why)}
      </p>
    `;

    $("next").disabled = false;
    $("next").textContent =
      questionIndex === questions.length - 1
        ? "See results →"
        : "Next question →";
  }

  $("start").onclick = startPractice;

  renderFilters();
  renderLessons();

  window.BUSINESS_APP = {
    getLessons: () => lessons,
    getSections: () => sections,
    escapeHTML: esc,
    sectionName: sectionTitle
  };
})();
