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
