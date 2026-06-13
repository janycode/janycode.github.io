/* global CONFIG */

(function() {
  // Modified from [hexo-generator-search](https://github.com/wzpan/hexo-generator-search)

  var searchData = null; // 缓存搜索数据
  var isLoaded = false;  // 是否加载完成

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

  // 页面加载时异步加载 search.xml
  function loadSearchData() {
    var path = CONFIG.search_path || '/local-search.xml';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'document';

    // Load complete handler
    xhr.addEventListener('load', function() {
      if (xhr.status === 200 || xhr.status === 0) {
        var xmlResponse = xhr.responseXML;

        // 解析 xml 文件
        searchData = jQuery('entry', xmlResponse).map(function() {
          return {
            title  : jQuery('title', this).text(),
            content: jQuery('content', this).text(),
            url    : jQuery('url', this).text()
          };
        }).get();

        isLoaded = true;

        // 启用搜索按钮
        updateSearchButtonState(true);
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to load search.xml:', xhr.status);
      }
    });

    // Error handler
    xhr.addEventListener('error', function() {
      // eslint-disable-next-line no-console
      console.error('Error loading search.xml');
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
            // cut out 100 characters
            var start = first_occur - 20;
            var end = first_occur + 80;

            if (start < 0) {
              start = 0;
            }

            if (start === 0) {
              end = 100;
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
})();
