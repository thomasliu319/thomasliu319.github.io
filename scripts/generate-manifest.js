#!/usr/bin/env node
/**
 * Clippings 清单生成器
 *
 * 输入：项目根目录下的 Clippings/<tag>/*.md
 * 输出：
 *   - /clippings-manifest.json          —— 全站文章清单（前端 fetch 用）
 *   - /posts/<tag-slug>/<file-slug>/index.html
 *                                       —— 每篇文章的渲染壳
 *   - /posts/index.html                 —— 全部文章列表
 *   - /tags/<tag-slug>/index.html       —— 每个 tag 的索引页
 *   - 重写 /index.html、/archives/index.html、/tags/index.html 的内容区
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLIPPINGS_DIR = path.join(ROOT, 'Clippings');
const MANIFEST_PATH = path.join(ROOT, 'clippings-manifest.json');

// ---------- 工具函数 ----------

/** 解析 YAML frontmatter（仅支持本仓库实际用到的字段） */
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: md };
  const raw = m[1];
  const body = md.slice(m[0].length);
  const data = {};
  let currentKey = null;
  for (const line of raw.split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && currentKey) {
      const v = line.replace(/^\s*-\s+/, '').trim().replace(/^"|"$/g, '');
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(v);
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (val === '') {
      currentKey = key;
      data[key] = '';
    } else {
      currentKey = key;
      val = val.replace(/^"|"$/g, '');
      data[key] = val;
    }
  }
  return { data, body };
}

