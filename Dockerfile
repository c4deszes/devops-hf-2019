FROM node
WORKDIR /usr/src/app
COPY package* ./
COPY tsconfig* ./
COPY tslint* ./
COPY src/ src/
COPY env/ env/
COPY util/ util/
COPY spec/ spec/
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
ENTRYPOINT [ "/bin/bash" ]