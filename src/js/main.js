document.addEventListener('DOMContentLoaded', () => {
  const msg = document.getElementById('message');
  const btn = document.getElementById('clickMe');
  if (!msg || !btn) return;
  btn.addEventListener('click', () => {
    msg.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`;
  });
});
