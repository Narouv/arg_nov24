
// when scrolling is at the top or almost at the top, the navbar wont move up when cursor is far away and/or inactive
export class NavbarManager {
    constructor(navbarElement) {
        this.navbar = navbarElement;
        this.mouseData = new MouseData();
        this.transInfo = new TranslateInfo();
        this.sizeInfo = new SizeInfo(this.navbar.offsetHeight, this.navbar.offsetWidth);
        this.navbarRemainder = this.sizeInfo.navbarHeight / 100 * 10;
        this.toggleTranslation = true;

        if (this.toggleTranslation) {
            this.timeoutId = setTimeout(() => {
                console.log("timeout");
                this.moveNavbarUpToThreshold();
            }, 10000);
        }

        // this.onResize = this.onResize.bind(this);
        // this.handleScroll = this.handleScroll.bind(this);
        // this.handleMouseMove = this.handleMouseMove.bind(this);

        window.addEventListener('resize', this.onResize.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('scroll', this.handleScroll.bind(this));
    }

    onResize() {
        // console.log("onResize");
        const oldHight = this.sizeInfo.navbarHeight;
        const oldOffsetY = this.transInfo.navbarYOffset;

        this.sizeInfo.update(this.navbar.offsetHeight, this.navbar.offsetWidth);

        const heightDiff = this.sizeInfo.navbarHeight - oldHight;
        const percentage = heightDiff / oldHight;

        if (this.sizeInfo.windowWidth < 768)
            this.navbarRemainder = 10;
        else
            this.navbarRemainder = this.sizeInfo.navbarHeight / 100 * 10;
        this.transInfo.navbarYOffset = oldOffsetY + (oldOffsetY * percentage);
        this.moveNavbar(this.transInfo.navbarYOffset);
        let x = this.sizeInfo.windowWidth - 500;
        if (x < 0)
            x = 0;
        let y = 6 * Math.exp(-0.0024 * x);
        let contBoxTranslation = (this.sizeInfo.navbarHeight ? this.sizeInfo.navbarHeight : 40) + this.sizeInfo.vwInPx * 3.5 + (this.sizeInfo.vwInPx * y);
        // console.log("x: ", x);
        // console.log("y: ", y);
        // console.log("navbarHeight: ", this.sizeInfo.navbarHeight);
        // console.log("vwInPx: ", this.sizeInfo.vwInPx);
        // console.log("contBoxTranslation: ", contBoxTranslation);
        // console.log("navbarRemainder: ", this.navbarRemainder);
        // if (contBoxTranslation < 80)
        //     contBoxTranslation = "80px";
        // else
        //     contBoxTranslation = `${this.sizeInfo.navbarHeight + this.sizeInfo.vwInPx * 3.5 + (this.sizeInfo.vwInPx * y)}px`;
        this.contentBox = document.getElementById("content");
        this.contentBox.style.top = `${contBoxTranslation}px`;
    }

    handleMouseMove(event) {
        this.mouseData.update(
                this,
                this.navbar.getBoundingClientRect(),
                event.clientX,
                event.clientY,
                this.sizeInfo.windowHeight,
                this.sizeInfo.windowWidth,
                );

        if (this.mouseData.hovering) {
            if (this.transInfo.navbarYOffset < 0)
                this.moveNavbarDown();
            if (this.toggleTranslation && this.timeoutId) {
                // console.log("clear timeout");
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        }
        else if (this.toggleTranslation && this.transInfo.navbarYOffset > -(this.sizeInfo.navbarHeight - this.navbarRemainder) && !this.timeoutId) {
            // console.log("set timeout");
            // console.log("set timeout");
            this.timeoutId = setTimeout(() => {
                // console.log("timeout");
                this.moveNavbarUpToThreshold();
            }, 5000);
        }
    }

    handleScroll() {
        this.transInfo.update(
            window.scrollX,
            window.scrollY
        );
        const maxScrollY = document.documentElement.scrollHeight - this.sizeInfo.windowHeight;
        const currentScrollY = this.transInfo.totalScrollY;
        const scrollDiff = this.transInfo.totalScrollY - this.transInfo.prev_totalScrollY;
        if (this.transInfo.totalScrollY == 0)
            this.moveNavbarDown();
    }

    // almostScrolledUp() {
    //     if (this.transInfo.totalScrollY <= (this.sizeInfo.navbarHeight - this.navbarRemainder) * 5) {
    //         console.log("almostScrolledUp");
    //         return true;
    //     }
    //     console.log("not almostScrolledUp");
    //     return false;
    // }

    isHovering() {
        if (this.mouseData.cursorX >= this.mouseData.navbarRect.left - this.mouseData.proximityThresholdX
                && this.mouseData.cursorX <= this.mouseData.navbarRect.right + this.mouseData.proximityThresholdX
                && this.mouseData.cursorY >= this.mouseData.navbarRect.top - this.mouseData.proximityThresholdY
                && this.mouseData.cursorY <= this.mouseData.navbarRect.bottom + this.mouseData.proximityThresholdY) {
            return true;
        }
        return false;
    }

    moveNavbarUpToThreshold() {
        this.moveNavbar(-(this.sizeInfo.navbarHeight - this.navbarRemainder));
    }

    moveNavbar(translateTarget) {
        if (!this.toggleTranslation)
            return;
        if (translateTarget <= -(this.sizeInfo.navbarHeight - this.navbarRemainder)) {
            translateTarget = -(this.sizeInfo.navbarHeight - this.navbarRemainder);
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            // console.log("clear timeout");
        }
        else if (this.transInfo.navbarYOffset == -(this.sizeInfo.navbarHeight - this.navbarRemainder) && translateTarget > -(this.sizeInfo.navbarHeight - this.navbarRemainder)) {
            // console.log("set timeout");
            this.timeoutId = setTimeout(() => {
                // console.log("timeout");
                this.moveNavbarUpToThreshold();
            }, 5000);
        }
        else if (translateTarget > 0)
            translateTarget = 0;
        this.navbar.style.transition = 'transform 0.8s ease';
        this.navbar.style.transform = `translateY(${translateTarget}px)`;
        this.transInfo.navbarYOffset = translateTarget;
        // console.log("moveNavbar navbarYOffset: ", this.transInfo.navbarYOffset);
    }

    moveNavbarDown() {
        this.navbar.style.transition = 'transform 0.5s ease';
        this.navbar.style.transform = 'translateY(0)';
        this.transInfo.navbarYOffset = 0;
        // console.log("moveNavbarDown navbarYOffset: ", this.transInfo.navbarYOffset);
    }
}

class TranslateInfo {
    constructor() {
        this.totalScrollX = 0;
        this.totalScrollY = 0;
        this.prev_totalScrollX = 0;
        this.prev_totalScrollY = 0;
        this.navbarYOffset = 0;
        this.navbarXOffset = 0;
    }

    // copy constructor
    copy(other) {
        const newInstance = new TranslateInfo();
        newInstance.totalScrollX = other.totalScrollX;
        newInstance.totalScrollY = other.totalScrollY;
        newInstance.prev_totalScrollX = other.prev_totalScrollX;
        newInstance.prev_totalScrollY = other.prev_totalScrollY;
        newInstance.navbarYOffset = other.navbarYOffset;
        newInstance.navbarXOffset = other.navbarXOffset;
        return newInstance;
    }

    update(scrollX, scrollY) {
        this.prev_totalScrollX = this.totalScrollX;
        this.prev_totalScrollY = this.totalScrollY;
        this.totalScrollX = scrollX;
        this.totalScrollY = scrollY;
    }
}

class MouseData {
    constructor() {
        this.navbarRect = null;
        this.cursorX = 0;
        this.cursorY = 0;
        this.proximityThresholdY = 0;
        this.proximityThresholdX = 0;
        this.hovering = false;
    }

    // Copy constructor
    copy(other) {
        const newInstance = new MouseData();
        newInstance.navbarRect = other.navbarRect;
        newInstance.cursorX = other.cursorX;
        newInstance.cursorY = other.cursorY;
        newInstance.proximityThresholdY = other.proximityThresholdY;
        newInstance.proximityThresholdX = other.proximityThresholdX;
        newInstance.hovering = other.hovering;
        return newInstance;
    }

    update(navbarManager, navbarRect, cursorX, cursorY, windowHeight, windowWidth) {
        this.navbarManager = navbarManager;
        this.navbarRect = navbarRect;
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.proximityThresholdY = windowHeight / 100 * 2.5;
        this.proximityThresholdX = windowWidth / 100 * 1.5;
        this.hovering = this.isHovering();
    }

    isHovering() {
        if (this.navbarManager) {
            return this.navbarManager.isHovering();
        }
        return false;
    }
}

class SizeInfo {
    constructor(navbarHeight, navbarWidth) {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.navbarHeight = navbarHeight;
        this.navbarWidth = navbarWidth;
        this.vwInPx = this.windowWidth / 100;
        this.vhInPx = this.windowHeight / 100;
    }

    // Copy constructor
    copy(other) {
        const newInstance = new SizeInfo();
        newInstance.windowWidth = other.windowWidth;
        newInstance.windowHeight = other.windowHeight;
        newInstance.navbarHeight = other.navbarHeight;
        newInstance.navbarWidth = other.navbarWidth;
        newInstance.vwInPx = other.vwInPx;
        newInstance.vhInPx = other.vhInPx;
        return newInstance;
    }

    update(navbarHeight, navbarWidth) {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.navbarHeight = navbarHeight;
        this.navbarWidth = navbarWidth;
        this.vwInPx = this.windowWidth / 100;
        this.vhInPx = this.windowHeight / 100;
    }
}
