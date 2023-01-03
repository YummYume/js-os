export const removeChildNodes = (element: Element | Node, keepNodes: Array<string> = []) => {
    const childNodes = [...element.childNodes];

    childNodes.forEach((child) => {
        if (keepNodes.includes(child.nodeName)) {
            return;
        }

        element.removeChild(child);
    });
};
