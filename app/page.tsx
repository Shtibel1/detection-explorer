'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { D } from '@/lib/data';

declare global {
  interface Window { lucide?: { createIcons: () => void } }
}

/* ------------------------------------------------------------------ helpers */
const esc = (s: any) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

function highlightJson(src: string) {
  return esc(src)
    .replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)/g, '<span class="tok-key">$1</span>$2')
    .replace(/:\s*(&quot;(?:[^&]|&(?!quot;))*?&quot;)/g, ': <span class="tok-str">$1</span>')
    .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="tok-bool">$1</span>')
    .replace(/\bnull\b/g, '<span class="tok-null">null</span>');
}

// holds the example text for the most-recently-rendered detail, keyed for the copy button
const RAW: Record<string, string> = {};

function codeBlock(src: string, key: string) {
  return `<div class="relative group">
    <button data-copy="${key}" class="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700/80 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-medium transition-colors">
      <i data-lucide="copy" class="w-3 h-3"></i> Copy</button>
    <pre class="code" id="code-${key}">${highlightJson(src)}</pre>
  </div>`;
}

function fieldRows(fields: any[]) {
  return fields.map((f) => `
    <tr>
      <td class="field-name">${esc(f.name)}</td>
      <td class="field-type">${esc(f.type)}</td>
      <td class="field-desc">${esc(f.desc || '')}${f.from ? ` <span class="text-slate-600">· ${esc(f.from)}</span>` : ''}</td>
    </tr>`).join('');
}

function fieldTable(fields: any[], head3 = 'Description') {
  return `<table class="field-table">
    <thead><tr><th>Field</th><th>Type</th><th>${head3}</th></tr></thead>
    <tbody>${fieldRows(fields)}</tbody></table>`;
}

function sectionTitle(icon: string, text: string, sub?: string) {
  return `<div class="flex items-center gap-2 mt-8 mb-3">
    <i data-lucide="${icon}" class="w-4 h-4 text-indigo-400"></i>
    <h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">${esc(text)}</h3>
    ${sub ? `<span class="text-xs text-slate-500">${esc(sub)}</span>` : ''}
  </div>`;
}

function baseFieldsBlock() {
  return `<details class="mt-8 rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
    <summary class="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2">
      <i data-lucide="layers" class="w-4 h-4 text-slate-400"></i>
      Inherited base fields (UniqueData → DetectionBase)
      <span class="ml-auto text-xs text-slate-500">${D.BASE_FIELDS.length} fields</span>
    </summary>
    <div class="px-4 pb-4 pt-1">${fieldTable(D.BASE_FIELDS)}</div>
  </details>`;
}

function supportingBlock(names: string[]) {
  if (!names || !names.length) return '';
  return names.map((n) => {
    const rows = (D.SUPPORTING_TYPES as any)[n];
    if (!rows) return '';
    return `<details class="mt-3 rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
      <summary class="cursor-pointer select-none px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2">
        <i data-lucide="box" class="w-3.5 h-3.5 text-slate-400"></i> ${esc(n)} <span class="text-slate-500">(nested type)</span>
      </summary>
      <div class="px-4 pb-4 pt-1">${fieldTable(rows)}</div>
    </details>`;
  }).join('');
}

function originBadge(origin?: string) {
  if (origin === 'global')
    return `<span class="pill bg-sky-900/50 text-sky-300 border border-sky-700/50"><i data-lucide="git-branch" class="w-3 h-3"></i> Main-Global only</span>`;
  if (origin === 'next')
    return `<span class="pill bg-orange-900/40 text-orange-300 border border-orange-700/50"><i data-lucide="git-branch" class="w-3 h-3"></i> Main-Next only</span>`;
  return `<span class="pill bg-emerald-900/40 text-emerald-300 border border-emerald-700/50"><i data-lucide="check" class="w-3 h-3"></i> Both branches</span>`;
}

function illustrativeNote() {
  return `<p class="text-xs text-slate-500 mb-2 italic flex items-center gap-1.5"><i data-lucide="info" class="w-3.5 h-3.5 text-sky-400"></i>Illustrative example — no captured production payload on record for this type.</p>`;
}

