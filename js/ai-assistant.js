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
  var aiFloatBtn = jQuery('#ai-float-button');

  // 状态变量
  var isLoading = false;
  var currentController = null;
  var aiSource = '';
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

  // 邮件通知配置
  var EMAIL_CONFIG = {
    token: window.AI_EMAIL_TOKEN || '',
    repo: 'janycode/janycode.github.io',
    workflow: 'ai-email-notify.yml'
  };

  // 解密邮件Token
  function getEmailToken() {
    if (!EMAIL_CONFIG.token || !ENCRYPTION_CONFIG.secret) {
      return null;
    }
    return decryptKey(EMAIL_CONFIG.token, ENCRYPTION_CONFIG.secret);
  }

  // 发送邮件通知
  function notifyByEmail(question, answer) {
    var token = getEmailToken();
    if (!token) {
      console.log('邮件通知Token未配置，跳过发送');
      return;
    }

    var now = new Date();
    var timeStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    var shortAnswer = answer.length > 500 ? answer.substring(0, 500) + '...' : answer;

    fetch('https://api.github.com/repos/' + EMAIL_CONFIG.repo + '/actions/workflows/' + EMAIL_CONFIG.workflow + '/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          question: question,
          answer: shortAnswer,
          time: timeStr
        }
      })
    }).then(function() {
      console.log('邮件通知已发送');
    }).catch(function(err) {
      console.log('邮件通知发送失败:', err);
    });
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

    var codeBlocks = [];
    var inlineCodes = [];
    var tables = [];

    // ========== 第一步：提取代码块、行内代码、表格（用特殊占位符） ==========

    // 提取代码块 ```lang\ncode```
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
      var index = codeBlocks.length;
      codeBlocks.push({ lang: lang || 'plaintext', code: code.trim() });
      return '\x00CB' + index + '\x00';
    });

    // 提取行内代码 `code`
    text = text.replace(/`([^`\n]+)`/g, function(match, code) {
      var index = inlineCodes.length;
      inlineCodes.push(code);
      return '\x00IC' + index + '\x00';
    });

    // 提取表格
    text = text.replace(/((?:\|.+\|\n?)+)/g, function(match) {
      var lines = match.trim().split('\n');
      var tableData = [];
      var hasSeparator = false;

      for (var t = 0; t < lines.length; t++) {
        var line = lines[t].trim();
        if (!line) continue;
        if (/^\|[\s\-:|]+\|$/.test(line)) { hasSeparator = true; continue; }
        var cells = line.split('|');
        if (cells[0].trim() === '') cells.shift();
        if (cells[cells.length - 1].trim() === '') cells.pop();
        if (cells.length > 0) {
          tableData.push(cells.map(function(c) { return c.trim(); }));
        }
      }
      if (tableData.length === 0) return match;

      var hasHeader = hasSeparator && tableData.length > 1;
      var tableHtml = '<table class="ai-table"><tbody>';
      for (var r = 0; r < tableData.length; r++) {
        tableHtml += '<tr>';
        var tag = (hasHeader && r === 0) ? 'th' : 'td';
        for (var c = 0; c < tableData[r].length; c++) {
          var cellContent = tableData[r][c];
          cellContent = cellContent.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
          cellContent = cellContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          cellContent = cellContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
          cellContent = cellContent.replace(/~~(.*?)~~/g, '<del>$1</del>');
          cellContent = cellContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
          cellContent = cellContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;">');
          cellContent = escapeHtml(cellContent);
          cellContent = cellContent.replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>');
          cellContent = cellContent.replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
          cellContent = cellContent.replace(/&lt;del&gt;/g, '<del>').replace(/&lt;\/del&gt;/g, '</del>');
          cellContent = cellContent.replace(/&lt;a href="/g, '<a href="').replace(/&lt;\/a&gt;/g, '</a>');
          cellContent = cellContent.replace(/&lt;img src="/g, '<img src="').replace(/&lt;\/img&gt;/g, '</img>');
          cellContent = cellContent.replace(/\x00IC(\d+)\x00/g, function(match, index) {
            return '<code class="inline-code">' + escapeHtml(inlineCodes[parseInt(index)]) + '</code>';
          });
          tableHtml += '<' + tag + '>' + cellContent + '</' + tag + '>';
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table>';

      var index = tables.length;
      tables.push(tableHtml);
      return '\x00TB' + index + '\x00';
    });

    // ========== 第二步：转义HTML特殊字符 ==========
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // ========== 第三步：Markdown 语法转 HTML ==========

    // 标题
    text = text.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    text = text.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    text = text.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // 粗体和斜体（优先匹配长的）
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/___(.*?)___/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<em>$1</em>');

    // 删除线
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // 图片
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;margin:0.5rem 0;">');

    // 链接
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 引用
    text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

    // 无序列表
    text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^\+ (.*$)/gm, '<li>$1</li>');
    // 有序列表
    text = text.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

    // 合并列表项
    text = text.replace(/(<li>.*<\/li>)/gs, function(match) {
      return '<ul>' + match + '</ul>';
    });
    text = text.replace(/<\/ul><ul>/g, '');

    // 水平分割线
    text = text.replace(/^---$/gm, '<hr>');
    text = text.replace(/^\*\*\*$/gm, '<hr>');

    // ========== 第四步：恢复代码块、表格、行内代码 ==========

    // 恢复代码块
    text = text.replace(/\x00CB(\d+)\x00/g, function(match, index) {
      var block = codeBlocks[parseInt(index)];
      if (!block) return match;
      return '<pre class="code-block"><code class="language-' + block.lang + '">' + escapeHtml(block.code) + '</code></pre>';
    });

    // 恢复表格
    text = text.replace(/\x00TB(\d+)\x00/g, function(match, index) {
      return tables[parseInt(index)] || match;
    });

    // ========== 第五步：段落处理 ==========
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');

    // 清理 <p> 包裹 <pre> 和 <table> 的情况
    text = text.replace(/<p>(<pre class="code-block">)/g, '$1');
    text = text.replace(/(<\/pre>)<\/p>/g, '$1');
    text = text.replace(/<p>(<table)/g, '$1');
    text = text.replace(/(<\/table>)<\/p>/g, '$1');

    // 恢复行内代码
    text = text.replace(/\x00IC(\d+)\x00/g, function(match, index) {
      return '<code class="inline-code">' + escapeHtml(inlineCodes[parseInt(index)]) + '</code>';
    });

    // 清理所有残留的占位符（防止流式输出中途未闭合的占位符）
    text = text.replace(/\x00(CB|IC|TB)\d+\x00/g, '');

    return '<div class="markdown-content">' + text + '</div>';
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

      // 构建回复内容HTML - 标题和按钮在同一行
      var resultHtml = '<div class="ai-result-container">' +
        '<div class="ai-result-header">' +
        '<span class="ai-question-title"><strong>Q:</strong> ' + escapeHtml(currentQuestion) + '</span>' +
        '<div class="ai-result-actions">' +
        '<button class="ai-action-btn btn btn-outline-secondary btn-sm" id="ai-download-md" title="下载Markdown"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>' +
        '<button class="ai-action-btn btn btn-outline-secondary btn-sm" id="ai-fullscreen" title="全屏预览"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button>' +
        '<button class="ai-action-btn btn btn-outline-secondary btn-sm" id="ai-copy-btn" data-type="both" title="复制全文"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>' +
        '</div></div>' +
        '<hr class="ai-divider">' +
        '<div class="ai-response-card">' +
        '<div class="ai-response">' +
        '<div class="ai-avatar">A</div>' +
        '<div class="ai-content">' +
        '<div id="ai-streaming-content"></div>' +
        '</div></div></div></div>';

      resultEl.html(resultHtml);
      var contentEl = jQuery('#ai-streaming-content');

      // 绑定复制按钮事件
      jQuery('#ai-copy-btn', resultEl.parent()).on('click', function() {
        var copyType = jQuery(this).data('type');
        var textToCopy = '';
        if (copyType === 'both') {
          textToCopy = 'Q: ' + currentQuestion + '\n\nA: ' + fullContent;
        }
        var copyBtn = jQuery(this);
        copyToClipboard(textToCopy, function(success) {
          var copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          if (success) {
            copyBtn.addClass('copied');
            copyBtn.html('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>');
            setTimeout(function() {
              copyBtn.removeClass('copied');
              copyBtn.html(copyIcon);
            }, 2000);
          } else {
            copyBtn.html('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>');
            setTimeout(function() {
              copyBtn.html(copyIcon);
            }, 2000);
          }
        });
      });

      // 绑定下载Markdown按钮事件
      jQuery('#ai-download-md', resultEl.parent()).on('click', function() {
        var mdContent = '# Q: ' + currentQuestion + '\n\n' + fullContent;
        var blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'AI回复_' + new Date().toISOString().slice(0, 10) + '.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // 绑定全屏预览按钮事件
      jQuery('#ai-fullscreen', resultEl.parent()).on('click', function() {
        var content = fullContent || contentEl.text();
        var fullscreenWindow = window.open('', '_blank');
        fullscreenWindow.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI回复 - 全屏预览</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;font-size:0.9rem;line-height:1.7;color:#333;}h1,h2,h3,h4,h5,h6{margin-top:1.5rem;margin-bottom:0.5rem;}table{width:100%;border-collapse:collapse;margin:1rem 0;}th,td{border:1px solid #ddd;padding:0.4rem 0.6rem;text-align:left;}th{background:#f6f8fa;}code{background:#f0f0f0;padding:0.15rem 0.35rem;border-radius:3px;font-size:0.85em;}pre{background:#f6f8fa;padding:1rem;border-radius:6px;overflow-x:auto;}blockquote{border-left:3px solid #ddd;padding-left:1rem;color:#666;margin:0.5rem 0;}a{color:#0366d6;}</style></head><body><h2>Q: ' + escapeHtml(currentQuestion) + '</h2><hr>' + renderMarkdown(content) + '</body></html>');
        fullscreenWindow.document.close();
      });

      function readStream() {
        return reader.read().then(function(result) {
          if (result.done) {
            contentEl.html(renderMarkdown(fullContent));
            isLoading = false;
            stopLoading();
            hideLoading();
            currentController = null;
            // 发送邮件通知
            if (currentQuestion && fullContent) {
              notifyByEmail(currentQuestion, fullContent);
            }
            // 渲染完毕后滚动到顶部，方便从头阅读
            var aiContentEl = contentEl.closest('.ai-content')[0];
            if (aiContentEl) {
              setTimeout(function() {
                aiContentEl.scrollTop = 0;
              }, 100);
            }
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
                  // 自动滚动到底部
                  var aiContent = contentEl.closest('.ai-content')[0];
                  if (aiContent) {
                    aiContent.scrollTop = aiContent.scrollHeight;
                  }
                  // 检测 User Safety 内容
                  if (fullContent.includes('User Safety: safe') || fullContent.includes('User Safety')) {
                    contentEl.html('<div class="alert alert-warning" role="alert">接口请求繁忙，请再次点击发送重试！</div>');
                    isLoading = false;
                    stopLoading();
                    hideLoading();
                    if (currentController) {
                      currentController.abort();
                    }
                    currentController = null;
                    return;
                  }
                }
                // 检测顶层 error 或 message 中包含安全拦截
                if (data.error || (data.message && data.message.includes('User Safety'))) {
                  contentEl.html('<div class="alert alert-warning" role="alert">接口请求繁忙，请再次点击发送重试！</div>');
                  isLoading = false;
                  stopLoading();
                  hideLoading();
                  currentController = null;
                  return;
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

  aiFloatBtn.on('click', function() {
    aiSource = 'float';
  });

  modal.on('shown.bs.modal', function() {
    inputEl.focus();
    if (aiSource === 'float') {
      adjustModalWidth();
    }
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
    aiSource = '';
    modal.removeClass('float-mode');
    jQuery('#modalAI .modal-dialog').css({
      'max-width': '',
      'width': '',
      'position': '',
      'right': '',
      'top': '',
      'bottom': ''
    });
  });

  function adjustModalWidth() {
    var board = jQuery('#board');
    if (board.length === 0) {
      return;
    }
    var boardRight = board[0].getClientRects()[0].right;
    var windowWidth = window.innerWidth;
    var maxWidth = windowWidth - boardRight - 20;
    if (maxWidth < 300) {
      maxWidth = 300;
    }
    modal.addClass('float-mode');
    jQuery('#modalAI .modal-dialog').css({
      'max-width': maxWidth + 'px',
      'width': 'calc(100% - ' + boardRight + 'px - 20px)',
      'position': 'fixed',
      'right': '0',
      'top': '0',
      'bottom': '0',
      'margin': '0'
    });
  }

  // 初始化按钮文本
  hideLoading();

})();
