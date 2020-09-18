class myAlert {
    show(msg, ms) {
        let alertWrapper = document.querySelector('body').querySelector('#my-alert');
        if (alertWrapper) {
            alertWrapper.style.display = 'flex';
            let alertContent = alertWrapper.querySelector('p');
            alertContent.innerText = msg;
            if (ms) {
                setTimeout(() => {
                    this.hide();
                }, ms);
            }
        } else {
            let alertWrapper = document.createElement('div');
            let alertContent = document.createElement('p');
            alertWrapper.id = 'my-alert';
            alertContent.className = 'my-alert-p';
            alertContent.innerText = msg;
            alertWrapper.appendChild(alertContent);
            document.querySelector('body').appendChild(alertWrapper);
            if (ms) {
                setTimeout(() => {
                    this.hide();
                }, ms);
            }
        }
    }
    hide() {
        let alertWrapper = document.querySelector('body').querySelector('#my-alert');
        if (alertWrapper) {
            alertWrapper.style.display = 'none';
        }
    }
}

export default new myAlert();