function header(title: string, className: string, badges: string) {
  return `<div class="pb-5 border-b border-slate-700 mb-1">
    <div class="flex items-center gap-2 mb-2 flex-wrap">${badges}</div>
    <h2 class="text-2xl font-bold text-white leading-snug">${esc(title)}</h2>
    <p class="font-mono text-sm text-indigo-300 mt-1">${esc(className)}</p>
  </div>`;
}

/* ---------------------------------------------------------- detail builders */
function renderTyped(t: any) {
  const badges = [
    `<span class="pill bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">Strongly-typed</span>`,
    originBadge(t.origin),
    t.standalone
      ? `<span class="pill bg-amber-900/40 text-amber-300 border border-amber-700/50"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Standalone (no DetectionBase)</span>`
      : `<span class="pill bg-slate-700/60 text-slate-300 border border-slate-600">extends ${esc(t.base)}</span>`,
  ].join('');

  let html = header(t.name, t.className, badges);
  html += `<p class="text-sm text-slate-300 leading-relaxed mt-4">${esc(t.summary)}</p>`;
  html += `<p class="text-xs text-slate-500 mt-2 font-mono flex items-center gap-1.5"><i data-lucide="file-code-2" class="w-3.5 h-3.5"></i>${esc(t.file)}</p>`;

  html += sectionTitle('list', 'Own fields', `${t.fields.length} field${t.fields.length === 1 ? '' : 's'} added by ${t.className}`);
  html += t.fields.length ? fieldTable(t.fields) : `<p class="text-sm text-slate-500 italic">No own fields.</p>`;

  const subs = [...new Set(t.fields.filter((f: any) => f.sub).map((f: any) => f.sub))] as string[];
  html += supportingBlock(subs);

  if (t.inboundExtras) {
    html += `<p class="text-xs text-slate-400 mt-4 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700"><i data-lucide="info" class="inline w-3.5 h-3.5 mr-1 text-sky-400"></i>${esc(t.inboundExtras)}</p>`;
  }

  if (t.subtypes && t.subtypes.length) {
    html += sectionTitle('git-branch', 'Sub-types');
    t.subtypes.forEach((s: any) => {
      html += `<div class="mt-3 rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3">
        <p class="font-mono text-sm text-emerald-300">${esc(s.className)} <span class="text-slate-500">: ${esc(s.extends)}</span></p>
        ${s.note ? `<p class="text-xs text-slate-400 mt-1">${esc(s.note)}</p>` : ''}
        ${s.adds && s.adds.length ? `<div class="mt-2">${fieldTable(s.adds)}</div>` : ''}
      </div>`;
    });
  }

  if (t.concreteTypes && t.concreteTypes.length) {
    html += sectionTitle('boxes', 'Concrete detection types', `${t.concreteTypes.length} — each only overrides DataType`);
    html += `<div class="flex flex-wrap gap-2 mt-1">` +
      t.concreteTypes.map((c: string) => `<span class="pill bg-slate-800 text-slate-300 border border-slate-700 font-mono">${esc(c)}</span>`).join('') +
      `</div>`;
  }

  if (!t.standalone) html += baseFieldsBlock();

  html += sectionTitle('braces', 'Example payload');
  if (t.illustrative) html += illustrativeNote();
  RAW['ex'] = t.example;
  html += codeBlock(t.example, 'ex');
  return html;
}

