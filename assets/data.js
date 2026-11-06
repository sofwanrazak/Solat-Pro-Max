/* Solat Pro Max — content.
 * School: Shafi'i (as taught in Malaysia, Brunei, Singapore, Indonesia).
 * Arabic: simplified (imla'i) spelling with full harakat; Quranic recitation follows Hafs 'an 'Asim.
 * Hadith numbers follow the common sunnah.com numbering.
 * Transliteration: ā ī ū long vowels · ḥ = ح · ṣ ḍ ṭ ẓ = heavy letters · ʿ = ع · ' = hamza · dh = ذ · th = ث */
(function (global) {
  'use strict';

  const prayers = [
    { id: 'subuh', name: 'Subuh', alt: 'Fajr', ar: 'الصُّبْحِ', rakaat: 2, jahr: 2, time: 'True dawn until sunrise', before: '2 (muakkad)', after: '—', qunut: true, sky: 'dawn' },
    { id: 'zohor', name: 'Zohor', alt: 'Dhuhr', ar: 'الظُّهْرِ', rakaat: 4, jahr: 0, time: 'Just after midday (sun passes its zenith) until an object’s shadow equals its length plus its midday shadow', before: '2 muakkad + 2', after: '2 muakkad + 2', sky: 'noon' },
    { id: 'asar', name: 'Asar', alt: 'Asr', ar: 'الْعَصْرِ', rakaat: 4, jahr: 0, time: 'From the end of Zohor until sunset (avoid delaying until the sun yellows)', before: '2 or 4', after: '—', sky: 'afternoon' },
    { id: 'maghrib', name: 'Maghrib', alt: 'Maghrib', ar: 'الْمَغْرِبِ', rakaat: 3, jahr: 2, time: 'Sunset until the red twilight disappears', before: '2 (light)', after: '2 muakkad', sky: 'dusk' },
    { id: 'isyak', name: 'Isyak', alt: 'Isha', ar: 'الْعِشَاءِ', rakaat: 4, jahr: 2, time: 'After the red twilight disappears until true dawn (best before midnight)', before: '2', after: '2 muakkad, then Witr', sky: 'night' },
  ];

  const countAr = { 2: 'رَكْعَتَيْنِ', 3: 'ثَلَاثَ رَكَعَاتٍ', 4: 'أَرْبَعَ رَكَعَاتٍ' };
  const countTr = { 2: 'rakʿataini', 3: 'thalātha rakaʿātin', 4: 'arbaʿa rakaʿātin' };
  const nameTr = { subuh: 'farḍaṣ-ṣubḥi', zohor: 'farḍaẓ-ẓuhri', asar: 'farḍal-ʿaṣri', maghrib: 'farḍal-maghribi', isyak: 'farḍal-ʿishā\'i' };
  function niat(p) {
    return {
      ar: 'أُصَلِّي فَرْضَ ' + p.ar + ' ' + countAr[p.rakaat] + ' مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَىٰ',
      tr: 'Uṣallī ' + nameTr[p.id] + ' ' + countTr[p.rakaat] + ' mustaqbilal-qiblati adā\'an lillāhi taʿālā',
      en: 'I pray the obligatory ' + p.name + ', ' + p.rakaat + ' rakaat, facing the qiblah, on time, for Allah the Exalted.',
    };
  }

  // Duas and dhikr. audio: [surah, fromAyah, toAyah] for Quranic text.
  const duas = [
    { id: 'takbir', cat: 'In prayer', title: 'Takbir', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allāhu akbar', en: 'Allah is the Greatest.', src: 'Abu Dawud 61; at-Tirmidhi 3', note: 'Keep “Allāhu” short on the first A. Stretching it to “Āllāhu” turns it into a question. Do not stretch “akbār”: that changes the word.' },
    { id: 'iftitah', cat: 'In prayer', title: 'Doa Iftitah (opening)', ar: 'اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا، وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ وَبِذَٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ', tr: 'Allāhu akbaru kabīrā, wal-ḥamdu lillāhi kathīrā, wa subḥānallāhi bukratan wa aṣīlā. Wajjahtu wajhiya lilladhī faṭaras-samāwāti wal-arḍa ḥanīfan musliman wa mā ana minal-mushrikīn. Inna ṣalātī wa nusukī wa maḥyāya wa mamātī lillāhi rabbil-ʿālamīn. Lā sharīka lahū wa bidhālika umirtu wa ana minal-muslimīn.', en: 'Allah is the Greatest, truly great. Abundant praise belongs to Allah. Glory be to Allah, morning and evening. I turn my face to the One who created the heavens and the earth, inclining to the truth, in submission, and I am not of those who associate partners with Him. My prayer, my worship, my life and my death are for Allah, Lord of all the worlds. He has no partner. This is what I am commanded, and I am of those who submit.', src: 'Muslim 601 (first line); Muslim 771', note: 'Sunnah, recited silently after takbiratul ihram in the first rakaat only.' },
    { id: 'iftitah2', cat: 'In prayer', title: 'Doa Iftitah (short)', ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ', tr: 'Subḥānakallāhumma wa biḥamdik, wa tabārakasmuk, wa taʿālā jadduk, wa lā ilāha ghairuk.', en: 'Glory be to You, O Allah, and praise. Blessed is Your name, exalted is Your majesty, and there is no god but You.', src: 'Abu Dawud 775; at-Tirmidhi 242', note: 'An authentic alternative when time is short.' },
    { id: 'taawwudh', cat: 'In prayer', title: 'Ta’awwudh', ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', tr: 'Aʿūdhu billāhi minash-shaiṭānir-rajīm', en: 'I seek refuge in Allah from Satan, the accursed.', src: 'Quran 16:98', note: 'Sunnah, silently, before Al-Fatihah in every rakaat (most emphasised in the first).' },
    { id: 'amin', cat: 'In prayer', title: 'Amin', ar: 'آمِينَ', tr: 'Āmīn', en: 'O Allah, answer our prayer.', src: 'al-Bukhari 780', note: 'Long Ā, long ī, no shaddah. “Ammīn” (with a doubled m) means “those heading towards”.' },
    { id: 'ruku', cat: 'In prayer', title: 'Tasbih of Ruku’', ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ', tr: 'Subḥāna rabbiyal-ʿaẓīmi wa biḥamdih', en: 'Glory be to my Lord, the Magnificent, and praise be to Him.', src: 'Muslim 772; Abu Dawud 870', count: 3, note: 'ظ in ʿaẓīm is heavy, tongue between the teeth. Saying “ʿazīm” with ز changes the meaning.' },
    { id: 'samiallah', cat: 'In prayer', title: 'Rising from Ruku’', ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', tr: 'Samiʿallāhu liman ḥamidah', en: 'Allah hears the one who praises Him.', src: 'al-Bukhari 789', note: 'Said while rising, hands raised to the shoulders.' },
    { id: 'itidal', cat: 'In prayer', title: 'Standing in I’tidal', ar: 'رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ', tr: 'Rabbanā lakal-ḥamdu mil\'as-samāwāti wa mil\'al-arḍi wa mil\'a mā shi\'ta min shai\'in baʿd', en: 'Our Lord, to You belongs all praise, filling the heavens, filling the earth, and filling whatever else You will.', src: 'Muslim 476', note: 'Said once you are fully upright and still.' },
    { id: 'sujud', cat: 'In prayer', title: 'Tasbih of Sujud', ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ', tr: 'Subḥāna rabbiyal-aʿlā wa biḥamdih', en: 'Glory be to my Lord, the Most High, and praise be to Him.', src: 'Muslim 772; Abu Dawud 870', count: 3, note: 'Sujud is where you are closest to Allah (Muslim 482). Ask Him here, in Arabic.' },
    { id: 'julus', cat: 'In prayer', title: 'Sitting between two Sujud', ar: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي', tr: 'Rabbighfir lī, warḥamnī, wajburnī, warfaʿnī, warzuqnī, wahdinī, wa ʿāfinī, waʿfu ʿannī', en: 'My Lord, forgive me, have mercy on me, mend what is broken in me, raise me, provide for me, guide me, grant me well-being and pardon me.', src: 'Abu Dawud 850; at-Tirmidhi 284; Ibn Majah 898 (combined wording)', note: 'Eight requests in one breath of stillness. Learn their meaning and this sitting stops feeling like a pause.' },
    { id: 'tashahhud', cat: 'In prayer', title: 'Tashahhud', ar: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', tr: 'At-taḥiyyātul-mubārakātuṣ-ṣalawātuṭ-ṭayyibātu lillāh. As-salāmu ʿalaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ʿalainā wa ʿalā ʿibādillāhiṣ-ṣāliḥīn. Ash-hadu an lā ilāha illallāh, wa ash-hadu anna Muḥammadar-rasūlullāh.', en: 'All greetings, blessings, prayers and good things belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah.', src: 'Muslim 403 (Ibn ʿAbbas)', note: 'Raise the right index finger at “illallāh” and keep it raised, without wagging, until salam.' },
    { id: 'salawat-short', cat: 'In prayer', title: 'Selawat (first Tashahhud)', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', tr: 'Allāhumma ṣalli ʿalā Muḥammad', en: 'O Allah, send blessings upon Muhammad.', src: 'Shafi’i: sunnah ab’adh in the first Tashahhud', note: 'In the final Tashahhud this is the minimum that is obligatory. The full Selawat Ibrahimiyyah is better.' },
    { id: 'salawat', cat: 'In prayer', title: 'Selawat Ibrahimiyyah', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ', tr: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallaita ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, wa bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, fil-ʿālamīna innaka ḥamīdun majīd.', en: 'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. And bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Among all the worlds, You are Praiseworthy, Glorious.', src: 'al-Bukhari 3370; Muslim 405', note: 'Many Malaysian texts add “sayyidinā” (our master) before the names. Shafi’i scholars permit it as courtesy.' },
    { id: 'before-salam', cat: 'In prayer', title: 'Doa before Salam', ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ', tr: 'Allāhumma innī aʿūdhu bika min ʿadhābi jahannam, wa min ʿadhābil-qabr, wa min fitnatil-maḥyā wal-mamāt, wa min sharri fitnatil-masīḥid-dajjāl.', en: 'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.', src: 'Muslim 588', note: 'The Prophet ﷺ instructed this after the final Tashahhud.' },
    { id: 'rabbana', cat: 'In prayer', title: 'Rabbana Atina', ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', tr: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār', en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.', src: 'Quran 2:201', audio: [2, 201, 201] },
    { id: 'salam', cat: 'In prayer', title: 'Salam', ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', tr: 'As-salāmu ʿalaikum wa raḥmatullāh', en: 'Peace be upon you and the mercy of Allah.', src: 'Muslim 582; Abu Dawud 996', note: 'Turn right until your right cheek is visible from behind, then left. The first salam is a pillar; the second is sunnah.' },
    { id: 'qunut', cat: 'In prayer', title: 'Doa Qunut (Subuh)', ar: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَىٰ مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَىٰ آلِهِ وَصَحْبِهِ وَسَلَّمَ', tr: 'Allāhummahdinī fīman hadait, wa ʿāfinī fīman ʿāfait, wa tawallanī fīman tawallait, wa bārik lī fīmā aʿṭait, wa qinī sharra mā qaḍait, fa innaka taqḍī wa lā yuqḍā ʿalaik, wa innahū lā yadhillu man wālait, wa lā yaʿizzu man ʿādait, tabārakta rabbanā wa taʿālait, fa lakal-ḥamdu ʿalā mā qaḍait, astaghfiruka wa atūbu ilaik. Wa ṣallallāhu ʿalā sayyidinā Muḥammadinin-nabiyyil-ummiyyi wa ʿalā ālihī wa ṣaḥbihī wa sallam.', en: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care, bless me in what You have given, and protect me from the evil of what You have decreed. You decree, and none decrees over You. Whoever You befriend is never humiliated, and whoever You oppose is never honoured. Blessed are You, our Lord, and Exalted. Yours is the praise for what You have decreed. I seek Your forgiveness and turn to You. May Allah send blessings and peace upon our master Muhammad, the unlettered Prophet, and upon his family and companions.', src: 'Abu Dawud 1425; at-Tirmidhi 464 (core text); later lines from Shafi’i practice', note: 'Shafi’i: sunnah ab’adh in the I’tidal of the 2nd rakaat of Subuh, and of Witr in the second half of Ramadan. Raise both hands. An imam says “ihdinā” (us) instead of “ihdinī” (me).' },
    { id: 'istighfar', cat: 'After prayer', title: 'Istighfar', ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'Astaghfirullāh', en: 'I seek Allah’s forgiveness.', src: 'Muslim 591', count: 3, note: 'The first words after salam: forgiveness for any shortfall in the prayer just completed.' },
    { id: 'antas-salam', cat: 'After prayer', title: 'Allahumma Antas-Salam', ar: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', tr: 'Allāhumma antas-salām wa minkas-salām, tabārakta yā dhal-jalāli wal-ikrām', en: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honour.', src: 'Muslim 591' },
    { id: 'kursi', cat: 'After prayer', title: 'Ayat al-Kursi', ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', tr: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm. Lā ta\'khudhuhū sinatun wa lā nawm. Lahū mā fis-samāwāti wa mā fil-arḍ. Man dhal-ladhī yashfaʿu ʿindahū illā bi-idhnih. Yaʿlamu mā baina aidīhim wa mā khalfahum. Wa lā yuḥīṭūna bishai\'im-min ʿilmihī illā bimā shā\'. Wasiʿa kursiyyuhus-samāwāti wal-arḍ. Wa lā ya\'ūduhū ḥifẓuhumā. Wa huwal-ʿaliyyul-ʿaẓīm.', en: 'Allah: there is no god but Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth. Who could intercede with Him except by His permission? He knows what is before them and what is behind them, and they grasp nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and guarding them does not tire Him. He is the Most High, the Most Great.', src: 'Quran 2:255; recited after each prayer: an-Nasa’i, as-Sunan al-Kubra', audio: [2, 255, 255] },
    { id: 'subhanallah', cat: 'After prayer', title: 'Tasbih', ar: 'سُبْحَانَ اللَّهِ', tr: 'Subḥānallāh', en: 'Glory be to Allah.', src: 'Muslim 597', count: 33 },
    { id: 'alhamdulillah', cat: 'After prayer', title: 'Tahmid', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Al-ḥamdu lillāh', en: 'All praise belongs to Allah.', src: 'Muslim 597', count: 33 },
    { id: 'allahuakbar', cat: 'After prayer', title: 'Takbir', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allāhu akbar', en: 'Allah is the Greatest.', src: 'Muslim 597', count: 33 },
    { id: 'tahlil', cat: 'After prayer', title: 'Tahlil (the 100th)', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', tr: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ʿalā kulli shai\'in qadīr', en: 'There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He has power over all things.', src: 'Muslim 597', note: 'Completing the 99 with this: sins forgiven even if like the foam of the sea (Muslim 597).' },
    { id: 'ainni', cat: 'After prayer', title: 'Doa for good worship', ar: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', tr: 'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik', en: 'O Allah, help me to remember You, to thank You, and to worship You well.', src: 'Abu Dawud 1522', note: 'The Prophet ﷺ told Muʿadh never to leave this after any prayer.' },
    { id: 'wudhu-niat', cat: 'Wudhu', title: 'Niat of Wudhu', ar: 'نَوَيْتُ رَفْعَ الْحَدَثِ الْأَصْغَرِ لِلَّهِ تَعَالَىٰ', tr: 'Nawaitu rafʿal-ḥadathil-aṣghari lillāhi taʿālā', en: 'I intend to lift the minor state of impurity, for Allah the Exalted.', src: 'Shafi’i: niat is a pillar of wudhu', note: 'The intention is in the heart, made as water first touches the face. Saying it helps the heart focus.' },
    { id: 'wudhu-after', cat: 'Wudhu', title: 'Doa after Wudhu', ar: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ', tr: 'Ash-hadu an lā ilāha illallāhu waḥdahū lā sharīka lah, wa ash-hadu anna Muḥammadan ʿabduhū wa rasūluh. Allāhummajʿalnī minat-tawwābīna wajʿalnī minal-mutaṭahhirīn.', en: 'I bear witness that there is no god but Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger. O Allah, make me among those who repent and make me among those who purify themselves.', src: 'Muslim 234; at-Tirmidhi 55', note: 'Whoever says this, the eight gates of Paradise are opened for him (Muslim 234).' },
    { id: 'sahwi', cat: 'Special', title: 'Tasbih of Sujud Sahwi', ar: 'سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُو', tr: 'Subḥāna man lā yanāmu wa lā yashū', en: 'Glory be to the One who neither sleeps nor forgets.', src: 'Recommended by Shafi’i scholars', note: 'Saying the normal sujud tasbih is also valid.' },
  ];

  // Short surahs for the 1st and 2nd rakaat. Fatihah first.
  const surahs = [
    { id: 'fatihah', n: 1, name: 'Al-Fatihah', meaning: 'The Opening', rukun: true, ayat: [
      { ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', tr: 'Bismillāhir-raḥmānir-raḥīm', en: 'In the name of Allah, the Most Compassionate, the Most Merciful.', tip: 'In the Shafi’i school the Basmalah is the first verse: leave it out and your Fatihah is incomplete. 3 shaddah.' },
      { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', tr: 'Al-ḥamdu lillāhi rabbil-ʿālamīn', en: 'All praise belongs to Allah, Lord of all the worlds.', tip: 'ḥ (ح) from the middle of the throat, not a plain h (ه). ʿ (ع) in ʿālamīn. 2 shaddah.' },
      { ar: 'الرَّحْمَٰنِ الرَّحِيمِ', tr: 'Ar-raḥmānir-raḥīm', en: 'The Most Compassionate, the Most Merciful.', tip: '2 shaddah, on both rā’.' },
      { ar: 'مَالِكِ يَوْمِ الدِّينِ', tr: 'Māliki yawmid-dīn', en: 'Master of the Day of Judgement.', tip: 'Long ā in Māliki. Shaddah on the dāl of ad-dīn.' },
      { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', tr: 'Iyyāka naʿbudu wa iyyāka nastaʿīn', en: 'You alone we worship, and You alone we ask for help.', tip: 'Shaddah on yā’ in both iyyāka. Without it, “iyāka” means “sunlight”. 2 shaddah.' },
      { ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', tr: 'Ihdinaṣ-ṣirāṭal-mustaqīm', en: 'Guide us to the straight path,', tip: 'Heavy ṣ (ص) with shaddah, heavy ṭ (ط). 1 shaddah.' },
      { ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', tr: 'Ṣirāṭal-ladhīna anʿamta ʿalaihim, ghairil-maghḍūbi ʿalaihim wa laḍ-ḍāllīn', en: 'the path of those You have blessed, not of those who earned Your anger, nor of those who went astray.', tip: '“anʿamta” (You blessed), never “anʿamtu” (I blessed). ḍ (ض) is heavy. Stretch ḍāā-llīn 6 counts. 3 shaddah.' },
    ] },
    { id: 'ikhlas', n: 112, name: 'Al-Ikhlas', meaning: 'Sincerity', ayat: [
      { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', tr: 'Qul huwallāhu aḥad', en: 'Say: He is Allah, the One.' },
      { ar: 'اللَّهُ الصَّمَدُ', tr: 'Allāhuṣ-ṣamad', en: 'Allah, the Eternal Refuge.' },
      { ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', tr: 'Lam yalid wa lam yūlad', en: 'He neither begets nor was begotten,' },
      { ar: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', tr: 'Wa lam yakun lahū kufuwan aḥad', en: 'and there is none comparable to Him.' },
    ] },
    { id: 'falaq', n: 113, name: 'Al-Falaq', meaning: 'The Daybreak', ayat: [
      { ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', tr: 'Qul aʿūdhu birabbil-falaq', en: 'Say: I seek refuge in the Lord of daybreak' },
      { ar: 'مِنْ شَرِّ مَا خَلَقَ', tr: 'Min sharri mā khalaq', en: 'from the evil of what He has created,' },
      { ar: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', tr: 'Wa min sharri ghāsiqin idhā waqab', en: 'from the evil of darkness when it settles,' },
      { ar: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', tr: 'Wa min sharrin-naffāthāti fil-ʿuqad', en: 'from the evil of those who blow on knots,' },
      { ar: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', tr: 'Wa min sharri ḥāsidin idhā ḥasad', en: 'and from the evil of an envier when he envies.' },
    ] },
    { id: 'nas', n: 114, name: 'An-Nas', meaning: 'Mankind', ayat: [
      { ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', tr: 'Qul aʿūdhu birabbin-nās', en: 'Say: I seek refuge in the Lord of mankind,' },
      { ar: 'مَلِكِ النَّاسِ', tr: 'Malikin-nās', en: 'the King of mankind,' },
      { ar: 'إِلَٰهِ النَّاسِ', tr: 'Ilāhin-nās', en: 'the God of mankind,' },
      { ar: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', tr: 'Min sharril-waswāsil-khannās', en: 'from the evil of the whisperer who withdraws,' },
      { ar: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', tr: 'Alladhī yuwaswisu fī ṣudūrin-nās', en: 'who whispers into the hearts of mankind,' },
      { ar: 'مِنَ الْجِنَّةِ وَالنَّاسِ', tr: 'Minal-jinnati wan-nās', en: 'from among jinn and mankind.' },
    ] },
    { id: 'kawthar', n: 108, name: 'Al-Kawthar', meaning: 'Abundance', ayat: [
      { ar: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', tr: 'Innā aʿṭainākal-kawthar', en: 'Indeed, We have granted you abundance.' },
      { ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', tr: 'Faṣalli lirabbika wanḥar', en: 'So pray to your Lord and sacrifice.' },
      { ar: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', tr: 'Inna shāni\'aka huwal-abtar', en: 'Indeed, it is your enemy who is cut off.' },
    ] },
    { id: 'asr', n: 103, name: 'Al-Asr', meaning: 'Time', ayat: [
      { ar: 'وَالْعَصْرِ', tr: 'Wal-ʿaṣr', en: 'By time,' },
      { ar: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', tr: 'Innal-insāna lafī khusr', en: 'mankind is surely in loss,' },
      { ar: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', tr: 'Illal-ladhīna āmanū wa ʿamiluṣ-ṣāliḥāti wa tawāṣau bil-ḥaqqi wa tawāṣau biṣ-ṣabr', en: 'except those who believe, do good, and urge one another to truth and to patience.' },
    ] },
    { id: 'kafirun', n: 109, name: 'Al-Kafirun', meaning: 'The Disbelievers', ayat: [
      { ar: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', tr: 'Qul yā ayyuhal-kāfirūn', en: 'Say: O disbelievers,' },
      { ar: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', tr: 'Lā aʿbudu mā taʿbudūn', en: 'I do not worship what you worship,' },
      { ar: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', tr: 'Wa lā antum ʿābidūna mā aʿbud', en: 'nor do you worship what I worship,' },
      { ar: 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ', tr: 'Wa lā ana ʿābidum-mā ʿabadtum', en: 'nor will I worship what you have worshipped,' },
      { ar: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', tr: 'Wa lā antum ʿābidūna mā aʿbud', en: 'nor will you worship what I worship.' },
      { ar: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', tr: 'Lakum dīnukum wa liya dīn', en: 'To you your religion, and to me mine.' },
    ] },
    { id: 'nasr', n: 110, name: 'An-Nasr', meaning: 'The Help', ayat: [
      { ar: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', tr: 'Idhā jā\'a naṣrullāhi wal-fatḥ', en: 'When the help of Allah and the victory come,' },
      { ar: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', tr: 'Wa ra\'aitan-nāsa yadkhulūna fī dīnillāhi afwājā', en: 'and you see people entering the religion of Allah in crowds,' },
      { ar: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', tr: 'Fasabbiḥ biḥamdi rabbika wastaghfirh, innahū kāna tawwābā', en: 'then glorify the praise of your Lord and ask His forgiveness. He is ever accepting of repentance.' },
    ] },
    { id: 'masad', n: 111, name: 'Al-Masad', meaning: 'The Palm Fibre', ayat: [
      { ar: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', tr: 'Tabbat yadā abī lahabin wa tabb', en: 'Ruined are the hands of Abu Lahab, and ruined is he.' },
      { ar: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', tr: 'Mā aghnā ʿanhu māluhū wa mā kasab', en: 'His wealth and gains will not avail him.' },
      { ar: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', tr: 'Sayaṣlā nāran dhāta lahab', en: 'He will burn in a fire of blazing flame,' },
      { ar: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ', tr: 'Wamra\'atuhū ḥammālatal-ḥaṭab', en: 'and his wife, the carrier of firewood,' },
      { ar: 'فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ', tr: 'Fī jīdihā ḥablum-mim-masad', en: 'around her neck a rope of palm fibre.' },
    ] },
    { id: 'quraysh', n: 106, name: 'Quraysh', meaning: 'Quraysh', ayat: [
      { ar: 'لِإِيلَافِ قُرَيْشٍ', tr: 'Li-īlāfi quraish', en: 'For the security of Quraysh,' },
      { ar: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', tr: 'Īlāfihim riḥlatash-shitā\'i waṣ-ṣaif', en: 'their security in the journeys of winter and summer,' },
      { ar: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', tr: 'Falyaʿbudū rabba hādhal-bait', en: 'let them worship the Lord of this House,' },
      { ar: 'الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ', tr: 'Alladhī aṭʿamahum min jūʿin wa āmanahum min khawf', en: 'who fed them against hunger and made them safe from fear.' },
    ] },
    { id: 'maun', n: 107, name: 'Al-Ma’un', meaning: 'Small Kindnesses', ayat: [
      { ar: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', tr: 'Ara\'aital-ladhī yukadhdhibu bid-dīn', en: 'Have you seen the one who denies the Judgement?' },
      { ar: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', tr: 'Fadhālikal-ladhī yaduʿʿul-yatīm', en: 'That is the one who drives away the orphan,' },
      { ar: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', tr: 'Wa lā yaḥuḍḍu ʿalā ṭaʿāmil-miskīn', en: 'and does not urge feeding the poor.' },
      { ar: 'فَوَيْلٌ لِلْمُصَلِّينَ', tr: 'Fawailul-lil-muṣallīn', en: 'So woe to those who pray,' },
      { ar: 'الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ', tr: 'Alladhīna hum ʿan ṣalātihim sāhūn', en: 'who are heedless of their prayer,' },
      { ar: 'الَّذِينَ هُمْ يُرَاءُونَ', tr: 'Alladhīna hum yurā\'ūn', en: 'who only show off,' },
      { ar: 'وَيَمْنَعُونَ الْمَاعُونَ', tr: 'Wa yamnaʿūnal-māʿūn', en: 'and withhold small kindnesses.' },
    ] },
    { id: 'fil', n: 105, name: 'Al-Fil', meaning: 'The Elephant', ayat: [
      { ar: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', tr: 'Alam tara kaifa faʿala rabbuka bi-aṣḥābil-fīl', en: 'Have you not seen how your Lord dealt with the people of the elephant?' },
      { ar: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', tr: 'Alam yajʿal kaidahum fī taḍlīl', en: 'Did He not make their plan go astray,' },
      { ar: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', tr: 'Wa arsala ʿalaihim ṭairan abābīl', en: 'and send against them birds in flocks,' },
      { ar: 'تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ', tr: 'Tarmīhim biḥijāratim-min sijjīl', en: 'striking them with stones of baked clay,' },
      { ar: 'فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ', tr: 'Fajaʿalahum kaʿaṣfim-ma\'kūl', en: 'leaving them like chewed-up straw?' },
    ] },
  ];

  // Step library for the guided prayer.
  const steps = {
    prepare: { name: 'Prepare', ar: 'الِاسْتِعْدَادُ', pose: 'stand', ov: [], tag: 'condition', how: ['You have wudhu, and body, clothes and place are clean of najis.', 'Aurat covered: men navel to knee; women all but face and palms.', 'The prayer time has entered.', 'Chest facing the qiblah. Stand at your mat, feet a hand-span apart, toes pointing forward.'], mistakes: ['Women: wrists, chin or feet showing. Men: lower back showing when bowing.'] },
    niat: { name: 'Niat & Takbiratul Ihram', short: 'Takbir', ar: 'النِّيَّةُ وَتَكْبِيرَةُ الْإِحْرَامِ', pose: 'takbir', ov: ['heart'], tag: 'rukun', say: ['takbir'], niat: true, how: ['Make the niat in your heart: which prayer, that it is fard, as you begin the takbir.', 'Raise both hands, palms facing the qiblah, fingertips level with the tops of the ears, thumbs near the earlobes.', 'Say “Allāhu akbar” loud enough to hear yourself.'], mistakes: ['Niat made after the takbir is finished.', 'Stretching the A of Allāhu, or saying “akbār”.'] },
    qiyam: { name: 'Qiyam (standing)', short: 'Qiyam', ar: 'الْقِيَامُ', pose: 'qiyam', ov: ['gaze'], tag: 'rukun', how: ['Right hand over the left wrist, below the chest and above the navel.', 'Eyes on the place of sujud.', 'Stand straight and still. Standing is a pillar for anyone able in a fard prayer.'] },
    iftitah: { name: 'Doa Iftitah', short: 'Iftitah', ar: 'دُعَاءُ الِافْتِتَاحِ', pose: 'qiyam', ov: ['gaze'], tag: 'sunnah', say: ['iftitah'], how: ['Recite silently. First rakaat only.'] },
    fatihah: { name: 'Al-Fatihah', ar: 'الْفَاتِحَةُ', pose: 'qiyam', ov: ['gaze'], tag: 'rukun', say: ['taawwudh'], surah: 'fatihah', after: ['amin'], how: ['Ta’awwudh silently, then Al-Fatihah with the Basmalah.', 'Move your tongue and lips, loud enough to hear yourself. Reading “in the heart” is not reciting.', 'Every letter and all 14 shaddah. Then “Āmīn”.'], mistakes: ['Skipping the Basmalah.', 'ح pronounced as ه; missing the shaddah in iyyāka.'] },
    surah: { name: 'A surah', short: 'Surah', ar: 'السُّورَةُ', pose: 'qiyam', ov: ['gaze'], tag: 'sunnah', surahPick: true, how: ['Recite any surah or a few verses after Al-Fatihah, in the 1st and 2nd rakaat.', 'Make the first rakaat slightly longer than the second.'] },
    ruku: { name: 'Ruku’', ar: 'الرُّكُوعُ', pose: 'ruku', ov: ['level'], tag: 'rukun', say: ['ruku'], how: ['Say “Allāhu akbar” while bowing, raising the hands as in takbir.', 'Palms grip the knees, fingers spread. Back and neck flat as a board: a glass of water would not spill.', 'Be still (tama’ninah): every limb settles before you rise.'], mistakes: ['Head dipped or raised above the back.', 'Rising before the body has settled.'] },
    itidal: { name: 'I’tidal', ar: 'الِاعْتِدَالُ', pose: 'itidal', ov: [], tag: 'rukun', say: ['samiallah', 'itidal'], how: ['Rise saying “Samiʿallāhu liman ḥamidah”, raising the hands to shoulder level.', 'Stand fully upright, arms by your sides, and be still before going down.'], mistakes: ['A half-rise, then dropping straight into sujud.'] },
    qunut: { name: 'Qunut', ar: 'الْقُنُوتُ', pose: 'itidal', ov: [], tag: 'abadh', say: ['qunut'], how: ['In the I’tidal of the 2nd rakaat of Subuh, raise both hands, palms up, and recite the qunut.', 'Forgetting it calls for sujud sahwi.'] },
    sujud1: { name: 'Sujud', short: 'Sujud 1', ar: 'السُّجُودُ', pose: 'sujud', ov: ['contacts'], tag: 'rukun', say: ['sujud'], how: ['Say “Allāhu akbar” and go down knees first, then hands, then forehead and nose.', 'Seven parts on the ground: forehead (with nose), both palms, both knees, the toes of both feet.', 'Part of the forehead must touch the ground bare: no cap or cloth fully covering it.', 'Hips higher than the head. Palms level with the shoulders, fingers together pointing to the qiblah. Toes bent towards the qiblah.', 'Men: elbows lifted off the floor and away from the sides, belly off the thighs. Women: keep the limbs close together.'], mistakes: ['Toes lifting off the floor.', 'Forearms flat on the floor.', 'Forehead covered by a cap or telekung.'] },
    julus: { name: 'Sitting between two sujud', short: 'Julus', ar: 'الْجُلُوسُ بَيْنَ السَّجْدَتَيْنِ', pose: 'iftirasy', ov: [], tag: 'rukun', say: ['julus'], how: ['Rise with “Allāhu akbar” into iftirasy: sit on the left foot; right foot upright, toes bent towards the qiblah.', 'Hands on the thighs near the knees. Be still.'], mistakes: ['Lifting the head briefly and going straight back down.'] },
    sujud2: { name: 'Second sujud', short: 'Sujud 2', ar: 'السَّجْدَةُ الثَّانِيَةُ', pose: 'sujud', ov: ['contacts'], tag: 'rukun', say: ['sujud'], how: ['“Allāhu akbar”, then the second sujud exactly like the first, with stillness.'] },
    istirahah: { name: 'Brief rest, then rise', short: 'Rise', ar: 'جَلْسَةُ الِاسْتِرَاحَةِ', pose: 'iftirasy', ov: [], tag: 'sunnah', how: ['Before standing for the next rakaat, sit very briefly as in iftirasy (Shafi’i sunnah).', 'Rise saying “Allāhu akbar”, pushing up from the floor with both hands.'] },
    tashahhud1: { name: 'First Tashahhud', short: 'Tashahhud 1', ar: 'التَّشَهُّدُ الْأَوَّلُ', pose: 'iftirasy', ov: ['point'], tag: 'abadh', say: ['tashahhud', 'salawat-short'], how: ['After the 2nd rakaat of a 3 or 4 rakaat prayer, sit in iftirasy.', 'Left hand flat on the left thigh. Right hand closed except the index finger, raised at “illallāh” and kept raised.', 'Then rise for the 3rd rakaat with “Allāhu akbar”.'], mistakes: ['Wagging the finger. In the Shafi’i school it stays still.'] },
    tashahhud2: { name: 'Final Tashahhud & Selawat', short: 'Final Tashahhud', ar: 'التَّشَهُّدُ الْأَخِيرُ', pose: 'tawarruk', ov: ['point'], tag: 'rukun', say: ['tashahhud', 'salawat', 'before-salam'], how: ['Sit in tawarruk: left hip on the floor, left foot out from under the right shin, right foot upright.', 'Recite the Tashahhud and Selawat Ibrahimiyyah. Both are pillars.', 'Then a doa before salam, such as the four refuges.'] },
    salam: { name: 'Salam', ar: 'السَّلَامُ', pose: 'tawarruk', ov: ['salam'], tag: 'rukun', say: ['salam'], how: ['Turn your face right: “As-salāmu ʿalaikum wa raḥmatullāh”.', 'Then turn left and repeat. Intend to leave the prayer, and greet the angels and those beside you.'] },
  };

  const rukun = [
    { n: 1, name: 'Niat', type: 'Heart', note: 'Intention in the heart at takbiratul ihram: which prayer, and that it is fard.' },
    { n: 2, name: 'Standing (qiyam)', type: 'Action', note: 'For a fard prayer, if able. Otherwise sit, then lie down.' },
    { n: 3, name: 'Takbiratul Ihram', type: 'Words', note: '“Allāhu akbar”, audible to yourself.' },
    { n: 4, name: 'Al-Fatihah in every rakaat', type: 'Words', note: 'Including the Basmalah and all 14 shaddah.' },
    { n: 5, name: 'Ruku’ with stillness', type: 'Action', note: 'Palms can reach the knees; body settles.' },
    { n: 6, name: 'I’tidal with stillness', type: 'Action', note: 'Back to full standing.' },
    { n: 7, name: 'Two sujud with stillness', type: 'Action', note: 'Seven parts down, bare forehead, hips above head.' },
    { n: 8, name: 'Sitting between the two sujud with stillness', type: 'Action', note: 'Upright and still.' },
    { n: 9, name: 'Sitting for the final Tashahhud', type: 'Action', note: 'Tawarruk is the sunnah way to sit.' },
    { n: 10, name: 'Reciting the final Tashahhud', type: 'Words', note: 'Audible to yourself.' },
    { n: 11, name: 'Selawat upon the Prophet ﷺ', type: 'Words', note: 'In the final Tashahhud. Minimum: “Allāhumma ṣalli ʿalā Muḥammad”.' },
    { n: 12, name: 'The first salam', type: 'Words', note: '“As-salāmu ʿalaikum”. The second salam is sunnah.' },
    { n: 13, name: 'Tertib (correct order)', type: 'Order', note: 'Every pillar in its sequence.' },
  ];

  const syarat = {
    wajib: ['Muslim', 'Baligh (reached puberty)', 'Sane', 'Free of haid (menstruation) and nifas (post-natal bleeding)', 'The message of Islam has reached them'],
    sah: ['Free of minor and major hadas (wudhu, and ghusl if needed)', 'Body, clothing and place free of najis', 'Aurat covered', 'Facing the qiblah', 'The prayer time has entered', 'Knowing how to pray: telling the fard parts from the sunnah'],
  };

  const sunnahAbadh = [
    'First Tashahhud',
    'Sitting for the first Tashahhud',
    'Selawat upon the Prophet ﷺ in the first Tashahhud',
    'Qunut in Subuh, and in Witr in the second half of Ramadan',
    'Standing for the qunut',
    'Selawat upon the Prophet ﷺ, his family and companions in the qunut',
  ];

  const sunnahHaiah = [
    'Raising the hands at takbiratul ihram, before and after ruku’, and when rising from the first Tashahhud',
    'Right hand over left, below the chest',
    'Doa iftitah', 'Ta’awwudh', '“Āmīn” after Al-Fatihah',
    'A surah after Al-Fatihah in the 1st and 2nd rakaat',
    'Reciting aloud in Subuh, and the first two rakaat of Maghrib and Isyak (imam and those praying alone)',
    'Takbir at every change of position',
    'The tasbih of ruku’ and sujud, three times',
    'Iftirasy and tawarruk sitting', 'Brief rest before rising (jalsah istirahah)',
    'Doa before salam', 'The second salam',
  ];

  const invalidators = [
    { t: 'Speaking deliberately', d: 'Even two letters, or one letter that has meaning.' },
    { t: 'Lots of movement', d: 'Three consecutive large movements that are not part of the prayer.' },
    { t: 'Losing wudhu', d: 'Anything that breaks wudhu during the prayer.' },
    { t: 'Najis touching you', d: 'Unless it is dry and shaken off immediately.' },
    { t: 'Aurat exposed', d: 'Unless the wind uncovers it and you cover it at once.' },
    { t: 'Turning the chest away from the qiblah', d: '' },
    { t: 'Eating or drinking', d: 'Even a little, deliberately.' },
    { t: 'Laughing out loud', d: '' },
    { t: 'Changing the niat', d: 'Deciding to stop, or hesitating about whether to continue.' },
    { t: 'Leaving or adding a pillar deliberately', d: 'Such as an extra ruku’ on purpose.' },
    { t: 'Getting two action-pillars ahead of the imam', d: 'Or two behind, without a valid excuse.' },
    { t: 'Apostasy', d: '' },
  ];

  const mistakes = [
    { t: 'Rushing: no stillness (tama’ninah)', fix: 'Count one calm “Subḥānallāh” of stillness in ruku’, i’tidal, sujud and the sitting between before moving. The man who prayed in a rush was told three times: “Go back and pray, for you have not prayed.”', src: 'al-Bukhari 757; Muslim 397', severity: 'invalid' },
    { t: 'Reciting only in the heart', fix: 'Move the tongue and lips, loud enough to hear yourself in a quiet room. This applies to takbir, Al-Fatihah, Tashahhud, Selawat and salam.', severity: 'invalid' },
    { t: 'Mispronouncing Al-Fatihah', fix: 'Mind the 14 shaddah, ح vs ه, ع vs ء, and anʿamta with a “ta”. A change that alters the meaning invalidates that rakaat.', severity: 'invalid' },
    { t: 'Forehead covered in sujud', fix: 'Push back the cap, hair or telekung so part of the forehead touches the mat directly.', severity: 'invalid' },
    { t: 'Feet lifting in sujud', fix: 'Keep the bent toes pressed into the floor for the whole sujud.', severity: 'invalid' },
    { t: 'Head level with or below the hips?', fix: 'In sujud, hips must be higher than the head. On a high stool or in a cramped row this is easy to lose.', severity: 'invalid' },
    { t: 'Aurat slipping', fix: 'Men: a long shirt so the lower back stays covered in ruku’ and sujud. Women: check wrists when raising hands, and the soles of the feet.', severity: 'invalid' },
    { t: 'Racing the imam', fix: 'Move only after the imam has reached the position. “Does he not fear that Allah will turn his head into a donkey’s head?”', src: 'al-Bukhari 691', severity: 'serious' },
    { t: 'Forearms flat on the floor', fix: 'Lift the elbows. The Prophet ﷺ forbade spreading the arms like a dog.', src: 'al-Bukhari 822; Muslim 493', severity: 'disliked' },
    { t: 'Looking around or up', fix: 'Gaze at the place of sujud; in Tashahhud, at the raised finger.', src: 'al-Bukhari 750, 751', severity: 'disliked' },
    { t: 'Praying while hungry or needing the toilet', fix: 'Relieve yourself or eat first if there is time. The heart cannot settle otherwise.', src: 'Muslim 560', severity: 'disliked' },
    { t: 'Wagging the index finger', fix: 'Shafi’i: raise it at “illallāh” and hold it still, looking at it.', severity: 'disliked' },
  ];

  const khushu = [
    { t: 'Know what you are saying', d: 'Learn the meaning of every phrase. This app shows it at every step; read it until it is yours.' },
    { t: 'Arrive early', d: 'Wudhu without rushing, a few minutes of quiet, then the sunnah before. The heart needs a runway.' },
    { t: 'Pray as if it is your last', d: '“When you stand for prayer, pray a farewell prayer.” (Ibn Majah 4171)' },
    { t: 'Pause at each verse', d: 'The Prophet ﷺ recited Al-Fatihah verse by verse, stopping at each. Allah answers each verse (Muslim 395).' },
    { t: 'Own the stillness', d: 'Tama’ninah is where presence lives. Rushed limbs mean a rushed heart.' },
    { t: 'Fix your gaze', d: 'On the place of sujud. Remove pictures, phones and patterns from in front of you.' },
    { t: 'Rotate your surahs', d: 'Learn a new short surah each month. Familiar words go on autopilot; new ones wake you up.' },
    { t: 'Ask in sujud', d: 'You are closest to Allah in sujud (Muslim 482). Make doa there in Arabic; after salam, in any language.' },
    { t: 'Use a sutrah', d: 'Pray facing a wall, pillar or object so nobody passes in front of you.' },
    { t: 'Aim for ihsan', d: '“Worship Allah as though you see Him; and if you do not see Him, He sees you.” (Muslim 8)' },
  ];

  const sahwi = {
    when: [
      { t: 'You left a sunnah ab’adh', d: 'Such as the first Tashahhud or the qunut.' },
      { t: 'You are unsure how many rakaat you prayed', d: 'Take the lower number, complete the prayer, then do sujud sahwi.' },
      { t: 'You forgetfully did something that would invalidate the prayer if done on purpose', d: 'Such as an extra ruku’ or a fifth rakaat.' },
      { t: 'You moved a spoken pillar or sunnah to the wrong place', d: 'Such as reciting Al-Fatihah in ruku’.' },
    ],
    how: ['After the final Tashahhud, Selawat and doa, before salam.', 'Make two sujud with the takbir, with a sitting between, exactly like normal sujud.', 'Then give salam.'],
    rukunNote: 'A missed pillar cannot be fixed by sujud sahwi. If you forgot Al-Fatihah or a ruku’, that rakaat does not count: add a rakaat, then do sujud sahwi.',
  };

  const wudhu = {
    rukun: ['Niat', 'Wash the whole face, hairline to chin, ear to ear', 'Wash both arms including the elbows', 'Wipe part of the head with wet hands', 'Wash both feet including the ankles', 'Tertib: in this order'],
    steps: [
      { t: 'Bismillah', tag: 'sunnah', d: 'Say “Bismillāh”. Use clean water and do not waste it.' },
      { t: 'Wash the hands', tag: 'sunnah', d: 'Both hands to the wrists, three times, between the fingers.' },
      { t: 'Rinse the mouth', tag: 'sunnah', d: 'Three times. Use a siwak or brush if you can.' },
      { t: 'Rinse the nose', tag: 'sunnah', d: 'Sniff water in with the right hand, blow out with the left. Three times.' },
      { t: 'Wash the face with niat', tag: 'rukun', d: 'Make the niat as the water touches the face. Hairline to chin, ear to ear. Three times.' },
      { t: 'Wash the arms', tag: 'rukun', d: 'Right then left, fingertips to above the elbow. Three times. Remove anything that blocks water, such as nail polish.' },
      { t: 'Wipe the head', tag: 'rukun', d: 'Wet hands over part of the head (Shafi’i minimum: a few hairs within the head’s boundary). Sunnah: the whole head, three times.' },
      { t: 'Wipe the ears', tag: 'sunnah', d: 'Inside with the index fingers, behind with the thumbs, with fresh water. Three times.' },
      { t: 'Wash the feet', tag: 'rukun', d: 'Right then left, including the ankles and between the toes. Three times.' },
      { t: 'Doa after wudhu', tag: 'sunnah', d: 'Face the qiblah, raise your gaze and recite the doa.' },
    ],
    nullifiers: [
      { t: 'Anything exiting the front or back passage', d: 'Urine, stool, wind, and so on.' },
      { t: 'Losing consciousness', d: 'Including sleep, except sleeping while seated firmly on the floor.' },
      { t: 'Skin contact between a man and woman who are not mahram', d: 'Shafi’i position: bare skin touching, without a barrier.' },
      { t: 'Touching the private parts', d: 'Your own or another’s, with the palm or inner fingers, without a barrier.' },
    ],
  };

  const women = [
    'Aurat: the whole body except the face and palms. Check wrists, chin, hairline and soles of the feet.',
    'In ruku’ and sujud, keep the limbs close together: elbows to the sides, belly to the thighs.',
    'Recite aloud only when no non-mahram men can hear; otherwise keep it low.',
    'To alert the imam, clap the back of one hand on the palm of the other. Men say “Subḥānallāh”.',
    'No prayer during haid or nifas, and no make-up of those prayers later.',
    'A prayer whose time began before haid started (long enough to pray it) must be made up.',
  ];

  const timeline = [
    { t: 'Niat', pose: 'takbir' }, { t: 'Qiyam', pose: 'qiyam' }, { t: 'Ruku’', pose: 'ruku' }, { t: 'I’tidal', pose: 'itidal' },
    { t: 'Sujud', pose: 'sujud' }, { t: 'Julus', pose: 'iftirasy' }, { t: 'Sujud', pose: 'sujud' }, { t: 'Tashahhud', pose: 'tawarruk' },
  ];

  // Learning path. card types: text, list, dua, figure, table, quote
  const lessons = [
    { id: 'why', unit: 1, title: 'Why solat matters', blurb: 'The first deed you will be asked about.',
      cards: [
        { type: 'quote', text: 'The first deed for which a servant will be called to account on the Day of Resurrection is the prayer. If it is sound, the rest of his deeds will be sound.', src: 'Abu Dawud 864; at-Tirmidhi 413' },
        { type: 'text', title: 'The second pillar of Islam', body: 'Solat is fard for every Muslim who is baligh and sane: five times a day, 17 rakaat in total. It is the one act of worship that is never dropped, even when you are ill or travelling.' },
        { type: 'text', title: 'The goal: ihsan', body: 'A “perfect prayer” has two halves. The outward half: correct pillars, postures and recitation. The inward half: khushu’, a present heart. This app trains both.' },
        { type: 'quote', text: 'Pray as you have seen me praying.', src: 'al-Bukhari 631' },
      ],
      quiz: [
        { q: 'How many fard rakaat are prayed each day?', o: ['15', '17', '19', '21'], a: 1, e: '2 + 4 + 4 + 3 + 4 = 17.' },
        { q: 'Solat is which pillar of Islam?', o: ['First', 'Second', 'Third', 'Fifth'], a: 1, e: 'After the shahadah.' },
        { q: 'A perfect prayer needs correct form and…', o: ['Speed', 'Khushu’ (a present heart)', 'A loud voice', 'A long surah'], a: 1, e: 'Form and presence together.' },
        { t: 'tf', q: 'A sick person who cannot stand may pray sitting.', a: true, e: 'Standing is a pillar only for those able. Otherwise sit, then lie down.' },
      ] },
    { id: 'five', unit: 1, title: 'The five prayers', blurb: 'Times, rakaat, aloud or silent.',
      cards: [
        { type: 'table', title: 'At a glance' },
        { type: 'text', title: 'Aloud or silent', body: 'Subuh is recited aloud. Maghrib and Isyak: the first two rakaat aloud. Zohor and Asar: silent throughout. “Aloud” applies to the imam and to a man praying alone.' },
        { type: 'text', title: 'Sunnah rawatib', body: 'Ten rakaat are strongly emphasised (muakkad): 2 before Subuh, 2 before and 2 after Zohor, 2 after Maghrib, 2 after Isyak. The 2 before Subuh are “better than the world and all it contains” (Muslim 725).' },
      ],
      quiz: [
        { q: 'How many fard rakaat in Maghrib?', o: ['2', '3', '4', '5'], a: 1, e: 'Maghrib is the only 3-rakaat prayer.' },
        { q: 'Which prayer is recited silently throughout?', o: ['Subuh', 'Maghrib', 'Asar', 'Isyak'], a: 2, e: 'Zohor and Asar are silent.' },
        { q: 'Which sunnah prayer is “better than the world and all it contains”?', o: ['2 after Isyak', '2 before Subuh', '4 before Asar', 'Witr'], a: 1, e: 'Muslim 725.' },
        { t: 'tf', q: 'Maghrib time lasts until the red twilight disappears.', a: true, e: 'Then Isyak begins.' },
        { q: 'In which prayer do Shafi’is recite the qunut daily?', o: ['Zohor', 'Maghrib', 'Subuh', 'Isyak'], a: 2, e: 'In the I’tidal of the 2nd rakaat.' },
      ] },
    { id: 'syarat', unit: 2, title: 'Conditions of prayer', blurb: 'What must be true before you start.',
      cards: [
        { type: 'list', title: 'Who must pray (syarat wajib)', items: syarat.wajib },
        { type: 'list', title: 'What makes it valid (syarat sah)', items: syarat.sah },
        { type: 'text', title: 'Aurat', body: 'Men: from the navel to the knee. Women: the whole body except the face and the palms. Clothing must not be see-through.' },
      ],
      quiz: [
        { t: 'tf', q: 'A prayer prayed before its time has entered is valid if you intended it.', a: false, e: 'The time entering is a condition of validity.' },
        { q: 'A man’s aurat in prayer is…', o: ['Shoulders to knees', 'Navel to knees', 'Waist to ankles', 'Only the private parts'], a: 1, e: 'From the navel to the knee.' },
        { t: 'classify', q: 'Condition of obligation, or of validity?', buckets: ['Wajib', 'Sah'], items: [['Baligh', 0], ['Facing the qiblah', 1], ['Sane', 0], ['Free of najis', 1], ['Aurat covered', 1]] },
        { q: 'Which is NOT a condition of validity?', o: ['Wudhu', 'Facing qiblah', 'Praying in a mosque', 'Aurat covered'], a: 2, e: 'Any clean place on earth is valid.' },
      ] },
    { id: 'wudhu', unit: 2, title: 'Wudhu step by step', blurb: 'Six pillars and the sunnah around them.',
      cards: [
        { type: 'steps', title: 'The complete wudhu', items: wudhu.steps },
        { type: 'list', title: 'The 6 pillars (Shafi’i)', items: wudhu.rukun },
        { type: 'dua', id: 'wudhu-after' },
      ],
      quiz: [
        { t: 'order', q: 'Put the pillars of wudhu in order.', items: ['Wash the face (with niat)', 'Wash the arms', 'Wipe the head', 'Wash the feet'] },
        { q: 'When is the niat of wudhu made?', o: ['Before entering the bathroom', 'As water first touches the face', 'While washing the feet', 'After finishing'], a: 1, e: 'The niat accompanies the first pillar: washing the face.' },
        { t: 'tf', q: 'Rinsing the mouth is a pillar of wudhu.', a: false, e: 'It is sunnah in the Shafi’i school.' },
        { q: 'Minimum wiping of the head (Shafi’i)?', o: ['The whole head', 'A quarter', 'Part of it, even a few hairs', 'Only the forehead'], a: 2, e: 'Any part within the head’s boundary.' },
        { t: 'tf', q: 'Nail polish must be removed for wudhu to be valid.', a: true, e: 'It blocks water from reaching the nail.' },
      ] },
    { id: 'batal', unit: 2, title: 'What breaks wudhu', blurb: 'Four things, Shafi’i school.',
      cards: [
        { type: 'items', title: 'Wudhu is broken by', items: wudhu.nullifiers },
        { type: 'text', title: 'Doubt', body: 'If you are certain you had wudhu and only doubt whether you lost it, you still have wudhu. Certainty is not removed by doubt.' },
      ],
      quiz: [
        { t: 'tf', q: 'Dozing while seated firmly on the floor breaks wudhu.', a: false, e: 'Sleep breaks wudhu except when seated firmly.' },
        { t: 'tf', q: 'In the Shafi’i school, touching the bare skin of a non-mahram of the opposite sex breaks wudhu.', a: true, e: 'Without a barrier, yes.' },
        { q: 'You are sure you made wudhu, then doubt if you broke it. You…', o: ['Must redo wudhu', 'Still have wudhu', 'Must do ghusl', 'Pray without wudhu'], a: 1, e: 'Certainty is not removed by doubt.' },
        { t: 'tf', q: 'Eating food breaks wudhu.', a: false, e: 'Not in the Shafi’i school.' },
      ] },
    { id: 'rukun', unit: 3, title: 'The 13 pillars', blurb: 'Miss one and the prayer is not complete.',
      cards: [
        { type: 'rukun' },
        { type: 'text', title: 'Pillar or sunnah?', body: 'A pillar (rukun) is the prayer itself: leave one and it is not valid. A sunnah ab’adh (like the first Tashahhud) is not a pillar, but leaving it calls for sujud sahwi. Other sunnah (like doa iftitah) add reward; leaving them needs nothing.' },
      ],
      quiz: [
        { t: 'classify', q: 'Pillar or sunnah?', buckets: ['Rukun', 'Sunnah'], items: [['Al-Fatihah', 0], ['Doa iftitah', 1], ['First salam', 0], ['Second salam', 1], ['Ruku’', 0], ['A surah after Fatihah', 1]] },
        { q: 'How many pillars are there in the Shafi’i school (common count)?', o: ['10', '13', '15', '17'], a: 1, e: '13. Some books count stillness separately and get 17.' },
        { q: 'Which pillar lives in the heart?', o: ['Takbir', 'Niat', 'Tertib', 'Salam'], a: 1, e: 'Niat is the only pillar of the heart.' },
        { t: 'tf', q: 'The first Tashahhud is a pillar.', a: false, e: 'It is sunnah ab’adh. Forgetting it calls for sujud sahwi.' },
        { t: 'order', q: 'Order these pillars.', items: ['Takbiratul ihram', 'Al-Fatihah', 'Ruku’', 'I’tidal', 'Sujud'] },
      ] },
    { id: 'fatihah', unit: 3, title: 'Al-Fatihah done right', blurb: '7 verses, 14 shaddah, zero shortcuts.',
      cards: [
        { type: 'quote', text: 'There is no prayer for the one who does not recite the Opening of the Book.', src: 'al-Bukhari 756; Muslim 394' },
        { type: 'surah', id: 'fatihah' },
        { type: 'text', title: '14 shaddah', body: 'Verse 1: 3 · verse 2: 2 · verse 3: 2 · verse 4: 1 · verse 5: 2 · verse 6: 1 · verse 7: 3. In the Shafi’i school a dropped shaddah is a dropped letter.' },
      ],
      quiz: [
        { q: 'How many shaddah in Al-Fatihah (with Basmalah)?', o: ['10', '12', '14', '16'], a: 2, e: '3+2+2+1+2+1+3 = 14.' },
        { q: '“Iyyāka” without its shaddah means…', o: ['Only You', 'Sunlight', 'We worship', 'Guide us'], a: 1, e: 'Which is why the shaddah matters.' },
        { q: 'Which is correct?', o: ['anʿamtu ʿalaihim', 'anʿamta ʿalaihim', 'anʿamti ʿalaihim', 'anʿamtum ʿalaihim'], a: 1, e: '“anʿamta”: You blessed. “anʿamtu” would mean I blessed.' },
        { t: 'tf', q: 'In the Shafi’i school the Basmalah is a verse of Al-Fatihah.', a: true, e: 'Leaving it out leaves the Fatihah incomplete.' },
        { q: 'The ḥ in “al-ḥamdu” is pronounced from…', o: ['The lips', 'The middle of the throat', 'The nose', 'The tip of the tongue'], a: 1, e: 'ح is a throat letter. A plain h (ه) changes the word.' },
      ] },
    { id: 'stand', unit: 3, title: 'Standing & bowing', blurb: 'Takbir, qiyam, ruku’, i’tidal.',
      cards: [
        { type: 'figure', pose: 'takbir', ov: [], title: 'Takbir', body: 'Palms to the qiblah, fingertips level with the tops of the ears, thumbs near the earlobes.' },
        { type: 'figure', pose: 'qiyam', ov: ['gaze'], title: 'Qiyam', body: 'Right hand over the left wrist, below the chest. Eyes on the place of sujud.' },
        { type: 'figure', pose: 'ruku', ov: ['level'], title: 'Ruku’', body: 'Back and neck in one flat line. Palms grip the knees, fingers spread. Settle.' },
        { type: 'figure', pose: 'itidal', ov: [], title: 'I’tidal', body: 'Fully upright, arms at the sides, still, before going down.' },
      ],
      quiz: [
        { q: 'In qiyam, the eyes look at…', o: ['The imam', 'The place of sujud', 'Straight ahead', 'They are closed'], a: 1, e: 'The place of sujud.' },
        { q: 'In ruku’, the back should be…', o: ['Rounded', 'Flat, level with the head', 'Upright', 'Lower than the head'], a: 1, e: 'Flat enough that water would not spill.' },
        { t: 'tf', q: 'In the Shafi’i school, the hands are placed below the chest and above the navel.', a: true, e: 'Right hand over the left.' },
        { q: 'What do you say while rising from ruku’?', o: ['Allāhu akbar', 'Samiʿallāhu liman ḥamidah', 'Subḥāna rabbiyal-ʿaẓīm', 'Āmīn'], a: 1, e: 'Then “Rabbanā lakal-ḥamd” once upright.' },
      ] },
    { id: 'sujud', unit: 3, title: 'Sujud & sitting', blurb: 'Seven parts, two ways to sit.',
      cards: [
        { type: 'quote', text: 'I have been commanded to prostrate on seven bones: the forehead (and he pointed to his nose), the two hands, the two knees and the ends of the two feet.', src: 'al-Bukhari 812; Muslim 490' },
        { type: 'figure', pose: 'sujud', ov: ['contacts'], title: 'Sujud', body: 'Forehead and nose, two palms, two knees, toes of both feet. Hips higher than the head. Forehead partly bare.' },
        { type: 'figure', pose: 'iftirasy', ov: [], title: 'Iftirasy', body: 'Sit on the left foot, right foot upright. Used between sujud and in the first Tashahhud.' },
        { type: 'figure', pose: 'tawarruk', ov: ['point'], title: 'Tawarruk', body: 'Left hip on the floor, left foot out under the right shin. Used in the final Tashahhud.' },
      ],
      quiz: [
        { q: 'How many body parts must touch the ground in sujud?', o: ['5', '6', '7', '8'], a: 2, e: 'Forehead (with nose), 2 palms, 2 knees, 2 sets of toes.' },
        { t: 'tf', q: 'Sujud on a cap that fully covers the forehead is valid in the Shafi’i school.', a: false, e: 'Part of the forehead must touch the ground bare.' },
        { q: 'Which sitting is used in the final Tashahhud?', o: ['Iftirasy', 'Tawarruk', 'Cross-legged', 'Squatting'], a: 1, e: 'Tawarruk. Iftirasy is for every other sitting.' },
        { q: 'In sujud, hips should be…', o: ['On the heels', 'Level with the head', 'Higher than the head', 'Touching the floor'], a: 2, e: 'A Shafi’i requirement.' },
        { t: 'tf', q: 'Men should keep the forearms flat on the floor in sujud.', a: false, e: 'Forbidden: “like a dog spreads its arms” (al-Bukhari 822).' },
      ] },
    { id: 'tashahhud', unit: 3, title: 'Tashahhud & salam', blurb: 'The words that close the prayer.',
      cards: [
        { type: 'dua', id: 'tashahhud' },
        { type: 'dua', id: 'salawat' },
        { type: 'dua', id: 'salam' },
      ],
      quiz: [
        { q: 'At which word is the index finger raised?', o: ['At-taḥiyyātu', 'As-salāmu', 'Illallāh', 'Muḥammad'], a: 2, e: 'At “illallāh”, kept raised and still.' },
        { t: 'tf', q: 'The Selawat in the final Tashahhud is a pillar.', a: true, e: 'At minimum: “Allāhumma ṣalli ʿalā Muḥammad”.' },
        { q: 'Which salam is a pillar?', o: ['Only the first', 'Only the second', 'Both', 'Neither'], a: 0, e: 'The second is sunnah.' },
        { q: '“As-salāmu ʿalainā wa ʿalā ʿibādillāhiṣ-ṣāliḥīn” means…', o: ['Peace be upon you, O Prophet', 'Peace be upon us and the righteous servants of Allah', 'All greetings are for Allah', 'I bear witness'], a: 1, e: 'It includes every righteous servant in heaven and earth (al-Bukhari 831).' },
      ] },
    { id: 'mistakes', unit: 4, title: 'The 12 common mistakes', blurb: 'Small slips that cost the most.',
      cards: [{ type: 'mistakes' }],
      quiz: [
        { q: 'The Prophet ﷺ told a man “Go back and pray, for you have not prayed” because he…', o: ['Prayed too long', 'Prayed without stillness', 'Prayed in the wrong place', 'Prayed silently'], a: 1, e: 'al-Bukhari 757; Muslim 397.' },
        { t: 'tf', q: 'Reading Al-Fatihah only in your heart, without moving the tongue, is valid.', a: false, e: 'Recitation must be audible to yourself.' },
        { q: 'Moving ahead of the imam was likened to…', o: ['A thief', 'A donkey’s head', 'A crow pecking', 'A fox'], a: 1, e: 'al-Bukhari 691.' },
        { q: 'A man’s shirt rides up in sujud, exposing his lower back. This…', o: ['Is fine', 'Exposes aurat', 'Is sunnah', 'Only matters in a mosque'], a: 1, e: 'The lower back near the navel line is aurat.' },
        { t: 'tf', q: 'The toes may lift off the floor during sujud.', a: false, e: 'They are one of the seven parts.' },
      ] },
    { id: 'sahwi', unit: 4, title: 'Sujud sahwi & what breaks solat', blurb: 'What to do when you slip.',
      cards: [
        { type: 'items', title: 'When to make sujud sahwi', items: sahwi.when },
        { type: 'list', title: 'How', items: sahwi.how },
        { type: 'text', title: 'Missed a pillar?', body: sahwi.rukunNote },
        { type: 'items', title: 'What breaks the prayer', items: invalidators },
      ],
      quiz: [
        { q: 'Unsure whether you prayed 3 or 4 rakaat. You…', o: ['Take 4 and finish', 'Take 3, pray one more, then sujud sahwi', 'Restart', 'Ask someone'], a: 1, e: 'Take the lower number.' },
        { q: 'In the Shafi’i school, sujud sahwi is done…', o: ['After salam', 'Before salam', 'Before the Tashahhud', 'Only in congregation'], a: 1, e: 'After the doa, before salam.' },
        { t: 'tf', q: 'Sujud sahwi makes up for a forgotten ruku’.', a: false, e: 'A missed pillar must be redone; that rakaat does not count.' },
        { q: 'Which breaks the prayer?', o: ['Scratching once', 'Three big consecutive movements', 'Swallowing saliva', 'Smiling'], a: 1, e: 'Three consecutive large movements.' },
        { t: 'tf', q: 'Forgetting the qunut in Subuh calls for sujud sahwi.', a: true, e: 'It is sunnah ab’adh.' },
      ] },
    { id: 'khushu', unit: 4, title: 'Khushu’: a present heart', blurb: 'The inner half of a perfect prayer.',
      cards: [
        { type: 'quote', text: 'Successful indeed are the believers: those who are humble in their prayers.', src: 'Quran 23:1–2' },
        { type: 'items', title: '10 habits of presence', items: khushu },
      ],
      quiz: [
        { q: 'Where are you closest to Allah in prayer?', o: ['Qiyam', 'Ruku’', 'Sujud', 'Tashahhud'], a: 2, e: 'Muslim 482.' },
        { t: 'tf', q: 'Allah responds to each verse of Al-Fatihah as you recite it.', a: true, e: 'Hadith qudsi, Muslim 395.' },
        { q: '“Pray a farewell prayer” means pray as if…', o: ['You are travelling', 'It is your last', 'You are leading', 'It is Friday'], a: 1, e: 'Ibn Majah 4171.' },
        { q: 'Ihsan is to worship Allah…', o: ['Loudly', 'As though you see Him', 'Only in Ramadan', 'In a mosque'], a: 1, e: 'Muslim 8.' },
      ] },
    { id: 'after', unit: 4, title: 'After the prayer', blurb: 'Dhikr that seals the prayer.',
      cards: [
        { type: 'dua', id: 'istighfar' },
        { type: 'dua', id: 'antas-salam' },
        { type: 'dua', id: 'kursi' },
        { type: 'text', title: '33 · 33 · 33 · 1', body: 'Subḥānallāh 33, Al-ḥamdu lillāh 33, Allāhu akbar 33, then the tahlil to make 100. Use the counter in Track.' },
        { type: 'dua', id: 'ainni' },
      ],
      quiz: [
        { q: 'What is said first after salam?', o: ['Allāhu akbar', 'Astaghfirullāh ×3', 'Āmīn', 'Al-Fatihah'], a: 1, e: 'Muslim 591.' },
        { t: 'order', q: 'Order the tasbih after prayer.', items: ['Subḥānallāh ×33', 'Al-ḥamdu lillāh ×33', 'Allāhu akbar ×33', 'Lā ilāha illallāh… (100th)'] },
        { q: 'Reciting Ayat al-Kursi after every prayer: nothing stands between you and Paradise except…', o: ['Fasting', 'Death', 'Hajj', 'Charity'], a: 1, e: 'an-Nasa’i, as-Sunan al-Kubra.' },
        { t: 'tf', q: 'Doa in your own language is fine after salam.', a: true, e: 'Inside the prayer, use Arabic.' },
      ] },
  ];

  const units = [
    { n: 1, title: 'Foundations' },
    { n: 2, title: 'Before you pray' },
    { n: 3, title: 'The prayer, pillar by pillar' },
    { n: 4, title: 'Perfect it' },
  ];

  const badges = [
    { id: 'first', t: 'Bismillah', d: 'Finish your first lesson' },
    { id: 'perfect', t: 'Flawless', d: 'Finish a quiz with no mistakes' },
    { id: 'fatihah', t: 'Fatihah Keeper', d: 'Ace the Al-Fatihah lesson' },
    { id: 'unit1', t: 'Foundations', d: 'Finish unit 1' },
    { id: 'unit2', t: 'Purified', d: 'Finish unit 2' },
    { id: 'unit3', t: 'Pillar by Pillar', d: 'Finish unit 3' },
    { id: 'unit4', t: 'Muhsin', d: 'Finish unit 4' },
    { id: 'guided', t: 'First Rakaat', d: 'Complete a guided prayer' },
    { id: 'five', t: 'All Five', d: 'Log all five prayers in a day' },
    { id: 'tasbih', t: '100 Remembrances', d: 'Complete a full tasbih set' },
    { id: 'streak3', t: '3-Day Streak', d: 'Learn or pray 3 days running' },
    { id: 'streak7', t: '7-Day Streak', d: 'A full week' },
    { id: 'streak30', t: '30-Day Streak', d: 'A habit for life' },
    { id: 'hafiz', t: 'Memoriser', d: 'Master 3 surahs or doas' },
  ];

  const levels = [
    { xp: 0, t: 'Seeker' }, { xp: 120, t: 'Learner' }, { xp: 300, t: 'Steady' }, { xp: 550, t: 'Devoted' },
    { xp: 900, t: 'Mindful' }, { xp: 1400, t: 'Muhsin' },
  ];

  global.SOLAT = { prayers, niat, duas, surahs, steps, rukun, syarat, sunnahAbadh, sunnahHaiah, invalidators, mistakes, khushu, sahwi, wudhu, women, timeline, lessons, units, badges, levels };
})(window);
