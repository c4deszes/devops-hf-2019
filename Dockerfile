FROM node
WORKDIR /usr/src/app
COPY package* ./
COPY src/ src/
COPY public/ public/
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
ENTRYPOINT [ "/bin/bash" ]