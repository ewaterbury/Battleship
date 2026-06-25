export function cellSizeObserver(referenceCell) {
    // Validate input is DOM element.
    if (!(referenceCell instanceof Element))
        throw new TypeError("cellSizeObserver expects a DOM element");

    // Create ResizeObserver that runs on reference cell size change.
    const observer = new ResizeObserver(([entry]) => {
        // Get width of reference cell.
        const { width } = entry.contentRect;

        // Update --board-cell-side prop on stylesheet.
        document.documentElement.style.setProperty(
            "--board-cell-side",
            `${width}px`,
        );
    });

    // Initialize observation of reference cell.
    observer.observe(referenceCell);
}
