import React, {useRef, useState, useEffect} from "react";
import {Slider, Box, IconButton} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

type HighlightRange = {
    from: number;
    to: number;
    claim?: string | null;
    violence?: boolean | null;
};

type TimeLineSliderProps = {
    width?: string;
    height?: string;
    startYear: number;
    endYear: number;
    backgroundColor?: string;
    initialValue?: number;
    highlightRanges?: HighlightRange[];
    disable?: boolean;
    handleChangeHelper?: (year: number) => void;

    // NEW props for scroll syncing
    scrollLeft: number;
    onScrollLeftChange: (val: number) => void;
};

const TimeLineSlider: React.FC<TimeLineSliderProps> = ({
    width = "100%",
    height = "120px",
    disable = false,
    startYear,
    endYear,
    backgroundColor = "#663399",
    initialValue = 1945,
    highlightRanges,
    handleChangeHelper,
    scrollLeft,
    onScrollLeftChange
}) => {
    const [value, setValue] = useState<number>(initialValue);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const legendItems = [
        {label: "Autonomy", color: "#90ee90"},
        {label: "Sub-state secession", color: "#006400"},
        {label: "Independence", color: "#add8e6"},
        {label: "Irredentism", color: "#00008b"}
    ];

    const generateBackgroundColor = (range: HighlightRange) => {
        const idx = legendItems.findIndex((el) => el.label === range?.claim);
        return idx !== -1 ? legendItems[idx].color : "#A9A9A9";
    };

    const handleChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            handleChangeHelper?.(newValue);
            setValue(newValue);
        }
    };

    const marks = [];
    for (let year = startYear; year <= endYear; year++) {
        marks.push({value: year, ...(year % 5 === 0 && {label: `${year}`})});
    }

    const scrollBy = (offset: number) => {
        const el = scrollContainerRef.current;
        if (el) {
            el.scrollBy({left: offset, behavior: "smooth"});
        }
    };

    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setShowLeftArrow(el.scrollLeft > 0);
        setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
        onScrollLeftChange(el.scrollLeft); // send scroll pos to parent
    };

    // Sync when parent scrollLeft changes
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el && Math.abs(el.scrollLeft - scrollLeft) > 1) {
            el.scrollTo({left: scrollLeft});
        }
    }, [scrollLeft]);

    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <Box width={width} height={height} display="flex" alignItems="center" position="relative">
            {showLeftArrow && (
                <IconButton
                    onClick={() => scrollBy(-200)}
                    sx={{position: "absolute", left: 0, zIndex: 10}}
                    aria-label="Scroll left"
                >
                    <ChevronLeft fontSize="small" />
                </IconButton>
            )}

            <Box
                ref={scrollContainerRef}
                onScroll={handleScroll}
                sx={{
                    flex: 1,
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    paddingX: 2,
                    mx: 6,
                    position: "relative"
                }}
            >
                <Box
                    sx={{
                        width: `${(endYear - startYear) * 30}px`,
                        minWidth: "600px",
                        position: "relative"
                    }}
                >
                    {/* Highlight overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "28%",
                            left: 0,
                            transform: "translateY(-50%)",
                            height: "6px",
                            width: "100%",
                            pointerEvents: "none",
                            zIndex: 1
                        }}
                    >
                        {highlightRanges?.map((range, index) => {
                            const left = ((range.from - startYear) / (endYear - startYear)) * 100;
                            const widthBar =
                                range.to !== 2020
                                    ? ((range.to - range.from + 1) / (endYear - startYear)) * 100
                                    : ((range.to - range.from) / (endYear - startYear)) * 100;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "absolute",
                                        left: `${left}%`,
                                        width: `${widthBar}%`,
                                        height: "100%",
                                        backgroundColor: generateBackgroundColor(range),
                                        backgroundImage: range?.violence
                                            ? `repeating-linear-gradient(
                          45deg,
                          rgba(255, 255, 255, 0.7) 0,
                          rgba(255, 255, 255, 0.7) 5px,
                          transparent 10px,
                          transparent 20px
                        )`
                                            : "none",
                                        borderRadius: "3px"
                                    }}
                                ></Box>
                            );
                        })}
                    </Box>

                    <Slider
                        disabled={disable}
                        value={value}
                        min={startYear}
                        max={endYear}
                        step={1}
                        marks={marks}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            color: backgroundColor,
                            "& .MuiSlider-markLabel": {
                                fontSize: "0.75rem"
                            },
                            "& .MuiSlider-valueLabel": {
                                fontSize: "0.7rem",
                                backgroundColor: backgroundColor,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                top: 40,
                                "&:before": {
                                    transform: "scale(0.6)"
                                }
                            },
                            ...(disable && {
                                "& .MuiSlider-thumb": {
                                    display: "none"
                                }
                            })
                        }}
                    />
                </Box>
            </Box>

            {showRightArrow && (
                <IconButton
                    onClick={() => scrollBy(200)}
                    sx={{position: "absolute", right: 0, zIndex: 10}}
                    aria-label="Scroll right"
                >
                    <ChevronRight fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

export default TimeLineSlider;
