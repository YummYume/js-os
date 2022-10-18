COMPOSE=docker compose
EXECNODE=$(COMPOSE) exec node

start:
	$(COMPOSE) build --force-rm
	$(COMPOSE) up -d --remove-orphans --force-recreate

up:
	$(COMPOSE) up -d --remove-orphans

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down

ssh:
	$(EXECNODE) sh

lint:
	$(EXECNODE) yarn lint

sync:
	@echo Syncing node_modules dependencies...
ifeq ($(OS)$(SHELL),Windows_NTsh.exe)
	if exist node_modules rmdir node_modules /S /Q
else
	rm -rf node_modules
endif
	mkdir node_modules
	docker cp js-os-node-1:/home/node/node_modules ./
	@echo Dependencies synced!
