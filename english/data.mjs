// Original duration and instructional runtime are tracked separately.
export const REVIEW_DATE = '2026-11-20';
export const stages = [
  {
    "id": "warmup",
    "number": "01",
    "range": "01—10",
    "title": "短篇里，建立听感",
    "short": "短篇热身",
    "en": "START SMALL",
    "icon": "headphones",
    "description": "3～7 分钟，出行、饮食、科学与学习。",
    "goal": "理解整篇，跟读重点，讲清一个小话题。"
  },
  {
    "id": "bridge",
    "number": "02",
    "range": "11—15",
    "title": "把观点，说成自己的话",
    "short": "表达过渡",
    "en": "BUILD YOUR VOICE",
    "icon": "message",
    "description": "9～15 分钟，跟上故事与观点展开。",
    "goal": "复述结构、讲自己的例子、回应追问。"
  },
  {
    "id": "deep",
    "number": "03",
    "range": "16—40",
    "title": "25 篇长听，打开世界",
    "short": "长篇深听",
    "en": "GO DEEPER",
    "icon": "globe",
    "description": "18～25 分钟完整内容，演讲、播客与新闻。",
    "goal": "连续理解、整理证据，在不同话题中交流。"
  },
  {
    "id": "screen",
    "number": "04",
    "range": "41—45",
    "title": "走进场景，听懂语气",
    "short": "影视精听",
    "en": "LIFE ON SCREEN",
    "icon": "screen",
    "description": "B 站与 YouTube 片段教学，拆解真实语流。",
    "goal": "听出省略、态度与笑点，换角色接话。"
  }
];

export const availability = {
  "text": {
    "label": "英文文本 / 字幕已核验",
    "short": "英文文本 / 字幕",
    "note": "文本与字幕类型见每个来源的说明。YouTube 已核对视频标题、频道、时长及播放器返回状态；未逐条完成浏览器播放测试。"
  },
  "auto": {
    "label": "仅自动英文字幕",
    "short": "自动字幕需核对",
    "note": "视频页和自动英文字幕轨已核验；没有把自动字幕当作人工逐字稿。难句、数字和专名需回到原声确认。"
  },
  "bili": {
    "label": "B 站已抽测起播",
    "short": "B 站已试播",
    "note": "浏览器抽测确认画面起播，未完整观看全片。字幕和教学流程说明依据页面简介及抽看片段；平台内容可能变化。"
  }
};

