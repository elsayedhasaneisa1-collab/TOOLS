export interface FrameStyle {
  id: string;
  left: string;
  right: string;
  joiner?: string;
}

export const ARABIC_FRAMES: FrameStyle[] = [
  { id: "ar_1", left: "꧁༺ ", right: " ༻꧂" },
  { id: "ar_2", left: "★彡 ", right: " 彡★" },
  { id: "ar_3", left: "『 ", right: " 』" },
  { id: "ar_4", left: "【 ", right: " 】" },
  { id: "ar_5", left: "♛ ", right: " ♛" },
  { id: "ar_6", left: "❖ ──『 ", right: " 』── ❖" },
  { id: "ar_7", left: "🤍✨ ", right: " ✨🤍" },
  { id: "ar_8", left: "💜⚡ ", right: " ⚡💜" },
  { id: "ar_9", left: "🖤┆ ", right: " ┆🖤" },
  { id: "ar_10", left: "•°• ", right: " •°•" },
  { id: "ar_11", left: "꧁ ", right: " ꧂" },
  { id: "ar_12", left: "⫷ ", right: " ⫸" },
  { id: "ar_13", left: "「 ", right: " 」" },
  { id: "ar_14", left: "✦•┈๑⋅⋯ ", right: " ⋯⋅๑┈•✦" },
  { id: "ar_15", left: "✿ ── ", right: " ── ✿" },
  { id: "ar_16", left: "༺☆༻ ", right: " ༺☆༻" },
  { id: "ar_17", left: "╰☆☆ ", right: " ☆☆╮" },
  { id: "ar_18", left: "◈ ━━ ", right: " ━━ ◈" },
  { id: "ar_19", left: "⋆｡°✩ ", right: " ✩°｡⋆" },
  { id: "ar_20", left: "╭─▸ ", right: " ◂─╮" },
  { id: "ar_21", left: "✧･ﾟ: *✧･ﾟ:* ", right: " *:･ﾟ✧*:･ﾟ✧" },
  { id: "ar_22", left: "𓆩 ", right: " 𓆪" },
  { id: "ar_23", left: "𓍯 ", right: " 𓍯" },
  { id: "ar_24", left: "⪻ ", right: " ⪼" },
  { id: "ar_25", left: "✧˖° ", right: " °˖✧" },
  { id: "ar_26", left: "ꔛ ", right: " ꔛ" },
  { id: "ar_27", left: "⋆☾ ", right: " ☽⋆" },
  { id: "ar_28", left: "♛┆ ", right: " ┆♛" },
  { id: "ar_29", left: "༺♥༻ ", right: " ༺♥༻" },
  { id: "ar_30", left: "❥ ", right: " ❥" },
  { id: "ar_31", left: "༺⚡༻ ", right: " ༺⚡༻" },
  { id: "ar_32", left: "۞ ", right: " ۞" },
  { id: "ar_33", left: "⟣ ", right: " ⟢" },
  { id: "ar_34", left: "𖤍 ", right: " 𖤍" },
  { id: "ar_35", left: "⋆˚࿔ ", right: " 𝜗𝜚˚⋆" },
  { id: "ar_36", left: "╰┈➤ ", right: " 🤍" },
];

