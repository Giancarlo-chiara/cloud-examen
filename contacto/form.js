/*
MIT License

Copyright (c) 2026 Colorlib

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function installFormRuntime(validate = validateFormInputs) {
  document.querySelectorAll('form[data-fw]').forEach(form => {
    if (form.dataset.fwReady) return;
    form.dataset.fwReady = 'true';
    const status = form.querySelector('[data-status]');
    const summary = form.querySelector('[data-errors]');
    const button = form.querySelector('[type=submit]');
    const normalLabel = button.textContent;
    function setButtonText(text) {
      const label = button.firstElementChild;
      if (label) label.textContent = text;
      else button.textContent = text;
    }
    form.noValidate = true;
    function clearErrors() {
      summary.replaceChildren(); summary.hidden = true;
      form.querySelectorAll('[data-error]').forEach(el => { el.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    }
    const showErrors = force => validate(form, force);
    function setState(state) {
      const label = button.dataset.fwSubmitLabel ?? normalLabel;
      status.textContent = ''; status.dataset.kind = ''; button.disabled = false; setButtonText(form.dataset.editorMode === 'build' ? label : label || 'Submit');
      clearErrors();
      if (state === 'invalid') showErrors(true);
      if (state === 'sending') { button.disabled = true; setButtonText('Sending…'); status.textContent = 'Simulation: request in progress. Nothing is sent.'; }
      if (state === 'accepted') { status.dataset.kind = 'success'; status.textContent = 'Simulation: the endpoint accepted the request. This does not confirm email delivery.'; }
      if (state === 'failed') { status.dataset.kind = 'error'; status.textContent = 'Simulation: connection failed. Your answers are still here. Nothing was sent.'; }
    }
    form.addEventListener('submit', event => {
      const preview = form.dataset.preview === 'true';
      if (preview || form.dataset.delivery === 'later') event.preventDefault();
      const invalid = showErrors(false);
      if (invalid) { event.preventDefault(); status.textContent = ''; invalid.focus(); return; }
      if (preview) {
        const state = form.dataset.testState === 'normal' ? 'accepted' : form.dataset.testState;
        setState(state); return;
      }
      if (form.dataset.delivery === 'later') {
        status.dataset.kind = 'error'; status.textContent = 'This form is a draft. Connect a form endpoint before collecting responses. Nothing was sent.';
      }
      // Connected exports use native POST. The endpoint owns its response page.
    });
    if (form.dataset.preview === 'true') {
      setState(form.dataset.testState || 'normal');
      window.addEventListener('message', event => {
        if (event.source !== parent || !event.data) return;
        if (event.data.type === 'fw-editor-mode' && ['build', 'test', 'export'].includes(event.data.mode)) form.dataset.editorMode = event.data.mode;
        if (event.data.type !== 'fw-test-state') return;
        if (['normal', 'invalid', 'sending', 'accepted', 'failed'].includes(event.data.state)) {
          form.dataset.testState = event.data.state; setState(event.data.state);
        }
      });
      const reportHeight = () => parent.postMessage({ type: 'fw-preview-height', projectId: form.dataset.editorProject, revision: Number(form.dataset.editorRevision), height: Math.ceil(form.getBoundingClientRect().height + parseFloat(getComputedStyle(document.body).paddingTop) + parseFloat(getComputedStyle(document.body).paddingBottom)) }, '*');
      new ResizeObserver(reportHeight).observe(form);
      reportHeight();
    }
  });
})(function validateFormInputs(form, force = false) {
  const summary = form.querySelector('[data-errors]');
  summary.replaceChildren(); summary.hidden = true;
  form.querySelectorAll('[data-error]').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const errors = [];
  form.querySelectorAll('[data-field]').forEach(group => {
    const inputs = [...group.querySelectorAll('input,textarea,select')].filter(input => input.name);
    const first = inputs[0]; if (!first) return;
    const requiredGroup = group.dataset.required === 'true';
    const checked = inputs.some(el => el.checked);
    const invalid = inputs.find(el => !el.validity.valid);
    const empty = requiredGroup && ['checks', 'radio'].includes(group.dataset.type) && !checked;
    if (!invalid && !empty && !(force && !errors.length)) return;
    const target = invalid || first;
    const label = group.dataset.label;
    const message = empty || target.validity.valueMissing ? `Complete ${label}.`
      : target.validity.typeMismatch ? `Enter a valid email address for ${label}.`
      : target.validity.rangeUnderflow ? `Use a value of ${target.min} or more for ${label}.`
      : target.validity.rangeOverflow ? `Use a value of ${target.max} or less for ${label}.`
      : target.validity.stepMismatch ? `Enter a valid number for ${label}.`
      : force && target.validity.valid ? `Example error for ${label}. No answers were sent.`
      : `Check ${label} and try again.`;
    group.querySelector('[data-error]').textContent = message;
    inputs.forEach(el => el.setAttribute('aria-invalid', 'true'));
    errors.push({ target, message });
  });
  if (!errors.length) return false;
  const heading = document.createElement('p'); heading.textContent = `Please check ${errors.length === 1 ? 'this field' : 'these fields'}.`;
  const list = document.createElement('ul');
  errors.forEach(({ target, message }) => {
    const item = document.createElement('li'); const link = document.createElement('a');
    link.href = '#' + target.id; link.textContent = message;
    link.addEventListener('click', event => { event.preventDefault(); target.focus(); });
    item.append(link); list.append(item);
  });
  summary.append(heading, list); summary.hidden = false;
  return errors[0].target;
});
