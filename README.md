Esse projeto foi feito como entrega do tech challenge da segunda etapa do curso de pós graduaçãoem front-end da  Pós Tech-FIAP. Projeto feito por: Nicolas Elviani Lemos de Almeida (solo)

## Como rodar localmente

Rodar esse projeto exige o uso da linha de comando. Sempre que algum comando for citado na lista abaixo, tenha em mente que se trata de comando do CMD aberto no diretório do projeto.

Como rodar esse projeto localmente:

1. Instale o docker desktop na sua máquina e deixe ele rodando. Vá nesse link: https://www.docker.com/ . A versão grátis é suficiente

2. Com o docker instalado e aberto, crie o arquivo docker-compose.yml com o seguinte conteúdo:

````yaml

services: 
    postgres_db:
        image: postgres:18rc1
        container_name: bd_bytebank
        networks:
            -   bridge-tech-challenge
        ports:
            -   5433:5432
        environment:
            -   POSTGRES_PASSWORD=Sua_senha
            -   POSTGRES_USER=Seu_user
            -   POSTGRES_DB=Seu_bd
        volumes:
            -   volume-postgres:/var/lib/postgresql/data    
    
networks:
    bridge-tech-challenge:
        driver: bridge

volumes:
    volume-postgres:

````

Obs: Onde está "Sua_senha", "Seu_user" e "Seu_bd", troque pela senha, usuário e nome de banco de dados de sua preferência. Eu coloquei como porta 5433 ao invés de 5432 pq na minha máquina já tinha o postgres instalado

3. Use o comando `docker compose up -d`

4. Na linha de comando, use `yarn install` para instalar as dependências.

5. Crie um arquivo `.env` no diretório raiz da aplicação. É nele que estará contido tanto a string de conexão com o postgres (DATABASE_URL) quanto a complexidade da sua SaltKey para hashear a senha do usuário (SALT_ROUNDS), mas evite um número mto grande para que a aplicação não fique irresponsiva; Por questões de segurança, arquivos .env nunca são subidos para o repositório remoto

	1. Exemplo de string de conexão no arquivo .env: `DATABASE_URL="postgresql://postgres:MinhaSenha3%40%40@localhost:5432/bank_db?schema=public"`
	2. Exemplo de SALT_ROUNDS no .env: `SALT_ROUNDS=6`
	
6. Copie o `.env` da raiz para o diretório de todos os apps que o integram a aplicação (localizados em `/apps/nome-do-microfrontend)` exceto a root. Depois de fazer a cópia, pode apagar do diretório raiz

7. Crie um .env no raiz da aplicação root (`/apps/root`) com o seguinte conteúdo

````.env

DOMAIN_HOME=http://localhost:3001/
DOMAIN_DASHBOARD=http://localhost:3002/
DOMAIN_TRANSACTIONS=http://localhost:3003/
DOMAIN_INVESTMENTS=http://localhost:3004/
DOMAIN_ACCOUNT=http://localhost:3005/

````
	
8. Na primeira execução do projeto, use o comando `yarn run ini-dev`. Nas execuções subsequentes, use `yarn run dev`

9. Acesse a URL retornada pelo `yarn run dev` do projeto root no seu navegador (`localhost:3000` normalmente)