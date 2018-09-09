# jirapi
지라 이슈를 검색해서 슬랙으로 보내기

### 라이브러리
- axios
- express
- body-parser

### API
- Jira REST API
- Slack REST API

### crontab
- ```chmod 777 chkproc.sh```
- ```* * * * * /home/bsscco/jirapi/chkproc.sh > /home/bsscco/jirapi/crontab-chkproc.log 2>&1```
