import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Brain, Shield, User, Ghost, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft, Layers, Fingerprint, Globe, Map, Lock, Zap, Eye, Compass, Anchor, Feather } from 'lucide-react';

const App = () => {
  const [lang, setLang] = useState('fa'); // 'fa', 'en', 'fr'
  const [mode, setMode] = useState(null); // null, 'short' (6), 'medium' (12), 'long' (18)
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [animate, setAnimate] = useState(true);
  const scrollRef = useRef(null);

  const uiText = {
    fa: {
      welcomeTitle: "هزارتوی ذهن",
      welcomeSubtitle: "سفری به اعماق ناخودآگاه؛ جایی که داستان زندگی تو نوشته شده است.",
      startBtn: "آغاز سفر",
      choosePath: "دروازه ورودی را انتخاب کن",
      pathShort: "مسیر سایه (۶ مرحله)",
      pathShortDesc: "کوتاه و مرموز | کشف کهن‌الگو و طرحواره اصلی",
      pathMedium: "مسیر آینه (۱۲ مرحله)",
      pathMediumDesc: "متعادل | واکاوی لایه‌های پنهان شخصیت",
      pathLong: "مسیر عمیق (۱۸ مرحله)",
      pathLongDesc: "سفر قهرمانی | تحلیل کامل ۱۸ تله زندگی",
      next: "ادامه مسیر",
      resultTitle: "نقشه روح شما",
      restart: "بازگشت به دروازه",
      dominantTrap: "تله‌های اصلی (طرحواره‌ها)",
      yourArchetype: "کهن‌الگوی شما",
      prescription: "نسخه خروج از هزارتو"
    },
    en: {
      welcomeTitle: "Labyrinth of the Mind",
      welcomeSubtitle: "A journey into the subconscious to decode your life's story.",
      startBtn: "Start Journey",
      choosePath: "Choose Your Gate",
      pathShort: "Shadow Path (6 Stages)",
      pathShortDesc: "Short | Core Archetype & Schema",
      pathMedium: "Mirror Path (12 Stages)",
      pathMediumDesc: "Balanced | Hidden Personality Layers",
      pathLong: "Hero's Path (18 Stages)",
      pathLongDesc: "Complete | All 18 Life Traps Analyzed",
      next: "Continue",
      resultTitle: "Soul Map",
      restart: "Return to Gate",
      dominantTrap: "Dominant Traps",
      yourArchetype: "Your Archetype",
      prescription: "Guidance"
    },
    fr: {
      welcomeTitle: "Le Labyrinthe",
      welcomeSubtitle: "Un voyage dans le subconscient.",
      startBtn: "Commencer",
      choosePath: "Choisissez votre porte",
      pathShort: "Chemin de l'Ombre",
      pathShortDesc: "Court | Archétype & Schéma",
      pathMedium: "Chemin des Miroirs",
      pathMediumDesc: "Équilibré | Couches Cachées",
      pathLong: "Chemin du Héros",
      pathLongDesc: "Complet | 18 Pièges de Vie",
      next: "Continuer",
      resultTitle: "Carte de l'Âme",
      restart: "Retour",
      dominantTrap: "Pièges Dominants",
      yourArchetype: "Votre Archétype",
      prescription: "Conseils"
    }
  };

  // --- بانک سوالات سناریویی ---
  const getQuestions = (language) => {
    // داده‌های فارسی کامل و سناریویی
    const faData = {
      // سوالات عمومی برای حالت کوتاه و متوسط
      general: [
        { 
          id: "s_disconnect", 
          title: "فصل ۱: ریشه‌های امنیت", 
          flavor: "در کودکی، خانه پناهگاه است یا میدان جنگ؟",
          text: "تصور کن کودکی هستی که در تاریکی شب بیدار می‌شوی. سکوت خانه سنگین است. اولین حسی که به سراغت می‌آید چیست؟", 
          options: [
            {t:"کسی نیست که مرا آرام کند، همیشه تنهایم.", v:"رهاشدگی"}, 
            {t:"حتماً اتفاق بدی افتاده یا کسی می‌خواهد به من آسیب بزند.", v:"بی‌اعتمادی"}, 
            {t:"گریه می‌کنم اما کسی صدایم را نمی‌شنود.", v:"محرومیت هیجانی"}, 
            {t:"تقصیر من است که تنها مانده‌ام، من بدم.", v:"نقص/شرم"}
          ] 
        },
        { 
          id: "s_autonomy", 
          title: "فصل ۲: طوفان استقلال", 
          flavor: "برای ایستادن روی پای خودت، چقدر می‌لرزی؟",
          text: "به تو پیشنهاد شده که فرماندهی یک کشتی در دریای طوفانی را به عهده بگیری. واکنش غریزی‌ات چیست؟", 
          options: [
            {t:"بدون نقشه و راهنما غرق می‌شوم، نمی‌توانم.", v:"وابستگی"}, 
            {t:"حتماً صاعقه می‌زند و کشتی می‌شکند.", v:"آسیب‌پذیری"}, 
            {t:"من از پس هیچ کاری برنمی‌آیم، شکست حتمی است.", v:"شکست"}, 
            {t:"باید اول از مادرم/همسرم بپرسم اجازه می‌دهند؟", v:"گرفتار"}
          ] 
        },
        { 
          id: "s_limits", 
          title: "فصل ۳: مرزهای ممنوعه", 
          flavor: "قوانین برای همه است، یا تو استثنایی؟",
          text: "در صفی طولانی ایستاده‌ای و دری مخفی باز می‌شود که مخصوص افراد خاص است. چه می‌کنی؟", 
          options: [
            {t:"من خاصم، چرا باید منتظر بمانم؟ رد می‌شوم.", v:"استحقاق"}, 
            {t:"طاقت انتظار ندارم، اعصابم خرد می‌شود.", v:"خویشتن‌داری ناکافی"}, 
            {t:"مثل بقیه صبر می‌کنم، حق کسی را ضایع نمی‌کنم.", v:"سالم"}
          ] 
        },
        { 
          id: "s_other", 
          title: "فصل ۴: نقاب‌ها", 
          flavor: "چقدر از خودت را برای دیگران قربانی می‌کنی؟",
          text: "در یک مهمانی نقاب‌دار، همه نگاه‌ها به توست. برای اینکه پذیرفته شوی، چه نقشی بازی می‌کنی؟", 
          options: [
            {t:"هر چه آن‌ها بخواهند می‌شوم تا دعوا نشود.", v:"اطاعت"}, 
            {t:"به نیازهای خودم فکر نمی‌کنم، فقط به آن‌ها خدمت می‌کنم.", v:"ایثار"}, 
            {t:"نقشی بازی می‌کنم که همه برایم کف بزنند.", v:"پذیرش‌جویی"}
          ] 
        },
        { 
          id: "s_vigilance", 
          title: "فصل ۵: قاضی درون", 
          flavor: "آیا آرامش، آرامش قبل از طوفان است؟",
          text: "یک روز عالی و بدون نقص داشته‌ای. وقتی شب به رختخواب می‌روی، ذهنت چه می‌گوید؟", 
          options: [
            {t:"این خوشی دوام ندارد، فردا اتفاق بدی می‌افتد.", v:"منفی‌گرایی"}, 
            {t:"نباید ذوق‌زده شوم، باید کنترل خودم را حفظ کنم.", v:"بازداری"}, 
            {t:"هنوز کارهای نکرده زیادی دارم، کافی نبود.", v:"معیارهای سرسخت"}, 
            {t:"اگر اشتباهی کرده باشم، تنبیه می‌شوم.", v:"تنبیه"}
          ] 
        },
        { 
          id: "jung", 
          title: "تالار آینه‌ها: کهن‌الگو", 
          flavor: "چه نیرویی در رگ‌های روحت جریان دارد؟",
          text: "شمشیری در سنگ، کتابی جادویی، جامی زرین و عصای سلطنتی روبروی توست. کدام را برمی‌داری؟", 
          options: [
            {t:"شمشیر (برای جنگیدن و پیروزی)", v:"Warrior"}, 
            {t:"کتاب (برای دانستن رازها)", v:"Magician"}, 
            {t:"جام (برای عشق ورزیدن و پیوند)", v:"Lover"}, 
            {t:"عصا (برای نظم دادن و حکومت)", v:"Ruler"}
          ] 
        }
      ],
      // سوالات اختصاصی و دقیق برای حالت طولانی (۱۸ طرحواره)
      long_schemas: [
        { id: "sch_1", title: "ایستگاه متروک", flavor: "طرحواره رهاشدگی", text: "عزیزترین فرد زندگی‌ات کمی دیر کرده و تلفنش را جواب نمی‌دهد. اولین فکری که مثل صاعقه به ذهنت می‌زند؟", options: [{t:"حتماً مرا ترک کرده و رفته است.", v:"رهاشدگی"}, {t:"شاید ترافیک است (نگران نمی‌شوم).", v:"سالم"}] },
        { id: "sch_2", title: "قلعه شیشه‌ای", flavor: "طرحواره بی‌اعتمادی", text: "یک همکار جدید خیلی به تو محبت می‌کند و رازهایش را می‌گوید. حس تو چیست؟", options: [{t:"حتماً نقشه‌ای دارد و می‌خواهد از من سوءاستفاده کند.", v:"بی‌اعتمادی"}, {t:"چه آدم خونگرمی است.", v:"سالم"}] },
        { id: "sch_3", title: "جعبه خالی", flavor: "طرحواره محرومیت هیجانی", text: "وقتی به محبت نیاز داری، چه اتفاقی می‌افتد؟", options: [{t:"هیچکس واقعاً مرا درک نمی‌کند و نیازهایم را نمی‌بیند.", v:"محرومیت هیجانی"}, {t:"از دوستانم کمک می‌گیرم.", v:"سالم"}] },
        { id: "sch_4", title: "اتاق پرو", flavor: "طرحواره نقص و شرم", text: "کسی از تو انتقاد کوچکی می‌کند. در درونت چه می‌گذرد؟", options: [{t:"آب می‌شوم، انگار همه فهمیدند چقدر بی‌ارزشم.", v:"نقص/شرم"}, {t:"اشکالی ندارد، همه اشتباه می‌کنند.", v:"سالم"}] },
        { id: "sch_5", title: "سیاره بیگانه", flavor: "طرحواره انزوای اجتماعی", text: "در جمعی جدید هستی. چه حسی نسبت به خودت و دیگران داری؟", options: [{t:"من با همه فرق دارم و به هیچ گروهی تعلق ندارم.", v:"انزوای اجتماعی"}, {t:"سعی می‌کنم ارتباط برقرار کنم.", v:"سالم"}] },
        { id: "sch_6", title: "جنگل مه آلود", flavor: "طرحواره وابستگی", text: "باید تصمیم مهمی بگیری (مثل خرید خانه یا تغییر شغل).", options: [{t:"بدون تایید دیگران فلج می‌شوم، نمی‌توانم تصمیم بگیرم.", v:"وابستگی"}, {t:"تحقیق می‌کنم و تصمیم می‌گیرم.", v:"سالم"}] },
        { id: "sch_7", title: "سنگر شنی", flavor: "طرحواره آسیب‌پذیری", text: "وقتی اخبار بد یا بیماری می‌شنوی...", options: [{t:"حس می‌کنم نفر بعدی من هستم، فاجعه نزدیک است.", v:"آسیب‌پذیری"}, {t:"احتیاط می‌کنم اما نمی‌ترسم.", v:"سالم"}] },
        { id: "sch_8", title: "ریشه‌های گره‌خورده", flavor: "طرحواره گرفتار/درهم‌تنیده", text: "آیا می‌توانی رازی داشته باشی که والدین یا همسرت ندانند؟", options: [{t:"نه، انگار به آنها خیانت کرده‌ام، ما یکی هستیم.", v:"گرفتار"}, {t:"بله، حریم شخصی دارم.", v:"سالم"}] },
        { id: "sch_9", title: "مسابقه نابرابر", flavor: "طرحواره شکست", text: "وقتی خودت را با هم‌سن و سالانت مقایسه می‌کنی...", options: [{t:"من از همه عقب‌ترم و هیچوقت به آنها نمی‌رسم.", v:"شکست"}, {t:"هرکس مسیر خودش را دارد.", v:"سالم"}] },
        { id: "sch_10", title: "تاج طلایی", flavor: "طرحواره استحقاق", text: "قانون می‌گوید باید در صف بایستی یا مدارک را کامل کنی.", options: [{t:"این قوانین مسخره برای آدم‌های معمولی است، نه من.", v:"استحقاق"}, {t:"رعایت می‌کنم.", v:"سالم"}] },
        { id: "sch_11", title: "اسب سرکش", flavor: "طرحواره خویشتن‌داری ناکافی", text: "کاری کسل‌کننده اما ضروری داری. چقدر دوام می‌آوری؟", options: [{t:"اصلاً نمی‌توانم، سریع رها می‌کنم و سراغ تفریح می‌روم.", v:"خویشتن‌داری ناکافی"}, {t:"انجامش می‌دهم تا تمام شود.", v:"سالم"}] },
        { id: "sch_12", title: "عروسک خیمه‌شب‌بازی", flavor: "طرحواره اطاعت", text: "دیگران برایت تصمیم می‌گیرند. واکنش تو؟", options: [{t:"قبول می‌کنم چون می‌ترسم عصبانی شوند یا طردم کنند.", v:"اطاعت"}, {t:"نظرم را مودبانه می‌گویم.", v:"سالم"}] },
        { id: "sch_13", title: "شمع سوزان", flavor: "طرحواره ایثار", text: "دوستت مشکل دارد و تو خودت هم گرفتاری.", options: [{t:"مشکل خودم را رها می‌کنم تا به او برسم (همیشه همینم).", v:"ایثار"}, {t:"اگر بتوانم کمک می‌کنم.", v:"سالم"}] },
        { id: "sch_14", title: "صحنه نمایش", flavor: "طرحواره پذیرش‌جویی", text: "لباس یا ماشینی خریده‌ای. چقدر نظر دیگران مهم است؟", options: [{t:"اگر تعریف نکنند، انگار هیچ ارزشی ندارد.", v:"پذیرش‌جویی"}, {t:"مهم این است که خودم دوستش دارم.", v:"سالم"}] },
        { id: "sch_15", title: "عینک دودی", flavor: "طرحواره منفی‌گرایی", text: "زندگی‌ات خوب پیش می‌رود...", options: [{t:"حتماً یک جای کار می‌لنگد، نباید خوش‌بین بود.", v:"منفی‌گرایی"}, {t:"از لحظه لذت می‌برم.", v:"سالم"}] },
        { id: "sch_16", title: "سد سنگی", flavor: "طرحواره بازداری هیجانی", text: "چقدر احساساتت (خشم، عشق، گریه) را نشان می‌دهی؟", options: [{t:"تقریباً هیچوقت، باید همیشه منطقی و سنگی باشم.", v:"بازداری"}, {t:"احساساتم را بروز می‌دهم.", v:"سالم"}] },
        { id: "sch_17", title: "قله بی‌پایان", flavor: "طرحواره معیارهای سرسخت", text: "نمره ۱۹.۵ گرفتی یا پروژه‌ات ۹۹٪ عالی بود.", options: [{t:"افتضاح است، باید ۲۰ یا ۱۰۰٪ باشد.", v:"معیارهای سرسخت"}, {t:"تلاش خوبی بود.", v:"سالم"}] },
        { id: "sch_18", title: "چکش قاضی", flavor: "طرحواره تنبیه", text: "اشتباهی کردی. با خودت چه می‌کنی؟", options: [{t:"خودم را نمی‌بخشم، باید تاوان پس بدهم.", v:"تنبیه"}, {t:"از آن درس می‌گیرم.", v:"سالم"}] }
      ],
      extras: [
        { id: "cbt", title: "گرداب فکر", flavor: "وقتی غمگینی، ذهنت چطور فریبت می‌دهد؟", text: "در یک موقعیت منفی، ذهنت چه بافتی می‌زند؟", options: [{t:"یا همه چیز عالیست یا افتضاح (سفید و سیاه).", v:"تفکر دوقطبی"}, {t:"یک مشکل کوچک یعنی پایان دنیا (فاجعه).", v:"فاجعه‌سازی"}, {t:"همه‌چیز تقصیر من است.", v:"شخصی‌سازی"}] },
        { id: "ta", title: "ملاقات با خود", flavor: "کدام صدا در سرت بلندتر فریاد می‌زند؟", text: "وقتی خرابکاری می‌کنی...", options: [{t:"سرزنشگر: «تو احمقی!»", v:"والد انتقادگر"}, {t:"مظلوم: «من می‌ترسم...»", v:"کودک آسیب‌پذیر"}, {t:"تحلیلگر: «بیا درستش کنیم.»", v:"بالغ"}] },
      ]
    };

    // For English/French, keeping it simplified for code brevity, focusing on structure mainly
    // In a real app, full translation would go here.
    return language === 'fa' ? faData : faData; 
  };

  const generateStages = (selectedMode, langCode) => {
    const data = getQuestions(langCode);
    
    if (selectedMode === 'short') {
      return [...data.general];
    }
    
    if (selectedMode === 'medium') {
      return [
        data.general[5], // Jung
        ...data.general.slice(0, 5), // General Schemas
        data.extras[0], // CBT
        data.extras[1], // TA
        { id: "mbti_simple", title: "قطب‌نما", flavor: "جهت‌گیری انرژی تو کجاست؟", text: "بیشتر از کجا انرژی می‌گیری؟", options: [{t:"از بودن در جمع و شلوغی", v:"E"}, {t:"از خلوت و دنیای درون", v:"I"}] }
      ];
    }

    if (selectedMode === 'long') {
      return [
        ...data.long_schemas,
        data.general[5] // Jung at the end
      ];
    }
    return [];
  };

  const activeStages = generateStages(mode, lang);
  const currentUIText = uiText[lang];
  const isRTL = lang === 'fa';

  const handleSelect = (option) => {
    setAnimate(false);
    setTimeout(() => {
      setAnswers({ ...answers, [activeStages[currentStage].id]: option });
      if (currentStage < activeStages.length - 1) {
        setCurrentStage(currentStage + 1);
        setAnimate(true);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      } else {
        setShowResult(true);
      }
    }, 500); // Slightly longer delay for dramatic effect
  };

  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setGameStarted(true);
    setCurrentStage(0);
    setAnswers({});
    setShowResult(false);
    setAnimate(true);
  };

  const restart = () => {
    setGameStarted(false);
    setMode(null);
    setAnswers({});
    setShowResult(false);
  };

  const LangSwitcher = () => (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      {['fa', 'en', 'fr'].map((l) => (
        <button 
          key={l}
          onClick={() => { setLang(l); if(gameStarted) restart(); }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border backdrop-blur-sm ${
            lang === l 
            ? 'bg-white/90 text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl animate-fade-in px-4 relative z-10">
      {/* Hero Icon */}
      <div className="mb-10 relative group">
        <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full animate-pulse-slow group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="relative p-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-500">
           <Fingerprint className="w-20 h-20 text-blue-200 opacity-90" strokeWidth={0.8} />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-100 via-blue-200 to-gray-500 mb-6 text-center tracking-tighter drop-shadow-sm">
        {currentUIText.welcomeTitle}
      </h1>
      <p className="text-blue-200/70 text-lg md:text-2xl text-center max-w-2xl mb-16 font-light leading-relaxed tracking-wide">
        {currentUIText.welcomeSubtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button 
          onClick={() => startGame('short')}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 hover:from-blue-900/40 hover:to-black border border-white/10 hover:border-blue-400/50 p-8 rounded-3xl transition-all duration-500 text-center flex flex-col items-center shadow-lg hover:shadow-blue-500/20"
        >
          <Zap className="w-10 h-10 text-blue-400 mb-6 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500" strokeWidth={1} />
          <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-blue-200 transition-colors">{currentUIText.pathShort}</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 font-light leading-relaxed">{currentUIText.pathShortDesc}</p>
        </button>

        <button 
          onClick={() => startGame('medium')}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 hover:from-purple-900/40 hover:to-black border border-white/10 hover:border-purple-400/50 p-8 rounded-3xl transition-all duration-500 text-center flex flex-col items-center shadow-lg hover:shadow-purple-500/20 transform md:-translate-y-6 z-10"
        >
          <Eye className="w-10 h-10 text-purple-400 mb-6 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500" strokeWidth={1} />
          <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-purple-200 transition-colors">{currentUIText.pathMedium}</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 font-light leading-relaxed">{currentUIText.pathMediumDesc}</p>
        </button>

        <button 
          onClick={() => startGame('long')}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 hover:from-red-900/40 hover:to-black border border-white/10 hover:border-red-400/50 p-8 rounded-3xl transition-all duration-500 text-center flex flex-col items-center shadow-lg hover:shadow-red-500/20"
        >
          <Compass className="w-10 h-10 text-red-400 mb-6 group-hover:scale-110 group-hover:text-red-300 transition-all duration-500" strokeWidth={1} />
          <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-red-200 transition-colors">{currentUIText.pathLong}</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 font-light leading-relaxed">{currentUIText.pathLongDesc}</p>
        </button>
      </div>
    </div>
  );

  const renderStage = () => {
    const stage = activeStages[currentStage];
    return (
      <div className={`w-full max-w-3xl transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 blur-sm'}`} ref={scrollRef}>
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={restart} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${!isRTL && 'rotate-180'}`} />
            {currentUIText.restart}
          </button>
          <div className="flex flex-col items-end">
             <span className="text-xs font-mono text-gray-500 mb-1">
                {currentStage + 1} / {activeStages.length}
             </span>
             <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${((currentStage + 1) / activeStages.length) * 100}%` }}
                />
             </div>
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden min-h-[450px] flex flex-col justify-center items-center text-center group">
          {/* Decorative background gradients */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="mb-10 relative z-10 w-full max-w-2xl">
            {stage.flavor && (
              <div className="flex justify-center items-center gap-2 mb-4 animate-fade-in">
                <Feather className="w-4 h-4 text-gray-500 opacity-70" />
                <span className="text-sm md:text-base font-serif italic text-gray-400 tracking-wide text-opacity-80">
                  {stage.flavor}
                </span>
                <Feather className="w-4 h-4 text-gray-500 opacity-70 transform scale-x-[-1]" />
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-6 drop-shadow-2xl leading-tight">
              {stage.title}
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-8 opacity-50"></div>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-loose">
              {stage.text}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full max-w-lg relative z-10">
            {stage.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="relative overflow-hidden w-full p-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/30 rounded-2xl transition-all duration-300 group-btn text-gray-300 hover:text-white hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] text-sm md:text-base"
              >
                <div className="flex items-center justify-between">
                    <span className="relative z-10 font-medium text-right w-full">{opt.t}</span>
                    <ArrowRight className={`w-4 h-4 text-gray-500 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 absolute ${isRTL ? 'left-4' : 'right-4'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const archetypes = Object.values(answers).filter(a => ['Warrior','Magician','Lover','Caregiver','Ruler'].includes(a.v));
    const mainArchetype = archetypes.length > 0 ? archetypes[0].v : "Seeker";
    
    const traps = Object.values(answers).filter(a => 
        a.v && 
        !['Warrior','Magician','Lover','Caregiver','Ruler', 'سالم', 'Healthy', 'E', 'I', 'Moderate', 'Low', 'Adult', 'High', 'بالغ'].includes(a.v)
    );
    const uniqueTraps = [...new Set(traps.map(t => t.v))];

    return (
      <div className="w-full max-w-4xl animate-fade-in pb-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 animate-pulse-slow">
            <Sparkles className="w-12 h-12 text-yellow-400" strokeWidth={1} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 mb-4">
            {currentUIText.resultTitle}
          </h2>
          <p className="text-gray-400 text-lg">آنچه ناخودآگاه تو فاش کرد</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#0f0f11] border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <User className="w-40 h-40" />
            </div>
            <div className="relative z-10">
                <h3 className="text-yellow-500/80 text-xs font-bold uppercase tracking-[0.2em] mb-4">{currentUIText.yourArchetype}</h3>
                <div className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{mainArchetype}</div>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed border-l-2 border-yellow-500/20 pl-4">
                  {lang === 'fa' ? 
                  "این کهن‌الگو، موتور محرک روان شماست. در داستان زندگی، شما نقش کسی را بازی می‌کنید که با این انرژی بر مشکلات غلبه می‌کند." : 
                  "This is your driving psychic energy."}
                </p>
            </div>
          </div>

          <div className="bg-[#0f0f11] border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-red-500/30 transition-colors duration-500">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Brain className="w-40 h-40" />
            </div>
            <div className="relative z-10">
                <h3 className="text-red-500/80 text-xs font-bold uppercase tracking-[0.2em] mb-4">{currentUIText.dominantTrap}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {uniqueTraps.length > 0 ? uniqueTraps.slice(0, 6).map((trap, i) => (
                    <span key={i} className="px-4 py-2 bg-red-500/10 text-red-300 rounded-lg text-sm font-medium border border-red-500/10">
                       {trap}
                    </span>
                  )) : <span className="text-gray-500 italic">طرحواره خاصی فعال نشد (وضعیت سالم)</span>}
                </div>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed border-l-2 border-red-500/20 pl-4">
                    {lang === 'fa' ? 
                    "این‌ها لنزهایی هستند که گاهی واقعیت را برای شما تحریف می‌کنند. شناختن آن‌ها، قدرت آن‌ها را می‌شکند." :
                    "These schemas distort your reality."}
                </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden text-center">
            <Anchor className="w-32 h-32 text-white opacity-[0.03] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <h4 className="text-xl font-bold text-white mb-4 relative z-10">{currentUIText.prescription}</h4>
            <p className="text-gray-400 leading-8 relative z-10 max-w-2xl mx-auto">
              {lang === 'fa' ? 
               `شما قهرمانی با انرژی "${mainArchetype}" هستید. چالش اصلی شما در حال حاضر عبور از دیوارهای نامرئی "${uniqueTraps[0] || 'ناشناخته'}" است. آگاهی، کلید رهایی است. هر بار که حس کردید این الگو تکرار می‌شود، مکث کنید و خلاف آن عمل کنید.` :
               `You are a hero with ${mainArchetype} energy. Your challenge is overcoming ${uniqueTraps[0] || 'Unknown'}.`}
            </p>
            <button 
                onClick={restart}
                className="mt-8 relative z-10 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
            >
                <RefreshCw className="w-4 h-4" />
                {currentUIText.restart}
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-500/30 overflow-hidden relative`} dir={isRTL ? "rtl" : "ltr"}>
      <LangSwitcher />
      
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1),_rgba(5,5,5,1))]" />
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full flex justify-center py-10">
        {!gameStarted ? renderLanding() : (!showResult ? renderStage() : renderResult())}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

export default App;