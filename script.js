document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form)

        let formData = new FormData(form)
        formData.append('image', formImage.files[0])

        if (error ===0){
            form.classList.add('_sending')
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData,
            })

            console.log(formData.get('image'));

            if (response.ok){
                let result = await response.json()
                alert(result.message)
                formPreview.innerHTML = ''
                form.reset()
                form.classList.remove('_sending')
            } else {
                alert('Ошибка!')
                form.classList.remove('_sending')

            }


        } else {
            alert('Заполните обязательные поля')
        };
    };

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req')

        formReq.forEach(item => {
            formRemoveError(item)

            if(item.classList.contains('_email')){
                if (emailTest(item)){
                    formAddError(item)
                    error++
                }
            } else if (item.getAttribute("type") === "checkbox" && item.checked === false){
                formAddError(item)
                error++
            } else {
                if (item.value === ''){
                    formAddError(item)
                    error++
                }
            }
        })

        return error

    }

    function formAddError(input) {
        input.parentElement.classList.add('_error')
        input.classList.add('_error')
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error')
        input.classList.remove('_error')
    }

    function emailTest(input) {
        return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(input.value)
    }


    const formImage = document.getElementById('formImage')
    const formPreview = document.querySelector('.file__preview')

    formImage.addEventListener('change', () => {
        console.log(formImage.files[0]);
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