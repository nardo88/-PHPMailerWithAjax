document.addEventListener('DOMContentLoaded', () => {

    // Отправка формы
    // получаем ссылку к форме
    const form = document.getElementById('form');
    // вешаем на нашу форму слушатель события submit
    form.addEventListener('submit', formSend);
    // aerywbz отправки
    async function formSend(e) {
        // сначала отключаем стандартное поведение
        e.preventDefault();
        // помещаем в переменную результат функции валидации формы
        // если валидация прошла успешно, эта функция вернет 0
        let error = formValidate(form)
        // создаем объект с помощью конструктора FormData
        // в качестве аргумента передаем элемент нашей формы
        let formData = new FormData(form)
        // так как мы еще хотим отправлять картинку
        // мы с помощью метода append добавляем в formData
        // новые данные: картинку
        formData.append('image', formImage.files[0])
        // если переменная error равна 0 то выполняем отправку
        if (error ===0){
            // форме добавляем модификатор, который имитирует отправку
            // т.е. появится анимация отправки письма
            form.classList.add('_sending')
            // далее мы используем fetch запрос у которого два аргумента
            // первый - это куда отправляем данные
            // второй - это метод запроса (POST) и передаваемые данные
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData,
            })
            // response - это ответ, если его параметр ok == true, тогда
            if (response.ok){
                // в переменную result помещаем ответ преобразив его в формат 
                // JSON
                let result = await response.json()
                // Выводим alert c результатом ответа
                alert(result.message)
                // очищаем блок с превью картинки
                formPreview.innerHTML = ''
                // перезагружаем форму что бы очистить поля
                form.reset()
                // и удаляем модификатор который имитировал загрузку
                form.classList.remove('_sending')
                // если же что то пошло не так
            } else {
                // мы выдаем alert c результатом
                alert('Ошибка!')
                // и так же убираем модификатор
                form.classList.remove('_sending')
            }
        // если валидация вернула не 0, то выдаем алерт с сообщением
        // о необходимости заполнения полей
        } else {
            alert('Заполните обязательные поля')
        };
    };

    // Валидация формы
    function formValidate(form) {
        // создаем переменную которую будет затем возвращать 
        // функция. Если значение переменной 0 то валидация пройдена
        let error = 0;
        // каждому элементу формы который будет проверяться добавляем класс
        // _req (от слова required). Получаем все экземпляры элементов
        // которые будут проверяться 
        let formReq = document.querySelectorAll('._req')
        // проходимся теперь по массиву элементов
        formReq.forEach(item => {
            // удаляем у все сначала класс _error
            // этот класс добавляет эффект того что поле надо заполнить
            // например добавляет крассную обводку с тенью
            formRemoveError(item)
            // проверяем поле email c помощью функции emailTest 
            // эта функция возвращает true если введенное значение не 
            // соответствует регулярному выражению
            if(item.classList.contains('_email')){
                if (emailTest(item)){
                    formAddError(item)
                    // если это так то error увеличиваем на 1
                    error++
                }
                // здесь проверяем checbox
            } else if (item.getAttribute("type") === "checkbox" && item.checked === false){
                formAddError(item)
                error++
                // здесь просто проверяем что значение value не пустая строка
            } else {
                if (item.value === ''){
                    formAddError(item)
                    error++
                }
            }
        })
        return error
    }

    // Добавление эффектов если форма не прошла валидацию
    function formAddError(input) {
        input.parentElement.classList.add('_error')
        input.classList.add('_error')
    }
    // Удаление эффектов если форма не прошла валидацию
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error')
        input.classList.remove('_error')
    }
    // Проверка поля с email
    function emailTest(input) {
        return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(input.value)
    }

    // Работа с input type file
    const formImage = document.getElementById('formImage')
    const formPreview = document.querySelector('.file__preview')

    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    })


    function uploadFile(file) {
        // проверяем тип файла
        if (!['image/jpeg', 'image/png', 'image/gif', ].includes(file.type)){
            alert('Разрешены только изображения')
            formImage.value = ''
            return;
        }

        // проверяем размер файла 
        if (file.size > 2 * 1024 * 1024){
            alert('Файл должен быть менее 2 МБ.')
            return;
        }

        let reader = new FileReader()
        reader.onload = event => {
            formPreview.innerHTML = `<img src="${event.target.result}" alt="photo">`
        }

        reader.onerror = () => {
            alert('Ошибка')
        }
        reader.readAsDataURL(file)
    }
})