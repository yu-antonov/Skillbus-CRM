<div align="center">
	<img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/icon/skb-logo.svg">
	<h1 align="center">Skillbus</h1>
</div>
<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/yu-antonov/skillbus-crm?color=9873ff">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/yu-antonov/skillbus-crm?color=9873ff">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/yu-antonov/skillbus-crm?color=9873ff">
  
</p>
<p align="center">
  <a href="#-о-проекте">О проекте</a> &#xa0; | &#xa0; 
  <a href="#sparkles-функции">Функции</a> &#xa0; | &#xa0;
  <a href="#rocket-технологии">Технологии</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-дополнения-и-улучшения">Дополнения и улучшения</a> &#xa0; | &#xa0;  	
</p>

## &#128172; О проекте ##

Проект разработан в рамках обучения на образовательной онлайн платформе <a href="https://skillbox.ru" target="_blank">Skillbox</a>. Цель проекта состояла в создании программы, в которой можно будет работать с контактной информацией всех клиентов (учеников). Backend-часть проекта была уже готова. Также был утвержден дизайн интерфейсной части проекта.\
Интерфейс программы представляет из себя единственную страницу, на которой располагается таблица клиентов, кнопка для добавления нового клиента, а также шапка с логотипом компании и строкой поиска клиентов.

## :sparkles: Функции ##

:heavy_check_mark: Просмотр списка клиентов в виде таблицы\
:heavy_check_mark: Добавление нового клиента\
:heavy_check_mark: Изменение информации о существующем клиенте (ФИО и контактная информация)\
:heavy_check_mark: Удаление клиента
## :rocket: Технологии ##

В проекте использованы следующие технологии:
- HTML
- CSS
- JavaScript.

## :white_check_mark: Дополнения и улучшения ##

<h3>1. Анимация открытия модального окна</h3>
Появление модального окна с формой добавления новго клиента, редактирования существующего клиента и окна подтверждения удаления клиента реализовно с помощью выхода из прозрачности и смещением окна сверху-вниз.
<h3>2. Возможность обмена карточкой клиента по ссылке</h3>
Обмен реализован с использованием hash-части пути страницы и событием <a href="https://developer.mozilla.org/ru/docs/Web/API/Window/hashchange_event" target="_blank">hashchange</a>. При наличии в hash-части пути страницы id клиента, происходит открытие модального окна с информацией о нем.
<img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_3.png">
<h3>3. Валидация формы перед отправкой на сервер</h3>
Осуществлена валидация полей формы перед ее отправкой на сервер с помощью JavaScript. Поля "Имя" и "Фамилия", а также контактные сведения (в случае их добавления), обязательны для заполнения. При этом в имени и фамилии недопускается использование различных символов и цифр.
<img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_2.png">
<h3>4. Индикация загрузки</h3>
С целью отображения происходящего запроса на сервер, реализовны индикаторы загрузки в следующих случаях:
- загрузка таблицы со списком клиентов при открытии страницы; <img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_6.png">
- добавление или сохранение сведений о клиенте (индикатор загрузки реализован на соответсвующих кнопках);<img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_5.png">
- нажатие кнопок "Изменить" и "Удалить" (на время получения ответа с сервера). <img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_4.png">
<h3>5. Поиск с автодополнением</h3>
Реализован поиск клиентов с автодополнением по совпадению в имени и(или) фамилии. При выборе клиента из выпадающего списка поиска происходит прокрутка страницы к его местонахождению, а также данная строка таблицы подсвечивается.
<img src="https://github.com/yu-antonov/Skillbus-CRM/blob/main/images/screenshot/Screenshot_1.png">
