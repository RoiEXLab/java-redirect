const getReplaceAlgorithm = async version => {
	switch (version) {
		case '8':
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))/g, 'https://docs.oracle.com/javase/8');
		case '9':
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:javafx|javase)\/(?:[6789]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(?:docs|javafx))/g, 'https://docs.oracle.com/javase/9/docs');
		case '10':
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|(?:javafx|javase)\/(?:[6789]|10|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(?:docs|javafx))/g, 'https://docs.oracle.com/javase/10/docs');
		default:
			const response = await fetch(browser.extension.getURL('json/modules.json'));
			const moduleMap = (await response.json()).reduce((map, element) => {
				map[element.package] = element.module;
				return map;
			}, {});
		  return url => {
				if (url.includes('javafx')) {
					return url.replace(/^https?\:\/\/docs\.oracle\.com\/(?:javafx\/2|javase\/(?:[89]|10)\/javafx)\/api\/([a-z/]+)\//g, (_, g1) => `https://openjfx.io/javadoc/11/${moduleMap[g1.replace(/\//g, '.')]}/${g1}/`);
				}
				return url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[6789]|10|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/docs\/api\/([a-z/]+)\//g, (_, g1) => `https://docs.oracle.com/en/java/javase/11/docs/api/${moduleMap[g1.replace(/\//g, '.')]}/${g1}/`);
			};
	}
};

browser.webRequest.onBeforeRequest.addListener(
	async details => {
		// Only redirect HTML
		if (!details.url.matches(/\.html(?:#.*)?$/)) {
			return {};
		}
		const result = await browser.storage.sync.get();
		const replaceUrl = await getReplaceAlgorithm(result['java-version']);
		const redirectionTarget = replaceUrl(details.url);

		if (redirectionTarget !== details.url) {
			const response = await fetch(redirectionTarget, { method: 'HEAD' });
			if (response.ok && !response.redirected) {
			  return { redirectUrl: redirectionTarget };
			}
		}
		return {};
	},
	{
		urls: ['*://docs.oracle.com/*'],
		types: ['main_frame', 'sub_frame']
	},
	['blocking']
);

/*
Execute on https://docs.oracle.com/javase/10/docs/api/module-overview-frame.html
to get module JSON for java 10:

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('body > main > ul > li > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return Array.prototype.map.call(dummyElement.querySelectorAll('main > ul > li > a'), p => ({ package: p.innerHTML, module: a.innerHTML }));
}))).flatMap(a => a));

Execute on https://docs.oracle.com/en/java/javase/11/docs/api/allpackages-index.html
to get module JSON for java 11:

JSON.stringify((await Promise.all(Array.prototype.map.call(document.querySelectorAll('main > div > ul > li > table > tbody > tr > th > a'), async a => {
  const response = await fetch(a.href);
  const dummyElement = document.createElement('html');
  dummyElement.innerHTML = await response.text();
  return { package: a.innerHTML, module: dummyElement.querySelector('main > div > div > a').innerHTML };
}))));
*/