function renderGenericType(g: any) {
  const badges = [
    `<span class="pill bg-violet-900/50 text-violet-300 border border-violet-700/50">Generic detection</span>`,
    originBadge(g.origin),
    `<span class="pill bg-slate-700/60 text-slate-300 border border-slate-600 font-mono">Id ${g.id}</span>`,
    `<span class="pill bg-slate-700/60 text-slate-400 border border-slate-600">${esc(g.family)}</span>`,
  ].join('');

  let html = header(g.label, `GenericDetection · ${g.name}`, badges);
  html += `<p class="text-sm text-slate-300 leading-relaxed mt-4">A <span class="font-mono text-violet-300">GenericDetection</span> with
    <span class="font-mono text-slate-200">GenericDetectionTypeId = ${g.id}</span>. Payload-specific values live in
    <span class="font-mono text-slate-200">AdditionalParameters._parameters</span>.</p>`;

  if (g.note) {
    html += `<p class="text-xs text-amber-200/90 mt-3 px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-700/40"><i data-lucide="alert-triangle" class="inline w-3.5 h-3.5 mr-1 text-amber-400"></i>${esc(g.note)}</p>`;
  }

  if (g.params && g.params.length) {
    html += sectionTitle('key-round', 'AdditionalParameters keys', `${g.params.length} key${g.params.length === 1 ? '' : 's'}`);
    html += `<div class="flex flex-wrap gap-1.5">` +
      g.params.map((p: string) => `<span class="pill bg-slate-800 text-teal-300 border border-slate-700 font-mono">${esc(p)}</span>`).join('') +
      `</div>`;
  } else {
    html += `<p class="text-sm text-slate-500 italic mt-6">Specific parameter keys for this type are not documented here — they are payload-specific. The base structure below applies.</p>`;
  }

  html += sectionTitle('layers', 'GenericDetection base fields');
  html += fieldTable(D.GENERIC_BASE.fields);
  html += baseFieldsBlock();

  html += sectionTitle('braces', 'Example payload');
  if (g.example) {
    RAW['ex'] = g.example;
    html += codeBlock(g.example, 'ex');
  } else {
    const ex = `{
  "GenericDetectionTypeId": ${g.id},
  "AdditionalParameters": {
    "_parameters": {${(g.params || ['Key1', 'Key2']).slice(0, 6).map((p: string) => `\n      "${p}": "…"`).join(',')}
    }
  },
  "IsFailed": false,
  "Location": "POINT (34.8 32)",
  "SourceType": 5,
  "DataCenterId": "6baaa0a8-6428-44ea-a4a3-e3c3336a8d68",
  "Id": "{{guid}}",
  "Time": "{{timestamp}}"
}`;
    RAW['ex'] = ex;
    html += `<p class="text-xs text-slate-500 mb-2 italic">Illustrative — no captured sample on record for this type.</p>`;
    html += codeBlock(ex, 'ex');
  }
  return html;
}

function renderBaseOverview() {
  let html = header('Base fields', 'UniqueData → DetectionBase', `<span class="pill bg-slate-700/60 text-slate-300 border border-slate-600">shared by every detection</span>`);
  html += `<p class="text-sm text-slate-300 leading-relaxed mt-4">Every detection (except the standalone <span class="font-mono">AggregatedSegmentData</span>) inherits these fields. Concrete types add their own on top.</p>`;
  html += sectionTitle('layers', 'DetectionBase fields');
  html += fieldTable(D.BASE_FIELDS);
  html += sectionTitle('file', 'FileObject', 'shape of each entry in DetectionBase.Files');
  html += fieldTable(D.FILE_OBJECT_FIELDS);
  html += `<p class="text-xs text-slate-500 mt-6 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700"><i data-lucide="git-compare" class="inline w-3.5 h-3.5 mr-1 text-sky-400"></i>These base fields are identical in both Main-Next and Main-Global. See <a data-nav="diff" class="text-sky-300 underline cursor-pointer">Codebase Differences</a> for branch gaps.</p>`;
  return html;
}

