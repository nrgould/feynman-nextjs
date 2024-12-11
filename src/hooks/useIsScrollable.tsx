import { useCallback, useLayoutEffect, useState } from "react";

export const useIsScrollable = (dependencies: unknown[]) => {
  const [node, setNode] = useState<HTMLDivElement>();
  const ref = useCallback((node: HTMLDivElement) => {
    setNode(node);
  }, []);

  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!node) return;

    setIsScrollable(node.scrollHeight > node.clientHeight);
  }, [...dependencies, node]);

  useLayoutEffect(() => {
    if (!node) return;

    const handleWindowResize = () => {
      setIsScrollable(node.scrollHeight > node.clientHeight);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [node]);

  return [isScrollable, ref, node] as const;
};
