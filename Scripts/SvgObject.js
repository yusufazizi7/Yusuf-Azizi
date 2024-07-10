document.addEventListener('DOMContentLoaded', function() {
    // Select elements with either 'svgObject' or 'anotherClass'
    const svgElements = document.querySelectorAll('.svgObject, .quransvg');

    svgElements.forEach(function(svgElement) {
        svgElement.addEventListener('load', function() {
            const svgDocument = this.contentDocument;
            svgDocument.addEventListener('click', function(e) {
                const event = new Event('click', { bubbles: true });
                document.dispatchEvent(event);
            });
        });
    });
});