function Loading() {
    this.count = 0;
    this.el = document.querySelector('#loading');
}

Loading.prototype.show = function () {
    this.count++;
    if (this.count === 1) {
        this.el.style.display = 'flex';
    }
}
Loading.prototype.hide = function (type = 'all') {
    if (type === 'all') {
        this.count = 0;
    } else {
        if (this.count > 0) {
            this.count--;
        }
    }
    setTimeout(() => {
        if (this.count === 0) {
            this.el.style.display = 'none';
        }
    }, 300);
}

const loading = new Loading();
export default loading;