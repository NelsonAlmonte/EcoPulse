export function disableGoogleMapsFonts() {
	const head = document.head;

	const originalInsertBefore = head.insertBefore.bind(head);
	const originalAppendChild = head.appendChild.bind(head);

	function shouldBlock(node: Node) {
		if (!(node instanceof HTMLElement)) return false;

		if (node instanceof HTMLLinkElement && node.href.includes('fonts.googleapis.com')) {
			return true;
		}

		if (node instanceof HTMLStyleElement && node.textContent?.startsWith('.gm-style')) {
			node.textContent = '';
			return true;
		}

		return false;
	}

	head.insertBefore = ((newNode, referenceNode) => {
		if (shouldBlock(newNode)) return newNode;

		return originalInsertBefore(newNode, referenceNode);
	}) as typeof head.insertBefore;

	head.appendChild = ((node) => {
		if (shouldBlock(node)) return node;

		return originalAppendChild(node);
	}) as typeof head.appendChild;
}
