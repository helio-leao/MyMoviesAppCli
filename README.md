# My Movies App

Aplicação que possibilita a busca de informações sobre filmes, seriados e profissionais do cinema como diretores, escritores e atores. Além disso, permite seguir essas pessoas e visualizar as obras nas quais estão envolvidas.

Trata-se de uma aplicação fictícia que tem como finalidade servir de base para execução de testes e2e (end to end) por algumas ferramentas para comparação.

Esse aplicativo utiliza a [API do TMDB](https://developer.themoviedb.org/reference/intro/getting-started) para obter os dados.

## Como rodar a aplicação

1. Utilize o node package manager para instalar as dependências da aplicação.

```bash
npm install
```

2. É necessário obter um token de acesso à API do TMDB. Para tanto, é preciso [criar uma conta](https://www.themoviedb.org/signup). O processo é gratuito e requer pouquíssimos dados.

3. Agora, basta logar e obter o "Token de Leitura da API" na [seção API](https://www.themoviedb.org/settings/api) das configurações de perfil.

4. No diretório raiz do código da aplicação, crie o arquivo .env e adicione a ele a seguinte variável de ambiente contendo o token obtido anteriormente (sem espaços e sem aspas).

```javascript
API_TOKEN=seu-token-da-api
```

6. Execute a aplicação.

```bash
npm start
```

## Os testes

Os arquivos contendo os códigos para automação da suite de testes referente à funcionalidade da aplicação "seguir pessoa", que vai desde a busca de uma pessoa até a operação de seguir e verificação, encontram-se na pasta "e2e" do diretório raiz do código da aplicação.

## Como rodar os testes

### Detox

Basta executar os comandos.

Android

```bash
detox test --configuration android.emu.debug
```

### Maestro

1. É necessário fazer a [instalação](https://maestro.mobile.dev/getting-started/installing-maestro) independente da ferramenta. A documentação oficial detalha o processo. No [canal do youtube](https://www.youtube.com/@mobile-dev) é possível obter mais informações sobre, por exemplo, a [instalação no windows](https://www.youtube.com/watch?v=VLi1Pu2Kb-4).

2. Após instalado e funcionando, é necessário acessar a pasta e2e que se encontra no diretório raiz da aplicação através do terminal do ubuntu. Nela se encontra o arquivo com o código da suite de teste que será executada no próximo passo.

```bash
cd local-do-projeto/e2e
```

3. Com os processos necessários rodando (descritos na documentação oficial), execute o seguinte comando no terminal do ubuntu substituindo o ip do exemplo abaixo pelo da sua máquina.

```bash
maestro --host 192.168.1.2 test maestro.follow.person.test.yaml
```

4. Se desejável obter o tempo de execução, adicione "time" ao comando.

```bash
time maestro --host 192.168.1.2 test maestro.follow.person.test.yaml
```