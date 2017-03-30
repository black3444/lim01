# 배포(Deploying) [(원본)](https://guides.emberjs.com/v2.11.0/tutorial/deploying/)

Ember 애플리케이션을 배포하려면 단순히 `ember build`의 결과물을 웹 서버로 전송하면 된다. 이것은 `rsync`나 `scp`와 같은 표준 유닉스 파일 전송 도구로도 할 수 있따. 또한 쉽게 배포할 수 있는 서비스도 있다.

## scp로 배포하기

`ember build`의 결과물을 웹서버에 복사하여 아무 웹서버에 애플리케이션을 배포할 수 있다.

```
ember build
scp -r dist/* myserver.com:/var/www/public/
```

## surge.sh로 배포하기

[Surge.sh](http://surge.sh/)를 사용하면 모든 폴더를 무료로 웹에 게시할 수 있다. Ember 애플리케이션을 배포하려면 `ember build`에서 생성된 폴더를 배포하면 된다.

surge cli 툴을 인스톨해야 한다:
```
npm install -g surge
```

그런 다음 `surge` 명령어를 사용하여 애플리케이션을 배포할 수 있다. Ember의 클라이언트 측 라우팅을 사용하려면 index.html 을 200.html로 변경해야한다.

```
ember build --environment=development
mv dist/index.html dist/200.html
surge dist funny-name.surge.sh
```

여기서는 funny-name.surge.sh를 선택했지만, 당신은 소유하지 않은 서 도메인이나, 소유한 커스텀 도메인을 사용하고, surge 서버중 하나에 DNS를 지정했을수도 있다. 두번째 인수가 비어있으면 surge가 제안하는 서브도메인으로 물어본다.

변경 후에 동일한 URL에 배포하려면 이전과 동일한 도메인을 다시 사용하여 똑같은 단계를 수행하라.

```
rm -rf dist
ember build --environment=development
mv dist/index.html dist/200.html
surge dist funny-name.surge.sh
```

우리는 `--environment=development`를 사용하여 Mirage가 계속 가짜 데이터를 제공하도록 한다. 하지만 일반적으로 `ember build --environment=production`을 사용하여 실서비스 어플리케이션을 최적화한다.

## 서버
### 아파치

Ember 라우팅이 제대로 동작하려면 Apache 서버에서 rewrite 엔진(mod_rewrite)를 활성화해야한다. `dist`폴더를 업로드하면 기본 URL은 동작하지만 `{main URL}/example`과 같은 경로로 가려고 시도하면 404를 반환하면서 서버가 "친숙한" URL로 구성되지 않는다.

이 문제를 해결하려면 `.htaccess`라는 파일을 웹 사이트의 루트 폴더에 추가하라. 이 라인들을 추가하라:

```
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule (.*) index.html [L]
</IfModule>
```

서버 구성이 다를 수도 있으므로 다른 옵션이 필요할 수도 있다. 자세한 내용은 [Apache URL Rewriting 가이드](http://httpd.apache.org/docs/2.0/misc/rewriteguide.html)를 참조하라
