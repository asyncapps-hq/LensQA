chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== 'lensqa-capture') return
  const draft = {
    url: location.href,
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    masks: [],
    createdAt: new Date().toISOString(),
  }
  // never expose service credentials to page scripts — user pastes project token in extension options later
  console.info('[LensQA] draft capture', draft)
  alert('LensQA draft captured (see console). Configure project token in extension options.')
})
