
Currently set to refresh images every every 5 minutes.




Tail CronJob Logs
`tail -f /var/log/syslog | grep CRON`
`tail -f /var/log/image-fetch.log`


Run every 5 min
`*/5 * * * * /usr/bin/node /root/node-feed-thumbnailer/camScraper.js >> /var/log/image-fetch.log 2>&1`



I usually use Handlebars but messed a bit with Pug Here
[https://www.sitepoint.com/a-beginners-guide-to-pug/](https://www.sitepoint.com/a-beginners-guide-to-pug/)


If I want to deploy to Do
[https://coderrocketfuel.com/article/deploy-a-nodejs-application-to-digital-ocean-with-https](https://coderrocketfuel.com/article/deploy-a-nodejs-application-to-digital-ocean-with-https)


[https://coderrocketfuel.com/article/how-to-serve-static-files-using-node-js-and-express](https://coderrocketfuel.com/article/how-to-serve-static-files-using-node-js-and-express)

[deploy-a-nodejs-application-to-digital-ocean-with-https](deploy-a-nodejs-application-to-digital-ocean-with-https)


About pushing JSON
[https://attacomsian.com/blog/nodejs-read-write-json-files](https://attacomsian.com/blog/nodejs-read-write-json-files)