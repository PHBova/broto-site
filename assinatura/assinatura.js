// Gerador da assinatura de e-mail. Layout aprovado no Figma (Broto, 03 · Materials,
// 05 · Email Signature, opção A): logo 112 centrado no texto, hairline, duas linhas.
// Tudo em tabela e estilo inline, porque cliente de e-mail ignora <style> na assinatura.

const SITE = 'brotodigital.com';
const STORE = 'broto-signature';

// Imagem de assinatura precisa de endereço público: vale o do próprio site.
// Aberto como arquivo local, usa o endereço do GitHub Pages.
const ASSETS = /^https?:$/.test(location.protocol)
  ? new URL('../assets/signature/', location.href).href
  : 'https://phbova.github.io/broto-site/assets/signature/';

const C = {
  ink: '#101010',        // color/neutral/950
  secondary: '#6E6C64',  // color/neutral/600
  hairline: '#E4E0D3',   // color/neutral/200
  link: '#285900',       // color/green/800
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const form = document.getElementById('sig-form');
const out = document.getElementById('sig-out');
const status = document.getElementById('sig-status');
const btnRich = document.getElementById('copy-rich');
const btnHtml = document.getElementById('copy-html');
const f = {
  name: form.elements.name,
  role: form.elements.role,
  phone: form.elements.phone,
  email: form.elements.email,
};

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// 11975649774 vira "11 97564-9774"; fixo com 10 dígitos vira "11 3456-7890".
function formatPhone(raw) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('55') && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  const cut = rest.length > 8 ? 5 : 4;
  return rest.length > cut ? `${ddd} ${rest.slice(0, cut)}-${rest.slice(cut)}` : `${ddd} ${rest}`;
}

function item(icon, href, label, style, last) {
  return `<span style="display:inline-block;white-space:nowrap;margin:4px ${last ? 0 : 16}px 0 0;">`
    + `<img src="${ASSETS}${icon}.png" width="14" height="14" alt="" style="display:inline-block;width:14px;height:14px;border:0;vertical-align:-2px;margin-right:6px;">`
    + `<a href="${href}" style="${style}text-decoration:none;">${label}</a></span>`;
}

function build(v) {
  const name = esc(v.name.trim() || 'Nome Sobrenome');
  const role = esc(v.role.trim());
  const phone = formatPhone(v.phone);
  const email = esc(v.email.trim() || 'nome@brotodigital.com');
  const digits = phone.replace(/\D/g, '');

  const items = [];
  if (digits.length >= 10) items.push(['phone', `tel:+55${digits}`, phone, `color:${C.ink};`]);
  items.push(['email', `mailto:${email}`, email, `color:${C.ink};`]);
  items.push(['site', `https://${SITE}`, SITE, `color:${C.link};font-weight:600;`]);

  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${FONT};">`
    + '<tr>'
    + `<td width="112" style="vertical-align:middle;width:112px;min-width:112px;padding:0 20px 0 0;">`
    + `<a href="https://${SITE}" style="text-decoration:none;"><img src="${ASSETS}logo.png" width="112" height="42" alt="broto." style="display:block;width:112px;max-width:none;height:42px;border:0;"></a>`
    + '</td>'
    + `<td style="vertical-align:middle;padding:0 0 0 20px;border-left:1px solid ${C.hairline};">`
    + `<div style="font-family:${FONT};font-size:15px;line-height:20px;color:${C.ink};">`
    + `<span style="font-weight:600;">${name}</span>`
    + (role ? `<span style="font-size:13px;color:${C.secondary};">&nbsp;&nbsp;${role}</span>` : '')
    + '</div>'
    + `<div style="font-family:${FONT};font-size:13px;line-height:16px;color:${C.ink};">`
    + items.map((it, i) => item(...it, i === items.length - 1)).join('')
    + '</div>'
    + '</td>'
    + '</tr></table>';
}

function values() {
  return { name: f.name.value, role: f.role.value, phone: f.phone.value, email: f.email.value };
}

function ready() {
  const v = values();
  const okName = v.name.trim().length > 0;
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim());
  return okName && okEmail;
}

// Tela mais estreita que a assinatura: reduz a prévia inteira em vez de cortar.
const prevTitle = document.getElementById('prev-t');
function fit() {
  out.style.zoom = '';
  const room = out.parentElement.clientWidth
    - parseFloat(getComputedStyle(out.parentElement).paddingLeft)
    - parseFloat(getComputedStyle(out.parentElement).paddingRight);
  const scale = Math.min(1, room / out.scrollWidth);
  if (scale < 1) out.style.zoom = scale.toFixed(3);
  prevTitle.textContent = scale < 1 ? 'Prévia reduzida para caber na tela' : 'Prévia no tamanho real';
}

function render() {
  out.innerHTML = build(values());
  fit();
  const ok = ready();
  btnRich.disabled = !ok;
  btnHtml.disabled = !ok;
  try { localStorage.setItem(STORE, JSON.stringify(values())); } catch (e) { /* sem storage, segue */ }
}

function say(msg) {
  status.textContent = msg;
  clearTimeout(say.t);
  say.t = setTimeout(() => { status.textContent = ''; }, 4000);
}

// Cópia com formatação: o que o Gmail e o Apple Mail colam como assinatura pronta.
async function copyRich() {
  const html = build(values());
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([out.innerText], { type: 'text/plain' }),
    })]);
  } catch (e) {
    // Navegador sem ClipboardItem: seleciona a prévia e copia.
    const range = document.createRange();
    range.selectNodeContents(out);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();
  }
  say('Assinatura copiada. Cole nas configurações do e-mail.');
}

async function copyHtml() {
  const html = build(values());
  try { await navigator.clipboard.writeText(html); } catch (e) {
    const ta = Object.assign(document.createElement('textarea'), { value: html });
    document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  say('HTML copiado.');
}

f.phone.addEventListener('input', () => {
  const pos = f.phone.value.length;
  f.phone.value = formatPhone(f.phone.value);
  if (pos === f.phone.value.length) f.phone.setSelectionRange(pos, pos);
});
f.email.addEventListener('blur', () => {
  const v = f.email.value.trim();
  f.email.setAttribute('aria-invalid', v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'true' : 'false');
});
form.addEventListener('input', render);
addEventListener('resize', fit);
form.addEventListener('submit', (e) => e.preventDefault());
btnRich.addEventListener('click', copyRich);
btnHtml.addEventListener('click', copyHtml);

try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved) for (const k of Object.keys(f)) if (typeof saved[k] === 'string') f[k].value = saved[k];
} catch (e) { /* sem storage, começa vazio */ }
render();
