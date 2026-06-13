/**
 * AI Assistant - 问问AI功能
 * 使用简单的Base64+异或加密保护API密钥
 */

(function() {
  'use strict';

  // 加密配置
  var ENCRYPTION_CONFIG = {
    encryptedKey: window.AI_ENCRYPTED_KEY || '',
    secret: window.AI_ENCRYPT_SECRET || ''
  };

  // API配置
  var API_CONFIG = {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: window.AI_MODEL || 'openrouter/free'
  };

  // DOM元素
  var modal = jQuery('#modalAI');
  var inputEl = jQuery('#ai-input');
  var submitBtn = jQuery('#ai-submit');
  var resetBtn = jQuery('#ai-reset');
  var resultEl = jQuery('#ai-result');

  // 状态变量
  var isLoading = false;
  var currentController = null;
  var decryptedApiKey = null;
  var currentQuestion = '';
  var loadingDots = '';
  var loadingTimer = null;

  // 简单的解密函数（Base64 + 异或）
  function decryptKey(encryptedBase64, secret) {
    try {
      var encrypted = atob(encryptedBase64);
      var result = '';
      for (var i = 0; i < encrypted.length; i++) {
        var charCode = encrypted.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (e) {
      console.error('解密失败:', e);
      return null;
    }
  }

  // 获取API密钥（解密）
  function getApiKey() {
    if (decryptedApiKey) {
      return decryptedApiKey;
    }
    if (!ENCRYPTION_CONFIG.encryptedKey || !ENCRYPTION_CONFIG.secret) {
      console.error('AI配置缺失');
      return null;
    }
    decryptedApiKey = decryptKey(ENCRYPTION_CONFIG.encryptedKey, ENCRYPTION_CONFIG.secret);
    return decryptedApiKey;
  }

  // 复制文本到剪贴板
  function copyToClipboard(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        if (callback) callback(true);
      }).catch(function() {
        fallbackCopy(text, callback);
      });
    } else {
      fallbackCopy(text, callback);
    }
  }

  function fallbackCopy(text, callback) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      if (callback) callback(true);
    } catch (e) {
      if (callback) callback(false);
    }
    document.body.removeChild(textarea);
  }

  // HTML转义
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 增强的Markdown渲染器
  function renderMarkdown(text) {
    if (!text) return '';

    // 先转义HTML特殊字符，但保留代码块内容
    var codeBlocks = [];
    var inlineCodes = [];
    
    // 提取代码块
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
      var index = codeBlocks.length;
      codeBlocks.push({ lang: lang || 'plaintext', code: code.trim() });
      return '___CODE_BLOCK_' + index + '___';
    });
    
    // 提取行内代码
    text = text.replace(/`([^`]+)`/g, function(match, code) {
      var index = inlineCodes.length;
      inlineCodes.push(code);
      return '___INLINE_CODE_' + index + '___';
    });

    // 转义HTML
    var html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 标题
    html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // 粗体和斜体
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.*?)___/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<em>$1</em>');

    // 删除线
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;margin:0.5rem 0;">');

    // 引用
    html = html.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

    // 无序列表
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\+ (.*$)/gm, '<li>$1</li>');

    // 有序列表
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

    // 合并列表项
    html = html.replace(/(<li>.*<\/li>)/gs, function(match) {
      return '<ul>' + match + '</ul>';
    });
    html = html.replace(/<\/ul><ul>/g, '');

    // 有序列表包装
    html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, function(match) {
      if (match.match(/<li>\d+\./)) {
        return '<ol>' + match + '</ol>';
      }
      return match;
    });

    // 表格
    html = html.replace(/\|(.+)\|/g, function(match) {
      var cells = match.split('|').filter(function(c) { return c.trim(); });
      if (cells.every(function(c) { return /^[\s-:]+$/.test(c); })) {
        return match; // 分隔行，跳过
      }
      var cellHtml = '';
      var isHeader = false;
      cells.forEach(function(cell, i) {
        var tag = isHeader ? 'th' : 'td';
        cellHtml += '<' + tag + '>' + cell.trim() + '</' + tag + '>';
      });
      return '<tr>' + cellHtml + '</tr>';
    });
    html = html.replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>');

    // 水平分割线
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    html = html.replace(/^___$/gm, '<hr>');

    // 段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // 恢复行内代码
    html = html.replace(/___INLINE_CODE_(\d+)___/g, function(match, index) {
      return '<code class="inline-code">' + escapeHtml(inlineCodes[index]) + '</code>';
    });

    // 恢复代码块
    html = html.replace(/___CODE_BLOCK_(\d+)___/g, function(match, index) {
      var block = codeBlocks[index];
      return '<pre class="code-block"><code class="language-' + block.lang + '">' + escapeHtml(block.code) + '</code></pre>';
    });

    // 包装
    html = '<div class="markdown-content">' + html + '</div>';

    return html;
  }

  function updateLoadingText() {
    submitBtn.html('<i class="iconfont icon-loading"></i> 回复中<span class="loading-dots-btn">' + loadingDots + '</span>');
  }

  function showLoading() {
    submitBtn.prop('disabled', true);
    loadingDots = '';
    updateLoadingText();
    resultEl.html('<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div><p class="mt-2">AI正在回复中<span class="loading-dots"></span></p></div>');
    loadingTimer = setInterval(function() {
      loadingDots = loadingDots.length >= 3 ? '' : loadingDots + '.';
      jQuery('.loading-dots').text(loadingDots);
      jQuery('.loading-dots-btn').text(loadingDots);
    }, 500);
  }

  function stopLoading() {
    if (loadingTimer) {
      clearInterval(loadingTimer);
      loadingTimer = null;
    }
  }

  function hideLoading() {
    submitBtn.prop('disabled', false);
    submitBtn.html('<i class="iconfont icon-send"></i> 发送 (Ctrl+Enter)');
  }

  function showError(message) {
    resultEl.html('<div class="alert alert-danger" role="alert"><i class="iconfont icon-error"></i> ' + message + '</div>');
  }

  // 发送请求到OpenRouter
  function sendToAI(question) {
    if (isLoading) return;
    if (!question.trim()) {
      showError('请输入您的问题');
      return;
    }

    currentQuestion = question;

    var apiKey = getApiKey();
    if (!apiKey) {
      showError('AI助手配置错误，请检查配置');
      return;
    }

    isLoading = true;
    showLoading();

    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    var requestData = {
      model: API_CONFIG.model,
      stream: true,
      messages: [
        {
          role: 'system',
          content: '你是一个专业且经验丰富的全栈架构师，擅长后端、前端、服务器的全栈开发，当前对话环境是针对我的个人技术博客 janycode.github.io 进行的。强制要求：1. 所有回复必须是中文；2. 所有回复必须是技术相关的；3. 所有回复必须是专业的；4. 所有回复的文字最多是2000字（不包含代码）；5. 确保回复内容是完整的。'
        },
        {
          role: 'user',
          content: question
        }
      ],
      reasoning: {
        enabled: true
      }
    };

    fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify(requestData),
      signal: currentController.signal
    })
    .then(function(response) {
      if (!response.ok) {
        if (response.status === 401) {
          decryptedApiKey = null;
          throw new Error('API密钥无效，请检查配置');
        } else if (response.status === 429) {
          throw new Error('请求过于频繁，请稍后再试');
        } else if (response.status >= 500) {
          throw new Error('AI服务暂时不可用，请稍后再试');
        }
        throw new Error('请求失败: ' + response.status);
      }

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var fullContent = '';
      var buffer = '';

      // 构建回复内容HTML - 复制图标在问题行内最右侧
      var resultHtml = '<div class="ai-result-container">' +
        '<div class="ai-result-header">' +
        '<div class="ai-question">' +
        '<span class="ai-question-text"><strong>Q:</strong> ' + escapeHtml(currentQuestion) + '</span>' +
        '<button class="ai-copy-icon" data-type="both"><i class="iconfont icon-copy"></i><span class="ai-tooltip">复制全文</span></button>' +
        '</div>' +
        '</div>' +
        '<div class="ai-response-card">' +
        '<div class="ai-response">' +
        '<div class="ai-avatar"><i class="iconfont icon-comment-alt"></i></div>' +
        '<div class="ai-content">' +
        '<div id="ai-streaming-content"></div>' +
        '</div></div></div></div>';

      resultEl.html(resultHtml);
      var contentEl = jQuery('#ai-streaming-content');

      // 绑定复制图标事件
      jQuery('button.ai-copy-icon', resultEl.parent()).on('click', function() {
        var copyType = jQuery(this).data('type');
        var textToCopy = '';
        if (copyType === 'both') {
          textToCopy = 'Q: ' + currentQuestion + '\n\nA: ' + fullContent;
        }
        var copyBtn = jQuery(this);
        copyToClipboard(textToCopy, function(success) {
          if (success) {
            copyBtn.addClass('copied');
            copyBtn.html('<i class="iconfont icon-check"></i><span class="ai-tooltip">已复制</span>');
            setTimeout(function() {
              copyBtn.removeClass('copied');
              copyBtn.html('<i class="iconfont icon-copy"></i><span class="ai-tooltip">复制全文</span>');
            }, 2000);
          } else {
            copyBtn.html('<i class="iconfont icon-error"></i><span class="ai-tooltip">复制失败</span>');
            setTimeout(function() {
              copyBtn.html('<i class="iconfont icon-copy"></i><span class="ai-tooltip">复制全文</span>');
            }, 2000);
          }
        });
      });

      function readStream() {
        return reader.read().then(function(result) {
          if (result.done) {
            contentEl.html(renderMarkdown(fullContent));
            isLoading = false;
            stopLoading();
            hideLoading();
            currentController = null;
            return;
          }

          var chunk = decoder.decode(result.value, { stream: true });
          buffer += chunk;

          var lines = buffer.split('\n');
          buffer = lines.pop();

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                var jsonStr = line.substring(6);
                var data = JSON.parse(jsonStr);
                if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                  fullContent += data.choices[0].delta.content;
                  contentEl.text(fullContent);
                }
              } catch (e) {}
            }
          }

          return readStream();
        });
      }

      return readStream();
    })
    .catch(function(error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('AI请求错误:', error);
      showError('请求失败: ' + error.message);
      isLoading = false;
      stopLoading();
      hideLoading();
      currentController = null;
    });
  }

  // 事件绑定 - 发送按钮
  submitBtn.on('click', function() {
    var question = inputEl.val();
    sendToAI(question);
  });

  // 事件绑定 - 重置按钮
  resetBtn.on('click', function() {
    inputEl.val('').focus();
    resultEl.html('');
    currentQuestion = '';
  });

  // 事件绑定 - Ctrl+Enter 发送
  inputEl.on('keydown', function(e) {
    if (e.ctrlKey && e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      var question = inputEl.val();
      sendToAI(question);
    }
  });

  modal.on('shown.bs.modal', function() {
    inputEl.focus();
  });

  modal.on('hidden.bs.modal', function() {
    if (currentController) {
      currentController.abort();
      currentController = null;
    }
    isLoading = false;
    stopLoading();
    hideLoading();
    currentQuestion = '';
  });

  // 初始化按钮文本
  hideLoading();

})();
