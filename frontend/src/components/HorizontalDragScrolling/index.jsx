import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { ViewportContext } from '../../context/ViewportContext';

import { Container, Slider, SliderButton } from './styles.js';

const HorizontalDragScrolling = ({ children }) => {
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState();
  const [scrollLeft, setScrollLeft] = useState();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRigthButton, setShowRigthButton] = useState(false);

  const { width } = useContext(ViewportContext);

  const sliderRef = useRef();

  const handleShowSliderButtons = useCallback(() => {
    setShowLeftButton(sliderRef.current.scrollLeft !== 0);
    setShowRigthButton(
      sliderRef.current.scrollLeft + sliderRef.current.offsetWidth !==
        sliderRef.current.scrollWidth
    );
  }, [sliderRef]);

  useEffect(() => {
    if (sliderRef.current) {
      handleShowSliderButtons();
    }
  }, [handleShowSliderButtons, sliderRef, width]);

  const handleStart = (e) => {
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMove = (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const speed = 1;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * speed;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    handleShowSliderButtons();
  };

  const handleLeave = () => {
    setIsDown(false);
  };

  const handleEnd = () => {
    setIsDown(false);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const speed = 1;
    const walk = (e.changedTouches[0].clientX - startX) * speed;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    handleShowSliderButtons();
  };

  const handleArrowLeftButton = () => {
    const scrollLeft = sliderRef.current.scrollLeft;
    const walk = parseInt(sliderRef.current.offsetWidth / 4);
    sliderRef.current.scrollLeft =
      scrollLeft - walk > 0 ? scrollLeft - walk : 0;
    handleShowSliderButtons();
  };

  const handleArrowRightButton = () => {
    const scrollLeft = sliderRef.current.scrollLeft;
    const walk = parseInt(sliderRef.current.offsetWidth / 4);
    sliderRef.current.scrollLeft =
      scrollLeft + walk > sliderRef.current.scrollWidth
        ? scrollLeft + walk
        : sliderRef.current.scrollWidth;
    handleShowSliderButtons();
  };

  return (
    <Container>
      {showLeftButton && (
        <SliderButton onClick={handleArrowLeftButton}>
          <FaChevronLeft />
        </SliderButton>
      )}
      <Slider
        ref={sliderRef}
        onMouseDown={handleStart}
        onMouseLeave={handleLeave}
        onMouseUp={handleEnd}
        onMouseMove={handleMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {children}
      </Slider>
      {showRigthButton && (
        <SliderButton onClick={handleArrowRightButton}>
          <FaChevronRight />
        </SliderButton>
      )}
    </Container>
  );
};

export default HorizontalDragScrolling;
