# שכתוב משפטי בעברית גבוהה (Gemini + Vercel)

זה פרויקט מאוד פשוט:
- דף אינטרנט סטטי (index.html) שבו המשתמש כותב משפט
- פונקציית API ב-Vercel תחת ‎/api/rewrite שמדברת עם Gemini בעזרת API Key שמוחזק כ-Environment Variable (לא נחשף בדפדפן)

## איפה שמים את המפתח?
ב-Vercel: Project → Settings → Environment Variables → הוסף:
- Key: GEMINI_API_KEY
- Value: (המפתח שקיבלת ב-Google AI Studio)
- Apply to: Production (וגם Preview אם רוצים)

## בדיקה
אחרי Deploy:
- פתח את האתר
- כתוב משפט
- לחץ "שכתב"
