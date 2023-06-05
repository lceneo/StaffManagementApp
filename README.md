# StaffManagementApp
Приложение представляет собой админ-панель, позволяющую управлять списком проектов и сотрудников. Присутствует возможность найма, увольнения, редактирования информации о сотрудниках и возможность создавать/редактировать/удалять проекты. Помимо основного ТЗ, нами было решено добавить тёмную тему и страницу проектов.

## Содержание

1. <a href = "#start">Как запустить проект?</a>
2. <a href = "#stack">Stack-технологий</a>
3. <a href = "#main_page">Страницы со списком сотрудников и проектов<a>
4. <a href = "#create_page">Добавление сотрудников / проектов<a>
5. <a href = "#info_page">Страницы детальной информации</a>
6. <a href = "#technical_assignment">Отчётность по реализации ТЗ</a>
7. <a href = "#project_info">Небольшие заметки по функционалу</a>
8. <a href = "#error_part">ВАЖНЫЙ МОМЕНТ ПРО FIREBASE</a>
  
<a name = start></a>
## Как запустить проект?
1-ый способ:
  1. Перейти по [ссылке](https://647e2549af33ac0384e1ce67--harmonious-sunshine-17a661.netlify.app/)  (сайт выложен на хостинг)
  
2-ой способ:
  1. Установить Angular (Открыть терминал и прописать npm install -g @angular/cli)
  2. Скачать проект, открыть его и прописать в терминале npm install
  3. Firebase имеет вшитый баг с заданием типов, поэтому при первом запуске упадёт ошибка, чтобы её пофиксить необходимо сделать следующее <br>
  ![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/f14a3dad-17d3-423e-885b-34d2f648038a)
  4. Прописать в терминале npm start

 Данные для входа:
 admin@mail.ru
 123456
 (можно зарегать и новый акк)
  
<a name = stack></a>  
## Stack-технологий
- Приложение написано на Angular
- в качестве СУБД использовалась FireBase (https://firebase.google.com/)

<a name = main_page></a>
## Страница со списком планет и фильтрацией

### Список сущностей
На данных страницах выводятся, сформированные карточки сотрудников/проектов с частичной информацией по ним(вся информация на странице детальной информации). 
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/c4a83eab-152b-4ac4-a302-a22a05972e88)
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/268fd036-2b86-46de-bb98-5e19c49f431c)



### Фильтрация
На обеих страницах присутствуют различные способы фильтрации.
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/d234ae46-90c1-47e2-8ba5-835019e4c12f)
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/d2efb905-dfd9-4532-b31f-2774dcd3edaa)

 <a name = create_page></a>  
## Добавление сотрудников / проектов
На сайте присутствует возможность создавать новые проекты и новых сотрудников. Для этого необходимо заполнить ряд обязательных полей
<br><br>
 ![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/98ee250a-d1f6-4576-83c8-fbac7f15a3d7)
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/9b627d9d-ff26-47ac-b529-48da35d9b0ca)


<a name = info_page></a>
## Страница детальной информации

При щелчке по любой карточке из списка происходит редирект на данную страницу.
На ней указана детальная информация про проект/сотрудника. В случае с сотрудниками, на странице имеется возможность внести изменения в их поля. Щёлкнув по кнопке "Вернуться" происходит редирект на страницу со списком всех карточек.
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/3df98258-3838-4592-bf92-7a5bb099e468)
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/1942aa11-55f9-4acb-b071-81e28fde22b4)
<br><br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/79dbd2da-6061-414d-8123-3db8a4a60836)
 

<a name = technical_assignment></a>
## Отчётность по реализации ТЗ

| Пункт ТЗ | Путь в проекте  |
| ------- | --- |
| 2 - 3 реактивные формы | src/app/main-content/components/user-info/user-info.component.ts <br> src/app/authorization/components/login/login.component.ts <br> src/app/authorization/components/login/login.component.ts |
| 2 - 3 функциональных модуля | src/app/main-content/main-content.module.ts <br>  src/app/shared/shared.module.ts|
| Простое внедрение зависимостей | любой компонент |
| Использование @Input @Output | src/app/main-content/components/search-filters/search-filters.component.ts |
| Базовое использование RxJS | src/app/main-content/components/users-list/users-list.component.ts (c 27-ой строки) |
| Reusable компоненты | Использование app-error-handler: src/app/authorization/components/login <br> src/app/main-content/components/create-user/create-user.component.html .Также переиспользуются модалки |
| Передача параметров в роуте | src/app/main-content/components/user-info/user-info.component.ts (с 200-ой строчки) |
| Использование Guards | src/app/main-content/main-content.module.ts |
| 1-2 кастомная атрибутивная директива | src/app/shared/directives/focus.directive.ts |
| 1-2 кастомных пайп | src/app/main-content/pipes/search-filter.pipe.ts <br> src/app/main-content/pipes/user-projects.pipe.ts |
| Использование общего code-style (настройка eslint) | .eslintrc.json |
| Использование @ViewChild | src/app/main-content/components/create-user/create-user.component.ts (31/32-ая строки) |
| Продвинутое использование DI (использование токенов, useFactory) | src/app/main-content/main-content.module.ts |
| Кастомная структурная директива | src/app/shared/directives/ngLet.directive.ts |
| Обработка ошибок. Global error handler | src/app/error-handler/error-handler.component.ts |
| Динамический рендер | Не столкнулись с необходимостью динамически рендерить компоненты - из наиболее похожего вызов модалки императивно src/app/main-content/components/create-user/create-user.component.ts (94 строка) |
| Адаптивность | Частичная адаптивность сайта |
| Скелетоны | отсутствуют - вместо них сделана страница проектов + тёмная тема |
| Анимации | Анимация подгрузки данных: src/app/main-content/components/users-list/users-list.component.html (4 cтрока) |
  
<a name = project_info></a>
## Небольшие заметки по функционалу
На странице списка сотрудников часть карточек сотрудников имеет красную/зелёную обводку
Красная обводка присваивается неуспешным сотрудникам (тем, у которых зарплата не менялась больше полугода, или же, тем у кого с последним изменением зарплаты зарплата уменьшилась). Если сотруднику за последние 3 месяца увеличили зарплату, он считается успешным сотрудником и обводится зелёным в списке. Если у сотрудника не менялась зарплата в промежутке от 3 до 6 месяцев, или же, он имеет лишь одну запись об изменении ЗП(то бишь, он был нанят на работу уже этой суммой), он не имеет никакой обводки.
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/e42d4488-33bf-4a8d-97c4-a02c2b7f2d1e)

  
<a name = error_part></a>
## ВАЖНЫЙ МОМЕНТ ПРО FIREBASE
Firebase имеет вшитый баг с заданием типов, поэтому при первом запуске упадёт ошибка, чтобы её пофиксить необходимо сделать следующее <br>
![image](https://github.com/lceneo/StaffManagementApp/assets/94864786/f14a3dad-17d3-423e-885b-34d2f648038a)
