FROM golang:latest
WORKDIR /go/src/hasangenc0/social-game/server
COPY . .
RUN make build-api
RUN ./bin/api
EXPOSE 8080
CMD ["hasangenc0/social-game/server"]