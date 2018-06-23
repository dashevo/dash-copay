FROM beevelop/cordova:latest
LABEL maintainer="Dash Developers <dev@dash.org>"
LABEL description="Dockerised CoPay Dash deployment"

WORKDIR /build

# copy package manifest separately from code to avoid installing packages every
# time code is changed
COPY bower.json jsdoc.conf.json package.json package-lock.json /build/

COPY ./app-template/ /build/app-template/

RUN apt-get -y update && apt-get -y install bzip2 python build-essential

RUN npm install

COPY . /build

RUN npm run apply:dash

# patch broken version of this module
RUN (cd /build/node_modules/asn1.js-rfc5280 && patch -p1 < /build/01-browserify.patch)

# some hack to work around a buggy version
RUN npm uninstall -g cordova
RUN npm install -g cordova@7.1.0

RUN /build/node_modules/grunt/bin/grunt && cordova prepare android && cordova build android --release

CMD /bin/bash