/** 简单 slugify：保留中文、字母数字，空格转 -，其余符号去除 */
function slugify(s) {
  return s
    .toString()
    .trim()
    .replace(/[｜|：:，,。.、'"！!?？（）()\[\]【】《》]/g, '-')   // 标点先转 -
    .replace(/[\s\u3000]+/g, '-')                                   // 空格
    .replace(/-Claude-Code-工程化实战-极客时间$/i, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** 从文件名前缀取序号，如 "00 ｜ 开篇词..." → "00"，"01｜登台..." → "01" */
function leadingOrder(fname) {
  const m = fname.match(/^\s*(\d+)/);
  return m ? m[1] : '';
}

/** 取摘要：用 description 优先；否则取 body 前 N 字 */
function makeExcerpt(data, body, maxLen = 120) {
  if (data.description) return data.description.slice(0, maxLen);
  const text = body
    .replace(/<audio[^>]*>[\s\S]*?<\/audio>/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/[#>*`_~\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, maxLen);
}

/** 清理 title：去掉「-Claude Code 工程化实战-极客时间」尾巴 */
function cleanTitle(t) {
  return t.replace(/[\s]*[-－—]?\s*Claude\s*Code\s*工程化实战\s*[-－—]?\s*极客时间\s*$/i, '').trim();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ---------- 模板 ----------

const SITE_NAME = 'Thomas Liu';

/** 公共 head（含 dashboard、Prism、marked、referrer no-referrer） */
function commonHead(title) {
  return `  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="referrer" content="no-referrer">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="zh_CN">
  <link rel="icon" href="/favicon.png">
  <link href="//fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/post-renderer.css">
  <link rel="stylesheet" href="/css/dashboard.css">`;
}

function header() {
  return `      <header id="header">
        <div id="banner"></div>
        <div id="header-outer" class="outer">
          <div id="header-title" class="inner">
            <h1 id="logo-wrap">
              <a href="/" id="logo">${SITE_NAME}</a>
            </h1>
          </div>
        </div>
      </header>`;
}

function dashboard() {
  return `      <div id="dashboard-container" class="outer" style="padding: 20px 0;">
        <div style="text-align:center; color:#999;">Loading...</div>
      </div>
      <script>
        fetch('/widgets/dashboard.html')
          .then(r => r.text())
          .then(html => { document.getElementById('dashboard-container').innerHTML = html; })
          .catch(err => console.error('dashboard load failed:', err));
      </script>
      <script src="/js/ai-news.js"></script>`;
}

function footer() {
  return `    <footer id="footer">
      <div class="outer">
        <div id="footer-info" class="inner">
          &copy; 2026 thomasliu<br>
          
        </div>
      </div>
    </footer>`;
}

function mobileNav() {
  return '';
}

/** 文章渲染壳 —— 单篇文章页 */
function postShellHtml(post) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(post.title + ' - ' + SITE_NAME)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main">
          <article class="post-article" data-md-path="${encodeURI(post.mdPath)}" data-tag="${post.tagName}" data-tag-slug="${post.tagSlug}" data-slug="${post.slug}">
            <header class="post-header">
              <h1 class="post-title">${escapeHtml(post.title)}</h1>
              <div class="post-meta">
                <time>${post.created || ''}</time>
                <span class="post-tag"><a href="/tags/${encodeURI(post.tagSlug)}/">${escapeHtml(post.tagName)}</a></span>
              </div>
            </header>
            <div class="post-content markdown-body">
              <div class="post-loading">正在加载文章内容…</div>
            </div>
            <nav class="post-nav"></nav>
          </article>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>

  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
  <script src="/js/post-renderer.js"></script>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

/** Tag 索引页 —— 列出该 tag 下所有文章 */
function tagIndexHtml(tag) {
  const items = tag.posts.map(p => `
              <li class="post-list-item">
                <a class="post-list-link" href="${p.url}">
                  <span class="post-list-title">${escapeHtml(p.title)}</span>
                  <time class="post-list-date">${p.created || ''}</time>
                </a>
                <p class="post-list-excerpt">${escapeHtml(p.excerpt || '')}</p>
              </li>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(`${tag.name} - ${SITE_NAME}`)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main" class="tag-page">
          <header class="tag-header">
            <h1 class="tag-title">#${escapeHtml(tag.name)}</h1>
            <p class="tag-count">${tag.count} 篇文章</p>
          </header>
          <ul class="post-list">${items}
          </ul>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

/** Tags 总览页 */
function tagsOverviewHtml(tags) {
  const cards = tags.map(t => `
            <a class="tag-card" href="/tags/${encodeURI(t.slug)}/">
              <span class="tag-card-name">#${escapeHtml(t.name)}</span>
              <span class="tag-card-count">${t.count} 篇</span>
            </a>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(`Tags - ${SITE_NAME}`)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main" class="tag-page">
          <header class="tag-header">
            <h1 class="tag-title">所有标签</h1>
            <p class="tag-count">共 ${tags.length} 个分类，${tags.reduce((a, t) => a + t.count, 0)} 篇文章</p>
          </header>
          <div class="tag-cards">${cards}
          </div>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

/** Posts 总览页 */
function postsOverviewHtml(allPosts) {
  const items = allPosts.map(p => `
              <li class="post-list-item">
                <a class="post-list-link" href="${p.url}">
                  <span class="post-list-title">${escapeHtml(p.title)}</span>
                  <time class="post-list-date">${p.created || ''}</time>
                </a>
                <span class="post-list-tag"><a href="/tags/${encodeURI(p.tagSlug)}/">${escapeHtml(p.tagName)}</a></span>
                <p class="post-list-excerpt">${escapeHtml(p.excerpt || '')}</p>
              </li>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(`All Posts - ${SITE_NAME}`)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main" class="tag-page">
          <header class="tag-header">
            <h1 class="tag-title">全部文章</h1>
            <p class="tag-count">${allPosts.length} 篇</p>
          </header>
          <ul class="post-list">${items}
          </ul>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

/** 首页（重写） —— 列出最近 N 篇 */
function homeHtml(allPosts) {
  const recent = allPosts.slice(0, 10);
  const items = recent.map(p => `
              <article class="home-post">
                <h2 class="home-post-title"><a href="${p.url}">${escapeHtml(p.title)}</a></h2>
                <div class="home-post-meta">
                  <time>${p.created || ''}</time>
                  <span class="home-post-tag"><a href="/tags/${encodeURI(p.tagSlug)}/">#${escapeHtml(p.tagName)}</a></span>
                </div>
                <p class="home-post-excerpt">${escapeHtml(p.excerpt || '')}</p>
              </article>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(SITE_NAME)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main" class="home-main">
          <h1 class="home-title">RECENT POST</h1>
          <div class="home-posts">${items}
          </div>
          <div class="home-more"><a href="/posts/">View All →</a></div>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

/** Archives —— 按年月分组 */
function archivesHtml(allPosts) {
  const byYearMonth = new Map();
  for (const p of allPosts) {
    const ym = (p.created || '').slice(0, 7) || '未知';
    if (!byYearMonth.has(ym)) byYearMonth.set(ym, []);
    byYearMonth.get(ym).push(p);
  }
  const blocks = [...byYearMonth.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([ym, posts]) => `
            <div class="archive-block">
              <h2 class="archive-block-title">${ym}</h2>
              <ul class="archive-block-list">${posts.map(p => `
                <li><time>${p.created}</time><a href="${p.url}">${escapeHtml(p.title)}</a></li>`).join('')}
              </ul>
            </div>`).join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
${commonHead(`Archives - ${SITE_NAME}`)}
</head>
<body>
  <div id="container">
    <div id="wrap">
${header()}

${dashboard()}

      <div class="outer">
        <section id="main" class="archive-page">
          <h1 class="archive-title">归档</h1>
          <p class="archive-count">${allPosts.length} 篇文章</p>
          <div class="archive-blocks">${blocks}
          </div>
        </section>
        <aside id="sidebar">
          <div class="sidebar-inner"></div>
        </aside>
      </div>

    </div>
${footer()}
  </div>
  <script src="/js/sidebar.js"></script>
</body>
</html>
`;
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------- 主流程 ----------

function main() {
  if (!fs.existsSync(CLIPPINGS_DIR)) {
    console.error('Clippings/ 不存在：' + CLIPPINGS_DIR);
    process.exit(1);
  }

  const tagDirs = fs.readdirSync(CLIPPINGS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const tags = [];
  const allPosts = [];

  for (const tagName of tagDirs) {
    const tagSlug = slugify(tagName);
    const tagDir = path.join(CLIPPINGS_DIR, tagName);
    const mdFiles = fs.readdirSync(tagDir).filter(f => f.toLowerCase().endsWith('.md'));

    const posts = [];
    for (const fname of mdFiles) {
      const fpath = path.join(tagDir, fname);
      const md = fs.readFileSync(fpath, 'utf8');
      const { data, body } = parseFrontmatter(md);
      const titleRaw = data.title || fname.replace(/\.md$/i, '');
      const title = cleanTitle(titleRaw);
      // slug 基于文件名（保留前缀编号），fallback 为 title
      const fnameNoExt = fname.replace(/\.md$/i, '');
      const slug = slugify(cleanTitle(fnameNoExt)) || slugify(title);
      const order = leadingOrder(fname);
      const created = (data.created || '').toString().slice(0, 10);
      const excerpt = makeExcerpt(data, body);

      const url = `/posts/${encodeURI(tagSlug)}/${encodeURI(slug)}/`;
      const mdPath = `/Clippings/${tagName}/${fname}`;

      const post = {
        slug,
        title,
        created,
        excerpt,
        mdPath,
        tagName,
        tagSlug,
        url,
        order,
        fname,
        source: data.source || ''
      };
      posts.push(post);
      allPosts.push(post);
    }

    // tag 内排序：先按文件名前缀编号（数字升序），再按文件名
    posts.sort((a, b) => {
      const oa = a.order ? parseInt(a.order, 10) : Number.MAX_SAFE_INTEGER;
      const ob = b.order ? parseInt(b.order, 10) : Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;
      return a.fname.localeCompare(b.fname, 'zh');
    });

    tags.push({
      name: tagName,
      slug: tagSlug,
      count: posts.length,
      posts: posts.map(p => ({
        slug: p.slug,
        title: p.title,
        created: p.created,
        excerpt: p.excerpt,
        url: p.url,
        mdPath: p.mdPath
      }))
    });
  }

  // 全站文章排序：created desc；同日则按 tagName + 编号升序（让 00→01→02 自然顺序）
  allPosts.sort((a, b) => {
    if (a.created !== b.created) return (b.created || '').localeCompare(a.created || '');
    if (a.tagName !== b.tagName) return a.tagName.localeCompare(b.tagName, 'zh');
    const oa = a.order ? parseInt(a.order, 10) : Number.MAX_SAFE_INTEGER;
    const ob = b.order ? parseInt(b.order, 10) : Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    return a.fname.localeCompare(b.fname, 'zh');
  });

  // 写 manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    siteName: SITE_NAME,
    tags,
    posts: allPosts.map(p => ({
      slug: p.slug,
      title: p.title,
      created: p.created,
      excerpt: p.excerpt,
      url: p.url,
      mdPath: p.mdPath,
      tagName: p.tagName,
      tagSlug: p.tagSlug,
      source: p.source
    }))
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ wrote ' + path.relative(ROOT, MANIFEST_PATH));

  // 写每篇文章壳 + 上下篇链接
  // 上下篇按 manifest.posts（全站时间序）取前后
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    post.prev = allPosts[i + 1] ? { url: allPosts[i + 1].url, title: allPosts[i + 1].title } : null;
    post.next = allPosts[i - 1] ? { url: allPosts[i - 1].url, title: allPosts[i - 1].title } : null;

    const dir = path.join(ROOT, 'posts', post.tagSlug, post.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), postShellHtml(post), 'utf8');
    console.log('  ↳ post: ' + path.relative(ROOT, path.join(dir, 'index.html')));
  }

  // 写每个 tag 索引
  for (const t of tags) {
    const dir = path.join(ROOT, 'tags', t.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), tagIndexHtml(t), 'utf8');
    console.log('  ↳ tag : ' + path.relative(ROOT, path.join(dir, 'index.html')));
  }

  // 写 tags 总览
  fs.writeFileSync(path.join(ROOT, 'tags', 'index.html'), tagsOverviewHtml(tags), 'utf8');
  console.log('  ↳ tags overview');

  // 写 posts 目录
  ensureDir(path.join(ROOT, 'posts'));
  fs.writeFileSync(path.join(ROOT, 'posts', 'index.html'), postsOverviewHtml(allPosts), 'utf8');
  console.log('  ↳ posts overview');

  // 写首页
  fs.writeFileSync(path.join(ROOT, 'index.html'), homeHtml(allPosts), 'utf8');
  console.log('  ↳ home');

  // 写 archives
  ensureDir(path.join(ROOT, 'archives'));
  fs.writeFileSync(path.join(ROOT, 'archives', 'index.html'), archivesHtml(allPosts), 'utf8');
  console.log('  ↳ archives');

  console.log(`\n完成：${tags.length} 个 tag，${allPosts.length} 篇文章。`);
}

main();
