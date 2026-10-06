import { useState } from "react";
import "./createReport.css";

const CATEGORIES = [
  { name: "בור בכביש", icon: "🕳️" },
  { name: "תאורה מקולקלת", icon: "💡" },
  { name: "פח מלא", icon: "🗑️" },
  { name: "מדרכה שבורה", icon: "🧱" },
  { name: "קולחים", icon: "💧" },
  { name: "גרפיטי", icon: "🎨" },
  { name: "עץ מסוכן", icon: "🌳" },
  { name: "קו מים פרוץ", icon: "🚰" },
];

export default function CreateReport({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [useGPS, setUseGPS] = useState(true);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedCategoryObj = CATEGORIES.find((c) => c.name === category);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    if (onSubmit) onSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          <div className="text-center">
            <h2 className="font-bold text-gray-900">דיווח על מפגע</h2>
            <p className="text-xs text-gray-400 mt-0.5">שלב {step} מתוך 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="w-6 h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: s <= step ? "#f97316" : "#e5e7eb" }}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* ── Step 1: Location ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">📍</div>
                <h3 className="text-xl font-bold text-gray-900">היכן המפגע?</h3>
                <p className="text-sm text-gray-500 mt-1">בחר את מיקום המפגע</p>
              </div>

              {/* GPS Option */}
              <button
                onClick={() => setUseGPS(true)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 mb-3 transition-all ${
                  useGPS ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${useGPS ? "bg-orange-400 text-white" : "bg-gray-100"}`}>
                  🎯
                </div>
                <div className="text-right flex-1">
                  <div className="font-semibold text-gray-900 text-sm">השתמש במיקום הנוכחי שלי</div>
                  <div className="text-xs text-gray-500">מדויק ביותר</div>
                </div>
                {useGPS && (
                  <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>

              {/* Manual Option */}
              <button
                onClick={() => setUseGPS(false)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 mb-3 transition-all ${
                  !useGPS ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${!useGPS ? "bg-orange-400 text-white" : "bg-gray-100"}`}>
                  ✍️
                </div>
                <div className="text-right flex-1">
                  <div className="font-semibold text-gray-900 text-sm">הזן כתובת ידנית</div>
                  <div className="text-xs text-gray-500">הקלד את הרחוב והמספר</div>
                </div>
                {!useGPS && (
                  <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>

              {!useGPS && (
                <input
                  type="text"
                  placeholder="לדוגמה: רחוב דיזנגוף 85, תל אביב"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 mb-3"
                  autoFocus
                />
              )}

              {useGPS && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 mb-3">
                  <span className="text-green-500 text-lg font-bold">✓</span>
                  <div>
                    <div className="text-sm font-medium text-green-800">מיקום זוהה</div>
                    <div className="text-xs text-green-600">רחוב דיזנגוף 72, תל אביב</div>
                  </div>
                </div>
              )}

              {/* Mini map preview */}
              <div className="relative rounded-2xl overflow-hidden mt-2 mb-4 border border-gray-200" style={{ height: 140, backgroundColor: "#e2e8d2" }}>
                <div className="absolute inset-0 opacity-60">
                  <svg viewBox="0 0 400 140" className="w-full h-full">
                    <rect width="400" height="140" fill="#e2e8d2"/>
                    {[40,100,160,220,280,340].map(x => <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="white" strokeWidth="4"/>)}
                    {[35,70,105].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="3"/>)}
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg border-2 border-white">
                      📍
                    </div>
                    <div className="w-1 h-3 bg-orange-500" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 bg-white/70 py-0.5">לחץ על המפה לבחירת מיקום מדויק</div>
              </div>
            </div>
          )}

          {/* ── Step 2: Details ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold text-gray-900">פרטי המפגע</h3>
                <p className="text-sm text-gray-500 mt-1">תאר את הבעיה בפירוט</p>
              </div>

              {/* Category grid */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">סוג המפגע</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all ${
                        category === cat.name
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-2xl mb-1">{cat.icon}</span>
                      <span className="text-xs text-center leading-tight text-gray-700">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">תיאור</label>
                <textarea
                  placeholder="תאר את המפגע — מה ראית? מה הסכנה? מתי שמת לב?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none bg-white"
                />
              </div>

              {/* Photo upload */}
              <div className="mb-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">תמונה / וידאו</label>
                <button
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 transition-all ${
                    hasPhoto ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-orange-300 hover:bg-orange-50 bg-white"
                  }`}
                >
                  {hasPhoto ? (
                    <>
                      <div className="text-3xl">✅</div>
                      <div className="text-sm font-medium text-green-700">תמונה הועלתה!</div>
                      <div className="text-xs text-green-500">IMG_2026_0906.jpg</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl">📷</div>
                      <div className="text-sm font-medium text-gray-600">לחץ להעלאת תמונה</div>
                      <div className="text-xs text-gray-400">תמונה תגדיל את דחיפות הדיווח</div>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">🚀</div>
                <h3 className="text-xl font-bold text-gray-900">אישור ושליחה</h3>
                <p className="text-sm text-gray-500 mt-1">בדוק את הפרטים לפני שליחה</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3 border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16 text-left">מיקום:</span>
                  <span className="text-gray-800 text-sm font-medium">
                    {useGPS ? "רחוב דיזנגוף 72, תל אביב" : address || "לא הוזן"}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16 text-left">קטגוריה:</span>
                  <span className="text-gray-800 text-sm font-medium">
                    {category ? `${selectedCategoryObj?.icon} ${category}` : "לא נבחרה"}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm w-16 text-left mt-0.5">תיאור:</span>
                  <span className="text-gray-800 text-sm font-medium flex-1 leading-relaxed">
                    {description || "לא הוזן תיאור"}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16 text-left">תמונה:</span>
                  <span className="text-gray-800 text-sm font-medium">
                    {hasPhoto ? "✅ הועלתה" : "❌ ללא תמונה"}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 mb-2">
                <span className="text-blue-400">ℹ️</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                  הדיווח יועבר מיידית לעיריה ולקהילה. תקבל/י עדכון כשהמפגע יטופל.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 border-2 border-gray-200 text-gray-700 rounded-xl py-3 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              חזרה
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !category}
              className="flex-1 text-white rounded-xl py-3 font-bold text-sm transition-all disabled:opacity-40"
              style={{ backgroundColor: "#f97316" }}
            >
              המשך ←
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: submitting ? "#9ca3af" : "#f97316" }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                  </svg>
                  שולח...
                </>
              ) : "🚀 שלח דיווח"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}