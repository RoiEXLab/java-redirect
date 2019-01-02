const settings = document.getElementById('settings');
settings.addEventListener('change', () => browser.storage.sync.set({
  'java-version': settings.value
}));

document.addEventListener('DOMContentLoaded', async () => settings.value = (await browser.storage.sync.get())['java-version'] || 'default');
