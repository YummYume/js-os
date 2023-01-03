export const removeChildNodes = (element: Element | Node, keepNodes: string[] = []) => {
  const childNodes = [...element.childNodes];

  childNodes.forEach((child) => {
    if (keepNodes.includes(child.nodeName)) {
      return;
    }

    element.removeChild(child);
  });
};
