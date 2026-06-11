/**
 * GrowZen UX Enhancements
 * Adds keyboard accessibility and improved interaction patterns.
 */
;(function () {
  "use strict"

  // Dropdown navigation accessibility
  const dropdownTriggers = document.querySelectorAll(".gzen-nav-dropdown-trigger")

  dropdownTriggers.forEach((trigger) => {
    // Toggle aria-expanded on click
    trigger.addEventListener("click", (e) => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true"
      trigger.setAttribute("aria-expanded", !isExpanded)
      e.stopPropagation() // Prevent immediate closing from document click
    })

    // Toggle on Enter or Space key
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const isExpanded = trigger.getAttribute("aria-expanded") === "true"
        trigger.setAttribute("aria-expanded", !isExpanded)
      }
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    dropdownTriggers.forEach((trigger) => {
      if (trigger.getAttribute("aria-expanded") === "true") {
        const dropdown = trigger.closest(".gzen-nav-dropdown")
        if (dropdown && !dropdown.contains(e.target)) {
          trigger.setAttribute("aria-expanded", "false")
        }
      }
    })
  })

  // Close dropdown on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownTriggers.forEach((trigger) => {
        if (trigger.getAttribute("aria-expanded") === "true") {
          trigger.setAttribute("aria-expanded", "false")
          trigger.focus()
        }
      })
    }
  })
})()
