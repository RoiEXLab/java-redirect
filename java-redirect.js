browser.webRequest.onBeforeRequest.addListener(redirectJava, {urls: ["*://docs.oracle.com/javase/*/docs/*"]}, ["blocking"]);

function redirectJava(details){
	const redirectionTarget = details.url.replace(/^https?\:\/\/docs\.oracle\.com\/javase\/(?:[678]|(?:1\.(?:(?:5\.0)|(?:4\.2)|[3])))/g, "https://docs.oracle.com/javase/8");
	if(redirectionTarget !== details.url){
		const request = new XMLHttpRequest();
		request.open('HEAD', redirectionTarget, false);
		request.send(null);
		if(request.status === 200){
		  return {redirectUrl: redirectionTarget};
		}
	}
	return {};
}