export const SENTENCE_FRAMES: Array<{ id: string; prefix: string; suffix: string; linePrefix?: string }> = [
  { id: "s1", prefix: "╔═══ ❖ •ೋ° °ೋ• ❖ ═══╗\n  ", suffix: "\n╚═══ ❖ •ೋ° °ೋ• ❖ ═══╝" },
  { id: "s2", prefix: "╭────── 🤍 ──────╮\n", suffix: "\n╰────── 🤍 ──────╯", linePrefix: "  " },
  { id: "s3", prefix: "✦•┈┈┈┈┈┈┈┈┈┈┈┈•✦\n✨ ", suffix: "\n✦•┈┈┈┈┈┈┈┈┈┈┈┈•✦" },
  { id: "s4", prefix: "┏━━━━ 💜 ━━━━┓\n ", suffix: "\n┗━━━━ 💜 ━━━━┛" },
  { id: "s5", prefix: "꧁༺ ✨ ༻꧂\n", suffix: "\n꧁༺ ✨ ༻꧂" },
  { id: "s6", prefix: "『 ♛ 』 ", suffix: " 『 ♛ 』" },
  { id: "s7", prefix: "⋆｡°✩ ", suffix: " ✩°｡⋆" },
  { id: "s8", prefix: "༺🖤༻\n", suffix: "\n༺🖤༻" },
  { id: "s9", prefix: "◈ ━━━━━━━━━━━━ ◈\n", suffix: "\n◈ ━━━━━━━━━━━━ ◈" },
  { id: "s10", prefix: "✿ ⋯⋯⋯⋯⋯⋯⋯⋯ ✿\n", suffix: "\n✿ ⋯⋯⋯⋯⋯⋯⋯⋯ ✿" },
  { id: "s11", prefix: "╰─▸ ", suffix: " ◂─╯" },
  { id: "s12", prefix: "⫷ ✦ ", suffix: " ✦ ⫸" },
  { id: "s13", prefix: "╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮\n", suffix: "\n╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯" },
  { id: "s14", prefix: "★━━━━━━━━━━━━━━━━★\n", suffix: "\n★━━━━━━━━━━━━━━━━★" },
  { id: "s15", prefix: "𓍯 ", suffix: " 𓍯" },
  { id: "s16", prefix: "【 ✨ ", suffix: " ✨ 】" },
  { id: "s17", prefix: "┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈\n", suffix: "\n┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈" },
  { id: "s18", prefix: "☾⋆｡𖦹 °✩ ", suffix: " ✩° 𖦹｡⋆☽" },
  { id: "s19", prefix: "𓆩 💜 𓆪\n", suffix: "\n𓆩 💜 𓆪" },
  { id: "s20", prefix: "⟣ ── ", suffix: " ── ⟢" },
  { id: "s21", prefix: "❖┆ ", suffix: " ┆❖" },
  { id: "s22", prefix: "❥• ", suffix: " •❥" },
  { id: "s23", prefix: "✧˖° ", suffix: " °˖✧" },
  { id: "s24", prefix: "۞ ", suffix: " ۞" },
  { id: "s25", prefix: "╭─────•◈•─────╮\n", suffix: "\n╰─────•◈•─────╯" },
];

export const ENGLISH_FONT_MAPS: Array<{
  name: string;
  upper: string[];
  lower: string[];
  digits?: string[];
  prefix?: string;
  suffix?: string;
}> = [
  {
    name: "Bold Serif",
    upper: [..."𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙"],
    lower: [..."𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳"],
    digits: [..."𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"],
  },
  {
    name: "Italic Serif",
    upper: [..."𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍"],
    lower: [..."𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"],
  },
  {
    name: "Bold Italic",
    upper: [..."𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁"],
    lower: [..."𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛"],
  },
  {
    name: "Script",
    upper: [..."𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"],
    lower: [..."𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏"],
  },
  {
    name: "Bold Script",
    upper: [..."𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"],
    lower: [..."𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"],
  },
  {
    name: "Fraktur",
    upper: [..."𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"],
    lower: [..."𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"],
  },
  {
    name: "Bold Fraktur",
    upper: [..."𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"],
    lower: [..."𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"],
  },
  {
    name: "Double-Struck",
    upper: [..."𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ"],
    lower: [..."𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"],
    digits: [..."𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"],
  },
  {
    name: "Sans Bold",
    upper: [..."𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"],
    lower: [..."𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"],
    digits: [..."𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"],
  },
  {
    name: "Sans Italic",
    upper: [..."𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"],
    lower: [..."𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"],
  },
  {
    name: "Sans Bold Italic",
    upper: [..."𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕"],
    lower: [..."𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯"],
  },
  {
    name: "Monospace",
    upper: [..."𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉"],
    lower: [..."𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"],
    digits: [..."𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"],
  },
  {
    name: "Fullwidth",
    upper: [..."ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"],
    lower: [..."ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"],
    digits: [..."０１２３４５６７８９"],
  },
  {
    name: "Circled",
    upper: [..."ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"],
    lower: [..."ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"],
    digits: [..."⓪①②③④⑤⑥⑦⑧⑨"],
  },
  {
    name: "Negative Circled",
    upper: [..."🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"],
    lower: [..."🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"],
    digits: [..."⓿❶❷❸❹❺❻❼❽❾"],
  },
  {
    name: "Squared",
    upper: [..."🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"],
    lower: [..."🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"],
  },
  {
    name: "Negative Squared",
    upper: [..."🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"],
    lower: [..."🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"],
  },
  {
    name: "Small Caps",
    upper: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    lower: [..."ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"],
  },
  {
    name: "Parenthesized",
    upper: [..."🄐🄑🄒🄓🄔🄕🄖🄗🄘🄙🄚🄛🄜🄝🄞🄟🄠🄡🄢🄣🄤🄥🄦🄧🄨🄩"],
    lower: [..."⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵"],
  },
  {
    name: "Superscript",
    upper: [..."ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ"],
    lower: [..."ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ"],
    digits: [..."⁰¹²³⁴⁵⁶⁷⁸⁹"],
  },
];