function renderDiff() {
  const c = D.CODEBASE_DIFF;
  let html = header('Codebase Differences', 'Main-Next  ↔  Main-Global',
    `<span class="pill bg-orange-900/40 text-orange-300 border border-orange-700/50">Main-Next</span>
     <span class="pill bg-sky-900/50 text-sky-300 border border-sky-700/50">Main-Global</span>`);

  html += `<p class="text-sm text-slate-300 leading-relaxed mt-4">${esc(c.summary)}</p>`;
  html += `<div class="grid grid-cols-2 gap-3 mt-4">
    <div class="rounded-lg border border-orange-700/40 bg-orange-950/20 px-3 py-2"><p class="text-xs font-semibold text-orange-300">${esc(c.branches.next.label)}</p><p class="text-xs text-slate-400 font-mono mt-0.5">${esc(c.branches.next.path)}</p></div>
    <div class="rounded-lg border border-sky-700/40 bg-sky-950/20 px-3 py-2"><p class="text-xs font-semibold text-sky-300">${esc(c.branches.global.label)}</p><p class="text-xs text-slate-400 font-mono mt-0.5">${esc(c.branches.global.path)}</p></div>
  </div>`;

  html += `<div class="mt-4 rounded-lg border border-emerald-700/40 bg-emerald-950/20 px-4 py-3 flex items-start gap-2">
    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 flex-none mt-0.5"></i>
    <p class="text-sm text-emerald-200">Base classes (UniqueData → DetectionBase, ${D.BASE_FIELDS.length} fields) and all types common to both branches are <strong>identical</strong> in fields and types.</p></div>`;

  html += sectionTitle('plus-circle', 'Strongly-typed detections in Main-Global only', `${c.globalOnlyTyped.length} new classes`);
  html += `<div class="flex flex-wrap gap-2">` +
    c.globalOnlyTyped.map((n: string) => `<span class="pill bg-sky-950/40 text-sky-300 border border-sky-800/50 font-mono">${esc(n)}</span>`).join('') + `</div>`;

  html += sectionTitle('git-merge', 'Coexisting (not renames)');
  html += `<ul class="text-sm text-slate-300 space-y-2 list-disc pl-5">` +
    c.coexistNotes.map((n: string) => `<li>${esc(n)}</li>`).join('') + `</ul>`;

  html += sectionTitle('database', 'Generic registry divergence', 'high-id range (100101+)');
  html += `<table class="field-table"><thead><tr><th>Id</th><th>Name</th><th>Where</th><th>Note</th></tr></thead><tbody>` +
    c.genericDiff.map((d: any) => `<tr>
      <td class="field-name">${d.id}</td>
      <td class="field-type" style="color:#e2e8f0">${esc(d.name)}</td>
      <td>${d.in === 'global'
            ? '<span class="pill bg-sky-900/50 text-sky-300 border border-sky-700/50">Main-Global</span>'
            : '<span class="pill bg-orange-900/40 text-orange-300 border border-orange-700/50">Main-Next</span>'}</td>
      <td class="field-desc">${esc(d.note)}</td>
    </tr>`).join('') + `</tbody></table>`;

  html += `<div class="mt-4 text-xs text-slate-500 space-y-1">` +
    c.registryFiles.map((f: string) => `<p class="font-mono">${esc(f)}</p>`).join('') + `</div>`;

  html += `<p class="text-xs text-slate-400 mt-6 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700"><i data-lucide="info" class="inline w-3.5 h-3.5 mr-1 text-sky-400"></i>${esc(c.notRealGaps)}</p>`;
  return html;
}

function buildDetail(id: string) {
  if (id === 'base') return renderBaseOverview();
  if (id === 'diff') return renderDiff();
  if (id.startsWith('g:')) {
    const g = D.GENERIC_TYPES.find((x: any) => 'g:' + x.name === id);
    return g ? renderGenericType(g) : '';
  }
  const t = D.TYPED_DETECTIONS.find((x: any) => x.id === id);
  return t ? renderTyped(t) : '';
}

