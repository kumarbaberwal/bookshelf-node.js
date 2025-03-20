import { CronJob } from 'cron';
import https from 'https'
import { ENV_VARS } from '../configs/config'


export const cronJob = new CronJob('*/14 * * * *', function () {
    https.get(ENV_VARS.API_URL, (res) => {
        if (res.statusCode === 200) {
            console.log("GET request sent successfully");
        } else {
            console.log("GET request failed: ", res.statusCode);
        }
    }).on('error', (e) => {
        console.log('Error while sending request: ', e);
    })
})