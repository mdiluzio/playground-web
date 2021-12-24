    // Settings:
    // Timeout to hide tooltip
    const TIMEOUT_LENGTH = 500;

    // global timeout map; quick n dirty
    const timeouts = new WeakMap();

    // if the user actively dismisses a tooltip, save that setting
    // and do not show the tooltip again
    const dismissals = new WeakMap();

    // here we attach all event listeners to control the tooltip
    function initTooltip(tooltipContainer: HTMLElement) {
        const trigger = tooltipContainer.classList.contains('tooltip-trigger') ? tooltipContainer : tooltipContainer.querySelector('.tooltip-trigger');
        const tooltip = tooltipContainer.querySelector('.tooltip');

        // show tooltip on hover and focus
        tooltipContainer.addEventListener('mouseenter', () => {
            showTooltip(tooltip);
        });
        trigger.addEventListener('focus', () => {
            showTooltip(tooltip);
        });

        // hide tooltip on mouse out and blur
        // use timeout on mouse leave
        tooltipContainer.addEventListener('mouseleave', () => {
            timeoutTooltip(tooltip);
        });
        trigger.addEventListener('blur', () => {
            hideTooltip(tooltip);
        });

        // hide the tooltip on escape key press
        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideTooltip(tooltip);
                // save dismissal
                dismissals.set(tooltip, true);
            }
        });

        // create a close button for pointer dismissal
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'X';
        closeBtn.tabIndex = -1;
        closeBtn.setAttribute('aria-hidden', 'true');
        closeBtn.classList.add('tooltip-close');
        tooltip.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => {
            hideTooltip(tooltip);
            // save dismissal
            dismissals.set(tooltip, true);
        });

        // hide the tooltip in here so they show up without JS on
        // debateably useful
        tooltip.style.display = 'none';
    }

    function showTooltip(tooltip: HTMLElement) {
        // do not show if tooltip has been dismissed
        if (dismissals.has(tooltip)) {
            return false;
        }

        tooltip.style.display = 'block';
        tooltip.removeAttribute('aria-hidden');

        // if a hide timeout exists for this tooltip, clear it
        if (timeouts.has(tooltip)) {
            window.clearTimeout(timeouts.get(tooltip));
        }
    }

    function hideTooltip(tooltip: HTMLElement) {
        tooltip.style.display = 'none';
        tooltip.setAttribute('aria-hidden', 'true');
    }

    function timeoutTooltip(tooltip: HTMLElement) {
        // hide the tooltip after a set amount of time
        const timeoutId = window.setTimeout(() => {
            hideTooltip(tooltip);
        }, TIMEOUT_LENGTH);

        // store the timeout so it can be cleared
        timeouts.set(tooltip, timeoutId);
    }

    // initiate tooltips
    const tooltips = document.querySelectorAll('.tooltip-wrapper');
    tooltips.forEach((tooltip) => {
        initTooltip(tooltip);
    });