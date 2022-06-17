//Импорт функций обмена данными с сервером
import { addClient, getClients, getClient, updateClient, delClient } from "./api.js";
(async() => {
    //запускаем спиннер
    const tableSpinner = document.querySelector('.table__spinner');
    tableSpinner.style.display = 'flex';

    let dataBase = await getClients();

    //отсключаем спиннер
    tableSpinner.style.display = 'none';

    //рендер элементов таблицы(сведений о клиентах)
    async function tableElement(base) {
        const table = document.querySelector('tbody');

        //очищаем таблицу на странице
        let tablerow = document.querySelectorAll('.table-row');
        tablerow.forEach(row => {
            row.remove();
        })

        for (let i = 0; i < base.length; i++) {
            //создаем строку таблицы
            const tableElementRow = document.createElement('tr');

            //создаем ячейки в строке 
            const elementID = document.createElement('td');
            const elementFIO = document.createElement('td');
            const createBlock = document.createElement('div');
            const elementCreate = document.createElement('td');
            const updateBlock = document.createElement('div');
            const elementCorrect = document.createElement('td');
            const elementContact = document.createElement('td');
            const elementAction = document.createElement('td');
            const dateCreate = document.createElement('span');
            const timeCreate = document.createElement('span');
            const dateUpdate = document.createElement('span');
            const timeUpdate = document.createElement('span');

            //создаем кнопки изменения и удаления элементов таблицы
            const buttonsBlock = document.createElement('div');
            const buttonUpdate = document.createElement('button');
            const buttonDelete = document.createElement('button');
            const spinnerUpdate = document.createElement('span');
            const buttonSpanUpdate = document.createElement('span');
            const spinnerDelete = document.createElement('span');
            const buttonSpanDelete = document.createElement('span');

            //добавляем элементам таблицы классы для управления и стилизации
            tableElementRow.classList.add('table-row');
            elementID.classList.add('table__element', 'id');
            elementFIO.classList.add('table__element', 'fio');
            elementCreate.classList.add('table__element', 'create');
            createBlock.classList.add('create__block');
            elementCorrect.classList.add('table__element', 'correct');
            updateBlock.classList.add('update__block');
            elementContact.classList.add('table__element', 'contact');
            elementAction.classList.add('table__element', 'action');
            dateCreate.classList.add('date-create');
            timeCreate.classList.add('time-create');
            dateUpdate.classList.add('date-update');
            timeUpdate.classList.add('time-update');
            buttonsBlock.classList.add('action__block');
            buttonUpdate.classList.add('table-btn', 'btn-update');
            buttonDelete.classList.add('table-btn', 'btn-delete');
            spinnerUpdate.classList.add('table-span', 'spinner', 'spinner__update');
            buttonSpanUpdate.classList.add('table-span', 'spanUpdateBtn');
            spinnerDelete.classList.add('table-span', 'spinner', 'spinner__delete');
            buttonSpanDelete.classList.add('table-span', 'spanDeleteBtn');

            //наполняем содержимым ячейки таблицы
            tableElementRow.setAttribute('id', `${base[i].id}`)
            elementID.textContent = base[i].id;
            elementFIO.textContent = base[i].surname + ' ' + base[i].name + ' ' + base[i].lastName;
            dateCreate.textContent = renderDate(base[i].createdAt);
            timeCreate.textContent = renderTime(base[i].createdAt);
            createBlock.append(dateCreate, timeCreate);
            dateUpdate.textContent = renderDate(base[i].updatedAt);
            timeUpdate.textContent = renderTime(base[i].updatedAt);
            updateBlock.append(dateUpdate, timeUpdate);
            elementContact.append(renderContacts(base[i].contacts));
            buttonUpdate.textContent = 'Изменить';
            buttonDelete.textContent = 'Удалить';

            buttonDelete.addEventListener('click', function() {
                const modalWindow = document.querySelector('.add-client');
                const deleteClientWindow = document.querySelector('.delete-client__window');
                const confirmDeleteBtn = document.querySelector('.modal__delete');
                spinnerDelete.classList.add('show');
                buttonSpanDelete.style.display = 'none';

                function actionWindow() {
                    modalWindow.classList.add('active-window');
                    deleteClientWindow.classList.add('active');
                    spinnerDelete.classList.remove('show');
                    buttonSpanDelete.style.display = 'inline-block';
                }
                setTimeout(actionWindow, 300);

                confirmDeleteBtn.addEventListener('click', async() => {
                    let response = await delClient(base[i].id);
                    if (response.status == 200 || response.status == 201) {
                        let newdataBase = await getClients();
                        deleteClientWindow.classList.remove('active');
                        modalWindow.classList.remove('active-window');
                        tableElement(newdataBase);
                    }
                })
            });

            buttonUpdate.addEventListener('click', async function() {
                spinnerUpdate.classList.add('show');
                buttonSpanUpdate.style.display = 'none';
                location.hash = `client-${base[i].id}`;
                document.body.style.overflow = 'hidden';
            });

            //добавляем элементы в DOM
            elementCreate.append(createBlock);
            elementCorrect.append(updateBlock);
            buttonUpdate.append(spinnerUpdate, buttonSpanUpdate);
            buttonDelete.append(spinnerDelete, buttonSpanDelete);
            buttonsBlock.append(buttonUpdate, buttonDelete);
            elementAction.append(buttonsBlock);
            tableElementRow.append(elementID, elementFIO, elementCreate, elementCorrect, elementContact, elementAction);
            table.append(tableElementRow);
        }
    }

    //функция правильного рендера даты в таблице
    function renderDate(data) {
        let dateB = new Date(data);
        let day = dateB.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        let month = dateB.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let year = dateB.getFullYear();
        let newDate = day + '.' + month + '.' + year;
        return newDate;
    }

    //функция правильного рендера времени в таблице
    function renderTime(date) {
        let dat = new Date(date);
        let hours = dat.getHours();
        let minutes = dat.getMinutes();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ':' + minutes;
    }

    //добавление нового клиента
    function addNewClient() {
        const addClientBlock = document.querySelector('.add-client');
        const addClientWindow = document.querySelector('.add-client__window');
        const blockLayout = document.querySelector('.add-client__block');
        const modalForm = document.querySelector('.modal__form');
        const inputSurname = document.getElementById('surname');
        const inputName = document.getElementById('name');
        const inputLastName = document.getElementById('lastname');
        const buttonAdd = document.querySelector('.modal__save');
        const spinner = document.querySelector('.spinner__save--new');

        inputSurname.addEventListener('input', function() {
            this.classList.remove('validation-error');
        });
        inputName.addEventListener('input', function() {
            this.classList.remove('validation-error');
        });

        buttonAdd.addEventListener('click', async function() {
            spinner.classList.add('show');

            if (validate()) {
                const contactList = getContacts();
                blockLayout.classList.remove('hide');
                let response = await addClient(inputName.value, inputSurname.value, inputLastName.value, contactList);
                if (response.status == 201 || response.status == 200) {
                    spinner.classList.remove('show');
                    let newData = await getClients();
                    blockLayout.classList.add('hide');
                    modalForm.reset();
                    addClientWindow.classList.remove('active');
                    addClientBlock.classList.remove('active-window');
                    document.body.style.overflow = 'visible';
                    tableElement(newData);
                }
            }


            function validate() {
                let countErrors = [];
                let contacts = document.querySelectorAll('.add-contact__input');
                //функция проверки на допустимые символы
                function control(str) {
                    let letters = /^[А-Яа-я]+$/;
                    if (!str.match(letters)) {
                        return false;
                    } else {
                        return true;
                    }
                }

                //валидация фамилии
                if (!control(inputSurname.value.trim())) {
                    inputSurname.classList.add('validation-error');
                    countErrors.push('укажите фамилию клиента (используйте только буквы алфавита)');
                }

                //валидация имени
                if (!control(inputName.value.trim())) {
                    inputName.classList.add('validation-error');
                    countErrors.push('укажите имя клиента (используйте только буквы алфавита)');
                }

                //валидация контактов
                if (contacts.length > 0) {
                    for (let i = 0; i < contacts.length; i++) {
                        if (!contacts[i].value) {
                            countErrors.push('не все добавленные контакты полностью заполнены');
                            break;
                        }
                    }
                }

                //проверка наличия ошибок
                if (countErrors.length === 0) {
                    return true;
                } else {
                    spinner.classList.remove('show');
                    const errorsBlock = document.querySelector('.add-client__errors');
                    errorsBlock.textContent = 'Ошибка:';
                    if (countErrors.length === 1) {
                        errorsBlock.textContent = errorsBlock.textContent + ' ' + countErrors[0] + '!';
                    }
                    if (countErrors.length == 2) {
                        errorsBlock.textContent = errorsBlock.textContent + ' ' + countErrors[0] + ', ' + countErrors[1] + '!';
                    }
                    if (countErrors.length == 3) {
                        errorsBlock.textContent = errorsBlock.textContent + ' ' + countErrors[0] + ', ' + countErrors[1] + ', ' + countErrors[2] + '!';
                    }
                    if (countErrors.length == 4) {
                        errorsBlock.textContent = errorsBlock.textContent + ' ' + countErrors[0] + ', ' + countErrors[1] + ', ' + countErrors[2] + ', ' + countErrors[3] + '!';
                    }
                    return false;
                }
            }

        })
    }

    //получение(считывание) контактов
    function getContacts() {
        const contactList = [];
        const selectValue = document.querySelectorAll('.select-value');
        const inputValue = document.querySelectorAll('.add-contact__input');
        for (let i = 0; i < selectValue.length; i++) {
            const contact = {};
            contact.type = selectValue[i].textContent;
            contact.value = inputValue[i].value;
            contactList.push(contact);
        }
        return contactList;
    }

    //функция открытия и закрытия модального окна
    function eventBtn() {
        const modalWindow = document.querySelector('.add-client');
        const addClientWindow = document.querySelector('.add-client__window');
        const addClientBlockLayout = document.createElement('div');
        const changeClientWindow = document.querySelector('.change-client__window');
        const buttonClose = document.querySelectorAll('.modal__close');
        const buttonAdd = document.querySelector('.main__btn');
        const deleteClientWindow = document.querySelector('.delete-client__window');
        const buttonCancel = document.querySelectorAll('.modal__cancel');
        const form = document.querySelector('.modal__form');
        const contactList = document.querySelector('.add-contact__list');

        addClientBlockLayout.classList.add('add-client__block', 'hide');
        addClientWindow.append(addClientBlockLayout);

        buttonAdd.addEventListener('click', () => {
            modalWindow.classList.add('active-window');
            addClientWindow.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        buttonClose.forEach(function(e) {
            e.addEventListener('click', resetAndClose);
        });

        buttonCancel.forEach(function(e) {
            e.addEventListener('click', resetAndClose);
        });

        modalWindow.addEventListener('click', function(e) {
            if (e.target.classList.contains('active-window')) {
                resetAndClose();
            }
        });
        //закрытие окон и сброс форм
        function resetAndClose() {
            form.reset();
            contactList.textContent = '';
            document.body.style.overflow = 'auto';
            modalWindow.classList.remove('active-window');
            addClientWindow.classList.remove('active');
            deleteClientWindow.classList.remove('active');
            changeClientWindow.classList.remove('active');
            removeHash();
            form.querySelectorAll('.validation-error').forEach(el => {
                el.classList.remove('validation-error');
            });
            document.querySelector('.add-client__errors').textContent = '';
        }
    }
    eventBtn()

    //рендер контактов
    function renderContacts(array) {
        const contactList = document.createElement('ul');
        contactList.classList.add('contact-list');
        for (let i = 0; i < array.length; i++) {
            const item = document.createElement('li');
            const tultip = document.createElement('div');
            const tultipType = document.createElement('span');
            const tultipValue = document.createElement('a');
            item.classList.add('contact__item');
            tultip.classList.add('contact__tultip', 'tultip');
            tultipType.classList.add('tultip__type');
            tultipValue.classList.add('tultip__value', 'tultip__link');

            if (array[i].type === 'Телефон') {
                item.classList.add('contact-tel');
                tultipType.textContent = 'Телефон: '
                tultipValue.setAttribute('href', `tel:${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            if (array[i].type === 'Доп. телефон') {
                item.classList.add('contact-tel');
                tultipType.textContent = 'Доп. телефон: '
                tultipValue.setAttribute('href', `tel:${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            if (array[i].type === 'Email') {
                item.classList.add('contact-email');
                tultipType.textContent = 'Email: '
                tultipValue.setAttribute('href', `mailto:${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            if (array[i].type === 'Facebook') {
                item.classList.add('contact-facebook');
                tultipType.textContent = 'Facebook: '
                tultipValue.setAttribute('href', `http://www.${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            if (array[i].type === 'VK') {
                item.classList.add('contact-vk');
                tultipType.textContent = 'VK: '
                tultipValue.setAttribute('href', `http://www.${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            if (array[i].type === 'Другое') {
                item.classList.add('contact-other');
                tultipType.textContent = 'Другое: '
                tultipValue.setAttribute('href', `http://www.${array[i].value}`);
                tultipValue.textContent = array[i].value;
            }
            tultip.append(tultipType, tultipValue)
            item.append(tultip)
            contactList.append(item);
        }
        if (array.length > 4) {
            let items = contactList.getElementsByTagName('li');
            for (let i = 4; i < items.length; i++) {
                items[i].classList.add('hide-contact');
            }
            const counterContacts = document.createElement('li');
            counterContacts.classList.add('contact__item', 'contact__counter');
            counterContacts.textContent = `+${items.length - 4}`;
            counterContacts.addEventListener('click', function() {
                let hideElements = contactList.querySelectorAll('.hide-contact');
                let allElements = contactList.getElementsByTagName('li');
                counterContacts.style.display = 'none';
                for (let i = 0; i < hideElements.length; i++) {
                    hideElements[i].classList.remove('hide-contact');
                };
                if (allElements.length > 4) {
                    for (let i = 0; i < 4; i++) {
                        allElements[i].style.marginBottom = '7px';
                    }
                }
            })
            contactList.append(counterContacts);
        }
        return contactList;
    }

    //добавление контактов клиента
    function addContact(list, contact) {
        const contactList = list;
        const button = document.querySelector('.modal__add-contact');
        const buttonUp = document.querySelector('.change-client__contact-button');
        const contactItem = document.createElement('li');
        const select = document.createElement('div');
        const selectValue = document.createElement('p');
        const selectSpan = document.createElement('span');
        const dropdown = document.createElement('ul');
        const input = document.createElement('input');
        const contactBtn = document.createElement('button');
        const spanBtn = document.createElement('span');
        const tultip = document.createElement('div');

        tultip.classList.add('contact__tultip', 'tultip', 'tultip__del');
        contactItem.classList.add('add-contact__item');
        select.classList.add('add-contact__select');
        selectValue.classList.add('select-value');
        selectSpan.classList.add('select-span');
        dropdown.classList.add('add-contact__dropdown');
        input.classList.add('add-contact__input');
        contactBtn.classList.add('add-contact__btn');
        spanBtn.classList.add('add-contact__spanBtn');

        select.append(selectValue, selectSpan);
        contactBtn.append(spanBtn, tultip);

        selectValue.textContent = contact === undefined ? 'Телефон' : contact.type;
        input.value = contact === undefined ? '' : contact.value;
        tultip.textContent = 'Удалить контакт'

        let addTel = document.createElement('li');
        addTel.classList.add('dropdown-item');
        addTel.textContent = 'Доп. телефон';
        addTel.addEventListener('click', function() {
            selectValue.innerText = addTel.textContent;
            dropdown.classList.remove('active-dropdown')
        })

        let vk = document.createElement('li');
        vk.classList.add('dropdown-item');
        vk.textContent = 'VK';
        vk.addEventListener('click', function() {
            selectValue.innerText = vk.textContent;
            dropdown.classList.remove('active-dropdown')
        })

        let facebook = document.createElement('li');
        facebook.classList.add('dropdown-item');
        facebook.textContent = 'Facebook';
        facebook.addEventListener('click', function() {
            selectValue.innerText = facebook.textContent;
            dropdown.classList.remove('active-dropdown')
        })

        let email = document.createElement('li');
        email.classList.add('dropdown-item');
        email.textContent = 'Email';
        email.addEventListener('click', function() {
            selectValue.innerText = email.textContent;
            dropdown.classList.remove('active-dropdown')
        })

        let other = document.createElement('li');
        other.classList.add('dropdown-item');
        other.textContent = 'Другое';
        other.addEventListener('click', function() {
            selectValue.innerText = other.textContent;
            dropdown.classList.remove('active-dropdown')
        })

        input.placeholder = 'Введите данные контакта';

        contactBtn.addEventListener('click', function() {
            contactItem.remove();
            button.classList.remove('hide');
            buttonUp.classList.remove('hide')
        })

        selectValue.addEventListener('click', function() {
            dropdown.classList.toggle('active-dropdown');
            selectSpan.classList.toggle('active');
        })

        dropdown.append(addTel, vk, facebook, email, other);
        contactItem.append(select, dropdown, input, contactBtn);
        contactList.append(contactItem);
    }

    //нажатие кнопки Добавить контакт
    function pressAddContactBtn() {
        const button = document.querySelector('.modal__add-contact');
        const buttonUp = document.querySelector('.change-client__contact-button');
        const listAdd = document.querySelector('.add-contact__list');
        const listUp = document.querySelector('.change-client__contact-list');

        button.addEventListener('click', function() {
            addContact(listAdd);
            const items = document.querySelectorAll('.add-contact__item');
            if (items.length > 9) {
                button.classList.add('hide');
            }
        });
        buttonUp.addEventListener('click', function() {
            addContact(listUp);
            const items = document.querySelectorAll('.add-contact__item');
            if (items.length > 9) {
                buttonUp.classList.add('hide');
            }
        });
    }
    pressAddContactBtn();

    //функции сортировки клиентов по нажатию на заголовки таблицы
    function sortClient() {
        //запишем в переменные все заголовки        
        const sortID = document.getElementById('table__ID');
        const sortName = document.getElementById('table__name');
        const sortDateCreate = document.getElementById('table__date-create');
        const sortDateUpdate = document.getElementById('table__date-update');

        sortID.addEventListener('click', async function() {
            classRemove(this);
            let data = await getClients();
            if (!this.classList.contains('ascending')) {
                this.classList.add('ascending');
                data = data.sort((a, b) => (a.id > b.id) ? 1 : -1);
                tableElement(data);
            } else {
                this.classList.remove('ascending');
                data = data.sort((a, b) => (a.id < b.id) ? 1 : -1);
                tableElement(data);
            }
        })

        sortName.addEventListener('click', async function() {
            classRemove(this);
            let data = await getClients();
            if (!this.classList.contains('ascending')) {
                this.classList.add('ascending');
                data = data.sort((a, b) => (a.surname > b.surname) ? 1 : (a.surname === b.surname) ? ((a.name > b.name) ? 1 : (a.name === b.name) ? ((a.middleName > b.middleName) ? 1 : -1) : -1) : -1)
                tableElement(data);
            } else {
                this.classList.remove('ascending');
                data = data.sort((a, b) => (a.surname < b.surname) ? 1 : (a.surname === b.surname) ? ((a.name < b.name) ? 1 : (a.name === b.name) ? ((a.middleName < b.middleName) ? 1 : -1) : -1) : -1);
                tableElement(data);
            }
        })

        sortDateCreate.addEventListener('click', async function() {
            classRemove(this);
            let data = await getClients();
            if (!this.classList.contains('ascending')) {
                this.classList.add('ascending');
                data = data.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
                tableElement(data);
            } else {
                this.classList.remove('ascending');
                data = data.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
                tableElement(data);
            }
        })

        sortDateUpdate.addEventListener('click', async function() {
            classRemove(this);
            let data = await getClients();
            if (!this.classList.contains('ascending')) {
                this.classList.add('ascending');
                data = data.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1);
                tableElement(data);
            } else {
                this.classList.remove('ascending');
                data = data.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1);
                tableElement(data);
            }
        })
    }
    sortClient();

    //функция сброса класса активного заголовка у всех элементов, кроме нажатого
    function classRemove(element) {
        const tableTitle = document.querySelectorAll('.table__title');
        tableTitle.forEach(el => { if (el != element) { el.classList.remove('active-title', 'ascending') } })
        element.classList.add('active-title')
    }

    //реализация поиска    
    function search() {
        const headerBlock = document.querySelector('.header__search');
        const searchInput = document.querySelector('.search');
        const searchWindow = document.createElement('div');
        const searchList = document.createElement('ul');
        const searchElement = document.createElement('li');

        searchWindow.classList.add('search__window');
        searchList.id = 'search__list';
        searchList.classList.add('search__list');
        searchElement.classList.add('search__item');

        searchWindow.append(searchList);
        headerBlock.append(searchWindow);

        searchWindow.style.display = 'none';

        let timeout;
        let currentFocus;

        searchInput.addEventListener('input', function() {
            clearInterval(timeout);
            timeout = setTimeout(workSearch, 300);

            async function workSearch() {
                const response = await getClients();
                currentFocus = -1;
                searchWindow.style.display = 'block';
                searchList.textContent = '';
                let searchClients = response.filter(client => client.name.includes(searchInput.value) || client.surname.includes(searchInput.value));
                if (searchClients.length === 0) {
                    searchElement.classList.add('no-found');
                    searchElement.textContent = 'По Вашему запросу клиент не найден';
                    searchList.append(searchElement);
                } else {
                    for (let i = 0; i < searchClients.length; i++) {
                        let searchElement = document.createElement('li');
                        let linkClient = document.createElement('a');

                        searchElement.classList.add('search__item');
                        linkClient.classList.add('search__link');

                        linkClient.setAttribute('href', `#${searchClients[i].id}`);

                        linkClient.textContent = searchClients[i].name + ' ' + searchClients[i].surname;

                        linkClient.addEventListener('click', function() {
                            searchInput.value = '';
                            searchWindow.style.display = 'none';
                            let client = document.getElementById(`${searchClients[i].id}`);
                            client.classList.add('search__client');
                            setTimeout(function() {
                                client.classList.remove('search__client');
                                removeHash();
                            }, 2000);
                        });
                        searchElement.append(linkClient)
                        searchList.append(searchElement);
                    }
                }
                if (searchInput.value.length === 0) {
                    searchWindow.style.display = 'none';
                    searchList.textContent = '';
                }
            }
        })
        searchInput.addEventListener("keydown", function(e) {
            var x = document.getElementById('search__list');
            if (x) x = x.getElementsByTagName("a");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].parentNode.classList.add("autocomplete-active");

        }

        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].parentNode.classList.remove("autocomplete-active");
            }
        }
    }

    async function listenerHash() {
        let hash = window.location.hash;
        if (hash.includes('client')) {
            const modalWindow = document.querySelector('.add-client');
            const changeClientWindow = document.querySelector('.change-client__window');
            const clientID = document.querySelector('.change-client__id');
            const clientSurname = document.getElementById('change-surname');
            const clientName = document.getElementById('change-name');
            const clientLastName = document.getElementById('change-lastname');
            const clientContactList = document.querySelector('.change-client__contact-list');
            const clientSave = document.getElementById('change-client__save');
            const clientdelete = document.getElementById('change-client__delete');
            const blockLayout = document.createElement('div');
            const spinners = document.querySelectorAll('.spinner__update');
            const spanUp = document.querySelectorAll('.spanUpdateBtn');

            hash = hash.slice(8);
            let client = await getClient(hash);

            blockLayout.classList.add('change-client__block', 'hide');
            changeClientWindow.append(blockLayout);
            modalWindow.classList.add('active-window');
            changeClientWindow.classList.add('active');

            spinners.forEach(spinner => {
                spinner.classList.remove('show');
            });
            spanUp.forEach(span => {
                span.style.display = 'inline-block'
            })
            modalWindow.classList.add('active-window');
            changeClientWindow.classList.add('active');
            clientID.textContent = `ID: ${client.data.id}`;
            clientSurname.value = client.data.surname;
            clientName.value = client.data.name;
            clientLastName.value = client.data.lastName;
            clientContactList.innerHTML = '';

            client.data.contacts.forEach(contact => {
                addContact(clientContactList, contact)
            });

            clientdelete.addEventListener('click', function() {
                const deleteClientWindow = document.querySelector('.delete-client__window');
                const confirmDelete = document.querySelector('.modal__delete');
                deleteClientWindow.classList.add('active');
                changeClientWindow.classList.remove('active');

                confirmDelete.addEventListener('click', async function() {
                    let response = await delClient(client.data.id);
                    if (response.status == 200 || response.status == 201) {
                        let newdataBase = await getClients();
                        removeHash();
                        deleteClientWindow.classList.remove('active');
                        modalWindow.classList.remove('active-window');
                        tableElement(newdataBase);
                    }
                })
            });

            clientSave.addEventListener('click', async function() {
                blockLayout.classList.remove('hide');
                const spinner = document.querySelector('.spinner__save');
                spinner.classList.add('show');
                const contactList = getContacts();
                const response = await updateClient(client.data.id, clientName.value, clientSurname.value, clientLastName.value, contactList)

                if (response.status !== 200) {
                    blockLayout.classList.add('hide');
                    spinner.classList.remove('show');
                    const blockErrors = document.querySelector('.change-client__errors');
                    const error = await response.json();
                    blockErrors.textContent = `Ошибка: ${error.message}`;
                }
                if (response.status == 200 || response.status == 201) {
                    let newData = await getClients();
                    spinner.classList.remove('show');
                    blockLayout.classList.add('hide');
                    changeClientWindow.classList.remove('active');
                    modalWindow.classList.remove('active-window');
                    document.body.style.overflow = 'visible';
                    removeHash();
                    tableElement(newData);
                }
            })
        }
    }
    listenerHash();

    //функция реакции на изменения хэша
    window.addEventListener('hashchange', listenerHash);

    //очистка хэша
    function removeHash() {
        window.history.pushState("", document.title, window.location.pathname);
    }

    function mainFunction() {
        tableElement(dataBase);
        addNewClient()
        search()
    }
    mainFunction()
})()