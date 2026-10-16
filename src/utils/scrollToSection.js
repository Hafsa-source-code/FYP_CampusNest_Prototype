/** Smoothly scrolls the page to the element with this id (used by in-page tabs and buttons). */
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}