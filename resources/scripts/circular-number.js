function CircularNumber(elems, num) {
    const NUMBER_LENGTH = 8;
    const MAX_NUMBER = Number("9".repeat(NUMBER_LENGTH));
    this.num = typeof num == "number"? num : 0;
    this.prevNumStr = "0".repeat(NUMBER_LENGTH);

    this.init = function() {
        if( typeof elems == "object" ) {
            let html = "";
            for( let i = 0; i < 8; i++ ) {
                html += `<article class="circular-num-container">
                            <div class="circular-num">
                                <span>0</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                            </div>
                        </article>`;
            }
            elems.innerHTML = html;
        }

        this.setNumber(this.num);
    }

    this.setNumber = function(num, duration) {
        this.num = Math.max(0, Math.min(MAX_NUMBER, num));
        let numStr = String(this.num).padStart(NUMBER_LENGTH, "0");
        if( typeof elems == "object" ) {
            [...elems.getElementsByClassName("circular-num")].forEach((o, i) => {
                if( numStr[i] != this.prevNumStr[i] ) {
                    o.animate({transform: `translateY(-${numStr[i] * 10}%)`}, {"duration": typeof duration == "number"? duration : 200, fill: "forwards"});
                }
            });
        }
        this.prevNumStr = numStr;
    }
}