/**
 * GrowZen Accessibility Enhancements
 * Adds dynamic ARIA attributes for the CSS-driven ecosystem dropdown.
 */
;(function () {
  "use strict"

  document.addEventListener("DOMContentLoaded", function () {
    var dropdowns = document.querySelectorAll(".gzen-nav-dropdown")

    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector(".gzen-nav-dropdown-trigger")
      if (!trigger) return

      // Update ARIA on hover
      dropdown.addEventListener("mouseenter", function () {
        trigger.setAttribute("aria-expanded", "true")
      })

      dropdown.addEventListener("mouseleave", function () {
        trigger.setAttribute("aria-expanded", "false")
      })

      // Update ARIA on focus (keyboard navigation)
      dropdown.addEventListener("focusin", function () {
        trigger.setAttribute("aria-expanded", "true")
      })

      dropdown.addEventListener("focusout", function (e) {
        // If the new focused element is not inside the dropdown, set to false
        if (!dropdown.contains(e.relatedTarget)) {
          trigger.setAttribute("aria-expanded", "false")
        }
      })

      // Handle Escape key to close and return focus to trigger
      dropdown.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          trigger.setAttribute("aria-expanded", "false")
          trigger.focus()
          // We blur the active element so the focus-within CSS stops applying
          if (document.activeElement && document.activeElement !== trigger) {
            document.activeElement.blur()
          }
        }
      })
    })
  })
})()
