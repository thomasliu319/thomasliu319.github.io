/**
 * sidebar.js — 侧边栏：Home 返回 + 日历控件 + Tags 列表
 * 依赖：/clippings-manifest.json（tags 数据）
 * 挂载点：#sidebar
 */
(function () {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  /* ── 1. Home 按钮 ──────────────────────────────────── */
  const homeWrap = document.createElement('div');
  homeWrap.className = 'widget-wrap';
  homeWrap.innerHTML = `
    <div class="widget sidebar-home">
      <a href="/" class="sidebar-home-link">← Home</a>
    </div>`;
  sidebar.appendChild(homeWrap);

  /* ── 2. 日历控件 ───────────────────────────────────── */
  const calWrap = document.createElement('div');
  calWrap.className = 'widget-wrap';
  calWrap.innerHTML = `
    <h3 class="widget-title">Calendar</h3>
    <div class="widget sidebar-calendar">
      <div class="cal-header">
        <button class="cal-prev" aria-label="上月">&#8249;</button>
        <span class="cal-month-label"></span>
        <button class="cal-next" aria-label="下月">&#8250;</button>
      </div>
      <table class="cal-table">
        <thead>
          <tr>${['日','一','二','三','四','五','六'].map(function(d){ return '<th>' + d + '</th>'; }).join('')}</tr>
        </thead>
        <tbody class="cal-body"></tbody>
      </table>
    </div>`;
  sidebar.appendChild(calWrap);

  var monthLabel = calWrap.querySelector('.cal-month-label');
  var calBody    = calWrap.querySelector('.cal-body');
  var prevBtn    = calWrap.querySelector('.cal-prev');
  var nextBtn    = calWrap.querySelector('.cal-next');

  var cur = new Date();
  cur.setDate(1);

  function renderCal() {
    var year  = cur.getFullYear();
    var month = cur.getMonth();
    monthLabel.textContent = year + ' 年 ' + (month + 1) + ' 月';

    var today       = new Date();
    var firstDay    = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<tr>';
    for (var i = 0; i < firstDay; i++) html += '<td></td>';
    var col = firstDay;
    for (var d = 1; d <= daysInMonth; d++) {
      var isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      html += '<td class="' + (isToday ? 'cal-today' : '') + '">' + d + '</td>';
      col++;
      if (col % 7 === 0 && d < daysInMonth) html += '</tr><tr>';
    }
    while (col % 7 !== 0) { html += '<td></td>'; col++; }
    html += '</tr>';
    calBody.innerHTML = html;
  }

  prevBtn.addEventListener('click', function () {
    cur.setMonth(cur.getMonth() - 1);
    renderCal();
  });
  nextBtn.addEventListener('click', function () {
    cur.setMonth(cur.getMonth() + 1);
    renderCal();
  });

  renderCal();

  /* ── 3. Tags 列表（从 manifest 拉取）─────────────────── */
  var tagsWrap = document.createElement('div');
  tagsWrap.className = 'widget-wrap';
  tagsWrap.innerHTML = `
    <h3 class="widget-title">Tags</h3>
    <div class="widget sidebar-tags">
      <ul class="sidebar-tag-list"><li>加载中…</li></ul>
    </div>`;
  sidebar.appendChild(tagsWrap);

  var tagList = tagsWrap.querySelector('.sidebar-tag-list');

  fetch('/clippings-manifest.json')
    .then(function (r) { return r.json(); })
    .then(function (manifest) {
      if (!manifest.tags || manifest.tags.length === 0) {
        tagList.innerHTML = '<li>暂无标签</li>';
        return;
      }
      tagList.innerHTML = manifest.tags.map(function (t) {
        return '<li><a href="/tags/' + encodeURI(t.slug) + '/">'
          + escHtml(t.name)
          + '<span class="sidebar-tag-count">' + t.count + '</span>'
          + '</a></li>';
      }).join('');
    })
    .catch(function () {
      tagList.innerHTML = '<li>加载失败</li>';
    });

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
