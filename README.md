# React Tasks Tracker

Приложение для работы пользователей с задачами

Приложение использует входные данные в виде файлов-схем *DB.js
Каждые пять минут происходит обновление таблицы задач и сохранение данных в localStorage. Сохранение также происходит при разлогинивании.

тестовые пользователи : admin admin и user user

В таблице можно редактировать все поля двойным кликом или кнопками управления(кнопка смены статуса и кнопки RUD)
Кнопка R предоставляет пользователю полные данные по задаче
В таблице предусмотрена сортировка по колонкам "Задачи" и "Срок" при нажатии на соответствующем заголовке. Также можно отфильтровать записи по статусу.
Над задачами есть кнопка создания новой записи.

Для сборки проекта необходимо:
* установить все зависимости
* выполнить команду gulp build
