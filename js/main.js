// Получаем элемент по id, куда в последующем будут выводиться карточки товаров
const productCard = document.getElementById("products_section")
// Две функции для удобства создания новых элементов и добавления их к ParentNode
const createNode = element => document.createElement(element)
const append = (parent, el) => parent.appendChild(el)

// Асинхронно полуем данные из json файла
fetch("https://keanir.github.io/test_task/products.json")
  .then(function(response) {
    return response.json()
  })
  .then(function(json) {
    let products = json
    // После того, как данные получены и преобразованны в json формат, вызываются две функции:
    // Первая проходится по всему массиву объектов и на его основе создает новую HTML разметку с данными о товаре
    createProductCard(products)
    // Вторая функция регистрирует обработчики событий на необходимых элементах и позволяет взаимодействовать с ними
    addEvents(products)
  })
  .catch(function(err) {
    // Ловим ошибки, если вдруг что-то пойдет не так
    console.log("Some problem here: " + err.message)
  })

function createProductCard(products) {
  // Выполняем действия для каждого товара из массива
  return products.map(item => {
    // Создаем новую карточку только в том случае, если у товара стоит отметка isActive === true
    if (item.isActive) {
      // Создаем новый div элемент
      const div = createNode("div")
      // Редактируем имя файла, добавля к нему необходимые данные перед расширением
      const changeImageName = item => {
        let imgName = item.primaryImageUrl.slice(0, item.primaryImageUrl.lastIndexOf("."))
        let imgExt = item.primaryImageUrl.slice(item.primaryImageUrl.lastIndexOf("."))
        return `${imgName}_220x220_1${imgExt}`
      }
      // Код товара, приведенный к типу Number, что автоматически отсекает все лишние нули в начале кода
      const code = +item.code
      // Расчет стоимости товара за бонусы. На сайте ТД "Петрович" узнал, что один рубль равен 4 бонусным баллам, поэтому делим на 4
      const bonusPrice = item.priceGold / 4
      // Создаем ссылки из наименований сопутствующих товаров
      const createLinks = item => {
        // По шаблону регулярного выражения разбиваем строку на элементы массива
        // Далее отфильтровываем пустые строки, следом в цикле смотрим есть ли повторяющиеся позиции, создаем массив из уникальных строк
        // Потом создаем ссылки в теге <a> и записываем их в строку, которую возвращаем из функции
        const reg = /[.;\n]/
        let arrOfLinks = []
        let strOfLinks = ""
        let assoc = item.assocProducts.split(reg)
        assoc = assoc.filter(el => el !== "")
        for (let i of assoc) {
          let str = i.toLowerCase()
          if (!arrOfLinks.includes(str)) arrOfLinks.push(str)
        }
        arrOfLinks.forEach((item, index) => {
          let comma = ","
          if (index === arrOfLinks.length - 1) comma = "."
          strOfLinks += `<a href="#" class="url--link">${item}${comma}</a> `
        })
        return strOfLinks;
      }
      // Создаем HTML разметку, куда подставляем все необходимые данные и атрибуты  str += `<a href="#" class="url--link">${items[i]}${comma}</a> `
      div.innerHTML = `
      <div class="products_page">      
        <div class="product product_horizontal">                                
            <span class="product_code">Код: ${code}</span>
            <div class="product_status_tooltip_container">
                <span class="product_status">Наличие</span>
            </div>                                
            <div class="product_photo">
                <a href="#" class="url--link product__link">
                    <img src="${changeImageName(item)}" alt="Image">
                </a>                                    
            </div>
            <div class="product_description">
                <a href="#" class="product__link">${item.title}</a>
            </div>
            <div class="product_tags">
                <p>Могут понадобиться:</p>
                ${createLinks(item)}                
            </div>
            <div class="product_units">
                <div class="unit--wrapper pack">
                    <div class="unit--select unit--active">
                        <p>За м. кв.</p>
                    </div>
                    <div class="unit--select">
                        <p>За упаковку</p>
                    </div>
                </div>
            </div>
            <p class="product_price_club_card">
                <span class="product_price_club_card_text">По карте<br>клуба</span>
                <span class="goldPrice">${item.priceGoldAlt.toFixed(2)}</span>
                <span class="rouble__i black__i">
                    <svg version="1.0" id="rouble__b" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_black"></use>
                    </svg>
                 </span>
            </p>
            <p class="product_price_default">
                <span class="retailPrice">${item.priceRetailAlt.toFixed(2)}</span>
                <span class="rouble__i black__i">
                    <svg version="1.0" id="rouble__g" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_gray"></use>
                    </svg>
                 </span>
            </p>
            <div class="product_price_points">
                <p class="ng-binding">Можно купить за ${bonusPrice.toFixed(2)} балла</p>
            </div>
            <div class="list--unit-padd"></div>
            <div class="list--unit-desc">
                <div class="unit--info">
                    <div class="unit--desc-i"></div>
                    <div class="unit--desc-t">
                        <p>
                            <span>Продается упаковками:</span>
                            <span class="unit--infoInn">${item.unitRatio} ${item.unit} = ${item.unitRatioAlt.toFixed(2)} ${item.unitAlt} </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="product__wrapper">
                <div class="product_count_wrapper">
                    <div class="stepper">
                        <input class="product__count stepper-input" type="number" min="1" value="1">
                        <span class="stepper-arrow up"></span>
                        <span class="stepper-arrow down"></span>                                            
                    </div>
                </div>
                <span class="btn btn_cart" data-url="/cart/" data-product-id="${item.productId}">
                    <svg class="ic ic_cart">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart"></use>
                    </svg>
                    <span>В корзину</span>
                </span>
            </div>
        </div>
      </div>`
      // Добавляем разметку к нашему основному элементу
      append(productCard, div)
    }
  })
}

