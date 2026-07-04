/* global CONFIG */

(function() {
  'use strict';

  var searchData = null;
  var isLoaded = false;
  var isLoading = false;
  var DB_NAME = 'hexo_search_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'search_data';
  var CHUNK_SIZE = 1024 * 1024;
  var CACHE_TIME_KEY = 'hexo_search_time';
  var CACHE_CHUNKS_KEY = 'hexo_search_chunks';
  var CACHE_EXPIRE_DAYS = 7;

  function deleteOldDB(dbName) {
    return new Promise(function(resolve) {
      if (!window.indexedDB) {
        resolve();
        return;
      }
      var request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = function() { resolve(); };
      request.onerror = function() { resolve(); };
      request.onblocked = function() { resolve(); };
    });
  }

  function openDB() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = function() { reject(request.error); };
      request.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = function(e) { resolve(e.target.result); };
    });
  }

  function getFromDB(key) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction([STORE_NAME], 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var request = store.get(key);
        request.onsuccess = function() { db.close(); resolve(request.result); };
        request.onerror = function() { db.close(); reject(request.error); };
      });
    });
  }

  function setToDB(key, value) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction([STORE_NAME], 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var request = store.put(value, key);
        request.onsuccess = function() { db.close(); resolve(); };
        request.onerror = function() { db.close(); reject(request.error); };
      });
    });
  }

  function clearDB() {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction([STORE_NAME], 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var request = store.clear();
        request.onsuccess = function() { db.close(); resolve(); };
        request.onerror = function() { db.close(); reject(request.error); };
      });
    });
  }

  function isCacheValid() {
    var cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (!cacheTime) return false;
    var now = Date.now();
    var expireTime = parseInt(cacheTime, 10) + (CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
    return now < expireTime;
  }

  async function tryLoadFromCache() {
    try {
      if (!isCacheValid()) {
        console.log('Cache expired or not found');
        return null;
      }

      var chunks = localStorage.getItem(CACHE_CHUNKS_KEY);
      if (!chunks) {
        console.log('No chunk count found');
        return null;
      }

      var chunkCount = parseInt(chunks, 10);
      if (chunkCount <= 0) {
        console.log('Invalid chunk count:', chunkCount);
        return null;
      }

      var jsonStr = '';
      for (var i = 0; i < chunkCount; i++) {
        var chunk = await getFromDB('hexo_search_data_' + i);
        if (!chunk) {
          console.log('Missing chunk:', i);
          return null;
        }
        jsonStr += chunk;
      }

      var data = JSON.parse(jsonStr);
      if (!Array.isArray(data) || data.length === 0) {
        console.log('Cached data is invalid');
        return null;
      }

      console.log('Search data loaded from cache, entries:', data.length);
      return data;
    } catch (e) {
      console.error('Error loading from cache:', e);
      return null;
    }
  }

  async function saveToCache(data) {
    try {
      var jsonStr = JSON.stringify(data);
      var chunkCount = Math.ceil(jsonStr.length / CHUNK_SIZE);

      console.log('Saving to cache, size:', jsonStr.length, 'bytes, chunks:', chunkCount);

      await clearDB();

      for (var i = 0; i < chunkCount; i++) {
        var start = i * CHUNK_SIZE;
        var end = Math.min(start + CHUNK_SIZE, jsonStr.length);
        var chunk = jsonStr.substring(start, end);
        await setToDB('hexo_search_data_' + i, chunk);
      }

      localStorage.setItem(CACHE_CHUNKS_KEY, chunkCount.toString());
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      console.log('Cache saved successfully!');
    } catch (e) {
      console.error('Error saving to cache:', e);
      await clearDB().catch(function() {});
      localStorage.removeItem(CACHE_CHUNKS_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
    }
  }

  var currentProgress = 0;
  var progressAnimationTimer = null;

  function animateProgress(targetPercent, duration) {
    var startPercent = currentProgress;
    var startTime = Date.now();
    var stepDuration = 16;

    if (progressAnimationTimer) {
      clearInterval(progressAnimationTimer);
    }

    var progressText = document.querySelector('#search-btn .search-progress-text');
    if (progressText) {
      progressText.classList.add('show');
    }

    progressAnimationTimer = setInterval(function() {
      var elapsed = Date.now() - startTime;
      var progress = Math.min(elapsed / duration, 1);

      var easeProgress = 1 - Math.pow(1 - progress, 3);
      currentProgress = Math.round(startPercent + (targetPercent - startPercent) * easeProgress);

      if (progressText) {
        progressText.textContent = currentProgress + '%';
      }

      if (progress >= 1) {
        clearInterval(progressAnimationTimer);
        progressAnimationTimer = null;
        currentProgress = targetPercent;
        if (progressText) {
          progressText.textContent = targetPercent + '%';
        }
      }
    }, stepDuration);
  }

  function updateProgress(percent) {
    var progressText = document.querySelector('#search-btn .search-progress-text');
    if (progressText) {
      progressText.classList.add('show');
    }

    if (percent === 0) {
      currentProgress = 0;
      if (progressAnimationTimer) {
        clearInterval(progressAnimationTimer);
        progressAnimationTimer = null;
      }
      if (progressText) {
        progressText.textContent = '0%';
      }
    } else if (percent >= 100) {
      animateProgress(100, 1000);
    } else {
      currentProgress = percent;
      if (progressText) {
        progressText.textContent = percent + '%';
      }
    }
  }

  function updateSearchButtonState(loaded) {
    var searchLink = document.querySelector('#search-btn .nav-link');
    if (searchLink) {
      if (loaded) {
        searchLink.classList.remove('disabled');
        searchLink.style.pointerEvents = 'auto';
        searchLink.style.cursor = 'pointer';
      } else {
        searchLink.classList.add('disabled');
        searchLink.style.pointerEvents = 'none';
        searchLink.style.cursor = 'not-allowed';
      }
    }
  }

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

  async function loadSearchData() {
    if (isLoaded || isLoading) {
      console.log('Already loaded or loading, skip');
      return;
    }

    isLoading = true;
    updateSearchButtonState(false);

    await deleteOldDB('hexo-search-cache');

    var cachedData = await tryLoadFromCache();
    if (cachedData && cachedData.length > 0) {
      searchData = cachedData;
      isLoaded = true;
      isLoading = false;
      updateProgress(100);
      updateSearchButtonState(true);
      return;
    }

    console.log('Loading search.xml from server...');

    var path = CONFIG.search_path || '/local-search.xml';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'text';

    xhr.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        var percent = Math.round((e.loaded / e.total) * 100);
        updateProgress(percent);
      }
    });

    xhr.addEventListener('load', async function() {
      if (xhr.status === 200 || xhr.status === 0) {
        searchData = parseSearchXml(xhr.responseText);
        isLoaded = true;
        console.log('Search data loaded from server, entries:', searchData.length);
        await saveToCache(searchData);
        updateProgress(100);
        updateSearchButtonState(true);
      } else {
        console.error('Failed to load search.xml:', xhr.status);
      }
      isLoading = false;
    });

    xhr.addEventListener('error', function() {
      console.error('Error loading search.xml');
      isLoading = false;
    });

    xhr.send();
  }

  function calculateMatchPercentage(title, content, keywords) {
    if (!keywords || keywords.length === 0) return 0;
    var titleLower = (title || '').toLowerCase();
    var contentLower = (content || '').toLowerCase();
    var totalScore = 0;
    var maxScore = keywords.length * 2;
    keywords.forEach(function(keyword) {
      if (titleLower.indexOf(keyword) >= 0) totalScore += 2;
      else if (contentLower.indexOf(keyword) >= 0) totalScore += 1;
    });
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  }

  function highlightKeywords(text, keywords) {
    var result = text;
    keywords.forEach(function(keyword) {
      var reg = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(reg, '<span class="search-word">$1</span>');
    });
    return result;
  }

  function performSearch(dataList, keywords, $result, $input) {
    var resultHTML = '';
    var matchCount = 0;

    dataList.forEach(function(data) {
      var isMatch = true;
      if (!data.title || data.title.trim() === '') {
        data.title = 'Untitled';
      }
      var orig_data_title = data.title.trim();
      var data_title = orig_data_title.toLowerCase();
      var orig_data_content = (data.content || '').trim().replace(/<[^>]+>/g, '');
      var data_content = orig_data_content.toLowerCase();
      var data_url = data.url;
      var first_occur = -1;

      if (data_content !== '') {
        keywords.forEach(function(keyword) {
          if (data_title.indexOf(keyword) < 0 && data_content.indexOf(keyword) < 0) {
            isMatch = false;
          }
        });
      } else {
        isMatch = false;
      }

      if (isMatch) {
        matchCount++;
        var percent = calculateMatchPercentage(orig_data_title, orig_data_content, keywords);
        resultHTML += '<a href=\'' + data_url + '\' class=\'list-group-item list-group-item-action font-weight-bolder search-list-title\'>' +
          orig_data_title +
          ' <span class="search-match-percent" style="font-size:0.75rem;color:#888;margin-left:8px;">' + percent + '%</span>' +
          '</a>';

        if (first_occur < 0) {
          var idx = -1;
          for (var k = 0; k < keywords.length; k++) {
            var pos = data_content.indexOf(keywords[k]);
            if (pos >= 0) { idx = pos; break; }
          }
          first_occur = idx;
        }

        if (first_occur >= 0) {
          var start = first_occur - 20;
          var end = first_occur + 80;
          if (start < 0) start = 0;
          if (start === 0) end = 100;
          if (end > orig_data_content.length) end = orig_data_content.length;
          var match_content = orig_data_content.substring(start, end);
          match_content = highlightKeywords(match_content, keywords);
          resultHTML += '<p class=\'search-list-content\'>' + match_content + '...</p>';
        }
      }
    });

    if (matchCount > 0) {
      resultHTML = '<div class="search-result-stats" style="padding:6px 12px;font-size:0.8rem;color:#888;border-bottom:1px solid #eee;">找到 ' + matchCount + ' 条结果</div>' + resultHTML;
    }

    if (resultHTML.indexOf('list-group-item') === -1) {
      $input.addClass('invalid').removeClass('valid');
    } else {
      $input.addClass('valid').removeClass('invalid');
    }
    $result.html(resultHTML);
  }

  function bindSearch($input, $result, dataList) {
    $input.off('input').on('input', function() {
      var content = $input.val();
      $result.html('');
      if (content.trim().length <= 0) {
        $input.removeClass('invalid').removeClass('valid');
        return;
      }
      var keywords = content.trim().toLowerCase().split(/[\s-]+/);
      performSearch(dataList, keywords, $result, $input);
    });
  }

  function localSearchFunc(searchSelector, resultSelector) {
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      throw Error('No element selected by the resultSelector');
    }

    if (!isLoaded || !searchData) {
      $result.html('<div class="m-auto text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div><br/>Loading...</div>');
      return;
    }

    $result.html('');
    bindSearch($input, $result, searchData);
  }

  function localSearchReset(searchSelector, resultSelector) {
    var $input = jQuery(searchSelector);
    var $result = jQuery(resultSelector);

    if ($input.length === 0) {
      throw Error('No element selected by the searchSelector');
    }
    if ($result.length === 0) {
      throw Error('No element selected by the resultSelector');
    }

    $input.val('').removeClass('invalid').removeClass('valid');
    $result.html('');
  }

  var modal = jQuery('#modalSearch');
  var searchSelector = '#local-search-input';
  var resultSelector = '#local-search-result';

  jQuery(document).ready(function() {
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

  var aiModal = jQuery('#modalAI');
  jQuery(document).on('keydown', function(e) {
    if (!e) return;
    var tagName = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
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
    if (e.key === 'Escape') {
      modal.modal('hide');
      aiModal.modal('hide');
    }
    if (e.key === 'Enter' || e.keyCode === 13) {
      Fluid.utils.scrollToElement('#board', -jQuery('#navbar').height());
    }
  });
})();