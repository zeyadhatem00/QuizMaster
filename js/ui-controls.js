import { formerror } from "./main.js";

const rounds = document.getElementById("questionsNumber");
export let roundsVALUE = 0;
export let levelVALUE = "easy";
export let typeVALUE = "";

/**
 * Initialize custom select dropdowns
 */
function initCustomSelects() {
  document.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");
    const options = select.querySelectorAll(".custom-select-option");
    const hiddenInput = select.parentElement.querySelector(
      'input[type="hidden"]',
    );
    const textSpan = trigger.querySelector(".custom-select-text");
    const iconSpan = trigger.querySelector(".custom-select-icon");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".custom-select.open").forEach((s) => {
        if (s !== select) s.classList.remove("open");
      });
      select.classList.toggle("open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value;
        const icon = option.querySelector("i").outerHTML;
        const text = option.textContent.trim();

        select.dataset.value = value;
        if (hiddenInput) hiddenInput.value = value;
        textSpan.textContent = text;
        iconSpan.innerHTML = icon;

        options.forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
        select.classList.remove("open");
        if (select.id === "difficultySelect") {
          levelVALUE = value;
          console.log(levelVALUE);
        } else if (select.id === "categorySelect") {
          typeVALUE = value;
          console.log(typeVALUE);
        }
      });
    });
  });
}

/**
 * Initialize number input custom buttons
 */
function initNumberInputs() {
  rounds.addEventListener("input", () => {
    formerror.classList.add("hidden");
    roundsVALUE = rounds.value;
    console.log(roundsVALUE);
  });

  document.querySelectorAll(".number-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".number-input-wrapper");
      const input = wrapper.querySelector('input[type="number"]');
      const min = parseInt(input.min) || 1;
      const max = parseInt(input.max) || 50;
      let value = parseInt(input.value) || 0;

      if (btn.dataset.action === "increment" && value < max) {
        input.value = value + 1;
        formerror.classList.add("hidden");
      } else if (btn.dataset.action === "decrement" && value > min) {
        input.value = value - 1;
      }
      roundsVALUE = input.value;
      console.log(roundsVALUE);
    });
  });
}

/**
 * Close dropdowns when clicking outside
 */
function initClickOutside() {
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".custom-select.open")
      .forEach((s) => s.classList.remove("open"));
  });
}

// Initialize all UI controls when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initCustomSelects();
  initNumberInputs();
  initClickOutside();
});
