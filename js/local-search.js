/* global CONFIG */

(function() {
  // Modified from [hexo-generator-search](https://github.com/wzpan/hexo-generator-search)

  var searchData = null; // 缓存搜索数据
  var isLoaded = false;  // 是否加载完成
  var isLoading = false; // 防止重复请求
  var CACHE_KEY_PREFIX = 'hexo_search_data_';  // IndexedDB key prefix for search data chunks
  var CACHE_TIME_KEY = 'hexo_search_time';     // localStorage key for cache timestamp
  var CACHE_CHUNKS_KEY = 'hexo_search_chunks'; // localStorage key for chunk count
  var CACHE_EXPIRE_DAYS = 7;                    // cache expiration: 7 days
  var CHUNK_SIZE = 1024 * 1024;                 // 1MB per chunk
  var DB_NAME = 'hexo_search_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'search_data';

  // 打开或创建 IndexedDB
  function openDB() {
    return new Promise(function(resolve, reject) {
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = function() {
        reject(request.error);
      };
      
      request.onsuccess = function() {
        resolve(request.result);
      };
      
      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  // 从 IndexedDB 读取数据
  function getFromDB(key) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction([STORE_NAME], 'readonly');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.get(key);
        
        request.onsuccess = function() {
          resolve(request.result);
        };
        
        request.onerror = function() {
          reject(request.error);
        };
      });
    });
  }

  // 向 IndexedDB 写入数据
  function setToDB(key, value) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction([STORE_NAME], 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.put(value, key);
        
        request.onsuccess = function() {
          resolve();
        };
        
        request.onerror = function() {
          reject(request.error);
        };
      });
    });
  }

  // 从 IndexedDB 清除数据
  function clearDB() {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction([STORE_NAME], 'readwrite');
        var store = transaction.objectStore(STORE_NAME);
        var request = store.clear();
        
        request.onsuccess = function() {
          resolve();
        };
        
        request.onerror = function() {
          reject(request.error);
        };
      });
    });
  }

  // 检查缓存是否有效（未过期）
  function isCacheValid() {
    var cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (!cacheTime) {
      return false;
    }

    var now = new Date().getTime();
    var expireTime = parseInt(cacheTime, 10) + (CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
    return now < expireTime;
  }

  // 检查缓存分片是否完整并返回数据（一次性完成检查和加载）
  async function tryLoadFromCache() {
    try {
      // 检查是否过期
      if (!isCacheValid()) {
        // eslint-disable-next-line no-console
        console.log('Cache expired or not found');
        return null;
      }

      // 检查分片数量
      var chunks = localStorage.getItem(CACHE_CHUNKS_KEY);
      if (!chunks) {
        // eslint-disable-next-line no-console
        console.log('No chunk count found');
        return null;
      }

      var chunkCount = parseInt(chunks, 10);
      if (chunkCount <= 0) {
        // eslint-disable-next-line no-console
        console.log('Invalid chunk count:', chunkCount);
        return null;
      }

      // 检查所有分片是否存在并拼接
      var jsonStr = '';
      for (var i = 0; i < chunkCount; i++) {
        var chunk = await getFromDB(CACHE_KEY_PREFIX + i);
        if (!chunk) {
          // eslint-disable-next-line no-console
          console.log('Missing chunk:', i, '- cache incomplete, total expected:', chunkCount);
          return null;
        }
        jsonStr += chunk;
      }

      // 解析 JSON
      var data = JSON.parse(jsonStr);
      
      // 验证数据有效性（必须是数组且有内容）
      if (!Array.isArray(data) || data.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Cached data is invalid');
        return null;
      }

      // eslint-disable-next-line no-console
      // console.log('Search data loaded from cache (complete), entries:', data.length);
      return data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error loading from cache:', e);
      return null;
    }
  }

  // 保存数据到 IndexedDB（分片存储）
  async function saveToCache(data) {
    try {
      var jsonStr = JSON.stringify(data);
      var totalLength = jsonStr.length;

      // 计算需要的分片数量
      var chunkCount = Math.ceil(totalLength / CHUNK_SIZE);

      // eslint-disable-next-line no-console
      console.log('Saving to cache, size:', totalLength, 'bytes, chunks:', chunkCount);

      // 先清除旧的分片
      await clearDB();

      // 存储分片
      var writtenCount = 0;
      for (var i = 0; i < chunkCount; i++) {
        var start = i * CHUNK_SIZE;
        var end = Math.min(start + CHUNK_SIZE, totalLength);
        var chunk = jsonStr.substring(start, end);
        await setToDB(CACHE_KEY_PREFIX + i, chunk);
        writtenCount++;
      }

      // 存储分片数量和时间戳（在所有分片写入成功后再写入）
      localStorage.setItem(CACHE_CHUNKS_KEY, chunkCount.toString());
      localStorage.setItem(CACHE_TIME_KEY, new Date().getTime().toString());

      // 验证写入是否成功
      var verifyCount = localStorage.getItem(CACHE_CHUNKS_KEY);
      var verifyTime = localStorage.getItem(CACHE_TIME_KEY);
      // eslint-disable-next-line no-console
      console.log('Cache saved successfully! Written chunks:', writtenCount, 'verify chunks:', verifyCount, 'time:', verifyTime);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error saving search data to cache:', e);
      // 清除可能部分写入的数据
      await clearDB();
      localStorage.removeItem(CACHE_CHUNKS_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
    }
  }

  // 清除所有缓存
  async function clearCache() {
    await clearDB();
    localStorage.removeItem(CACHE_TIME_KEY);
    localStorage.removeItem(CACHE_CHUNKS_KEY);
  }

  // 更新搜索按钮状态
  function updateSearchButtonState(loaded) {
    var searchLink = document.querySelector('#search-btn .nav-link');

    if (searchLink) {
      if (loaded) {
        // 加载完成 - 可用状态
        searchLink.classList.remove('disabled');
        searchLink.style.pointerEvents = 'auto';
        searchLink.style.cursor = 'pointer';
      } else {
        // 加载中 - 禁用状态
        searchLink.classList.add('disabled');
        searchLink.style.pointerEvents = 'none';
        searchLink.style.cursor = 'not-allowed';
      }
    }
  }

  // 更新进度显示
  function updateProgress(percent) {
    var progressText = document.querySelector('#search-btn .search-progress-text');

    if (percent > 0) {
      progressText.textContent = percent + '%';
      progressText.classList.add('show');
    }

    if (percent >= 100) {
      // 加载完成后延迟隐藏进度文本
      setTimeout(function() {
        progressText.classList.remove('show');
      }, 500);
    }
  }

  // 解析 XML 字符串为搜索数据
  function parseSearchXml(xmlString) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    var entries = xmlDoc.getElementsByTagName('entry');
    var result = [];

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var title = entry.getElementsByTagName('title')[0];
      var content = entry.getElementsByTagName('content')[0];
      var url = entry.getElementsByTagName('url')[0];

      result.push({
        title: title ? title.textContent : '',
        content: content ? content.textContent : '',
        url: url ? url.textContent : ''
      });
    }

    return result;
  }

  // 页面加载时异步加载 search.xml
  async function loadSearchData() {
    // 防止重复请求
    if (isLoaded || isLoading) {
      // eslint-disable-next-line no-console
      console.log('Already loaded or loading, skip. isLoaded:', isLoaded, 'isLoading:', isLoading);
      return;
    }

    isLoading = true;

    // 首先尝试从缓存加载（一次性完成检查和加载）
    var cachedData = await tryLoadFromCache();
    if (cachedData && cachedData.length > 0) {
      searchData = cachedData;
      isLoaded = true;
      isLoading = false;
      // 从缓存加载完成，显示100%，立即启用搜索按钮
      updateProgress(100);
      updateSearchButtonState(true);
      return;
    }

    // 缓存不存在、已过期或不完整，从服务器加载
    // eslint-disable-next-line no-console
    console.log('Cache miss or incomplete, loading from server...');

    var path = CONFIG.search_path || '/local-search.xml';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'text'; // 使用 text 类型，手动解析 XML

    // Progress event listener - 实时更新下载进度
    xhr.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        var percent = Math.round((e.loaded / e.total) * 100);
        updateProgress(percent);
      }
    });

    // Load complete handler
    xhr.addEventListener('load', async function() {
      if (xhr.status === 200 || xhr.status === 0) {
        var xmlString = xhr.responseText;

        // 解析 XML 字符串
        searchData = parseSearchXml(xmlString);
        isLoaded = true;

        // eslint-disable-next-line no-console
        console.log('Search data loaded from server, entries:', searchData.length);

        // 保存到 IndexedDB 缓存（分片存储）
        await saveToCache(searchData);

        // 更新进度到100%并启用搜索按钮
        updateProgress(100);
        updateSearchButtonState(true);
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to load search.xml:', xhr.status);
      }
      isLoading = false;
    });

    // Error handler
    xhr.addEventListener('error', function() {
      // eslint-disable-next-line no-console
      console.error('Error loading search.xml');
      isLoading = false;
    });

    xhr.send();
  }

  function localSearchFunc(searchSelector, resultSelector) {
    'use strict';
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the resultSelector');
    }

    if (!isLoaded || !searchData) {
      $result.html('<div class="m-auto text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div><br/>Loading...</div>');
      return;
    }

    $result.html('');

    $input.on('input', function() {
      // 0x03. parse query to keywords list
      var content = $input.val();
      var resultHTML = '';
      var keywords = content.trim().toLowerCase().split(/[\s-]+/);
      $result.html('');
      if (content.trim().length <= 0) {
        return $input.removeClass('invalid').removeClass('valid');
      }
      // 0x04. perform local searching
      searchData.forEach(function(data) {
        var isMatch = true;
        if (!data.title || data.title.trim() === '') {
          data.title = 'Untitled';
        }
        var orig_data_title = data.title.trim();
        var data_title = orig_data_title.toLowerCase();
        var orig_data_content = data.content.trim().replace(/<[^>]+>/g, '');
        var data_content = orig_data_content.toLowerCase();
        var data_url = data.url;
        var index_title = -1;
        var index_content = -1;
        var first_occur = -1;
        // only match articles with not empty contents
        if (data_content !== '') {
          keywords.forEach(function(keyword, i) {
            index_title = data_title.indexOf(keyword);
            index_content = data_content.indexOf(keyword);

            if (index_title < 0 && index_content < 0) {
              isMatch = false;
            } else {
              if (index_content < 0) {
                index_content = 0;
              }
              if (i === 0) {
                first_occur = index_content;
              }
            }
          });
        } else {
          isMatch = false;
        }
        // 0x05. show search results
        if (isMatch) {
          resultHTML += '<a href=\'' + data_url + '\' class=\'list-group-item list-group-item-action font-weight-bolder search-list-title\'>' + orig_data_title + '</a>';
          var content = orig_data_content;
          if (first_occur >= 0) {
            // cut out 200 characters for richer preview
            var start = first_occur - 50;
            var end = first_occur + 150;

            if (start < 0) {
              start = 0;
            }

            if (start === 0) {
              end = 200;
            }

            if (end > content.length) {
              end = content.length;
            }

            var match_content = content.substring(start, end);

            // highlight all keywords
            keywords.forEach(function(keyword) {
              var regS = new RegExp(keyword, 'gi');
              match_content = match_content.replace(regS, '<span class="search-word">' + keyword + '</span>');
            });

            resultHTML += '<p class=\'search-list-content\'>' + match_content + '...</p>';
          }
        }
      });
      if (resultHTML.indexOf('list-group-item') === -1) {
        return $input.addClass('invalid').removeClass('valid');
      }
      $input.addClass('valid').removeClass('invalid');
      $result.html(resultHTML);
    });
  }

  function localSearchReset(searchSelector, resultSelector) {
    'use strict';
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      // eslint-disable-next-line no-console
      throw Error('No element selected by the resultSelector');
    }

    $input.val('').removeClass('invalid').removeClass('valid');
    $result.html('');
  }

  var modal = jQuery('#modalSearch');
  var searchSelector = '#local-search-input';
  var resultSelector = '#local-search-result';

  // 页面加载时就开始异步加载 search.xml
  jQuery(document).ready(function() {
    // 检查是否启用搜索
    var searchBtn = document.querySelector('#search-btn');
    if (searchBtn) {
      loadSearchData();
    }
  });

  modal.on('show.bs.modal', function() {
    localSearchFunc(searchSelector, resultSelector);
  });
  modal.on('shown.bs.modal', function() {
    jQuery('#local-search-input').focus();
  });
  modal.on('hidden.bs.modal', function() {
    localSearchReset(searchSelector, resultSelector);
  });

  // 快捷键 (F) 打开搜索弹窗，(Q) 打开AI弹窗
  var aiModal = jQuery('#modalAI');
  jQuery(document).on('keydown', function(e) {
    // 忽略在输入框、文本域中的按键
    var tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      return;
    }
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      var searchBtn = document.querySelector('#search-btn .nav-link');
      if (searchBtn && !searchBtn.classList.contains('disabled')) {
        modal.modal('show');
      }
    }
    if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      aiModal.modal('show');
    }
    // ESC 关闭弹窗
    if (e.key === 'Escape') {
      modal.modal('hide');
      aiModal.modal('hide');
    }
  });
})();
