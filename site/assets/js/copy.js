// Copy buttons on .install lines. The only script on the site besides game iframes (STYLE_GUIDE: Weight).
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".install button");
  if (!btn || !navigator.clipboard) return;
  const code = btn.parentElement.querySelector("code");
  navigator.clipboard.writeText(code.textContent.trim()).then(() => {
    const label = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(() => { btn.textContent = label; }, 1500);
  });
});
