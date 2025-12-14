const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const rewriteBtn = document.getElementById("rewriteBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function setBusy(isBusy) {
  rewriteBtn.disabled = isBusy;
  clearBtn.disabled = isBusy;
  if (isBusy) rewriteBtn.textContent = "מעבד...";
  else rewriteBtn.textContent = "שכתב";
}

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  setStatus("");
  inputText.focus();
});

rewriteBtn.addEventListener("click", async () => {
  const sentence = (inputText.value || "").trim();
  if (!sentence) {
    setStatus("נא להכניס משפט לפני שליחה.");
    inputText.focus();
    return;
  }

  setBusy(true);
  setStatus("שולח למנוע השכתוב...");

  try {
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.error || "אירעה שגיאה לא צפויה.";
      throw new Error(msg);
    }

    outputText.value = data.rewritten || "";
    setStatus("בוצע.");
  } catch (err) {
    console.error(err);
    setStatus("שגיאה: " + (err?.message || "לא ניתן היה להשלים את הפעולה."));
  } finally {
    setBusy(false);
  }
});