export const lessons = [
  {
    "id": 1,
    "key": "JgB6-RWnV9M",
    "stage": "warmup",
    "title": "Talking about travel: 🚴🚗🚆 Real Easy English",
    "cn": "城市出行，途中怎么聊",
    "source": "BBC Learning English",
    "speaker": "",
    "type": "短篇对话",
    "duration": "5:02",
    "seconds": 302,
    "accent": "英音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=JgB6-RWnV9M",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "旅行生活",
    "focus": "双人接话、交通方式、偏好与原因。",
    "task": "和搭档安排一次周末出游：比较两种交通方式，回应预算变化，并确认时间。",
    "questions": [
      "What would you recommend, and why?",
      "What if our plans changed at the last minute?",
      "Could you explain the route another way?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "YouTube 英文字幕轨已核验；可用“显示文字记录”辅助精听。",
    "format": "original",
    "transcript": "manual"
  },
  {
    "id": 2,
    "key": "QdE63sYqwd8",
    "stage": "warmup",
    "title": "Why are we all so stressed? ⏲️ 6 Minute English",
    "cn": "为什么大家都这么有压力",
    "source": "BBC Learning English",
    "speaker": "",
    "type": "短篇对话",
    "duration": "6:14",
    "seconds": 374,
    "accent": "英音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=QdE63sYqwd8",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "心理健康",
    "focus": "区分主持人解释和采访原声，练习描述压力来源。",
    "task": "用自己的经历解释一个压力源；先倾听对方的情况，再一起想一个可行改变。",
    "questions": [
      "What did the speaker actually observe?",
      "How does this relate to your experience?",
      "What would you ask before accepting that conclusion?"
    ],
    "phrases": [
      "One possible explanation is…",
      "What helped me was…"
    ],
    "learningNote": "YouTube 英文字幕轨已核验；可用“显示文字记录”辅助精听。",
    "format": "original",
    "transcript": "manual"
  },
  {
    "id": 3,
    "key": "fG7dJ6A3l7w",
    "stage": "warmup",
    "title": "Food and mood ⏲️ 6 Minute English",
    "cn": "食物如何影响心情",
    "source": "BBC Learning English",
    "speaker": "",
    "type": "短篇对话",
    "duration": "6:21",
    "seconds": 381,
    "accent": "英音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=fG7dJ6A3l7w",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "饮食生活",
    "focus": "听出研究、例子和个人感受之间的区别。",
    "task": "向朋友推荐一顿饭，说明口味与感受，再询问饮食偏好和限制。",
    "questions": [
      "What would you recommend to someone trying it for the first time?",
      "What if they had different preferences?",
      "How would you explain the taste or ingredients?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "YouTube 英文字幕轨已核验；可用“显示文字记录”辅助精听。",
    "format": "original",
    "transcript": "manual"
  },
  {
    "id": 4,
    "key": "oHxs1dCUXlI",
    "stage": "warmup",
    "title": "Is our health being affected by microplastics? ⏲️ 6 Minute English",
    "cn": "微塑料与健康：哪些已知，哪些未知",
    "source": "BBC Learning English",
    "speaker": "",
    "type": "短篇对话",
    "duration": "6:29",
    "seconds": 389,
    "accent": "英音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=oHxs1dCUXlI",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "环境科学",
    "focus": "抓术语定义、可能性和不确定性表达。",
    "task": "向不熟悉话题的人解释微塑料；说清报道的主张，并提出一个仍需证据的问题。",
    "questions": [
      "What evidence supports the main claim?",
      "What are the limitations or uncertainties?",
      "How would you explain this to someone new to the topic?"
    ],
    "phrases": [
      "The report suggests that…",
      "We still need to know whether…"
    ],
    "learningNote": "YouTube 英文字幕轨已核验；可用“显示文字记录”辅助精听。",
    "format": "original",
    "transcript": "manual"
  },
  {
    "id": 5,
    "key": "matt_cutts_try_something_new_for_30_days",
    "stage": "warmup",
    "title": "Try something new for 30 days",
    "cn": "一个小挑战，讲清一段改变",
    "source": "TED",
    "speaker": "Matt Cutts",
    "type": "演讲",
    "duration": "3:10",
    "seconds": 190,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=JnfBXjWm7hc",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/matt_cutts_try_something_new_for_30_days",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "个人成长",
    "focus": "按起因、行动、结果组织短叙事。",
    "task": "用 90 秒讲你的 30 天挑战计划；搭档临时提出一个障碍，你调整方案。",
    "questions": [
      "What made you choose that approach?",
      "What would you do if it did not work?",
      "What did you learn from the experience?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 6,
    "key": "samantha_agoos_5_tips_to_improve_your_critical_thinking",
    "stage": "warmup",
    "title": "5 tips to improve your critical thinking",
    "cn": "做决定前，问对问题",
    "source": "TED-Ed",
    "speaker": "Samantha Agoos",
    "type": "科普动画",
    "duration": "4:15",
    "seconds": 255,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=dItUGF8GdTw",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/samantha_agoos_5_tips_to_improve_your_critical_thinking",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "思维决策",
    "focus": "听清五个步骤及其逻辑连接词。",
    "task": "比较两款想买的产品，解释筛选标准、证据来源和最终选择。",
    "questions": [
      "What is the strongest reason for that view?",
      "Can you think of a counterexample?",
      "What would change your mind?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 7,
    "key": "mia_nacamulli_the_benefits_of_a_bilingual_brain",
    "stage": "warmup",
    "title": "The benefits of a bilingual brain",
    "cn": "用英语解释学习英语",
    "source": "TED-Ed",
    "speaker": "Mia Nacamulli",
    "type": "科普动画",
    "duration": "4:48",
    "seconds": 288,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=MMmOLN5zBLY",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/mia_nacamulli_the_benefits_of_a_bilingual_brain",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "语言学习",
    "focus": "理解分类、对比和因果；用简单话解释科学术语。",
    "task": "向朋友复述双语大脑的主要观点，并区分视频中的研究结论与自己的体验。",
    "questions": [
      "How would you put that idea into practice?",
      "How would you know if you were improving?",
      "Could you explain the idea in simpler words?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 8,
    "key": "annie_bosler_and_don_greene_how_to_practice_effectively_for_just_about_anything",
    "stage": "warmup",
    "title": "How to practice effectively...for just about anything",
    "cn": "把练习做得更有效",
    "source": "TED-Ed",
    "speaker": "Annie Bosler and Don Greene",
    "type": "科普动画",
    "duration": "4:35",
    "seconds": 275,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=f2O6mQkFiiw",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/annie_bosler_and_don_greene_how_to_practice_effectively_for_just_about_anything",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "语言学习",
    "focus": "识别过程说明、建议与具体例子。",
    "task": "为一项真实技能设计一周练习安排，说清频率、反馈方式和检验标准。",
    "questions": [
      "How would you put that idea into practice?",
      "How would you know if you were improving?",
      "Could you explain the idea in simpler words?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 9,
    "key": "madhumita_murgia_how_stress_affects_your_brain",
    "stage": "warmup",
    "title": "How stress affects your brain",
    "cn": "压力怎样影响大脑",
    "source": "TED-Ed",
    "speaker": "Madhumita Murgia",
    "type": "科普动画",
    "duration": "4:00",
    "seconds": 240,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=WuyPuH9ojCE",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/madhumita_murgia_how_stress_affects_your_brain",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "心理健康",
    "focus": "拆解因果链与较长的科普句。",
    "task": "用三个步骤解释视频的因果链，再讲一个自己的放松方法及适用场合。",
    "questions": [
      "What did the speaker actually observe?",
      "How does this relate to your experience?",
      "What would you ask before accepting that conclusion?"
    ],
    "phrases": [
      "One possible explanation is…",
      "What helped me was…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 10,
    "key": "claudia_aguirre_what_would_happen_if_you_didn_t_sleep",
    "stage": "warmup",
    "title": "What would happen if you didn't sleep?",
    "cn": "如果一直不睡觉，会发生什么",
    "source": "TED-Ed",
    "speaker": "Claudia Aguirre",
    "type": "科普动画",
    "duration": "4:19",
    "seconds": 259,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=dqONk48l5vY",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/claudia_aguirre_what_would_happen_if_you_didn_t_sleep",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "心理健康",
    "focus": "听出时间线、实验描述和身体反应。",
    "task": "复述一个实验或案例，并与搭档协商更规律的作息计划。",
    "questions": [
      "What did the speaker actually observe?",
      "How does this relate to your experience?",
      "What would you ask before accepting that conclusion?"
    ],
    "phrases": [
      "One possible explanation is…",
      "What helped me was…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 11,
    "key": "julian_treasure_how_to_speak_so_that_people_want_to_listen",
    "stage": "bridge",
    "title": "How to speak so that people want to listen",
    "cn": "让人愿意听你说话",
    "source": "TED",
    "speaker": "Julian Treasure",
    "type": "演讲",
    "duration": "9:44",
    "seconds": 584,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=eIho2S0ZahI",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "沟通表达",
    "focus": "听懂列举与示范，模仿重音、停顿和音高。",
    "task": "准备一个 60 秒提议，录两遍比较清晰度；请搭档复述他听到的重点。",
    "questions": [
      "What did you mean by that?",
      "Could you give me a specific example?",
      "How would you respond to a different opinion?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 12,
    "key": "celeste_headlee_10_ways_to_have_a_better_conversation",
    "stage": "bridge",
    "title": "10 ways to have a better conversation",
    "cn": "把观点变成真正的对话",
    "source": "TED",
    "speaker": "Celeste Headlee",
    "type": "演讲",
    "duration": "11:20",
    "seconds": 680,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=R1vskiVDwl4",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/celeste_headlee_10_ways_to_have_a_better_conversation",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "沟通表达",
    "focus": "理解建议、例子与转折；练追问而非只讲自己。",
    "task": "聊一次难忘经历，完成 8 个来回；至少两次根据对方刚说的细节继续问。",
    "questions": [
      "What did you mean by that?",
      "Could you give me a specific example?",
      "How would you respond to a different opinion?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 13,
    "key": "robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
    "stage": "bridge",
    "title": "What makes a good life? Lessons from the longest study on happiness",
    "cn": "好生活和关系有什么联系",
    "source": "TED",
    "speaker": "Robert Waldinger",
    "type": "演讲",
    "duration": "12:37",
    "seconds": 757,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=8KkKuTCFvzI",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "人际关系",
    "focus": "跟住研究背景、发现与结论。",
    "task": "用两分钟向朋友介绍研究，讨论一个你愿意改变的相处习惯。",
    "questions": [
      "What matters most to each person here?",
      "Have you experienced anything similar?",
      "What would you say if your friend disagreed?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 14,
    "key": "tim_urban_inside_the_mind_of_a_master_procrastinator",
    "stage": "bridge",
    "title": "Inside the mind of a master procrastinator",
    "cn": "拖延的大脑剧场",
    "source": "TED",
    "speaker": "Tim Urban",
    "type": "演讲",
    "duration": "13:54",
    "seconds": 834,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=arj7oStGLkU",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "个人成长",
    "focus": "跟住故事、比喻、笑点和回扣。",
    "task": "解释视频中的两个比喻，再描述一次拖延；提出能在今天执行的一步。",
    "questions": [
      "What made you choose that approach?",
      "What would you do if it did not work?",
      "What did you learn from the experience?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 15,
    "key": "kelly_mcgonigal_how_to_make_stress_your_friend",
    "stage": "bridge",
    "title": "How to make stress your friend",
    "cn": "换个角度理解压力",
    "source": "TED",
    "speaker": "Kelly McGonigal",
    "type": "演讲",
    "duration": "14:15",
    "seconds": 855,
    "accent": "英语原声",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=RcGyVTAoXEU",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "心理健康",
    "focus": "识别证据、主张与建议，不把相关性复述成因果。",
    "task": "概括演讲观点，再提出一个保留意见；和搭档讨论一次有挑战但有意义的经历。",
    "questions": [
      "What did the speaker actually observe?",
      "How does this relate to your experience?",
      "What would you ask before accepting that conclusion?"
    ],
    "phrases": [
      "One possible explanation is…",
      "What helped me was…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 16,
    "key": "susan_cain_the_power_of_introverts",
    "stage": "deep",
    "title": "The power of introverts",
    "cn": "内向者的力量",
    "source": "TED",
    "speaker": "Susan Cain",
    "type": "演讲",
    "duration": "18:47",
    "seconds": 1127,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1UW411i7Lq/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：零零落落流泪"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=c0KYU2j0TM4",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/susan_cain_the_power_of_introverts",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "人际关系",
    "focus": "个人叙事如何转向社会观察；理解安静与害羞的区别。",
    "task": "复述三个要点，再与搭档讨论独立思考和小组讨论各适合什么任务。",
    "questions": [
      "What matters most to each person here?",
      "Have you experienced anything similar?",
      "What would you say if your friend disagreed?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 17,
    "key": "brene_brown_the_power_of_vulnerability",
    "stage": "deep",
    "title": "The power of vulnerability",
    "cn": "脆弱、勇气与联结",
    "source": "TED",
    "speaker": "Brené Brown",
    "type": "演讲",
    "duration": "20:02",
    "seconds": 1202,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1J7411v71G/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：TED英语演说"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=iCvmsMzlF7o",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "人际关系",
    "focus": "听出讲者自嘲、态度变化与抽象概念。",
    "task": "讲一次愿意承认不知道的经历，回答对方的追问，并尊重个人边界。",
    "questions": [
      "What matters most to each person here?",
      "Have you experienced anything similar?",
      "What would you say if your friend disagreed?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 18,
    "key": "dan_gilbert_the_surprising_science_of_happiness",
    "stage": "deep",
    "title": "The surprising science of happiness",
    "cn": "幸福是怎样被感知的",
    "source": "TED",
    "speaker": "Dan Gilbert",
    "type": "演讲",
    "duration": "20:51",
    "seconds": 1251,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=LTO_dZUvbJA",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "思维决策",
    "focus": "抓实验条件、结果和解释，避免只记结论。",
    "task": "选一个实验说明设计与结果，再讨论它能否解释你的一次选择。",
    "questions": [
      "What is the strongest reason for that view?",
      "Can you think of a counterexample?",
      "What would change your mind?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 19,
    "key": "barry_schwartz_the_paradox_of_choice",
    "stage": "deep",
    "title": "The paradox of choice",
    "cn": "选择越多，一定越好吗",
    "source": "TED",
    "speaker": "Barry Schwartz",
    "type": "演讲",
    "duration": "19:23",
    "seconds": 1163,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1WQ4y1N7Dh/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：大明爱吃冰激凌"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=VO6XEQIsCoM",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/barry_schwartz_the_paradox_of_choice",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "思维决策",
    "focus": "听懂反问、夸张、对比和让步。",
    "task": "用购物或选工具的例子解释选择的代价；对方举反例时，调整你的观点。",
    "questions": [
      "What is the strongest reason for that view?",
      "Can you think of a counterexample?",
      "What would change your mind?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 20,
    "key": "elizabeth_gilbert_your_elusive_creative_genius",
    "stage": "deep",
    "title": "Your elusive creative genius",
    "cn": "创造力与创作压力",
    "source": "TED",
    "speaker": "Elizabeth Gilbert",
    "type": "演讲",
    "duration": "19:14",
    "seconds": 1154,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=86x-u-tz0MA",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/elizabeth_gilbert_your_elusive_creative_genius",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "文化艺术",
    "focus": "跟住长故事中的转折、引用与抽象比喻。",
    "task": "讲一个创作遇到瓶颈的故事；提出一种减轻压力的做法并说明理由。",
    "questions": [
      "What background would help someone understand this?",
      "How does this compare with your own experience?",
      "Can you tell a story that shows another side?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 21,
    "key": "ken_robinson_do_schools_kill_creativity",
    "stage": "deep",
    "title": "Do schools kill creativity?",
    "cn": "学校会扼杀创造力吗",
    "source": "TED",
    "speaker": "Sir Ken Robinson",
    "type": "演讲",
    "duration": "19:11",
    "seconds": 1151,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1VV4y1C7FR/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：TED超级演讲家"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=iG9CE55wbtY",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/ken_robinson_do_schools_kill_creativity",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      },
      {
        "label": "B 站 · 英文字幕版",
        "url": "https://www.bilibili.com/video/BV1VV4y1C7FR/?p=2",
        "platform": "bilibili",
        "kind": "video",
        "check": "metadata",
        "note": "分 P 标题与时长已核对，未单独试播 · UP：TED超级演讲家"
      },
      {
        "label": "B 站 · 无字幕盲听版",
        "url": "https://www.bilibili.com/video/BV1VV4y1C7FR/?p=3",
        "platform": "bilibili",
        "kind": "video",
        "check": "metadata",
        "note": "分 P 标题与时长已核对，未单独试播 · UP：TED超级演讲家"
      }
    ],
    "topic": "教育社会",
    "focus": "理解英式幽默、故事与论证的连接。",
    "task": "复述一个故事如何支持主张；讨论一项学校或培训制度的改进，回应反对意见。",
    "questions": [
      "What was observed, and what was inferred?",
      "Who might benefit from this approach?",
      "What would you change, and how would you evaluate it?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 22,
    "key": "chimamanda_ngozi_adichie_the_danger_of_a_single_story",
    "stage": "deep",
    "title": "The danger of a single story",
    "cn": "单一故事如何形成偏见",
    "source": "TED",
    "speaker": "Chimamanda Ngozi Adichie",
    "type": "演讲",
    "duration": "18:32",
    "seconds": 1112,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1wJ411o71L/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：C语言____"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=D9Ihs241zeg",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "文化艺术",
    "focus": "听出叙事视角、文化背景与观点递进。",
    "task": "介绍你的家乡，给出两个互补的故事，再解释一个常见误解。",
    "questions": [
      "What background would help someone understand this?",
      "How does this compare with your own experience?",
      "Can you tell a story that shows another side?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 23,
    "key": "jill_bolte_taylor_my_stroke_of_insight",
    "stage": "deep",
    "title": "My stroke of insight",
    "cn": "从个人经历讲述大脑",
    "source": "TED",
    "speaker": "Jill Bolte Taylor",
    "type": "演讲",
    "duration": "18:24",
    "seconds": 1104,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=UyyjU8fzEYU",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/jill_bolte_taylor_my_stroke_of_insight",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "心理健康",
    "focus": "医学词汇、时间线与感官描述；区分经历和解释。",
    "task": "按事件顺序复述讲者经历，用通俗词替换术语；说明哪些是个人感受。",
    "questions": [
      "What did the speaker actually observe?",
      "How does this relate to your experience?",
      "What would you ask before accepting that conclusion?"
    ],
    "phrases": [
      "One possible explanation is…",
      "What helped me was…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 24,
    "key": "hans_rosling_the_best_stats_you_ve_ever_seen",
    "stage": "deep",
    "title": "The best stats you've ever seen",
    "cn": "用数据重新理解世界",
    "source": "TED",
    "speaker": "Hans Rosling",
    "type": "演讲",
    "duration": "19:36",
    "seconds": 1176,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=RUwS1uAdUcI",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "数据经济",
    "focus": "边听边读图，练数字、趋势、比例与比较。",
    "task": "挑一张图做 90 秒讲解：先说指标，再说变化，最后说局限。数据属于演讲当时。",
    "questions": [
      "What does this number or comparison tell us?",
      "Whose point of view are you describing?",
      "What information is still missing?"
    ],
    "phrases": [
      "The figures show a change in…",
      "That depends on how we measure…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。 这是历史演讲，图表数字不代表当前世界状况。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 25,
    "key": "jamie_oliver_teach_every_child_about_food",
    "stage": "deep",
    "title": "Teach every child about food",
    "cn": "食物教育与公共健康",
    "source": "TED",
    "speaker": "Jamie Oliver",
    "type": "演讲",
    "duration": "21:31",
    "seconds": 1291,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=go_QOzc79Uc",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/jamie_oliver_teach_every_child_about_food",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "饮食生活",
    "focus": "听懂情绪性倡议、统计数字与行动建议。",
    "task": "提出一个改善食堂或家庭饮食的方案，回应成本和口味方面的顾虑。",
    "questions": [
      "What would you recommend to someone trying it for the first time?",
      "What if they had different preferences?",
      "How would you explain the taste or ingredients?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 26,
    "key": "jane_mcgonigal_gaming_can_make_a_better_world",
    "stage": "deep",
    "title": "Gaming can make a better world",
    "cn": "游戏怎样影响现实生活",
    "source": "TED",
    "speaker": "Jane McGonigal",
    "type": "演讲",
    "duration": "19:46",
    "seconds": 1186,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=dE1DuBesGYM",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/jane_mcgonigal_gaming_can_make_a_better_world",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "科技生活",
    "focus": "听懂从游戏机制到社会问题的类比。",
    "task": "向不玩游戏的人解释一个机制，再讨论它在学习或协作中是否适用。",
    "questions": [
      "What problem is this trying to solve?",
      "What might be an unintended consequence?",
      "Would you use it in your own life? Why?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 27,
    "key": "sugata_mitra_build_a_school_in_the_cloud",
    "stage": "deep",
    "title": "Build a School in the Cloud",
    "cn": "孩子怎样自主学习",
    "source": "TED",
    "speaker": "Sugata Mitra",
    "type": "演讲",
    "duration": "22:14",
    "seconds": 1334,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=y3jYVe1RGaU",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/sugata_mitra_build_a_school_in_the_cloud",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "教育社会",
    "focus": "抓实验情境、观察结果、限制与愿景。",
    "task": "介绍一个学习实验，分别说明观察到什么、讲者怎样解释、你还想知道什么。",
    "questions": [
      "What was observed, and what was inferred?",
      "Who might benefit from this approach?",
      "What would you change, and how would you evaluate it?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 28,
    "key": "sherry_turkle_connected_but_alone",
    "stage": "deep",
    "title": "Connected, but alone?",
    "cn": "在线联结与真实陪伴",
    "source": "TED",
    "speaker": "Sherry Turkle",
    "type": "演讲",
    "duration": "19:31",
    "seconds": 1171,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=t7Xr3AsBEK4",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/sherry_turkle_connected_but_alone",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "科技生活",
    "focus": "跟住访谈引用、个人例子和反思。",
    "task": "和搭档商量一次不被手机打断的聚会，说明原因，并接受合理例外。",
    "questions": [
      "What problem is this trying to solve?",
      "What might be an unintended consequence?",
      "Would you use it in your own life? Why?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 29,
    "key": "suzanne_simard_how_trees_talk_to_each_other",
    "stage": "deep",
    "title": "How trees talk to each other",
    "cn": "森林里的相互联系",
    "source": "TED",
    "speaker": "Suzanne Simard",
    "type": "演讲",
    "duration": "18:09",
    "seconds": 1089,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1hs411h7Hm/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：青知字幕组"
      },
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=Un2yBgIAxYs",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/suzanne_simard_how_trees_talk_to_each_other",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "环境科学",
    "focus": "理解实验过程、物种关系与科普比喻。",
    "task": "画三节点关系图并用英语解释；区分实验发现、比喻和推广性主张。",
    "questions": [
      "What evidence supports the main claim?",
      "What are the limitations or uncertainties?",
      "How would you explain this to someone new to the topic?"
    ],
    "phrases": [
      "The report suggests that…",
      "We still need to know whether…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 30,
    "key": "sal_khan_let_s_use_video_to_reinvent_education",
    "stage": "deep",
    "title": "Let's use video to reinvent education",
    "cn": "视频怎样改变学习方式",
    "source": "TED",
    "speaker": "Sal Khan",
    "type": "演讲",
    "duration": "20:10",
    "seconds": 1210,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=nTFEUsudhfs",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "教育社会",
    "focus": "听懂演示中的指代、步骤与学习反馈。",
    "task": "推荐一种学习工具，现场讲解一次用法，再回答“对什么人可能不合适”。",
    "questions": [
      "What was observed, and what was inferred?",
      "Who might benefit from this approach?",
      "What would you change, and how would you evaluate it?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 31,
    "key": "dan_pink_the_puzzle_of_motivation",
    "stage": "deep",
    "title": "The puzzle of motivation",
    "cn": "什么真正驱动我们行动",
    "source": "TED",
    "speaker": "Dan Pink",
    "type": "演讲",
    "duration": "18:22",
    "seconds": 1102,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=rrkrvAUbU9Y",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/dan_pink_the_puzzle_of_motivation",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "思维决策",
    "focus": "对比奖励、动机与任务类型，识别论证范围。",
    "task": "设计一次学习小组或团队的激励方式，比较两种方案，并回应一个反例。",
    "questions": [
      "What is the strongest reason for that view?",
      "Can you think of a counterexample?",
      "What would change your mind?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 32,
    "key": "ken_robinson_how_to_escape_education_s_death_valley",
    "stage": "deep",
    "title": "How to escape education's death valley",
    "cn": "给学习创造什么条件",
    "source": "TED",
    "speaker": "Sir Ken Robinson",
    "type": "演讲",
    "duration": "18:57",
    "seconds": 1137,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=wX78iKhInsc",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/ken_robinson_how_to_escape_education_s_death_valley",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "教育社会",
    "focus": "听出三个原则、类比和幽默反转。",
    "task": "用自己的经历解释一个原则，提出一条可操作的小改动，并说明如何评估。",
    "questions": [
      "What was observed, and what was inferred?",
      "Who might benefit from this approach?",
      "What would you change, and how would you evaluate it?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 33,
    "key": "jared_diamond_why_do_societies_collapse",
    "stage": "deep",
    "title": "Why do societies collapse?",
    "cn": "社会为什么会衰落",
    "source": "TED",
    "speaker": "Jared Diamond",
    "type": "演讲",
    "duration": "18:01",
    "seconds": 1081,
    "accent": "多口音 / 真实语速",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=IESYMFtLIis",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      },
      {
        "label": "TED · 视频与英文逐字稿",
        "url": "https://www.ted.com/talks/jared_diamond_why_do_societies_collapse",
        "platform": "ted",
        "kind": "transcript",
        "check": "text",
        "note": "官方英文逐字稿正文已读取"
      }
    ],
    "topic": "历史社会",
    "focus": "跟住多因素解释；区分例子、关联和因果。",
    "task": "选一个历史例子，说明两个相互作用的因素；回答“能否仅归因于环境”。",
    "questions": [
      "Which factors interacted in this example?",
      "What is the evidence for that explanation?",
      "Could there be a different interpretation?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "TED 原声时长；YouTube 含片头片尾，显示时长可能略长。英文逐字稿已读取。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "official"
  },
  {
    "id": 34,
    "key": "5BMlBhM2pHU",
    "stage": "deep",
    "title": "The Easy English Podcast #63 - British Culture Quiz",
    "cn": "英国文化问答：边猜边解释",
    "source": "Easy English",
    "speaker": "",
    "type": "双人播客",
    "duration": "23:01",
    "seconds": 1381,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=5BMlBhM2pHU",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "文化生活",
    "focus": "双人问答中的迟疑、猜测、纠正和接话。",
    "task": "和搭档互出五个关于各自文化的问题；不知道时澄清或猜测，别直接结束对话。",
    "questions": [
      "How would you explain this custom to a visitor?",
      "Does everyone follow it in the same way?",
      "What is a similar example from your own culture?"
    ],
    "phrases": [
      "It is common to…, although not everyone does.",
      "Where I grew up, we usually…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 35,
    "key": "hGeQsn2QlJg",
    "stage": "deep",
    "title": "The Easy English Podcast #60 - 5 UNKNOWN British Traditions",
    "cn": "五个不熟悉的英国传统",
    "source": "Easy English",
    "speaker": "",
    "type": "双人播客",
    "duration": "20:13",
    "seconds": 1213,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=hGeQsn2QlJg",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "文化生活",
    "focus": "真实交谈里的插话、补充和文化解释。",
    "task": "挑两个传统向朋友解释，再介绍一个你熟悉的节日习俗并比较异同。",
    "questions": [
      "How would you explain this custom to a visitor?",
      "Does everyone follow it in the same way?",
      "What is a similar example from your own culture?"
    ],
    "phrases": [
      "It is common to…, although not everyone does.",
      "Where I grew up, we usually…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 36,
    "key": "gHSR4-9MzJs",
    "stage": "deep",
    "title": "The Easy English Podcast #77 - A German Reviews Traditional British Food l Easy English 212",
    "cn": "从不同文化评价英国食物",
    "source": "Easy English",
    "speaker": "",
    "type": "双人播客",
    "duration": "19:56",
    "seconds": 1196,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=gHSR4-9MzJs",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "饮食生活",
    "focus": "听出喜恶、委婉评价、味道和质地。",
    "task": "模拟招待海外朋友吃饭：解释菜品、问偏好、回应不喜欢某道菜的意见。",
    "questions": [
      "What would you recommend to someone trying it for the first time?",
      "What if they had different preferences?",
      "How would you explain the taste or ingredients?"
    ],
    "phrases": [
      "One thing that stood out to me was…",
      "In my experience,…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 37,
    "key": "1zQrdBJf4MY",
    "stage": "deep",
    "title": "The Easy English Podcast #78 - 5 Things You Should Never Do in Britain 😳",
    "cn": "礼仪里的文化差异",
    "source": "Easy English",
    "speaker": "",
    "type": "双人播客",
    "duration": "18:32",
    "seconds": 1112,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=1zQrdBJf4MY",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "文化生活",
    "focus": "听懂提醒、语气和情境条件，避免绝对化概括。",
    "task": "给来访者三条具体建议，说明适用场合；对方追问例外时补充解释。",
    "questions": [
      "How would you explain this custom to a visitor?",
      "Does everyone follow it in the same way?",
      "What is a similar example from your own culture?"
    ],
    "phrases": [
      "It is common to…, although not everyone does.",
      "Where I grew up, we usually…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 38,
    "key": "gLvkWpnzba8",
    "stage": "deep",
    "title": "Can the world rely on renewable energy?",
    "cn": "世界能依赖可再生能源吗",
    "source": "BBC News",
    "speaker": "",
    "type": "新闻专题",
    "duration": "24:29",
    "seconds": 1469,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=gLvkWpnzba8",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "环境科学",
    "focus": "跟随主持、采访与场景切换；记录各方论点。",
    "task": "做两分钟新闻简报，说明问题、两个方案及各自限制，再回应“成本怎么办”。",
    "questions": [
      "What evidence supports the main claim?",
      "What are the limitations or uncertainties?",
      "How would you explain this to someone new to the topic?"
    ],
    "phrases": [
      "The report suggests that…",
      "We still need to know whether…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 39,
    "key": "x9b9kCRJJLk",
    "stage": "deep",
    "title": "How the food we eat impacts the planet",
    "cn": "我们吃的食物怎样影响地球",
    "source": "BBC News",
    "speaker": "",
    "type": "新闻专题",
    "duration": "24:27",
    "seconds": 1467,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=x9b9kCRJJLk",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "环境科学",
    "focus": "连接生产、消费与环境影响；辨别事实和倡议。",
    "task": "概括报道中的一条因果链，比较两种选择，并提出一条可实行的改变。",
    "questions": [
      "What evidence supports the main claim?",
      "What are the limitations or uncertainties?",
      "How would you explain this to someone new to the topic?"
    ],
    "phrases": [
      "The report suggests that…",
      "We still need to know whether…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 40,
    "key": "596dU6pDEU8",
    "stage": "deep",
    "title": "Could 'degrowth' save the world?",
    "cn": "经济增长之外，还有什么选择",
    "source": "BBC News",
    "speaker": "",
    "type": "新闻专题",
    "duration": "21:10",
    "seconds": 1270,
    "accent": "多口音 / 真实语速",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=596dU6pDEU8",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      }
    ],
    "topic": "数据经济",
    "focus": "听懂不同立场与抽象经济术语，保留说话者归属。",
    "task": "分别复述两种观点，提出一个共同关心的问题，说明自己的判断和不确定性。",
    "questions": [
      "What does this number or comparison tell us?",
      "Whose point of view are you describing?",
      "What information is still missing?"
    ],
    "phrases": [
      "The figures show a change in…",
      "That depends on how we measure…"
    ],
    "learningNote": "本次只核验到 YouTube 自动英文字幕，不能视为人工逐字稿；先核对数字、专名和难句。 学习整段内容，挑 3～5 分钟精细模仿。",
    "format": "original",
    "transcript": "auto"
  },
  {
    "id": 41,
    "key": "BV15rxt6uEvx",
    "stage": "screen",
    "title": "Friends · Boss Man Bing",
    "cn": "老板腔背后的语气与玩笑",
    "source": "B 站 · 伊琳的小本本",
    "type": "影视片段教学",
    "duration": "教学 4:45",
    "seconds": 285,
    "accent": "美音",
    "availability": "bili",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV15rxt6uEvx/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：伊琳的小本本"
      }
    ],
    "topic": "影视口语",
    "focus": "从语气和人物反应理解模仿与调侃。",
    "task": "用自己的话解释大家为什么模仿 Chandler；换成礼貌表达，再和搭档演一次。",
    "questions": [
      "What does the character want?",
      "What do they mean beyond the literal words?",
      "How would you respond in your own words?"
    ],
    "phrases": [
      "What I meant was…",
      "I thought…, but it turns out…"
    ],
    "learningNote": "这是片段精听教学，不是完整剧集；含重复、字幕或讲解，不计入 25 篇长原声。",
    "flow": "盲听 → 英文字幕 → 中英对照 → 再盲听；简介注明结尾附重点词汇。",
    "format": "guided",
    "transcript": "onscreen"
  },
  {
    "id": 42,
    "key": "BV1ueAZe2EDn",
    "stage": "screen",
    "title": "Modern Family · S01E01 · 片段 01",
    "cn": "家庭对话里的连读与快速回应",
    "source": "B 站 · 美剧英语每日听",
    "type": "影视片段教学",
    "duration": "教学 2:43",
    "seconds": 163,
    "accent": "美音",
    "availability": "bili",
    "resources": [
      {
        "label": "B 站 · 视频直达",
        "url": "https://www.bilibili.com/video/BV1ueAZe2EDn/",
        "platform": "bilibili",
        "kind": "video",
        "check": "playback",
        "note": "浏览器已抽测起播 · UP：美剧英语每日听"
      }
    ],
    "topic": "影视口语",
    "focus": "听懂日常短句、称呼、连读和人物意图。",
    "task": "说明片段人物各自想做什么，再换角色接话，不照背原句。",
    "questions": [
      "What does the character want?",
      "What do they mean beyond the literal words?",
      "How would you respond in your own words?"
    ],
    "phrases": [
      "What I meant was…",
      "I thought…, but it turns out…"
    ],
    "learningNote": "这是片段精听教学，不是完整剧集；含重复、字幕或讲解，不计入 25 篇长原声。",
    "flow": "盲听 → 英文 → 中英 → 跟读 → 盲听；按视频编排练习。",
    "format": "guided",
    "transcript": "onscreen"
  },
  {
    "id": 43,
    "key": "_2zuhPhm_38",
    "stage": "screen",
    "title": "Friends · Joey Finds Out!",
    "cn": "乔伊发现秘密：现成分步词汇课",
    "source": "FluentU English",
    "type": "影视片段教学",
    "duration": "教学 19:04",
    "seconds": 1144,
    "accent": "美音",
    "availability": "auto",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=_2zuhPhm_38",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有自动英文字幕轨，需核对"
      },
      {
        "label": "YouTube · 16:47 直接盲听",
        "url": "https://www.youtube.com/watch?v=_2zuhPhm_38&t=1007s",
        "platform": "youtube",
        "kind": "video",
        "check": "chapters",
        "note": "时间点来自该视频的官方章节说明"
      }
    ],
    "topic": "影视口语",
    "focus": "听懂推测、暗示、误解与恍然大悟。",
    "task": "用 90 秒解释 Joey 怎么发现秘密，再模拟双方澄清误会的对话。",
    "questions": [
      "What does the character want?",
      "What do they mean beyond the literal words?",
      "How would you respond in your own words?"
    ],
    "phrases": [
      "What I meant was…",
      "I thought…, but it turns out…"
    ],
    "learningNote": "这是片段精听教学，不是完整剧集；含重复、字幕或讲解，不计入 25 篇长原声。",
    "flow": "先跳 16:47 无字幕片段盲听 → 00:23 / 12:35 字幕片段 → 01:40 / 13:20 词汇讲解 → 回到 16:47 检验。章节来自视频简介。",
    "format": "guided",
    "transcript": "auto"
  },
  {
    "id": 44,
    "key": "xV-GT84xzE8",
    "stage": "screen",
    "title": "Modern Family · The Supermarket",
    "cn": "超市场景与生活词汇",
    "source": "Learn English With TV Series",
    "type": "影视片段教学",
    "duration": "教学 21:46",
    "seconds": 1306,
    "accent": "美音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=xV-GT84xzE8",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "影视口语",
    "focus": "在日常购物场景里理解人物语气与具体表达。",
    "task": "和搭档模拟购物中的一个小问题：说清需求、询问选择、确认解决办法。",
    "questions": [
      "What does the character want?",
      "What do they mean beyond the literal words?",
      "How would you respond in your own words?"
    ],
    "phrases": [
      "What I meant was…",
      "I thought…, but it turns out…"
    ],
    "learningNote": "这是片段精听教学，不是完整剧集；含重复、字幕或讲解，不计入 25 篇长原声。",
    "flow": "影视片段配英语教学；简介确认超市词汇主题。先看场景，再学解释，最后自行关闭字幕复听；未核验为固定五步编排。",
    "format": "guided",
    "transcript": "manual"
  },
  {
    "id": 45,
    "key": "4BKHL5P6haw",
    "stage": "screen",
    "title": "Friends · Christmas · Pronunciation",
    "cn": "跟 Rachel 拆解真实发音",
    "source": "Rachel’s English",
    "type": "影视片段教学",
    "duration": "教学 31:52",
    "seconds": 1912,
    "accent": "美音",
    "availability": "text",
    "resources": [
      {
        "label": "YouTube · 视频直达",
        "url": "https://www.youtube.com/watch?v=4BKHL5P6haw",
        "platform": "youtube",
        "kind": "video",
        "check": "metadata",
        "note": "页面及播放器信息已核验 · 经代理访问 · 有人工英文字幕轨"
      }
    ],
    "topic": "影视口语",
    "focus": "把熟悉单词在语流中的声音重新对应起来。",
    "task": "选三句易漏听的台词录音对比，再把句型换成自己的节日或聚会情境。",
    "questions": [
      "What does the character want?",
      "What do they mean beyond the literal words?",
      "How would you respond in your own words?"
    ],
    "phrases": [
      "What I meant was…",
      "I thought…, but it turns out…"
    ],
    "learningNote": "这是片段精听教学，不是完整剧集；含重复、字幕或讲解，不计入 25 篇长原声。",
    "flow": "原声片段 + 发音拆解；简介明确讲连读、弱读、重音和音高。分三次练，每次挑 30～60 秒原声，再自行补盲听与复述。",
    "format": "guided",
    "transcript": "manual"
  }
];

export const steps = [
  {
    "title": "盲听抓大意",
    "en": "LISTEN",
    "short": "盲听",
    "icon": "headphones",
    "text": "先关掉字幕听 1～2 遍。只记人物、话题与主旨；不因漏掉一个词暂停整段。",
    "done": "我能说清谁在说、在讲什么、核心意思是什么。",
    "tip": "长材料可以先听完整篇，再选择一个完整场景精学。"
  },
  {
    "title": "精听解难点",
    "en": "NOTICE",
    "short": "精听",
    "icon": "search",
    "text": "打开英文文本，理解整篇的内容与逻辑，重点处理没听出来的句子。分清是生词、连读弱读，还是背景知识；短句循环后再回到上下文。",
    "done": "我理解整篇内容，并能听出重点片段之前漏掉的表达。",
    "tip": "不必全文听写。选 5 个值得带走的词组或句型，用自己的情境造句。"
  },
  {
    "title": "模仿练语流",
    "en": "SHADOW",
    "short": "模仿",
    "icon": "wave",
    "text": "先听一句、暂停模仿，再连成一段。重点是重音、停顿与意群；需要时放慢，最后回到原速并录音对比。",
    "done": "我能以接近原速读顺重点片段，意思和重音清楚。",
    "tip": "短对话可全篇练；长材料选 3～5 分钟。清楚自然即可，不把口音一模一样当作门槛。"
  },
  {
    "title": "脱稿做复述",
    "en": "RETELL",
    "short": "复述",
    "icon": "message",
    "text": "关掉文本，短篇用 1～2 分钟讲核心内容；长篇先用 3～5 分钟复述结构，再练 1～2 分钟简版。先列三个关键词，然后用自己的表达连接起来，并补一个自己的例子。",
    "done": "我能脱稿讲清主要内容，并用自己的例子解释。",
    "tip": "录音后只挑一个最影响理解的问题修改，再说一遍。复述不等于背诵。"
  },
  {
    "title": "迁移到交流",
    "en": "RESPOND",
    "short": "交流",
    "icon": "arrow",
    "text": "请搭档或 AI 换一种问法，并临时追问。练主动提问、确认和协商，再把学到的表达放进自己的工作与生活。",
    "done": "我完成了本课输出任务，并能回应没有提前准备的追问。",
    "tip": "从第一周就开口交流。每完成 5 篇，再用没学过的材料检验迁移。"
  }
];

export const schedules = {
  "20": [
    4,
    7,
    5,
    4
  ],
  "40": [
    5,
    15,
    10,
    10
  ],
  "60": [
    8,
    20,
    15,
    17
  ]
};

export const checkpoints = [
  {
    "after": 5,
    "title": "讲经历，接住追问",
    "task": "用一次真实出行或饮食经历聊 5 分钟，主动追问两次，听不清时请求换说法。"
  },
  {
    "after": 10,
    "title": "把新概念讲明白",
    "task": "换一段陌生的 5 分钟科普，首次盲听后说主旨；查清后用自己的例子解释。"
  },
  {
    "after": 15,
    "title": "观点说清，也容得下不同意见",
    "task": "脱稿说 2 分钟观点；搭档连续追问三次，并给一个反例。"
  },
  {
    "after": 20,
    "title": "从长篇里提炼结构",
    "task": "新听一段 18～25 分钟材料，写主张、理由、例子提纲，用 3 分钟复述。"
  },
  {
    "after": 25,
    "title": "看图说话，解释取舍",
    "task": "用一张陌生图表做简报，准确说明指标和时间，再回应预算或数据方面的问题。"
  },
  {
    "after": 30,
    "title": "讨论不同生活方式",
    "task": "聊饮食、教育或科技，复述对方意见后表达自己的理由，完成 10 个来回。"
  },
  {
    "after": 35,
    "title": "听懂口语里的修正与补充",
    "task": "换一段未学过的双人播客，指出双方在哪些地方同意、纠正或补充。"
  },
  {
    "after": 40,
    "title": "把新闻带进真实交流",
    "task": "看一条新报道，说清事实、来源、各方立场及未知信息，再和搭档讨论影响。"
  },
  {
    "after": 45,
    "title": "在陌生场景里继续说",
    "task": "完成工作协商、陌生新闻复述和一段新剧集理解；分别记录遗漏、澄清与补救。"
  }
];

export const extras = [
  {
    "original": 1,
    "title": "《魔法奇缘》Day 1 · 盲听与词汇解析",
    "source": "浏览器已抽测起播 · UP：TED官方英语",
    "url": "https://www.bilibili.com/video/BV1t84y1974x/",
    "reason": "4:32 教学；含盲听、英文、中英词汇解析、跟读与复听。UP 名称含 TED，但本条是电影片段，未认证为 TED 官方。",
    "status": "B 站 · 已抽测起播"
  },
  {
    "original": 2,
    "title": "Friends 第一季 · 分集学习入口",
    "source": "浏览器已抽测起播 · UP：快来学英语",
    "url": "https://www.bilibili.com/video/BV1CmnnzYEpt/",
    "reason": "页面列出 24 个分 P；P1 为 22:50，已抽测 P1 起播。其他分 P 未逐集试播，字幕与删减请自行核对。",
    "status": "B 站 · 已抽测起播"
  },
  {
    "original": 3,
    "title": "Modern Family 第一季 · 分段跟读入口",
    "source": "浏览器已抽测起播 · UP：美剧anki",
    "url": "https://www.bilibili.com/video/BV1vfFye3E1s/",
    "reason": "S01E01 被拆为 P1～P4，包含教学加工；已抽测 P1。不能把合集总时长当作纯原声时长。",
    "status": "B 站 · 已抽测起播"
  },
  {
    "original": 4,
    "title": "The Office · 影视词汇课",
    "source": "Learn English With TV Series",
    "url": "https://www.youtube.com/watch?v=r3K7sfk7dmY",
    "reason": "21:28 教学，含片段与讲解；自动英文字幕，适合练语气和日常互动，不计长篇原声。",
    "status": "YouTube · 页面已核验"
  }
];
