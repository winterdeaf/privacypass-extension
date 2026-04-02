import {
  update_extension_icon
} from '../scripts/icon.js'

const enabled_checkbox = document.querySelector("#kagipp-enabled")
const incognito_only_checkbox = document.querySelector("#kagipp-incognito-only")
const status_message_indicator = document.querySelector("#status-message-indicator")

async function update_indicator_opacity(enabled) {
  if (!status_message_indicator) {
    return;
  }
  if (typeof enabled === "undefined") {
    const { _enabled } = await browser.storage.local.get({ 'enabled': false })
    enabled = _enabled;
  }
  if (enabled) {
    status_message_indicator.style.opacity = 1;
  } else {
    status_message_indicator.style.opacity = 0.5;
  }
}

async function is_enabled() {
  if (!browser.storage) {
    return;
  }
  const { enabled } = await browser.storage.local.get({ 'enabled': false })
  enabled_checkbox.checked = enabled;
  if (incognito_only_checkbox) {
    incognito_only_checkbox.disabled = !enabled;
  }
  await update_indicator_opacity(enabled);
  await update_extension_icon(enabled);
}

async function set_enabled() {
  if (!browser.storage || !browser.runtime) {
    return;
  }
  // the UI determines if it should be enabled or not, not background.js
  const enabled = enabled_checkbox.checked;
  await browser.storage.local.set({ 'enabled': enabled })
  browser.runtime.sendMessage('enabled_changed')
  await update_indicator_opacity(enabled);
}

async function is_incognito_only() {
  if (!browser.storage) {
    return;
  }
  const { incognito_only } = await browser.storage.local.get({ 'incognito_only': true })
  if (incognito_only_checkbox) {
    incognito_only_checkbox.checked = incognito_only;
  }
}

async function set_incognito_only() {
  if (!browser.storage || !browser.runtime) {
    return;
  }
  const incognito_only = incognito_only_checkbox.checked;
  await browser.storage.local.set({ 'incognito_only': incognito_only })
  browser.runtime.sendMessage('incognito_only_changed')
}

export {
  is_enabled,
  set_enabled,
  is_incognito_only,
  set_incognito_only
};
