APP_NAME := semantic-app
CONFIG_FILE := config.yaml

GIT_DESCRIBE := $(shell git describe --tags --match 'v*' --abbrev=0 2>/dev/null)
ifeq ($(GIT_DESCRIBE),)
VERSION := 0.0.0
else
VERSION := $(subst v,,$(GIT_DESCRIBE))
endif

GIT_HEAD_EXISTS := $(shell git rev-parse --verify HEAD 2>/dev/null)
ifeq ($(GIT_HEAD_EXISTS),)
GIT_COMMIT :=
else
GIT_COMMIT := $(shell git rev-parse --short HEAD)
endif

BUILD_DATE := $(shell date -u '+%y%m%d%H%M%S')

BINARY := $(APP_NAME)

.PHONY: all build clean run package resources

all: build

build:
	go build -ldflags "\
        -X main.appVersion=$(VERSION) \
        -X main.buildDate=$(BUILD_DATE) \
        -X main.commitSHA=$(GIT_COMMIT)" \
        -o $(BINARY) main.go

run: build
	./$(BINARY)

clean:
	rm -f $(BINARY) $(APP_NAME)-*-*.tar.gz resources-*-*.tar.gz

package: build
	tar -czvf $(APP_NAME)-$(VERSION)-$(BUILD_DATE).tar.gz $(BINARY)

resources:
	tar -czvf resources-$(VERSION)-$(BUILD_DATE).tar.gz $(CONFIG_FILE)