(function() {
  'use strict';

  const messages = {
    techQuotes: [
      { zh: "代码改变世界，技术成就未来！", en: "Code changes the world, technology shapes the future!", author: "" },
      { zh: "每一个 Bug 都是成长的机会", en: "Every bug is an opportunity to grow", author: "" },
      { zh: "保持学习，保持热爱", en: "Keep learning, keep loving", author: "" },
      { zh: "代码如诗，架构如画", en: "Code is poetry, architecture is art", author: "" },
      { zh: "The best error message is the one that never shows up.", en: "最好的错误信息是永远不出现的那个", author: "Thomas Fuchs" },
      { zh: "First, solve the problem. Then, write the code.", en: "先解决问题，再写代码", author: "John Johnson" },
      { zh: "Talk is cheap. Show me the code.", en: "空谈无益，给我看代码", author: "Linus Torvalds" },
      { zh: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", en: "任何傻瓜都能写出计算机能理解的代码。优秀的程序员写出人能理解的代码。", author: "Martin Fowler" },
      { zh: "Make it work, make it right, make it fast.", en: "先让它工作，再让它正确，最后让它快速。", author: "Kent Beck" }
    ],
    personalIntro: [
      { zh: "👨‍💻 全栈工程师 | Full-Stack Engineer", en: "Passionate about building end-to-end solutions", author: "" },
      { zh: "🚀 热爱技术，热爱分享 | Passionate about tech & sharing", en: "Sharing knowledge, inspiring others", author: "" },
      { zh: "💡 专注于前端、后端、架构设计", en: "Focus on Frontend, Backend & Architecture Design", author: "" },
      { zh: "🌟 终身学习者 | Lifelong Learner", en: "Always exploring, always growing", author: "" },
      { zh: "☕ 代码是我的咖啡，技术是我的动力", en: "Code is my coffee, technology is my motivation", author: "" }
    ],
    blogFeatures: [
      { zh: "📚 全栈技术博客 | Full-Stack Tech Blog", en: "Frontend · Backend · Architecture - All covered!", author: "" },
      { zh: "🎯 记录技术成长的点点滴滴", en: "Documenting every bit of tech growth", author: "" },
      { zh: "🔥 前沿技术深度解析", en: "In-depth analysis of cutting-edge technologies", author: "" },
      { zh: "💎 从入门到精通，保姆级教程", en: "From beginner to master, comprehensive tutorials", author: "" },
      { zh: "🌈 实战项目经验分享", en: "Real-world project experience sharing", author: "" }
    ],
    contact: [
      { zh: "📧 欢迎交流 | Let's Connect!", en: "Open to collaboration and discussions", author: "" },
      { zh: "💬 有问题随时联系我", en: "Feel free to reach out anytime", author: "" },
      { zh: "🤝 一起学习，一起进步", en: "Learn together, grow together", author: "" }
    ]
  };

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomMessage(category) {
    const categoryMessages = messages[category];
    if (!categoryMessages || categoryMessages.length === 0) {
      return null;
    }
    return getRandomItem(categoryMessages);
  }

  function showWelcomeMessage() {
    console.log('%c✨ JanyCode Blog ✨', 'font-size: 18px; font-weight: bold; color: #4285f4;');
    
    const quote = getRandomMessage('techQuotes');
    if (quote) {
      console.log('%c📖 "' + quote.zh + '"', 'font-size: 14px; color: #34a853; font-style: italic;');
      if (quote.author) {
        console.log('%c   —— ' + quote.author, 'font-size: 12px; color: #999;');
      }
    }
    
    console.log('%c💡 输入 blog.help() 查看交互命令', 'font-size: 12px; color: #999;');
  }

  window.blog = {
    randomQuote: function() {
      const quote = getRandomMessage('techQuotes');
      if (quote) {
        console.log('%c📖 "' + quote.zh + '"', 'font-size: 14px; color: #4285f4; font-style: italic;');
        console.log('%c   "' + quote.en + '"', 'font-size: 12px; color: #666; font-style: italic;');
        if (quote.author) {
          console.log('%c   —— ' + quote.author, 'font-size: 11px; color: #999;');
        }
      }
      return quote;
    },
    randomIntro: function() {
      const intro = getRandomMessage('personalIntro');
      if (intro) {
        console.log('%c👨‍💻 ' + intro.zh, 'font-size: 14px; color: #9c27b0;');
        console.log('%c   ' + intro.en, 'font-size: 12px; color: #666;');
      }
      return intro;
    },
    randomFeature: function() {
      const feature = getRandomMessage('blogFeatures');
      if (feature) {
        console.log('%c🌟 ' + feature.zh, 'font-size: 14px; color: #34a853;');
        console.log('%c   ' + feature.en, 'font-size: 12px; color: #666;');
      }
      return feature;
    },
    info: function() {
      console.log('%c📚 JanyCode Blog', 'font-size: 16px; font-weight: bold; color: #4285f4;');
      console.log('%c   技术栈: Hexo + Fluid Theme', 'font-size: 13px; color: #666;');
      console.log('%c   内容: Full-Stack Development', 'font-size: 13px; color: #666;');
    },
    contact: function() {
      console.log('%c📬 Contact', 'font-size: 16px; font-weight: bold; color: #ea4335;');
      console.log('%c   GitHub: https://github.com/janycode', 'font-size: 13px; color: #666;');
      console.log('%c   Email: yuan62387@qq.com', 'font-size: 13px; color: #666;');
    },
    help: function() {
      console.log('%c❓ Available Commands', 'font-size: 16px; font-weight: bold; color: #fbbc04;');
      console.log('%c   blog.randomQuote()  - 随机技术名言', 'font-size: 13px; color: #4285f4;');
      console.log('%c   blog.randomIntro()  - 随机个人介绍', 'font-size: 13px; color: #9c27b0;');
      console.log('%c   blog.randomFeature() - 随机博客特色', 'font-size: 13px; color: #34a853;');
      console.log('%c   blog.info()         - 博客信息', 'font-size: 13px; color: #4285f4;');
      console.log('%c   blog.contact()      - 联系方式', 'font-size: 13px; color: #ea4335;');
      console.log('%c   blog.help()         - 帮助信息', 'font-size: 13px; color: #fbbc04;');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWelcomeMessage);
  } else {
    showWelcomeMessage();
  }

})();