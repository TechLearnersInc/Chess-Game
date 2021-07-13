all:
	@make down
	@make clean
	@make build
	@make up

build:
	@docker-compose -f docker-compose.yml build --no-cache

up:
	@docker-compose -f docker-compose.yml up --force-recreate -d

start:
	@docker-compose -f docker-compose.yml start

down:
	@docker-compose -f docker-compose.yml down

destroy:
	@docker-compose -f docker-compose.yml down -v

stop:
	@docker-compose -f docker-compose.yml stop

restart:
	@docker-compose -f docker-compose.yml stop
	@docker-compose -f docker-compose.yml up -d

logs:
	@docker-compose -f docker-compose.yml logs --tail=100 -f

ps:
	@docker-compose -f docker-compose.yml ps
