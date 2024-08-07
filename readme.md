## Disclaimer

A pasta ``desafio-versao-1`` fiz a utilização do ``heatmap.js`` que funcionou para ``chair`` e ``person``, mas qualquer outro objeto não funcionava. Gastei 2 dias tentando resolver, plotando na mão e não funcionava. Pelo fato da dependência ser extremamente antiga (8 anos sem update), fiz o teste utilizando o canvas do HTML no ``desafio-versao-2``. Funcionou e fui para o ``desafio-versao-3`` que é o **principal**, aonde usei ``Angular`` e ``canvas`` para plotar os dados na tela. Como não consegui nem uma dependência que funcionasse para todos os dados, optei por criar meu próprio plot. Tentei com o ``heatmap.js``, ``heatcanvas`` e ``visual-heatmap``. Iria utilizar o ``redwood`` mas como nunca trabalhei com isso, optei por deixar de lado. Tentei utilizar o ``ArcGIS`` da ``ESRI`` (utilizo para geoprocessamento em meu trabalho atual) mas seria necessário uma key paga, então abandonei a ideia.
Basicamente estou usando um KDE (Kernel Density Estimation) com o kernel Gaussiano, um modelo que cria uma distribuição nos pontos de ocorrência dos dados do JSON, aproximando os valores para criar as "manchas" do heatmap.
Inicialmente levava cerca de 10 segundos para executar o plot de ``person``, depois de alguns ajustes está levando aproximadamente 5 segundos. Péssimo, mas até o momento não consegui melhorar a performance, mas irei continuar tentando ajustar.


## Como executar

### desafio-1 e desafio-2
Para executar o ``desafio-versao-1`` e ``desafio-versao-2``, você deve rodar o ``live server`` no VSCode e acessar o path até os desafios.


### desafio-3 (principal)
1. Tenha o Node instalado (versão usada nos testes é a 20.16.0);<br>
2. Navegue para o path ``cd desafio-versao-3/heatmap``;<br>
3. Digite ``npm i && npm start``;<br>
4. Rode o projeto no caminho indicado (por padrão é o ``localhost:4200/``).<br>

### Utilização
* Ao iniciar, será selecionado o plot ``person`` como padrão. Mude conforme queira;<br>
* Caso queira fazer o download, clique no botão ``Download da Imagem``.