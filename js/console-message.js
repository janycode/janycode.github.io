/**
 * 🎨 JanyCode Blog - Console Message
 * 当用户打开开发者工具时，在控制台展示精美的寄语
 * 包含：动态随机寄语系统 + 交互式彩蛋
 * 内容：技术名言、个人介绍、博客特色、联系方式
 * 语言：中英双语
 */

(function() {
  'use strict';

  // ============================================
  // 📚 寄语内容库（中英双语）
  // ============================================
  
  const messages = {
    // 技术名言 (Tech Quotes)
    techQuotes: [
      {
        zh: "代码改变世界，技术成就未来！",
        en: "Code changes the world, technology shapes the future!",
        author: ""
      },
      {
        zh: "每一个 Bug 都是成长的机会",
        en: "Every bug is an opportunity to grow",
        author: ""
      },
      {
        zh: "保持学习，保持热爱",
        en: "Keep learning, keep loving",
        author: ""
      },
      {
        zh: "代码如诗，架构如画",
        en: "Code is poetry, architecture is art",
        author: ""
      },
      {
        zh: "The best error message is the one that never shows up.",
        en: "最好的错误信息是永远不出现的那个",
        author: "Thomas Fuchs"
      },
      {
        zh: "First, solve the problem. Then, write the code.",
        en: "先解决问题，再写代码",
        author: "John Johnson"
      },
      {
        zh: "Simplicity is the soul of efficiency.",
        en: "简洁是效率的灵魂",
        author: "Austin Freeman"
      },
      {
        zh: "Talk is cheap. Show me the code.",
        en: "空谈无益，给我看代码",
        author: "Linus Torvalds"
      },
      {
        zh: "任何傻瓜都能写出计算机能理解的代码。优秀的程序员写出人能理解的代码。",
        en: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler"
      },
      {
        zh: "先让它工作，再让它正确，最后让它快速。",
        en: "Make it work, make it right, make it fast.",
        author: "Kent Beck"
      }
    ],

    // 个人介绍 (Personal Introduction)
    personalIntro: [
      {
        zh: "👨‍💻 全栈工程师 | Full-Stack Engineer",
        en: "Passionate about building end-to-end solutions",
        author: ""
      },
      {
        zh: "🚀 热爱技术，热爱分享 | Passionate about tech & sharing",
        en: "Sharing knowledge, inspiring others",
        author: ""
      },
      {
        zh: "💡 专注于前端、后端、架构设计",
        en: "Focus on Frontend, Backend & Architecture Design",
        author: ""
      },
      {
        zh: "🌟 终身学习者 | Lifelong Learner",
        en: "Always exploring, always growing",
        author: ""
      },
      {
        zh: "☕ 代码是我的咖啡，技术是我的动力",
        en: "Code is my coffee, technology is my motivation",
        author: ""
      }
    ],

    // 博客特色 (Blog Features)
    blogFeatures: [
      {
        zh: "📚 全栈技术博客 | Full-Stack Tech Blog",
        en: "Frontend · Backend · Architecture - All covered!",
        author: ""
      },
      {
        zh: "🎯 记录技术成长的点点滴滴",
        en: "Documenting every bit of tech growth",
        author: ""
      },
      {
        zh: "🔥 前沿技术深度解析",
        en: "In-depth analysis of cutting-edge technologies",
        author: ""
      },
      {
        zh: "💎 从入门到精通，保姆级教程",
        en: "From beginner to master, comprehensive tutorials",
        author: ""
      },
      {
        zh: "🌈 实战项目经验分享",
        en: "Real-world project experience sharing",
        author: ""
      }
    ],

    // 联系方式 (Contact)
    contact: [
      {
        zh: "📧 欢迎交流 | Let's Connect!",
        en: "Open to collaboration and discussions",
        author: ""
      },
      {
        zh: "💬 有问题随时联系我",
        en: "Feel free to reach out anytime",
        author: ""
      },
      {
        zh: "🤝 一起学习，一起进步",
        en: "Learn together, grow together",
        author: ""
      }
    ]
  };

  // ============================================
  // 🎨 样式配置
  // ============================================
  
  const styles = {
    // 主标题样式
    mainTitle: 'font-size: 24px; font-weight: bold; color: #4285f4; padding: 10px 0; letter-spacing: 2px;',
    // 副标题样式
    subTitle: 'font-size: 16px; font-weight: bold; color: #34a853; padding: 8px 0;',
    // 装饰线条
    divider: 'font-size: 12px; color: #999; padding: 5px 0; font-family: monospace;',
    // 技术名言
    techQuote: 'font-size: 14px; color: #42f457ff; font-style: italic; padding: 8px 0; line-height: 1.6;',
    // 个人介绍
    personalIntro: 'font-size: 14px; color: #9c27b0; padding: 8px 0; line-height: 1.6;',
    // 博客特色
    blogFeature: 'font-size: 14px; color: #34a853; padding: 8px 0; line-height: 1.6;',
    // 联系方式
    contact: 'font-size: 14px; color: #ea4335; padding: 8px 0; line-height: 1.6;',
    // 提示信息
    hint: 'font-size: 12px; color: #999; padding: 5px 0; font-style: italic;',
    // 命令样式
    command: 'font-size: 12px; color: #fbbc04; padding: 3px 0; font-family: monospace;'
  };

  // ============================================
  // 🛠️ 工具函数
  // ============================================
  
  // 从数组中随机获取一个元素
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // 获取指定分类的随机寄语
  function getRandomMessage(category) {
    const categoryMessages = messages[category];
    if (!categoryMessages || categoryMessages.length === 0) {
      return null;
    }
    return getRandomItem(categoryMessages);
  }

  // 打印双线装饰
  function printDoubleDivider() {
    console.log('%c══════════════════════════════════════════════', styles.divider);
  }

  // ============================================
  // 🎬 主展示逻辑
  // ============================================
  
  function showWelcomeMessage() {
    // 清空控制台（可选）
    // console.clear();
    
    // 主标题
    console.log('%c🚀  Welcome to Jerry\'s Blog  🚀', styles.mainTitle);
    console.log('%c   欢迎来到 Jerry 的技术世界！', 'font-size: 16px; color: #4285f4; font-weight: bold;');

    // 展示随机寄语
    showRandomMessages();
    
    // 展示交互提示
    showInteractionHints();
  }

  // 展示随机寄语
  function showRandomMessages() {
    // 技术名言
    console.log('%c📖 技术名言 Tech Quotes:', 'font-size: 16px; font-weight: bold; color: #42f457ff; padding: 10px 0;');
    
    const techQuote = getRandomMessage('techQuotes');
    if (techQuote) {
      console.log('%c  "' + techQuote.zh + '"', styles.techQuote);
      console.log('%c  "' + techQuote.en + '"', styles.techQuote);
      if (techQuote.author) {
        console.log('%c  —— ' + techQuote.author, 'font-size: 12px; color: #666; font-style: italic;');
      }
    }
  }

  // 展示交互提示
  function showInteractionHints() {
    console.log('%c💡 交互命令 Interactive Commands:', 'font-size: 14px; font-weight: bold; color: #fbbc04; padding: 10px 0;');
    console.log('%c  blog.randomQuote()  - 获取随机技术名言', styles.command);
    console.log('%c  blog.info()         - 查看博客详细信息', styles.command);
    console.log('%c  blog.contact()      - 查看联系方式', styles.command);
    console.log('%c  blog.help()         - 查看所有可用命令', styles.command);
    console.log('%c🎯 提示: 在控制台中输入上述命令，探索更多内容！', styles.hint);
    console.log('%c   Tip: Type the commands above to explore more content!', styles.hint);
  }

  // ============================================
  // 🎮 交互式 API
  // ============================================
  
  window.blog = {
    // 获取随机技术名言
    randomQuote: function() {
      const quote = getRandomMessage('techQuotes');
      if (quote) {
        console.log('%c📖 随机技术名言 Random Tech Quote:', 'font-size: 14px; font-weight: bold; color: #4285f4;');
        console.log('%c  "' + quote.zh + '"', styles.techQuote);
        console.log('%c  "' + quote.en + '"', styles.techQuote);
        if (quote.author) {
          console.log('%c  —— ' + quote.author, 'font-size: 12px; color: #666; font-style: italic;');
        }
      }
      return quote;
    },

    // 获取随机个人介绍
    randomIntro: function() {
      const intro = getRandomMessage('personalIntro');
      if (intro) {
        console.log('%c👨‍💻 关于博主 About Me:', 'font-size: 14px; font-weight: bold; color: #9c27b0;');
        console.log('%c  ' + intro.zh, styles.personalIntro);
        console.log('%c  ' + intro.en, styles.personalIntro);
      }
      return intro;
    },

    // 获取随机博客特色
    randomFeature: function() {
      const feature = getRandomMessage('blogFeatures');
      if (feature) {
        console.log('%c🌟 博客特色 Blog Feature:', 'font-size: 14px; font-weight: bold; color: #34a853;');
        console.log('%c  ' + feature.zh, styles.blogFeature);
        console.log('%c  ' + feature.en, styles.blogFeature);
      }
      return feature;
    },

    // 博客详细信息
    info: function() {
      console.log('%c📚 JanyCode Blog 详细信息', 'font-size: 18px; font-weight: bold; color: #4285f4; padding: 10px 0;');
      console.log('%c  博客名称 Blog Name:', 'font-size: 14px; color: #666;', 'JanyCode Blog');
      console.log('%c  技术栈 Tech Stack:', 'font-size: 14px; color: #666;', 'Hexo + Fluid Theme');
      console.log('%c  内容方向 Content:', 'font-size: 14px; color: #666;', 'Full-Stack Development');
      console.log('%c  涵盖范围 Coverage:', 'font-size: 14px; color: #666;', 'Frontend · Backend · Architecture');
    },

    // 联系方式
    contact: function() {
      console.log('%c📬 联系方式 Contact Information', 'font-size: 18px; font-weight: bold; color: #ea4335; padding: 10px 0;');
      console.log('%c  GitHub:', 'font-size: 14px; color: #666;', 'https://github.com/janycode');
      console.log('%c  邮箱 Email:', 'font-size: 14px; color: #666;', 'yuan62387@qq.com');
      console.log('%c  💬 欢迎技术交流与合作！', 'font-size: 14px; color: #ea4335;');
      console.log('%c     Welcome tech discussions and collaboration!', 'font-size: 14px; color: #ea4335;');
    },

    // 帮助信息
    help: function() {
      console.log('%c❓ 可用命令 Available Commands', 'font-size: 18px; font-weight: bold; color: #fbbc04; padding: 10px 0;');
      console.log('%c  blog.randomQuote()', 'font-size: 14px; color: #4285f4; font-family: monospace;', '- 获取随机技术名言');
      console.log('%c  blog.randomIntro()', 'font-size: 14px; color: #9c27b0; font-family: monospace;', '- 获取随机个人介绍');
      console.log('%c  blog.randomFeature()', 'font-size: 14px; color: #34a853; font-family: monospace;', '- 获取随机博客特色');
      console.log('%c  blog.info()', 'font-size: 14px; color: #4285f4; font-family: monospace;', '- 查看博客详细信息');
      console.log('%c  blog.contact()', 'font-size: 14px; color: #ea4335; font-family: monospace;', '- 查看联系方式');
      console.log('%c  blog.help()', 'font-size: 14px; color: #fbbc04; font-family: monospace;', '- 查看所有可用命令');
    }
  };

  // ============================================
  // 🚀 启动
  // ============================================
  
  // 页面加载完成后展示欢迎信息
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWelcomeMessage);
  } else {
    showWelcomeMessage();
  }

})();
