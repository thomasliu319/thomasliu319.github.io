/**
 * 通用文章渲染器
 *
 * 工作流程：
 * 1. 从 <article data-md-path="..."> 读取 md 路径
 * 2. fetch md，剔除 frontmatter 与 <audio>
 * 3. marked 渲染为 HTML
 * 4. Prism 高亮代码块
 * 5. 拉 manifest 渲染上一篇/下一篇
 */
(function () {
  const article = document.querySelector('.post-article');
  if (!article) return;

  const mdPath = article.getAttribute('data-md-path');
  const tagSlug = article.getAttribute('data-tag-slug');
  const slug = article.getAttribute('data-slug');
  const contentEl = article.querySelector('.post-content');
  const navEl = article.querySelector('.post-nav');

  if (!mdPath || !contentEl) return;

  // 配置 marked
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: true,
      mangle: false
    });
  }

  // 加载 md
  fetch(mdPath)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => renderMarkdown(text))
    .catch(err => {
      contentEl.innerHTML = '<div class="post-error">加载失败：' + escapeHtml(err.message) + '<br>路径：' + escapeHtml(mdPath) + '</div>';
    });

  function renderMarkdown(text) {
    // 1. 去除 YAML frontmatter
    let body = text.replace(/^---[\s\S]*?\r?\n---\r?\n?/, '');
    // 2. 隐藏 <audio> 标签（极客时间专属，无 hls.js 播不了）
    body = body.replace(/<audio[\s\S]*?<\/audio>/g, '');
    // 3. marked 渲染
    const html = (typeof marked !== 'undefined') ? marked.parse(body) : body;
    contentEl.innerHTML = html;

    // 4. 让所有外站图片可点击新窗打开 + 加载错误兜底
    contentEl.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.addEventListener('error', function onErr() {
        img.classList.add('img-broken');
        img.alt = '[图片加载失败] ' + (img.alt || img.src);
      });
    });

    // 5. Prism 高亮
    if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
      Prism.highlightAllUnder(contentEl);
    }

    // 6. 上下篇
    renderPrevNext();
  }

  function renderPrevNext() {
    fetch('/clippings-manifest.json')
      .then(r => r.json())
      .then(manifest => {
        const idx = manifest.posts.findIndex(p => p.tagSlug === tagSlug && p.slug === slug);
        if (idx < 0) return;
        const newer = manifest.posts[idx - 1]; // posts 是按 created desc 排序，idx-1 = 更新的
        const older = manifest.posts[idx + 1];
        let html = '';
        if (older) {
          html += '<a class="post-nav-prev" href="' + older.url + '">← ' + escapeHtml(older.title) + '</a>';
        }
        if (newer) {
          html += '<a class="post-nav-next" href="' + newer.url + '">' + escapeHtml(newer.title) + ' →</a>';
        }
        if (html) navEl.innerHTML = html;
      })
      .catch(() => { /* 静默失败 */ });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
