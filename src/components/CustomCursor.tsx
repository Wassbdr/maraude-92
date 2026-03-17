import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    document.body.classList.add('custom-cursor-enabled');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let followerX = targetX;
    let followerY = targetY;
    let isPointerVisible = false;
    let isHoveringAction = false;
    let animationFrame = 0;

    const setVisibility = (visible: boolean) => {
      if (!cursorRef.current || !followerRef.current) return;
      const opacity = visible ? '1' : '0';
      cursorRef.current.style.opacity = opacity;
      followerRef.current.style.opacity = opacity;
    };

    const setActionState = (active: boolean) => {
      isHoveringAction = active;
      if (!cursorRef.current || !followerRef.current) return;

      if (active) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(0.6)`;
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(1.8)`;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!isPointerVisible) {
        isPointerVisible = true;
        setVisibility(true);
      }

      const target = event.target as HTMLElement | null;
      const interactiveParent = target?.closest('a, button, input, textarea, select, label, [role="button"]');
      setActionState(Boolean(interactiveParent));
    };

    const onMouseLeave = () => {
      isPointerVisible = false;
      setVisibility(false);
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;

      followerX += (targetX - followerX) * 0.14;
      followerY += (targetY - followerY) * 0.14;

      if (cursorRef.current) {
        const scale = isHoveringAction ? 0.6 : 1;
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`;
      }

      if (followerRef.current) {
        const scale = isHoveringAction ? 1.8 : 1;
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(${scale})`;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="custom-cursor custom-cursor-follower" aria-hidden="true" />
      <div ref={cursorRef} className="custom-cursor custom-cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
