const getReplaceAlgorithm = version => {
	switch (version) {
		case '8':
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))/g, 'https://docs.oracle.com/javase/8');
		case '9':
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(javafx\/2|(javafx|javase)\/(?:[6789]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(docs|javafx))/g, 'https://docs.oracle.com/javase/9/docs');
		default:
			return url => url.replace(/^https?\:\/\/docs\.oracle\.com\/(javafx\/2|(javafx|javase)\/(?:[6789]|10|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))\/(docs|javafx))/g, 'https://docs.oracle.com/javase/10/docs');
	}
};

browser.webRequest.onBeforeRequest.addListener(
	async details => {
		const result = await browser.storage.sync.get();
		const replaceUrl = getReplaceAlgorithm(result['java-version']);
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
