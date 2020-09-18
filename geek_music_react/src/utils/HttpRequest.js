import Axios from 'axios';
import Qs from 'qs';
import Loading from '@/utils/Loading'

function httpRequest(config) {
    let method = config.method || 'get';
    let data = config.data || '';
    // let url = 'http://localhost:3001' + config.url;
    let url = config.url;
    let showLoading = config.showLoading || false;
    return new Promise(function (resolve, reject) {
        if (showLoading) Loading.show();
        Axios({
            method: method,
            url: url,
            data: Qs.stringify(data)
        }).then(res => {
            Loading.hide();
            resolve(res);
        }).catch(err => {
            Loading.hide();
            reject(err);
        });
    })
}
export default httpRequest;