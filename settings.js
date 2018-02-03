const settings = document.querySelector('#settings');
settings.addEventListener('change', () => browser.storage.sync.set({
  'java-version': settings.value
}));

document.addEventListener('DOMContentLoaded', () => browser.storage.sync.get().then(result => settings.value = result['java-version'] || "default"));