/* ----------------------------------------------------------------- component */
export default function Page() {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // deep-link on first load (e.g. #diff)
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (h) setSelected(h);
  }, []);

  // (re)draw lucide icons whenever the rendered markup changes
  useEffect(() => {
    window.lucide?.createIcons();
  });

  // reset scroll on navigation
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [selected]);

  const detailHtml = selected ? buildDetail(selected) : '';

  function onDetailClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const copyBtn = target.closest('[data-copy]') as HTMLElement | null;
    if (copyBtn) {
      const key = copyBtn.getAttribute('data-copy') || 'ex';
      navigator.clipboard.writeText(RAW[key] || '').then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
      return;
    }
    const navLink = target.closest('[data-nav]') as HTMLElement | null;
    if (navLink) {
      const id = navLink.getAttribute('data-nav');
      if (id) setSelected(id);
    }
  }

  const q = query.trim().toLowerCase();
  const match = (label: string, tag?: string) =>
    !q || label.toLowerCase().includes(q) || (tag || '').toLowerCase().includes(q);

  const families = useMemo(
    () => [...new Set(D.GENERIC_TYPES.map((g: any) => g.family))] as string[],
    [],
  );

  const navBtn = (id: string, label: string, tag?: string, origin?: string) => (
    <button
      key={id}
      className={`nav-item${selected === id ? ' active' : ''}`}
      onClick={() => setSelected(id)}
    >
      {origin === 'global' && <span className="odot odot-g" title="Main-Global only" />}
      {origin === 'next' && <span className="odot odot-n" title="Main-Next only" />}
      <span className="truncate">{label}</span>
      {tag && <span className="nav-id">{tag}</span>}
    </button>
  );

  const refItems = [
    { id: 'base', label: 'Base fields', tag: undefined as string | undefined },
    { id: 'diff', label: 'Codebase Differences', tag: 'N↔G' },
  ].filter((r) => match(r.label, r.tag));

  const typedItems = D.TYPED_DETECTIONS.filter((t: any) => match(t.name));

  return (
    <div className="h-full flex flex-col">
      {/* Navbar */}
      <header className="flex-none flex items-center justify-between px-5 py-3 bg-slate-800 border-b border-slate-700 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <i data-lucide="radar" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">Detection Types Explorer</h1>
            <p className="text-xs text-slate-400 leading-none mt-0.5">System knowledge base — fields &amp; examples per detection type</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {D.TYPED_DETECTIONS.length} typed · {D.GENERIC_TYPES.length} generic
          </span>
          <button
            onClick={() => setSelected('base')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-white hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-500 transition-colors"
          >
            <i data-lucide="layers" className="w-3.5 h-3.5" />
            <span>Base fields</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex-none flex flex-col bg-slate-800/50 border-r border-slate-700 overflow-hidden">
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <i data-lucide="search" className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Filter detection types…"
                autoComplete="off"
                className="w-full bg-slate-700/60 text-sm text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-3 py-2 border border-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            {refItems.length > 0 && <div className="nav-group-title">Reference</div>}
            {refItems.map((r) => navBtn(r.id, r.label, r.tag))}

            {typedItems.length > 0 && <div className="nav-group-title">Strongly-typed detections</div>}
            {typedItems.map((t: any) => navBtn(t.id, t.name, undefined, t.origin))}

            {families.some((fam) => D.GENERIC_TYPES.some((g: any) => g.family === fam && match(g.name, String(g.id)))) && (
              <div className="nav-group-title">Generic detections</div>
            )}
            {families.map((fam) => {
              const items = D.GENERIC_TYPES.filter((g: any) => g.family === fam && match(g.name, String(g.id)));
              if (!items.length) return null;
              return (
                <div key={fam}>
                  <div className="px-4 pt-2 pb-1 text-[10px] font-semibold text-slate-600">{fam}</div>
                  {items.map((g: any) => navBtn('g:' + g.name, g.name, String(g.id), g.origin))}
                </div>
              );
            })}

            <div className="nav-legend">
              <span><span className="odot odot-g" /> Main-Global only</span>
              <span><span className="odot odot-n" /> Main-Next only</span>
            </div>
          </nav>
        </aside>

        {/* Detail */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <i data-lucide="radar" className="w-7 h-7 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400">Pick a detection type from the left</p>
                <p className="text-xs text-slate-600 max-w-md">
                  Every detection in the system, its fields (with C# types) and a ready-to-read example payload.
                  Verified against the Main-Next &amp; Main-Global codebases.
                </p>
              </div>
            ) : (
              <div
                className="px-8 py-6 pb-24 max-w-5xl"
                onClick={onDetailClick}
                dangerouslySetInnerHTML={{ __html: detailHtml }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-lg flex items-center gap-2 transition-opacity ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <i data-lucide="check" className="w-4 h-4" /> Example copied to clipboard
      </div>
    </div>
  );
}
