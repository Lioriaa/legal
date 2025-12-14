// Vercel Function (Node.js) — שים לב: ה-API KEY נשמר כ-Environment Variable ב-Vercel ולא נמצא בקוד.
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "חסר משתנה סביבה GEMINI_API_KEY ב-Vercel (Settings → Environment Variables).",
      });
    }

    const sentence = (req.body?.sentence || "").toString().trim();
    if (!sentence) {
      return res.status(400).json({ error: "לא התקבל משפט לשכתוב (sentence)." });
    }

    // הגבלת אורך בסיסית כדי לצמצם סיכונים ועלויות
    if (sentence.length > 2000) {
      return res.status(400).json({ error: "הטקסט ארוך מדי. נא לקצר ל-2000 תווים לכל היותר." });
    }

    const model = "gemini-2.5-flash"; // אפשר לשנות למודל אחר לפי הצורך והזמינות בחשבון שלך

    const prompt = [
      "אתה עורך-דין ניסוחי. המטרה: לשכתב את הטקסט הבא לעברית משפטית גבוהה, מדויקת, מנומסת ומוקפדת.",
      "כללים:",
      "1) שמור על המשמעות המקורית, אל תוסיף עובדות חדשות.",
      "2) כתוב בעברית תקנית גבוהה, בסגנון משפטי-פורמלי.",
      "3) הימנע מסלנג ומחזרות.",
      "4) החזר רק את הנוסח המשוכתב (ללא הסברים, ללא כותרות, ללא נקודות תבליט).",
      "",
      "הטקסט לשכתוב:",
      `"""${sentence}"""`,
    ].join("\n");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512,
        },
      }),
    });

    const payload = await geminiRes.json().catch(() => null);

    if (!geminiRes.ok) {
      const details = payload?.error?.message || geminiRes.statusText || "Gemini API error";
      return res.status(500).json({ error: `שגיאה מה-Gemini API: ${details}` });
    }

    const rewritten =
      payload?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("")?.trim() ||
      payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "";

    if (!rewritten) {
      return res.status(500).json({ error: "המודל לא החזיר טקסט. נסה שוב." });
    }

    return res.status(200).json({ rewritten });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "שגיאה פנימית בשרת." });
  }
};
