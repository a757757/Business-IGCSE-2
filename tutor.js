
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const form = $("tutor-form");
  const input = $("tutor-input");
  const messages = $("messages");

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9%£$.\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(value) {
    const ignored = new Set([
      "what", "how", "why", "the", "and", "for", "are",
      "does", "with", "from", "business", "explain", "tell",
      "about", "give", "some", "benefits", "advantages",
      "disadvantages"
    ]);

    return normalise(value)
      .split(/\s+/)
      .filter(word => word.length > 2 && !ignored.has(word));
  }

  function searchLessons(query) {
    const lessons = window.BUSINESS_APP?.getLessons?.() || [];
    const normalQuery = normalise(query);
    const queryWords = tokens(query);

    return lessons.map(lesson => {
      const body = normalise(JSON.stringify(lesson.content || []));
      const title = normalise(lesson.title);
      const summary = normalise(lesson.summary);
      const keywords = normalise((lesson.keywords || []).join(" "));

      let score = 0;

      if (title === normalQuery) score += 30;
      if (title.includes(normalQuery)) score += 18;
      if (keywords.includes(normalQuery)) score += 12;
      if (summary.includes(normalQuery)) score += 6;

      queryWords.forEach(word => {
        if (title.includes(word)) score += 7;
        if (keywords.includes(word)) score += 4;
        if (summary.includes(word)) score += 3;
        if (body.includes(word)) score += 1;
      });

      return { lesson, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  }

  function addMessage(role, text) {
    const paragraph = document.createElement("p");
    paragraph.className = "bubble" + (role === "user" ? " user" : "");
    paragraph.textContent =
      (role === "user" ? "You: " : "Study Helper: ") + text;

    messages.appendChild(paragraph);
    messages.scrollTop = messages.scrollHeight;
  }

  function answerQuestion(query) {
    const matches = searchLessons(query);

    if (!matches.length) {
      addMessage(
        "assistant",
        "I couldn't find a close match in the included lessons. " +
        "Try a specific term such as cash-flow forecast, market segmentation, " +
        "recruitment, Boston Matrix or quality control. " +
        "This helper searches the site's content; it does not generate answers " +
        "using an external AI model."
      );
      return;
    }

    const words = tokens(query);

    const responses = matches.map(({ lesson }) => {
      const relevantPoints = [];

      (lesson.content || []).forEach(block => {
        if (
          block.heading &&
          words.some(word => normalise(block.heading).includes(word))
        ) {
          relevantPoints.push(block.heading);
        }

        if (
          block.text &&
          words.some(word => normalise(block.text).includes(word))
        ) {
          relevantPoints.push(block.text);
        }

        (block.bullets || []).forEach(bullet => {
          if (words.some(word => normalise(bullet).includes(word))) {
            relevantPoints.push(bullet);
          }
        });
      });

      return `${lesson.title}: ${lesson.summary}` +
        (relevantPoints.length
          ? " " + relevantPoints.slice(0, 4).join(" ")
          : "");
    });

    addMessage(
      "assistant",
      responses.join("\n\n") +
      "\n\nOpen the matching lesson for the full explanation. " +
      "This is a content-search helper, not a language-model answer."
    );
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    addMessage("user", query);
    input.value = "";
    answerQuestion(query);
  });

  document.querySelectorAll(".suggestions button").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      form.requestSubmit();
    });
  });
})();
