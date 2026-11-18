export interface ZodiacSignInfo {
  id: string;
  buttonText: string;
  nameAr: string;
  symbol: string;
  dateRange: string;
  element: string;
  planet: string;
  traits: string[];
  compatibleWith: string;
  funNote: string;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: "aries",
    buttonText: "♈ الحمل",
    nameAr: "برج الحمل",
    symbol: "♈",
    dateRange: "21 مارس - 19 أبريل",
    element: "ناري 🔥",
    planet: "المريخ",
    traits: ["شجاعة ومبادرة", "طاقة عالية وحماس", "صراحة ووضوح", "روح قيادية"],
    compatibleWith: "الأسد، القوس، الجوزاء",
    funNote: "شخصية مندفعة نحو التحديات وتحب أن تكون دائماً في المقدمة.",
  },
  {
    id: "taurus",
    buttonText: "♉ الثور",
    nameAr: "برج الثور",
    symbol: "♉",
    dateRange: "20 أبريل - 20 مايو",
    element: "ترابي 🌿",
    planet: "الزهرة",
    traits: ["ثبات وصبر طويل", "ذوق رفيع وحب الجمال", "إخلاص ووفاء", "عملي وموثوق"],
    compatibleWith: "العذراء، الجدي، السرطان",
    funNote: "يعشق الاستقرار والقهوة الهادئة ويصل لأهدافه بثبات وهدوء.",
  },
  {
    id: "gemini",
    buttonText: "♊ الجوزاء",
    nameAr: "برج الجوزاء",
    symbol: "♊",
    dateRange: "21 مايو - 20 يونيو",
    element: "هوائي 💨",
    planet: "عطارد",
    traits: ["ذكاء وسرعة بديهة", "مهارة تواصل عالية", "فضول وحب المعرفة", "مرونة وتجدد"],
    compatibleWith: "الميزان، الدلو، الحمل",
    funNote: "عقل متقد بالأفكار، لا يمل الحوارات الذكية والتجارب الجديدة.",
  },
  {
    id: "cancer",
    buttonText: "♋ السرطان",
    nameAr: "برج السرطان",
    symbol: "♋",
    dateRange: "21 يونيو - 22 يوليو",
    element: "مائي 💧",
    planet: "القمر",
    traits: ["عاطفة عميقة وحنان", "حدس قوي", "اهتمام بالعائلة والأحباب", "وفاء نادر"],
    compatibleWith: "العقرب، الحوت، الثور",
    funNote: "يبدو هادئاً من الخارج لكنه يحمل قلباً دافئاً وذاكرة لا تنسى التفاصيل.",
  },
  {
    id: "leo",
    buttonText: "♌ الأسد",
    nameAr: "برج الأسد",
    symbol: "♌",
    dateRange: "23 يوليو - 22 أغسطس",
    element: "ناري 🔥",
    planet: "الشمس",
    traits: ["كاريزما وحضور لافت", "كرم وسخاء", "ثقة عالية بالنفس", "إبداع وطموح"],
    compatibleWith: "الحمل، القوس، الميزان",
    funNote: "يملك حضوراً يشع طاقة إيجابية أينما ذهب، ويحب الإنجاز الكبير.",
  },
  {
    id: "virgo",
    buttonText: "♍ العذراء",
    nameAr: "برج العذراء",
    symbol: "♍",
    dateRange: "23 أغسطس - 22 سبتمبر",
    element: "ترابي 🌿",
    planet: "عطارد",
    traits: ["دقة وتنظيم", "تحليل منطقي", "مساعدة الآخرين", "إتقان التفاصيل"],
    compatibleWith: "الثور، الجدي، العقرب",
    funNote: "يلاحظ ما يغفل عنه الجميع، وعقله يرتب الفوضى في ثوانٍ.",
  },
  {
    id: "libra",
    buttonText: "♎ الميزان",
    nameAr: "برج الميزان",
    symbol: "♎",
    dateRange: "23 سبتمبر - 22 أكتوبر",
    element: "هوائي 💨",
    planet: "الزهرة",
    traits: ["دبلوماسية واتزان", "حب العدالة والسلام", "أناقة وذوق", "اجتماعي ولطيف"],
    compatibleWith: "الجوزاء، الدلو، الأسد",
    funNote: "يبحث دائماً عن التناغم والجمال، ويجيد تهدئة الأجواء بذكاء.",
  },
  {
    id: "scorpio",
    buttonText: "♏ العقرب",
    nameAr: "برج العقرب",
    symbol: "♏",
    dateRange: "23 أكتوبر - 21 نوفمبر",
    element: "مائي 💧",
    planet: "بلوتو",
    traits: ["عمق وغموض جذاب", "إرادة قوية", "إخلاص شديد", "فراسة عالية"],
    compatibleWith: "السرطان، الحوت، العذراء",
    funNote: "لا يكتفي بالسطوح، ويقرأ ما بين السطور بدقة مدهشة.",
  },
  {
    id: "sagittarius",
    buttonText: "♐ القوس",
    nameAr: "برج القوس",
    symbol: "♐",
    dateRange: "22 نوفمبر - 21 ديسمبر",
    element: "ناري 🔥",
    planet: "المشتري",
    traits: ["تفاؤل وحب السفر", "صراحة وعفوية", "عقل منفتح", "روح مغامرة"],
    compatibleWith: "الحمل، الأسد، الدلو",
    funNote: "يعشق الحرية والاكتشاف، ويحمل طاقة تفاؤل معدية لمن حوله.",
  },
  {
    id: "capricorn",
    buttonText: "♑ الجدي",
    nameAr: "برج الجدي",
    symbol: "♑",
    dateRange: "22 ديسمبر - 19 يناير",
    element: "ترابي 🌿",
    planet: "زحل",
    traits: ["انضباط وطموح", "تحمل المسؤولية", "حكمة وهدوء", "إصرار على القمة"],
    compatibleWith: "الثور، العذراء، الحوت",
    funNote: "يبني نجاحه بصبر وذكاء، ويفضل الأفعال على الكلام.",
  },
  {
    id: "aquarius",
    buttonText: "♒ الدلو",
    nameAr: "برج الدلو",
    symbol: "♒",
    dateRange: "20 يناير - 18 فبراير",
    element: "هوائي 💨",
    planet: "أورانوس",
    traits: ["تفكير إبداعي ومبتكر", "استقلالية", "إنسانية ولطف", "نظرة مستقبلية"],
    compatibleWith: "الجوزاء، الميزان، القوس",
    funNote: "صاحب أفكار سابقة لعصرها ولا يحب القيود التقليدية.",
  },
  {
    id: "pisces",
    buttonText: "♓ الحوت",
    nameAr: "برج الحوت",
    symbol: "♓",
    dateRange: "19 فبراير - 20 مارس",
    element: "مائي 💧",
    planet: "نبتون",
    traits: ["خيال واسع وإبداع", "تعاطف ورقة", "حس فني", "قلب متسامح"],
    compatibleWith: "السرطان، العقرب، الجدي",
    funNote: "فنان بطبعه، يحول المشاعر والأحلام إلى لمسات جميلة في الواقع.",
  },
];

export function getZodiacByDate(day: number, month: number): ZodiacSignInfo {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  return ZODIAC_SIGNS[11];
}
