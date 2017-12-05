FROM 103738324493.dkr.ecr.us-west-2.amazonaws.com/dashevo/v13-node-base:latest
LABEL maintainer="Dash Developers <dev@dash.org>"
LABEL description="Dockerised CoPay Dash deployment"

# update package index and install packages
RUN apk add --update --no-cache git openssh-client python alpine-sdk

WORKDIR /app

# copy package manifest separately from code to avoid installing packages every
# time code is changed
COPY bower.json jsdoc.conf.json package.json /app/
COPY ./app-template/ /app/app-template/
# RUN npm install

COPY . /app

RUN npm run apply:dash
# "apply:dash": "npm i fs-extra && cd app-template && node apply.js dash && npm i && cordova prepare",
# RUN npm i fs-extra
# RUN (cd app-template && node apply.js dash)
# RUN npm i
# RUN cordova prepare

# ports
#   ???? - copay
#EXPOSE ????

CMD /bin/ash
