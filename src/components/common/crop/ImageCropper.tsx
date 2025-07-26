import { useEffect, useRef, useState } from "react";
import c from "@/utils/c";
import MoveIcon from "@/assets/icons/four-arrow-white.svg?react";
import DeleteIcon from "@/assets/icons/delete-white.svg?react";

export interface BoundingBox {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface ImageCropperProps {
  imgSrc: string;
  boundingBoxes: Array<BoundingBox>;
  selectedIndex: number;
  onChange: (newBoundingBoxes: Array<BoundingBox>) => void;
  onOverlappingIndicesChange?: (newOverlappingIndices: Set<number>) => void;
}

function getImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.crossOrigin = "anonymous";

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = reject;
  });
}

function isOverlapping(a: BoundingBox, b: BoundingBox): boolean {
  return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}

function getOverlappingIndices(boxes: Array<BoundingBox>): Set<number> {
  const overlapping = new Set<number>();

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (isOverlapping(boxes[i], boxes[j])) {
        overlapping.add(i);
        overlapping.add(j);
      }
    }
  }

  return overlapping;
}

export default function ImageCropper({
  imgSrc,
  boundingBoxes,
  selectedIndex,
  onChange,
  onOverlappingIndicesChange,
}: ImageCropperProps) {
  // Image 가로 크기 계산
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const CONTAINER_HEIGHT = 440;

  useEffect(() => {
    const calcWidth = async () => {
      const size = await getImageSize(imgSrc);
      setImgWidth(size.width * (CONTAINER_HEIGHT / size.height));
    };

    calcWidth();
  }, []);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);

  // 가상 가로 스크롤바 생성
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateThumb = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      const ratio = clientWidth / scrollWidth;
      const newWidth = ratio * clientWidth;
      const newLeft = (scrollLeft / scrollWidth) * clientWidth;
      setThumbWidth(newWidth);
      setThumbLeft(newLeft);
    };

    updateThumb();
    el.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;

    let startX = 0;
    let startScrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const scrollRatio = el.scrollWidth / el.clientWidth;
      el.scrollLeft = startScrollLeft + dx * scrollRatio;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    thumb.addEventListener("mousedown", onMouseDown);
    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  // 박스 이동 로직
  const moveRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = moveRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let boundingArea: BoundingBox = { x1: 0, x2: 0, y1: 0, y2: 0 };

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      boundingArea = { ...boundingBoxes[selectedIndex] };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newBoundingBoxes = [...boundingBoxes];
      const newBox: BoundingBox = {
        x1: boundingArea.x1 + dx,
        x2: boundingArea.x2 + dx,
        y1: boundingArea.y1 + dy,
        y2: boundingArea.y2 + dy,
      };

      if (
        newBox.x1 >= 0 &&
        newBox.y1 >= 0 &&
        newBox.x2 <= imgWidth - 20 &&
        newBox.y2 <= CONTAINER_HEIGHT - 20
      ) {
        newBoundingBoxes[selectedIndex] = newBox;
        onChange(newBoundingBoxes);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, [imgWidth, boundingBoxes, selectedIndex]);

  // 크기 조절 로직
  const sizeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sizeRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let boundingArea: BoundingBox = { x1: 0, x2: 0, y1: 0, y2: 0 };

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      boundingArea = { ...boundingBoxes[selectedIndex] };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newBoundingBoxes = [...boundingBoxes];
      const newBox: BoundingBox = {
        x1: boundingArea.x1,
        x2: boundingArea.x2 + dx,
        y1: boundingArea.y1,
        y2: boundingArea.y2 + dy,
      };

      if (
        newBox.x1 + 20 <= newBox.x2 &&
        newBox.y1 + 20 <= newBox.y2 &&
        newBox.x2 <= imgWidth - 20 &&
        newBox.y2 <= CONTAINER_HEIGHT - 20
      ) {
        newBoundingBoxes[selectedIndex] = newBox;
        onChange(newBoundingBoxes);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, [imgWidth, boundingBoxes, selectedIndex]);

  // 삭제 로직
  const handleDelete = () => {
    if (boundingBoxes.length > 1) {
      const newBoundingBoxes = [...boundingBoxes];
      newBoundingBoxes.splice(selectedIndex, 1);
      onChange(newBoundingBoxes);
    }
  };

  // 바운딩 박스 겹침 감지
  const [overlappingIndices, setOverlappingIndices] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const newOverlappingIndices = getOverlappingIndices(boundingBoxes);
    setOverlappingIndices(newOverlappingIndices);
    onOverlappingIndicesChange &&
      onOverlappingIndicesChange(newOverlappingIndices);
  }, [boundingBoxes]);

  return (
    <div className={c("relative", "w-[440px]", "h-[440px]", "select-none")}>
      <div
        className={c("relative", "w-full", "h-full", "overflow-x-auto")}
        ref={scrollRef}
        style={{ scrollbarWidth: "none" }}
      >
        {imgWidth ? (
          <>
            {boundingBoxes.map((box, idx) => {
              return (
                <div
                  key={`boundingBox-${idx}`}
                  style={{
                    left: box.x1,
                    top: box.y1,
                    width: `${box.x2 - box.x1}px`,
                    height: `${box.y2 - box.y1}px`,
                  }}
                  className={c(
                    "border-[3px]",
                    selectedIndex === idx
                      ? overlappingIndices.has(idx)
                        ? "border-tmoji-red z-10"
                        : "border-tmoji-orange z-10"
                      : "border-tmoji-light-grey",
                    "absolute",
                    "rounded-[5px]",
                  )}
                >
                  <div
                    className={c(
                      "absolute",
                      selectedIndex === idx
                        ? "bg-tmoji-orange-linear"
                        : "bg-tmoji-light-grey",
                      "w-[26px]",
                      "h-[26px]",
                      "rounded-full",
                      "text-center",
                      "text-[16px]",
                      "font-black",
                    )}
                    style={{ top: -15, left: -15 }}
                  >
                    {idx + 1}
                  </div>
                  {selectedIndex === idx ? (
                    <>
                      {/* Move 아이콘 */}
                      <div
                        className={c("absolute")}
                        style={{
                          left: `${(box.x2 - box.x1) / 2 - 1.5}px`,
                          top: `${box.y2 - box.y1 - 5}px`,
                        }}
                      >
                        <div
                          className={c(
                            "w-[3px]",
                            "h-[20px]",
                            "bg-tmoji-orange",
                          )}
                        />
                        <div
                          ref={moveRef}
                          className={c(
                            "cursor-move",
                            "absolute",
                            "w-[26px]",
                            "h-[26px]",
                            "bg-tmoji-orange",
                            "flex",
                            "items-center",
                            "justify-center",
                            "rounded-full",
                          )}
                          style={{ left: -11.5, bottom: -16 }}
                        >
                          <MoveIcon width={16} height={16} />
                        </div>
                      </div>
                      {/* 삭제 아이콘 */}
                      {boundingBoxes.length > 1 ? (
                        <div
                          onClick={handleDelete}
                          className={c("absolute")}
                          style={{
                            left: `${box.x2 - box.x1 - 5}px`,
                            top: `${(box.y2 - box.y1) / 2 - 1.5}px`,
                          }}
                        >
                          <div
                            className={c(
                              "w-[20px]",
                              "h-[3px]",
                              "bg-tmoji-orange",
                            )}
                          />
                          <div
                            className={c(
                              "cursor-pointer",
                              "absolute",
                              "w-[26px]",
                              "h-[26px]",
                              "bg-tmoji-orange",
                              "flex",
                              "items-center",
                              "justify-center",
                              "rounded-full",
                            )}
                            style={{ right: -16, bottom: -11.5 }}
                          >
                            <DeleteIcon width={12} height={12} />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* 크기 조절 */}
                      <div
                        ref={sizeRef}
                        className={c(
                          "cursor-se-resize",
                          "absolute",
                          "w-[10px]",
                          "h-[10px]",
                          "bg-tmoji-light-orange",
                          "border-2",
                          "border-tmoji-grey",
                          "flex",
                          "items-center",
                          "justify-center",
                        )}
                        style={{ right: -6, bottom: -6 }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
            <div className={c("h-full")} style={{ width: imgWidth }}>
              <img
                ref={imgRef}
                src={imgSrc}
                className="h-full object-cover"
                alt="img"
                style={{ width: imgWidth }}
                draggable={false}
              />
            </div>
            {/* ✅ Custom scrollbar */}
          </>
        ) : (
          "loading"
        )}
      </div>
      <div className="absolute bottom-1 left-0 w-full h-2 pointer-events-none">
        <div
          ref={thumbRef}
          className="absolute h-full bg-white/80 rounded pointer-events-auto cursor-pointer transition-opacity duration-200"
          style={{ width: `${thumbWidth}px`, left: `${thumbLeft}px` }}
        />
      </div>
    </div>
  );
}
