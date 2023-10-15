# Motor de busca na Wikipedia
#### Como visualizar o trabalho
O trabalho foi feito em JavaScript. O arquivo index.html roda o script e fornece a visualização do trabalho, a página contém um campo de busca e o botão para busca.

#### Sobre as tarefas
##### Tarefa 1: Quantas tags page tem no arquivo?
5155

##### Tarefa 2: Imprimir o id e title de cada uma das <page> do arquivo.
A interface imprime id, title e texto.

##### Tarefa 3: O usuário informa uma string de busca. Você deve listar apenas os id e title daquelas páginas em que aparece aquela string de busca no title.
A lista contém as páginas que tem a ocorrência no title e no texto.

##### Tarefa 4: Mostrar o resultado de busca de acordo com a contagem de ocorrências. As páginas com mais ocorrências devem aparecer na frente das demais. Aquelas com ocorrência no title contam como 10.
Feito

##### Tarefa 5: Há duas opções, você deve escolher aquela que preferir:
Opção escolhida: Hash invertida. Para cada string encontrada no title de todas as páginas, você deve inserir o resultado daquela busca em uma hash invertida. É bem parecido com o cache, mas agora você insere no cache todas as strings que encontrar no title das páginas do arquivo. Dessa forma, antes mesmo de iniciar o loop pelas strings de busca, você já pré-computou todas as possíveis buscas que podem ser feitas.

Novamente não foi considera somente o title, o texto também foi considerado para a criação da hash.

##### Tarefa 6: Fazer a busca por duas strings. "Science" dá um resultado de busca; já "computer" dá outro. Agora "computer science" vai dar qual resultado? Crei seu próprio critério.

O critério escolhido foi a criação de uma nova forma de pontuação onde para cada ocorrência da palavra composta, neste caso, sempre que a busca composta ocorrer exatamente igual no título ou texto adiciona 1 ponto a este "score". Ao fim a nova lista é ordenada por esse "score".