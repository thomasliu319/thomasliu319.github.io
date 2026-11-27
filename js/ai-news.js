/**
 * AI News 资讯轮播 — 加载 /posts/ai-news.json 并渲染到 #ai-news-container
 * 等待 dashboard.html 异步加载完成后再初始化
 */
(function() {
  var PAGE_SIZE = 5;
  var allCards = [];
  var totalPages = 0;
  var currentPage = 0;
  var autoTimer = null;

  var srcIconMap = {
    'openai':      { cls: 'src-openai',      ico: 'O' },
    'anthropic':   { cls: 'src-anthropic',   ico: 'A' },
    'hugging':     { cls: 'src-huggingface', ico: 'HF' },
    'google':      { cls: 'src-google',      ico: 'G' },
    'deepmind':    { cls: 'src-google',      ico: 'D' },
    'nvidia':      { cls: 'src-nvidia',      ico: 'N' },
    'meta':        { cls: 'src-meta',        ico: 'M' },
    'microsoft':   { cls: 'src-microsoft',   ico: 'MS' },
    'stability':   { cls: 'src-stability',   ico: 'S' },
    'techcrunch':  { cls: 'src-techcrunch',  ico: 'TC' },
    'mit':         { cls: 'src-mit',         ico: 'MIT' }
  };

  function getIcon(src) {
    var l = src.toLowerCase();
    for (var k in srcIconMap) { if (l.indexOf(k) !== -1) return srcIconMap[k]; }
    return { cls: 'src-default', ico: src.slice(0, 2).toUpperCase() };
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      var d = new Date(dateStr), now = new Date(), diffH = Math.floor((now - d) / 3600000);
      if (diffH < 1) return '刚刚';
      if (diffH < 24) return diffH + ' 小时前';
      if (diffH < 48) return '昨天';
      return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    } catch(e) { return ''; }
  }

  function renderPage(container, idx) {
    var start = idx * PAGE_SIZE;
    var batch = allCards.slice(start, start + PAGE_SIZE);
    var list = container.querySelector('.ai-news-list');
    var html = '';
    batch.forEach(function(item) {
      var ico = getIcon(item.source);
      var title = (item.title || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
      if (!title) title = item.link;
      html += '<li class="ai-news-item">' +
        '<span class="item-icon ' + ico.cls + '">' + ico.ico + '</span>' +
        '<a class="item-title" href="' + item.link + '" target="_blank" rel="noopener">' + title + '</a>' +
        '<span class="item-time">' + formatDate(item.pubDate) + '</span>' +
        '</li>';
    });
    list.classList.add('fading');
    setTimeout(function() {
      list.innerHTML = html;
      list.classList.remove('fading');
    }, 180);
  }

  function updateDots(container) {
    var dots = container.querySelector('.ai-news-dots');
    var html = '';
    for (var i = 0; i < totalPages; i++) {
      html += '<div class="dot-ind' + (i === currentPage ? ' active' : '') + '" data-idx="' + i + '"></div>';
    }
    dots.innerHTML = html;
    dots.querySelectorAll('.dot-ind').forEach(function(d) {
      d.addEventListener('click', function() { goToPage(container, parseInt(this.dataset.idx)); });
    });
  }

  function goToPage(container, idx) {
    if (idx < 0 || idx >= totalPages || totalPages === 0) return;
    currentPage = idx;
    renderPage(container, currentPage);
    updateDots(container);
  }

  function nextPage(container) { if (totalPages > 0) goToPage(container, (currentPage + 1) % totalPages); }
  function prevPage(container) { if (totalPages > 0) goToPage(container, (currentPage - 1 + totalPages) % totalPages); }

  function startAuto(container) { stopAuto(); autoTimer = setInterval(function() { nextPage(container); }, 3000); }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

  function showToast(toastEl, msg, isErr) {
    toastEl.textContent = msg;
    toastEl.classList.toggle('err', !!isErr);
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function() { toastEl.classList.remove('show'); }, 2400);
  }

  function reloadJson(container) {
    return fetch('/posts/ai-news.json?t=' + Date.now())
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(data) {
        allCards = data;
        totalPages = Math.ceil(allCards.length / PAGE_SIZE);
        currentPage = 0;
        goToPage(container, 0);
      });
  }

  function init(container) {
    // Already initialized
    if (container.querySelector('.ai-news-header')) return;

    container.innerHTML = '' +
      '<div class="ai-news-header" style="position:relative;">' +
        '<h4><span class="dot"></span>AI NEWS</h4>' +
        '<div class="ai-news-nav">' +
          '<button class="ai-refresh" title="Manual Refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path></svg></button>' +
          '<button class="ai-prev" title="Previous Page">&larr;</button>' +
          '<button class="ai-next" title="Next Page">&rarr;</button>' +
        '</div>' +
        '<div class="ai-news-toast"></div>' +
      '</div>' +
      '<ul class="ai-news-list"><li style="padding:40px;text-align:center;color:#94a3b8;">正在拉取最新 AI 资讯…</li></ul>' +
      '<div class="ai-news-dots"></div>';

    var refreshBtn = container.querySelector('.ai-refresh');
    var toastEl = container.querySelector('.ai-news-toast');
    var list = container.querySelector('.ai-news-list');

    container.querySelector('.ai-prev').addEventListener('click', function() { prevPage(container); });
    container.querySelector('.ai-next').addEventListener('click', function() { nextPage(container); });
    refreshBtn.addEventListener('click', function() {
      if (refreshBtn.disabled) return;
      refreshBtn.disabled = true;
      refreshBtn.classList.add('spinning');
      stopAuto();
      reloadJson(container)
        .then(function() { showToast(toastEl, '已刷新'); })
        .catch(function(err) { showToast(toastEl, '刷新失败: ' + err.message, true); })
        .then(function() {
          refreshBtn.disabled = false;
          refreshBtn.classList.remove('spinning');
          startAuto(container);
        });
    });

    list.addEventListener('mouseenter', stopAuto);
    list.addEventListener('touchstart', stopAuto, { passive: true });
    list.addEventListener('mouseleave', function() { startAuto(container); });
    list.addEventListener('touchend', function() { setTimeout(function() { startAuto(container); }, 2000); });

    fetch('/posts/ai-news.json')
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(data) {
        allCards = data;
        if (allCards.length === 0) throw new Error('empty');
        totalPages = Math.ceil(allCards.length / PAGE_SIZE);
        goToPage(container, 0);
        startAuto(container);
      })
      .catch(function(err) {
        console.warn('AI news fetch failed:', err.message);
        container.querySelector('.ai-news-list').innerHTML = '<li style="padding:30px;text-align:center;color:#94a3b8;">资讯暂不可用，请运行 npm run scrape:news 更新</li>';
      });
  }

  // 等待 #ai-news-container 出现（dashboard 通过 fetch + innerHTML 异步加载）
  function waitForContainer() {
    var container = document.getElementById('ai-news-container');
    if (container) {
      init(container);
      return;
    }
    var dashboard = document.getElementById('dashboard-container');
    if (!dashboard) {
      // DOM 也未就绪
      document.addEventListener('DOMContentLoaded', function() {
        waitForContainer();
      });
      return;
    }
    var observer = new MutationObserver(function(mutations, obs) {
      var container = document.getElementById('ai-news-container');
      if (container) {
        obs.disconnect();
        init(container);
      }
    });
    observer.observe(dashboard, { childList: true, subtree: true });
  }

  waitForContainer();
})();