function addEvents(products) {
  // Получаем NodeList'ы нужных элементов, для применения к ним обработчиков
  const pack = document.querySelectorAll(".pack")
  const gold = document.querySelectorAll(".goldPrice")
  const retail = document.querySelectorAll(".retailPrice")
  const stepper = document.querySelectorAll(".stepper")
  const calcPack = document.querySelectorAll(".unit--infoInn")

  for (let i = 0; i < pack.length; i += 1) {
    pack[i].addEventListener("click", () => {
      pack[i].children[0].classList.toggle("unit--active")
      pack[i].children[1].classList.toggle("unit--active")
      // Меняем классы по клику у элементов для отображения вариантов цены (за упаковку или м. кв.)
      // Подставляем соответсвующие данные, округляя до двух знаков после запятой
      if (pack[i].children[0].classList.contains("unit--active")) {
        gold[i].innerHTML = `${products[i].priceGoldAlt.toFixed(2)}`
        retail[i].innerHTML = `${products[i].priceRetailAlt.toFixed(2)}`
      } else {
        gold[i].innerHTML = `${products[i].priceGold}`
        retail[i].innerHTML = `${products[i].priceRetail}`
      }
    })

    // Следим за нажатиями кнопок выбора количества и рассчитывем объем
    stepper[i].addEventListener("click", event => {
      if (event.target.classList.contains("up")) {
        let counter = parseInt(stepper[i].children[0].value)
        counter += 1
        stepper[i].children[0].value = counter
        calcPack[i].innerHTML = `${counter} ${products[i].unit} = ${(
          products[i].unitRatioAlt * counter
        ).toFixed(2)} ${products[i].unitAlt}`
      }
      if (event.target.classList.contains("down")) {
        let counter = parseInt(stepper[i].children[0].value)
        counter > 1 ? (counter -= 1) : counter
        stepper[i].children[0].value = counter
        calcPack[i].innerHTML = `${counter} ${products[i].unit} = ${(
          products[i].unitRatioAlt * counter
        ).toFixed(2)} ${products[i].unitAlt}`
      }
    })
  }
}
