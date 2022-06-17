//функция добавления клиента в базу данных
async function addClient(name, surname, lastName, contacts) {
    const response = fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: `${name}`,
            surname: `${surname}`,
            lastName: `${lastName}`,
            contacts: correctContacts(contacts),
        })
    });
    return response;
}

//раскладка контактов
function correctContacts(arr) {
    const array = [];
    for (let i = 0; i < arr.length; i++) {
        let contact = arr[i];
        array.push(contact)
    }
    return array;
}


//функция загрузки клиентов из базы данных
async function getClients() {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    return data;
}

//функция загрузки клиента из базы данных по ID
async function getClient(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`);
    const data = await response.json();
    return {
        data,
        response
    }
}

//функция обновления данных о клиенте в базе данных
async function updateClient(id, name, surname, lastName, contacts) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: `${name}`,
            surname: `${surname}`,
            lastName: `${lastName}`,
            contacts: correctContacts(contacts),
        })
    })
    return response;
}

//функция удаления клиента из базы данных
async function delClient(id) {
    const response = fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE'
    });
    return response;
}


export { addClient, getClients, getClient, updateClient, delClient };