export const NUMBER_STYLES: Array<{
  name: string;
  digits: string[];
  prefix?: string;
  suffix?: string;
}> = [
  { name: "Math Bold", digits: [..."𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"] },
  { name: "Double-Struck", digits: [..."𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"] },
  { name: "Sans Bold", digits: [..."𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"] },
  { name: "Monospace", digits: [..."𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"] },
  { name: "Fullwidth", digits: [..."０１２３４５６７８９"] },
  { name: "Circled", digits: [..."⓪①②③④⑤⑥⑦⑧⑨"] },
  { name: "Negative Circled", digits: [..."⓿❶❷❸❹❺❻❼❽❾"] },
  { name: "Double Circled", digits: ["0️⃣", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"] },
  { name: "Superscript", digits: [..."⁰¹²³⁴⁵⁶⁷⁸⁹"] },
  { name: "Subscript", digits: [..."₀₁₂₃₄₅₆₇₈₉"] },
  { name: "Arabic-Indic", digits: [..."٠١٢٣٤٥٦٧٨٩"] },
  { name: "Persian", digits: [..."۰۱۲۳۴۵۶۷۸۹"] },
  { name: "Keycaps", digits: ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"] },
  { name: "Royal Framed", digits: [..."𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"], prefix: "♛ ", suffix: " ♛" },
  { name: "Bracketed", digits: [..."𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"], prefix: "『 ", suffix: " 』" },
  { name: "Sparkle Framed", digits: [..."𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"], prefix: "✦ ", suffix: " ✦" },
  { name: "Purple Crown", digits: [..."𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"], prefix: "💜┆ ", suffix: " ┆💜" },
  { name: "Winged", digits: [..."𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"], prefix: "꧁ ", suffix: " ꧂" },
];

export const DECORATION_SYMBOLS_PACK = [
  "❖ ── 『 』 ── ❖",
  "꧁༺  ༻꧂",
  "★彡  彡★",
  "✦•┈๑⋅⋯  ⋯⋅๑┈•✦",
  "╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮",
  "╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯",
  "♛ 🤍 🖤 💜 ⚡ ✨ ✿ ☾ ✩ ❥",
  "◈ ━━━━━━━━━━ ◈",
  "⫷  ⫸   ⪻  ⪼   「  」   【  】",
  "𓆩  𓆪   𓍯   ꔛ   ⋆｡°✩   ✧˖°",
];

export const SAMPLE_ARABIC_NAMES = ["محمد", "أحمد", "فاطمة", "سارة", "عمر", "نور", "يوسف", "ليلى", "ريان", "مريم"];
export const SAMPLE_ENGLISH_NAMES = ["Mohamed", "Sarah", "Alexander", "Luna", "Shadow", "Legend", "Noor", "Zain", "Queen", "Nova"];
export const SAMPLE_NUMBERS = ["2026", "777", "1999", "1001", "2004", "555", "1447", "888"];
export const SAMPLE_SENTENCES = [
  "الأمل يصنع المستحيل",
  "ابتسم فالحياة أجمل مما تتخيل",
  "الهدوء قوة لا يفهمها الجميع",
  "كن جميلاً ترى الوجود جميلاً",
  "الثقة بالنفس أول طريق النجاح",
];
