// Armazena a refência do "removeButton" como key e a "container" como value
const urlsMap = new Map();

// Adicionando botões do DOM
const addInputButton = document.querySelector("#btnAdd");
const saveUrlsButton = document.querySelector("#btnSave");
const containerInputs = document.querySelector("#containerInputs");

// Function responsável por criar os inputs de urls no DOM
function createUrlInput(url = "") {
	// Impede de adicionar mais que 5 inputs de urls
	if (containerInputs.childElementCount >= 5) return;

	// Criando os Elementos para a estrutura do input e botão de remover
	const container = document.createElement("div");
	const input = document.createElement("input");
	const removeButton = document.createElement("button");

	// Configuração dos elementos do DOM
	input.type = "text";
	input.placeholder = "Adicione sua URL";
	input.value = url;
	removeButton.type = "button";
	removeButton.textContent = "X";
	removeButton.classList.add("btnDelete");

	// Organizando elemetos e inserindo eles ao DOM
	container.appendChild(input);
	container.appendChild(removeButton);
	containerInputs.insertAdjacentElement("beforeend", container);

	// Registra ao Map o referência do container que contem o input de URL
	urlsMap.set(removeButton, container);

	// Adiciona evento ao "removeButton" para remover o input e a url
	removeButton.addEventListener("click", () =>
		removeUrlInput(removeButton, container),
	);
}

// Function responsável por remover o input e a url do DOM e Storage
function removeUrlInput(removeButton, container) {
	// Pegando a Url do input e removendo ela do Storage
	const url = container.querySelector("input").value;
	chrome.storage.local.get(["savedUrls"]).then(({ savedUrls }) => {
		const updateUrls = savedUrls.filter((saveUrl) => saveUrl !== url);
		chrome.storage.local.set({ savedUrls: updateUrls });
	});

	// removendo o input do DOM e removendo a referência do "container" do Map()
	container.remove();
	urlsMap.delete(removeButton);
}

// Function reponsável por salvar as Urls no Storage
function saveUrls() {
	// transforma o "urlsMap" em um array com várias urls
	const urls = Array.from(urlsMap.values())
		.map((container) => container.querySelector("input").value)
		.filter((url) => url !== "");

	if (urls.length < 1) return;

	// Salva as "urls" no Storage
	chrome.storage.local.set({ savedUrls: urls });
}

// Function reponsável por carregar as urls salvas no dom quando o icon da entenção for clicado
function loadUrls() {
	chrome.storage.local.get(["savedUrls"]).then(({ savedUrls }) => {
		if (!savedUrls || savedUrls < 1) return;
		for (const url of savedUrls) {
			createUrlInput(url);
		}
	});
}

// Adiciniona os eventos aos botões de criar os inputs e salvar as urls
addInputButton.addEventListener("click", () => createUrlInput());
saveUrlsButton.addEventListener("click", saveUrls);

// Chama a função "loadUrls" para carregar as url no DOM
window.onload = loadUrls();
